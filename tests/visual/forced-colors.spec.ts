import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  expect,
  test,
  type Locator,
  type Page,
  type TestInfo,
} from "@playwright/test";

const DIST_DIR = path.resolve(process.cwd(), "dist");

test("custom controls preserve state, boundaries, and focus in forced colors", async ({
  browserName,
  page,
}, testInfo) => {
  test.skip(
    browserName !== "chromium",
    "Chromium provides reliable forced-colors emulation",
  );

  await page.emulateMedia({ forcedColors: "active" });
  await applyFixture(page);
  await page.evaluate(async () => {
    await Promise.allSettled(
      document.getAnimations().map((animation) => animation.finished),
    );
  });

  expect(
    await page.evaluate(() => matchMedia("(forced-colors: active)").matches),
  ).toBe(true);

  const selectStyles = await styles(page.locator("#fixture-select"));
  expect(["auto", "menulist"]).toContain(selectStyles.appearance);
  expect(selectStyles.backgroundImage).toBe("none");

  const toggleOff = await styles(page.locator("#toggle-off"));
  const toggleOn = await styles(page.locator("#toggle-on"));
  const toggleDisabled = await styles(page.locator("#toggle-disabled"));
  const toggleOffKnob = await pseudoStyles(page.locator("#toggle-off"));
  const toggleOnKnob = await pseudoStyles(page.locator("#toggle-on"));
  expect(toggleOn.backgroundColor).not.toBe(toggleOff.backgroundColor);
  expect(toggleOnKnob.backgroundColor).not.toBe(toggleOffKnob.backgroundColor);
  expect(toggleDisabled.opacity).toBe("0.65");

  const chipOff = await styles(page.locator("#chip-off"));
  const chipOn = await styles(page.locator("#chip-on"));
  const chipDisabled = await styles(page.locator("#chip-disabled"));
  expect(chipOn.backgroundColor).not.toBe(chipOff.backgroundColor);
  expect(chipOn.borderTopColor).not.toBe(chipOff.borderTopColor);
  expect(chipDisabled.opacity).toBe("0.65");

  await expect(page.locator("#fixture-tag")).toHaveCSS(
    "border-top-style",
    "solid",
  );
  await expect(page.locator("#tab-current")).toHaveCSS(
    "text-decoration-line",
    "underline",
  );
  await expect(page.locator("#tab-other")).toHaveCSS(
    "text-decoration-line",
    "none",
  );
  await expect(page.locator("#dropzone-dragover")).toHaveCSS(
    "outline-style",
    "solid",
  );
  await expect(page.locator("#list-row")).toHaveCSS(
    "border-top-style",
    "solid",
  );
  await expect(page.locator("#sidebar-current")).toHaveCSS(
    "outline-style",
    "solid",
  );
  await expect(page.locator("#bottom-current")).toHaveCSS(
    "text-decoration-line",
    "underline",
  );
  await expect(page.locator("#workbench-current")).toHaveCSS(
    "text-decoration-line",
    "underline",
  );

  await attachScreenshot(page, testInfo, "forced-colors-controls");

  const drawer = page.locator("#fixture-drawer");
  await drawer.evaluate((element) => {
    (element as HTMLElement).showPopover();
  });
  await expect(drawer).toBeVisible();
  await drawer.evaluate(async (element) => {
    await Promise.allSettled(
      element
        .getAnimations({ subtree: true })
        .map((animation) => animation.finished),
    );
  });
  await expect(drawer).toHaveCSS("border-top-style", "solid");

  await attachScreenshot(page, testInfo, "forced-colors-drawer");

  await drawer.evaluate((element) => {
    (element as HTMLElement).hidePopover();
  });
  await expect(drawer).toBeHidden();
  await page.emulateMedia({ forcedColors: "none" });
  expect(
    await page.evaluate(() => matchMedia("(forced-colors: active)").matches),
  ).toBe(false);

  for (const selector of [
    "#fixture-select",
    "#toggle-on",
    "#chip-on",
    "#fixture-tag",
    "#tab-other",
    "#workbench-other",
  ]) {
    const target = page.locator(selector);
    await target.focus();
    await expect(target, selector).toHaveCSS("outline-style", "solid");
  }

  await page.locator("#dropzone-file").focus();
  await expect(page.locator("#dropzone-focus")).toHaveCSS(
    "outline-style",
    "solid",
  );

  await attachScreenshot(page, testInfo, "normal-color-focus");
});

async function applyFixture(page: Page): Promise<void> {
  const css = await readFile(path.join(DIST_DIR, "index.css"), "utf8");

  await page.setContent(`
    <main class="fixture">
      <label>
        Select
        <select id="fixture-select">
          <option>Alpha</option>
          <option>Beta</option>
        </select>
      </label>

      <section class="fixture-row" aria-label="Toggle states">
        <label><input id="toggle-off" class="toggle" type="checkbox"> Off</label>
        <label><input id="toggle-on" class="toggle" type="checkbox" checked> On</label>
        <label><input id="toggle-disabled" class="toggle" type="checkbox" disabled> Disabled</label>
      </section>

      <section class="fixture-row" aria-label="Chip and tag states">
        <button id="chip-off" class="chip" aria-pressed="false">Unselected</button>
        <button id="chip-on" class="chip" aria-pressed="true">Selected</button>
        <button id="chip-disabled" class="chip" disabled>Disabled</button>
        <a id="fixture-tag" class="tag" href="#metadata">Metadata</a>
      </section>

      <div class="tabs pill" style="--tab-count: 2">
        <details name="fixture-tabs" open style="--n: 1">
          <summary id="tab-current">Current</summary>
          <p>Current panel</p>
        </details>
        <details name="fixture-tabs" style="--n: 2">
          <summary id="tab-other">Other</summary>
          <p>Other panel</p>
        </details>
      </div>

      <label id="dropzone-focus" class="dropzone">
        <input id="dropzone-file" type="file">
        <span>Choose files</span>
      </label>
      <label id="dropzone-dragover" class="dropzone dragover">
        <input type="file">
        <span>Release files</span>
      </label>

      <nav class="sidebar-nav minimal" aria-label="Sidebar fixture">
        <a id="sidebar-current" href="#current" aria-current="page">Current</a>
        <a href="#other">Other</a>
      </nav>

      <nav class="bottom-nav fixture-bottom-nav" aria-label="Bottom fixture">
        <a id="bottom-current" href="#home" aria-current="page">Home</a>
        <a href="#search">Search</a>
      </nav>

      <nav class="list-nav" aria-label="List fixture">
        <a id="list-row" href="#profile">Profile</a>
      </nav>

      <aside class="workbench-panel">
        <header>
          <strong>Preview</strong>
          <div class="tabs">
            <button id="workbench-current" type="button" aria-pressed="true">Preview</button>
            <button id="workbench-other" type="button">Code</button>
          </div>
        </header>
        <div class="body">Workbench body</div>
      </aside>

      <button type="button" popovertarget="fixture-drawer">Open drawer</button>
      <aside id="fixture-drawer" class="drawer right" popover>
        <h2>Drawer</h2>
        <button type="button" popovertarget="fixture-drawer" popovertargetaction="hide">Close</button>
      </aside>
    </main>
  `);
  await page.addStyleTag({ content: css });
  await page.addStyleTag({
    content: `
      .fixture {
        display: grid;
        gap: 2rem;
        max-inline-size: 60rem;
        padding: 2rem;
      }
      .fixture-row {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }
      .fixture-bottom-nav {
        position: static;
        inset: auto;
      }
      #fixture-drawer {
        padding: 2rem;
      }
    `,
  });
}

async function styles(locator: Locator) {
  return locator.evaluate((element) => {
    const computed = getComputedStyle(element);
    return {
      appearance: computed.appearance,
      backgroundColor: computed.backgroundColor,
      backgroundImage: computed.backgroundImage,
      borderTopColor: computed.borderTopColor,
      opacity: computed.opacity,
    };
  });
}

async function pseudoStyles(locator: Locator) {
  return locator.evaluate((element) => {
    const computed = getComputedStyle(element, "::before");
    return { backgroundColor: computed.backgroundColor };
  });
}

async function attachScreenshot(
  page: Page,
  testInfo: TestInfo,
  name: string,
): Promise<void> {
  const screenshotPath = testInfo.outputPath(`${name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach(name, {
    path: screenshotPath,
    contentType: "image/png",
  });
}
