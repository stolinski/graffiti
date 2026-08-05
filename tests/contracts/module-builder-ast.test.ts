import { describe, expect, it } from "vitest";
// @ts-expect-error ESM .mjs without types
import { parseModuleSource } from "../../scripts/module-builder-ast.mjs";
import {
  DIST_FILES,
  getCssDeclarations,
  readDistCss,
  readWorkspaceFile,
} from "./helpers";

const SOURCE_MAIN = "src/lib/drop-in.css";
const LAYER_ORDER = "@layer base, themes, components, utilities, layouts;";
const BASE_FIXTURE = `
${LAYER_ORDER}
@layer base {
  @property --animation-reduced {
    syntax: "*";
    inherits: false;
    initial-value: none;
  }
  :root {
    --fg: black;
    @media (forced-colors: active) { --fg: CanvasText; }
  }
}
@layer utilities {}
@layer layouts {}
@layer components {}
@media (prefers-reduced-motion: reduce) { * { animation: none; } }
@media print { .no-print { display: none; } }
`;

describe("module builder AST extraction", () => {
  it("fails with source context when a required layer is missing", () => {
    const source = BASE_FIXTURE.replace("@layer layouts {}", "");

    expect(() => parseModuleSource(source, "missing-layer.css")).toThrow(
      /CSS module build failed for missing-layer\.css: missing required top-level layer @layer layouts/,
    );
  });

  it("fails with source context when a layer boundary is malformed", () => {
    const source = `
${LAYER_ORDER}
@layer base {
  @property --animation-reduced { syntax: "*"; inherits: false; initial-value: none; }
  :root { --fg: black; }
}
@layer utilities {}
@layer layouts {}
@media (prefers-reduced-motion: reduce) { * { animation: none; } }
@media print { .no-print { display: none; } }
@layer components {`;

    expect(() => parseModuleSource(source, "malformed-layer.css")).toThrow(
      /CSS module build failed for malformed-layer\.css at line \d+, column \d+: malformed @layer components boundary/,
    );
  });

  it("keeps canonical defaults unique and conditional overrides scoped in every entry", async () => {
    const sourceDeclarations = getCssDeclarations(
      await readWorkspaceFile(SOURCE_MAIN),
      SOURCE_MAIN,
    );
    const canonicalDefaults = new Map(
      sourceDeclarations
        .filter(
          (declaration) =>
            declaration.selector === ":root" &&
            declaration.layer === "base" &&
            !declaration.atRules.some((atRule) => atRule.name === "media") &&
            declaration.property.startsWith("--"),
        )
        .map((declaration) => [declaration.property, declaration.value]),
    );
    const canonicalForcedColors = sourceDeclarations
      .filter(
        (declaration) =>
          declaration.selector === ":root" &&
          declaration.atRules.some(
            (atRule) =>
              atRule.name === "media" &&
              atRule.prelude === "(forced-colors:active)",
          ),
      )
      .map(({ property, value }) => `${property}:${value.replace(/\s+/g, "")}`)
      .sort();

    for (const fileName of Object.values(DIST_FILES)) {
      const declarations = getCssDeclarations(
        await readDistCss(fileName),
        fileName,
      );
      const defaults = declarations.filter(
        (declaration) =>
          declaration.selector === ":root" &&
          !declaration.atRules.some((atRule) => atRule.name === "media") &&
          declaration.property.startsWith("--"),
      );
      const propertyCounts = new Map<string, number>();

      for (const declaration of defaults) {
        propertyCounts.set(
          declaration.property,
          (propertyCounts.get(declaration.property) ?? 0) + 1,
        );
        expect(
          declaration.value.replace(/\s+/g, ""),
          `${fileName} must use the canonical ${declaration.property} default`,
        ).toBe(
          canonicalDefaults.get(declaration.property)?.replace(/\s+/g, ""),
        );
      }

      expect(
        [...propertyCounts].filter(([, count]) => count !== 1),
        `${fileName} must emit each canonical default exactly once`,
      ).toEqual([]);

      const forcedColors = declarations
        .filter(
          (declaration) =>
            declaration.selector === ":root" &&
            declaration.atRules.some(
              (atRule) =>
                atRule.name === "media" &&
                atRule.prelude === "(forced-colors:active)",
            ),
        )
        .map(
          ({ property, value }) => `${property}:${value.replace(/\s+/g, "")}`,
        )
        .sort();

      expect(forcedColors, `${fileName} forced-colors subtree`).toEqual(
        canonicalForcedColors,
      );
    }
  });
});
