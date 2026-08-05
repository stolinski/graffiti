import { readFile } from "node:fs/promises";
import path from "node:path";
import { expect, test, type Locator } from "@playwright/test";

const DIST_CSS = path.resolve(process.cwd(), "dist/index.css");
const READING_WIDTH = 640;
const LAYOUT_GAP = 24;

const FIXTURE = `
  <!doctype html>
  <html lang="en">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      <div>
        <div id="plain-layout" class="layout-holy-grail">
          <aside class="rail-start flex">Plain start rail</aside>
          <article>Plain reading content</article>
          <aside class="rail-end flex">Plain end rail</aside>
        </div>

        <div id="without-start-layout" class="layout-holy-grail">
          <article id="without-start-content">Reading content without a start rail</article>
          <aside class="rail-end">End rail without a start rail</aside>
        </div>

        <div id="without-end-layout" class="layout-holy-grail">
          <aside class="rail-start">Start rail without an end rail</aside>
          <article id="without-end-content">Reading content without an end rail</article>
        </div>

        <div id="without-rails-layout" class="layout-holy-grail">
          <main id="without-rails-content">Reading content without rails</main>
        </div>

        <div id="drawer-layout" class="layout-holy-grail">
          <aside id="contents-drawer" class="rail-start drawer" popover="auto">
            Drawer contents
          </aside>
          <article>
            <button class="drawer-toggle" popovertarget="contents-drawer">Contents</button>
            Drawer reading content
          </article>
          <aside class="rail-end">Drawer end rail</aside>
        </div>
      </div>
    </body>
  </html>
`;

const FIXTURE_CSS = `
  html,
  body {
    margin: 0;
  }

  .layout-holy-grail {
    --max-width: ${READING_WIDTH}px;
    --layout-gap: ${LAYOUT_GAP}px;
    inline-size: 100%;
  }
`;

test.beforeEach(async ({ page }) => {
  await page.setContent(FIXTURE);
  await page.addStyleTag({ content: await readFile(DIST_CSS, "utf8") });
  await page.addStyleTag({ content: FIXTURE_CSS });
});

test("centers the reading track and removes rails at the inclusive boundaries", async ({
  page,
}) => {
  const layout = page.locator("#plain-layout");
  const startRail = layout.locator(":scope > .rail-start");
  const readingContent = layout.locator(":scope > article");
  const endRail = layout.locator(":scope > .rail-end");

  expect(await directChildRoles(layout)).toEqual([
    "rail-start",
    "content",
    "rail-end",
  ]);

  await page.setViewportSize({ width: 1200, height: 800 });
  await expect(startRail).toBeVisible();
  await expect(endRail).toBeVisible();
  await expectDesktopGrid(layout);
  await expectCentered(layout, readingContent);

  await page.setViewportSize({ width: 1025, height: 800 });
  await expect(endRail).toBeVisible();
  await expectDesktopGrid(layout);

  await page.setViewportSize({ width: 1024, height: 800 });
  await expect(startRail).toBeVisible();
  await expect(endRail).toBeHidden();
  await expectReadingGrid(layout);
  await expectCentered(layout, readingContent);
  await expect(startRail).toHaveCSS("grid-column-start", "1");
  await expect(readingContent).toHaveCSS("grid-column-start", "1");
  await expect(endRail).toHaveCSS("grid-column-start", "1");

  await page.setViewportSize({ width: 769, height: 800 });
  await expect(startRail).toBeVisible();
  await expect(endRail).toBeHidden();

  await page.setViewportSize({ width: 768, height: 800 });
  await expect(startRail).toBeHidden();
  await expect(endRail).toBeHidden();
  await expectReadingGrid(layout);
  await expectCentered(layout, readingContent);

  await page.setViewportSize({ width: 480, height: 800 });
  await expect(startRail).toBeHidden();
  await expect(endRail).toBeHidden();
  await expectReadingGrid(layout, 480);
  await expectCentered(layout, readingContent, 480);
});

test("keeps optional desktop rails in their named tracks", async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 });

  const withoutStart = page.locator("#without-start-layout");
  const withoutStartContent = page.locator("#without-start-content");
  const withoutStartEndRail = withoutStart.locator(":scope > .rail-end");
  expect(await directChildRoles(withoutStart)).toEqual(["content", "rail-end"]);
  await expectDesktopGrid(withoutStart);
  await expectCentered(withoutStart, withoutStartContent);
  await expect(withoutStartContent).toHaveCSS("grid-column-start", "2");
  await expect(withoutStartEndRail).toHaveCSS("grid-column-start", "3");
  await expectEndRailAfterContent(withoutStartEndRail, withoutStartContent);

  const withoutEnd = page.locator("#without-end-layout");
  const withoutEndStartRail = withoutEnd.locator(":scope > .rail-start");
  const withoutEndContent = page.locator("#without-end-content");
  expect(await directChildRoles(withoutEnd)).toEqual(["rail-start", "content"]);
  await expectDesktopGrid(withoutEnd);
  await expectCentered(withoutEnd, withoutEndContent);
  await expect(withoutEndStartRail).toHaveCSS("grid-column-start", "1");
  await expect(withoutEndContent).toHaveCSS("grid-column-start", "2");

  const withoutRails = page.locator("#without-rails-layout");
  const withoutRailsContent = page.locator("#without-rails-content");
  expect(await directChildRoles(withoutRails)).toEqual(["content"]);
  await expectDesktopGrid(withoutRails);
  await expectCentered(withoutRails, withoutRailsContent);
  await expect(withoutRailsContent).toHaveCSS("grid-column-start", "2");
});

test("keeps a start-rail popover inline above 768px and native on mobile", async ({
  page,
}) => {
  const layout = page.locator("#drawer-layout");
  const drawer = page.locator("#contents-drawer");
  const readingContent = layout.locator(":scope > article");
  const toggle = layout.getByRole("button", { name: "Contents" });

  expect(await directChildRoles(layout)).toEqual([
    "rail-start",
    "content",
    "rail-end",
  ]);
  await expect(drawer).toHaveJSProperty("popover", "auto");

  await page.setViewportSize({ width: 769, height: 800 });
  await expect(drawer).toBeVisible();
  await expect(drawer).toHaveCSS("position", "static");
  await expect(toggle).toBeHidden();
  await expectCentered(layout, readingContent);

  await page.setViewportSize({ width: 768, height: 800 });
  await expect(drawer).toBeHidden();
  await expect(toggle).toBeVisible();
  await expectCentered(layout, readingContent);

  await toggle.click();
  await expect(drawer).toBeVisible();
  await expect(drawer).toHaveCSS("position", "fixed");
  await expect(drawer).toHaveCSS("inline-size", "300px");
  expect(
    await drawer.evaluate((element) => element.matches(":popover-open")),
  ).toBe(true);
});

async function directChildRoles(layout: Locator): Promise<string[]> {
  return layout.evaluate((element) =>
    Array.from(element.children).map((child) => {
      if (child.classList.contains("rail-start")) return "rail-start";
      if (child.classList.contains("rail-end")) return "rail-end";
      return "content";
    }),
  );
}

async function expectDesktopGrid(layout: Locator): Promise<void> {
  const styles = await gridStyles(layout);
  const tracks = pixelTracks(styles.gridTemplateColumns);

  expect(styles.display).toBe("grid");
  expect(styles.columnGap).toBe(`${LAYOUT_GAP}px`);
  expect(styles.alignItems).toBe("start");
  expect(tracks).toHaveLength(3);
  expect(tracks[1]!).toBeCloseTo(READING_WIDTH, 1);
  expect(tracks[0]!).toBeCloseTo(tracks[2]!, 1);
}

async function expectReadingGrid(
  layout: Locator,
  expectedWidth = READING_WIDTH,
): Promise<void> {
  const styles = await gridStyles(layout);
  const tracks = pixelTracks(styles.gridTemplateColumns);

  expect(tracks).toEqual([expectedWidth]);
  expect(styles.alignContent).toBe("start");
  expect(styles.justifyContent).toBe("center");
}

async function expectCentered(
  layout: Locator,
  readingContent: Locator,
  expectedWidth = READING_WIDTH,
): Promise<void> {
  const layoutBox = await layout.boundingBox();
  const contentBox = await readingContent.boundingBox();

  expect(layoutBox).not.toBeNull();
  expect(contentBox).not.toBeNull();
  expect(contentBox!.width).toBeCloseTo(expectedWidth, 1);
  expect(
    Math.abs(
      contentBox!.x +
        contentBox!.width / 2 -
        (layoutBox!.x + layoutBox!.width / 2),
    ),
  ).toBeLessThanOrEqual(0.5);
}

async function expectEndRailAfterContent(
  endRail: Locator,
  readingContent: Locator,
): Promise<void> {
  const endRailBox = await endRail.boundingBox();
  const contentBox = await readingContent.boundingBox();

  expect(endRailBox).not.toBeNull();
  expect(contentBox).not.toBeNull();
  expect(endRailBox!.x).toBeGreaterThanOrEqual(
    contentBox!.x + contentBox!.width + LAYOUT_GAP - 0.5,
  );
}

async function gridStyles(layout: Locator): Promise<{
  display: string;
  gridTemplateColumns: string;
  columnGap: string;
  alignItems: string;
  alignContent: string;
  justifyContent: string;
}> {
  return layout.evaluate((element) => {
    const styles = getComputedStyle(element);

    return {
      display: styles.display,
      gridTemplateColumns: styles.gridTemplateColumns,
      columnGap: styles.columnGap,
      alignItems: styles.alignItems,
      alignContent: styles.alignContent,
      justifyContent: styles.justifyContent,
    };
  });
}

function pixelTracks(gridTemplateColumns: string): number[] {
  return gridTemplateColumns
    .trim()
    .split(/\s+/)
    .map((track) => Number.parseFloat(track));
}
