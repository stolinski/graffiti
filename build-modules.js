/**
 * build-modules.js
 * Splits src/lib/drop-in.css into modular CSS exports for @drop-in/graffiti.
 *
 * Outputs:
 *   dist/index.css       - Full file with @layer declarations (main export)
 *   dist/index.min.css   - Deterministically minified layered full file
 *   dist/drop-in.css     - Full file with @layer wrappers stripped (flat version)
 *   dist/drop-in.min.css - Deterministically minified flat full file
 *   dist/raw.js          - Compatibility JS string export of dist/index.css
 *   dist/core.css        - Base layer + global safety rules
 *   dist/components.css  - Layered core vars + components + global safety rules
 *   dist/layouts.css     - Layered core vars + layouts + global safety rules
 *   dist/utilities.css   - Layered core vars + utilities + global safety rules
 *   dist/minimal.css     - Base + utilities + global safety rules
 *   dist/standard.css    - Base + utilities + layouts + global safety rules
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { generate, parse, tokenize, tokenTypes, walk } from "css-tree";

import { minifyCss } from "./scripts/css-metrics.mjs";
import { extractCssModules } from "./scripts/module-builder-ast.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DIST = join(__dirname, "dist");
const SOURCE = join(__dirname, "src", "lib", "drop-in.css");
const SOURCE_LABEL = "src/lib/drop-in.css";
const REGISTRY_SOURCE = join(__dirname, "src", "lib", "registry.json");
const LOOKUP_SOURCE = join(__dirname, "scripts", "graffiti-lookup.mjs");
const THEMES_SOURCE = join(__dirname, "src", "lib", "themes");
const THEMES_DIST = join(DIST, "themes");
const THEME_NAMES = [
  "editorial",
  "paper",
  "system",
  "neon-arcade",
  "soft-consumer",
  "studio",
  "signal",
  "lumen",
  "schematic",
];

// Ensure dist/ exists
if (!existsSync(DIST)) {
  mkdirSync(DIST, { recursive: true });
}
if (!existsSync(THEMES_DIST)) {
  mkdirSync(THEMES_DIST, { recursive: true });
}

const extracted = extractCssModules(
  readFileSync(SOURCE, "utf-8"),
  SOURCE_LABEL,
);
const {
  canonicalRoot,
  conditionalRootAtRules,
  flatSource,
  globalSafetyTail,
  layerOrder,
  layers,
  reducedMotionProperty,
  source,
} = extracted;
const { base, components, layouts, utilities } = layers;

// ── Helpers ──────────────────────────────────────────────────────────

function wrapLayer(layerName, css) {
  return `@layer ${layerName} {\n${css.trim()}\n}`;
}

function writeCssStringModule(outputPath, css, sourceName) {
  writeFileSync(
    outputPath,
    `// Auto-generated from ${sourceName}\nexport default ${JSON.stringify(css)};\n`,
  );
}

function parseCss(css, sourceName) {
  try {
    return parse(css, {
      filename: sourceName,
      parseCustomProperty: true,
      positions: true,
    });
  } catch (error) {
    throw new Error(`Failed to parse ${sourceName}`, { cause: error });
  }
}

function collectVarReferences(node) {
  const references = [];

  walk(node, {
    enter(currentNode) {
      if (currentNode.type === "Raw") {
        references.push(...collectRawVarReferences(currentNode.value));
        return;
      }
      if (currentNode.type !== "Function" || currentNode.name !== "var") {
        return;
      }

      const children = currentNode.children.toArray();
      const token = children[0];
      if (token?.type !== "Identifier" || !token.name.startsWith("--")) return;

      references.push({
        name: token.name,
        hasFallback: children.some(
          (child) => child.type === "Operator" && child.value === ",",
        ),
      });
    },
  });

  return references;
}

function collectRawVarReferences(css) {
  const references = [];
  const functionStack = [];

  tokenize(css, (type, start, end) => {
    const value = css.slice(start, end);

    if (type === tokenTypes.Function) {
      functionStack.push({
        isVar: value.toLowerCase() === "var(",
        name: null,
        hasFallback: false,
      });
      return;
    }
    if (type === tokenTypes.LeftParenthesis) {
      functionStack.push(null);
      return;
    }
    if (type === tokenTypes.RightParenthesis) {
      const functionState = functionStack.pop();
      if (functionState?.isVar && functionState.name) {
        references.push({
          name: functionState.name,
          hasFallback: functionState.hasFallback,
        });
      }
      return;
    }

    const functionState = functionStack.at(-1);
    if (!functionState?.isVar) return;
    if (
      type === tokenTypes.Ident &&
      functionState.name === null &&
      value.startsWith("--")
    ) {
      functionState.name = value;
    } else if (type === tokenTypes.Comma) {
      functionState.hasFallback = true;
    }
  });

  return references;
}

function collectRawDeclarations(css) {
  const declarations = new Set();
  let candidate = null;

  tokenize(css, (type, start, end) => {
    if (type === tokenTypes.WhiteSpace || type === tokenTypes.Comment) return;

    const value = css.slice(start, end);
    if (type === tokenTypes.Ident && value.startsWith("--")) {
      candidate = value;
      return;
    }
    if (type === tokenTypes.Colon && candidate) declarations.add(candidate);
    candidate = null;
  });

  return declarations;
}

function collectCanonicalTokens(rootRule) {
  const tokens = new Map();
  for (const node of rootRule.block.children) {
    if (node.type !== "Declaration" || !node.property.startsWith("--")) {
      continue;
    }
    if (tokens.has(node.property)) {
      throw new Error(
        `Canonical :root token ${node.property} is declared more than once at line ${node.loc.start.line}`,
      );
    }

    const dependencies = collectVarReferences(node.value)
      .filter((reference) => !reference.hasFallback)
      .map((reference) => reference.name);
    tokens.set(node.property, { declaration: node, dependencies });
  }

  for (const [token, { dependencies }] of tokens) {
    const unknownDependencies = dependencies.filter(
      (dependency) => !tokens.has(dependency),
    );
    if (unknownDependencies.length > 0) {
      throw new Error(
        `Canonical token ${token} references unknown token(s): ${unknownDependencies.join(", ")}`,
      );
    }
  }

  assertAcyclicTokenGraph(tokens);
  return tokens;
}

function assertAcyclicTokenGraph(tokens) {
  const visited = new Set();
  const active = new Set();
  const path = [];

  function visit(token) {
    if (active.has(token)) {
      const cycleStart = path.indexOf(token);
      throw new Error(
        `Canonical token dependency cycle: ${[...path.slice(cycleStart), token].join(" -> ")}`,
      );
    }
    if (visited.has(token)) return;

    active.add(token);
    path.push(token);
    for (const dependency of tokens.get(token).dependencies) {
      visit(dependency);
    }
    path.pop();
    active.delete(token);
    visited.add(token);
  }

  for (const token of tokens.keys()) visit(token);
}

function buildTokenDependencyPreamble(
  css,
  entryName,
  canonicalTokens,
  propertyRegistrations = "",
  conditionalAtRules = [],
) {
  const ast = parseCss(`${propertyRegistrations}\n${css}`, entryName);
  const declaredTokens = new Set();

  walk(ast, {
    enter(node) {
      if (node.type === "Raw") {
        for (const token of collectRawDeclarations(node.value)) {
          declaredTokens.add(token);
        }
        return;
      }
      if (node.type === "Declaration" && node.property.startsWith("--")) {
        declaredTokens.add(node.property);
      }
      if (node.type === "Atrule" && node.name === "property" && node.prelude) {
        declaredTokens.add(generate(node.prelude));
      }
    },
  });

  const requiredTokens = new Set(
    [...canonicalTokens.keys()].filter((token) => token.startsWith("--safe-")),
  );
  const unknownTokens = new Set();
  for (const reference of collectVarReferences(ast)) {
    if (reference.hasFallback) continue;
    if (canonicalTokens.has(reference.name)) {
      requiredTokens.add(reference.name);
    } else if (!declaredTokens.has(reference.name)) {
      unknownTokens.add(reference.name);
    }
  }

  if (unknownTokens.size > 0) {
    throw new Error(
      `${entryName} references unknown token(s) without fallbacks: ${[...unknownTokens].sort().join(", ")}`,
    );
  }

  const closure = new Set();
  function addDependencies(token) {
    if (closure.has(token)) return;
    closure.add(token);
    for (const dependency of canonicalTokens.get(token).dependencies) {
      addDependencies(dependency);
    }
  }
  for (const token of requiredTokens) addDependencies(token);

  const declarations = [...canonicalTokens]
    .filter(([token]) => closure.has(token))
    .map(([, { declaration }]) => `  ${generate(declaration)};`);

  const registrations = propertyRegistrations
    ? `${propertyRegistrations}\n\n`
    : "";
  const nestedRules = conditionalAtRules.map((rule) => `  ${rule}`).join("\n");
  const nestedRulesBlock = nestedRules ? `\n${nestedRules}` : "";
  return `${registrations}/* Canonical token dependency closure for standalone use */\n:root {\n${declarations.join("\n")}\n  color-scheme: light dark;${nestedRulesBlock}\n}`;
}

const canonicalTokens = collectCanonicalTokens(canonicalRoot);
const componentsBase = wrapLayer(
  "base",
  buildTokenDependencyPreamble(
    `${components.wrapped}\n${globalSafetyTail}`,
    "components.css",
    canonicalTokens,
    reducedMotionProperty,
    conditionalRootAtRules,
  ),
);
const layoutsBase = wrapLayer(
  "base",
  buildTokenDependencyPreamble(
    `${layouts.wrapped}\n${globalSafetyTail}`,
    "layouts.css",
    canonicalTokens,
    reducedMotionProperty,
    conditionalRootAtRules,
  ),
);
const utilitiesBase = wrapLayer(
  "base",
  buildTokenDependencyPreamble(
    `${utilities.wrapped}\n${globalSafetyTail}`,
    "utilities.css",
    canonicalTokens,
    reducedMotionProperty,
    conditionalRootAtRules,
  ),
);

function buildLayeredBundle(header, layers) {
  return (
    [header.trim(), layerOrder, ...layers, globalSafetyTail].join("\n\n") + "\n"
  );
}

// ── Build outputs ────────────────────────────────────────────────────

// index.css - Full source with layers (main export)
writeFileSync(join(DIST, "index.css"), source);
console.log("  dist/index.css");
writeFileSync(join(DIST, "index.min.css"), minifyCss(source, SOURCE_LABEL));
console.log("  dist/index.min.css");
writeCssStringModule(join(DIST, "raw.js"), source, SOURCE_LABEL);
console.log("  dist/raw.js");

// drop-in.css - Flat version without @layer wrappers
writeFileSync(join(DIST, "drop-in.css"), flatSource);
console.log("  dist/drop-in.css");
writeFileSync(
  join(DIST, "drop-in.min.css"),
  minifyCss(flatSource, "dist/drop-in.css"),
);
console.log("  dist/drop-in.min.css");

// core.css - Base layer plus global accessibility and print rules
const coreHeader = `/* @drop-in/graffiti/core */\n/* Core CSS - Variables, reset, typography */\n\n`;
writeFileSync(
  join(DIST, "core.css"),
  buildLayeredBundle(coreHeader, [base.wrapped]),
);
console.log("  dist/core.css");

// components.css - Layered core vars + full components layer
const componentsHeader = `/* @drop-in/graffiti/components */\n/* Auto-generated - do not edit directly */\n`;
writeFileSync(
  join(DIST, "components.css"),
  buildLayeredBundle(componentsHeader, [componentsBase, components.wrapped]),
);
console.log("  dist/components.css");

// layouts.css - Layered core vars + full layouts layer
const layoutsHeader = `/* @drop-in/graffiti/layouts */\n/* Auto-generated - do not edit directly */\n`;
writeFileSync(
  join(DIST, "layouts.css"),
  buildLayeredBundle(layoutsHeader, [layoutsBase, layouts.wrapped]),
);
console.log("  dist/layouts.css");

// utilities.css - Layered core vars + full utilities layer
const utilitiesHeader = `/* @drop-in/graffiti/utilities */\n/* Auto-generated - do not edit directly */\n`;
writeFileSync(
  join(DIST, "utilities.css"),
  buildLayeredBundle(utilitiesHeader, [utilitiesBase, utilities.wrapped]),
);
console.log("  dist/utilities.css");

// minimal.css - Core + utilities (no components, no layouts)
const minimalHeader = `/* @drop-in/graffiti/minimal */\n/* Minimal bundle - core + utilities */\n\n`;
writeFileSync(
  join(DIST, "minimal.css"),
  buildLayeredBundle(minimalHeader, [base.wrapped, utilities.wrapped]),
);
console.log("  dist/minimal.css");

// standard.css - Core + utilities + layouts (no components)
const standardHeader = `/* @drop-in/graffiti/standard */\n/* Standard bundle - core + utilities + layouts */\n\n`;
writeFileSync(
  join(DIST, "standard.css"),
  buildLayeredBundle(standardHeader, [
    base.wrapped,
    utilities.wrapped,
    layouts.wrapped,
  ]),
);
console.log("  dist/standard.css");

// themes/* - Copy each preset and the index, plus emit raw JS modules.
for (const name of THEME_NAMES) {
  const srcPath = join(THEMES_SOURCE, `${name}.css`);
  if (!existsSync(srcPath)) {
    console.warn(`  Warning: themes/${name}.css not found, skipping`);
    continue;
  }
  const css = readFileSync(srcPath, "utf-8");
  writeFileSync(join(THEMES_DIST, `${name}.css`), css);
  writeCssStringModule(
    join(THEMES_DIST, `${name}-raw.js`),
    css,
    `src/lib/themes/${name}.css`,
  );
  console.log(`  dist/themes/${name}.css`);
}
const themesIndexSource = join(THEMES_SOURCE, "index.css");
if (existsSync(themesIndexSource)) {
  writeFileSync(
    join(THEMES_DIST, "index.css"),
    readFileSync(themesIndexSource, "utf-8"),
  );
  console.log("  dist/themes/index.css");
}

// registry.json - Copy the canonical catalogue so it ships with the package
// (consumed by `graffiti-lookup` and the `./registry` export).
if (existsSync(REGISTRY_SOURCE)) {
  writeFileSync(
    join(DIST, "registry.json"),
    readFileSync(REGISTRY_SOURCE, "utf-8"),
  );
  console.log("  dist/registry.json");
} else {
  console.warn(
    "  Warning: src/lib/registry.json not found, skipping. Run `node scripts/graffiti-lint.mjs` first.",
  );
}

// graffiti-lookup.mjs - Ship the lookup CLI standalone (node builtins only,
// no runtime deps). bin.graffiti-lookup points at this dist copy; it resolves
// the sibling dist/registry.json.
if (existsSync(LOOKUP_SOURCE)) {
  writeFileSync(
    join(DIST, "graffiti-lookup.mjs"),
    readFileSync(LOOKUP_SOURCE, "utf-8"),
  );
  console.log("  dist/graffiti-lookup.mjs");
} else {
  console.warn("  Warning: scripts/graffiti-lookup.mjs not found, skipping");
}

console.log("\nBuild complete!");
