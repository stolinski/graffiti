import { readdir } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  DIST_FILES,
  getCssDeclarations,
  getCssImports,
  getCssRules,
  getCssVariableContract,
  normalizeCss,
  readDistCss,
  readWorkspaceFile,
} from "./helpers";

const SOURCE_MAIN = "src/lib/drop-in.css";
const SOURCE_THEMES_DIR = "src/lib/themes";
const DIST_THEMES_DIR = "dist/themes";
const FORCED_COLOR_IDENTIFIERS = new Set([
  "Canvas",
  "CanvasText",
  "GrayText",
  "LinkText",
  "Mark",
]);
const GLOBAL_TAIL_DIST_FILES = [
  DIST_FILES.index,
  DIST_FILES.flat,
  DIST_FILES.core,
  DIST_FILES.components,
  DIST_FILES.utilities,
  DIST_FILES.layouts,
  DIST_FILES.minimal,
  DIST_FILES.standard,
];

interface CssEntry {
  name: string;
  css: string;
}

interface RegistryFile {
  patterns: { name: string; canonicalSelector: string }[];
  patternGroups: { members: string[] }[];
}

describe("executable CSS API", () => {
  it("parses every nonempty source and generated CSS entry", async () => {
    const entries = [
      ...(await readSourceEntries()),
      ...(await readDistEntries()),
    ];

    for (const entry of entries) {
      expect(
        entry.css.trim().length,
        `${entry.name} must not be empty`,
      ).toBeGreaterThan(0);
      expect(
        normalizeCss(entry.css, entry.name).length,
        `${entry.name} must produce a nonempty CSS AST`,
      ).toBeGreaterThan(0);
    }
  });

  it("keeps forced-color token overrides inside forced-colors media", async () => {
    const entries = [
      ...(await readSourceEntries()),
      ...(await readDistEntries()),
    ];

    for (const entry of entries) {
      const leaks = getCssDeclarations(entry.css, entry.name)
        .filter(
          (declaration) =>
            declaration.property.startsWith("--") &&
            [...declaration.identifiers].some((identifier) =>
              FORCED_COLOR_IDENTIFIERS.has(identifier),
            ) &&
            !declaration.atRules.some(
              (atRule) =>
                atRule.name === "media" &&
                atRule.prelude === "(forced-colors:active)",
            ),
        )
        .map(
          (declaration) =>
            `${declaration.selector ?? "@rule"} { ${declaration.property}: ${declaration.value} }`,
        );

      expect(leaks, `${entry.name} leaks forced-color token values`).toEqual(
        [],
      );
    }
  });

  it("resolves required custom-property dependencies for every public entry", async () => {
    const defaultBundle = await readDistCss(DIST_FILES.index);
    const themeNames = await readThemeNames(SOURCE_THEMES_DIR);
    const allThemes = await Promise.all(
      themeNames.map((name) => readDistCss(`themes/${name}.css`)),
    );
    const entries = await readDistEntries();

    for (const entry of entries) {
      const css = entry.name.endsWith("themes/index.css")
        ? [defaultBundle, ...allThemes].join("\n")
        : entry.name.includes("themes/")
          ? `${defaultBundle}\n${entry.css}`
          : entry.css;
      const contract = getCssVariableContract(css, entry.name);
      const unresolved = contract.references
        .filter(
          (reference) =>
            !reference.hasFallback &&
            !contract.definitions.has(reference.variable),
        )
        .map(
          (reference) => `${reference.property} -> var(${reference.variable})`,
        );

      expect(
        [...new Set(unresolved)].sort(),
        `${entry.name} has unresolved required custom properties`,
      ).toEqual([]);
    }
  });

  it("keeps an explicit reduced-motion decision beside every authored animation", async () => {
    const entries = [
      ...(await readSourceEntries()),
      ...(await readDistEntries()),
    ];

    for (const entry of entries) {
      const missingDecisions = getCssRules(entry.css, entry.name)
        .filter((rule) => {
          const animation = rule.declarations.get("animation");

          return (
            animation !== undefined &&
            animation !== "var(--animation-reduced)" &&
            !rule.declarations.has("--animation-reduced")
          );
        })
        .map((rule) => rule.selector);

      expect(
        missingDecisions,
        `${entry.name} has animations without reduced-motion decisions`,
      ).toEqual([]);
    }
  });

  it("ships one parsed reduced-motion and print tail in every full or layered entry", async () => {
    for (const fileName of GLOBAL_TAIL_DIST_FILES) {
      const css = await readDistCss(fileName);
      const rules = getCssRules(css, fileName);
      const reducedMotionRules = rules.filter(
        (rule) =>
          rule.layer === null &&
          rule.declarations.get("animation") === "var(--animation-reduced)" &&
          rule.atRules.some(
            (atRule) =>
              atRule.name === "media" &&
              atRule.prelude === "(prefers-reduced-motion:reduce)",
          ),
      );
      const printRules = rules.filter(
        (rule) =>
          rule.layer === null &&
          rule.selectors.includes(".no-print") &&
          rule.declarations.get("display") === "none" &&
          rule.atRules.some(
            (atRule) => atRule.name === "media" && atRule.prelude === "print",
          ),
      );

      expect(
        reducedMotionRules,
        `${fileName} reduced-motion tail`,
      ).toHaveLength(1);
      expect(printRules, `${fileName} print tail`).toHaveLength(1);
    }
  });

  it("keeps canonical source and generated mirrors semantically identical", async () => {
    const themeNames = await readThemeNames(SOURCE_THEMES_DIR);
    const pairs = [
      [SOURCE_MAIN, DIST_FILES.index],
      [`${SOURCE_THEMES_DIR}/index.css`, "themes/index.css"],
      ...themeNames.map(
        (name) =>
          [`${SOURCE_THEMES_DIR}/${name}.css`, `themes/${name}.css`] as const,
      ),
    ] as const;

    for (const [sourceName, distName] of pairs) {
      const source = await readWorkspaceFile(sourceName);
      const dist = await readDistCss(distName);

      expect(
        normalizeCss(dist, distName),
        `${distName} drifted from source`,
      ).toBe(normalizeCss(source, sourceName));
    }

  });

  it("keeps the generated theme-scope mirror value-identical to root scales", async () => {
    const css = await readWorkspaceFile(SOURCE_MAIN);
    const rules = getCssRules(css, SOURCE_MAIN);
    const rootValues = new Map<string, Set<string>>();

    for (const rule of rules.filter((candidate) =>
      candidate.selectors.includes(":root"),
    )) {
      for (const [property, value] of rule.declarations) {
        const values = rootValues.get(property) ?? new Set<string>();
        values.add(value);
        rootValues.set(property, values);
      }
    }

    const themeScope = rules.find((rule) =>
      rule.selectors.includes(':where([class*="theme-"])'),
    );
    expect(themeScope).toBeDefined();

    const drift = [...(themeScope?.declarations ?? [])]
      .filter(
        ([property, value]) =>
          property.startsWith("--") && !rootValues.get(property)?.has(value),
      )
      .map(([property]) => property);

    expect(drift).toEqual([]);
  });

  it("keeps theme files, imports, exports, selectors, docs, and dist in one catalogue", async () => {
    const sourceNames = await readThemeNames(SOURCE_THEMES_DIR);
    const distNames = await readThemeNames(DIST_THEMES_DIR);
    const packageNames = await readPackageThemeNames();
    const indexCss = await readWorkspaceFile(`${SOURCE_THEMES_DIR}/index.css`);
    const importNames = getCssImports(
      indexCss,
      `${SOURCE_THEMES_DIR}/index.css`,
    )
      .map((fileName) => path.basename(fileName, ".css"))
      .sort();
    const controls = await readWorkspaceFile("src/docs/ThemeControls.svelte");
    const controlNames = [
      ...controls.matchAll(/class_name:\s*"theme-([^"]+)"/g),
    ]
      .map((match) => match[1])
      .sort();

    expect(packageNames).toEqual(sourceNames);
    expect(importNames).toEqual(sourceNames);
    expect(controlNames).toEqual(sourceNames);
    expect(distNames).toEqual(sourceNames);

    for (const name of sourceNames) {
      const css = await readWorkspaceFile(`${SOURCE_THEMES_DIR}/${name}.css`);
      const themeRules = getCssRules(
        css,
        `${SOURCE_THEMES_DIR}/${name}.css`,
      ).filter((rule) => rule.classNames.has(`theme-${name}`));
      const primaryRules = themeRules.filter((rule) =>
        rule.selectors.includes(`.theme-${name}`),
      );

      expect(
        primaryRules.length,
        `theme-${name} must have a primary rule`,
      ).toBeGreaterThan(0);
      expect(
        themeRules.some((rule) => rule.layer === "themes"),
        `theme-${name} must include its behavioral rules in @layer themes`,
      ).toBe(true);
      expect(
        themeRules.every(
          (rule) => rule.layer === null || rule.layer === "themes",
        ),
        `theme-${name} must only use its token scope and @layer themes`,
      ).toBe(true);
    }
  });

  it("resolves every registered class to selector AST nodes in source and index", async () => {
    const registry = parseRegistry(
      await readWorkspaceFile("src/lib/registry.json"),
    );
    const classNames = [
      ...registry.patterns
        .filter((pattern) =>
          pattern.canonicalSelector.includes(`.${pattern.name}`),
        )
        .map((pattern) => pattern.name),
      ...registry.patternGroups.flatMap((group) => group.members),
    ];
    const sourceRules = getCssRules(
      await readWorkspaceFile(SOURCE_MAIN),
      SOURCE_MAIN,
    );
    const distRules = getCssRules(
      await readDistCss(DIST_FILES.index),
      DIST_FILES.index,
    );

    for (const className of classNames) {
      expect(
        sourceRules.some((rule) => rule.classNames.has(className)),
        `.${className} must resolve in source selectors`,
      ).toBe(true);
      expect(
        distRules.some((rule) => rule.classNames.has(className)),
        `.${className} must resolve in index.css selectors`,
      ).toBe(true);
    }
  });

  it("preserves selector, declaration, and breakpoint contracts in each layer bundle", async () => {
    const sourceRules = getCssRules(
      await readWorkspaceFile(SOURCE_MAIN),
      SOURCE_MAIN,
    );
    const targets = [
      ["base", DIST_FILES.core],
      ["base", DIST_FILES.minimal],
      ["base", DIST_FILES.standard],
      ["utilities", DIST_FILES.utilities],
      ["utilities", DIST_FILES.minimal],
      ["utilities", DIST_FILES.standard],
      ["layouts", DIST_FILES.layouts],
      ["layouts", DIST_FILES.standard],
      ["components", DIST_FILES.components],
    ] as const;

    for (const [layer, fileName] of targets) {
      const distRules = getCssRules(await readDistCss(fileName), fileName);

      expect(
        layerRuleSignatures(distRules, layer),
        `${fileName} drifted from source @layer ${layer}`,
      ).toEqual(layerRuleSignatures(sourceRules, layer));
    }
  });
});

async function readSourceEntries(): Promise<CssEntry[]> {
  const themeNames = await readThemeNames(SOURCE_THEMES_DIR);
  const names = [
    SOURCE_MAIN,
    `${SOURCE_THEMES_DIR}/index.css`,
    ...themeNames.map((name) => `${SOURCE_THEMES_DIR}/${name}.css`),
  ];

  return Promise.all(
    names.map(async (name) => ({ name, css: await readWorkspaceFile(name) })),
  );
}

async function readDistEntries(): Promise<CssEntry[]> {
  const themeNames = await readThemeNames(SOURCE_THEMES_DIR);
  const names = [
    ...new Set(Object.values(DIST_FILES)),
    "themes/index.css",
    ...themeNames.map((name) => `themes/${name}.css`),
  ];

  return Promise.all(
    names.map(async (name) => ({
      name: `dist/${name}`,
      css: await readDistCss(name),
    })),
  );
}

async function readThemeNames(directory: string): Promise<string[]> {
  const entries = await readdir(directory);

  return entries
    .filter((fileName) => fileName.endsWith(".css") && fileName !== "index.css")
    .map((fileName) => path.basename(fileName, ".css"))
    .sort();
}

async function readPackageThemeNames(): Promise<string[]> {
  const manifest: unknown = JSON.parse(await readWorkspaceFile("package.json"));
  if (
    !manifest ||
    typeof manifest !== "object" ||
    !("exports" in manifest) ||
    !manifest.exports ||
    typeof manifest.exports !== "object"
  ) {
    throw new TypeError("package.json exports must be an object");
  }

  return Object.keys(manifest.exports)
    .flatMap((exportName) => {
      const match = /^\.\/themes\/([^/]+)$/.exec(exportName);
      return match?.[1] ? [match[1]] : [];
    })
    .sort();
}

function parseRegistry(json: string): RegistryFile {
  const registry: unknown = JSON.parse(json);
  if (
    !registry ||
    typeof registry !== "object" ||
    !("patterns" in registry) ||
    !Array.isArray(registry.patterns) ||
    !("patternGroups" in registry) ||
    !Array.isArray(registry.patternGroups)
  ) {
    throw new TypeError("registry.json has an invalid catalogue shape");
  }

  return registry as RegistryFile;
}

function layerRuleSignatures(
  rules: ReturnType<typeof getCssRules>,
  layer: string | null,
): string[] {
  return rules
    .filter((rule) => rule.layer === layer)
    .map((rule) => {
      const contexts = rule.atRules
        .filter((atRule) => atRule.name !== "layer")
        .map((atRule) => `@${atRule.name} ${atRule.prelude}`)
        .join(" > ");
      const declarations = rule.declarationList
        .map(
          ({ property, value, important }) =>
            `${property}:${value}${important ? "!important" : ""}`,
        )
        .join(";");

      return `${contexts}|${rule.selector}|${declarations}`;
    })
    .sort();
}
