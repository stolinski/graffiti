# Graffiti component coverage

A gap-discovery matrix. For each pattern that mainstream component libraries (shadcn/ui, Radix Themes, Tailwind UI, Carbon, Bootstrap, Mantine) commonly ship, this records whether Graffiti has it, has it partially, is missing it, or has deliberately put it out of scope.

This is not a class-selection guide — for that, see [`skills/graffiti-best-practices/references/COMPONENT_INTENT_MATRIX.md`](../skills/graffiti-best-practices/references/COMPONENT_INTENT_MATRIX.md).

## Status legend

- ✅ **Shipped** — exists in `drop-in.css` today
- 🟢 **Planned** — designed in an ADR / has an open Dex task
- 🟡 **Partial** — primitives exist but no canonical pattern, or only one use case is covered
- 🔴 **Missing** — real gap, HTML+CSS-only feasible
- ⚫ **Out of scope** — requires JS state or is template-level composition

## Scope rubric

In scope for Graffiti: anything that works with semantic HTML + native browser controls + CSS (including `popover`, anchor positioning, `:has()`, `<dialog>`, view transitions, container queries). Anything requiring JS state management is out of scope.

## Methodology

Cross-referenced against shadcn/ui (Radix-based, modern baseline), Radix Themes (pre-styled component sets), Tailwind UI (template-heavy), Carbon Design System (enterprise), Mantine, and Bootstrap. Patterns appearing in 3+ of these are treated as "expected baseline" for a modern component library.

---

## Surfaces & containers

| Pattern | Status | Notes |
|---|---|---|
| Card | ✅ | `.card`, plus `.card.featured`, `.card.linked` variants |
| Feature card | ✅ | `.feature-card` for marketing/feature lists |
| Stat card | ✅ | `.stat-card`. Trend-arrow + delta indicator is partial — no slot yet 🟡 |
| Surface / panel | ✅ | `.surface`, `.box` |
| Callout / alert | ✅ | `.callout` with `.warning`/`.error`/`.success`/`.ghost`, `.fill` |
| Banner | 🟢 | ADR 0004, Dex `05c00pne` |
| Empty state | ✅ | `.empty` with `.compact`; icon/heading/body/`.form-actions` child contract |
| Hero section | ⚫ | Template composition (`.layout-readable` + headings + CTA) |
| Bento grid | ⚫ | Template composition via `.layout-*` primitives |
| App shell | ✅ | `.app-shell`, `.layout-sidebar.fill` |
| Bottom sheet | ✅ | `.bottom-sheet` |

## Navigation

| Pattern | Status | Notes |
|---|---|---|
| Breadcrumbs | ✅ | `.breadcrumbs` |
| Tabs (content panels) | ✅ | `.tabs` using `<details>`/`<summary>` |
| Dropdown menu | ✅ | `.dropdown-menu` via `popover` + anchor positioning |
| Sidebar nav | ✅ | `.sidebar-nav`, `.sidebar-nav-heading`, `.sub` |
| List nav | ✅ | `.list-nav` |
| Bottom nav (mobile tab bar) | ✅ | `.bottom-nav` |
| Toolbar / action bar | ✅ | `.toolbar` with `.separator` and `.spacer` child slots |
| Pagination | ✅ | `.pagination` |
| TOC | ✅ | `.toc` |
| Header | ✅ | `.header` + `.border`, `.sticky` modifiers |
| Footer | ✅ | `.footer` |
| Menubar (top-level menus) | ⚫ | Keyboard nav is JS — out of scope |
| Command palette (⌘K) | ⚫ | JS — out of scope |
| Navigation drawer | ✅ | `.drawer` + `.drawer-toggle` via popover |

## Forms & inputs

| Pattern | Status | Notes |
|---|---|---|
| Text input | ✅ | Base element styling |
| Textarea | ✅ | Base element styling |
| Select | ✅ | Base styling exists; modern `appearance: base-select` planned in Dex `jbnrimrz` 🟢 |
| Checkbox / radio | ✅ | Base element styling |
| Toggle / switch | ✅ | `.toggle` modifier on checkbox |
| Search input | ✅ | `.search` |
| Input group (input + button) | ✅ | `.input-group` |
| File upload / dropzone | ✅ | `.dropzone` |
| Form field (label + hint + error) | 🟢 | ADR 0003, Dex `zsxd8rgz` (generalized `.row`) |
| Form actions row | ✅ | `.form-actions` |
| Option row (single checkbox/radio) | ✅ | `.form-option-row` |
| Segmented control | ✅ | `.segmented-control`; direct labels contain native radios, with `.compact` / `.full` |
| Slider / range input | 🟢 | Dex `v495ewst` |
| Color input | 🟡 | `<input type="color">` browser-default; no Graffiti styling |
| Date / time picker | ✅ | Native `<input type="date">` first; `.date-picker` + `.calendar*` provide the Decks-enhanced visual surface |
| Combobox / autocomplete | ✅ | `.combobox`, `.listbox`, `.option`; Decks owns behavior |
| Multi-select | ⚫ | JS |
| Tag input (with chip removal) | ✅ | `.tag-input` composes `.tag` + combobox/listbox contracts; Decks owns behavior |
| OTP input | ⚫ | JS |
| Rich text editor | ⚫ | JS |
| Validation states | ✅ | `:user-invalid`, `:user-valid`, `[aria-invalid]` baseline styling |
| Floating label inputs | 🔴 | Alternative form pattern not present. Pure CSS feasible with `:placeholder-shown` |
| Field hint icon (with tooltip) | 🟡 | Compose `.tooltip` + form label |

## Buttons & actions

| Pattern | Status | Notes |
|---|---|---|
| Button | ✅ | Base element + `.button` utility; variants `.ghost`, `.primary`, `.minimal` etc. |
| Icon button | ✅ | `.icon-button` (square footprint + glyph sizing); classless auto-square for `button[aria-label]:has(>svg:only-child)` |
| Floating action button (FAB) | ✅ | `.fab` adds fixed positioning + `var(--shadow-4)` elevation; compose with `.button` + `.circle`. Safe-area-aware (`--safe-bottom`/`--safe-right`), `--z-sticky`. Pure CSS. |
| Button group | 🟡 | Compose with `.cluster`. No formal `.button-group` |
| Split button (button + dropdown) | ⚫ | Needs JS for dropdown state |
| Busy / loading button | 🟢 | Dex `hwitb7hy` (`button[aria-busy="true"]`) |

## Feedback & async

| Pattern | Status | Notes |
|---|---|---|
| Tooltip | ✅ | `.tip[data-tooltip]` is a decorative icon-label mirror; accessible supplemental help uses `.tooltip`, a trigger with `aria-describedby`, and non-interactive `.tip[role="tooltip"]` content |
| Hover card (interactive tooltip) | 🔴 | Similar shape to tooltip but persists on hover, can contain links. Pure CSS feasible |
| Toast | ✅ | Shallow semantic anatomy/direct descendants, tones, optional timed progress, and six logical placements |
| Modal / dialog | ✅ | Native `<dialog>` styled in `@layer components`; `.di-dialog` is deprecated by ADR-0017 |
| Confirm dialog | ✅ | Native `<dialog>` + `<form method="dialog">` |
| Drawer / side sheet | ✅ | Registered `.drawer` via popover; `.di-drawer` is deprecated by ADR-0017 |
| Popover | ✅ | `.popover-anchor` + `.popover[popover]` with generic logical placements |
| Spinner | ✅ | `.spinner`, size modifiers, and `button[aria-busy="true"]` |
| Progress bar | ✅ | Native `<progress class="progress">` |
| Meter / gauge | ✅ | Native `<meter class="meter">` + `.signaling` |
| Skeleton loader | ✅ | `.skeleton` with `.text` / `.circle`; ADR-0017 reverses the former scope mismatch |
| Loading overlay | 🟡 | Compose `[aria-busy]` + spinner. No formal full-region overlay class |

## Display & content

| Pattern | Status | Notes |
|---|---|---|
| Table (static) | ✅ | `.table` + `.zebra` |
| Data table (sortable, paginated) | ✅ | `.data-table*` covers sortable/selected/actions/empty/loading/compact/sticky/toolbar visuals; Decks owns JS |
| Kanban board | ✅ | `.kanban-board`, column/header/card/dropzone plus pointer and keyboard drag states; Decks owns JS |
| Timeline | ✅ | `.timeline` (also serves as stepper) |
| Stepper / wizard nav | ✅ | Same primitive as `.timeline` — naming polysemy noted in meta-system grill (Dex `elztgg8o`) |
| List (ordered, definition) | ✅ | `<ol>`, `<ul>`, `<dl>` element-default styling |
| Tree view | 🟡 | Nested `<details>` works structurally; no `.tree` class for indentation rhythm |
| Accordion | ✅ | Native `<details>`/`<summary>` styled |
| Carousel | ✅ | `.carousel`, `.reel`, `.swipe` |
| Chat thread | ✅ | `.chat-thread`, `.chat-row`, `.chat-message`, `.chat-composer`, `.bubble`; `.bubble.thinking` / `.bubble.streaming` for in-flight states; `.chat-thread.flowing` for editorial reading |
| Composer (multi-line + toolbar) | ✅ | `.composer` — supersedes `.chat-composer` when model/tool/attach controls are needed alongside the input |
| Tool-call / log line | ✅ | `.log-card` — compact card with mono label, status slot, optional `<pre>` body |
| Icon rail (vertical nav strip) | ✅ | `.icon-rail` — narrow column of icon buttons with active state and `.status` dot |
| Workbench / inspector panel | ✅ | `.workbench-panel` — right-aligned tabbed pane for artifacts, properties, code preview |
| Comment thread (nested replies) | 🟡 | Chat suite is single-thread; nested-reply pattern is composition |
| Activity feed | ✅ | Compose with `.timeline` |
| Code block (`<pre><code>`) | 🟢 | Dex `40o648j9` (planned `@layer base` styling; no syntax highlighting) |
| Diff (side-by-side or unified) | ⚫ | Heavy CSS; rarely used outside docs sites |
| Pull quote / blockquote | ✅ | `.pull-quote` + base `<blockquote>` styling |
| Figure / figcaption | ✅ | Classless `<figure>` and `<figcaption>` styling |
| Image with overlay | 🟡 | Compose `.aspect-*` + absolute children. No formal class |

## Atomic primitives

| Pattern | Status | Notes |
|---|---|---|
| Tag | ✅ | `.tag` with status-pill variants |
| Chip | ✅ | `.chip` |
| Badge (count) | 🟢 | Dex `40o648j9` (anchor-positioning based) |
| Status dot | 🟢 | Dex `40o648j9` (`.dot` variant of `.badge`) |
| Avatar | ✅ | `.avatar` |
| Avatar stack | 🟢 | Dex `xw9k5c0j` (CSS-mask technique, Beads import) |
| Kbd / keystroke | 🟢 | Dex `40o648j9` (`<kbd>` element styling) |
| Inline code | 🟢 | Dex `40o648j9` (`<code>` element styling) |
| Separator | ✅ | `<hr>` element styling |
| Aspect ratio container | ✅ | `.aspect-square`, `.aspect-video`, `.aspect-4-3`, etc. |
| Rating stars | ✅ | `.rating` supports display and native-radio input forms |
| Color swatch / palette display | 🟡 | Compose; no formal class |
| Mark / highlight (`<mark>`) | ✅ | Classless highlighter styling with forced-colors support |

## Marketing & content blocks

| Pattern | Status | Notes |
|---|---|---|
| Newsletter signup | ✅ | `.newsletter` |
| Hero | ⚫ | Template composition |
| Logo cloud | ⚫ | Template composition (`.cluster` + images) |
| Pricing table | ⚫ | Template composition (`.card.featured` + `.layout-three-col`) |
| Testimonial | 🟡 | Compose `.bubble` or `.pull-quote`. No formal `.testimonial` |
| Feature grid | ⚫ | Template composition (`.feature-card` + layout) |
| Stats section | ⚫ | Template composition (`.stat-card` + layout) |
| Team grid | ⚫ | Template composition |
| Comparison table | 🟡 | `.table` covers basics; specifically labeled comparison (yes/no checks) is composition |

## Layout primitives (in `@layer layouts`)

| Pattern | Status | Notes |
|---|---|---|
| App shell | ✅ | `.app-shell`, `.layout-sidebar` |
| Sidebar layout | ✅ | `.layout-sidebar` (with known mobile bug — see Dex `u8o1g3lw`) |
| Holy grail | ✅ | `.layout-holy-grail` |
| Three-column | ✅ | `.layout-three-col` |
| Split | ✅ | `.layout-split` |
| Card layout | ✅ | `.layout-card` |
| Readable (max-width) | ✅ | `.layout-readable` |
| Master-detail | 🔴 | Listed in meta-system grill notes as candidate gap (Dex `u8o1g3lw`) |
| Split-pane (resizable) | ⚫ | Resizing is JS |
| Centered with rails | 🟡 | Compose `.layout-readable` + sidebar |
| Full-bleed-within-readable | ✅ | `.full-bleed` modifier |
| Stack | ✅ | `.stack` |
| Cluster | ✅ | `.cluster` |
| Reel / horizontal scroll | ✅ | `.reel`, `.swipe` |
| Rail shell (icon-rail + sub-sidebar + main, optional workbench) | ✅ | `.layout-rail`, `.layout-rail.with-workbench` — container-query collapse at `<768px` |

---

## Summary

| Status | Count | What |
|---|---|---|
| ✅ Shipped | ~67 patterns | Healthy baseline coverage, including the Decks-facing visual contracts |
| 🟢 Planned (Dex/ADR) | 6 patterns | Already designed in an ADR or separate task |
| 🟡 Partial | 13 patterns | Primitives exist; canonical pattern missing |
| 🔴 Missing (real gap, HTML+CSS feasible) | 2 patterns | Hover card, floating-label inputs, master-detail layout |
| ⚫ Out of scope | ~11 patterns | Behavior-only Decks work or template-level composition |

## Triage of the 6 real remaining gaps

| Pattern | Size | Why it's a real gap |
|---|---|---|
| Hover card | M | Tooltips are non-interactive; users routinely need a tooltip that can contain links + persists on hover. Pure CSS via anchor positioning + `:hover` |
| Master-detail layout | M | List + detail pane with deep-linking. Composes from existing primitives but the canonical shape isn't formalized |
| Figure / figcaption | S | Pure base-layer element styling; no opinion shipped today |
| Rating stars | S | CSS-only pattern (radio buttons + `:checked ~ *`); commonly needed |
| `<mark>` element | XS | Native HTML element with no Graffiti styling. Trivial addition |

## Partials worth elevating

The remaining 🟡 entries are mostly "compose with existing primitives" — not real gaps, but the absence of a canonical class means authors reinvent. Most worth promoting:

1. **`.toolbar`** — horizontal action group with consistent gap, alignment, overflow behavior. Compose-with-`.cluster` works but the resulting CSS varies per consumer.

Shipped since this list was written:

- **`.icon-button`** — `<button>` containing only an SVG/icon. Standardizes glyph size, square padding, and focus ring; a classless auto-square rule covers `button[aria-label]:has(>svg:only-child)`.

## What this matrix doesn't tell you

- Whether the 🟡 partials are *worth* formalizing. Many are intentionally composition-only and adding a class would add API surface for marginal gain.
- Whether shipped patterns are well-designed — only that they exist. The `.layout-sidebar.fill` mobile bug (in `LESSONS.md`) is "shipped" but broken.
- Whether tokens/theming/meta-system gaps exist. Those are tracked in Dex `huxjwch8`, `u8o1g3lw`, `elztgg8o`.
- Patterns specific to "Hyper Modern Standards" that mainstream libs don't have yet (view-transitions, scroll-driven animations, `@starting-style`, `@scope`). A separate audit would catch these.
