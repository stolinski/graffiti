---
id: toolbar
title: Toolbar
route: elements
order: 380
summary: Horizontal control bar — a wrapping flex row of buttons and controls with separator and spacer slots.
when_to_use: Editor control strips, card action rows, composer footers, and any cluster of related controls that should wrap gracefully when cramped.
classes:
  - .toolbar
  - .separator
  - .spacer
demos:
  - Toolbar
tags:
  - elements
  - actions
---

`.toolbar` is a horizontal control bar: a wrapping flex row of buttons and
controls. It is the public control-row pattern consumed by
[`.composer`](/ui-blocks#composer) and is equally at home wrapping a card's
actions or an editor's formatting controls.

## Anatomy

- `.toolbar` — flex row with `--vs-xs` gap. `flex-wrap: wrap` is on by default,
  so controls reflow onto a new line when the container is narrow.
- `> .separator` — a hairline vertical divider (`--fg-2`) for grouping related
  controls. Slot it as a `<span class="separator">` between groups.
- `> .spacer` — a `flex: 1` push-to-end helper. Everything after it is pushed to
  the inline-end, e.g. to anchor a primary action on the trailing side.

## Composition

The toolbar carries layout only — gap, wrap, and the two slots. Style its
children with the existing button vocabulary (`.button`, `.minimal`, `.ghost`)
and `.icon-button` for icon-only controls; icon-only controls must carry an
`aria-label`. `.composer` consumes `.toolbar` directly, adding only its own
inline padding as a context override.
