# Public surface, breaking changes, and per-ADR deprecation policy

Graffiti's *public surface* — the set of things consumer code is allowed to depend on — is:

- **Class names** in any documented layer (`@layer base, themes, components, utilities, layouts`), including their semantics: cascade layer assignment, documented child contracts, responsive breakpoints, and modifier classes.
- **Public token names** classified by Registry v2 as primitive/reference, global semantic, or component-contract tokens ([ADR-0018](./0018-token-tiers-and-private-boundary.md)), including stable declared defaults and documented fallback defaults.
- **The cascade layer order itself** (`@layer base, themes, components, utilities, layouts`).
- **Aesthetic preset class names** (`.theme-system`, `.theme-editorial`, etc.) and the **theme scope** convention (`.theme-scope` from [ADR-0006](./0006-theme-scope-derived-scale-rederivation.md)).
- **The alpha and opaque color scale conventions** (`--{base}-1..9` alpha, `--{base}-opaque-1..9` symmetric, [ADR-0007](./0007-opaque-color-scale.md)).
- **Package entry points and CLIs** declared by `package.json`, including compatibility aliases. The generated `@drop-in/graffiti/drop-in.css` and `@drop-in/graffiti/raw` paths preserve exports published through `4.1.0`; new code should prefer the package root. `@drop-in/graffiti/min` is the minified layered root, while `@drop-in/graffiti/drop-in.min.css` is the explicitly flat minified output.

Explicitly **not public**: private calculated tokens (`public: false` in Registry v2), even when a pre-v2 name lacks the reserved private prefix; component-internal selectors (consumers must override via documented tokens, not selector rules — see [`PRINCIPLES.md`](../PRINCIPLES.md) §6); internal CSS organisation; whether a particular rule lives in one CSS file or another; the specific oklch values literal tokens resolve to *if* the resolved value is undocumented.

## What counts as a breaking change

A modification is **breaking** if it alters observable behavior of any item in the public surface above. Concretely:

- Removing or renaming a class or public token.
- Changing a class's cascade layer assignment.
- Changing a class's documented child contract (`> *` selectors, `.rail-*` slots, etc.).
- Changing a responsive breakpoint of a layout primitive.
- Changing a token's resolved value in a way that doesn't track with documented override paths.
- Reordering the cascade layer declaration.
- Removing or renaming an aesthetic preset class.
- Removing or renaming a package export or CLI.

A modification is **non-breaking** if:

- It adds new classes, tokens, modifiers, or aesthetic presets.
- It refactors internal CSS organisation with no observable diff at the public surface.
- It documents previously-undocumented behavior without changing the behavior.
- It is documentation, examples, or test changes.

The borderline cases get adjudicated at ADR time. When an ADR proposes a change that could be read either way, the ADR explicitly states whether it is breaking and what major version it ships in.

## Deprecation policy

Deprecation is decided **per ADR**, not globally. Each ADR that ships a breaking change specifies one of three handlings:

1. **Clean removal.** The surface is removed in a single major version bump. Used when the surface has no real consumers or the removal is too small to deserve a deprecation period. Example: [ADR-0010](./0010-holy-grail-repurpose-as-rails-layout.md) repurposes `.layout-holy-grail` directly — the only references in the repo were demo pages.
2. **One-major deprecation.** The old surface is marked deprecated in docs, skill, and changeset for one major version, then removed in the next. The skill refuses to generate the deprecated pattern as soon as deprecation lands. Used when a surface is load-bearing enough that consumers should get a release-cycle's warning. Example: a rename of `--primary` (hypothetical) would deserve this.
3. **Coexistence with alias.** The old surface continues to work indefinitely as a documented alias of the new one. Used when removing the old surface produces no benefit but adding the new surface does. Example: shipping `--primary-opaque-N` alongside the existing `--primary-N` ([ADR-0007](./0007-opaque-color-scale.md)) is itself a coexistence-by-default move.

The legacy package paths `./drop-in.css` and `./raw` use coexistence with alias. They are generated from the current primary CSS outputs, exercised by the packed-package smoke test, and have no separately maintained source files.

The choice belongs to the ADR author. The system-integrity stance ([feedback memory](../../skills/.claude/memory/feedback_system_integrity_over_expressiveness.md)) biases toward narrower changes — clean removal when the surface is small, one-major deprecation when it isn't, coexistence when the old surface deserves to live.

## What this is *not*

- It is not a runtime deprecation pipeline. Graffiti is a CSS package; it cannot emit `console.warn`. Deprecation is communicated through docs, the skill, and changeset entries.
- It is not a semver enforcement automation. Changesets are wired ([package.json](../../package.json)); per-PR review confirms the version bump matches the change's category.
- It is not a guarantee against accidental breakage. It is a contract that says *this is what consumers may depend on*; bugs in the framework that affect that surface are still bugs and still warrant a fix.

## Considered options

- **Major-bump-only, no deprecation periods.** Rejected: forces every breaking change to land cleanly even when the surface has real consumers. Doesn't match how `.layout-holy-grail` actually got repurposed (which was a clean removal because it lacked consumers — exactly the kind of per-case judgment a global rule can't make).
- **Mandatory one-major deprecation period.** Rejected: heavy process, and forces a deprecation cycle on surfaces nobody is using. Pollutes the codebase with carried-over deprecated definitions that nobody is migrating from.
- **No formal public-surface definition; rely on ADR records alone.** Rejected: without a definition, "is X a breaking change?" has no shared answer. Future maintainers and consumers can't reason about what changed without re-reading every ADR.
- **Runtime deprecation warnings.** Rejected for being structurally infeasible in a CSS-only package and for over-investment in process for a small-framework cadence.

## Consequences

- ADRs that introduce a breaking change must add a "deprecation handling" line: clean removal / one-major deprecation / coexistence. Existing ADRs that changed the surface ([ADR-0002](./0002-cascade-layer-order.md), [ADR-0009](./0009-layout-vs-utility-classification.md), [ADR-0010](./0010-holy-grail-repurpose-as-rails-layout.md)) retroactively count as clean removals.
- Changeset entries for breaking changes get a `breaking` flag and a migration note. The CHANGELOG renders these prominently.
- The skill's "do not invent classes/tokens" rule now has a corollary: it must also refuse to generate currently-deprecated classes/tokens. Implementing this is a follow-on for the skill maintenance pass.
- The docs site annotates deprecated entries (strikethrough plus "deprecated since vX, removed in vY" badge) for the duration of any deprecation period.
- This document is the canonical answer to "is X a breaking change?" Future contributors check the public surface definition before opening a PR. The decision is no longer reinvented per change.
