# Four token tiers and the private calculation boundary

Graffiti classifies every custom property it registers, declares, or consumes in `src/lib/drop-in.css` into exactly one tier:

1. **Primitive/reference**: public concrete values and reference scales such as palette anchors, spacing, radii, type ratios, and easing curves.
2. **Global semantic**: public purpose-bound roles such as foreground/background, status colors, borders, shadows, motion durations, and stacking tiers.
3. **Component contract**: public override hooks owned by a component, utility, or layout. This includes declared defaults such as `--button-color` and consumed-only fallback hooks such as `--drawer-bg`.
4. **Private calculated**: implementation intermediates that consumers and themes must not set or consume.

The first three tiers are part of the public surface under [ADR-0011](./0011-public-surface-and-deprecation-policy.md). Private calculated properties are not public even when an older unprefixed name remains in the stylesheet.

## Source and registry contract

Non-adjacent `@token-set` annotations classify the full token-stream inventory. This is intentionally separate from the existing adjacent `@token` and `@token-group` annotations: adjacent annotations describe canonical root declarations, while token sets cover registrations, nested component declarations, and `var()` references whose defaults exist only at consumption sites.

Registry v2 retains the existing pattern/token arrays and adds a flat `tokenInventory`. Every entry records tier, public status, category/role, inheritance, default stability, theme-scope behavior, registration/declaration/consumption status, occurrence counts, and source lines. Inheritance is derived from `@property`; theme-scope re-derivation is derived from the actual core mirror rather than duplicated as hand-authored metadata.

`stable` means Graffiti declares or registers the default. `fallback` means the public default is supplied where `var()` consumes the hook. `calculated` means the framework owns the expression and may change it without creating a consumer migration.

## Private naming

All new private calculations use the `--_component-*` prefix. The underscore is a visibility signal, not a CSS scoping mechanism. Existing private calculations keep their names in explicit `@legacy-name allowed` sets because older registries exposed every root declaration and a forced rename would create a migration with no consumer benefit. Tier metadata is authoritative for those names.

Consumer docs and agent guidance may reference only public inventory entries. `graffiti-lint` scans those surfaces and fails exact references to private names with file and line context. Lookup excludes private tokens from list/search by default; an exact lookup or explicit `--private` query identifies them as prohibited implementation details.

## Public-surface and release decision

This is a non-breaking contract clarification. Existing public token names and default values remain unchanged. No token migration is required, and the pending 5.0 release metadata is not expanded or duplicated for this work.

## Considered options

- **Infer public status from placement or spelling.** Rejected. Root placement historically includes an internal lightness calculation, while public component hooks can be consumed-only and never declared at root.
- **Rename every private-looking property immediately.** Rejected. The architecture needs an enforceable boundary, not churn in observable names during unrelated work.
- **Keep only literal and semantic tiers.** Rejected. It leaves component override hooks indistinguishable from both global semantics and implementation intermediates.
- **Maintain a separate hand-written JSON manifest.** Rejected. Structured CSS annotations keep classification beside the only canonical stylesheet and let generated data fail on drift.
- **Scan only parsed declaration nodes.** Rejected. CSS nesting can remain raw in the parser AST; token-stream inventory is required to see every nested declaration and `var()` reference.

## Consequences

- Any new root, component, nested, registered, or consumed-only token fails lint until exactly one token set classifies it.
- A new private token without the reserved prefix fails lint.
- Documentation cannot accidentally promote implementation intermediates into consumer API.
- Themes should override primitive/reference, global semantic, or public component-contract tokens only. Private calculations remain free to change with their owning implementation.
- Registry consumers should use `tokenInventory` for token lookup and use `public` as the generation boundary.
