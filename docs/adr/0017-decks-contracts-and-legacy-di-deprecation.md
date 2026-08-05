# Decks-facing contracts and legacy `.di-*` deprecation

Graffiti's normal layered bundle is the sole visual source for Decks components. The Decks catalog is accepted as the consumer contract, including `Skeleton`. Graffiti therefore adds registered, documented contracts for segmented choice, anchored popover/tooltip anatomy, toast anatomy and placement, async/empty states, enhanced form selection, data tables, and kanban workflows.

Behavior remains in Decks. Graffiti styles native state attributes and documented classes; it does not implement combobox focus movement, calendar arithmetic, toast queues, table state, or drag-and-drop orchestration.

## Skeleton decision

ADR-0005 originally put skeleton placeholders out of scope because app-specific layouts must decide which shapes to render. The accepted Decks catalog proves that the visual primitive itself is reusable even though the layout remains app-specific. That earlier scope decision is reversed:

- `.skeleton` supplies one neutral placeholder surface.
- `.text` and `.circle` cover only universally reusable geometry.
- Consumers still compose the exact number, width, and arrangement of placeholders to match their content.
- Skeleton nodes are decorative (`aria-hidden="true"`); the containing region carries `aria-busy` and an accessible loading label.

No hard technical reason blocks this contract, so the Graffiti catalog changes rather than silently omitting the accepted Decks API.

## Legacy `.di-*` decision

Deprecation handling is **one-major deprecation** under ADR-0011. The next major release normalizes legacy selectors onto canonical contracts in `drop-in.css`; the aliases may be removed in the following major release.

| Legacy surface    | Canonical replacement                                                                   | Compatibility during deprecation                                                                                |
| ----------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `.di-dialog`      | Native `<dialog>` + `.close` + `.stack` + `.form-actions`                               | A `.di-dialog` on `<dialog>` receives the native dialog contract; no class-specific parallel primitive remains. |
| `.di-drawer`      | `[popover].drawer` for side panels or `.bottom-sheet` for dialog sheets                 | `dialog.di-drawer` aliases the canonical `.bottom-sheet` visual contract.                                       |
| `.di-menu`        | `.dropdown` + `.dropdown-menu[popover]`, or `.popover` for non-menu interactive content | `.di-menu` receives the canonical popover surface and legacy item rows in the normal bundle.                    |
| `.di-toast-slice` | `.toast` and its documented children                                                    | `.di-toast-slice` shares the canonical toast surface and semantic tone modifiers.                               |

The legacy close child selectors (`.di-dialog-close`, `.di-drawer-close-button`) retain only canonical logical positioning during this window. The removed `src/lib/decks.css` source is not restored; all visual contracts live in the canonical bundle. This avoids two component implementations fighting through import order while keeping a selector migration window.

This normalization changes the observable appearance and child expectations of deprecated classes, so the minimum release containing the complete change is a **major** release. The task intentionally creates no changeset or release artifact.

## Public contract consequences

- Every new class and modifier is annotated in `src/lib/drop-in.css` and emitted in `registry.json` with role, example, modifiers, and relationships.
- `--tooltip-offset`, `--tooltip-show-delay`, and `--tooltip-hide-delay` are root tokens because Decks emits per-instance tooltip geometry/timing overrides.
- Logical properties, container queries, safe-area tokens, and native semantic state drive responsive, RTL, and accessibility behavior.
- Forced-colors and reduced-motion decisions live beside the canonical rules.
- [`docs/DECKS-CONTRACTS.md`](../DECKS-CONTRACTS.md) is the reconciliation map from every accepted Decks API to its Graffiti or native contract.

## Tests added

- Registry and CSS contract assertions cover every new family, state selector, relationship, token, and legacy migration alias.
- Source-backed docs demos exercise the emitted child structures.
- Browser fixtures cover light, dark, RTL, forced-colors, reduced-motion, and narrow/mobile layouts.
