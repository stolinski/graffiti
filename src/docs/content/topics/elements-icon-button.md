---
id: icon-button
title: Icon Button
route: elements
order: 110
summary: Compact square button for an icon-only action, with auto glyph sizing and an aria-label requirement.
when_to_use: Toolbar controls, close affordances, overflow menus, and any action carried by an icon alone.
classes:
  - .icon-button
  - button
demos:
  - IconButton
tags:
  - elements
  - actions
---

`.icon-button` is a square button for an icon-only action. It builds on the base
`<button>` styling and standardizes the things that were previously re-derived by
hand: glyph size, square padding, and the focus ring. Compose it with any button
variant (`.primary`, `.ghost`, `.minimal`, `.mini`).

Icon-only controls must be named for assistive tech, so always supply an
`aria-label` (the same convention `.tip` relies on for its label text).

## Basic Usage

```html
<button class="icon-button" aria-label="Edit">
  <svg aria-hidden="true">…</svg>
</button>
```

## Variants

`.icon-button` composes with the button variants. Use `.mini` for a tighter
footprint and `.ghost` / `.minimal` for low-emphasis toolbar controls.

```html
<button class="icon-button primary" aria-label="Add">…</button>
<button class="icon-button ghost" aria-label="Share">…</button>
<button class="icon-button minimal" aria-label="More options">…</button>
<button class="icon-button mini" aria-label="Edit">…</button>
```

## Classless Auto-Square

A labelled `<button>` whose only child is an `<svg>` collapses to a square
footprint with no class at all. This keeps one-off icon triggers terse while
still requiring an accessible name.

```html
<button aria-label="Close">
  <svg aria-hidden="true">…</svg>
</button>
```

## Glyph Sizing

- Any SVG inside a `<button>` or `.button` is sized from `--button-icon-size`
  (default `1.15em`), so a label+icon button and an icon-only button share one
  optical glyph size.
- Square padding comes from `--icon-button-pad`; `.mini` tightens it.
- The footprint stays square via `aspect-ratio: 1`, so it never drifts wider
  than it is tall regardless of the icon.

## Accessibility

- Always pair an icon-only control with `aria-label` — the auto-square rule only
  triggers when the label is present, nudging you toward an accessible name.
- The inner `<svg>` should be `aria-hidden="true"` so the label is the single
  accessible name.
