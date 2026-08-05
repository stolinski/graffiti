import { describe, expect, it } from "vitest";
import { readWorkspaceFile } from "./helpers";

const TOKEN_TIERS = [
  "primitive-reference",
  "global-semantic",
  "component-contract",
  "private-calculated",
] as const;

interface TokenInventoryEntry {
  name: string;
  tier: (typeof TOKEN_TIERS)[number];
  public: boolean;
  inheritance: "inherited" | "non-inheriting";
  defaultStability: "stable" | "fallback" | "calculated";
  themeScope: "inherited" | "rederived" | "component-local" | "internal";
  registered: boolean;
  declared: boolean;
  consumed: boolean;
  declarationCount: number;
  consumptionCount: number;
}

interface TokenRegistry {
  schemaVersion: number;
  tokenContract: {
    privatePrefix: string;
  };
  tokenSets: { members: string[] }[];
  tokenInventory: TokenInventoryEntry[];
}

describe("Registry v2 token tiers", () => {
  it("publishes one exhaustive flat classification", async () => {
    const registry = await readTokenRegistry();
    const names = registry.tokenInventory.map((token) => token.name);
    const classifiedMembers = registry.tokenSets.flatMap(
      (tokenSet) => tokenSet.members,
    );

    expect(registry.schemaVersion).toBe(2);
    expect(registry.tokenContract.privatePrefix).toBe("--_component-");
    expect(new Set(names).size).toBe(names.length);
    expect([...classifiedMembers].sort()).toEqual([...names].sort());
  });

  it("locks the reviewed inventory and tier counts", async () => {
    const registry = await readTokenRegistry();
    const counts = Object.fromEntries(
      TOKEN_TIERS.map((tier) => [
        tier,
        registry.tokenInventory.filter((token) => token.tier === tier).length,
      ]),
    );

    expect(registry.tokenInventory).toHaveLength(738);
    expect(counts).toEqual({
      "primitive-reference": 408,
      "global-semantic": 143,
      "component-contract": 142,
      "private-calculated": 45,
    });
  });

  it("distinguishes the named public examples from calculations", async () => {
    const registry = await readTokenRegistry();
    const inventory = new Map(
      registry.tokenInventory.map((token) => [token.name, token]),
    );

    expect(inventory.get("--blue")).toMatchObject({
      tier: "primitive-reference",
      public: true,
    });
    expect(inventory.get("--primary")).toMatchObject({
      tier: "global-semantic",
      public: true,
    });
    for (const name of [
      "--button-color",
      "--bubble-bg",
      "--surface-bg",
      "--drawer-bg",
      "--toast-font-size",
      "--toast-gap",
      "--toast-line-height",
      "--toast-padding-block",
      "--toast-padding-inline",
      "--toast-title-weight",
    ]) {
      expect(inventory.get(name), name).toMatchObject({
        tier: "component-contract",
        public: true,
        themeScope: "component-local",
      });
    }
    expect(inventory.get("--fluid-min")).toMatchObject({
      tier: "private-calculated",
      public: false,
      themeScope: "internal",
    });
  });

  it("records stable, fallback, inheritance, and theme-scope behavior", async () => {
    const registry = await readTokenRegistry();
    const inventory = new Map(
      registry.tokenInventory.map((token) => [token.name, token]),
    );

    expect(inventory.get("--button-color")?.defaultStability).toBe("stable");
    expect(inventory.get("--drawer-bg")?.defaultStability).toBe("fallback");
    expect(inventory.get("--gap")?.inheritance).toBe("non-inheriting");
    expect(inventory.get("--primary-opaque-1")?.themeScope).toBe("rederived");
    expect(inventory.get("--primary")?.themeScope).toBe("inherited");

    const consumedOnly = registry.tokenInventory.filter(
      (token) => token.consumed && !token.declared && !token.registered,
    );
    expect(consumedOnly).toHaveLength(62);
    expect(
      consumedOnly.every((token) => token.defaultStability === "fallback"),
    ).toBe(true);
  });
});

async function readTokenRegistry(): Promise<TokenRegistry> {
  const registry: unknown = JSON.parse(
    await readWorkspaceFile("src/lib/registry.json"),
  );
  if (
    !registry ||
    typeof registry !== "object" ||
    !("schemaVersion" in registry) ||
    !("tokenContract" in registry) ||
    !("tokenSets" in registry) ||
    !Array.isArray(registry.tokenSets) ||
    !("tokenInventory" in registry) ||
    !Array.isArray(registry.tokenInventory)
  ) {
    throw new TypeError("registry.json is missing the Registry v2 token shape");
  }

  return registry as unknown as TokenRegistry;
}
