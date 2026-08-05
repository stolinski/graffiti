import { describe, expect, it } from "vitest";
import {
  DIST_FILES,
  getCssDeclarations,
  getCssRules,
  readDistCss,
  readWorkspaceFile,
  type CssRuleContract,
} from "./helpers";

const SOURCE_MAIN = "src/lib/drop-in.css";

describe("forced-colors control contracts", () => {
  it("ships structural and system-color fallbacks in full and component bundles", async () => {
    const entries = [
      [SOURCE_MAIN, await readWorkspaceFile(SOURCE_MAIN)],
      [DIST_FILES.index, await readDistCss(DIST_FILES.index)],
      [DIST_FILES.components, await readDistCss(DIST_FILES.components)],
    ] as const;

    for (const [name, css] of entries) {
      const rules = getCssRules(css, name);
      const declaration = (selector: string, property: string) =>
        getForcedColorDeclaration(rules, selector, property);

      expect(declaration("select", "appearance"), name).toBe("auto");
      expect(declaration("select", "background-image"), name).toBe("none");
      expect(
        declaration(
          'input:is([type="checkbox"],[type="radio"])',
          "accent-color",
        ),
        name,
      ).toBe("Highlight");

      expect(
        declaration('input[type="checkbox"].toggle', "background"),
        name,
      ).toBe("Canvas");
      expect(
        declaration('input[type="checkbox"].toggle::before', "background"),
        name,
      ).toBe("ButtonText");
      expect(
        declaration('input[type="checkbox"].toggle:checked', "background"),
        name,
      ).toBe("Highlight");
      expect(
        declaration(
          'input[type="checkbox"].toggle:checked::before',
          "background",
        ),
        name,
      ).toBe("HighlightText");
      expect(
        declaration('input[type="checkbox"].toggle:disabled', "border-color"),
        name,
      ).toBe("GrayText");

      expect(
        declaration('.chip:is([aria-pressed="true"],.selected)', "background"),
        name,
      ).toBe("Highlight");
      expect(
        declaration(
          '.chip:is(:disabled,[aria-disabled="true"])',
          "border-color",
        ),
        name,
      ).toBe("GrayText");
      expect(declaration(".tag", "border-color"), name).toBe("CanvasText");
      expect(declaration("a.tag", "border-color"), name).toBe("LinkText");
      expect(
        declaration(".tabs>details[open]>summary", "text-decoration"),
        name,
      ).toBe("underline");
      expect(
        declaration(
          '.dropzone.dragover:not(:has(input[type="file"]:disabled))',
          "outline",
        ),
        name,
      ).toBe("2px solid Highlight");
      expect(declaration("[popover].drawer", "border"), name).toBe(
        "1px solid CanvasText",
      );
      expect(declaration(".list-nav>:is(a,button)", "border"), name).toBe(
        "1px solid ButtonBorder",
      );
      expect(
        declaration(
          '.sidebar-nav>:is([aria-current="page"],.active)',
          "outline",
        ),
        name,
      ).toBe("2px solid Highlight");
      expect(
        declaration('.icon-rail>a[aria-current="page"]', "border-color"),
        name,
      ).toBe("Highlight");
      expect(
        declaration(
          '.workbench-panel>header>.tabs>button[aria-pressed="true"]',
          "text-decoration",
        ),
        name,
      ).toBe("underline");
    }
  });

  it("does not opt controls out of the user's forced palette", async () => {
    const css = await readWorkspaceFile(SOURCE_MAIN);
    const optOuts = getCssDeclarations(css, SOURCE_MAIN)
      .filter(
        (declaration) =>
          declaration.property === "forced-color-adjust" &&
          declaration.value === "none",
      )
      .map((declaration) => declaration.selector);

    expect(optOuts).toEqual([]);
  });
});

function getForcedColorDeclaration(
  rules: readonly CssRuleContract[],
  selector: string,
  property: string,
): string | undefined {
  return rules
    .find(
      (rule) =>
        rule.layer === "components" &&
        rule.selectors.includes(selector) &&
        rule.atRules.some(
          (atRule) =>
            atRule.name === "media" &&
            atRule.prelude === "(forced-colors:active)",
        ),
    )
    ?.declarations.get(property);
}
