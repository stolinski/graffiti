# Docs information architecture: artifact taxonomy mirrors CONTEXT.md, with Forms as a named domain exception

The docs site IA (top-level sections, URLs, sidebar) mirrors the conceptual vocabulary defined in CONTEXT.md, with one named exception: **Forms** is promoted to a top-level domain even though it cuts across layers. Top-level nav becomes:

```
Get Started
Tokens
Base
Layouts
Utilities
Components
Forms
Recipes
Templates
Changelog
```

URLs follow one rule: **one artifact = one topic = one URL.** The dynamic `(docs)/[section=docs_section]/[topic]/+page.svelte` route is canonical for every artifact page. The four cloned static section pages (`base/+page.svelte`, `utilities/+page.svelte`, `elements/+page.svelte`, `ui-blocks/+page.svelte`) collapse into a single `(docs)/[section]/+page.svelte` template that renders the section index — a grid of topic cards (title + one-line summary). Hash-anchor sidebar links are replaced with deep URLs.

The sidebar is **section-only with active-section expansion**: only the current section's topics are visible; other sections stay collapsed. There is no prev/next footer. Graffiti docs are lookup-first reference, not sequential tutorial.

## Public-surface status and deprecation handling

Docs-site URLs are **not** part of the formal public surface defined in [ADR-0011](./0011-public-surface-and-deprecation-policy.md) — that surface covers CSS class names, tokens, cascade-layer order, and preset classes, not the docs site's URL structure. So the URL renames here (`/elements/*` → `/components/*`; `/ui-blocks/*` split; `/utilities/layouts` → `/layouts`) do not trigger ADR-0011's breaking-change machinery.

That said, the old URLs may have been linked externally. Deprecation handling for the URL set is **clean removal with permanent 301 redirects** from old URL → new URL, maintained indefinitely. The redirects live in the SvelteKit route configuration and are listed in the changeset for the release that ships this IA.

No CSS class names, tokens, or cascade rules change because of this ADR. The docs *content* about classes is reorganised; the classes themselves are untouched.

## The Forms exception and its three-test gate

Forms passes a three-test rule that no other current domain passes:

1. **Artifact surface ≥ 5 distinct artifacts across ≥ 2 layers.** Forms covers inputs/textarea/select/checkbox/radio (Base classless), `.row`/`.form-option-row`/`.form-actions` (Components), validation modifiers (`.error`/`.success`/`.warning`), and the login-form composition. Tables, Navigation, Typography, Mobile patterns — none currently reach this surface.
2. **Consumer mental model is task-first.** Nobody reaches for `.row` in isolation. They reach for "I'm building a form."
3. **Cluster of behavioural decisions/ADRs of its own.** Recent decisions — `:user-invalid`/`:user-valid` support, dvh on root, print block refactor — show Forms as an active decision surface with patterns that don't compose with anything else.

Future domains earn a top-level slot only by passing all three tests. The gate keeps the IA from accumulating one-off categories.

Form-specific artifacts (`.row`, `.form-option-row`, `.form-actions`, validation modifiers, login-form) live *only* under Forms — there is one canonical home per artifact. Cross-layer-reused modifiers (a future `.error` that also styles alerts) stay in their original layer; Forms links to them rather than re-homing them.

## The Recipes section and the artifact-per-topic rule

A pure recipe is a topic that ships no class of its own — it documents how to compose existing artifacts. Today there are three: `confirm-dialog`, `login-form` (which moves under Forms), and `user-menu`. They live in Recipes (and Forms) separate from the artifact layers because (a) their reading flow is task-first and (b) they earn discoverability independent of the components they compose.

Topics that today bundle multiple artifacts under one page are split per artifact. `mobile-patterns` explodes into `components/app-shell`, `components/bottom-nav`, `components/bottom-sheet`, plus the `.safe-*`/`.hide-scrollbar`/`.momentum-scroll` utilities moving into Utilities. The old `forms` topic splits its classless-input content into Base and its component classes into Forms. `utilities-layouts.md` splits into individual `layouts-*` topics — that bundling pre-dated [ADR-0009](./0009-layout-vs-utility-classification.md)'s hard layout/utility split and is now architecturally inconsistent.

## Considered options

- **Keep current IA (base / utilities / elements / ui-blocks).** Rejected: the labels drift from CONTEXT.md's own vocabulary ("Element" instead of **Component**, "UI Blocks" undefined anywhere); `utilities-layouts.md` violates [ADR-0009](./0009-layout-vs-utility-classification.md) by mixing utilities and layout primitives in one topic; "UI Blocks" misclassifies 11 of 14 entries that actually ship classes and belong in Components.
- **Rename "Tokens" to "Variables" in the nav.** Rejected: directly conflicts with CONTEXT.md's *Avoid: variable* note, and "Variable" flattens the literal/semantic distinction that [ADR-0006](./0006-theme-scope-derived-scale-rederivation.md) (theme-scope re-derivation) and [ADR-0007](./0007-opaque-color-scale.md) (opaque scale) depend on. The cost of an unfamiliar word at the top of the nav is one-time; the cost of vocabulary drift compounds across every future ADR.
- **Long-page-per-section URL model (status quo).** Rejected: doesn't scale — already long at 50 topics, unusable at 100; anchor links are second-class for cross-linking from Recipes/Forms/external sources; per-topic SEO competes against itself on the same page; per-topic metadata (description, og:image) becomes impossible.
- **Hybrid routing (both long-page and per-topic, with `rel=canonical`).** Rejected: doubles editorial maintenance; every cross-link decision must pick a surface; SEO duplicate-content risk is real even with canonicals correctly wired.
- **Forms absorbed into Components and Base per the strict artifact taxonomy.** Rejected: matches the rule but loses the form-as-task discovery surface that every comparable CSS framework (Bootstrap, Tailwind, Bulma, Pure, Pico) treats as top-level. Forms genuinely passes a higher bar than other domains, and the three-test gate distinguishes the exception from a precedent.
- **Concepts/Guides section for cross-cutting stories (Forms, Typography, Color, Motion).** Rejected after grilling: only Forms today has enough decision surface to need a guide; Typography/Color/Motion stories live better as intro paragraphs on their respective tokens/utilities pages. A guides section reserved for one inhabitant is scaffolding, not architecture.
- **Always-flat sidebar with all topics visible (Tailwind/Stripe style).** Rejected: Tailwind utilities are atomic enough to read as a reference card; Graffiti topics are richer (Card, Tabs, Timeline have demos and variants) and 50+ entries are noise, not signal.
- **Two-pane navigation (sidebar + secondary topic nav, MDN style).** Rejected: duplicates the navigation surface, two places to keep in sync, conflicts with the repo preference "less UI is better than too much."
- **Per-topic sidebar with prev/next footer.** Rejected mid-conversation: prev/next is a *tutorial* primitive (sequential learning), not a *reference* primitive (lookup). Reference docs are accessed by direct URL, search, or sidebar; sequential traversal is the wrong mental model.

## Consequences

- The four cloned `(docs)/{base,utilities,elements,ui-blocks}/+page.svelte` files are deleted. Their function is replaced by a single `(docs)/[section]/+page.svelte` template that renders the section index.
- The dynamic `(docs)/[section=docs_section]/[topic]/+page.svelte` route becomes canonical for every topic. URLs of the form `/components/card`, `/forms/row`, `/recipes/user-menu` are stable and shareable.
- The `docs_section` param matcher (`src/params/docs_section.ts`) updates to the new section set: `tokens`, `base`, `layouts`, `utilities`, `components`, `forms`, `recipes`. Redirects: `/elements/*` → `/components/*`; `/ui-blocks/*` → split between `/components/*` and `/recipes/*` per the audit; `/utilities/layouts` → `/layouts`.
- The sidebar derives from the content graph (`getDocsContentGraph()`) instead of the hardcoded `docsRouteKeys`/`docsRouteLabels` in `src/routes/(docs)/+layout.svelte`. Templates and Changelog remain manually appended because they are intentionally outside the topic graph (templates are fullscreen pages; changelog is a rendered `CHANGELOG.md`).
- Topic content files under `src/docs/content/topics/` are renamed per the new sections: `elements-*` → `components-*`; `ui-blocks-*` → either `components-*` or `recipes-*` based on the recipe-vs-class audit; `utilities-layouts.md` splits into separate `layouts-*` topics.
- `mobile-patterns` is split per artifact. `forms` is split into Base (auto-styled native inputs) and Forms (`.row`, `.form-option-row`, `.form-actions`).
- Dead stubs are removed: `(docs)/topic-section-preview/` and `src/docs/sections/Utilities.svelte`.
- CONTEXT.md gains a `Docs nav vocabulary` section documenting the section ↔ vocabulary mapping and the three-test gate.
- The shell layout (`src/routes/(docs)/+layout.svelte`, currently ~275 lines) decomposes into discrete components for theming state, sidebar nav, and footer. Pure cleanup, no IA change.
- The `graffiti-best-practices` skill is updated to reference the new section names in generated markup guidance (anywhere it currently says "Elements" or "UI Blocks").
- `pnpm check:docs-content` extends to assert every topic file's `route` frontmatter matches a section the param matcher knows about, so taxonomy drift is caught at build time. This is a docs-content validator, not a CSS contract test — it sits alongside the contract test suite from [ADR-0013](./0013-contract-test-enforcement.md) rather than inside it.
