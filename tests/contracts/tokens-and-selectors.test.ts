import { describe, expect, it } from "vitest";
import {
  DIST_FILES,
  getCssDeclarations,
  getCssRules,
  getCssVariableContract,
  getLayerOrders,
  readDistCss,
} from "./helpers";

const LAYER_ORDER = ["base", "themes", "components", "utilities", "layouts"];
const COLOR_BASES = [
  "yellow",
  "amber",
  "orange",
  "red",
  "pink",
  "purple",
  "purple-deep",
  "indigo",
  "green",
  "lime",
  "highlighter",
  "brown",
  "teal",
  "blue",
  "gray",
  "slate",
  "white",
  "black",
  "fg",
  "bg",
  "primary",
  "error",
  "warning",
  "success",
] as const;
const DERIVED_COLOR_BASES = [
  "fg",
  "bg",
  "primary",
  "error",
  "warning",
  "success",
] as const;

const OPAQUE_TOKENS = COLOR_BASES.flatMap((base) =>
  Array.from({ length: 9 }, (_, index) => `--${base}-opaque-${index + 1}`),
);
const DURATION_TOKENS = [
  "--d-instant",
  "--d-fast",
  "--d-base",
  "--d-slow",
  "--d-emphatic",
];
const Z_INDEX_TOKENS = [
  "--z-base",
  "--z-raised",
  "--z-overlay",
  "--z-sticky",
  "--z-modal",
  "--z-toast",
];
const SAFE_AREA_TOKENS = {
  "--safe-top": "env(safe-area-inset-top, 0px)",
  "--safe-right": "env(safe-area-inset-right, 0px)",
  "--safe-bottom": "env(safe-area-inset-bottom, 0px)",
  "--safe-left": "env(safe-area-inset-left, 0px)",
} as const;

describe("css token contracts", () => {
  it("keeps critical design tokens in index.css", async () => {
    const css = await readDistCss(DIST_FILES.index);
    const rootTokens = new Set(
      getCssRules(css, DIST_FILES.index)
        .filter((rule) => rule.selectors.includes(":root"))
        .flatMap((rule) => [...rule.declarations.keys()]),
    );
    const requiredTokens = [
      "--fg",
      "--bg",
      "--vs-base",
      "--pad-l",
      "--br-l",
      "--shadow-3",
      "--ease-smooth",
    ];

    for (const token of requiredTokens) {
      expect(rootTokens, `${token} must be declared on :root`).toContain(token);
    }
  });

  it("keeps critical utility and layout selectors", async () => {
    const utilities = await readDistCss(DIST_FILES.utilities);
    const layouts = await readDistCss(DIST_FILES.layouts);
    const utilityRules = getCssRules(utilities, DIST_FILES.utilities);
    const layoutRules = getCssRules(layouts, DIST_FILES.layouts);

    ["grid", "cluster", "visually-hidden", "form-actions"].forEach(
      (className) => {
        expect(
          utilityRules.some(
            (rule) =>
              rule.layer === "utilities" && rule.classNames.has(className),
          ),
          `.${className} must exist in @layer utilities`,
        ).toBe(true);
      },
    );

    ["stack", "split", "reel"].forEach((className) => {
      expect(
        layoutRules.some(
          (rule) => rule.layer === "layouts" && rule.classNames.has(className),
        ),
        `.${className} must exist in @layer layouts`,
      ).toBe(true);
    });
  });

  it("keeps critical base and component selectors", async () => {
    const index = await readDistCss(DIST_FILES.index);
    const components = await readDistCss(DIST_FILES.components);
    const baseSelectors = new Set(
      getCssRules(index, DIST_FILES.index)
        .filter((rule) => rule.layer === "base")
        .flatMap((rule) => rule.selectors),
    );
    const selectors = new Set(
      getCssRules(components, DIST_FILES.components)
        .filter((rule) => rule.layer === "components")
        .flatMap((rule) => rule.selectors),
    );

    [
      ".card",
      ".card.featured",
      ".dropdown-menu[popover]",
      ".avatar",
      ".input-group",
    ].forEach((selector) => {
      expect(
        selectors,
        `${selector} must exist in @layer components`,
      ).toContain(selector);
    });

    expect(baseSelectors, ".button must exist in @layer base").toContain(
      ".button",
    );
  });

  it("defines safe-area tokens and includes them in standalone modules", async () => {
    const bundleNames = [
      DIST_FILES.index,
      DIST_FILES.core,
      DIST_FILES.components,
    ];
    const bundles = await Promise.all(
      bundleNames.map(
        async (fileName) => [fileName, await readDistCss(fileName)] as const,
      ),
    );

    for (const [token, value] of Object.entries(SAFE_AREA_TOKENS)) {
      for (const [fileName, css] of bundles) {
        const declaration = getCssRules(css, fileName)
          .filter((rule) => rule.selectors.includes(":root"))
          .find((rule) => rule.declarations.has(token))
          ?.declarations.get(token);

        expect(
          declaration?.replace(/\s+/g, ""),
          `${token} must ship in ${fileName}`,
        ).toBe(value.replace(/\s+/g, ""));
      }
    }
  });

  it("defines every safe-area token consumed by the full bundle", async () => {
    const css = await readDistCss(DIST_FILES.index);
    const consumedTokens = getCssVariableContract(css, DIST_FILES.index)
      .references.map((reference) => reference.variable)
      .filter((token) => token.startsWith("--safe-"));

    expect(consumedTokens.length).toBeGreaterThan(0);
    expect(new Set(consumedTokens)).toEqual(
      new Set(Object.keys(SAFE_AREA_TOKENS)),
    );
  });

  it("keeps dropdown anchors locally scoped with automatic defaults", async () => {
    const components = await readDistCss(DIST_FILES.components);
    const rules = getCssRules(components, DIST_FILES.components);
    const declaration = (selector: string, property: string) =>
      rules
        .find(
          (rule) =>
            rule.selectors.includes(selector) &&
            rule.declarations.has(property),
        )
        ?.declarations.get(property);

    expect(declaration(".dropdown", "anchor-scope")).toBe(
      "var(--anchor, --dropdown)",
    );
    expect(declaration(".dropdown>[popovertarget]", "anchor-name")).toBe(
      "var(--anchor, --dropdown)",
    );
    expect(declaration(".dropdown-menu[popover]", "position-anchor")).toBe(
      "var(--anchor, --dropdown)",
    );
    expect(declaration(".dropdown-menu[popover]", "position-area")).toBe(
      "block-end span-inline-end",
    );
    expect(
      declaration(".dropdown.end .dropdown-menu[popover]", "position-area"),
    ).toBe("block-end span-inline-start");

    const unsafeAnchors = getCssDeclarations(
      components,
      DIST_FILES.components,
    ).filter(
      (candidate) =>
        (candidate.property === "anchor-name" ||
          candidate.property === "position-anchor") &&
        candidate.value === "var(--anchor)",
    );
    expect(unsafeAnchors).toEqual([]);
  });

  it("keeps tooltip visibility and presentational data attribute contracts", async () => {
    const components = await readDistCss(DIST_FILES.components);
    const rules = getCssRules(components, DIST_FILES.components);
    const declaration = (selector: string, property: string) =>
      rules
        .find(
          (rule) =>
            rule.selectors.includes(selector) &&
            rule.declarations.has(property),
        )
        ?.declarations.get(property);

    expect(declaration(".tooltip .tip", "visibility")).toBe("hidden");
    expect(declaration(".tip[data-tooltip]::after", "visibility")).toBe(
      "hidden",
    );
    expect(declaration(".tip[data-tooltip]::after", "content")).toBe(
      "attr(data-tooltip)",
    );
    expect(
      rules.some((rule) => rule.selector.includes(".tip[aria-label]")),
    ).toBe(false);
  });

  it("keeps the complete opaque, duration, and z-index token surfaces", async () => {
    const css = await readDistCss(DIST_FILES.index);
    const rootDeclarations = getCssRules(css, DIST_FILES.index)
      .filter((rule) => rule.selectors.includes(":root"))
      .flatMap((rule) => [...rule.declarations.keys()]);
    const declaredTokens = new Set(rootDeclarations);

    for (const token of [
      ...OPAQUE_TOKENS,
      ...DURATION_TOKENS,
      ...Z_INDEX_TOKENS,
    ]) {
      expect(declaredTokens, `${token} must be declared on :root`).toContain(
        token,
      );
    }
  });

  it("re-derives every scoped color scale through the open theme selector", async () => {
    const css = await readDistCss(DIST_FILES.index);
    const themeScopeRule = getCssRules(css, DIST_FILES.index).find((rule) =>
      rule.selectors.includes(':where([class*="theme-"])'),
    );

    expect(themeScopeRule).toBeDefined();

    const expectedTokens = [
      "--fg",
      "--bg",
      ...OPAQUE_TOKENS,
      ...DERIVED_COLOR_BASES.flatMap((base) => [
        ...Array.from({ length: 9 }, (_, index) => `--${base}-${index + 1}`),
      ]),
      "--fg-05",
      "--bg-05",
    ];

    for (const token of expectedTokens) {
      expect(
        themeScopeRule?.declarations.has(token),
        `${token} must be re-derived for theme scopes`,
      ).toBe(true);
    }
  });
});

describe("css cascade contracts", () => {
  it("keeps the public cascade layer order", async () => {
    const css = await readDistCss(DIST_FILES.index);

    expect(getLayerOrders(css, DIST_FILES.index)).toContainEqual(LAYER_ORDER);
  });

  it("keeps split in layouts and cluster in utilities", async () => {
    const css = await readDistCss(DIST_FILES.index);
    const rules = getCssRules(css, DIST_FILES.index);
    const expectedLayers = new Map([
      [".split", "layouts"],
      [".cluster", "utilities"],
    ]);

    for (const [selector, layer] of expectedLayers) {
      const primaryRules = rules.filter((rule) =>
        rule.selectors.includes(selector),
      );

      expect(
        primaryRules.length,
        `${selector} must have a primary rule`,
      ).toBeGreaterThan(0);
      expect(
        [...new Set(primaryRules.map((rule) => rule.layer))],
        `${selector} must only be assigned to @layer ${layer}`,
      ).toEqual([layer]);
    }
  });
});

describe("css reduced-motion contracts", () => {
  it("requires every authored animation to declare its reduced variant", async () => {
    const css = await readDistCss(DIST_FILES.index);
    const missingDecisions = getCssRules(css, DIST_FILES.index)
      .filter((rule) => {
        const animation = rule.declarations.get("animation");

        return (
          animation !== undefined &&
          animation !== "var(--animation-reduced)" &&
          !rule.declarations.has("--animation-reduced")
        );
      })
      .map((rule) => rule.selector);

    expect(missingDecisions).toEqual([]);
  });
});

describe("css safety guardrails", () => {
  it("keeps !important usage within bundle ceilings", async () => {
    // Ceilings, not exact counts: this guards against `!important` creep while
    // allowing reductions. Bump a ceiling deliberately if a new `!important` is
    // genuinely warranted (e.g. a print/accessibility override). Current actual
    // counts: index and modular bundles each have 3 in the shared unlayered
    // accessibility tail.
    const indexCss = await readDistCss(DIST_FILES.index);
    const componentsCss = await readDistCss(DIST_FILES.components);
    const utilitiesCss = await readDistCss(DIST_FILES.utilities);
    const layoutsCss = await readDistCss(DIST_FILES.layouts);

    const count = (css: string, sourceName: string) =>
      getCssDeclarations(css, sourceName).filter(
        (declaration) => declaration.important,
      ).length;

    expect(count(indexCss, DIST_FILES.index)).toBeLessThanOrEqual(6);
    expect(count(componentsCss, DIST_FILES.components)).toBeLessThanOrEqual(6);
    expect(count(utilitiesCss, DIST_FILES.utilities)).toBeLessThanOrEqual(6);
    expect(count(layoutsCss, DIST_FILES.layouts)).toBeLessThanOrEqual(6);
  });

  it("avoids id selectors in component and utility selectors", async () => {
    const components = await readDistCss(DIST_FILES.components);
    const utilities = await readDistCss(DIST_FILES.utilities);

    const idNames = [
      ...getCssRules(components, DIST_FILES.components),
      ...getCssRules(utilities, DIST_FILES.utilities),
    ].flatMap((rule) => [...rule.idNames]);

    expect(idNames).toEqual([]);
  });
});
