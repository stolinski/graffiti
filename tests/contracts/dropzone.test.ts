import { describe, expect, it } from "vitest";
import {
  DIST_FILES,
  getCssRules,
  readDistCss,
  readWorkspaceFile,
} from "./helpers";

const SOURCE_MAIN = "src/lib/drop-in.css";

describe("dropzone CSS contract", () => {
  it("keeps the transparent file input full-bleed and surfaces focus on its dropzone", async () => {
    const entries = [
      [SOURCE_MAIN, await readWorkspaceFile(SOURCE_MAIN)],
      [DIST_FILES.components, await readDistCss(DIST_FILES.components)],
    ] as const;

    for (const [sourceName, css] of entries) {
      const dropzone = getDropzoneBlock(css, sourceName);

      expect(dropzone, sourceName).toContain(
        'input[type="file"] { position: absolute; inset: 0; block-size: 100%; inline-size: 100%; opacity: 0; cursor: inherit; }',
      );
      expect(dropzone, sourceName).toContain(
        "&:focus-within { outline: var(--focus-ring); outline-offset: var(--focus-ring-offset); }",
      );
    }
  });

  it("keeps disabled dropzones inert-looking without losing forced-color contrast", async () => {
    const entries = [
      [SOURCE_MAIN, await readWorkspaceFile(SOURCE_MAIN)],
      [DIST_FILES.components, await readDistCss(DIST_FILES.components)],
    ] as const;

    for (const [sourceName, css] of entries) {
      const dropzone = getDropzoneBlock(css, sourceName);
      const rules = getCssRules(css, sourceName).filter(
        (rule) => rule.layer === "components",
      );
      const forcedColorsDisabled = rules.find(
        (rule) =>
          rule.selector === '.dropzone:has(input[type="file"]:disabled)' &&
          rule.atRules.some(
            (atRule) =>
              atRule.name === "media" &&
              atRule.prelude === "(forced-colors:active)",
          ),
      );
      const forcedColorsFocus = rules.find(
        (rule) =>
          rule.selector === ".dropzone:focus-within" &&
          rule.atRules.some(
            (atRule) =>
              atRule.name === "media" &&
              atRule.prelude === "(forced-colors:active)",
          ),
      );

      expect(dropzone, sourceName).toContain(
        '&:has(input[type="file"]:disabled) { opacity: 0.65; cursor: not-allowed; }',
      );
      expect(dropzone, sourceName).toContain(
        '&:hover:not(:has(input[type="file"]:disabled)) { border-color: var(--fg-3); background-color: var(--fg-05);',
      );
      expect(dropzone, sourceName).toContain(
        '&.dragover:not(:has(input[type="file"]:disabled)) { border-color: var(--accent, var(--fg-5)); background-color: var(--fg-1);',
      );
      expect(
        forcedColorsDisabled?.declarations.get("border-color"),
        sourceName,
      ).toBe("GrayText");
      expect(forcedColorsFocus?.declarations.get("outline"), sourceName).toBe(
        "var(--focus-ring)",
      );
    }
  });
});

function getDropzoneBlock(css: string, sourceName: string): string {
  const selector = ".dropzone";
  const selectorIndex = css.indexOf(`${selector} {`);

  if (selectorIndex === -1) {
    throw new Error(`Missing ${selector} rule in ${sourceName}`);
  }

  const blockStart = css.indexOf("{", selectorIndex);
  let depth = 1;

  for (let index = blockStart + 1; index < css.length; index += 1) {
    if (css[index] === "{") {
      depth += 1;
    } else if (css[index] === "}") {
      depth -= 1;
    }

    if (depth === 0) {
      return css
        .slice(blockStart + 1, index)
        .replaceAll(/\s+/g, " ")
        .trim();
    }
  }

  throw new Error(`Unclosed ${selector} rule in ${sourceName}`);
}
