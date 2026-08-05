# Repurpose .layout-holy-grail as centered-content-with-rails

Graffiti redefines `.layout-holy-grail` from a stretching `auto 1fr auto` 3-column grid into a **centered-content-with-rails** primitive. Its required direct `<main>` or `<article>` occupies the centered, max-width second column. Optional direct `.rail-start` and `.rail-end` children occupy the first and third columns when present, in semantic source order: start rail → main/article → end rail. At 1024px and narrower, retained slots reset to one centered track and the end rail hides; at 768px and narrower, a plain start rail hides or a direct `.rail-start.drawer[popover]` remains available through the established native drawer pattern.

```css
.layout-holy-grail {
  --max-width: 720px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) min(var(--max-width, 720px), 100%) minmax(0, 1fr);
  gap: var(--layout-gap, var(--gap, 2rem));
  align-items: start;
}

.layout-holy-grail > .rail-start { grid-column: 1; }
.layout-holy-grail > :is(main, article) { grid-column: 2; }
.layout-holy-grail > .rail-end { grid-column: 3; }

@media (width <= 1024px) {
  .layout-holy-grail {
    grid-template-columns: min(var(--max-width, 720px), 100%);
    place-content: start center;
  }

  .layout-holy-grail > :is(.rail-start, main, article, .rail-end) {
    grid-column: 1;
  }

  .layout-holy-grail > .rail-end { display: none; }
}

@media (width <= 768px) {
  .layout-holy-grail > .rail-start:not(.drawer) { display: none; }
}
```

The `720px` default is declared on `.layout-holy-grail` itself so an inherited ancestor value cannot erase the reading measure; consumers can still override `--max-width` on the layout element.

Drawer composition reuses the existing `[popover].drawer` and `.drawer-toggle` contracts rather than adding a second drawer system. Above the mobile boundary, `.layout-holy-grail` hides its descendant toggles and integrates a direct `[popover].drawer.rail-start` as static, visible grid content even while the popover is closed. At 768px and narrower, toggles become visible and a closed drawer rail leaves the grid; the established drawer CSS owns its viewport-edge position, transition, backdrop, native light-dismiss, and Escape behavior when opened. Toggle placement remains the consumer's responsibility, typically inside the middle content's header.

The repurpose is closer to the original CSS "Holy Grail" pattern than the prior implementation, which had stretched the middle column and lost the readable-width consideration that motivated the historical layout in the first place. The new shape gives documentation, blog, and editorial templates a single class name for the canonical 3-column with centered readable column pattern.

`.layout-three-col` (1fr 1fr 1fr → 1fr 1fr → 1fr) stays as-is — it serves a different need (equal-width columns for feature cards, comparison rows). The two primitives are now distinct in intent: `.layout-three-col` for equal-width grids, `.layout-holy-grail` for centered readable content with rails.

## Considered options

- **Ship a new `.layout-rails` primitive alongside the existing `.layout-holy-grail`.** Rejected: the existing primitive has no real consumers in the repo (only demo/docs usage), and adding a third 3-column primitive (`three-col` / `holy-grail` / `rails`) bloats the catalog. The repurpose is cleaner — one name, one canonical meaning.
- **Add `.layout-readable` as a composable modifier on `.layout-holy-grail`.** Rejected: composition tricks (`grid-template-columns` override based on `:nth-child(2)` selector) are fragile and depend on DOM order in subtle ways. A dedicated definition with explicit `.rail-start` / `.rail-end` child contracts is more discoverable and harder to misuse.
- **Keep `.layout-holy-grail` as stretching `auto 1fr auto` and ship `.layout-rails` separately.** Rejected for the same reason as the first option, plus: the historical Holy Grail layout was always about centered readable content with rails, so the prior implementation was already drifting from the name's meaning.
- **Defer until a real template demands it.** Rejected: documentation portals, blog templates, and editorial layouts are all on the medium-term roadmap and all need this shape. Better to ship the primitive once than to discover three different ad-hoc implementations in three different templates.

## Consequences

- `.layout-holy-grail` changes shape. Consumers using the prior `auto 1fr auto` behavior get the new centered-readable version on upgrade. The change is recorded in a changeset as a behavior change. No real consumers exist in the repo, but external consumers (if any) see the shift; the docs explain the new shape.
- `.rail-start` and `.rail-end` enter the layout vocabulary as child-contract classes for `.layout-holy-grail`. They are not free-floating utilities — they only mean something inside a `.layout-holy-grail`. The skill records them under `.layout-holy-grail`'s entry, not as separate concepts.
- Start-rail drawer accessibility on mobile reuses the established `[popover].drawer` pattern and mirrors `.layout-sidebar`'s responsive integration. The toggle belongs within `.layout-holy-grail` so its visibility can remain CSS-owned, typically in the middle content's header; no new drawer or toggle component is needed.
- End-rail hides first because marginalia is the most disposable content type — losing it at the tablet breakpoint leaves the readable column with more room. The decision is values-laden: in editorial/docs contexts, the rail-start (TOC) is more important than the rail-end (notes).
- The other Thread 3 candidates from the grilling session are resolved without new primitives: `master-detail` is `.layout-sidebar` plus route deep-linking; `split-pane` is a JS component (out of scope for `drop-in.css`); `full-bleed-within-readable` is already shipped at `drop-in.css:1770` as `.layout-readable .full-bleed`; `sticky-rail` is `.layout-sidebar.fixed`.
- The docs site updates its `.layout-holy-grail` example to show the new shape. The `graffiti-best-practices` skill teaches: pick `.layout-three-col` for equal columns (cards, comparisons), pick `.layout-holy-grail` for editorial-style readable content with rails.
