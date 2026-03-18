import { describe, expect, it } from "vitest";
import { DIST_FILES, readDistCss } from "./helpers";

describe("css token contracts", () => {
  it("keeps critical design tokens in index.css", async () => {
    const css = await readDistCss(DIST_FILES.index);
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
      expect(css).toContain(token);
    }
  });

  it("keeps critical utility and layout selectors", async () => {
    const utilities = await readDistCss(DIST_FILES.utilities);
    const layouts = await readDistCss(DIST_FILES.layouts);

    [".grid", ".split", ".visually-hidden", ".form-actions"].forEach(
      (selector) => {
        expect(utilities).toContain(selector);
      },
    );

    [".stack", ".cluster", ".reel"].forEach((selector) => {
      expect(layouts).toContain(selector);
    });
  });

  it("keeps critical component selectors", async () => {
    const components = await readDistCss(DIST_FILES.components);

    [
      ".card",
      ".card.featured",
      ".dropdown-menu[popover]",
      ".avatar",
      ".input-group",
      ".button",
    ].forEach((selector) => {
      expect(components).toContain(selector);
    });
  });
});

describe("css safety guardrails", () => {
  it("keeps !important usage within bundle budgets", async () => {
    const indexCss = await readDistCss(DIST_FILES.index);
    const componentsCss = await readDistCss(DIST_FILES.components);
    const utilitiesCss = await readDistCss(DIST_FILES.utilities);
    const layoutsCss = await readDistCss(DIST_FILES.layouts);

    expect(indexCss.match(/!important/g) ?? []).toHaveLength(14);
    expect(componentsCss.match(/!important/g) ?? []).toHaveLength(0);
    expect(utilitiesCss.match(/!important/g) ?? []).toHaveLength(0);
    expect(layoutsCss.match(/!important/g) ?? []).toHaveLength(4);
  });

  it("avoids id selectors in component and utility selectors", async () => {
    const components = await readDistCss(DIST_FILES.components);
    const utilities = await readDistCss(DIST_FILES.utilities);

    const selectorPattern = /(^|})\s*([^@{}][^{}]*)\{/gm;
    const selectors = [components, utilities]
      .flatMap((css) =>
        [...css.matchAll(selectorPattern)].map(
          (match) => match[2]?.trim() ?? "",
        ),
      )
      .flatMap((selector) => selector.split(",").map((part) => part.trim()))
      .filter(Boolean);

    for (const selector of selectors) {
      expect(selector).not.toContain("#");
    }
  });
});
