import { readFile } from "node:fs/promises";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

const DIST_DIR = path.resolve(process.cwd(), "dist");

async function readBundles(...fileNames: string[]): Promise<string> {
  return Promise.all(
    fileNames.map((fileName) =>
      readFile(path.join(DIST_DIR, fileName), "utf8"),
    ),
  ).then((bundles) => bundles.join("\n"));
}

async function applyCss(
  page: Page,
  css: string,
  markup: string,
): Promise<void> {
  await page.setContent(markup);
  await page.addStyleTag({ content: css });
}

async function getResetStyles(page: Page, css: string) {
  await applyCss(page, css, '<button class="reset">Reset</button>');

  return page.locator("button").evaluate((element) => {
    const styles = getComputedStyle(element);

    return {
      backgroundImage: styles.backgroundImage,
      borderTopWidth: styles.borderTopWidth,
      boxShadow: styles.boxShadow,
      padding: styles.padding,
    };
  });
}

async function getChipStyles(page: Page, css: string) {
  await applyCss(page, css, '<button class="chip">Chip</button>');

  return page.locator("button").evaluate((element) => {
    const styles = getComputedStyle(element);

    return {
      backgroundImage: styles.backgroundImage,
      borderRadius: styles.borderRadius,
      boxShadow: styles.boxShadow,
      padding: styles.padding,
    };
  });
}

test("minimal, standard, and composed utilities match the index reset cascade", async ({
  page,
}) => {
  const indexCss = await readBundles("index.css");
  const expected = await getResetStyles(page, indexCss);
  const variants = [
    await readBundles("minimal.css"),
    await readBundles("standard.css"),
    await readBundles("core.css", "utilities.css"),
    await readBundles("utilities.css", "core.css"),
  ];

  expect(expected).toEqual({
    backgroundImage: "none",
    borderTopWidth: "0px",
    boxShadow: "none",
    padding: "0px",
  });

  for (const css of variants) {
    expect(await getResetStyles(page, css)).toEqual(expected);
  }
});

test("core and components compose like index in either import order", async ({
  page,
}) => {
  const expected = await getChipStyles(page, await readBundles("index.css"));
  const variants = [
    await readBundles("components.css"),
    await readBundles("core.css", "components.css"),
    await readBundles("components.css", "core.css"),
  ];

  expect(expected).toEqual({
    backgroundImage: "none",
    borderRadius: "32px",
    boxShadow: "none",
    padding: "4px 12px",
  });

  for (const css of variants) {
    expect(await getChipStyles(page, css)).toEqual(expected);
  }
});

test("layouts outrank utilities regardless of composed import order", async ({
  page,
}) => {
  const variants = [
    await readBundles("index.css"),
    await readBundles("standard.css"),
    await readBundles("core.css", "layouts.css", "utilities.css"),
    await readBundles("utilities.css", "layouts.css", "core.css"),
  ];

  for (const css of variants) {
    await applyCss(page, css, '<div class="flex layout-card"></div>');
    await expect(page.locator("div")).toHaveCSS("display", "grid");
  }
});

test("every layered entry enforces reduced motion and print safety", async ({
  page,
}) => {
  const fileNames = [
    "index.css",
    "core.css",
    "minimal.css",
    "standard.css",
    "components.css",
    "utilities.css",
    "layouts.css",
  ];

  for (const fileName of fileNames) {
    const css = await readBundles(fileName);

    await page.emulateMedia({ media: "screen", reducedMotion: "reduce" });
    await applyCss(
      page,
      css,
      '<div id="motion" style="animation: spin 1s linear infinite; transition-duration: 2s"></div>',
    );

    const motionStyles = await page.locator("#motion").evaluate((element) => {
      const styles = getComputedStyle(element);

      return {
        animationName: styles.animationName,
        scrollBehavior: styles.scrollBehavior,
        transitionDuration: Number.parseFloat(styles.transitionDuration),
      };
    });

    expect(motionStyles.animationName, fileName).toBe("none");
    expect(motionStyles.scrollBehavior, fileName).toBe("auto");
    expect(motionStyles.transitionDuration, fileName).toBeLessThanOrEqual(
      0.001,
    );

    await page.emulateMedia({ media: "print", reducedMotion: "no-preference" });
    await applyCss(page, css, '<div class="no-print">Print</div>');
    await expect(page.locator(".no-print"), fileName).toHaveCSS(
      "display",
      "none",
    );
  }
});
