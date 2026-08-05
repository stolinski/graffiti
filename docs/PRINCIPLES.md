# Graffiti Principles

This document defines what makes a piece of code "Graffiti-shaped." It is the canonical answer to the questions:

- Should I use an existing Graffiti class, or write custom CSS?
- When I customize, where do I customize?
- What can I rely on, and what can I extend?

The principles below are *system contracts*. They govern both consumer code and the [`graffiti-best-practices`](../skills/graffiti-best-practices/SKILL.md) skill that AI agents use to generate Graffiti markup. If the skill ever diverges from this document, this document wins.

## The six rules

### 1. Token-first

If a public token exists for what you want to express, use it. Do not hardcode a literal where a token would express the same intent. Do not invent new `--*` names — extend Graffiti's token surface only via documented extension points (theme presets, theme scope, component override variables). A name present in CSS is not sufficient: Registry v2 must classify it as `public: true`. Private calculated tokens are implementation details.

> **Why this matters.** Tokens are the override surface. Inline literals can't be re-themed; tokens can. The framework's "use Graffiti, walk away" promise rests on every visual decision being a token away from change.

### 2. Class-first

If a class exists for what you want, use it. Do not invent new class names. Do not re-implement primitives that Graffiti already ships (dialog, card, bubble, button, tag, callout, layout-sidebar, etc.). When a primitive is close-but-not-exact, override its documented tokens rather than authoring a parallel class.

> **Why this matters.** Re-implementing primitives defeats the whole system. A bespoke `.my-card` next to `.card` doubles maintenance and breaks discoverability.

### 3. Composition over custom CSS

Exhaust layouts + utilities + components in composition before reaching for bespoke CSS. Most layouts can be built from `.layout-*` + `.stack`/`.cluster`/`.split`/`.flex` + component classes alone. Custom CSS is the escape hatch, not the default path.

### 4. Custom CSS must be systemic

When custom CSS is genuinely needed, write it as a *reusable* class or utility at the project level — not as a one-off inline override on a single element. Reach for a reusable extension class even when only one element uses it today; the second usage usually shows up within a sprint.

### 5. Intent over visual

Pick a class by the *role* the element plays, not by what it looks like. `.card` is for repeating content units (articles, products, plans), not generic page wrappers. `.stat-card` is for KPI metrics, not feature blurbs. `.feature-card` is for feature-list entries, not arbitrary content. If you want a neutral container, use a layout primitive (`.stack`, `.cluster`, `.box`, `.surface`), not a role-specific component.

### 6. Override at the token boundary

When you customize an existing primitive, override its public component-contract tokens (`--button-color`, `--card-bg`, `--bubble-radius`, etc.). Do not write selectors that override component-internal rules or set private calculated tokens. Public token overrides cascade cleanly, compose with **aesthetic presets** ([ADR-0003](./adr/0003-aesthetic-preset-architecture.md)) and **theme scopes** ([ADR-0006](./adr/0006-theme-scope-derived-scale-rederivation.md)), and survive framework upgrades. Internal overrides do none of those things.

## Where each rule cashes out

- Token-first is enforced by [ADR-0007](./adr/0007-opaque-color-scale.md) shipping a wide opaque scale so consumers rarely need ad-hoc `color-mix` expressions, and by the **theme scope** mechanism ([ADR-0006](./adr/0006-theme-scope-derived-scale-rederivation.md)) ensuring overrides cascade correctly.
- Class-first is enforced by [ADR-0002](./adr/0002-cascade-layer-order.md) (cascade order) and [ADR-0009](./adr/0009-layout-vs-utility-classification.md) (layout/utility classification) — knowing which layer a class belongs in tells you what it can and cannot do.
- Composition over custom CSS is the implicit promise of the `.layout-*` family.
- Custom-CSS-must-be-systemic is a discipline rule that has no technical enforcement — but the principle is documented here as the framework's stance.
- Intent over visual is enforced by the **Component Intent Steering** section of the skill and by the per-component "intent fit" matrix.
- Override at the token boundary is what makes [ADR-0003](./adr/0003-aesthetic-preset-architecture.md) (aesthetic presets) work as a non-orthogonal layer between base and components — presets re-skin via tokens, never via selector overrides into component internals.

## The boundary between override and fork

A consumer is *overriding* Graffiti when:

- They set token values at `:root`, on a container, or on a component instance.
- They apply or author an aesthetic preset class.
- They wrap a Graffiti primitive in a layout composition.
- They use `.theme-scope` to scope a recolor to a subtree.

A consumer is *forking* Graffiti when:

- They re-declare component-internal selectors (`.card { background: ... }` overriding `.card`'s own bg rule rather than `--card-bg`).
- They author parallel primitives that duplicate Graffiti's roles (`.my-card`, `.my-button`, `.my-layout-X`).
- They add classes inside `@layer components` / `@layer layouts` in their own CSS — those layers are framework territory.

Forking is allowed — Graffiti can't stop a consumer from writing their own CSS — but a fork is no longer subject to the system's contracts. Upgrades may move things under your fork. Aesthetic presets may not reach into it. The skill will not generate it.

The rule of thumb: **if you can express the change as a token override, do that. If you can't, ask whether a missing token surface is the real problem before reaching for a selector override.**
