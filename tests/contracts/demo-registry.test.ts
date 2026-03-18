import { describe, expect, it } from "vitest";
import { demoRegistry, getDemo, hasDemo } from "../../src/docs/demos/registry";

describe("docs demo registry", () => {
  it("resolves known demos with component and code loaders", async () => {
    const demo = getDemo("Buttons");

    expect(demo).toBeDefined();
    expect(demo?.component).toBeTypeOf("function");
    expect(demo?.code).toBeTypeOf("function");

    const code = await demo!.code();

    expect(typeof code).toBe("string");
    expect(code).toContain("<button");
  });

  it("returns false and undefined for unknown demos", () => {
    expect(hasDemo("NonExistent")).toBe(false);
    expect(getDemo("NonExistent")).toBeUndefined();
  });

  it("registers all current demo components", () => {
    expect(Object.keys(demoRegistry).length).toBeGreaterThanOrEqual(56);
    expect(hasDemo("Buttons")).toBe(true);
    expect(hasDemo("TypographyScale")).toBe(true);
    expect(hasDemo("FormValidation")).toBe(true);
  });
});
