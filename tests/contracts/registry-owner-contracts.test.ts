import { describe, expect, it } from "vitest";
// @ts-expect-error ESM .mjs module has no generated declarations.
import { lintCss } from "../../scripts/graffiti-lint.mjs";

interface RelationContract {
  name: string;
  owner: string;
  selector: string;
  state?: string;
  alias?: boolean;
}

interface PatternContract {
  name: string;
  canonicalSelector: string;
  qualifiedHosts: string[];
  modifierContracts: RelationContract[];
  stateContracts: {
    name: string;
    selectors: { selector: string }[];
    aliases: { selector: string }[];
  }[];
  slots: {
    name: string | null;
    selector: string;
    direct: boolean;
    required: boolean;
  }[];
  internalCandidates: { selector: string; public: false }[];
  aliases: {
    name: string;
    deprecated: string | null;
    lifecycle: {
      status: string;
      since: string | null;
      removalVersion: string | null;
      replacement: string | null;
    };
  }[];
  layer: string | null;
  source: { file: string };
}

interface RegistryFixture {
  patterns: PatternContract[];
  patternGroups: {
    name: string;
    members: string[];
    memberContracts: PatternContract[];
  }[];
  patternGroupMembers: PatternContract[];
  classContracts: {
    name: string;
    kind: string;
    public: boolean;
    owners: string[];
    relations: RelationContract[];
    lifecycle: { status: string; removalVersion: string | null } | null;
  }[];
  coverage: {
    internalClassCandidates: string[];
    unexplainedSelectors: string[];
  };
}

const CSS = `
@layer components, layouts;

@layer components {
  /**
   * @pattern toggle
   * @role Native checkbox switch
   * @example <input class="toggle" type="checkbox">
   * @selector input[type="checkbox"].toggle
   * @qualified-hosts input[type="checkbox"]
   * @modifiers compact
   * @states
   *   checked: &:checked
   */
  input[type="checkbox"].toggle { appearance: none; }
  input[type="checkbox"].toggle.compact { inline-size: 2rem; }
  input[type="checkbox"].toggle:checked { background: green; }

  /**
   * @pattern drawer
   * @role Native popover drawer
   * @example <aside class="drawer" popover></aside>
   * @selector [popover].drawer
   * @qualified-hosts [popover]
   * @modifiers end
   * @states
   *   open: &:popover-open
   */
  [popover].drawer { position: fixed; }
  [popover].drawer.end { inset-inline-end: 0; }
  [popover].drawer:popover-open { display: block; }

  /**
   * @pattern dropdown
   * @role Anchored dropdown owner
   * @example <div class="dropdown"><button popovertarget="menu">Open</button><div id="menu" class="dropdown-menu" popover></div></div>
   * @slots
   *   required trigger: > [popovertarget]
   *   required menu: > .dropdown-menu[popover]
   */
  .dropdown { anchor-scope: --menu; }
  .dropdown > [popovertarget] { anchor-name: --menu; }
  .dropdown > .dropdown-menu[popover] { position-anchor: --menu; }

  /**
   * @pattern dropdown-menu
   * @role Dropdown popover surface
   * @example <div class="dropdown-menu" popover></div>
   * @selector .dropdown-menu[popover]
   * @qualified-hosts [popover]
   */
  .dropdown-menu[popover] { position: absolute; }

  /**
   * @pattern timeline
   * @role Event timeline
   * @example <ol class="timeline"><li class="active"><span class="marker"></span></li></ol>
   * @modifiers horizontal
   * @states
   *   active: li.active > .marker
   *   completed: li.completed > .marker
   * @slots
   *   required item: > li
   *   required marker: li > .marker
   */
  .timeline { display: grid; }

  /**
   * @pattern steps
   * @role Workflow steps
   * @example <ol class="steps"><li class="completed"><span class="marker"></span></li></ol>
   * @modifiers horizontal
   * @states
   *   active: li.active > .marker
   *   completed: li.completed > .marker
   * @slots
   *   required item: > li
   *   required marker: li > .marker
   */
  .steps { display: grid; }
  :is(.timeline, .steps).horizontal { grid-auto-flow: column; }
  :is(.timeline, .steps) li.active > .marker { color: blue; }
  :is(.timeline, .steps) li.completed > .marker { color: green; }

  /**
   * @pattern navigation
   * @role Current-page navigation
   * @example <nav class="navigation"><a aria-current="page">Current</a></nav>
   * @states
   *   current: > a[aria-current="page"]
   * @state-aliases
   *   current: > a.active
   * @slots
   *   required item: > a
   */
  .navigation { display: flex; }
  .navigation > a:is([aria-current="page"], .active) { color: blue; }

  /**
   * @pattern menu
   * @role Canonical menu
   * @example <div class="menu"></div>
   * @aliases legacy-menu
   * @alias-deprecated legacy-menu: Use .menu; scheduled for removal in 6.0.0
   * @alias-lifecycle
   *   legacy-menu: deprecated; since=5.0.0; remove=6.0.0; replacement=.menu
   */
  .menu,
  .legacy-menu { display: block; }

  /**
   * @pattern-group density
   * @members density-s, density-l
   * @role Density utilities
   * @example <div class="density-s"></div>
   */
  .density-s { padding: .25rem; }
  .density-l { padding: 1rem; }
}

@layer layouts {
  /**
   * @pattern layout-holy-grail
   * @role Three-track page layout
   * @example <div class="layout-holy-grail"><aside class="rail-start"></aside><main></main><aside class="rail-end"></aside></div>
   * @slots
   *   optional start-rail: > .rail-start
   *   required content: > main
   *   optional end-rail: > .rail-end
   */
  .layout-holy-grail { display: grid; }
  .layout-holy-grail > .rail-start { grid-column: 1; }
  .layout-holy-grail > main { grid-column: 2; }
  .layout-holy-grail > .rail-end { grid-column: 3; }
  .layout-holy-grail .drawer-toggle { display: none; }
}
`;

const result = lintCss(CSS, { sourcePath: "owners.css" }) as {
  violations: { rule: string; message: string }[];
  registry: RegistryFixture;
};
const pattern = (name: string) =>
  result.registry.patterns.find((candidate) => candidate.name === name);
const classContract = (name: string) =>
  result.registry.classContracts.find((candidate) => candidate.name === name);

describe("Registry v2 explicit owner contracts", () => {
  it("records canonical qualified hosts for toggle, drawer, and dropdown menu", () => {
    expect(result.violations).toEqual([]);
    expect(pattern("toggle")).toMatchObject({
      canonicalSelector: 'input[type="checkbox"].toggle',
      qualifiedHosts: ['input[type="checkbox"]'],
    });
    expect(pattern("drawer")).toMatchObject({
      canonicalSelector: "[popover].drawer",
      qualifiedHosts: ["[popover]"],
    });
    expect(pattern("dropdown-menu")).toMatchObject({
      canonicalSelector: ".dropdown-menu[popover]",
      qualifiedHosts: ["[popover]"],
    });
  });

  it("keeps timeline and steps item relations owner-specific", () => {
    expect(classContract("marker")?.owners).toEqual(["steps", "timeline"]);
    expect(classContract("active")?.owners).toEqual([
      "navigation",
      "steps",
      "timeline",
    ]);
    expect(
      classContract("active")?.relations.map((relation) => [
        relation.kind,
        relation.owner,
        relation.alias ?? false,
      ]),
    ).toEqual(
      expect.arrayContaining([
        ["state", "navigation", true],
        ["state", "steps", false],
        ["state", "timeline", false],
      ]),
    );
  });

  it("models preferred ARIA state separately from its class alias", () => {
    const current = pattern("navigation")?.stateContracts[0];
    expect(current).toMatchObject({
      name: "current",
      selectors: [{ selector: '> a[aria-current="page"]' }],
      aliases: [{ selector: "> a.active" }],
    });
    expect(classContract("active")).toMatchObject({
      public: true,
      kind: "state",
    });
  });

  it("publishes only explicit Holy Grail slots and retains descendants as internal evidence", () => {
    expect(pattern("layout-holy-grail")?.slots).toEqual([
      expect.objectContaining({
        name: "start-rail",
        selector: "> .rail-start",
        direct: true,
        required: false,
      }),
      expect.objectContaining({
        name: "content",
        selector: "> main",
        direct: true,
        required: true,
      }),
      expect.objectContaining({
        name: "end-rail",
        selector: "> .rail-end",
        direct: true,
        required: false,
      }),
    ]);
    expect(classContract("drawer-toggle")).toMatchObject({
      kind: "internal-candidate",
      public: false,
    });
    expect(
      pattern("layout-holy-grail")?.internalCandidates.map(
        (candidate) => candidate.selector,
      ),
    ).toContain(".drawer-toggle");
  });

  it("emits structured alias lifecycle without removing the legacy deprecated field", () => {
    const alias = pattern("menu")?.aliases[0];
    expect(alias?.deprecated).toContain("Use .menu");
    expect(alias?.lifecycle).toEqual({
      status: "deprecated",
      since: "5.0.0",
      removalVersion: "6.0.0",
      replacement: ".menu",
      reason: null,
    });
    expect(classContract("legacy-menu")?.lifecycle).toMatchObject({
      status: "deprecated",
      removalVersion: "6.0.0",
    });
  });

  it("emits full pattern contracts for every group member", () => {
    const group = result.registry.patternGroups.find(
      (candidate) => candidate.name === "density",
    );
    expect(group?.members).toEqual(["density-s", "density-l"]);
    expect(group?.memberContracts).toHaveLength(2);
    expect(result.registry.patternGroupMembers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "density-s",
          kind: "pattern-group-member",
          canonicalSelector: ".density-s",
          layer: "components",
          qualifiedHosts: [],
          slots: [],
        }),
      ]),
    );
  });
});

describe("Registry v2 owner validation", () => {
  it("fails when a modifier is declared for one owner but only used by another", () => {
    const mismatch = lintCss(`
      @layer components {
        /**
         * @pattern card
         * @role Card
         * @example <article class="card"></article>
         * @modifiers compact
         */
        .card { display: block; }
        /**
         * @pattern panel
         * @role Panel
         * @example <section class="panel"></section>
         */
        .panel { display: block; }
        .panel.compact { padding: .5rem; }
      }
    `) as { violations: { rule: string; message: string }[] };

    expect(mismatch.violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rule: "owner-relation-evidence",
          message: expect.stringContaining("owned by card"),
        }),
        expect.objectContaining({
          rule: "selector-coverage",
          message: expect.stringContaining(".panel.compact"),
        }),
      ]),
    );
  });

});
