import { describe, expect, it } from "vitest";
import {
  DIST_FILES,
  getCssRules,
  getLayerOrders,
  readDistCss,
  readWorkspaceFile,
} from "./helpers";

const SOURCE_MAIN = "src/lib/drop-in.css";
const LAYER_ORDER = ["base", "themes", "components", "utilities", "layouts"];
const TABLET_MEDIA = "(width<=1024px)";
const DRAWER_INLINE_MEDIA = "(width>768px)";
const MOBILE_MEDIA = "(width<=768px)";

describe("layout-holy-grail CSS contracts", () => {
  it("stays in the highest-priority layouts layer across public bundles", async () => {
    for (const entry of await readLayoutEntries()) {
      const rules = getCssRules(entry.css, entry.name);
      const layoutRules = rules.filter((rule) =>
        rule.classNames.has("layout-holy-grail"),
      );

      expect(getLayerOrders(entry.css, entry.name)).toContainEqual(LAYER_ORDER);
      expect(layoutRules.length, entry.name).toBeGreaterThan(0);
      expect(
        new Set(layoutRules.map((rule) => rule.layer)),
        entry.name,
      ).toEqual(new Set(["layouts"]));
    }
  });

  it("defines the centered desktop reading track with a local default", async () => {
    for (const entry of await readLayoutEntries()) {
      const rules = getCssRules(entry.css, entry.name);
      const layout = findRule(rules, ".layout-holy-grail", null, entry.name);

      expectDeclarations(
        layout,
        {
          "--max-width": "720px",
          display: "grid",
          "grid-template-columns":
            "minmax(0,1fr) min(var(--max-width,720px),100%) minmax(0,1fr)",
          gap: "var(--layout-gap,var(--gap,2rem))",
          "align-items": "start",
        },
        entry.name,
      );
    }
  });

  it("assigns optional direct slots by role without semantic reordering", async () => {
    for (const entry of await readLayoutEntries()) {
      const rules = getCssRules(entry.css, entry.name);

      expectDeclarations(
        findRule(
          rules,
          ".layout-holy-grail>.rail-start",
          null,
          entry.name,
        ),
        { "grid-column": "1" },
        entry.name,
      );
      expectDeclarations(
        findRule(
          rules,
          ".layout-holy-grail>:is(main,article)",
          null,
          entry.name,
        ),
        { "grid-column": "2" },
        entry.name,
      );
      expectDeclarations(
        findRule(
          rules,
          ".layout-holy-grail>.rail-end",
          null,
          entry.name,
        ),
        { "grid-column": "3" },
        entry.name,
      );

      for (const rule of rules.filter((candidate) =>
        candidate.classNames.has("layout-holy-grail"),
      )) {
        expect(rule.declarations.has("order"), rule.selector).toBe(false);
        expect(rule.selector, rule.selector).not.toMatch(
          /[+~]|:(?:first|last|nth)-child/,
        );
      }
    }
  });

  it("keeps the inclusive tablet and mobile rail contracts exact", async () => {
    for (const entry of await readLayoutEntries()) {
      const rules = getCssRules(entry.css, entry.name);
      const responsiveMedia = new Set(
        rules
          .filter((rule) => rule.classNames.has("layout-holy-grail"))
          .map(mediaPrelude)
          .filter((prelude): prelude is string => prelude !== null),
      );

      expect(responsiveMedia, entry.name).toEqual(
        new Set([TABLET_MEDIA, DRAWER_INLINE_MEDIA, MOBILE_MEDIA]),
      );

      expectDeclarations(
        findRule(rules, ".layout-holy-grail", TABLET_MEDIA, entry.name),
        {
          "grid-template-columns": "min(var(--max-width,720px),100%)",
          "place-content": "start center",
        },
        entry.name,
      );
      expectDeclarations(
        findRule(
          rules,
          ".layout-holy-grail>:is(.rail-start,main,article,.rail-end)",
          TABLET_MEDIA,
          entry.name,
        ),
        { "grid-column": "1" },
        entry.name,
      );
      expectDeclarations(
        findRule(
          rules,
          ".layout-holy-grail>.rail-end",
          TABLET_MEDIA,
          entry.name,
        ),
        { display: "none" },
        entry.name,
      );
      expectDeclarations(
        findRule(
          rules,
          ".layout-holy-grail>.rail-start:not(.drawer)",
          MOBILE_MEDIA,
          entry.name,
        ),
        { display: "none" },
        entry.name,
      );

      const railRules = rules.filter(
        (rule) =>
          rule.classNames.has("rail-start") ||
          rule.classNames.has("rail-end"),
      );
      expect(railRules.length, entry.name).toBeGreaterThan(0);
      for (const rule of railRules) {
        expect(rule.classNames.has("layout-holy-grail"), rule.selector).toBe(
          true,
        );
        expect(
          rule.selectors.every((selector) =>
            selector.startsWith(".layout-holy-grail>"),
          ),
          rule.selector,
        ).toBe(true);
      }
    }
  });

  it("promotes only the start rail from static inline content to the native drawer", async () => {
    for (const entry of await readLayoutEntries()) {
      const rules = getCssRules(entry.css, entry.name);
      const endDrawerRules = rules.filter(
        (rule) =>
          rule.classNames.has("layout-holy-grail") &&
          rule.classNames.has("drawer") &&
          rule.classNames.has("rail-end"),
      );

      expect(endDrawerRules, entry.name).toEqual([]);

      expectDeclarations(
        findRule(
          rules,
          ".layout-holy-grail .drawer-toggle",
          DRAWER_INLINE_MEDIA,
          entry.name,
        ),
        { display: "none" },
        entry.name,
      );
      expectDeclarations(
        findRule(
          rules,
          ".layout-holy-grail>[popover].drawer.rail-start",
          DRAWER_INLINE_MEDIA,
          entry.name,
        ),
        {
          position: "static",
          inset: "auto",
          translate: "none",
          transition: "none",
          "inline-size": "auto",
          "max-inline-size": "none",
          "block-size": "auto",
          border: "none",
          background: "transparent",
        },
        entry.name,
      );
      expectDeclarations(
        findRule(
          rules,
          ".layout-holy-grail>[popover].drawer.rail-start:not(:popover-open)",
          DRAWER_INLINE_MEDIA,
          entry.name,
        ),
        { display: "block" },
        entry.name,
      );
      expectDeclarations(
        findRule(
          rules,
          ".layout-holy-grail .drawer-toggle",
          MOBILE_MEDIA,
          entry.name,
        ),
        { display: "inline-flex" },
        entry.name,
      );
      expectDeclarations(
        findRule(
          rules,
          ".layout-holy-grail>[popover].drawer.rail-start:not(:popover-open)",
          MOBILE_MEDIA,
          entry.name,
        ),
        { display: "none" },
        entry.name,
      );
    }

    for (const entry of await readFullEntries()) {
      const drawer = findRule(
        getCssRules(entry.css, entry.name),
        "[popover].drawer",
        null,
        entry.name,
      );

      expect(drawer.layer, entry.name).toBe("components");
      expect(drawer.declarations.get("position"), entry.name).toBe("fixed");
      expect(drawer.declarations.get("transition"), entry.name).toContain(
        "allow-discrete",
      );
    }
  });
});

interface CssEntry {
  name: string;
  css: string;
}

async function readLayoutEntries(): Promise<CssEntry[]> {
  return [
    {
      name: SOURCE_MAIN,
      css: await readWorkspaceFile(SOURCE_MAIN),
    },
    {
      name: `dist/${DIST_FILES.index}`,
      css: await readDistCss(DIST_FILES.index),
    },
    {
      name: `dist/${DIST_FILES.layouts}`,
      css: await readDistCss(DIST_FILES.layouts),
    },
  ];
}

async function readFullEntries(): Promise<CssEntry[]> {
  return [
    {
      name: SOURCE_MAIN,
      css: await readWorkspaceFile(SOURCE_MAIN),
    },
    {
      name: `dist/${DIST_FILES.index}`,
      css: await readDistCss(DIST_FILES.index),
    },
  ];
}

function findRule(
  rules: ReturnType<typeof getCssRules>,
  selector: string,
  media: string | null,
  sourceName: string,
): ReturnType<typeof getCssRules>[number] {
  const matches = rules.filter(
    (rule) =>
      rule.selectors.includes(selector) && mediaPrelude(rule) === media,
  );

  expect(
    matches,
    `${sourceName}: ${selector} at ${media ?? "desktop"}`,
  ).toHaveLength(1);
  return matches[0]!;
}

function mediaPrelude(
  rule: ReturnType<typeof getCssRules>[number],
): string | null {
  return rule.atRules.find((atRule) => atRule.name === "media")?.prelude ?? null;
}

function expectDeclarations(
  rule: ReturnType<typeof getCssRules>[number],
  expected: Record<string, string>,
  sourceName: string,
): void {
  expect(
    Object.fromEntries(
      [...rule.declarations].map(([property, value]) => [
        property,
        value.replace(/\s+/g, ""),
      ]),
    ),
    `${sourceName}: ${rule.selector}`,
  ).toEqual(
    Object.fromEntries(
      Object.entries(expected).map(([property, value]) => [
        property,
        value.replace(/\s+/g, ""),
      ]),
    ),
  );
}
