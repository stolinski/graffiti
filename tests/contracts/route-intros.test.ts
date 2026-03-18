import { describe, expect, it } from "vitest";
import { ROUTE_INTRO_KEYS } from "../../src/docs/content/routes/schema.js";
import { getRouteIntro } from "../../src/docs/content/runtime.js";

describe("docs route intro metadata", () => {
  it("loads all configured route intros at runtime", () => {
    expect(ROUTE_INTRO_KEYS).toEqual([
      "base",
      "utilities",
      "elements",
      "ui-blocks",
    ]);

    for (const routeKey of ROUTE_INTRO_KEYS) {
      const intro = getRouteIntro(routeKey);

      expect(intro).toBeDefined();
      expect(intro?.key).toBe(routeKey);
      expect(intro?.title.length).toBeGreaterThan(0);
      expect(intro?.tagline.length).toBeGreaterThan(0);
      expect(intro?.markdown.length).toBeGreaterThan(0);
    }
  });

  it("returns undefined for routes without intro metadata", () => {
    expect(getRouteIntro("changelog")).toBeUndefined();
  });
});
