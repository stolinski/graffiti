---
id: layouts
title: Layouts
route: utilities
order: 100
summary: CSS Grid-based page layouts. All layouts are responsive by default.
when_to_use: Responsive page and panel layouts for app and content structure.
classes:
  - .layout-card
  - .layout-sidebar
  - .layout-split
  - .layout-three-col
  - .layout-readable
demos:
  - LayoutCard
  - LayoutSidebar
  - LayoutSplit
  - LayoutThreeCol
  - LayoutReadable
tags:
  - utilities
  - layout
---

## Sidebar Layout

```html
<div class="layout-sidebar">
  <aside>Sidebar (250px)</aside>
  <main>Main content</main>
</div>
```

**Variants:**

- `.layout-sidebar` - 250px sidebar (default)
- `.layout-sidebar.narrow` - 150px sidebar
- `.layout-sidebar.wide` - 350px sidebar
- `.layout-sidebar.invert` - Sidebar on right
- `.layout-sidebar.fill` - Full app-shell frame (`--layout-gap: 0`, `height: 100dvh`)
- `.layout-sidebar.fixed` - Sticky sidebar with scrolling main content

## Canonical: Dashboard / Settings Shell

```html
<div class="layout-sidebar fill">
  <aside>
    <nav class="sidebar-nav">
      <a href="/overview" aria-current="page">Overview</a>
      <a href="/settings">Settings</a>
    </nav>
  </aside>
  <div class="app-shell">
    <header>Workspace</header>
    <main>Main content scrolls here</main>
    <footer>Footer actions</footer>
  </div>
</div>
```

## Card Grid

Auto-fill responsive grid:

```html
<div class="layout-card">
  <div class="box">Card 1</div>
  <div class="box">Card 2</div>
  <div class="box">Card 3</div>
</div>
```

Customize minimum card width:

```html
<div class="layout-card" style="--min-card-width: 200px;"></div>
```

## Split (50/50)

```html
<div class="layout-split">
  <div>Left half</div>
  <div>Right half</div>
</div>
```

Add `.no-stack` to prevent stacking on mobile.

## Three Column

```html
<div class="layout-three-col">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

Responsive: 3 cols → 2 cols → 1 col.

## Holy Grail

Sidebar + content + sidebar:

```html
<div class="layout-holy-grail">
  <aside style="width: 200px">Left</aside>
  <main>Content</main>
  <aside style="width: 200px">Right</aside>
</div>
```

## Readable Width

Max-width container for optimal reading:

```html
<div class="layout-readable">
  <p>Content constrained to readable width</p>
</div>
```

**Variants:**

- `.layout-readable` - Start-aligned
- `.layout-readable.center` - Centered
- `.layout-readable.end` - End-aligned

**Full bleed child:**

```html
<div class="layout-readable">
  <p>Normal content</p>
  <img class="full-bleed" src="wide-image.jpg" />
  <p>Back to readable width</p>
</div>
```

## CSS Variables

- `--gap` or `--layout-gap` - Gap between grid items
- `--min-card-width` - Minimum card width for `.layout-card`
- `--max-width` - Max width for `.layout-readable`
- `--padding` - Inline padding for `.layout-readable`
