import { describe, expect, it } from "vitest";
// @ts-expect-error ESM .mjs module has no generated declarations.
import { lintCss } from "../../scripts/graffiti-lint.mjs";

interface SourceEvidence {
  file: string;
  line: number | null;
  column: number | null;
  endLine: number | null;
}

interface AtRuleEvidence {
  kind?: string;
  name: string;
  query: string;
}

interface SelectorContract {
  canonicalSelector: string;
  condition: {
    kind: string;
    atRules: AtRuleEvidence[];
  };
  conditions: Omit<AtRuleEvidence, "kind">[];
  requirements: string[];
  source: SourceEvidence;
  sources: SourceEvidence[];
}

interface TokenContract {
  name: string;
  declared: boolean;
  consumed: boolean;
  default: string | null;
  requirements: string[];
}

interface PatternContract {
  name: string;
  componentTokens: { name: string; default: string | null }[];
}

interface RegistryFixture {
  patterns: PatternContract[];
  selectorContracts: SelectorContract[];
  tokenInventory: TokenContract[];
  elements: { name: string }[];
}

const tokenSet = (
  name: string,
  matches: string,
  tier: "primitive-reference" | "component-contract",
  defaultStability: "stable" | "fallback",
) => `
/**
 * @token-set ${name}
 * @matches ${matches}
 * @tier ${tier}
 * @visibility public
 * @default ${defaultStability}
 * @role Selector evidence fixture tokens
 */`;

const CSS = `
@layer base, components;

${tokenSet("fixture-primitives", "--plain-color, --modern-color", "primitive-reference", "stable")}
${tokenSet("fixture-component", "--adaptive-color", "component-contract", "fallback")}

@layer base {
  :root {
    /**
     * @token --plain-color
     * @category color
     * @role Plain fixture color
     */
    --plain-color: red;
    /**
     * @token --modern-color
     * @category color
     * @role Modern fixture color
     */
    --modern-color: oklch(65% .2 30);
  }
}

@layer components {
  /**
   * @pattern evidence-card
   * @role Exercises Registry v2 selector evidence
   * @example <article class="evidence-card"><span class="part"></span></article>
   */
  .evidence-card,
  article.evidence-card {
    display: block;

    > .part {
      color: var(--plain-color);

      @media (width > 40rem) {
        color: var(--adaptive-color, oklch(70% .2 30));
      }

      @supports (display: grid) {
        display: grid;
      }

      @container evidence (width > 20rem) {
        inline-size: 100%;
      }

      @media (forced-colors: active) {
        forced-color-adjust: none;
      }

      @media (orientation: landscape) {
        @supports (display: subgrid) {
          grid-template-columns: subgrid;
        }
      }
    }
  }

  .evidence-card > .part {
    outline: 1px solid;
  }

  .evidence-card[popover] {
    margin: auto;
  }

  @keyframes evidence-pulse {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}
`;

const result = lintCss(CSS, { sourcePath: "selector-evidence.css" }) as {
  violations: { rule: string; message: string }[];
  registry: RegistryFixture;
};
const { registry } = result;

const findSelector = (canonicalSelector: string, conditionKind: string) =>
  registry.selectorContracts.find(
    (contract) =>
      contract.canonicalSelector === canonicalSelector &&
      contract.condition.kind === conditionKind,
  );

describe("Registry v2 selector evidence", () => {
  it("normalizes nested selectors and preserves every parent selector", () => {
    expect(result.violations).toEqual([]);
    expect(findSelector(".evidence-card>.part", "normal")).toBeDefined();
    expect(findSelector("article.evidence-card>.part", "normal")).toBeDefined();
    expect(
      registry.selectorContracts.some((contract) =>
        contract.canonicalSelector.includes(" >"),
      ),
    ).toBe(false);
  });

  it("keeps conditions structured and separate while merging duplicate evidence", () => {
    const normal = findSelector(".evidence-card>.part", "normal");
    const media = findSelector(".evidence-card>.part", "media");
    const supports = findSelector(".evidence-card>.part", "supports");
    const container = findSelector(".evidence-card>.part", "container");
    const forcedColors = findSelector(".evidence-card>.part", "forced-colors");
    const compound = findSelector(".evidence-card>.part", "compound");

    expect(normal?.sources).toHaveLength(2);
    expect(normal?.source).toEqual(normal?.sources[0]);
    expect(media?.conditions).toEqual([
      { name: "media", query: "(width>40rem)" },
    ]);
    expect(supports?.condition.atRules).toEqual([
      {
        kind: "supports",
        name: "supports",
        query: "(display:grid)",
      },
    ]);
    expect(container?.condition.atRules[0]).toMatchObject({
      kind: "container",
      name: "container",
      query: "evidence (width>20rem)",
    });
    expect(forcedColors?.condition.atRules[0]).toMatchObject({
      kind: "forced-colors",
      name: "media",
    });
    expect(compound?.condition.atRules.map((atRule) => atRule.kind)).toEqual([
      "media",
      "supports",
    ]);
  });

  it("keeps feature evidence granular to selectors and declarations", () => {
    const tokens = new Map(
      registry.tokenInventory.map((token) => [token.name, token]),
    );
    const normal = findSelector(".evidence-card>.part", "normal");
    const media = findSelector(".evidence-card>.part", "media");
    const popover = findSelector(".evidence-card[popover]", "normal");

    expect(tokens.get("--plain-color")?.requirements).not.toContain("oklch");
    expect(tokens.get("--modern-color")?.requirements).toContain("oklch");
    expect(normal?.requirements).not.toContain("oklch");
    expect(media?.requirements).toContain("oklch");
    expect(popover?.requirements).toContain("popover");
  });

  it("retains nested consumed-only defaults and excludes keyframe steps", () => {
    const adaptiveColor = registry.tokenInventory.find(
      (token) => token.name === "--adaptive-color",
    );
    const pattern = registry.patterns.find(
      (candidate) => candidate.name === "evidence-card",
    );

    expect(adaptiveColor).toMatchObject({
      declared: false,
      consumed: true,
    });
    expect(adaptiveColor?.default?.replaceAll(" ", "")).toBe("oklch(70%.230)");
    expect(adaptiveColor?.requirements).toContain("oklch");
    const componentToken = pattern?.componentTokens.find(
      (token) => token.name === "--adaptive-color",
    );
    expect(componentToken?.default?.replaceAll(" ", "")).toBe("oklch(70%.230)");
    expect(registry.elements.map((element) => element.name)).not.toEqual(
      expect.arrayContaining(["from", "to"]),
    );
  });
});
