import { readFile } from "node:fs/promises";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

const DIST_DIR = path.resolve(process.cwd(), "dist");

test("Decks contract families remain coherent across desktop and mobile", async ({
  page,
}) => {
  await applyFixture(page);

  await expect(page.locator(".segmented-control")).toBeVisible();
  const fixtureToasts = page.locator(".fixture-toast-viewport .toast");
  await expect(fixtureToasts).toHaveCount(2);
  await expect(fixtureToasts.first().locator(".toast-progress")).toHaveCount(0);
  await expect(fixtureToasts.last().locator(".toast-progress")).toHaveCount(1);
  await expect(fixtureToasts.last()).toHaveCSS("--toast-duration", "5s");
  await expect(
    page.locator(".data-table tbody tr[aria-selected=true]"),
  ).toBeVisible();
  await expect(page.locator(".kanban-column")).toHaveCount(2);
  expect(
    await page.locator("main").evaluate((element) => element.scrollWidth),
  ).toBeLessThanOrEqual(
    await page.locator("main").evaluate((element) => element.clientWidth),
  );

  await expect(page).toHaveScreenshot("decks-contracts.png", {
    fullPage: true,
    animations: "disabled",
    maxDiffPixelRatio: 0.01,
  });
});

test("Decks contracts support dark color, RTL, and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await applyFixture(page, "rtl");

  await expect(page.locator("main")).toHaveAttribute("dir", "rtl");
  await expect(page.locator(".skeleton").first()).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(page.locator(".spinner")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".toast-progress")).toHaveCSS(
    "animation-name",
    "none",
  );

  const startToast = await page.locator(".toast.success").boundingBox();
  const viewport = await page.locator(".fixture-toast-viewport").boundingBox();
  expect(startToast).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(startToast!.x).toBeGreaterThanOrEqual(viewport!.x);

  await expect(page).toHaveScreenshot("decks-contracts-dark-rtl.png", {
    fullPage: true,
    animations: "disabled",
    maxDiffPixelRatio: 0.01,
  });
});

test("Decks contract states remain visible in forced colors", async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: "active" });
  await applyFixture(page);

  for (const selector of [".segmented-control label:has(input:checked)"]) {
    await expect(page.locator(selector), selector).toHaveCSS(
      "border-top-style",
      "solid",
    );
  }

  await expect(page.locator(".kanban-dropzone.active")).toHaveCSS(
    "outline-style",
    "solid",
  );

  for (const [selected, comparison] of [
    [".option[aria-selected=true]", ".option[data-active=true]"],
    [".calendar-day[aria-pressed=true]", ".calendar-day:first-child"],
    [".data-table tbody tr[aria-selected=true]", ".data-table-loading"],
  ]) {
    const selectedColor = await page
      .locator(selected)
      .first()
      .evaluate((element) => getComputedStyle(element).backgroundColor);
    const comparisonColor = await page
      .locator(comparison)
      .first()
      .evaluate((element) => getComputedStyle(element).backgroundColor);
    expect(selectedColor, selected).not.toBe(comparisonColor);
  }

  await expect(page.locator(".kanban-card.keyboard-dragging")).toHaveCSS(
    "outline-style",
    "solid",
  );

  const spinnerColors = await page.locator(".spinner").evaluate((element) => {
    const styles = getComputedStyle(element);
    return [styles.borderTopColor, styles.borderRightColor];
  });
  expect(spinnerColors[0]).not.toBe(spinnerColors[1]);
});

async function applyFixture(
  page: Page,
  direction: "ltr" | "rtl" = "ltr",
): Promise<void> {
  const css = await readFile(path.join(DIST_DIR, "index.css"), "utf8");

  await page.setContent(`
    <!doctype html>
    <html>
      <head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
      <body>
        <main class="fixture" dir="${direction}">
          <header class="fixture-heading">
            <h1>Decks contracts</h1>
            <fieldset class="segmented-control compact">
              <legend class="visually-hidden">View</legend>
              <label><input type="radio" name="view" checked> List</label>
              <label><input type="radio" name="view"> Board</label>
            </fieldset>
          </header>

          <section class="fixture-grid" aria-label="Overlay and feedback contracts">
            <div class="stack">
              <h2>Overlay</h2>
              <div class="popover stack"><strong>Profile</strong><a href="#profile">Open profile</a></div>
              <span class="tooltip open">
                <span class="tooltip-trigger"><button aria-describedby="fixture-tip">Help</button></span>
                <span id="fixture-tip" class="tooltip-content" role="tooltip">Keyboard help</span>
              </span>
            </div>

            <div id="fixture-toast-viewport" class="toast-viewport fixture-toast-viewport bottom-end" popover="manual">
              <div class="toast-item">
                <article class="toast" role="status">
                  <strong>Project archived</strong>
                  <p>The project moved to Archive.</p>
                  <button type="button" popovertarget="fixture-toast-viewport" popovertargetaction="hide" aria-label="Dismiss project archived notification">×</button>
                </article>
              </div>
              <div class="toast-item">
                <article class="toast success" role="status" style="--toast-duration: 5s">
                  <strong>Upload complete</strong>
                  <p>Your file is ready.</p>
                  <button type="button" popovertarget="fixture-toast-viewport" popovertargetaction="hide" aria-label="Dismiss upload complete notification">×</button>
                  <span class="toast-progress" aria-hidden="true"></span>
                </article>
              </div>
            </div>
          </section>

          <section class="fixture-grid" aria-label="Form and async contracts">
            <div class="stack">
              <h2>Choice</h2>
              <div class="combobox" aria-expanded="true">
                <label for="fixture-combobox">Owner</label>
                <input id="fixture-combobox" role="combobox" aria-controls="fixture-listbox" aria-expanded="true" value="Ada">
                <div id="fixture-listbox" class="listbox open" role="listbox">
                  <button class="option" role="option" aria-selected="true">Ada Lovelace</button>
                  <button class="option" role="option" data-active="true">Grace Hopper</button>
                </div>
              </div>
              <div class="tag-input"><span class="tag">CSS <button aria-label="Remove CSS">×</button></span><input aria-label="Add tag"></div>
            </div>

            <div class="stack">
              <h2>Async</h2>
              <progress class="progress" value="68" max="100">68%</progress>
              <meter class="meter signaling" min="0" max="100" low="30" high="80" value="72">72%</meter>
              <p class="cluster"><span class="spinner" role="status" aria-label="Loading"></span> Loading</p>
              <span class="skeleton text" aria-hidden="true">Loading title</span>
              <div class="empty compact"><h3>No archived projects</h3><p>Archived work appears here.</p></div>
            </div>
          </section>

          <section class="fixture-grid" aria-label="Calendar and data table contracts">
            <div class="stack">
              <h2>Calendar</h2>
              <section class="calendar" aria-label="Choose a date">
                <header class="calendar-header"><button aria-label="Previous">‹</button><strong>July 2026</strong><button aria-label="Next">›</button></header>
                <table class="calendar-grid">
                  <thead><tr><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th><th>Su</th></tr></thead>
                  <tbody><tr><td><button class="calendar-day">13</button></td><td><button class="calendar-day">14</button></td><td><button class="calendar-day">15</button></td><td><button class="calendar-day">16</button></td><td><button class="calendar-day" aria-current="date" aria-pressed="true">17</button></td><td><button class="calendar-day">18</button></td><td><button class="calendar-day">19</button></td></tr></tbody>
                </table>
              </section>
            </div>

            <section class="data-table compact sticky">
              <h2>Table</h2>
              <div class="data-table-toolbar"><input type="search" aria-label="Search" placeholder="Search"><button>Columns</button></div>
              <div class="table"><table><thead><tr><th aria-sort="ascending"><button class="data-table-sort">Project</button></th><th>Status</th><th>Actions</th></tr></thead><tbody><tr aria-selected="true"><td>Graffiti</td><td><span class="tag success">Active</span></td><td class="data-table-actions"><button>Open</button></td></tr><tr class="data-table-loading"><td colspan="3"><span class="skeleton text" aria-hidden="true">Loading</span></td></tr></tbody></table></div>
            </section>
          </section>

          <section class="stack" aria-label="Kanban contracts">
            <h2>Kanban</h2>
            <div class="kanban-board">
              <section class="kanban-column drag-over"><header class="kanban-column-header"><h3>Doing</h3><span class="tag">1</span></header><button class="card kanban-card keyboard-dragging"><strong>Contract tests</strong><span>Scott</span></button><button class="kanban-dropzone active">Move here</button></section>
              <section class="kanban-column"><header class="kanban-column-header"><h3>Done</h3><span class="tag success">1</span></header><button class="card kanban-card selected"><strong>Registry</strong><span>Kathy</span></button><button class="kanban-dropzone invalid">Unavailable</button></section>
            </div>
          </section>
        </main>
      </body>
    </html>
  `);
  await page.addStyleTag({ content: css });
  await page.addStyleTag({
    content: `
      .fixture {
        display: grid;
        gap: var(--vs-xl);
        max-inline-size: 72rem;
        margin-inline: auto;
        padding: var(--pad-xl);
      }
      .fixture-heading,
      .fixture-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
        gap: var(--vs-l);
        align-items: start;
      }
      .fixture-heading { align-items: center; }
      .fixture-heading > * { margin: 0; }
      .fixture .popover,
      .fixture .listbox,
      .fixture .calendar { position: static; }
      .fixture-toast-viewport {
        position: static;
        inset: auto;
        translate: none;
        max-inline-size: 100%;
      }
      .fixture .tooltip-content { position: static; margin: 0; }
      .fixture .kanban-board { max-inline-size: 100%; }
    `,
  });
  await page
    .locator("#fixture-toast-viewport")
    .evaluate((element: HTMLElement) => element.showPopover());
}
