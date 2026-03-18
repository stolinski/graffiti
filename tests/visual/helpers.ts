import { expect, type Page } from "@playwright/test";

const STABILIZE_STYLES = `
  *, *::before, *::after {
    animation-delay: 0s !important;
    animation-duration: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    caret-color: transparent !important;
  }

  [data-testid="current-time"],
  time {
    visibility: hidden !important;
  }
`;

export async function gotoStable(page: Page, route: string): Promise<void> {
  await page.goto(route, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: STABILIZE_STYLES });
  await page.waitForTimeout(120);
}

export async function expectRouteScreenshot(
  page: Page,
  route: string,
  fileName: string,
): Promise<void> {
  await gotoStable(page, route);
  await expect(page).toHaveScreenshot(fileName, {
    fullPage: true,
    animations: "disabled",
    maxDiffPixelRatio: 0.01,
  });
}
