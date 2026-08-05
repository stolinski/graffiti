import { describe, expect, it } from "vitest";
// @ts-expect-error — ESM .mjs without types
import {
  findExact,
  searchAll,
  normalizeQuery,
} from "../../scripts/graffiti-lookup.mjs";

const registry = {
  patterns: [
    { name: "card", role: "Content surface", related: ["stat-card"] },
    { name: "stat-card", role: "Single metric surface" },
  ],
  patternGroups: [
    {
      name: "aspect-ratios",
      role: "Lock aspect ratio",
      members: ["aspect-square", "aspect-video"],
    },
  ],
  tokens: [
    { name: "--font-sans", role: "Default sans stack", category: "typography" },
  ],
  tokenGroups: [
    {
      name: "vertical-spacing",
      role: "Vertical rhythm scale",
      category: "spacing",
      matches: "--vs-*",
      members: ["--vs-xs", "--vs-s", "--vs-m"],
    },
  ],
};

const registryV2 = {
  ...registry,
  tokenInventory: [
    {
      name: "--vs-m",
      role: "Medium spacing reference",
      category: "spacing",
      tier: "primitive-reference",
      public: true,
    },
    {
      name: "--_component-mix",
      role: "Internal color calculation",
      category: "color",
      tier: "private-calculated",
      public: false,
    },
  ],
};

describe("normalizeQuery", () => {
  it("strips a leading dot from class queries", () => {
    expect(normalizeQuery(".card")).toBe("card");
  });
  it("leaves token queries with -- intact", () => {
    expect(normalizeQuery("--vs-m")).toBe("--vs-m");
  });
  it("leaves bare names intact", () => {
    expect(normalizeQuery("card")).toBe("card");
  });
});

describe("findExact", () => {
  it("matches a pattern by name", () => {
    const m = findExact(registry, "card");
    expect(m).toMatchObject({ kind: "pattern", entry: { name: "card" } });
  });

  it("matches a pattern with a leading dot", () => {
    const m = findExact(registry, ".card");
    expect(m.kind).toBe("pattern");
    expect(m.entry.name).toBe("card");
  });

  it("matches a pattern-group by name", () => {
    const m = findExact(registry, "aspect-ratios");
    expect(m.kind).toBe("pattern-group");
  });

  it("matches a token by name including the -- prefix", () => {
    const m = findExact(registry, "--font-sans");
    expect(m.kind).toBe("token");
  });

  it("matches a token-group by name", () => {
    const m = findExact(registry, "vertical-spacing");
    expect(m.kind).toBe("token-group");
    expect(m.memberOf).toBeUndefined();
  });

  it("resolves a token to its group and records memberOf", () => {
    const m = findExact(registry, "--vs-m");
    expect(m.kind).toBe("token-group");
    expect(m.entry.name).toBe("vertical-spacing");
    expect(m.memberOf).toBe("--vs-m");
  });

  it("resolves a class to its pattern-group and records memberOf", () => {
    const m = findExact(registry, "aspect-video");
    expect(m.kind).toBe("pattern-group");
    expect(m.entry.name).toBe("aspect-ratios");
    expect(m.memberOf).toBe("aspect-video");
  });

  it("returns null when nothing matches", () => {
    expect(findExact(registry, "banana")).toBeNull();
  });

  it("returns flat Registry v2 metadata for grouped and private tokens", () => {
    expect(findExact(registryV2, "--vs-m")).toMatchObject({
      kind: "token",
      entry: { tier: "primitive-reference", public: true },
    });
    expect(findExact(registryV2, "--_component-mix")).toMatchObject({
      kind: "token",
      entry: { tier: "private-calculated", public: false },
    });
  });
});

describe("searchAll", () => {
  it("ranks exact name match highest", () => {
    const results = searchAll(registry, "card");
    expect(results[0].entry.name).toBe("card");
  });

  it("finds entries by substring in role text", () => {
    const results = searchAll(registry, "rhythm");
    expect(results.some((r) => r.entry.name === "vertical-spacing")).toBe(true);
  });

  it("finds a group via a member name", () => {
    const results = searchAll(registry, "aspect-square");
    expect(results.some((r) => r.entry.name === "aspect-ratios")).toBe(true);
  });

  it("returns empty array when nothing matches", () => {
    expect(searchAll(registry, "zzzznope")).toEqual([]);
  });

  it("hides private Registry v2 tokens unless explicitly requested", () => {
    expect(searchAll(registryV2, "component")).toEqual([]);
    expect(
      searchAll(registryV2, "component", { includePrivate: true }),
    ).toHaveLength(1);
  });
});
