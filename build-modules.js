/**
 * build-modules.js
 * Splits src/lib/drop-in.css into modular CSS exports for @drop-in/graffiti.
 *
 * Outputs:
 *   dist/index.css       - Full file with @layer declarations (main export)
 *   dist/drop-in.css     - Full file with @layer wrappers stripped (flat version)
 *   dist/core.css        - @layer base content only (variables, reset, typography)
 *   dist/components.css  - Core vars preamble + @layer components block
 *   dist/layouts.css     - Core vars preamble + @layer layouts block
 *   dist/utilities.css   - Core vars preamble + @layer utilities block
 *   dist/minimal.css     - Core + @layer utilities
 *   dist/standard.css    - Core + @layer utilities + @layer layouts
 *   dist/decks.css       - Copy of src/lib/decks.css
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "dist");
const SOURCE = join(__dirname, "src", "lib", "drop-in.css");
const DECKS_SOURCE = join(__dirname, "src", "lib", "decks.css");

// Ensure dist/ exists
if (!existsSync(DIST)) {
  mkdirSync(DIST, { recursive: true });
}

const source = readFileSync(SOURCE, "utf-8");

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Extract the content of a named @layer block, including the wrapper.
 * Returns { wrapped, inner } where wrapped keeps `@layer name { ... }`
 * and inner is just the content between the braces.
 */
function extractLayer(css, layerName) {
  const startMarker = `@layer ${layerName} {`;
  const endMarker = `} /* END @layer ${layerName} */`;

  const startIdx = css.indexOf(startMarker);
  if (startIdx === -1) {
    console.warn(`Warning: @layer ${layerName} not found in source`);
    return { wrapped: "", inner: "" };
  }

  const endIdx = css.indexOf(endMarker, startIdx);
  if (endIdx === -1) {
    console.warn(`Warning: END marker for @layer ${layerName} not found`);
    return { wrapped: "", inner: "" };
  }

  const wrapped = css.slice(startIdx, endIdx + endMarker.length);
  const inner = css
    .slice(startIdx + startMarker.length, endIdx)
    .replace(/^\n/, "");

  return { wrapped, inner };
}

/**
 * Build a minimal set of CSS custom properties for standalone module use.
 * Extracted from the base layer's :root block.
 */
function buildCoreVarsPreamble(baseInner) {
  // Extract key variable groups from the base layer
  const vars = [];

  // Colors
  vars.push("  /* Colors - Theme aware */");
  for (const match of baseInner.matchAll(
    /--(fg-light|fg-dark|fg|fg-\d+|fg-0\d):\s*[^;]+;/g,
  )) {
    vars.push(`  ${match[0]}`);
  }
  vars.push("  ");
  for (const match of baseInner.matchAll(
    /--(bg-light|bg-dark|bg):\s*[^;]+;/g,
  )) {
    vars.push(`  ${match[0]}`);
  }

  // Semantic colors
  vars.push("  ");
  vars.push("  /* Semantic colors */");
  for (const match of baseInner.matchAll(
    /--(primary|error|warning|success):\s*[^;]+;/g,
  )) {
    vars.push(`  ${match[0]}`);
  }

  // Spacing
  vars.push("  ");
  vars.push("  /* Spacing */");
  for (const match of baseInner.matchAll(/--vs-[a-z]+:\s*[^;]+;/g)) {
    vars.push(`  ${match[0]}`);
  }

  // Border radius
  vars.push("  ");
  vars.push("  /* Border radius */");
  for (const match of baseInner.matchAll(/--br-[a-z]+:\s*[^;]+;/g)) {
    vars.push(`  ${match[0]}`);
  }

  // Padding
  vars.push("  ");
  vars.push("  /* Padding */");
  for (const match of baseInner.matchAll(/--pad-[a-z]+:\s*[^;]+;/g)) {
    vars.push(`  ${match[0]}`);
  }

  // Line height
  vars.push("  ");
  vars.push("  /* Line height */");
  for (const match of baseInner.matchAll(/--lh:\s*[^;]+;/g)) {
    vars.push(`  ${match[0]}`);
  }

  // Borders
  vars.push("  ");
  vars.push("  /* Borders */");
  for (const match of baseInner.matchAll(/--border-[a-z0-9]+:\s*[^;]+;/g)) {
    vars.push(`  ${match[0]}`);
  }

  // Focus ring
  vars.push("  ");
  vars.push("  /* Focus ring */");
  for (const match of baseInner.matchAll(/--focus-ring[a-z-]*:\s*[^;]+;/g)) {
    vars.push(`  ${match[0]}`);
  }

  // Shadows
  vars.push("  ");
  vars.push("  /* Shadows */");
  for (const match of baseInner.matchAll(/--shadow-[0-9]+:\s*[^;]+;/g)) {
    vars.push(`  ${match[0]}`);
  }

  // Easing
  vars.push("  ");
  vars.push("  /* Easing */");
  for (const match of baseInner.matchAll(/--ease-[a-z]+:\s*[^;]+;/g)) {
    vars.push(`  ${match[0]}`);
  }

  // Safe areas
  vars.push("  ");
  vars.push("  /* Safe areas */");
  for (const match of baseInner.matchAll(/--safe-[a-z]+:\s*[^;]+;/g)) {
    vars.push(`  ${match[0]}`);
  }

  // Transition properties
  vars.push("  ");
  vars.push("  /* Transition properties */");
  for (const match of baseInner.matchAll(
    /--transition-properties:\s*[^;]+;/g,
  )) {
    vars.push(`  ${match[0]}`);
  }

  // Layout gap
  vars.push("  ");
  vars.push("  /* Layout gap */");
  for (const match of baseInner.matchAll(/--layout-gap:\s*[^;]+;/g)) {
    vars.push(`  ${match[0]}`);
  }

  // Color scheme
  vars.push("  ");
  vars.push("  /* Color scheme */");
  vars.push("  color-scheme: light dark;");

  // Dark mode shadow overrides
  const darkShadows = baseInner.match(
    /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{[^}]*:root\s*\{[^}]*\}\s*\}/s,
  );

  let result = `\n/* Core CSS Variables - Minimal set for standalone use */\n:root {\n${vars.join("\n")}\n}\n`;
  if (darkShadows) {
    result += `\n/* Dark mode shadow overrides */\n${darkShadows[0]}\n`;
  }

  return result;
}

/**
 * Strip @layer wrappers from CSS, keeping inner content.
 * Also removes the @layer declaration line.
 */
function stripLayers(css) {
  // Remove the @layer declaration line
  let result = css.replace(/^@layer\s+[^;]+;\s*\n?/m, "");

  // Remove @layer name { and matching } /* END @layer name */
  result = result.replace(/@layer\s+\w+\s*\{\n?/g, "");
  result = result.replace(/\}\s*\/\*\s*END @layer \w+\s*\*\/\n?/g, "");

  // Clean up extra blank lines
  result = result.replace(/\n{3,}/g, "\n\n");

  return result.trim() + "\n";
}

// ── Extract layers ───────────────────────────────────────────────────

const base = extractLayer(source, "base");
const components = extractLayer(source, "components");
const layouts = extractLayer(source, "layouts");
const utilities = extractLayer(source, "utilities");

const coreVarsPreamble = buildCoreVarsPreamble(base.inner);

// ── Build outputs ────────────────────────────────────────────────────

// index.css - Full source with layers (main export)
writeFileSync(join(DIST, "index.css"), source);
console.log("  dist/index.css");

// drop-in.css - Flat version without @layer wrappers
writeFileSync(join(DIST, "drop-in.css"), stripLayers(source));
console.log("  dist/drop-in.css");

// core.css - Base layer content only (unwrapped)
const coreHeader = `/* @drop-in/graffiti/core */\n/* Core CSS - Variables, reset, typography */\n\n`;
writeFileSync(join(DIST, "core.css"), coreHeader + base.inner);
console.log("  dist/core.css");

// components.css - Core vars + full components layer
const componentsHeader = `/* @drop-in/graffiti/components */\n/* Auto-generated - do not edit directly */\n`;
writeFileSync(
  join(DIST, "components.css"),
  componentsHeader + coreVarsPreamble + "\n" + components.wrapped + "\n",
);
console.log("  dist/components.css");

// layouts.css - Core vars + full layouts layer
const layoutsHeader = `/* @drop-in/graffiti/layouts */\n/* Auto-generated - do not edit directly */\n`;
writeFileSync(
  join(DIST, "layouts.css"),
  layoutsHeader + coreVarsPreamble + "\n" + layouts.wrapped + "\n",
);
console.log("  dist/layouts.css");

// utilities.css - Core vars + full utilities layer
const utilitiesHeader = `/* @drop-in/graffiti/utilities */\n/* Auto-generated - do not edit directly */\n`;
writeFileSync(
  join(DIST, "utilities.css"),
  utilitiesHeader + coreVarsPreamble + "\n" + utilities.wrapped + "\n",
);
console.log("  dist/utilities.css");

// minimal.css - Core + utilities (no components, no layouts)
const minimalHeader = `/* @drop-in/graffiti/minimal */\n/* Minimal bundle - core + utilities */\n\n`;
writeFileSync(
  join(DIST, "minimal.css"),
  minimalHeader + base.inner + "\n" + utilities.wrapped + "\n",
);
console.log("  dist/minimal.css");

// standard.css - Core + utilities + layouts (no components)
const standardHeader = `/* @drop-in/graffiti/standard */\n/* Standard bundle - core + utilities + layouts */\n\n`;
writeFileSync(
  join(DIST, "standard.css"),
  standardHeader +
    base.inner +
    "\n" +
    utilities.wrapped +
    "\n\n" +
    layouts.wrapped +
    "\n",
);
console.log("  dist/standard.css");

// decks.css - Copy from source
if (existsSync(DECKS_SOURCE)) {
  writeFileSync(join(DIST, "decks.css"), readFileSync(DECKS_SOURCE, "utf-8"));
  console.log("  dist/decks.css");
} else {
  console.warn("  Warning: src/lib/decks.css not found, skipping decks.css");
}

console.log("\nBuild complete!");
