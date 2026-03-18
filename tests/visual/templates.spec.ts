import { test } from "@playwright/test";
import { expectRouteScreenshot } from "./helpers";

const TEMPLATE_ROUTES = [
  { route: "/templates", snapshot: "templates-index.png" },
  { route: "/templates/landing", snapshot: "templates-landing.png" },
  { route: "/templates/dashboard", snapshot: "templates-dashboard.png" },
  { route: "/templates/blog", snapshot: "templates-blog.png" },
  { route: "/templates/settings", snapshot: "templates-settings.png" },
  { route: "/templates/ai-chat", snapshot: "templates-ai-chat.png" },
  {
    route: "/templates/docs-portal",
    snapshot: "templates-docs-portal.png",
  },
];

for (const { route, snapshot } of TEMPLATE_ROUTES) {
  test(`visual regression: ${route}`, async ({ page }) => {
    await expectRouteScreenshot(page, route, snapshot);
  });
}
