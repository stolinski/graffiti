import { describe, expect, it } from "vitest";
import {
  DIST_FILES,
  getCssRules,
  getCssVariableContract,
  readDistCss,
  readWorkspaceFile,
} from "./helpers";

const DECKS_REQUIRED_PATTERNS = [
  "app-shell",
  "aspect-square",
  "avatar",
  "bottom-nav",
  "bottom-sheet",
  "box",
  "breadcrumbs",
  "bubble",
  "calendar",
  "calendar-day",
  "calendar-grid",
  "calendar-header",
  "callout",
  "card",
  "carousel",
  "chat-composer",
  "chat-row",
  "chat-thread",
  "chip",
  "close",
  "cluster",
  "combobox",
  "composer",
  "data-table",
  "data-table-actions",
  "data-table-empty",
  "data-table-loading",
  "data-table-sort",
  "data-table-toolbar",
  "date-picker",
  "drawer",
  "dropdown",
  "dropdown-header",
  "dropdown-menu",
  "dropzone",
  "empty",
  "feature-card",
  "footer",
  "form-actions",
  "form-option-row",
  "grid",
  "header",
  "icon-rail",
  "input-group",
  "kanban-board",
  "kanban-card",
  "kanban-column",
  "kanban-column-header",
  "kanban-dropzone",
  "layout-card",
  "layout-holy-grail",
  "layout-rail",
  "layout-readable",
  "layout-sidebar",
  "layout-split",
  "layout-three-col",
  "list-nav",
  "listbox",
  "log-card",
  "meter",
  "narrow",
  "newsletter",
  "option",
  "pagination",
  "popover",
  "popover-anchor",
  "progress",
  "pull-quote",
  "readable",
  "reel",
  "row",
  "search",
  "section",
  "segmented-control",
  "sidebar-nav",
  "skeleton",
  "spinner",
  "split",
  "stack",
  "stat-card",
  "steps",
  "surface",
  "swipe",
  "table",
  "tabs",
  "tag",
  "tag-input",
  "timeline",
  "toast",
  "toast-actions",
  "toast-body",
  "toast-dismiss",
  "toast-header",
  "toast-item",
  "toast-progress",
  "toast-viewport",
  "toc",
  "toggle",
  "tooltip",
  "tooltip-content",
  "tooltip-trigger",
  "tip",
  "visually-hidden",
  "workbench-panel",
] as const;

const NEW_PATTERN_CONTRACTS = {
  "segmented-control": ["compact", "full"],
  popover: ["end", "top", "left", "right"],
  tooltip: ["bottom", "left", "right", "open"],
  toast: ["info", "success", "warning", "error"],
  "toast-viewport": [
    "top-start",
    "top-center",
    "top-end",
    "bottom-start",
    "bottom-center",
    "bottom-end",
  ],
  skeleton: ["text", "circle"],
  spinner: ["s", "l"],
  meter: ["signaling"],
  option: ["selected", "active", "disabled"],
  "calendar-day": ["outside"],
  "data-table": ["compact", "sticky"],
  "kanban-column": ["drag-over"],
  "kanban-card": ["dragging", "keyboard-dragging", "selected"],
  "kanban-dropzone": ["active", "invalid"],
} as const;

const TOAST_PUBLIC_TOKENS = [
  "--toast-width",
  "--toast-offset",
  "--toast-bg",
  "--toast-fg",
  "--toast-font-size",
  "--toast-gap",
  "--toast-line-height",
  "--toast-muted",
  "--toast-border",
  "--toast-radius",
  "--toast-shadow",
  "--toast-title-weight",
  "--toast-padding-block",
  "--toast-padding-inline",
  "--toast-progress-color",
  "--toast-progress-track",
  "--toast-progress-size",
  "--toast-duration",
  "--toast-tone",
] as const;

interface RegistryPattern {
  name: string;
  role: string;
  example: string;
  modifiers: string[];
  related: string[];
}

interface RegistryToken {
  name: string;
}

interface RegistryTokenGroup {
  matches: string;
  members: string[];
}

interface Registry {
  patterns: RegistryPattern[];
  patternGroups: { members: string[] }[];
  tokens: RegistryToken[];
  tokenGroups: RegistryTokenGroup[];
}

describe("Decks-facing registry contracts", () => {
  it("registers every class-backed Decks basis", async () => {
    const registry = await readRegistry();
    const names = new Set([
      ...registry.patterns.map((pattern) => pattern.name),
      ...registry.patternGroups.flatMap((group) => group.members),
    ]);

    for (const name of DECKS_REQUIRED_PATTERNS) {
      expect(names, `.${name} must be in the public registry`).toContain(name);
    }
  });

  it("publishes role, example, modifiers, and relationships for every new family", async () => {
    const registry = await readRegistry();
    const patterns = new Map(
      registry.patterns.map((pattern) => [pattern.name, pattern]),
    );

    for (const [name, modifiers] of Object.entries(NEW_PATTERN_CONTRACTS)) {
      const pattern = patterns.get(name);
      expect(pattern, `missing ${name}`).toBeDefined();
      expect(pattern?.role.trim().length, `${name} role`).toBeGreaterThan(0);
      expect(pattern?.example.trim().length, `${name} example`).toBeGreaterThan(
        0,
      );
      expect(pattern?.modifiers, `${name} modifiers`).toEqual(modifiers);
      expect(pattern?.related.length, `${name} relationships`).toBeGreaterThan(
        0,
      );
    }
  });

  it("registers tooltip override tokens consumed by Decks", async () => {
    const registry = await readRegistry();
    const standaloneTokens = new Set(
      registry.tokens.map((token) => token.name),
    );
    const groupedTokens = new Set(
      registry.tokenGroups.flatMap((group) => group.members),
    );

    expect(standaloneTokens).toContain("--tooltip-offset");
    expect(groupedTokens).toContain("--tooltip-show-delay");
    expect(groupedTokens).toContain("--tooltip-hide-delay");
  });
});

describe("Decks-facing selector contracts", () => {
  it("keeps closed toast popovers hidden without hiding non-popover viewports", async () => {
    const css = await readWorkspaceFile("src/lib/drop-in.css");
    const rules = getCssRules(css, "src/lib/drop-in.css");
    const viewport = rules.find((rule) =>
      rule.selectors.includes(".toast-viewport"),
    );
    const closedPopover = rules.find((rule) =>
      rule.selectors.includes(
        ".toast-viewport[popover]:not(:popover-open)",
      ),
    );

    expect(viewport?.declarations.get("display")).toBe("grid");
    expect(closedPopover?.declarations.get("display")).toBe("none");
  });

  it("keeps a neutral content column with an out-of-flow dismiss control", async () => {
    const css = await readWorkspaceFile("src/lib/drop-in.css");
    const rules = getCssRules(css, "src/lib/drop-in.css");
    const selectors = rules.flatMap((rule) => rule.selectors);

    for (const selector of [
      ":where(.toast,.di-toast-slice)>strong",
      ":where(.toast,.di-toast-slice)>p",
      ':where(.toast,.di-toast-slice)>button[popovertargetaction="hide"]',
      ':where(.toast,.di-toast-slice)>:is(a,button:not([popovertargetaction="hide"]):not(.toast-dismiss))',
    ]) {
      expect(selectors, `missing canonical selector ${selector}`).toContain(
        selector,
      );
    }

    for (const className of [
      "toast-header",
      "toast-body",
      "toast-actions",
      "toast-dismiss",
    ]) {
      expect(selectors, `missing compatibility hook .${className}`).toContain(
        `.${className}`,
      );
    }

    const toastRoot = rules.find((rule) =>
      rule.selectors.includes(":where(.toast,.di-toast-slice)"),
    );
    const directAction = rules.find((rule) =>
      rule.selectors.includes(
        ':where(.toast,.di-toast-slice)>:is(a,button:not([popovertargetaction="hide"]):not(.toast-dismiss))',
      ),
    );
    const directDismiss = rules.find(
      (rule) =>
        rule.selectors.includes(
          ':where(.toast,.di-toast-slice)>button[popovertargetaction="hide"]',
        ) && rule.declarations.has("position"),
    );
    const legacyHeader = rules.find((rule) =>
      rule.selectors.includes(".toast-header"),
    );
    const reservedToast = rules.find(
      (rule) =>
        rule.selector.includes(":has(") &&
        rule.selector.includes(".toast") &&
        rule.declarations.has("padding-inline-end"),
    );

    expect(toastRoot?.declarations.get("grid-template-columns")).toBe(
      "minmax(0,1fr)",
    );
    expect(legacyHeader?.declarations.get("grid-template-columns")).toBe(
      "minmax(0,1fr) auto",
    );
    expect(toastRoot?.declarations.get("border")).toBe("var(--toast-border)");
    expect(selectors).not.toContain(
      ":where(.toast,.di-toast-slice)::before",
    );
    expect(directAction?.declarations.get("inline-size")).toBe("fit-content");
    expect(directAction?.declarations.get("grid-column")).toBe("1");
    expect(directAction?.declarations.has("background")).toBe(false);
    expect(directDismiss?.declarations.get("position")).toBe("absolute");
    expect(directDismiss?.declarations.has("grid-column")).toBe(false);
    expect(directDismiss?.declarations.get("inset-block-start")).toBe(
      "var(--toast-padding-block)",
    );
    expect(directDismiss?.declarations.get("inset-inline-end")).toBe(
      "var(--toast-padding-inline)",
    );
    expect(reservedToast?.declarations.get("padding-inline-end")).toContain(
      "var(--toast-padding-inline)",
    );
    expect(reservedToast?.declarations.get("padding-inline-end")).toContain(
      "1.75rem",
    );

    const expectedColumns = new Map([
      [".toast-header", "1/-1"],
      [".toast-body", "1/-1"],
      [".toast-actions", "1/-1"],
      [":where(.toast,.di-toast-slice)>strong", "1"],
      [":where(.toast,.di-toast-slice)>p", "1"],
      [".toast-header>.toast-dismiss", "2"],
    ]);

    for (const [selector, column] of expectedColumns) {
      const rule = rules.find(
        (candidate) =>
          candidate.selectors.includes(selector) &&
          candidate.declarations.has("grid-column"),
      );
      expect(rule?.declarations.get("grid-column"), selector).toBe(column);
    }

    for (const selector of [
      ":where(.toast.info,.di-toast-slice.info)",
      ":where(.toast.success,.di-toast-slice.success)",
      ":where(.toast.warning,.di-toast-slice.warning)",
      ":where(.toast.error,.di-toast-slice.error)",
    ]) {
      const toneRule = rules.find((rule) => rule.selectors.includes(selector));
      expect([...toneRule!.declarations.keys()], selector).toEqual([
        "--toast-tone",
      ]);
    }

    const toastToneBorders = rules
      .filter((rule) => rule.selector.includes("toast"))
      .flatMap((rule) => rule.declarationList)
      .filter(
        (declaration) =>
          declaration.property.startsWith("border") &&
          declaration.value.includes("--toast-tone"),
      );
    expect(toastToneBorders).toEqual([]);

    const legacyActionContainerRules = rules.filter(
      (rule) =>
        rule.selector.includes(".toast-actions") &&
        rule.atRules.some((atRule) => atRule.name === "container"),
    );
    expect(legacyActionContainerRules).toEqual([]);
  });

  it("publishes and consumes one coherent toast token API", async () => {
    const sourceName = "src/lib/drop-in.css";
    const css = await readWorkspaceFile(sourceName);
    const rules = getCssRules(css, sourceName);
    const contract = getCssVariableContract(css, sourceName);
    const viewport = rules.find((rule) =>
      rule.selectors.includes(".toast-viewport"),
    );
    const toast = rules.find((rule) =>
      rule.selectors.includes(":where(.toast,.di-toast-slice)"),
    );
    const defaults = new Map([
      ["--toast-width", "22rem"],
      ["--toast-offset", "var(--pad-l)"],
      ["--toast-bg", "var(--bg)"],
      ["--toast-fg", "var(--fg)"],
      [
        "--toast-muted",
        "color-mix(in oklab, var(--toast-fg) 72%, transparent)",
      ],
      ["--toast-border", "0"],
      ["--toast-radius", "calc((var(--br-m) + var(--br-l)) / 2)"],
      ["--toast-shadow", "var(--shadow-3)"],
      ["--toast-padding-block", "var(--pad-m)"],
      ["--toast-padding-inline", "var(--pad-m)"],
      ["--toast-font-size", "0.875rem"],
      ["--toast-line-height", "1.35"],
      ["--toast-title-weight", "var(--fw-semibold)"],
      ["--toast-gap", "calc(var(--vs-xs) / 2)"],
      ["--toast-progress-color", "var(--toast-tone)"],
      [
        "--toast-progress-track",
        "color-mix(in oklab, var(--toast-fg) 20%, transparent)",
      ],
      ["--toast-progress-size", "calc(var(--vs-xs) / 2)"],
      ["--toast-duration", "5s"],
      ["--toast-tone", "var(--primary)"],
    ]);

    for (const [token, value] of defaults) {
      expect(
        (
          viewport?.declarations.get(token) ?? toast?.declarations.get(token)
        )
          ?.replace(/\s+/g, " ")
          .replace(/\(\s+/g, "(")
          .replace(/\s+\)/g, ")")
          .trim(),
        token,
      ).toBe(value);
    }

    const toastDefinitions = [...contract.definitions]
      .filter((token) => token.startsWith("--toast-"))
      .sort();
    const toastReferences = new Set(
      contract.references.map((reference) => reference.variable),
    );

    expect(toastDefinitions).toEqual([...TOAST_PUBLIC_TOKENS].sort());
    for (const token of TOAST_PUBLIC_TOKENS) {
      expect(toastReferences, `${token} must be consumed`).toContain(token);
    }

    expect(toast?.declarations.get("color")).toBe("var(--toast-fg)");
    expect(toast?.declarations.get("background")).toBe("var(--toast-bg)");
    expect(toast?.declarations.get("padding-block")).toBe(
      "var(--toast-padding-block)",
    );
    expect(toast?.declarations.get("padding-inline")).toBe(
      "var(--toast-padding-inline)",
    );
    expect(toast?.declarations.get("gap")).toBe("var(--toast-gap)");
    expect(toast?.declarations.get("border-radius")).toBe(
      "var(--toast-radius)",
    );
    expect(toast?.declarations.get("box-shadow")).toBe(
      "var(--toast-shadow)",
    );

    const title = rules.find(
      (rule) =>
        rule.selectors.includes(
          ":where(.toast,.di-toast-slice)>strong",
        ) && rule.declarations.has("font-weight"),
    );
    const message = rules.find(
      (rule) =>
        rule.selectors.includes(":where(.toast,.di-toast-slice)>p") &&
        rule.declarations.has("font-size"),
    );
    const dismiss = rules.find(
      (rule) =>
        rule.selectors.includes(
          ':where(.toast,.di-toast-slice)>button[popovertargetaction="hide"]',
        ) && rule.declarations.has("font-size"),
    );

    expect(title?.declarations.get("font-size")).toBe(
      "var(--toast-font-size)",
    );
    expect(title?.declarations.get("font-weight")).toBe(
      "var(--toast-title-weight)",
    );
    expect(title?.declarations.get("line-height")).toBe(
      "var(--toast-line-height)",
    );
    expect(title?.declarations.get("letter-spacing")).toBe("var(--ls-h3)");
    expect(message?.declarations.get("font-size")).toBe(
      "var(--toast-font-size)",
    );
    expect(message?.declarations.get("line-height")).toBe(
      "var(--toast-line-height)",
    );
    expect(dismiss?.declarations.get("inline-size")).toBe("1.75rem");
    expect(dismiss?.declarations.get("block-size")).toBe("1.75rem");
    expect(dismiss?.declarations.get("font-size")).toBe("1.125rem");
    expect(dismiss?.declarations.get("font-weight")).toBe("var(--fw-medium)");
    expect(dismiss?.declarations.get("line-height")).toBe("1");
  });

  it("renders optional timed progress as a tracked, directional fill", async () => {
    const sourceName = "src/lib/drop-in.css";
    const css = await readWorkspaceFile(sourceName);
    const rules = getCssRules(css, sourceName);
    const ruleFor = (selector: string) =>
      rules.find((rule) => rule.selectors.includes(selector));
    const track = ruleFor(".toast-progress");
    const fill = ruleFor(".toast-progress::before");
    const pausedFill = ruleFor('.toast-progress[data-paused="true"]::before');
    const rtlFill = ruleFor(".toast-progress:dir(rtl)::before");
    const forcedToast = rules.find(
      (rule) =>
        rule.selectors.includes(":where(.toast,.di-toast-slice)") &&
        rule.atRules.some(
          (atRule) =>
            atRule.name === "media" &&
            atRule.prelude === "(forced-colors:active)",
        ),
    );

    expect(track?.declarations.get("background")).toBe(
      "var(--toast-progress-track)",
    );
    expect(track?.declarations.get("block-size")).toBe(
      "var(--toast-progress-size)",
    );
    expect(track?.declarations.get("inset-inline")).toBe(
      "var(--toast-padding-inline)",
    );
    expect(fill?.declarations.get("background")).toBe(
      "var(--toast-progress-color)",
    );
    expect(fill?.declarations.get("animation")).toBe(
      "toast-countdown var(--toast-duration) linear forwards",
    );
    expect(fill?.declarations.get("transform-origin")).toBe("left center");
    expect(fill?.declarations.get("--animation-reduced")?.trim()).toBe("none");
    expect(pausedFill?.declarations.get("animation-play-state")).toBe(
      "paused",
    );
    expect(rtlFill?.declarations.get("transform-origin")).toBe("right center");
    expect(forcedToast?.declarations.get("border")).toBe(
      "1px solid CanvasText",
    );
  });

  it("ships native, selected, loading, drag, drop, and controlled overlay states", async () => {
    const css = await readDistCss(DIST_FILES.index);
    const selectors = getCssRules(css, DIST_FILES.index).map(
      (rule) => rule.selector,
    );

    for (const fragment of [
      "progress",
      "meter.signaling",
      ".segmented-control>label:has(input:checked)",
      '.tooltip[data-state="open"]',
      '.tooltip-content)[data-state="open"]',
      ".toast-viewport.top-center",
      ".toast.success",
      '.option:is(.selected,[aria-selected="true"])',
      '.calendar-day[aria-current="date"]',
      '.data-table tbody tr:is(.selected,[aria-selected="true"])',
      ".data-table-loading",
      '.kanban-card:is(.keyboard-dragging,[data-keyboard-dragging="true"])',
      '.kanban-dropzone:is(.active,[data-drop-target="true"])',
    ]) {
      expect(
        selectors.some((selector) => selector.includes(fragment)),
        `missing selector containing ${fragment}`,
      ).toBe(true);
    }
  });

  it("declares reduced-motion decisions for skeleton, spinner, busy buttons, and toast progress", async () => {
    const css = await readDistCss(DIST_FILES.index);
    const rules = getCssRules(css, DIST_FILES.index);

    for (const selector of [
      ".skeleton",
      ".spinner",
      'button[aria-busy="true"]::after',
      ".toast-progress::before",
    ]) {
      const rule = rules.find((candidate) =>
        candidate.selectors.includes(selector),
      );
      expect(rule, selector).toBeDefined();
      expect(
        rule?.declarations.get("--animation-reduced")?.trim(),
        selector,
      ).toBe("none");
    }
  });

  it("keeps legacy migration aliases in the canonical bundle", async () => {
    const canonicalCss = await readWorkspaceFile("src/lib/drop-in.css");

    for (const legacyClass of [
      ".di-dialog",
      ".di-drawer",
      ".di-menu",
      ".di-toast-slice",
    ]) {
      expect(canonicalCss).toContain(legacyClass);
    }
  });
});

async function readRegistry(): Promise<Registry> {
  const registry: unknown = JSON.parse(
    await readWorkspaceFile("src/lib/registry.json"),
  );

  if (!registry || typeof registry !== "object") {
    throw new TypeError("registry.json must contain an object");
  }

  return registry as Registry;
}
