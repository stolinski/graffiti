import { describe, expect, it } from "vitest";
import {
  DIST_FILES,
  getCssRules,
  getLayerOrders,
  readDistCss,
} from "./helpers";

const LAYER_ORDER = ["base", "themes", "components", "utilities", "layouts"];

const LAYERED_BUNDLES = [
  [DIST_FILES.index, []],
  [DIST_FILES.core, []],
  [DIST_FILES.minimal, [[".reset", "utilities"]]],
  [
    DIST_FILES.standard,
    [
      [".reset", "utilities"],
      [".layout-card", "layouts"],
    ],
  ],
  [DIST_FILES.components, [[".chip", "components"]]],
  [DIST_FILES.utilities, [[".reset", "utilities"]]],
  [DIST_FILES.layouts, [[".layout-card", "layouts"]]],
] as const;

describe("modular cascade contracts", () => {
  it.each(LAYERED_BUNDLES)(
    "%s preserves layer order and named base styles",
    async (fileName, expectedRules) => {
      const css = await readDistCss(fileName);
      const rules = getCssRules(css, fileName);
      const rootRules = rules.filter((rule) =>
        rule.selectors.includes(":root"),
      );

      expect(getLayerOrders(css, fileName)).toContainEqual(LAYER_ORDER);
      expect(rootRules.length).toBeGreaterThan(0);
      expect(new Set(rootRules.map((rule) => rule.layer))).toEqual(
        new Set(["base"]),
      );

      for (const [selector, layer] of expectedRules) {
        expect(
          rules.some(
            (rule) => rule.selectors.includes(selector) && rule.layer === layer,
          ),
          `${selector} must remain in @layer ${layer}`,
        ).toBe(true);
      }
    },
  );

  it.each(LAYERED_BUNDLES)(
    "%s includes the canonical reduced-motion and print tail",
    async (fileName) => {
      const css = await readDistCss(fileName);
      const rules = getCssRules(css, fileName);
      const reducedMotionRule = rules.find(
        (rule) =>
          rule.layer === null &&
          rule.selectors.includes("*") &&
          rule.declarations.get("animation") === "var(--animation-reduced)",
      );
      const noPrintRule = rules.find(
        (rule) =>
          rule.layer === null &&
          rule.selectors.includes(".no-print") &&
          rule.declarations.get("display") === "none",
      );

      expect(
        css.match(/@media \(prefers-reduced-motion: reduce\)/g),
      ).toHaveLength(1);
      expect(css.match(/@media print/g)).toHaveLength(1);
      expect(css).toContain("@property --animation-reduced");
      expect(reducedMotionRule).toBeDefined();
      expect(noPrintRule).toBeDefined();
    },
  );
});
