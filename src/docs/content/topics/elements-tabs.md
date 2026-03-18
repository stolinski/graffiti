---
id: tabs
title: Tabs
route: elements
order: 310
summary: Pure CSS tabs using `<details>` and `<summary>` with CSS Grid and Subgrid.
when_to_use: CSS-only tabbed content using details/summary.
classes:
  - .tabs
  - .tabs.boxed
  - .tabs.pill
demos:
  - Tabs
tags:
  - elements
  - navigation
---

No JavaScript required.

## Basic Example (3 Tabs)

```html
<div class="tabs">
  <details name="my-tabs" open style="--n: 1">
    <summary>Tab 1</summary>
    <div>Content for tab 1</div>
  </details>
  <details name="my-tabs" style="--n: 2">
    <summary>Tab 2</summary>
    <div>Content for tab 2</div>
  </details>
  <details name="my-tabs" style="--n: 3">
    <summary>Tab 3</summary>
    <div>Content for tab 3</div>
  </details>
</div>
```

## How It Works

- The `name` attribute on `<details>` ensures only one tab can be open at a time (native HTML behavior)
- `--n` CSS variable positions each tab's summary in the correct grid column
- `--tab-count` on the container sets the number of columns (default: 3)

## Custom Tab Count

For 4 or more tabs, set `--tab-count`:

```html
<div class="tabs" style="--tab-count: 4">
  <details name="tabs-4" open style="--n: 1">
    <summary>Tab 1</summary>
    <div>Content 1</div>
  </details>
  <details name="tabs-4" style="--n: 2">
    <summary>Tab 2</summary>
    <div>Content 2</div>
  </details>
  <details name="tabs-4" style="--n: 3">
    <summary>Tab 3</summary>
    <div>Content 3</div>
  </details>
  <details name="tabs-4" style="--n: 4">
    <summary>Tab 4</summary>
    <div>Content 4</div>
  </details>
</div>
```

## Boxed Variant (Card-Style)

Tabs that visually connect to the panel below:

```html
<div class="tabs boxed">
  <details name="boxed-tabs" open style="--n: 1">
    <summary>Account</summary>
    <div>Account settings content</div>
  </details>
  <details name="boxed-tabs" style="--n: 2">
    <summary>Security</summary>
    <div>Security settings content</div>
  </details>
  <details name="boxed-tabs" style="--n: 3">
    <summary>Billing</summary>
    <div>Billing settings content</div>
  </details>
</div>
```

## Pill Variant

Segmented-control style tabs with a CSS-only sliding thumb indicator:

```html
<div class="tabs pill" style="--tab-count: 2">
  <details name="pill-tabs" open style="--n: 1">
    <summary>Content</summary>
    <div>Primary content view</div>
  </details>
  <details name="pill-tabs" style="--n: 2">
    <summary>History</summary>
    <div>Previous updates and activity</div>
  </details>
</div>
```

## Important Notes

1. **Unique names**: Each tab group needs a unique `name` attribute
2. **Open one by default**: Add `open` to the tab that should be visible initially
3. **Sequential --n values**: Must match the visual order (1, 2, 3, etc.)
4. **Match --tab-count**: If you have more than 3 tabs, set `--tab-count` to match

## Styling Details

- Uses CSS Grid with Subgrid for alignment
- Smooth opacity transitions with `@starting-style`
- Works in light and dark modes
- Keyboard accessible (native details/summary behavior)
- Active tab has underline indicator (default), card connection (boxed), or sliding thumb segment (pill)
