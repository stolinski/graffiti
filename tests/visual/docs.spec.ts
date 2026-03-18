import { test } from "@playwright/test";
import { expectRouteScreenshot } from "./helpers";

const DOC_ROUTES = [
  { route: "/", snapshot: "docs-home.png" },
  { route: "/base", snapshot: "docs-base.png" },
  { route: "/elements", snapshot: "docs-elements.png" },
  { route: "/utilities", snapshot: "docs-utilities.png" },
  { route: "/ui-blocks", snapshot: "docs-ui-blocks.png" },
];

for (const { route, snapshot } of DOC_ROUTES) {
  test(`visual regression: ${route}`, async ({ page }) => {
    await expectRouteScreenshot(page, route, snapshot);
  });
}
