# Graffiti Annotation Spec

Structured comments describe every pattern and classify every Graffiti-owned token in `src/lib/drop-in.css`. These annotations:

1. Force authors (human or agent) to articulate the role and intended use of every public surface.
2. Feed `registry.json` — the canonical machine-readable catalogue of Graffiti's patterns and tokens, consumed by lookup tools, MCP servers, and downstream lint.

Lint is enforced by `pnpm lint:graffiti` (also runs pre-commit). A missing or malformed annotation fails the lint.

## Scope

The canonical CSS inventory comes from `src/lib/drop-in.css`. Theme and bundle discovery are separate registry inputs. The private-token documentation guard also scans consumer docs, agent docs, and the Graffiti skill so implementation details cannot leak into guidance.

## What requires annotation

A rule **requires annotation** if its selector is exactly `.classname` — one class, no compound, no descendant, no qualifier, no state — at the top level of a `@layer` block.

A custom property declaration **requires a descriptive annotation** if it appears at `:root` inside `@layer base`.

Every custom property registered with `@property`, declared anywhere, or consumed through `var()` must also match exactly one `@token-set`. This token-stream inventory includes nested syntax that a CSS AST may retain as raw text. A consumed-only component hook with a fallback is therefore as explicit as a root declaration.

Everything else is exempt:

| Construct | Annotated? | Why |
|---|---|---|
| `.box { ... }` | yes | Primary pattern definition |
| `.box.ghost { ... }` | no | Modifier — list it in parent's `@modifiers` |
| `.box > *`, `.card > header` | no | Internal child rule of an annotated pattern |
| `:is(form) .row { ... }` | no | Qualified context override |
| `&.modifier { ... }` inside a nested rule | no | Modifier of the enclosing pattern |
| Any rule inside `@container`/`@media`/`@supports` | no | Adaptive override of an already-annotated pattern |
| `--bg: ...` inside `@layer themes` or a scope | token-set only | Theme/scope override; not a new descriptive declaration |
| `--bg: ...` at `:root` inside `@layer base` | token + token-set | Canonical descriptive declaration and tier classification |
| `@property --gap` | token-set | Registration determines inheritance and default behavior |
| `var(--drawer-bg, var(--bg))` | token-set | Consumed-only fallback is a public component contract |
| `--_component-mix: ...` | token-set | Private calculation; the reserved prefix makes intent visible in source |

## Pattern annotation

```css
/**
 * @pattern stat-card
 * @role Surfaces a single metric with label + value
 * @example
 *   <article class="stat-card">
 *     <p class="label">Active users</p>
 *     <p class="value">1,284</p>
 *   </article>
 * @modifiers tone-positive, tone-warning, size-sm, size-lg
 * @prefer-over .box plus manual padding and typography
 * @related feature-card, callout
 * @since 4.20.0
 */
.stat-card { ... }
```

| Tag | Required | Notes |
|---|---|---|
| `@pattern <name>` | yes | Must match the selector exactly (without leading `.`) |
| `@role <one line>` | yes | What problem this pattern solves, in plain language |
| `@example` | yes | Block of HTML showing minimal correct usage |
| `@modifiers` | no | Comma-separated list of compound-class modifiers (e.g. `.box.ghost` → `ghost`) |
| `@prefer-over` | no | Names a pattern or "custom: …" that this replaces |
| `@related` | no | Comma-separated list of other registered patterns; lint verifies each resolves |
| `@since <version>` | no | First version that shipped this pattern |
| `@deprecated <reason>` | no | Marks the pattern as deprecated in the registry |

### Selector and owner contracts

Pattern annotations may add structured selector relationships. These tags are additive: the original `modifiers`, `aliases`, `slots`, `states`, and deprecation fields remain in Registry v2 for compatibility, while the corresponding `*Contracts` and `lifecycle` objects carry authoritative ownership.

```css
/**
 * @pattern bottom-nav
 * @role Bottom application navigation
 * @example <nav class="bottom-nav"><a aria-current="page">Home</a></nav>
 * @modifiers blur
 * @states
 *   current: :is(a, button)[aria-current="page"]
 * @state-aliases
 *   current: :is(a, button).active
 * @slots
 *   required item: :is(a, button)
 */
```

| Tag | Syntax | Meaning |
|---|---|---|
| `@selector` | One complete selector | Overrides the default `.<pattern-name>` canonical selector. Use for required hosts such as `input[type="checkbox"].toggle`, `[popover].drawer`, or an element pattern such as `dialog`. The selector must resolve to following CSS evidence. |
| `@qualified-hosts` | One host selector per line | Declares required host constraints separately from the canonical name. Explicit values are authoritative; otherwise the generator records host evidence it can derive from the canonical class selector. |
| `@modifiers` | Comma-separated class names | Preserved compatibility list. Each entry also creates an owner-specific modifier contract with default selector `&.<name>`. |
| `@modifier-selectors` | `name: selector`, one per line | Replaces the default selector for a named `@modifiers` entry when the modifier is not a simple host compound. `&` means the owning pattern. |
| `@states` | `name: selector`, one per line | Declares the preferred selector for a semantic state. Repeat a name when current CSS has multiple preferred selectors. This inventories current behavior; it does not impose a future state vocabulary. |
| `@state-aliases` | `state-name: selector`, one per line | Declares a compatibility selector for an existing `@states` name. Native or ARIA state belongs in `@states`; a class fallback belongs here. |
| `@slots` | `(required|optional) [name:] selector`, one per line | Declares the public child structure. A leading `>` records a direct-child contract. Slot names are stable descriptive identifiers; legacy unnamed lines remain valid. |
| `@aliases` | Comma-separated class names | Declares class aliases owned by this pattern. |
| `@selector-aliases` | Comma-separated selectors | Declares non-class aliases such as the native `button` selector owned by the `button` pattern. |
| `@alias-deprecated` | `alias: reason`, one per line | Preserved human-readable deprecation field for existing consumers. |
| `@alias-lifecycle` | `alias: status; since=version; remove=version; replacement=selector` | Structured alias lifecycle. `status` is `active` or `deprecated`; deprecated aliases require all three named fields. |
| `@lifecycle` | `status; since=version; remove=version; replacement=selector` | Structured lifecycle for the pattern itself. Deprecated patterns require all three named fields. |
| `@accessibility` | One or more lines | Records semantic/accessibility requirements that are not expressible as selector ownership. |

Owner relationships are validated against selector evidence. A modifier or state declared by `.card` cannot be justified by an unrelated `.panel.compact` rule, even if another pattern also publishes `.compact`. Public class ownership is therefore a `(pattern, relation, class)` contract, not a global class-name lookup.

Only annotated `@slots` are public child contracts. Descendant selectors discovered from CSS remain `internalCandidates`/selector evidence unless an annotation explicitly publishes them. This prevents implementation selectors such as helper wrappers, SVG descendants, and responsive toggles from silently becoming supported extension points.

## Pattern group annotation

For sibling utilities that share a single role (`.aspect-*`, `.fs-*`, `.gradient-*`, `.h1`–`.h6`, etc.), use one group block covering all members. Members must be the immediately-following primary class definitions before the next annotation block.

```css
/**
 * @pattern-group aspect-ratios
 * @members aspect-square, aspect-video, aspect-21-9, aspect-4-3, aspect-custom
 * @role Aspect ratio constraints for media containers
 * @example <div class="aspect-video"><img src="..." alt=""></div>
 * @since 4.18.0
 */
.aspect-square { aspect-ratio: 1; }
.aspect-video { aspect-ratio: 16 / 9; }
.aspect-21-9 { aspect-ratio: 21 / 9; }
.aspect-4-3 { aspect-ratio: 4 / 3; }
.aspect-custom { aspect-ratio: var(--aspect, 16 / 9); }
```

| Tag | Required | Notes |
|---|---|---|
| `@pattern-group <name>` | yes | Group identifier (kebab-case) |
| `@members <a, b, c>` | yes | Comma-separated class names; must match every primary def the block covers, no extras |
| `@role <one line>` | yes | Shared role across the family |
| `@example` | yes | One HTML snippet showing a representative member |
| `@prefer-over`, `@related`, `@since`, `@deprecated` | no | Same semantics as `@pattern` |

The lint pairs the group block with the rules that follow it. If the count or names diverge from `@members`, lint fails.

Registry v2 preserves `patternGroups[].members` as the compatibility list and additionally emits complete entries in `patternGroupMembers` and `patternGroups[].memberContracts`. Each member contract receives its own canonical selector, declared selector, layer, source, requirements, bundle membership, token contracts, state evidence, and internal candidates.

## Token annotation

For standalone tokens that don't belong to a scale.

```css
/**
 * @token --font-sans
 * @category typography
 * @role Default sans-serif font stack
 */
--font-sans:
  -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica,
  Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
```

| Tag | Required | Notes |
|---|---|---|
| `@token <--name>` | yes | Must match the declaration exactly, including `--` prefix |
| `@category <slug>` | yes | One of: `typography`, `spacing`, `radius`, `color`, `shadow`, `motion`, `border`, `layout`, `z-index`, `misc` |
| `@role <one line>` | yes | What this token is for |
| `@since`, `@deprecated` | no | Same as `@pattern` |

## Token group annotation

For scale families and color scales — most tokens in `drop-in.css` will use this form.

```css
/**
 * @token-group vertical-spacing
 * @matches --vs-*
 * @category spacing
 * @role Vertical rhythm scale; use for stack gap and block margin
 * @scale xs, s, base, m, l, xl, xxl, xxxl
 */
--vs-xs: 0.25rem;
--vs-s: 0.5rem;
--vs-base: 1rem;
--vs-m: 1.5rem;
--vs-l: 2rem;
--vs-xl: 4rem;
--vs-xxl: 6rem;
--vs-xxxl: 8rem;
```

| Tag | Required | Notes |
|---|---|---|
| `@token-group <name>` | yes | Kebab-case group id |
| `@matches <pattern>` | yes | One or more comma-separated glob patterns; a token is "covered" if it matches any pattern. `*` is the only wildcard. Examples: `--vs-*`, `--amber-*`, `--yellow, --amber, --orange`. |
| `@category <slug>` | yes | Same vocabulary as `@token` |
| `@role <one line>` | yes | Shared role |
| `@scale <list>` | no | Comma-separated step names for human reference |
| `@since`, `@deprecated` | no | Same as `@token` |

The lint pairs the group block with the contiguous token declarations that follow. If a declaration doesn't match the glob, lint fails.

## Token set annotation

`@token-set` is a non-adjacent classification map over the complete custom-property inventory. It does not replace the role/category annotations on canonical root declarations. It adds the stability and visibility contract needed for root tokens, component-scoped defaults, consumed-only hooks, and private calculations to share one registry.

```css
/**
 * @token-set component-contract-fallback
 * @matches --drawer-bg, --drawer-inline-size, --drawer-backdrop
 * @tier component-contract
 * @visibility public
 * @default fallback
 * @role Public drawer overrides whose defaults live at var() consumption sites
 */
```

| Tag | Required | Notes |
|---|---|---|
| `@token-set <name>` | yes | Stable kebab-case classification-set id |
| `@matches <patterns>` | yes | Comma-separated exact names or `*` globs over declared, registered, and consumed tokens |
| `@tier <tier>` | yes | `primitive-reference`, `global-semantic`, `component-contract`, or `private-calculated` |
| `@visibility <status>` | yes | `public` for the first three tiers; `private` for `private-calculated` |
| `@default <stability>` | yes | `stable` for a declared/registered public default, `fallback` for a consumed-only `var()` fallback, or `calculated` for a private framework expression |
| `@role <one line>` | yes | Shared contract for members lacking a more specific root token/group role |
| `@legacy-name allowed` | no | Restricted migration bridge for the inventoried pre-v2 private names |

### Four tiers

| Tier | Public? | Meaning | Theme-scope behavior |
|---|---|---|---|
| `primitive-reference` | yes | Raw values and reference scales used to build semantic decisions | Inherits normally, or reports `rederived` when the core theme-scope mirror redeclares it |
| `global-semantic` | yes | Purpose-bound roles shared by components and themes | Inherits normally, or reports `rederived` from the actual mirror |
| `component-contract` | yes | Override boundary owned by one component, utility, or layout | `component-local`; override on the owning instance or an ancestor |
| `private-calculated` | no | Framework implementation intermediate | `internal`; never document or override it |

New private names must begin `--_component-`. Existing unprefixed calculations remain classified through explicit legacy sets so Registry v2 can distinguish them without forcing a public-name migration. Tier metadata is authoritative for those old names.

`inheritance` is generated from CSS rather than copied into annotations: registered properties use their `inherits` descriptor, while unregistered custom properties inherit. `themeScope` is also structural: the generator records which root tokens are redeclared by the `[class*="theme-"]` mirror. This keeps the registry aligned with actual cascade behavior.

## Validation rules

The lint, in order:

1. **Coverage** — every primary class def has either its own `@pattern` block immediately above or is listed in a preceding `@pattern-group` `@members`. Every `:root`/`@layer base` token has either `@token` or matches a preceding `@token-group` `@matches`.
2. **Name agreement** — `@pattern` / `@token` name must match the selector / declaration that follows.
3. **Required tags present** — see tables above.
4. **`@example` syntax** — non-empty, indented HTML block.
5. **`@related` resolves** — every name in `@related` is a registered pattern or pattern-group.
6. **`@members` exact** — group's `@members` list equals the set of primary class defs it covers, in order.
7. **`@matches` exhaustive** — every token in a group's scope matches its glob; no token outside the glob slips into the group.
8. **Inventory classification** — every declared, registered, or consumed custom property matches exactly one `@token-set`; empty and overlapping sets fail.
9. **Tier contract** — tier/visibility/default vocabularies agree, stable defaults have definitions, fallback defaults are consumed-only, calculated defaults have framework declarations, and new private names use `--_component-*`.
10. **Private docs boundary** — exact references to private inventory names fail in consumer and agent documentation with file, line, and token context.
11. **No duplicates** — a pattern, token, or token-set name can be registered only once.
12. **Selector agreement** — an explicit `@selector` must match following selector evidence.
13. **Owner evidence** — modifiers, states, state aliases, and aliases must occur with the pattern that declares them; ownership from another pattern cannot satisfy the relation.
14. **Explicit slots** — inferred descendants remain non-public candidates; only `@slots` entries become public slot relationships.
15. **Lifecycle shape** — structured deprecated lifecycle entries require `since`, `remove`, and `replacement` metadata.

Each failure prints the file, line, name, and the specific rule violated.

## Running

```bash
pnpm lint:graffiti             # validates and writes registry.json on success
pnpm lint:graffiti --check     # validates registry freshness without writing
pnpm check:generated           # checks the derived mirror and registry together
```

The pre-commit hook runs the lint when `src/lib/drop-in.css` is staged.

## `registry.json` shape

The lint emits Registry v2 at `src/lib/registry.json`, copied to `dist/registry.json` by the package build. Existing pattern/token arrays remain for compatibility; `tokenInventory` is the canonical flat token catalogue.

```json
{
  "schemaVersion": 2,
  "tokenContract": {
    "privatePrefix": "--_component-",
    "tiers": { "primitive-reference": "..." }
  },
  "patterns": [
    {
      "name": "stat-card",
      "kind": "pattern",
      "role": "Surfaces a single metric with label + value",
      "example": "<article class=\"stat-card\">...</article>",
      "modifiers": ["tone-positive", "tone-warning", "size-sm", "size-lg"],
      "modifierContracts": [
        { "name": "tone-positive", "owner": "stat-card", "selector": "&.tone-positive" }
      ],
      "stateContracts": [],
      "slots": [],
      "internalCandidates": [],
      "preferOver": ".box plus manual padding and typography",
      "related": ["feature-card", "callout"],
      "since": "4.20.0",
      "deprecated": null,
      "source": { "file": "src/lib/drop-in.css", "line": 2868 }
    }
  ],
  "patternGroups": [...],
  "patternGroupMembers": [...],
  "tokens": [...],
  "tokenGroups": [...],
  "tokenSets": [...],
  "tokenInventory": [
    {
      "name": "--drawer-bg",
      "tier": "component-contract",
      "public": true,
      "inheritance": "inherited",
      "defaultStability": "fallback",
      "themeScope": "component-local",
      "registered": false,
      "declared": false,
      "consumed": true,
      "declarationCount": 0,
      "consumptionCount": 1,
      "source": {
        "file": "src/lib/drop-in.css",
        "classificationLine": 1,
        "firstDefinitionLine": null,
        "firstConsumptionLine": 1
      }
    }
  ]
}
```
