---
title: "Graffiti Elements"
url: https://graffiti-ui.com/elements
description: "Single-purpose UI elements with minimal classes and native HTML semantics."
---

# Graffiti Elements

Single-purpose UI elements with minimal classes and native HTML semantics.

## Quick Reference

- [**Buttons**](#topic-buttons) (.button, .primary, .success) - Buttons and links styled as actions. ([topic](https://graffiti-ui.com/elements/buttons))
- [**Card**](#topic-card) (.card, .card.linked, .card.featured) - Grouped content, linked previews, and pricing tiles. ([topic](https://graffiti-ui.com/elements/card))
- [**Tabs**](#topic-tabs) (.tabs, .tabs.boxed, .tabs.pill) - CSS-only tabbed content using details/summary. ([topic](https://graffiti-ui.com/elements/tabs))
- [**Tooltip**](#topic-tooltip) (.tip, .tooltip, .tooltip-trigger) - Brief supplemental descriptions that do not contain controls or essential information. ([topic](https://graffiti-ui.com/elements/tooltip))
- [**Avatar**](#topic-avatar) (.avatar, .xs, .s) - User photos or initials with size variants. ([topic](https://graffiti-ui.com/elements/avatar))
- [**Chips**](#topic-chips) (.chip, .selected, .mini) - Selectable pills for filters and segmented choices. ([topic](https://graffiti-ui.com/elements/chips))
- [**Tags**](#topic-tags) (.tag, .success, .warning) - Status or category labels. ([topic](https://graffiti-ui.com/elements/tags))
- [**Bubble**](#topic-bubble) (.bubble, .bubble.thinking, .bubble.streaming) - Chat message presentation and conversation snippets. ([topic](https://graffiti-ui.com/elements/bubble))
- [**Icon Rail**](#topic-icon-rail) (.icon-rail, .icon-rail > .brand, .icon-rail > .status) - Workspace shells, agent switchers, tool palettes — any vertical nav sliver next to a wider sidebar. ([topic](https://graffiti-ui.com/elements/icon-rail))
- [**Log Card**](#topic-log-card) (.log-card, .log-card > header, .log-card > header > .label) - AI tool calls, deploy / CI logs, build steps, activity feeds — any single-row transcript line that may expand to show payload. ([topic](https://graffiti-ui.com/elements/log-card))
- [**Callouts**](#topic-callout) (.callout, .warning, .error) - Inline informational or status callout blocks. ([topic](https://graffiti-ui.com/elements/callout))
- [**Carousel**](#topic-carousel) (.carousel) - Horizontal scroll-snap for cards or media strips. ([topic](https://graffiti-ui.com/elements/carousel))
- [**Reel**](#topic-reel) (.reel) - Vertical scroll-snap list or feed. ([topic](https://graffiti-ui.com/elements/reel))
- [**Tables**](#topic-table) (.table, .table.zebra) - Responsive table wrapper and default table styling. ([topic](https://graffiti-ui.com/elements/table))
- [**Dialog**](#topic-dialog) (dialog, .close) - Native modal flows and confirmations. ([topic](https://graffiti-ui.com/elements/dialog))
- [**List Navigation**](#topic-list-nav) (.list-nav) - Grouped list-style navigation rows. ([topic](https://graffiti-ui.com/elements/list-nav))
- [**Boxes**](#topic-boxes) (.box, .glow, .semi-gloss) - Container surface styles and quick panel variants. ([topic](https://graffiti-ui.com/elements/boxes))
- [**Toggle Switch**](#topic-toggle) (.toggle, .compact) - Boolean settings with checkbox semantics. ([topic](https://graffiti-ui.com/elements/toggle))
- [**Segmented Control**](#topic-segmented-control) (.segmented-control, .compact, .full) - Switching one local view or mode when every option can be named with a short label. ([topic](https://graffiti-ui.com/elements/segmented-control))
- [**Combobox and Listbox**](#topic-combobox) (.combobox, .listbox, .option) - Filtering and selecting from a choice set when a native select or datalist cannot meet the interaction requirements. ([topic](https://graffiti-ui.com/elements/combobox))
- [**Tag Input**](#topic-tag-input) (.tag-input, .tag, .listbox) - Adding and removing several short values such as labels, recipients, or filters. ([topic](https://graffiti-ui.com/elements/tag-input))
- [**Date Picker and Calendar**](#topic-date-picker) (.date-picker, .calendar, .calendar-header) - Date entry, date selection, or range workflows that need either native browser UI or Decks-owned calendar behavior. ([topic](https://graffiti-ui.com/elements/date-picker))
- [**Input Group**](#topic-input-group) (.input-group, .input-group.stack-mobile) - Input plus attached action button patterns. ([topic](https://graffiti-ui.com/elements/input-group))
- [**Search Input**](#topic-search) (.search) - Search field with icon and compact action behavior. ([topic](https://graffiti-ui.com/elements/search))
- [**File Dropzone**](#topic-dropzone) (.dropzone, .dragover) - Drag-and-drop upload zones with native fallback. ([topic](https://graffiti-ui.com/elements/dropzone))
- [**Data Table**](#topic-data-table) (.data-table, .data-table-toolbar, .data-table-sort) - Interactive tabular datasets whose behavior is managed by Decks or another table engine. ([topic](https://graffiti-ui.com/elements/data-table))
- [**Async and Empty States**](#topic-async-state) (.progress, .meter, .signaling) - Communicating work in flight, known-range values, loading geometry, or the absence of records. ([topic](https://graffiti-ui.com/elements/async-state))

---

<a id="topic-buttons"></a>

## Buttons

Button styling for `<button>` elements and `.button` class for links.

**When to use:** Buttons and links styled as actions.

**Classes:** `.button`, `.primary`, `.success`, `.warning`, `.error`, `.ghost`, `.minimal`, `.dark`, `.light`, `.contrast`, `.mini`

**Direct topic doc:** [https://graffiti-ui.com/elements/buttons](https://graffiti-ui.com/elements/buttons)

## Variants

```html
<button>Default</button>
<button class="primary">Primary</button>
<button class="success">Success</button>
<button class="warning">Warning</button>
<button class="error">Error</button>
<button class="ghost">Ghost</button>
<button class="minimal">Minimal</button>
```

## Surface Variants

`.dark`, `.light`, and `.contrast` keep a fixed surface regardless of theme. Use them on buttons that need to sit on a particular surface (e.g., a `.dark` hero) and stay legible.

```html
<button class="dark">Always dark</button>
<button class="light">Always light</button>
<button class="contrast">Inverts against current scheme</button>
```

## Links as Buttons

```html
<a href="/signup" class="button primary">Sign Up</a>
<a href="/learn-more" class="button ghost">Learn More</a>
```

## Mini Buttons

Smaller padding for compact buttons:

```html
<button class="mini">Small</button>
<button class="primary mini">Small Primary</button>
```

## Reset Utility

`.reset` is a general-purpose utility (not a button variant) for stripping native chrome from any element. It removes background, border, radius, shadow, and padding while inheriting typography and color — useful when you want a `<button>` to behave like a bare interactive surface.

```html
<button class="reset" type="button">Icon trigger</button>
```

## Disabled State

```html
<button disabled>Disabled</button>
<button class="primary" disabled>Disabled Primary</button>
```

## Custom Color

Override with `--button-color`:

```html
<button style="--button-color: var(--purple)">Custom</button>
```

## Button Groups

Use `.cluster` for horizontal button groups:

```html
<div class="cluster">
  <button>Cancel</button>
  <button class="primary">Save</button>
</div>
```

Right-align with `justify-content`:

```html
<div class="cluster" style="justify-content: flex-end;">
  <button>Cancel</button>
  <button class="primary">Save</button>
</div>
```

## Styling Details

- All buttons have consistent padding and border-radius
- Hover, focus, and active states included
- Disabled state reduces opacity and prevents interaction

---

<a id="topic-card"></a>

## Card

A padded surface for grouped content. Reach for header, footer, or media only when you need a divided bar or edge-to-edge media.

**When to use:** Grouped content, linked previews, and pricing tiles.

**Classes:** `.card`, `.card.linked`, `.card.featured`

**Direct topic doc:** [https://graffiti-ui.com/elements/card](https://graffiti-ui.com/elements/card)

## Basic Card

The card itself is the padded surface — drop content directly inside. No wrapper, no body class.

```html
<article class="card">
  <h3>Open invoices</h3>
  <p>Three invoices are awaiting payment. The earliest is due May 1.</p>
</article>
```

Children stack vertically with a small built-in gap. Override it inline with `--gap` when you want more breathing room:

```html
<article class="card" style="--gap: var(--vs-m);">
  <h3>Weekly digest</h3>
  <p>A summary of project activity, delivered every Friday morning.</p>
  <button class="primary">Subscribe</button>
</article>
```

## Linked Card

Use `.card.linked` on an anchor for clickable cards. It applies link-reset styles and an interactive affordance (hover/focus/active states):

```html
<a class="card linked" href="/docs/release-notes">
  <h3>Release notes</h3>
  <p>Read what changed in the latest update.</p>
</a>
```

## With Header or Footer

Add a direct `<header>` or `<footer>` only when you want a divided bar with a separator. They bleed edge-to-edge through the card's padding automatically.

```html
<article class="card">
  <header>
    <h3>Starter Plan</h3>
    <span class="tag">Popular</span>
  </header>
  <p>Everything you need to get started quickly.</p>
  <footer>
    <button class="primary">Choose plan</button>
    <button class="ghost">Details</button>
  </footer>
</article>
```

## With Media

Direct `<img>`, `<picture>`, or `<figure>` children bleed edge-to-edge too. At the top or bottom of the card they extend through that side's padding.

```html
<article class="card">
  <figure style="aspect-ratio: 16 / 9; background: var(--fg-05);"></figure>
  <h3>Release notes</h3>
  <p>Highlights from the latest update.</p>
</article>
```

## Notes

- `.card` is the padded surface. Don't wrap content in an extra `<div>`.
- Children stack with `gap: var(--gap, var(--vs-s))`. Override with `style="--gap: var(--vs-m);"`.
- `<header>`, `<footer>`, and `<img>`/`<picture>`/`<figure>` direct children bleed to the card edge — use them only when you actually want that treatment.
- Skip headers and footers for simple cards. Most cards don't need them.

---

<a id="topic-tabs"></a>

## Tabs

Pure CSS tabs using `<details>` and `<summary>` with CSS Grid and Subgrid.

**When to use:** CSS-only tabbed content using details/summary.

**Classes:** `.tabs`, `.tabs.boxed`, `.tabs.pill`

**Direct topic doc:** [https://graffiti-ui.com/elements/tabs](https://graffiti-ui.com/elements/tabs)

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

---

<a id="topic-tooltip"></a>

## Tooltip

Non-interactive help shown on pointer hover and trigger focus. No JavaScript required.

**When to use:** Brief supplemental descriptions that do not contain controls or essential information.

**Classes:** `.tip`, `.tooltip`, `.tooltip-trigger`, `.tooltip-content`, `.bottom`, `.left`, `.right`

**Direct topic doc:** [https://graffiti-ui.com/elements/tooltip](https://graffiti-ui.com/elements/tooltip)

Graffiti has one accessible tooltip contract and one decorative shorthand. Use the explicit rich pattern for supplemental help. Use the pseudo pattern only to visually repeat an icon control's accessible name.

## Accessible Rich Tooltip

The trigger must be focusable, keep its normal accessible name, and reference the tooltip by `id` through `aria-describedby`. The tip must use `role="tooltip"`.

```html
<span class="tooltip">
  <span class="tooltip-trigger">
    <button aria-describedby="save-tip">Save</button>
  </span>
  <span class="tooltip-content" id="save-tip" role="tooltip">
    Saves to your local draft folder.
  </span>
</span>
```

The trigger's accessible name remains "Save" and the tooltip supplies its description. The hidden tip uses `visibility: hidden`, so its `role="tooltip"` node does not sit in the normal accessibility-tree reading order. `aria-describedby` still lets assistive technology expose the text as the trigger's description; that relationship is intentional.

Rich means formatted, non-interactive text such as `strong`, `code`, or multiple lines. A tooltip must not contain links, buttons, inputs, or other controls. Use a popover or disclosure when users need to interact with the revealed content.

Position modifiers go on the wrapper:

```html
<span class="tooltip bottom">
  <span class="tooltip-trigger">
    <button aria-describedby="delete-tip">Delete</button>
  </span>
  <span class="tooltip-content" id="delete-tip" role="tooltip"
    >Permanently deletes the draft.</span
  >
</span>
```

## Decorative Pseudo Tooltip

For an icon-only control, `.tip[data-tooltip]` can visually repeat the control's explicit accessible name without using that naming attribute as CSS content:

```html
<button class="tip" aria-label="Save to draft" data-tooltip="Save to draft">
  <svg aria-hidden="true">...</svg>
</button>
```

`data-tooltip` is presentational and must exactly match the control's accessible name. It is not an accessible name or description, and the generated pseudo-element does not use `role="tooltip"`. Do not put `aria-label` on a control that already has visible text; that can replace its visible name for screen-reader users. Use the rich pattern when a visible-label control needs supplemental help.

Position modifiers (`bottom`, `left`, `right`) go on the icon control for this pseudo pattern.

## Activation and Dismissal

- Pointer hover and trigger focus reveal the same text; pointer exit and focus exit hide it.
- Focus stays on the trigger. The tooltip itself is never focusable and has `pointer-events: none`.
- Decks may render controlled state with `.open`, `data-state="open"`, or `data-state="closed"`; these produce the same visual states as pointer/focus activation.
- `--tooltip-offset`, `--tooltip-show-delay`, and `--tooltip-hide-delay` are registered override tokens for per-instance geometry and timing.
- Essential instructions must also appear persistently in the interface. A tooltip is supplemental only.
- Graffiti's zero-JavaScript CSS cannot make Escape clear `:hover` or `:focus-within`. Pressing Escape therefore does not dismiss a tooltip while the pointer or focus remains on its trigger. If Escape dismissal is required because the tip can obscure other content, add an application-level keyboard enhancement or use a native popover/disclosure pattern instead.

## Styling Details

- Uses CSS anchor positioning (`anchor-scope`, `position-anchor`, `position-area`) with `.tooltip-trigger` as the canonical anchor
- Background: `var(--bg)`
- Border: `var(--border-1)`
- Shadow: `var(--shadow-3)`
- Max width: `30ch` (wraps longer text)
- Shows on `:hover` and `:focus-visible` / `:focus-within`
- Uses `visibility: hidden` while closed so rich tooltip nodes do not create stray reading-order content
- Smooth opacity transition (`var(--d-fast)` / `var(--ease-smooth)`)

## Migration from `aria-label`-Driven Pseudo Tips

`.tip[aria-label]` no longer generates visible content. For icon-only controls, keep the naming `aria-label` and add an identical `data-tooltip`. For controls with visible text, remove any replacement `aria-label` and use `.tooltip-trigger` plus `.tooltip-content` when supplemental help is needed. The previous rich `.tip` child remains a compatibility alias during the migration, but new Decks output uses `.tooltip-content`. Existing rich tips must add `role="tooltip"`, a unique `id`, and the trigger's matching `aria-describedby`; move interactive content to `.popover` or a disclosure.

---

<a id="topic-avatar"></a>

## Avatar

Circular avatar for user images or initials.

**When to use:** User photos or initials with size variants.

**Classes:** `.avatar`, `.xs`, `.s`, `.l`, `.xl`, `.bordered`

**Direct topic doc:** [https://graffiti-ui.com/elements/avatar](https://graffiti-ui.com/elements/avatar)

## With Image

```html
<span class="avatar">
  <img src="user.jpg" alt="Jane Doe" />
</span>
```

## With Initials

```html
<span class="avatar">JD</span> <span class="avatar">AB</span>
```

## Sizes

```html
<span class="avatar xs">XS</span>
<!-- 1.5rem -->
<span class="avatar s">S</span>
<!-- 2rem -->
<span class="avatar">M</span>
<!-- 2.5rem (default) -->
<span class="avatar l">L</span>
<!-- 3.5rem -->
<span class="avatar xl">XL</span>
<!-- 5rem -->
```

## With Border

```html
<span class="avatar bordered">
  <img src="user.jpg" alt="User" />
</span>
```

## Avatar Group

Stack avatars with negative margin:

```html
<div class="cluster" style="--gap: -0.5rem;">
  <span class="avatar bordered"><img src="user1.jpg" alt="" /></span>
  <span class="avatar bordered"><img src="user2.jpg" alt="" /></span>
  <span class="avatar bordered"><img src="user3.jpg" alt="" /></span>
  <span class="avatar bordered">+5</span>
</div>
```

## As Button (for Menus)

```html
<button class="avatar" popovertarget="user-menu">
  <img src="user.jpg" alt="Jane Doe" />
</button>
```

## Styling Details

- Circular shape (`border-radius: 50%`)
- Images use `object-fit: cover`
- Initials have subtle background (`--fg-1`)
- Text scales with avatar size

---

<a id="topic-chips"></a>

## Chips

Interactive pill-shaped elements for filters, categories, and selections.

**When to use:** Selectable pills for filters and segmented choices.

**Classes:** `.chip`, `.selected`, `.mini`

**Direct topic doc:** [https://graffiti-ui.com/elements/chips](https://graffiti-ui.com/elements/chips)

Use for multi-select interfaces, tag filters, or skill selectors.

## Basic Example

```html
<div class="cluster">
  <button class="chip">JavaScript</button>
  <button class="chip">TypeScript</button>
  <button class="chip selected">React</button>
  <button class="chip">Vue</button>
</div>
```

## Selected State

Use `.selected` class or `aria-pressed` attribute:

```html
<button class="chip selected">Selected</button>
<button class="chip" aria-pressed="true">Also Selected</button>
<button class="chip" aria-pressed="false">Not Selected</button>
```

## With Icons

```html
<button class="chip">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
    <!-- icon -->
  </svg>
  Front-End
</button>
```

Icons are automatically sized to `1em`.

## Mini Variant

Smaller chips for compact spaces:

```html
<button class="chip mini">Small</button>
```

## Disabled State

```html
<button class="chip" disabled>Disabled</button>
<button class="chip" aria-disabled="true">Also Disabled</button>
```

## Filter Selection Pattern

```html
<fieldset>
  <legend>Select your skills:</legend>
  <div class="cluster">
    <button class="chip" aria-pressed="false">Front-End</button>
    <button class="chip" aria-pressed="true">Back-End</button>
    <button class="chip" aria-pressed="false">DevOps</button>
    <button class="chip" aria-pressed="true">Design</button>
  </div>
</fieldset>
```

## Styling Details

- Pill shape with `border-radius: var(--br-xxl)`
- Border: `var(--border-1)`
- Selected state: primary color background
- Hover/focus/active states included
- Fluid typography at `--fl: -1` (smaller text)

## Chips vs Tags

- **Chips** are interactive (clickable, selectable)
- **Tags** are for display (category labels, metadata)

---

<a id="topic-tags"></a>

## Tags

Subtle category labels with customizable colors.

**When to use:** Status or category labels.

**Classes:** `.tag`, `.success`, `.warning`, `.error`, `.info`, `.muted`

**Direct topic doc:** [https://graffiti-ui.com/elements/tags](https://graffiti-ui.com/elements/tags)

Use for metadata, categories, or status indicators.

## Basic Example

```html
<span class="tag">Default</span>
<span class="tag" style="--tag-color: var(--green)">Success</span>
<span class="tag" style="--tag-color: var(--red)">Error</span>
<span class="tag" style="--tag-color: var(--purple)">New</span>
```

## Semantic Status Variants

Prefer semantic variants for common statuses:

```html
<span class="tag success">Completed</span>
<span class="tag warning">Pending</span>
<span class="tag error">Cancelled</span>
<span class="tag info">Processing</span>
```

## Custom Colors

For custom categories, use `--tag-color` as a fallback when semantic variants are not a fit:

```html
<span class="tag" style="--tag-color: var(--blue)">Technology</span>
<span class="tag" style="--tag-color: var(--orange)">Design</span>
<span class="tag" style="--tag-color: var(--teal)">Marketing</span>
```

Available colors: `--red`, `--orange`, `--yellow`, `--green`, `--teal`, `--blue`, `--indigo`, `--purple`, `--pink`, `--gray`, `--slate`

## With Icons

```html
<span class="tag" style="--tag-color: var(--green)">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
    <!-- checkmark -->
  </svg>
  Complete
</span>
```

Icons are automatically sized to `1em`.

## Interactive Tags (Links)

When used as `<a>` or `<button>`, tags get hover/focus states:

```html
<a href="/topics/css" class="tag" style="--tag-color: var(--blue)">CSS</a>
<a href="/topics/html" class="tag" style="--tag-color: var(--orange)">HTML</a>
```

## Muted Variant

Use `.muted` for neutral text color (better contrast on some backgrounds):

```html
<span class="tag muted" style="--tag-color: var(--orange)">Muted</span>
```

## In a List

```html
<div class="cluster" style="--gap: 0.5rem;">
  <span class="tag" style="--tag-color: var(--blue)">JavaScript</span>
  <span class="tag" style="--tag-color: var(--blue)">TypeScript</span>
  <span class="tag" style="--tag-color: var(--green)">Node.js</span>
</div>
```

## Styling Details

- Soft tinted background derived from `--tag-color` via OKLCH lightness/chroma adjustments (theme-aware in light and dark)
- Text color auto-adjusts for light/dark themes
- Subtle border derived from `--tag-color`
- Fluid typography at `--fl: -1` (smaller text)
- Pill shape with `border-radius: var(--br-xxl)`
- Interactive tags (`<a>`/`<button>`) lift `1px` on hover (`translate: 0 -1px`)

## Tags vs Chips

- **Tags** are for display (category labels, metadata)
- **Chips** are interactive (clickable, selectable)

---

<a id="topic-bubble"></a>

## Bubble

Chat-friendly message container with configurable colors, width, and spacing.

**When to use:** Chat message presentation and conversation snippets.

**Classes:** `.bubble`, `.bubble.thinking`, `.bubble.streaming`, `.chat-thread`, `.chat-thread.flowing`, `.chat-row`, `.chat-row.self`, `.chat-message`, `.chat-composer`

**Direct topic doc:** [https://graffiti-ui.com/elements/bubble](https://graffiti-ui.com/elements/bubble)

`.bubble` is a rounded chat container with configurable padding, max-width, and child flow spacing.

## Basic Usage

```html
<article class="bubble">Assistant message with default bubble tokens.</article>
```

## Sender Variants with CSS Variables

```html
<article class="bubble">Assistant response bubble.</article>

<article
  class="bubble"
  style="--bubble-bg: var(--primary-1); --bubble-border: var(--primary-5);"
>
  User message bubble.
</article>
```

## Multi-Element Content

```html
<article class="bubble">
  <h5>Deployment status</h5>
  <p>Build finished in 43s and staging is ready for QA.</p>
</article>
```

## Chat Layout Helpers

Use these helpers to build complete chat threads:

- `.chat-thread` - Vertical message stack with configurable spacing/padding
- `.chat-row` - Left-aligned row
- `.chat-row.self` - Right-aligned row
- `.chat-message` - Width-constrained wrapper for each message
- `.chat-composer` - Composer row where `.input-group` expands to fill space

```html
<section class="chat-thread">
  <div class="chat-row">
    <article class="chat-message bubble">Assistant message</article>
  </div>

  <div class="chat-row self">
    <article
      class="chat-message bubble"
      style="--bubble-bg: var(--primary-1); --bubble-border: var(--primary-5);"
    >
      User message
    </article>
  </div>
</section>

<footer class="chat-composer">
  <button class="circle" type="button">+</button>
  <div class="input-group">
    <input type="text" placeholder="Message..." />
    <button class="primary" type="button">Send</button>
  </div>
</footer>
```

## In-Flight Variants

Two state modifiers for assistant turns:

```html
<article class="bubble thinking">Thinking about how to phrase the answer…</article>

<article class="bubble streaming">
  Charting cohort retention by month, indexed to the Jul launch
</article>
```

- `.bubble.thinking` — dashed border, italic, muted color. For reasoning / system thought.
- `.bubble.streaming` — appends a blinking caret cursor. Pure CSS (`@keyframes`).

## Flowing Thread (Bubble-less)

For long-form / editorial agents the conversation can read as one document
rather than a stack of bubbles. Each turn becomes a row in a single
readable column:

```html
<section class="chat-thread flowing">
  <div class="turn">
    <p class="who">You</p>
    <div class="body">
      <p>Summarize the changelog since Q3.</p>
    </div>
  </div>
  <div class="turn">
    <p class="who">Atlas</p>
    <div class="body">
      <p>Two themes line up: paywall timing and onboarding cuts.</p>
      <p>The Aug 02 change is the larger contributor (≈4.1 pp).</p>
    </div>
  </div>
</section>
```

## CSS Variables

- `--bubble-bg` - Bubble background color
- `--bubble-border` - Bubble border color
- `--bubble-max-inline` - Max bubble width
- `--bubble-pad-block` - Block-axis padding
- `--bubble-pad-inline` - Inline-axis padding
- `--bubble-radius` - Corner radius
- `--bubble-flow-space` - Spacing between child elements

---

<a id="topic-icon-rail"></a>

## Icon Rail

Narrow vertical column of icon buttons with active state and optional status dot.

**When to use:** Workspace shells, agent switchers, tool palettes — any vertical nav sliver next to a wider sidebar.

**Classes:** `.icon-rail`, `.icon-rail > .brand`, `.icon-rail > .status`, `.icon-rail > .spacer`

**Direct topic doc:** [https://graffiti-ui.com/elements/icon-rail](https://graffiti-ui.com/elements/icon-rail)

`.icon-rail` is a narrow vertical column of icon buttons. Drop in agent
switchers, tool palettes, workspace shells. Pair with [`.layout-rail`](/utilities#layouts)
for a rail + sidebar + main app shell.

## Basic Usage

```html
<aside class="icon-rail">
  <div class="brand" aria-hidden="true">
    <svg>…</svg>
  </div>
  <a href="/atlas" aria-current="page" title="Atlas">
    <svg>…</svg>
    <span class="status"></span>
  </a>
  <a href="/scribe" title="Scribe"><svg>…</svg></a>
  <div class="spacer"></div>
  <a href="/account" title="Account">
    <span class="avatar s">EK</span>
  </a>
</aside>
```

## Anatomy

- `.icon-rail` — vertical container (`inline-size: --rail-size`, default `4rem`).
- `.brand` — square top-of-rail mark on the primary color. Place a logo or sigil.
- `> a`, `> button` — icon rows. Active row uses `aria-current="page"` or
  `aria-pressed="true"`; hover and focus pick up `--fg-1` / `--shadow-1`.
- `> .status` — optional 8px green dot in the bottom-trailing corner of a row,
  for "currently active" / "online" affordance.
- `> .spacer` — `flex: 1` filler to push the next children to the bottom.

## Composition

Sits left of a `.layout-sidebar`, sub-sidebar (`.chat-list` or similar), or
inside `.layout-rail`:

```html
<div class="layout-rail">
  <aside class="icon-rail">…</aside>
  <aside class="chat-list">…</aside>
  <section class="app-shell">…</section>
</div>
```

## CSS Variables

- `--rail-size` — width of the rail (default `4rem`)

---

<a id="topic-log-card"></a>

## Log Card

Compact card with mono label, status slot, and optional pre body — for tool calls, deploy logs, build steps.

**When to use:** AI tool calls, deploy / CI logs, build steps, activity feeds — any single-row transcript line that may expand to show payload.

**Classes:** `.log-card`, `.log-card > header`, `.log-card > header > .label`, `.log-card > header > .status`, `.log-card > pre`

**Direct topic doc:** [https://graffiti-ui.com/elements/log-card](https://graffiti-ui.com/elements/log-card)

`.log-card` is a compact card with a mono label header, a status slot,
and an optional `<pre>` body. Reads as a single row that may expand.
General-purpose transcript line — not chat-specific.

## Basic Usage

```html
<div class="log-card">
  <header>
    <svg>…</svg>
    <span class="label">query.warehouse</span>
    <span class="status">✓ 412ms</span>
  </header>
  <pre>select cohort_month, retained_30d
from analytics.user_retention</pre>
</div>
```

## Anatomy

- `> header` — mono label row with an icon, a `.label` (monospace), and an
  optional `.status` pushed to the trailing end. Status is meant for short
  affordances like `✓ 412ms`, `… running`, `× failed`.
- `> pre` — optional payload. Wraps at the card edge; readable but contained.
- Any other body content (paragraphs, summaries) also works — `<pre>` is just
  the most common.

## Composition

Sits inside a `.chat-message` for AI tool calls, or anywhere a
single-row-with-payload affordance is needed:

```html
<article class="chat-message stack">
  <p class="text-faint fs-xs"><strong>Atlas</strong> · using tools</p>
  <div class="log-card">…</div>
  <div class="log-card">…</div>
</article>
```

---

<a id="topic-callout"></a>

## Callouts

Informational boxes for tips, warnings, errors, and success messages.

**When to use:** Inline informational or status callout blocks.

**Classes:** `.callout`, `.warning`, `.error`, `.success`, `.ghost`, `.fill`, `.callout.stack`

**Direct topic doc:** [https://graffiti-ui.com/elements/callout](https://graffiti-ui.com/elements/callout)

## Variants

```html
<div class="callout">Default callout for general information.</div>
<div class="callout warning">Warning callout for important notices.</div>
<div class="callout error">Error callout for critical issues.</div>
<div class="callout success">Success callout for confirmations.</div>
<div class="callout ghost">Ghost callout for subtle messages.</div>
```

## With Icon

The first direct `<svg>` child is pulled into the gutter and colored with
`--callout-accent`:

```html
<div class="callout warning">
  <svg aria-hidden="true">…</svg>
  <p>This action cannot be undone.</p>
</div>
```

## With Button

```html
<div class="callout">
  <p>Your trial expires in 3 days.</p>
  <button>Upgrade Now</button>
</div>
```

## Fill Variant

Add `.fill` for a soft tinted surface (no border):

```html
<div class="callout fill">Filled info callout.</div>
<div class="callout warning fill">Filled warning callout.</div>
```

## Multiple Elements

Add `.stack` directly to the callout to align children to the start and stack them with consistent spacing:

```html
<div class="callout stack">
  <h4>Multiple Elements</h4>
  <p>First paragraph of content.</p>
  <p>Second paragraph of content.</p>
  <button>Action</button>
</div>
```

A nested `<div class="stack">` works too if you need finer control over which children stack.

## CSS Variables

- `--callout-tint` - Background color (applies to `.fill` only)
- `--callout-accent` - Icon color

---

<a id="topic-carousel"></a>

## Carousel

Horizontal scrolling with CSS scroll-snap. No JavaScript required.

**When to use:** Horizontal scroll-snap for cards or media strips.

**Classes:** `.carousel`

**Direct topic doc:** [https://graffiti-ui.com/elements/carousel](https://graffiti-ui.com/elements/carousel)

## Basic Example

```html
<div class="carousel">
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
  <div>Slide 4</div>
  <div>Slide 5</div>
</div>
```

## With Cards

```html
<div class="carousel">
  <div class="box" style="min-width: 300px;">
    <h3>Card 1</h3>
    <p>Card content here.</p>
  </div>
  <div class="box" style="min-width: 300px;">
    <h3>Card 2</h3>
    <p>Card content here.</p>
  </div>
  <div class="box" style="min-width: 300px;">
    <h3>Card 3</h3>
    <p>Card content here.</p>
  </div>
</div>
```

## With Images

```html
<div class="carousel">
  <img src="image1.jpg" alt="Image 1" style="min-width: 80%;" />
  <img src="image2.jpg" alt="Image 2" style="min-width: 80%;" />
  <img src="image3.jpg" alt="Image 3" style="min-width: 80%;" />
</div>
```

## Styling Details

- `display: flex` with horizontal overflow
- `scroll-snap-type: x mandatory` for snapping
- Children have `scroll-snap-align: start`
- Thin scrollbar (`scrollbar-width: thin`)
- Default gap of 1rem

## Custom Gap

```html
<div class="carousel" style="--gap: 2rem;"></div>
```

## How It Works

- Drag, swipe, or scroll horizontally
- Items snap to start position
- Works with mouse, touch, trackpad, and keyboard
- No JavaScript needed for basic functionality

---

<a id="topic-reel"></a>

## Reel

Vertical scrolling with CSS scroll-snap. Like carousel but vertical.

**When to use:** Vertical scroll-snap list or feed.

**Classes:** `.reel`

**Direct topic doc:** [https://graffiti-ui.com/elements/reel](https://graffiti-ui.com/elements/reel)

## Basic Example

```html
<div class="reel" style="--reel-height: 400px;">
  <div>Panel 1</div>
  <div>Panel 2</div>
  <div>Panel 3</div>
  <div>Panel 4</div>
</div>
```

## With Content Panels

```html
<div class="reel" style="--reel-height: 500px;">
  <div class="box">
    <h3>Section 1</h3>
    <p>Full panel content here.</p>
  </div>
  <div class="box">
    <h3>Section 2</h3>
    <p>Another panel.</p>
  </div>
  <div class="box">
    <h3>Section 3</h3>
    <p>Third panel.</p>
  </div>
</div>
```

## CSS Variables

- `--reel-height` - Container height (default: 80vh)
- `--gap` - Gap between panels (default: 1rem)

## Styling Details

- `display: flex` with `flex-direction: column`
- `scroll-snap-type: y mandatory` for snapping
- Children have `scroll-snap-align: start`
- Vertical overflow with thin scrollbar

## How It Works

- Scroll vertically to navigate panels
- Panels snap to top
- Works with mouse wheel, touch, and keyboard

---

<a id="topic-table"></a>

## Tables

Responsive table wrapper with clean data table styling.

**When to use:** Responsive table wrapper and default table styling.

**Classes:** `.table`, `.table.zebra`

**Direct topic doc:** [https://graffiti-ui.com/elements/table](https://graffiti-ui.com/elements/table)

## Basic Example

```html
<div class="table">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Jane Doe</td>
        <td>jane@example.com</td>
        <td>Admin</td>
      </tr>
      <tr>
        <td>John Smith</td>
        <td>john@example.com</td>
        <td>User</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Zebra Striping

Add `.zebra` to the wrapper for alternating row backgrounds (`var(--fg-05)` on even rows):

```html
<div class="table zebra">
  <table>
    <!-- … -->
  </table>
</div>
```

## Why the Wrapper?

The `.table` wrapper provides:

- Horizontal scrolling on small screens
- Border and border-radius on the container
- Proper overflow handling

## Styling Details

- Tables are 100% width with collapsed borders
- Headers have bottom border separator
- Cells have consistent padding
- Last row has no bottom border
- Wrapper has `overflow-x: auto` for responsiveness

## CSS Variables

- `--table-border` - Custom border-radius for wrapper

## Without Wrapper

Basic table styling also works without the wrapper, but you lose the responsive overflow and container styling:

```html
<table>
  <thead>
    <tr>
      <th>Header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data</td>
    </tr>
  </tbody>
</table>
```

---

<a id="topic-dialog"></a>

## Dialog

Native HTML `<dialog>` element with open/close animations.

**When to use:** Native modal flows and confirmations.

**Classes:** `dialog`, `.close`

**Direct topic doc:** [https://graffiti-ui.com/elements/dialog](https://graffiti-ui.com/elements/dialog)

No JavaScript required when using HTML invokers.

## Basic Example

```html
<button commandfor="my-dialog" command="show-modal">Open Dialog</button>

<dialog id="my-dialog">
  <button class="close" commandfor="my-dialog" command="close">×</button>
  <p>You can put anything in a dialog.</p>
</dialog>
```

## How It Works

- `commandfor` points to the dialog's `id`
- `command="show-modal"` opens the dialog as a modal
- `command="close"` closes the dialog
- No JavaScript needed for basic open/close

## Close Button

The `.close` class creates a circular red button. When it is a direct child of a `<dialog>`, an extra rule pins it to the top-right corner (slightly overlapping the dialog's top edge). Used outside a `<dialog>`, it's just the circular button — position it yourself.

```html
<button class="close">×</button>
```

## Styling Details

- `max-width: 40ch` - Character-based width for good proportions
- Dark backdrop overlay
- Smooth scale/opacity animation on open/close
- Works in light and dark themes automatically

---

<a id="topic-list-nav"></a>

## List Navigation

Navigation list with clickable rows for settings pages, menus, and navigation indexes.

**When to use:** Grouped list-style navigation rows.

**Classes:** `.list-nav`

**Direct topic doc:** [https://graffiti-ui.com/elements/list-nav](https://graffiti-ui.com/elements/list-nav)

Each item is a pill-shaped card with subtle shadow.

## Use Cases

- Settings pages
- Mobile app menus
- Feature indexes
- Dashboard navigation
- Account/profile menus

## Basic Structure

```html
<nav class="list-nav">
  <a href="/profile">
    <svg>...</svg>
    Profile
    <small>Manage your account settings</small>
  </a>

  <a href="/notifications">
    <svg>...</svg>
    Notifications
    <small>Configure alerts and updates</small>
  </a>
</nav>
```

## Item Structure

Items are direct `<a>` or `<button>` children of `.list-nav`. No additional classes needed.

Each item can contain:

1. **`<svg>`** - Icon on the left (sized to 1.25em)
2. **Text** - Title text
3. **`<small>`** - Optional description (muted, smaller text)

## Styling

Each item automatically gets:

- **Pill radius** - `var(--br-xxl)` rounded corners
- **Subtle shadow** - `var(--shadow-2)` for elevated card appearance
- **Background** - Uses `var(--bg)` for proper theming
- **Gap** - `var(--pad-m)` spacing between items
- **Dark mode** - Items pick up a `var(--border-1)` border for definition

## With Button Elements

```html
<nav class="list-nav">
  <button onclick="openSettings()">
    <svg>...</svg>
    Open Settings
    <small>Configure your preferences</small>
  </button>
</nav>
```

## Disabled State

```html
<nav class="list-nav">
  <button disabled>
    <svg>...</svg>
    Advanced Settings
    <small>Coming soon</small>
  </button>
</nav>
```

## States

- **Default**: Pill-shaped card with subtle shadow
- **Hover**: Background highlight, icon brightens
- **Focus**: Focus ring with inset offset
- **Active**: Slightly darker background
- **Disabled**: 65% opacity, no pointer events

## Differences from Sidebar Nav

| Feature       | List Nav                     | Sidebar Nav              |
| ------------- | ---------------------------- | ------------------------ |
| Item style    | Individual cards with shadow | Flat items in a list     |
| Description   | Supported via `<small>`      | Not supported            |
| Use case      | Standalone navigation rows   | Sticky sidebar menus     |
| Nesting       | Not supported                | Supports details/summary |
| Visual weight | Higher (cards with shadow)   | Lower (compact)          |

## Accessibility

- Use semantic `<nav>` container
- Use `<a>` for navigation links, `<button>` for actions
- Disabled buttons use `disabled` attribute
- Links can use `aria-disabled="true"` when needed
- Focus states are clearly visible

---

<a id="topic-boxes"></a>

## Boxes

Container styles for cards and content blocks.

**When to use:** Container surface styles and quick panel variants.

**Classes:** `.box`, `.glow`, `.semi-gloss`, `.ghost`, `.invisible`

**Direct topic doc:** [https://graffiti-ui.com/elements/boxes](https://graffiti-ui.com/elements/boxes)

## Variants

```html
<div class="box">Default box with tint background.</div>
<div class="box glow">Glow box with subtle inset shadow.</div>
<div class="box semi-gloss">Semi-gloss with gradient and stronger shadow.</div>
<div class="box ghost">Ghost box - transparent with border only.</div>
<div class="box invisible">
  Invisible box - no background, border, or shadow.
</div>
```

## With Content

```html
<div class="box">
  <div class="stack">
    <h3>Panel Title</h3>
    <p>Box description text goes here.</p>
    <button class="primary">Action</button>
  </div>
</div>
```

## Custom Shadow

Combine box styles with shadow variables:

```html
<div class="box" style="box-shadow: var(--box), var(--shadow-5);">
  Box with custom deeper shadow.
</div>
```

## In Grid Layout

```html
<div class="layout-card">
  <div class="box">Box 1</div>
  <div class="box">Box 2</div>
  <div class="box">Box 3</div>
</div>
```

## Styling Details

- `.box` - Tint background, padding, border-radius, border
- `.box.glow` - Applies `var(--box)` — a soft outer drop shadow plus two inset highlights for a subtle dimensional sheen
- `.box.semi-gloss` - Gradient background, premium feel
- `.box.ghost` - Transparent, border outline only
- `.box.invisible` - No visual styling, just structure

---

<a id="topic-toggle"></a>

## Toggle Switch

Accessible toggle/switch input using native checkbox.

**When to use:** Boolean settings with checkbox semantics.

**Classes:** `.toggle`, `.compact`

**Direct topic doc:** [https://graffiti-ui.com/elements/toggle](https://graffiti-ui.com/elements/toggle)

<span id="forms"></span>

## Basic Example

```html
<input type="checkbox" class="toggle" />
<input type="checkbox" class="toggle" checked />
```

## With Label

```html
<label>
  <input type="checkbox" class="toggle" />
  Enable notifications
</label>

<label>
  <input type="checkbox" class="toggle" checked />
  Dark mode
</label>
```

## Compact Variant

Smaller toggle for tight spaces:

```html
<input type="checkbox" class="toggle compact" />
```

## Disabled State

```html
<input type="checkbox" class="toggle" disabled />
<input type="checkbox" class="toggle" checked disabled />
```

## Custom Color

Override the checked color:

```html
<input type="checkbox" class="toggle" style="--toggle-color: var(--green)" />
```

## CSS Variables

- `--toggle-color` - Color when checked (default: `var(--primary)`)
- `--toggle-width` - Track width
- `--toggle-height` - Track height

## Accessibility

The toggle uses a native checkbox, so it:

- Works with keyboard (Space to toggle)
- Announces state to screen readers
- Respects `prefers-reduced-motion`

---

<a id="topic-segmented-control"></a>

## Segmented Control

Mutually exclusive compact choices backed by native radio inputs.

**When to use:** Switching one local view or mode when every option can be named with a short label.

**Classes:** `.segmented-control`, `.compact`, `.full`

**Direct topic doc:** [https://graffiti-ui.com/elements/segmented-control](https://graffiti-ui.com/elements/segmented-control)

Use a `fieldset` with a real `legend`. Each direct `label` contains one radio. The radios retain their shared `name`, form value, arrow-key behavior, and validation semantics; Graffiti only changes their presentation.

```html
<fieldset class="segmented-control">
  <legend class="visually-hidden">Project view</legend>
  <label><input type="radio" name="view" value="list" /> List</label>
  <label><input type="radio" name="view" value="board" checked /> Board</label>
</fieldset>
```

- `.compact` tightens the labels for dense toolbars.
- `.full` makes equal segments fill the available inline size.
- Checked, focus-visible, hover, and disabled states derive from the nested native input. Do not replace the radios with manually synchronized buttons.

---

<a id="topic-combobox"></a>

## Combobox and Listbox

Visual contracts for enhanced text selection, listbox popups, and option states.

**When to use:** Filtering and selecting from a choice set when a native select or datalist cannot meet the interaction requirements.

**Classes:** `.combobox`, `.listbox`, `.option`

**Direct topic doc:** [https://graffiti-ui.com/elements/combobox](https://graffiti-ui.com/elements/combobox)

Decks owns filtering, `aria-expanded`, `aria-controls`, `aria-activedescendant`, active-option movement, selection, Escape, and focus return. Graffiti expects this structure:

```html
<div class="combobox" aria-expanded="true">
  <label for="owner">Owner</label>
  <input
    id="owner"
    role="combobox"
    aria-controls="owner-list"
    aria-expanded="true"
  />
  <div id="owner-list" class="listbox" role="listbox">
    <button class="option" role="option" aria-selected="true">Ada</button>
  </div>
</div>
```

Use `data-active="true"` for the active-descendant row, `aria-selected` for committed selection, and `aria-disabled` for unavailable options. Add `popover` to `.listbox` when it should use the top layer; otherwise Decks may toggle `hidden`, `.open`, or `data-state`. Prefer native `<select>` for finite non-searchable choices and `<datalist>` when its browser-provided behavior is sufficient.

---

<a id="topic-tag-input"></a>

## Tag Input

Multi-value input frame composed from tags, a combobox input, and a listbox.

**When to use:** Adding and removing several short values such as labels, recipients, or filters.

**Classes:** `.tag-input`, `.tag`, `.listbox`, `.option`

**Direct topic doc:** [https://graffiti-ui.com/elements/tag-input](https://graffiti-ui.com/elements/tag-input)

`.tag-input` contains existing `.tag` values and one borderless text or combobox input. Each removal control needs a value-specific accessible label. Decks owns tokenization, duplicate prevention, Backspace behavior, selection, and announcements.

```html
<div class="tag-input">
  <span class="tag">CSS <button aria-label="Remove CSS">×</button></span>
  <input role="combobox" aria-controls="tag-options" aria-label="Add tag" />
</div>
<div id="tag-options" class="listbox" role="listbox">…</div>
```

The frame exposes focus-within, invalid, and disabled visuals. Keep the source-order input reachable after existing tags. Do not make an entire tag removable without a dedicated focusable control.

---

<a id="topic-date-picker"></a>

## Date Picker and Calendar

Native date input first, with an enhanced anchored calendar surface when product requirements exceed the platform picker.

**When to use:** Date entry, date selection, or range workflows that need either native browser UI or Decks-owned calendar behavior.

**Classes:** `.date-picker`, `.calendar`, `.calendar-header`, `.calendar-grid`, `.calendar-day`

**Direct topic doc:** [https://graffiti-ui.com/elements/date-picker](https://graffiti-ui.com/elements/date-picker)

Start with a labeled native input:

```html
<label class="date-picker">Due date <input type="date" name="due" /></label>
```

Only add an enhanced `.calendar[popover]` for range selection, unavailable dates, or product-specific month navigation. `.date-picker` anchors the trigger. `.calendar-header` contains previous/title/next controls. `.calendar-grid` remains a semantic table, and each `.calendar-day` is a button.

Use `aria-current="date"` for today, `aria-pressed` or `data-selected` for selection, `data-range-start` / `data-range-end` for range endpoints, `.outside` for adjacent-month dates, and native `disabled` for unavailable dates. Decks owns localized labels, roving focus, Page Up/Down, Home/End, month arithmetic, and focus return.

---

<a id="topic-input-group"></a>

## Input Group

Input field with connected button.

**When to use:** Input plus attached action button patterns.

**Classes:** `.input-group`, `.input-group.stack-mobile`

**Direct topic doc:** [https://graffiti-ui.com/elements/input-group](https://graffiti-ui.com/elements/input-group)

Use for copy-to-clipboard, search with button, URL sharing, or any input that needs an action.

## Basic Example

```html
<div class="input-group">
  <input type="text" value="https://example.com/share/abc123" readonly />
  <button>Copy</button>
</div>
```

## Search with Button

```html
<div class="input-group">
  <input type="search" placeholder="Search documentation..." />
  <button class="primary">Search</button>
</div>
```

## Code/Coupon Input

```html
<div class="input-group">
  <input type="text" placeholder="Enter code..." />
  <button class="success">Apply</button>
</div>
```

## Mini Button Variant

```html
<div class="input-group">
  <input type="text" value="some-value" />
  <button class="mini">Copy</button>
</div>
```

## Stack on Mobile

Add `.stack-mobile` to break the group into a vertical stack below `640px`. Each child reclaims a full border-radius so the input and button read as separate controls.

```html
<div class="input-group stack-mobile">
  <input type="email" placeholder="you@example.com" />
  <button class="primary">Subscribe</button>
</div>
```

## Styling Details

- Input stretches to fill available space
- Button stays sized to content
- Connected with no gap, shared border-radius
- Works with all button variants (`.primary`, `.ghost`, etc.)

---

<a id="topic-search"></a>

## Search Input

Search input with icon positioned inside.

**When to use:** Search field with icon and compact action behavior.

**Classes:** `.search`

**Direct topic doc:** [https://graffiti-ui.com/elements/search](https://graffiti-ui.com/elements/search)

## Basic Example

```html
<div class="search">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    viewBox="0 0 256 256"
  >
    <path
      d="M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z"
    ></path>
  </svg>
  <input type="search" placeholder="Search..." />
</div>
```

## With Value

```html
<div class="search">
  <svg><!-- search icon --></svg>
  <input type="search" value="graffiti css" />
</div>
```

## Disabled

```html
<div class="search">
  <svg><!-- search icon --></svg>
  <input type="search" placeholder="Search..." disabled />
</div>
```

## Icon Source

Get icons from [Phosphor Icons](https://phosphoricons.com/). The magnifying glass icon shown above is the "MagnifyingGlass" icon.

## Styling Details

- Icon is absolutely positioned, vertically centered
- Input has left padding to accommodate the icon
- Icon is muted (`var(--fg-3)`) so the user's typed text reads as the primary content

---

<a id="topic-dropzone"></a>

## File Dropzone

Drag-and-drop file upload zone with click-to-upload fallback.

**When to use:** Drag-and-drop upload zones with native fallback.

**Classes:** `.dropzone`, `.dragover`

**Direct topic doc:** [https://graffiti-ui.com/elements/dropzone](https://graffiti-ui.com/elements/dropzone)

## Basic Example

```html
<label class="dropzone">
  <input type="file" />
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    viewBox="0 0 256 256"
  >
    <path
      d="M212,136v64a12,12,0,0,1-12,12H56a12,12,0,0,1-12-12V136a12,12,0,0,1,24,0v52H188V136a12,12,0,0,1,24,0ZM96.49,88.49,116,69v83a12,12,0,0,0,24,0V69l19.51,19.52a12,12,0,1,0,17-17l-40-40a12,12,0,0,0-17,0l-40,40a12,12,0,1,0,17,17Z"
    ></path>
  </svg>
  <span>Drop files here or click to upload</span>
</label>
```

## Multiple Files

```html
<label class="dropzone">
  <input type="file" multiple />
  <svg><!-- upload icon --></svg>
  <span>Drop multiple files here or click to upload</span>
</label>
```

## Accept Specific Types

```html
<label class="dropzone">
  <input type="file" accept="image/*" />
  <svg><!-- upload icon --></svg>
  <span>Drop images here or click to upload</span>
</label>
```

## Drag State

Add `.dragover` class via JavaScript when files are dragged over:

```javascript
const dropzone = document.querySelector(".dropzone");

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");
  // Handle files: e.dataTransfer.files
});
```

## Icon Source

Get icons from [Phosphor Icons](https://phosphoricons.com/). The upload icon shown above is the "UploadSimple" icon.

## Styling Details

- Padding: `var(--pad-xxxl)`, radius: `var(--br-l)` (hardcoded; theme by editing the source or wrapping)
- Dashed border (`2px dashed var(--fg-2)`)
- Centered flex layout for icon and text
- File input is transparent but covers the entire area, preserving its native keyboard and pointer behavior
- Click anywhere to trigger file picker
- Keyboard focus on the file input is shown on the visible dropzone surface
- Disabled file inputs dim the dropzone and suppress hover and dragover treatments
- `.dragover` state swaps border and icon colour to `var(--accent)`

---

<a id="topic-data-table"></a>

## Data Table

Complete visual states for sortable, selectable, actionable, empty, loading, compact, sticky data tables.

**When to use:** Interactive tabular datasets whose behavior is managed by Decks or another table engine.

**Classes:** `.data-table`, `.data-table-toolbar`, `.data-table-sort`, `.data-table-actions`, `.data-table-empty`, `.data-table-loading`

**Direct topic doc:** [https://graffiti-ui.com/elements/data-table](https://graffiti-ui.com/elements/data-table)

`.data-table` composes a `.data-table-toolbar` with the existing `.table > table` contract. Decks owns TanStack state, callbacks, keyboard behavior, and server coordination.

- Put `aria-sort` on the `<th>` and a `.data-table-sort` button inside it.
- Put `aria-selected="true"` on selected rows. Selection checkboxes retain value-specific labels.
- Use `.data-table-actions` on an action cell or toolbar group.
- Use a spanning `.data-table-empty` cell for filtered zero-results.
- Use `.data-table-loading` with `.skeleton` cells, and set `aria-busy="true"` on `.data-table`.
- `.compact` tightens cell padding. `.sticky` bounds the table wrapper and pins headers.

The toolbar responds to its own container, not the viewport. Tables continue to scroll horizontally on narrow hosts. Never replace native table semantics with a grid of generic elements for styling convenience.

---

<a id="topic-async-state"></a>

## Async and Empty States

Native progress and meter elements plus canonical empty, skeleton, spinner, and busy-button states.

**When to use:** Communicating work in flight, known-range values, loading geometry, or the absence of records.

**Classes:** `.progress`, `.meter`, `.signaling`, `.empty`, `.skeleton`, `.spinner`

**Direct topic doc:** [https://graffiti-ui.com/elements/async-state](https://graffiti-ui.com/elements/async-state)

Choose by meaning:

- `<progress class="progress">` is work in flight. Include `value` for determinate progress and omit it for indeterminate progress.
- `<meter class="meter">` is a current value in a known range. `.signaling` opts into success/warning/error paint based on the native range attributes.
- `.spinner` is a compact indeterminate indicator. Give it `role="status"` and an accessible label unless adjacent text already announces loading.
- `.skeleton` preserves content geometry. Mark skeleton shapes `aria-hidden="true"` and put `aria-busy="true"` plus an accessible loading label on the containing region. `.text` and `.circle` are shape modifiers.
- `.empty` is a centered no-content composition with optional icon, heading, body, and `.form-actions`. `.compact` fits bounded cards and table regions.

`button[aria-busy="true"]` gets the canonical busy indicator and stops accepting pointer input. Application behavior must still prevent duplicate submissions. Spinner and skeleton animation stops under reduced motion while their semantic loading text remains.
