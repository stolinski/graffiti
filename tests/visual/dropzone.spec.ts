import { readFile } from "node:fs/promises";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

const DIST_CSS = path.resolve(process.cwd(), "dist/index.css");

async function mountDropzones(page: Page): Promise<void> {
  await page.setContent(`
    <button id="before" type="button">Before</button>
    <label class="dropzone" id="enabled-dropzone">
      <input type="file" aria-label="Upload files">
      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3v12m-5-7 5-5 5 5M5 21h14" /></svg>
      <span>Drop files or click to upload</span>
    </label>
    <label class="dropzone" id="disabled-dropzone">
      <input type="file" aria-label="Unavailable upload" disabled>
      <span>Upload unavailable</span>
    </label>
    <button id="after" type="button">After</button>
  `);
  await page.addStyleTag({ content: await readFile(DIST_CSS, "utf8") });
}

test("keyboard focus is visible and file activation stays operable", async ({
  page,
}) => {
  await mountDropzones(page);

  const before = page.locator("#before");
  const dropzone = page.locator("#enabled-dropzone");
  const input = page.getByLabel("Upload files");

  await before.focus();
  await page.keyboard.press("Tab");

  await expect(input).toBeFocused();
  await expect(dropzone).toHaveCSS("outline-style", "solid");
  await expect(dropzone).toHaveCSS("outline-width", "2px");
  await expect(dropzone).toHaveCSS("outline-offset", "2px");
  await expect(input).toHaveCSS("cursor", "pointer");
  expect(
    await dropzone.evaluate((element) => element.matches(":focus-within")),
  ).toBe(true);

  const hitArea = await dropzone.evaluate((element) => {
    const inputElement = element.querySelector('input[type="file"]');
    const zone = element.getBoundingClientRect();
    const input = inputElement?.getBoundingClientRect();
    const points = [
      [zone.left + 8, zone.top + 8],
      [zone.right - 8, zone.bottom - 8],
    ];

    return {
      inputCoversZone:
        input !== undefined &&
        Math.abs(input.left - zone.left) <= 2 &&
        Math.abs(input.top - zone.top) <= 2 &&
        Math.abs(input.right - zone.right) <= 2 &&
        Math.abs(input.bottom - zone.bottom) <= 2,
      pointsHitDropzone: points.every(
        ([x, y]) =>
          document.elementFromPoint(x, y)?.closest("label") === element,
      ),
    };
  });
  expect(hitArea).toEqual({ inputCoversZone: true, pointsHitDropzone: true });

  const keyboardChooser = page.waitForEvent("filechooser");
  await input.press("Enter");
  await keyboardChooser;
  await expect(input).toHaveValue("");

  const pointerChooser = page.waitForEvent("filechooser");
  await dropzone.click({ position: { x: 4, y: 4 } });
  await pointerChooser;
  await expect(input).toHaveValue("");
});

test("disabled dropzones are distinct, skipped by Tab, and do not activate", async ({
  page,
}) => {
  await mountDropzones(page);

  const enabledInput = page.getByLabel("Upload files");
  const disabledInput = page.getByLabel("Unavailable upload");
  const disabledDropzone = page.locator("#disabled-dropzone");

  await enabledInput.focus();
  await page.keyboard.press("Tab");

  await expect(page.locator("#after")).toBeFocused();
  await expect(disabledInput).not.toBeFocused();
  await expect(disabledDropzone).toHaveCSS("cursor", "not-allowed");
  await expect(disabledDropzone).toHaveCSS("opacity", "0.65");
  await expect(disabledInput).toHaveCSS("cursor", "not-allowed");

  let fileChooserCount = 0;
  page.on("filechooser", () => {
    fileChooserCount += 1;
  });
  const box = await disabledDropzone.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.waitForTimeout(100);
  expect(fileChooserCount).toBe(0);
});

test("forced colors retain the visible focus ring and disabled distinction", async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active" });
  await mountDropzones(page);

  const dropzone = page.locator("#enabled-dropzone");
  const disabledDropzone = page.locator("#disabled-dropzone");
  await page.locator("#before").focus();
  await page.keyboard.press("Tab");

  const forcedColorStyles = await dropzone.evaluate((element) => {
    const styles = getComputedStyle(element);
    const disabledStyles = getComputedStyle(
      document.querySelector("#disabled-dropzone")!,
    );

    return {
      isForcedColors: matchMedia("(forced-colors: active)").matches,
      focusRingToken: getComputedStyle(document.documentElement)
        .getPropertyValue("--focus-ring")
        .trim(),
      outlineColor: styles.outlineColor,
      outlineStyle: styles.outlineStyle,
      outlineWidth: styles.outlineWidth,
      enabledBorderColor: styles.borderColor,
      disabledBorderColor: disabledStyles.borderColor,
      disabledOpacity: disabledStyles.opacity,
    };
  });

  await expect(dropzone).toHaveCSS("outline-style", "solid");
  await expect(dropzone).toHaveCSS("outline-width", "2px");
  await expect(disabledDropzone).toHaveCSS("cursor", "not-allowed");
  expect(forcedColorStyles.isForcedColors).toBe(true);
  expect(forcedColorStyles.focusRingToken).toBe("2px solid CanvasText");
  expect(forcedColorStyles.outlineColor).not.toBe("rgba(0, 0, 0, 0)");
  expect(forcedColorStyles.enabledBorderColor).not.toBe("rgba(0, 0, 0, 0)");
  expect(forcedColorStyles.disabledBorderColor).not.toBe("rgba(0, 0, 0, 0)");
  expect(forcedColorStyles.disabledOpacity).toBe("0.65");
});
