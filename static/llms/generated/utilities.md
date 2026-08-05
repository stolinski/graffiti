---
title: "Graffiti Utilities"
url: https://graffiti-ui.com/utilities
description: "Layout and utility classes for structure, spacing, alignment, readability, and responsive composition."
---

# Graffiti Utilities

Layout and utility classes for structure, spacing, alignment, readability, and responsive composition.

## Quick Reference

- [**Layouts**](#topic-layouts) (.layout-card, .layout-sidebar, .layout-rail) - Responsive page and panel layouts for app and content structure. ([topic](https://graffiti-ui.com/utilities/layouts))
- [**Organization**](#topic-organization) (.stack, .cluster, .split) - Flow and grouping helpers for vertical/horizontal composition. ([topic](https://graffiti-ui.com/utilities/organization))
- [**Handy Stuff**](#topic-handy) (.readable, .no-list, .circle) - Common reset, visibility, width, and helper utilities. ([topic](https://graffiti-ui.com/utilities/handy))
- [**Font Sizing**](#topic-font-sizing) (.h1, .h2, .h3) - Applying type hierarchy styles to non-heading elements. ([topic](https://graffiti-ui.com/utilities/font-sizing))
- [**Gradients**](#topic-gradients) (.gradient-*, .gradient-text) - Adding branded visual emphasis to surfaces and headings. ([topic](https://graffiti-ui.com/utilities/gradients))

---

<a id="topic-layouts"></a>

## Layouts

CSS Grid-based page layouts. All layouts are responsive by default.

**When to use:** Responsive page and panel layouts for app and content structure.

**Classes:** `.layout-card`, `.layout-sidebar`, `.layout-rail`, `.layout-rail.with-workbench`, `.layout-split`, `.layout-three-col`, `.layout-readable`, `.layout-holy-grail`, `.rail-start`, `.rail-end`, `.section`

**Direct topic doc:** [https://graffiti-ui.com/utilities/layouts](https://graffiti-ui.com/utilities/layouts)

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

---

<a id="topic-organization"></a>

## Organization

Flexbox utilities for vertical and horizontal layouts.

**When to use:** Flow and grouping helpers for vertical/horizontal composition.

**Classes:** `.stack`, `.cluster`, `.split`, `.split.vertical`, `.flex`, `.grid`

**Direct topic doc:** [https://graffiti-ui.com/utilities/organization](https://graffiti-ui.com/utilities/organization)

## Stack (Vertical)

Vertical flexbox with consistent gap:

```html
<div class="stack">
  <h2>Title</h2>
  <p>First paragraph</p>
  <p>Second paragraph</p>
</div>
```

Custom gap:

```html
<div class="stack" style="--gap: 2rem;"></div>
```

## Cluster (Horizontal)

Horizontal wrapping flexbox:

```html
<div class="cluster">
  <span class="tag">Tag 1</span>
  <span class="tag">Tag 2</span>
  <span class="tag">Tag 3</span>
</div>
```

Custom gap:

```html
<div class="cluster" style="--gap: 0.5rem;"></div>
```

## Split

Flexbox with space-between:

```html
<div class="split">
  <span>Left content</span>
  <span>Right content</span>
</div>
```

### Vertical Split

For sidebars with content at top and bottom:

```html
<aside class="split vertical">
  <nav>Navigation at top</nav>
  <div>Footer at bottom</div>
</aside>
```

## Common Patterns

### Form with Stack

```html
<form class="stack">
  <label>Email</label>
  <input type="email" />
  <label>Password</label>
  <input type="password" />
  <button class="primary">Submit</button>
</form>
```

### Button Group with Cluster

```html
<div class="cluster" style="justify-content: flex-end;">
  <button>Cancel</button>
  <button class="primary">Save</button>
</div>
```

### Tags with Cluster

```html
<div class="cluster" style="--gap: 0.5rem;">
  <span class="tag">CSS</span>
  <span class="tag">HTML</span>
  <span class="tag">JS</span>
</div>
```

### Card Content with Stack

```html
<div class="box">
  <div class="stack">
    <h3>Card Title</h3>
    <p>Card description text.</p>
    <button class="primary">Action</button>
  </div>
</div>
```

## Modifiers

- `.cluster.center` — center the row horizontally instead of starting at the inline-start edge
- `.split.even` — children take equal width (`flex: 1 1 auto`)
- `.split.center` — vertically center children (overrides the default `align-items: start`)
- `.split.vertical` — column flow, full height; useful for top+bottom split sidebars
- `.split` automatically stacks at container widths under `500px`

## Default Properties

**Stack:**

- `display: flex`
- `flex-direction: column`
- `--gap: 1rem` (override via `style="--gap: …"`)
- Resets child margins to 0

**Cluster:**

- `display: flex`
- `flex-wrap: wrap`
- `align-items: center`
- `--gap: 0.5rem`

**Split:**

- `display: flex`
- `justify-content: space-between`
- `align-items: start`
- `gap: var(--gap, 1rem)`

---

<a id="topic-handy"></a>

## Handy Stuff

Helper classes for common styling needs.

**When to use:** Common reset, visibility, width, and helper utilities.

**Classes:** `.readable`, `.no-list`, `.circle`, `.row`, `.visually-hidden`, `.auto-color`, `.full`, `.fc`

**Direct topic doc:** [https://graffiti-ui.com/utilities/handy](https://graffiti-ui.com/utilities/handy)

## Display & Layout

```html
<div class="flex">Flexbox with gap (--gap, default 1rem)</div>
<div class="grid">Grid with gap (--gap, default 1rem)</div>
<div class="split">Space-between flex with gap</div>
<div class="split vertical">Vertical split (top/bottom)</div>
```

## Readable Width

```html
<div class="readable">Max-width 900px container</div>
```

## List Reset

```html
<ul class="no-list">
  <li>No bullets, margin, or padding</li>
</ul>
```

## Spacing

```html
<div class="row">Adds vertical margin (--vs-m)</div>
<h3 class="no-margin">Zero margin</h3>
```

In forms and fieldsets, `.row` also works as a field-group wrapper (label + control + help text).

## Width

```html
<input class="full" type="email" />
<button class="button full">Full-width action</button>
```

Use `.readable` or `.narrow` when you also need max-width constraints.

## Visibility

```html
<span class="visually-hidden"
  >Hidden visually, accessible to screen readers</span
>
<div class="no-print">Hidden when printing</div>
```

## Shape

```html
<div class="circle">Circular element (40px default)</div>
```

Customize size:

```html
<div class="circle" style="--size: 60px;">Larger circle</div>
```

## Aspect Ratio

```html
<div class="aspect-square">1:1</div>
<div class="aspect-video">16:9</div>
<div class="aspect-4-3">4:3</div>
<div class="aspect-21-9">21:9</div>
```

## Fluid Container

`.fc` (alias: `.fluid-text-container`) turns the element into an inline-size container query root and switches fluid typography to container-query units (`cqi`) instead of viewport units. Use it on any region whose type should scale with the region's width — sidebars, cards, modals — not the viewport.

```html
<section class="fc">
  <h2>Scales with this section's width, not the viewport</h2>
</section>
```

## Auto Color

Automatically sets text color based on background:

```html
<div class="auto-color" style="--bg-color: var(--blue);">
  White text on blue
</div>
<div class="auto-color" style="--bg-color: var(--yellow);">
  Black text on yellow
</div>
```

With tinted text:

```html
<div class="auto-color chroma" style="--bg-color: var(--blue);">
  Slightly tinted text
</div>
```

## Validation States

`.error`, `.success`, and `.warning` set border colours on form controls (and are scoped to a few other components like `.callout`, `.tag`, `.timeline li`, `.sidebar-nav`). They do not style generic text — a `<small>` placed after an input gets caption spacing but inherits the parent's color.

```html
<input class="error" />
<small>Please enter a valid email</small>

<input class="success" />
<small>Username is available</small>

<input class="warning" />
<small>Password is weak</small>
```

For prominent inline status messages, use `<div class="callout error">…</div>` instead.

## Full Bleed

Break out of `.layout-readable` container:

```html
<div class="layout-readable">
  <p>Normal width content</p>
  <img class="full-bleed" src="wide.jpg" />
  <p>Back to normal width</p>
</div>
```

## Focus Ring

Consistent focus styling for interactive elements:

```html
<button class="focus-ring">Outline offset 2px on focus</button>
<button class="focus-ring-inset">Outline offset -2px (inset) on focus</button>
```

## Transitions

Apply smooth transitions using the easing tokens:

```html
<div class="transition">All properties, 0.2s, ease-smooth</div>
<div class="transition-fast">All properties, 0.1s, ease-smooth</div>
<div class="transition-slow">All properties, 0.4s, ease-smooth</div>
<div class="transition-bounce">All properties, 0.3s, ease-bounce</div>
<div class="transition-none">Disable transitions</div>
```

---

<a id="topic-font-sizing"></a>

## Font Sizing

Utility classes for heading-style typography and fluid size tokens.

**When to use:** Applying type hierarchy styles to non-heading elements.

**Classes:** `.h1`, `.h2`, `.h3`, `.h4`, `.h5`, `.h6`, `.fs-xs`, `.fs-base`, `.fs-s`, `.fs-m`, `.fs-l`, `.fs-xl`, `.fs-xxl`, `.fs-xxxl`

**Direct topic doc:** [https://graffiti-ui.com/utilities/font-sizing](https://graffiti-ui.com/utilities/font-sizing)

Use these classes when you need visual hierarchy without changing semantic HTML.

- `.h1`-`.h6` apply heading styles to any element.
- `.fs-*` classes map directly to the fluid type scale (`--fl`).

---

<a id="topic-gradients"></a>

## Gradients

Curated gradient background and gradient text utility classes.

**When to use:** Adding branded visual emphasis to surfaces and headings.

**Classes:** `.gradient-*`, `.gradient-text`

**Direct topic doc:** [https://graffiti-ui.com/utilities/gradients](https://graffiti-ui.com/utilities/gradients)

Gradient utilities provide complete, theme-aware color compositions.

- Use `.gradient-*` on containers for expressive backgrounds.
- Add `.gradient-text` to apply the same gradient treatment to text.
