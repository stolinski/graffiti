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
  - .layout-rail
  - .layout-rail.with-workbench
  - .layout-split
  - .layout-three-col
  - .layout-readable
  - .layout-holy-grail
  - .rail-start
  - .rail-end
  - .section
demos:
  - LayoutCard
  - LayoutSidebar
  - LayoutSplit
  - LayoutThreeCol
  - LayoutHolyGrail
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
- `.layout-sidebar.invert` - Sidebar on right (combine with `.narrow` or `.wide`)
- `.layout-sidebar.fill` - Full app-shell frame (`--layout-gap: 0`, `height: 100dvh`)
- `.layout-sidebar.fixed` - Sticky sidebar with scrolling main content

## Rail Shell (Icon Rail + Sub-Sidebar + Main)

```html
<div class="layout-rail">
  <aside class="icon-rail">…</aside>
  <aside class="chat-list">…</aside>
  <section class="app-shell">…</section>
</div>
```

Use `.layout-rail` when you need an icon rail in front of a wider sub-sidebar
(agent switcher / conversation list / file tree) before the main reading
column. Add `.with-workbench` for a 4th [`.workbench-panel`](/ui-blocks#workbench-panel)
on the trailing edge.

Mobile collapse is **container-query** driven (not media-query). At `<768px`
container width the rail / list / workbench hide; reveal them via a
`.drawer-toggle` button + `[popover].drawer` pair. The shell responds to its
own width, so it works in artboards, embeds, and iframes — not just full
viewports.

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

Use `.layout-holy-grail` for editorial and documentation pages with a centered,
max-width reading column and supporting side rails. The `<main>` or `<article>`
is the required direct child. When present, `.rail-start` and `.rail-end` must
also be direct children in semantic source order: start rail, middle, end rail.

```html
<div class="layout-holy-grail">
  <aside id="page-toc" class="rail-start drawer" popover="auto">
    <button
      class="close drawer-toggle"
      popovertarget="page-toc"
      popovertargetaction="hide"
      aria-label="Close table of contents"
    >
      ×
    </button>
    <nav class="toc" aria-label="On this page">…</nav>
  </aside>
  <article>
    <button class="drawer-toggle" popovertarget="page-toc">On this page</button>
    …
  </article>
  <aside class="rail-end" aria-label="Marginalia">…</aside>
</div>
```

The reading column uses `--max-width` (default `720px`) and stays centered
between the rails. At `1024px` and narrower, `.rail-end` is hidden so disposable
marginalia yields first. At `768px` and narrower, a plain `.rail-start` is
hidden. Compose the start rail with `[popover].drawer` and use a `.drawer-toggle`
with `popovertarget` to keep the table of contents available as a native drawer.
The Popover API handles opening and closing without JavaScript.

Use `.layout-three-col` instead when the content calls for equal-width columns;
`.layout-holy-grail` is specifically a readable center column with supporting
rails.

## Readable Width

Max-width container for optimal reading:

```html
<div class="layout-readable">
  <p>Content constrained to readable width</p>
</div>
```

**Variants:**

- `.layout-readable` - Centered by default (`margin: 0 auto`)
- `.layout-readable.center` - Same as default; explicit affirmation
- `.layout-readable.end` - End-aligned (`margin-inline-start: auto`)

**Full bleed child:**

```html
<div class="layout-readable">
  <p>Normal content</p>
  <img class="full-bleed" src="wide-image.jpg" />
  <p>Back to readable width</p>
</div>
```

## Section

Use `.section` to apply consistent block padding around major page regions:

```html
<section class="section">
  <h2>Featured</h2>
  <!-- … -->
</section>
```

Override the default with `--section-padding` (defaults to `var(--pad-xxxl)`).

## CSS Variables

- `--gap` or `--layout-gap` - Gap between grid items
- `--min-card-width` - Minimum card width for `.layout-card`
- `--max-width` - Reading-column max width for `.layout-holy-grail` (default `720px`); also the fallback max width for `.layout-readable`
- `--layout-max-width` - Max width for `.layout-readable`
- `--padding` - Inline padding for `.layout-readable`
- `--section-padding` - Block padding for `.section`
