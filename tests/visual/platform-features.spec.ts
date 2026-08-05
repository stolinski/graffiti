import { expect, test } from "@playwright/test";
import { gotoStable } from "./helpers";

test("dropdown instances keep start and end anchors local", async ({
  page,
}) => {
  await gotoStable(page, "/ui-blocks/dropdown");

  const dropdowns = page.locator(".demo-section .dropdown");
  await expect(dropdowns).toHaveCount(2);
  await expect(dropdowns.nth(0)).not.toHaveAttribute("style", /--anchor/);
  await expect(dropdowns.nth(1)).not.toHaveAttribute("style", /--anchor/);

  const supportsLocalAnchors = await page.evaluate(
    () =>
      CSS.supports("anchor-scope: --dropdown") &&
      CSS.supports("position-anchor: --dropdown") &&
      CSS.supports("position-area: block-end span-inline-end"),
  );

  const startTrigger = page.getByRole("button", { name: "Options" });
  const startMenu = page.locator("#dropdown-options");
  await startTrigger.click();
  await expect(startMenu).toBeVisible();
  await expect(startMenu).toHaveJSProperty("popover", "auto");
  await expect(startMenu.getByRole("link", { name: "Profile" })).toBeVisible();

  if (supportsLocalAnchors) {
    const triggerBox = await startTrigger.boundingBox();
    const menuBox = await startMenu.boundingBox();
    expect(triggerBox).not.toBeNull();
    expect(menuBox).not.toBeNull();
    expect(Math.abs(menuBox!.x - triggerBox!.x)).toBeLessThanOrEqual(1);
    expect(menuBox!.y).toBeGreaterThanOrEqual(
      triggerBox!.y + triggerBox!.height,
    );
  }

  const endTrigger = page.getByRole("button", { name: "Actions" });
  const endMenu = page.locator("#dropdown-actions");
  await endTrigger.click();
  await expect(startMenu).toBeHidden();
  await expect(endMenu).toBeVisible();

  if (supportsLocalAnchors) {
    const triggerBox = await endTrigger.boundingBox();
    const menuBox = await endMenu.boundingBox();
    expect(triggerBox).not.toBeNull();
    expect(menuBox).not.toBeNull();
    expect(
      Math.abs(
        menuBox!.x + menuBox!.width - (triggerBox!.x + triggerBox!.width),
      ),
    ).toBeLessThanOrEqual(1);
    expect(menuBox!.y).toBeGreaterThanOrEqual(
      triggerBox!.y + triggerBox!.height,
    );
  }
});

test("safe-area consumers resolve defaults and inherited host overrides", async ({
  page,
}) => {
  await gotoStable(page, "/ui-blocks/mobile");

  await expect(page.locator(".app-shell")).toBeVisible();
  await expect(page.locator(".bottom-nav").first()).toBeVisible();
  await expect(page.locator(".bottom-sheet")).toBeVisible();

  const defaultAppShellPadding = await page.evaluate(() => {
    const styles = getComputedStyle(document.querySelector(".app-shell")!);
    return [
      styles.paddingTop,
      styles.paddingRight,
      styles.paddingBottom,
      styles.paddingLeft,
    ];
  });
  expect(defaultAppShellPadding).toEqual(["0px", "0px", "0px", "0px"]);

  await page.addStyleTag({
    content: `
      .demo-section {
        --safe-top: 11px;
        --safe-right: 13px;
        --safe-bottom: 17px;
        --safe-left: 19px;
      }
    `,
  });

  const metrics = await page.evaluate(() => {
    const appShell = getComputedStyle(document.querySelector(".app-shell")!);
    const bottomNav = getComputedStyle(document.querySelector(".bottom-nav")!);
    const bottomSheet = getComputedStyle(
      document.querySelector(".bottom-sheet")!,
    );
    const rootSize = Number.parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );

    return {
      appShell: [
        appShell.paddingTop,
        appShell.paddingRight,
        appShell.paddingBottom,
        appShell.paddingLeft,
      ],
      bottomNavInset: Number.parseFloat(bottomNav.bottom),
      bottomSheetPadding: Number.parseFloat(bottomSheet.paddingBottom),
      rootSize,
    };
  });

  expect(metrics.appShell).toEqual(["11px", "13px", "17px", "19px"]);
  expect(metrics.bottomNavInset).toBeCloseTo(17 + metrics.rootSize * 0.5, 4);
  expect(metrics.bottomSheetPadding).toBeCloseTo(17 + metrics.rootSize, 4);
});

test("tooltips expose one description for pointer and keyboard users", async ({
  page,
}) => {
  await gotoStable(page, "/elements");

  const pseudoTrigger = page.getByRole("button", { name: "Save to draft" });
  const trigger = page.getByRole("button", { name: "Formatting help" });
  const tooltip = page.getByRole("tooltip", {
    name: "Bold text is supported.",
  });
  const tooltipSection = page.locator(".demo-section", { has: trigger });

  await expect(pseudoTrigger).toHaveAccessibleName("Save to draft");
  await expect(pseudoTrigger).toHaveAttribute("data-tooltip", "Save to draft");
  await pseudoTrigger.hover();
  expect(
    await pseudoTrigger.evaluate(
      (element) => getComputedStyle(element, "::after").content,
    ),
  ).toBe('"Save to draft"');

  await page.mouse.move(0, 0);
  await expect(trigger).toHaveAccessibleName("Formatting help");
  await expect(trigger).toHaveAccessibleDescription("Bold text is supported.");
  await expect(tooltip).toBeHidden();
  expect(await tooltipSection.ariaSnapshot()).not.toContain(
    'tooltip "Bold text is supported."',
  );

  await trigger.hover();
  await expect(tooltip).toBeVisible();

  await page.mouse.move(0, 0);
  await expect(tooltip).toBeHidden();

  await trigger.focus();
  await expect(trigger).toBeFocused();
  await expect(tooltip).toBeVisible();
  expect(await tooltipSection.ariaSnapshot()).toContain(
    'tooltip "Bold text is supported."',
  );

  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(tooltip).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(trigger).not.toBeFocused();
  await expect(tooltip).toBeHidden();
});
