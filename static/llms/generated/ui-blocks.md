---
title: "Graffiti UI Blocks"
url: https://graffiti-ui.com/ui-blocks
description: "Composed multi-element UI patterns built from Graffiti primitives and native HTML features."
---

# Graffiti UI Blocks

Composed multi-element UI patterns built from Graffiti primitives and native HTML features.

## Quick Reference

- [**Accordion**](#topic-accordion) (details, .bordered, .right) - Expandable sections for FAQ and settings content. ([topic](https://graffiti-ui.com/ui-blocks/accordion))
- [**Breadcrumbs**](#topic-breadcrumbs) (.breadcrumbs) - Hierarchy path navigation inside app and docs views. ([topic](https://graffiti-ui.com/ui-blocks/breadcrumbs))
- [**Pagination**](#topic-pagination) (.pagination) - Paginated result navigation with previous and next controls. ([topic](https://graffiti-ui.com/ui-blocks/pagination))
- [**Dropdown Menu**](#topic-dropdown) (.dropdown, .dropdown-menu, .dropdown-header) - Action menus using popover and anchor positioning. ([topic](https://graffiti-ui.com/ui-blocks/dropdown))
- [**Popover**](#topic-popover) (.popover-anchor, .popover, .end) - Rich revealed content containing links, controls, or forms that would be invalid inside a tooltip. ([topic](https://graffiti-ui.com/ui-blocks/popover))
- [**Toast**](#topic-toast) (.toast-viewport, .toast-item, .toast) - Brief asynchronous feedback that should not interrupt the current task. ([topic](https://graffiti-ui.com/ui-blocks/toast))
- [**Sidebar Navigation**](#topic-sidebar-nav) (.sidebar-nav, .sidebar-nav.compact, .sidebar-nav.ghost) - Sectioned app navigation with collapsible groups. ([topic](https://graffiti-ui.com/ui-blocks/sidebar-nav))
- [**Drawer**](#topic-drawer) (.drawer, .left, .right) - Side navigation, mobile bottom sheets, filter panels, and any popover surface that should fly in from a screen edge. ([topic](https://graffiti-ui.com/ui-blocks/drawer))
- [**Mobile Patterns**](#topic-mobile) (.app-shell, .bottom-nav, .bottom-nav.blur) - App shell, bottom nav, bottom sheet, safe areas. ([topic](https://graffiti-ui.com/ui-blocks/mobile))
- [**Header**](#topic-header) (.header, .header.border, .header.sticky) - Page-level site/app top navigation bar. ([topic](https://graffiti-ui.com/ui-blocks/header))
- [**Swipe**](#topic-swipe) (.swipe, .stop) - Swipe-to-reveal row actions for touch interactions. ([topic](https://graffiti-ui.com/ui-blocks/swipe))
- [**User Menu**](#topic-user-menu) (.avatar, .dropdown) - Avatar trigger plus account actions dropdown. ([topic](https://graffiti-ui.com/ui-blocks/user-menu))
- [**Confirm Dialog**](#topic-confirm-dialog) (dialog, .close) - Destructive or important confirmations using native dialog. ([topic](https://graffiti-ui.com/ui-blocks/confirm-dialog))
- [**Timeline**](#topic-timeline) (.timeline, .steps, .horizontal) - Progress steps and chronological activity flows. ([topic](https://graffiti-ui.com/ui-blocks/timeline))
- [**Kanban Board**](#topic-kanban) (.kanban-board, .kanban-column, .kanban-column-header) - Moving ordered work items among named workflow stages. ([topic](https://graffiti-ui.com/ui-blocks/kanban))
- [**Footer**](#topic-footer) (.footer) - Site footer with grouped navigation and legal links. ([topic](https://graffiti-ui.com/ui-blocks/footer))
- [**Login Form**](#topic-login-form) (form, .stack) - Email/password auth form with native control styling. ([topic](https://graffiti-ui.com/ui-blocks/login-form))
- [**Forms**](#topic-forms) (.row, .form-option-row, .form-actions) - Field rows and form actions. ([topic](https://graffiti-ui.com/ui-blocks/forms))
- [**Composer**](#topic-composer) (.composer, .composer > textarea, .composer > .toolbar) - AI chat surfaces, comment and post composers, email drafts — anywhere a textarea has adjacent affordances. Use plain `.chat-composer` when only a single input + send button is needed. ([topic](https://graffiti-ui.com/ui-blocks/composer))
- [**Workbench Panel**](#topic-workbench-panel) (.workbench-panel, .workbench-panel > header, .workbench-panel > header > .tabs) - IDE-shaped surfaces — agent artifacts, file previews, properties inspectors, anything that wants a "right rail" alongside the main reading column. ([topic](https://graffiti-ui.com/ui-blocks/workbench-panel))

---

<a id="topic-accordion"></a>

## Accordion

Native HTML disclosure element with smooth animations using `<details>` and `<summary>`.

**When to use:** Expandable sections for FAQ and settings content.

**Classes:** `details`, `.bordered`, `.right`, `.minimal`

**Direct topic doc:** [https://graffiti-ui.com/ui-blocks/accordion](https://graffiti-ui.com/ui-blocks/accordion)

## Basic Example

```html
<details>
  <summary>Click to expand</summary>
  <p>Hidden content revealed when expanded.</p>
</details>
```

## Multiple Items

```html
<details>
  <summary>Getting Started</summary>
  <p>Installation and setup instructions.</p>
</details>

<details>
  <summary>Configuration</summary>
  <p>How to configure the application.</p>
</details>

<details>
  <summary>FAQ</summary>
  <p>Frequently asked questions.</p>
</details>
```

## Open by Default

```html
<details open>
  <summary>Already Expanded</summary>
  <p>This section starts open.</p>
</details>
```

## Bordered Variant

```html
<details class="bordered">
  <summary>Bordered Accordion</summary>
  <p>Content with border container.</p>
</details>
```

## Arrow on Right

```html
<details class="right">
  <summary>Arrow on Right</summary>
  <p>Indicator moves to the right side.</p>
</details>
```

Or just on the summary:

```html
<details>
  <summary class="right">Arrow on Right</summary>
  <p>Content here.</p>
</details>
```

## Minimal (+/−) Variant

```html
<details class="minimal">
  <summary>FAQ Question</summary>
  <p>Answer using +/− toggle style.</p>
</details>
```

## Styling Details

- Smooth height animation using `@starting-style` and `allow-discrete`
- Custom `›` arrow indicator that rotates on open
- Proper focus-visible states
- No JavaScript required

## Exclusive Accordion (One Open at a Time)

Use the `name` attribute to group accordions:

```html
<details name="faq">
  <summary>Question 1</summary>
  <p>Answer 1</p>
</details>

<details name="faq">
  <summary>Question 2</summary>
  <p>Answer 2</p>
</details>
```

Only one in the group can be open at a time.

---

<a id="topic-breadcrumbs"></a>

## Breadcrumbs

Simple breadcrumb navigation with customizable separators.

**When to use:** Hierarchy path navigation inside app and docs views.

**Classes:** `.breadcrumbs`

**Direct topic doc:** [https://graffiti-ui.com/ui-blocks/breadcrumbs](https://graffiti-ui.com/ui-blocks/breadcrumbs)

## Basic Example

```html
<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ul class="no-list">
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li><a href="/products/electronics">Electronics</a></li>
    <li aria-current="page">Wireless Headphones</li>
  </ul>
</nav>
```

## Custom Separator

Default separator is `/`. Change with `--separator`:

```html
<nav class="breadcrumbs" style="--separator: '›'" aria-label="Breadcrumb">
  <ul class="no-list">
    <li><a href="/">Home</a></li>
    <li><a href="/docs">Docs</a></li>
    <li aria-current="page">Getting Started</li>
  </ul>
</nav>
```

Other separator ideas: `›`, `→`, `»`, `|`, `·`

## Current Page

Mark the current page with `aria-current="page"` on the `<li>`:

```html
<li aria-current="page">Current Page</li>
```

This removes the link styling and shows it as plain text.

## Styling Details

- Flexbox layout with wrapping
- Separators via `::before` pseudo-elements
- Links are muted (`--fg-5`) and brighten on hover (`--fg-7`)
- Proper focus-visible states

## Accessibility

- Use `aria-label="Breadcrumb"` on the `<nav>`
- Use `aria-current="page"` on the current page `<li>`
- Use semantic `<nav>`, `<ul>`, `<li>` structure

---

<a id="topic-pagination"></a>

## Pagination

Card footer style pagination with previous/next controls and current page state.

**When to use:** Paginated result navigation with previous and next controls.

**Classes:** `.pagination`

**Direct topic doc:** [https://graffiti-ui.com/ui-blocks/pagination](https://graffiti-ui.com/ui-blocks/pagination)

## Basic Example

Uses `.button.ghost` for pagination controls:

```html
<nav class="pagination" aria-label="Pagination">
  <a class="button ghost" href="/page/1" aria-disabled="true">Previous</a>
  <ul>
    <li><a class="button ghost" href="/page/1">1</a></li>
    <li><a class="button ghost" href="/page/2" aria-current="page">2</a></li>
    <li><a class="button ghost" href="/page/3">3</a></li>
    <li><a class="button ghost" href="/page/4">4</a></li>
  </ul>
  <a class="button ghost" href="/page/3">Next</a>
</nav>
```

## Card Footer Pattern

Use inside a card or box with a top border footer feel:

```html
<div class="box">
  <div>
    <h4>Results</h4>
    <p>Showing 1-20 of 120</p>
  </div>
  <nav class="pagination" aria-label="Pagination">
    <a class="button ghost" href="/page/1" aria-disabled="true">Previous</a>
    <ul>
      <li><a class="button ghost" href="/page/1">1</a></li>
      <li><a class="button ghost" href="/page/2" aria-current="page">2</a></li>
      <li><a class="button ghost" href="/page/3">3</a></li>
    </ul>
    <a class="button ghost" href="/page/3">Next</a>
  </nav>
</div>
```

## Current Page

Use `aria-current="page"` on the active page link:

```html
<a class="button ghost" href="/page/2" aria-current="page">2</a>
```

## Disabled States

Use `aria-disabled="true"` on Previous/Next at boundaries:

```html
<a class="button ghost" href="/page/1" aria-disabled="true">Previous</a>
```

## Styling Details

- `.pagination` handles layout only (flex, gap, border-top)
- Buttons use existing `.button.ghost` styles
- Page number buttons in `ul` get fixed 2rem square sizing
- Current page uses primary border and stronger text
- Border-top and padding give card footer feel

## Accessibility

- Use `aria-label="Pagination"` on the `<nav>`
- Use `aria-current="page"` on the active page link
- Use `aria-disabled="true"` for disabled controls

---

<a id="topic-dropdown"></a>

## Dropdown Menu

Native dropdown menu using HTML popover API and CSS anchor positioning.

**When to use:** Action menus using popover and anchor positioning.

**Classes:** `.dropdown`, `.dropdown-menu`, `.dropdown-header`, `.end`

**Direct topic doc:** [https://graffiti-ui.com/ui-blocks/dropdown](https://graffiti-ui.com/ui-blocks/dropdown)

No JavaScript required for open/close. The trigger and menu must be children of the
same `.dropdown`, and each menu still needs a document-unique `id` referenced by
its trigger's `popovertarget`.

## Anchor Setup (Automatic)

`.dropdown` supplies a locally scoped `--dropdown` anchor by default. The local
scope lets several dropdowns reuse that internal name without a menu attaching to
another instance. No inline custom property is required.

```html
<div class="dropdown">
  <!-- trigger + menu -->
</div>
```

The legacy `--anchor` override remains available for integrations that already
assign an explicit dashed-ident:

```html
<div class="dropdown" style="--anchor: --account-menu">
  <!-- trigger + menu -->
</div>
```

Normal dropdowns should use the automatic local anchor. If supplied, the override
must start with `--`; local scoping still keeps it isolated to that dropdown.

## Basic Example

```html
<div class="dropdown">
  <button popovertarget="menu-id">Options</button>
  <div id="menu-id" popover class="dropdown-menu">
    <a href="/profile">Profile</a>
    <a href="/settings">Settings</a>
    <hr />
    <button>Sign Out</button>
  </div>
</div>
```

## How It Works

- `.dropdown` scopes the default anchor name to its subtree
- The direct `[popovertarget]` trigger declares the anchor used by its menu
- `popovertarget` on the button points to the menu's `id`
- `popover` attribute enables native popover behavior
- `.dropdown-menu` provides styling and positioning
- Clicking outside automatically closes the menu

## With Section Headers

```html
<div class="dropdown">
  <button popovertarget="actions-menu">Actions</button>
  <div id="actions-menu" popover class="dropdown-menu">
    <div class="dropdown-header">Account</div>
    <a href="/profile">Profile</a>
    <a href="/settings">Settings</a>
    <hr />
    <div class="dropdown-header">Danger Zone</div>
    <button>Delete Account</button>
  </div>
</div>
```

## End-Aligned

Use `.end` to align the menu to the trigger's inline-end edge:

```html
<div class="dropdown end">
  <button popovertarget="menu">Options</button>
  <div id="menu" popover class="dropdown-menu">
    <!-- menu items -->
  </div>
</div>
```

## Browser Behavior

Opening and dismissal require the HTML Popover API. Placement requires CSS anchor
positioning, including `anchor-scope`. In supporting browsers, the default aligns
the menu's inline-start edge to the trigger and `.end` aligns their inline-end
edges. In browsers without all of those placement features, the native popover
still opens and its actions remain usable, but it may render at an unanchored
fallback position. Graffiti does not add a JavaScript positioning polyfill.

## Disabled Items

```html
<a href="/edit" aria-disabled="true">Edit (disabled)</a>
<!-- or -->
<a href="/edit" class="disabled">Edit (disabled)</a>
```

## Menu Item Types

Links and buttons inside `.dropdown-menu` are automatically styled:

```html
<div class="dropdown-menu" popover>
  <a href="/page">Link item</a>
  <!-- navigates -->
  <button>Button item</button>
  <!-- triggers action -->
  <hr />
  <!-- divider -->
  <div class="dropdown-header">Section</div>
  <!-- section header -->
</div>
```

---

<a id="topic-popover"></a>

## Popover

Generic interactive popover using the native Popover API and CSS anchor positioning.

**When to use:** Rich revealed content containing links, controls, or forms that would be invalid inside a tooltip.

**Classes:** `.popover-anchor`, `.popover`, `.end`, `.top`, `.left`, `.right`

**Direct topic doc:** [https://graffiti-ui.com/ui-blocks/popover](https://graffiti-ui.com/ui-blocks/popover)

`.popover-anchor` creates a local anchor scope. Its direct `popovertarget` trigger names that anchor, and a sibling `.popover[popover]` attaches below it without per-instance positioning styles.

```html
<span class="popover-anchor">
  <button popovertarget="profile-popover">Profile</button>
  <aside id="profile-popover" class="popover end" popover>
    <a href="/profile">Open profile</a>
  </aside>
</span>
```

The default placement is block-end aligned to inline-start. Add `.end`, `.top`, `.left`, or `.right` to the popover. Keep `popover="auto"` for light dismissal; use `manual` only when Decks explicitly owns dismissal. A popover may contain interactive content. A tooltip may not.

---

<a id="topic-toast"></a>

## Toast

Shallow notification viewport, item, toast, optional progress, tone, and placement contracts.

**When to use:** Brief asynchronous feedback that should not interrupt the current task.

**Classes:** `.toast-viewport`, `.toast-item`, `.toast`, `.toast-progress`

**Direct topic doc:** [https://graffiti-ui.com/ui-blocks/toast](https://graffiti-ui.com/ui-blocks/toast)

Decks owns the queue, live-region urgency, timeouts, pause/resume, insertion, and removal. The canonical public authoring surface is `.toast-viewport`, `.toast-item`, `.toast`, and optional `.toast-progress`. New toast markup stays shallow and class-light.

A persistent toast has no progress indicator and remains visible until the consumer or dismiss control hides it:

```html
<div id="notifications" class="toast-viewport bottom-end" popover="manual">
  <div class="toast-item">
    <article class="toast" role="status" aria-atomic="true">
      <strong>Draft saved</strong>
      <p>Your changes are synced.</p>
      <button
        type="button"
        popovertarget="notifications"
        popovertargetaction="hide"
        aria-label="Dismiss draft saved notification"
      >
        ×
      </button>
    </article>
  </div>
</div>
```

The modern visual contract is a neutral, configurable surface with elevation. It has no default border or accent marker. Tone modifiers are `.info`, `.success`, `.warning`, and `.error`; each sets `--toast-tone`, which colors optional tracked progress by default without recoloring the surface. Use `role="status"` for info/success. Reserve `role="alert"` for urgent warning/error.

A timed semantic toast includes `.toast-progress` and sets `--toast-duration` to the same duration as its real auto-dismiss timer:

```html
<div
  id="upload-notifications"
  class="toast-viewport bottom-end"
  popover="manual"
>
  <div class="toast-item">
    <article
      class="toast success"
      role="status"
      aria-atomic="true"
      style="--toast-duration: 5s"
    >
      <strong>Upload complete</strong>
      <p>Your file is ready.</p>
      <button
        type="button"
        popovertarget="upload-notifications"
        popovertargetaction="hide"
        aria-label="Dismiss upload complete notification"
      >
        ×
      </button>
      <span class="toast-progress" aria-hidden="true"></span>
    </article>
  </div>
</div>
```

The progress indicator is decorative and tracks `--toast-duration`; it does not provide the timer. Add `data-paused="true"` to `.toast-progress` whenever the matching dismissal timer is paused. Under reduced motion, the countdown stops and toast visibility and movement transitions become effectively immediate. Omit `.toast-progress` for persistent or manually dismissed notifications.

Adding `popover="manual"` gives the viewport native top-layer visibility. Closed popover viewports stay hidden until opened. Placement modifiers are `.top-start`, `.top-center`, `.top-end`, `.bottom-start`, `.bottom-center`, and `.bottom-end`; they use logical insets and safe-area tokens. Omitting `popover` remains valid for application-controlled stacks.

Consuming component inputs map to Graffiti output rather than requiring a particular framework implementation:

| Consumer concern | Graffiti output                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Placement        | A viewport modifier, or `data-inline="start\|center\|end"` with `data-block="start\|end"` on `.toast-viewport`            |
| Tone             | `.info`, `.success`, `.warning`, or `.error` on `.toast`                                                                  |
| Progress         | Presence or absence of a direct `.toast-progress` child                                                                   |
| Duration         | `--toast-duration` on `.toast`, synchronized with the consumer's dismissal timeout                                        |
| Dismissible      | A direct native `button[popovertargetaction="hide"]` targeting the viewport's `id`; omit it when dismissal is unavailable |
| Surface/config   | Public custom properties applied to the viewport or toast                                                                 |

Public controls are grouped by purpose:

- **Viewport geometry:** `--toast-width`, `--toast-offset`.
- **Surface and spacing:** `--toast-bg`, `--toast-border`, `--toast-radius`, `--toast-shadow`, `--toast-padding-block`, `--toast-padding-inline`, `--toast-gap`.
- **Typography:** `--toast-fg`, `--toast-muted`, `--toast-font-size`, `--toast-line-height`, `--toast-title-weight`.
- **Tone and progress:** `--toast-tone`, `--toast-progress-color`, `--toast-progress-track`, `--toast-progress-size`, `--toast-duration`.

An optional direct action composes the existing button system rather than introducing toast-owned styling. For example, add `<button class="mini minimal" type="button">Undo</button>`, or choose another documented button variant when the action needs different emphasis. Do not wrap or stretch the action to the toast width.

`.toast-header`, `.toast-body`, `.toast-actions`, and `.toast-dismiss` remain compatibility selectors for existing consumers, but new markup does not need them.

---

<a id="topic-sidebar-nav"></a>

## Sidebar Navigation

Vertical navigation for app sidebars with collapsible sections.

**When to use:** Sectioned app navigation with collapsible groups.

**Classes:** `.sidebar-nav`, `.sidebar-nav.compact`, `.sidebar-nav.ghost`, `.sidebar-nav.minimal`, `.sidebar-nav.strong-active`, `.sidebar-nav.primary`, `.sidebar-nav.success`, `.sidebar-nav.warning`, `.sidebar-nav.error`, `.sidebar-nav.dark`, `.sidebar-nav.light`, `.sidebar-nav.contrast`, `.sub`

**Direct topic doc:** [https://graffiti-ui.com/ui-blocks/sidebar-nav](https://graffiti-ui.com/ui-blocks/sidebar-nav)

Uses native `<details>`/`<summary>` for expand/collapse.

## Example

```html
<nav class="sidebar-nav">
  <a href="/inbox">Inbox</a>
  <a href="/issues" aria-current="page">Issues</a>

  <details open>
    <summary>Cycles</summary>
    <a href="/current">Current</a>
    <a href="/upcoming">Upcoming</a>
    <a href="/past">Past</a>
  </details>

  <details>
    <summary>Projects</summary>
    <a href="/web">Web App</a>
    <a href="/mobile">Mobile</a>
  </details>

  <a href="/views">Views</a>
  <a href="/settings">Settings</a>
</nav>
```

## Active State

Mark the current page with `aria-current="page"`:

```html
<a href="/issues" aria-current="page">Issues</a>
```

Or use `.active` class on nested links:

```html
<details open>
  <summary>Cycles</summary>
  <a href="/current" class="active">Current</a>
</details>
```

## Sub-Items Without Collapsible Wrapper

Use `.sub` class for indented top-level links:

```html
<nav class="sidebar-nav">
  <a href="/all">All Issues</a>
  <a href="/my-issues" class="sub">My Issues</a>
  <a href="/backlog" class="sub">Backlog</a>
</nav>
```

## With Icons

```html
<nav class="sidebar-nav">
  <a href="/inbox">
    <svg><!-- inbox icon --></svg>
    Inbox
  </a>
  <a href="/issues">
    <svg><!-- issues icon --></svg>
    Issues
  </a>
</nav>
```

Icons are automatically sized to `20px` (customizable via `--sidebar-nav-icon-size`).

## CSS Variables

- `--sidebar-nav-icon-size` - Icon size (default: 20px)
- `--sidebar-nav-indent` - Indentation for nested items (default: 1.5rem)

## Variants

### Compact

Use `.compact` when a sidebar needs denser rows:

```html
<nav class="sidebar-nav compact">
  <a href="/inbox" aria-current="page">Inbox</a>
  <a href="/assigned">Assigned</a>
  <a href="/done">Done</a>
</nav>
```

Compact mode keeps focus and hover behavior, while reducing row padding and icon size.

### Ghost

`.ghost` swaps the row gradient for a transparent fill with a thin border that strengthens on hover and active. Use it when the sidebar should read as part of a surrounding panel rather than a filled control.

```html
<nav class="sidebar-nav ghost">
  <a href="/design">Design</a>
  <a href="/engineering" aria-current="page">Engineering</a>
  <a href="/support">Support</a>
</nav>
```

### Minimal

`.minimal` drops the row chrome entirely — no border, no background, no shadow. Hierarchy comes from text color: inactive rows are `--fg-6` (inherited from the base row rule), the active row sits at `--fg-8`, and hover lifts to full `--fg`.

```html
<nav class="sidebar-nav minimal">
  <a href="/home">Home</a>
  <a href="/library" aria-current="page">Library</a>
  <a href="/archive">Archive</a>
</nav>
```

### Strong active

Compose `.strong-active` with `.minimal` or `.ghost` when the default active brightness isn't pulling enough hierarchy. The active row paints in full `--fg` and the hover state matches, so the selected row is clearly the brightest thing in the list.

```html
<nav class="sidebar-nav minimal strong-active">
  <a href="/home">Home</a>
  <a href="/library" aria-current="page">Library</a>
  <a href="/archive">Archive</a>
</nav>
```

### Color variants

Add `.primary`, `.success`, `.warning`, or `.error` to re-skin the active row's gradient and text in a theme color. These are shorthands for `--sn-color: var(--primary)` etc.

```html
<nav class="sidebar-nav primary">
  <a href="/dashboard" aria-current="page">Dashboard</a>
  <a href="/analytics">Analytics</a>
  <a href="/billing">Billing</a>
</nav>
```

You can also set `--sn-color` inline to any color in scope:

```html
<nav class="sidebar-nav" style="--sn-color: var(--purple);">
  <a href="/dashboard" aria-current="page">Dashboard</a>
</nav>
```

### Surface variants

Use `.dark`, `.light`, or `.contrast` when the sidebar should sit on a fixed surface regardless of theme. `.dark` always renders on a near-black surface, `.light` on white, `.contrast` flips against the active color scheme.

```html
<nav class="sidebar-nav dark">
  <a href="/inbox" aria-current="page">Inbox</a>
  <a href="/settings">Settings</a>
</nav>
```

### Nested tag density

`.tag` placed inside a sidebar row gets tighter padding so badge-style accents (counts, keyboard hints) don't inflate the row height.

```html
<a href="/inbox">
  Inbox
  <span class="tag">12</span>
</a>
```

## App Shell Pattern (Dashboard / Settings)

Combine with `.layout-sidebar.fill` for the canonical shell:

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
    <main>Scrollable page content</main>
    <footer>Footer actions</footer>
  </div>
</div>
```

Notes:

- `.layout-sidebar.fill` is app-shell-oriented by default (`--layout-gap: 0`, `height: 100dvh`)
- Fill children auto-scroll when they are not `.app-shell`
- If a fill child is `.app-shell`, overflow is not forced there, avoiding double-scroll

## Fixed Sidebar Pattern

```html
<div class="layout-sidebar fixed">
  <aside>
    <nav class="sidebar-nav">
      <a href="/docs" aria-current="page">Docs</a>
      <a href="/api">API</a>
    </nav>
  </aside>
  <main>
    <article>Long docs content</article>
  </main>
</div>
```

Use this when navigation should remain visible while main content scrolls.

---

<a id="topic-drawer"></a>

## Drawer

Popover-driven slide-in panel that anchors to any edge — left, right, top, or bottom.

**When to use:** Side navigation, mobile bottom sheets, filter panels, and any popover surface that should fly in from a screen edge.

**Classes:** `.drawer`, `.left`, `.right`, `.end`, `.top`, `.bottom`

**Direct topic doc:** [https://graffiti-ui.com/ui-blocks/drawer](https://graffiti-ui.com/ui-blocks/drawer)

`.drawer` is a single primitive with four edge anchors. It rides on the native `[popover]` attribute, so opening and closing requires zero JavaScript — use `popovertarget` on a button.

## Basic Example

By default, the drawer anchors to the inline start (the left edge in LTR).

```html
<button popovertarget="nav">Open</button>

<aside id="nav" popover class="drawer">
  <!-- drawer contents -->
</aside>
```

## Direction Modifiers

Add `.right`, `.top`, or `.bottom` to re-anchor the drawer to that edge. The slide-in animation, border placement, and sizing follow the edge.

```html
<aside popover class="drawer right"><!-- slides in from the right --></aside>
<aside popover class="drawer top"><!-- drops down from the top --></aside>
<aside popover class="drawer bottom"><!-- rises up from the bottom --></aside>
```

`.end` is an alias for `.right` (matches the historical sidebar convention).

## Direction Reference

| Class     | Anchors to | Slide direction | Sizing                                          |
| --------- | ---------- | --------------- | ----------------------------------------------- |
| _(none)_  | Left       | From left       | `--drawer-inline-size` wide, capped at `85vw`   |
| `.right`  | Right      | From right      | `--drawer-inline-size` wide, capped at `85vw`   |
| `.top`    | Top        | From top        | Full width, up to `85dvh`                       |
| `.bottom` | Bottom     | From bottom     | Full width, up to `85dvh`                       |

Left/right drawers are hard-capped at `max-inline-size: 85vw` — pushing `--drawer-inline-size` past that clamps to the cap.

## CSS Custom Properties

```css
.drawer {
  --drawer-inline-size: 300px; /* Width for left/right drawers */
  --drawer-bg: var(--bg);       /* Surface color */
  --drawer-border: var(--border-1); /* Edge border */
  --drawer-backdrop: 0.5;       /* Backdrop opacity when open */
}
```

## Bottom Sheet Pattern

`.drawer.bottom` is the modern, accessible bottom sheet — full-width slide-up with a scrim and proper focus management courtesy of the popover API.

```html
<button popovertarget="filters">Filters</button>

<aside id="filters" popover class="drawer bottom">
  <header><h3>Filters</h3></header>
  <!-- ... -->
  <button popovertarget="filters" popovertargetaction="hide">Done</button>
</aside>
```

## Notes

- The drawer uses `[popover]`, so it gets a backdrop, focus trapping, and ESC-to-close for free.
- All directions animate via `translate` + `@starting-style`. No JavaScript required.
- Top and bottom drawers cap at `85dvh` so they never block the entire viewport.

---

<a id="topic-mobile"></a>

## Mobile Patterns

iOS and Android-friendly CSS patterns for PWAs and native-like web apps.

**When to use:** App shell, bottom nav, bottom sheet, safe areas.

**Classes:** `.app-shell`, `.bottom-nav`, `.bottom-nav.blur`, `.bottom-sheet`, `.safe-top`, `.safe-bottom`, `.safe-x`, `.hide-scrollbar`, `.momentum-scroll`

**Direct topic doc:** [https://graffiti-ui.com/ui-blocks/mobile](https://graffiti-ui.com/ui-blocks/mobile)

## Safe Area Variables

Graffiti provides CSS variables for iOS safe areas (notch, home indicator, status bar):

```css
--safe-top: env(safe-area-inset-top, 0px);
--safe-right: env(safe-area-inset-right, 0px);
--safe-bottom: env(safe-area-inset-bottom, 0px);
--safe-left: env(safe-area-inset-left, 0px);
```

These inherited tokens use `env()` to return the user agent's safe area, or `0px`
on an ordinary rectangular viewport. For embedded app shells, override them on
the shell's containing element; descendants such as `.app-shell`, `.bottom-nav`,
and `.bottom-sheet` inherit the host-provided insets:

```css
.embedded-shell {
  --safe-top: 24px;
  --safe-right: 12px;
  --safe-bottom: 16px;
  --safe-left: 12px;
}
```

An override replaces the corresponding user-agent value. To add host spacing
while preserving a device inset, include `env()` in the override, for example
`--safe-bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem)`.

## App Shell

Grid-based container that avoids the iOS URL bar `100vh` bug:

```html
<div class="app-shell">
  <header>Sticky Header</header>
  <main>Scrollable content</main>
  <footer>Sticky Footer</footer>
</div>
```

Features:

- Uses `100dvh` (dynamic viewport height) to avoid iOS URL bar issues
- Sticky header with blur backdrop
- Main content scrolls independently
- Respects safe areas automatically
- Better nested scroll resilience (`min-block-size: 0` on shell and direct regions)

## Sidebar + App Shell (Canonical Mobile-Friendly Layout)

```html
<div class="layout-sidebar fill">
  <aside>
    <nav class="sidebar-nav">
      <a href="/overview" aria-current="page">Overview</a>
      <a href="/settings">Settings</a>
    </nav>
  </aside>

  <div class="app-shell">
    <header>Page title</header>
    <main>Scrollable page content</main>
    <footer>Footer actions</footer>
  </div>
</div>
```

Behavior:

- `.layout-sidebar.fill` now acts as an app-shell frame by default (`--layout-gap: 0`, `height: 100dvh`)
- Non-`.app-shell` first/second children auto-scroll on larger layouts
- If a fill child is `.app-shell`, overflow is not forced on that child; its `main` handles scrolling

## Bottom Navigation

Fixed tab bar for mobile apps:

```html
<nav class="bottom-nav">
  <a href="/" aria-current="page">
    <svg><!-- home icon --></svg>
    <span>Home</span>
  </a>
  <a href="/search">
    <svg><!-- search icon --></svg>
    <span>Search</span>
  </a>
  <a href="/profile">
    <svg><!-- profile icon --></svg>
    <span>Profile</span>
  </a>
</nav>
```

Features:

- Floating pill: `position: fixed`, inset from the bottom + sides, fully rounded (`var(--br-xxl)`) with `var(--shadow-3)`
- Respects `--safe-bottom` for the home indicator
- Active state via `aria-current="page"` or `.active` class (active color = `var(--primary)`)
- 24px icons + `--fl: -1` label
- Automatic light/dark theming

Add `.blur` for a translucent glass effect (70% bg + 20px backdrop blur):

```html
<nav class="bottom-nav blur"><!-- … --></nav>
```

## Bottom Sheet

Drawer that slides up from bottom:

```html
<aside class="bottom-sheet">
  <h3>Sheet Title</h3>
  <p>Content goes here. Drag handle appears automatically.</p>
</aside>
```

Features:

- Rounded top corners
- Automatic drag handle visual at top
- Respects `--safe-bottom`
- Max height 80dvh to allow dismissal

For interactive open/close, wrap in `<dialog>` or use with popover API.

## Mobile Utility Classes

```html
<!-- Safe area padding -->
<div class="safe-top">Adds padding-top for notch</div>
<div class="safe-bottom">Adds padding-bottom for home indicator</div>
<div class="safe-x">Adds horizontal safe area padding</div>

<!-- Scrolling -->
<div class="hide-scrollbar">Hides scrollbar while keeping scroll</div>
<div class="momentum-scroll">iOS-style momentum scrolling</div>
```

## Important: Viewport Meta Tag

For safe areas to work, include `viewport-fit=cover`:

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, viewport-fit=cover"
/>
```

Without this, safe area insets may not be reported correctly on iOS.

---

<a id="topic-header"></a>

## Header

Full-width site header with navigation.

**When to use:** Page-level site/app top navigation bar.

**Classes:** `.header`, `.header.border`, `.header.sticky`, `.header.readable`

**Direct topic doc:** [https://graffiti-ui.com/ui-blocks/header](https://graffiti-ui.com/ui-blocks/header)

## Basic Example

```html
<header class="header">
  <h1>Your Logo</h1>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
</header>
```

## With Border

```html
<header class="header border">
  <h1>Your Logo</h1>
  <nav><!-- nav links --></nav>
</header>
```

## Sticky Header

Sticks to top when scrolling:

```html
<header class="header sticky">
  <h1>Your Logo</h1>
  <nav><!-- nav links --></nav>
</header>
```

## Combined Variants

```html
<header class="header border sticky">
  <h1>Your Logo</h1>
  <nav><!-- nav links --></nav>
</header>
```

## Readable (Centered with Rails)

Cap the header at `1400px` and centre it with layout padding — useful when the page below uses `.layout-readable`:

```html
<header class="header readable border">
  <h1>Your Logo</h1>
  <nav><!-- nav links --></nav>
</header>
```

## Styling Details

- Spans its parent — no inherent width constraint (add `.readable` to cap at 1400px)
- Flexbox with space-between, `--gap: 1rem` between children
- Nav `<ul>` styled as horizontal flex list
- All direct children have margin reset
- `.sticky` uses `--z-overlay` and a solid `var(--bg)` background

---

<a id="topic-swipe"></a>

## Swipe

Horizontal swipe-to-reveal component using CSS scroll-snap.

**When to use:** Swipe-to-reveal row actions for touch interactions.

**Classes:** `.swipe`, `.stop`

**Direct topic doc:** [https://graffiti-ui.com/ui-blocks/swipe](https://graffiti-ui.com/ui-blocks/swipe)

Reveal action buttons by swiping left or right.

## Basic Example

```html
<div class="swipe">
  <button class="error">Delete</button>
  <div>Swipeable content</div>
  <button class="success">Archive</button>
</div>
```

## Stop Variant

Stays in "open" position after swiping:

```html
<div class="swipe stop">
  <button class="error">Delete</button>
  <div>Swipe to reveal, stays open</div>
  <button class="success">Archive</button>
</div>
```

## Structure

```
[Left actions] [Main content] [Right actions]
```

- First child = left action
- Second child = main visible content (sized to the swipe container's inline-size)
- Third child = right action

Action children should be `<button>` elements — the 200px action width is applied via `> button`. Non-button actions (`<a>`, `<div>`) will not get that width.

## Styling Details

- CSS scroll-snap for smooth snapping
- Three-column layout
- Hidden scrollbar
- Container query for center content width

## JavaScript for Events (Optional)

```javascript
const swipe = document.querySelector(".swipe");

// Detect when actions are revealed
swipe.addEventListener("scroll", () => {
  const scrollLeft = swipe.scrollLeft;
  const maxScroll = swipe.scrollWidth - swipe.clientWidth;

  if (scrollLeft === 0) {
    // Left actions visible
  } else if (scrollLeft === maxScroll) {
    // Right actions visible
  } else {
    // Centered (default)
  }
});
```

---

<a id="topic-user-menu"></a>

## User Menu

User account dropdown combining avatar trigger with dropdown menu.

**When to use:** Avatar trigger plus account actions dropdown.

**Classes:** `.avatar`, `.dropdown`

**Direct topic doc:** [https://graffiti-ui.com/ui-blocks/user-menu](https://graffiti-ui.com/ui-blocks/user-menu)

Works with both image and initials avatars. Set a unique `--anchor` on each dropdown so the menu attaches to its avatar trigger.

## Example with Image

```html
<div class="dropdown end" style="--anchor: --user-menu-jane">
  <button popovertarget="user-menu" class="avatar">
    <img src="/avatar.jpg" alt="Jane Doe" />
  </button>
  <div id="user-menu" popover class="dropdown-menu">
    <div class="dropdown-header">Jane Doe</div>
    <a href="/profile">Profile</a>
    <a href="/settings">Settings</a>
    <hr />
    <button>Sign Out</button>
  </div>
</div>
```

## Example with Initials

```html
<div class="dropdown end" style="--anchor: --user-menu-jd">
  <button popovertarget="user-menu" class="avatar">JD</button>
  <div id="user-menu" popover class="dropdown-menu">
    <div class="dropdown-header">Jane Doe</div>
    <a href="/profile">Profile</a>
    <a href="/settings">Settings</a>
    <hr />
    <button>Sign Out</button>
  </div>
</div>
```

## Key Classes

- `.dropdown.end` - Aligns menu to right edge of avatar
- `.avatar` - Circular avatar styling on the button
- `.avatar.bordered` - Adds a subtle border around the avatar
- `.dropdown-menu` - Menu styling
- `.dropdown-header` - User name display in menu

## Anchor Setup

`.dropdown` requires a `--anchor` inline style (dashed-ident, unique per instance) so the menu can position-anchor to its trigger. See the [Dropdown topic](#dropdown) for details.

## Avatar Sizes

```html
<button popovertarget="menu" class="avatar xs">JD</button>
<!-- 1.5rem -->
<button popovertarget="menu" class="avatar s">JD</button>
<!-- 2rem -->
<button popovertarget="menu" class="avatar">JD</button>
<!-- 2.5rem (default) -->
<button popovertarget="menu" class="avatar l">JD</button>
<!-- 3.5rem -->
<button popovertarget="menu" class="avatar xl">JD</button>
<!-- 5rem -->
```

---

<a id="topic-confirm-dialog"></a>

## Confirm Dialog

A confirmation dialog pattern using native `<dialog>` with title, message, and action buttons.

**When to use:** Destructive or important confirmations using native dialog.

**Classes:** `dialog`, `.close`

**Direct topic doc:** [https://graffiti-ui.com/ui-blocks/confirm-dialog](https://graffiti-ui.com/ui-blocks/confirm-dialog)

## Example

```html
<button commandfor="confirm-dialog" command="show-modal">Delete Item</button>

<dialog id="confirm-dialog">
  <button class="close" commandfor="confirm-dialog" command="close">×</button>
  <div class="stack">
    <p class="h4">Confirm Action</p>
    <p>Are you sure you want to proceed? This cannot be undone.</p>
    <div class="cluster" style="justify-content: flex-end;">
      <button commandfor="confirm-dialog" command="close">Cancel</button>
      <button class="primary" commandfor="confirm-dialog" command="close">
        Confirm
      </button>
    </div>
  </div>
</dialog>
```

## Key Classes Used

- `.close` - Circular close button (auto-positions top-right only when a direct child of `<dialog>`)
- `.stack` - Vertical layout for dialog content
- `.cluster` - Horizontal layout for action buttons
- `.h4` - Heading style without using an actual heading element
- `.primary` - Primary action button

## How It Works

- Uses HTML invokers (`commandfor`/`command`) - no JavaScript for open/close
- `.stack` provides consistent vertical spacing between title, message, and buttons
- `.cluster` with `justify-content: flex-end` aligns buttons to the right
- Both Cancel and Confirm close the dialog; add your own JS for the confirm action

## Variations

### Destructive Action

```html
<button class="error" commandfor="confirm-dialog" command="close">
  Delete
</button>
```

### With Form

```html
<dialog id="confirm-dialog">
  <form method="dialog">
    <div class="stack">
      <p class="h4">Save Changes?</p>
      <p>You have unsaved changes.</p>
      <div class="cluster" style="justify-content: flex-end;">
        <button value="cancel">Discard</button>
        <button class="primary" value="confirm">Save</button>
      </div>
    </div>
  </form>
</dialog>
```

---

<a id="topic-timeline"></a>

## Timeline

Activity feeds, step indicators, and progress tracking with status variants and glow effects.

**When to use:** Progress steps and chronological activity flows.

**Classes:** `.timeline`, `.steps`, `.horizontal`, `.active`, `.completed`, `.success`, `.warning`, `.error`, `.info`

**Direct topic doc:** [https://graffiti-ui.com/ui-blocks/timeline](https://graffiti-ui.com/ui-blocks/timeline)

## `.timeline` and `.steps`

`.timeline` and `.steps` are the same primitive — pick the name that matches intent. Use `.timeline` for chronological event lists (activity feeds, changelogs, history). Use `.steps` for ordered process flows (onboarding, multi-step forms, checkout).

```html
<ol class="steps">
  <li>Account</li>
  <li>Shipping</li>
  <li>Payment</li>
</ol>
```

## Vertical Timeline (Activity Feed)

```html
<ol class="timeline">
  <li>
    <span class="marker">
      <svg><!-- icon --></svg>
    </span>
    <p><strong>username</strong> performed an action</p>
  </li>
  <li class="completed">
    <span class="marker">
      <svg><!-- checkmark icon --></svg>
    </span>
    <p><strong>reviewer</strong> approved changes</p>
  </li>
</ol>
```

## Horizontal Timeline (Stepper)

Add `.horizontal` for step indicators:

```html
<ol class="timeline horizontal">
  <li class="completed">
    <span class="marker">
      <svg><!-- checkmark --></svg>
    </span>
    <p>Account</p>
  </li>
  <li class="completed">
    <span class="marker">
      <svg><!-- checkmark --></svg>
    </span>
    <p>Shipping</p>
  </li>
  <li class="active">
    <span class="marker">3</span>
    <p>Payment</p>
  </li>
  <li>
    <span class="marker">4</span>
    <p>Confirm</p>
  </li>
</ol>
```

## Status Variants

Apply status classes to `<li>` for colored markers with glow effects:

```html
<ol class="timeline">
  <li class="success">
    <span class="marker"
      ><svg><!-- check --></svg></span
    >
    <p>Build completed successfully</p>
  </li>
  <li class="warning">
    <span class="marker"
      ><svg><!-- warning --></svg></span
    >
    <p>3 deprecation warnings</p>
  </li>
  <li class="error">
    <span class="marker"
      ><svg><!-- x --></svg></span
    >
    <p>Deployment failed</p>
  </li>
  <li class="info">
    <span class="marker"
      ><svg><!-- info --></svg></span
    >
    <p>New version available</p>
  </li>
</ol>
```

## State Classes

| Class        | Use                      | Visual                             |
| ------------ | ------------------------ | ---------------------------------- |
| `.active`    | Current step in progress | Bold filled marker with ring       |
| `.completed` | Finished step            | Green filled marker with glow      |
| `.success`   | Success status           | Green-tinted background with glow  |
| `.warning`   | Warning status           | Yellow-tinted background with glow |
| `.error`     | Error status             | Red-tinted background with glow    |
| `.info`      | Info status              | Blue-tinted background with glow   |

## Marker Content

The `.marker` element can contain:

- **Text/numbers**: `<span class="marker">1</span>`
- **SVG icons**: `<span class="marker"><svg>...</svg></span>`
- **Emoji**: `<span class="marker">✓</span>`

SVG icons are automatically sized to 1.125rem (18px).

## CSS Custom Properties

```css
.timeline {
  --timeline-marker-size: 2.5rem; /* Marker circle size */
  --timeline-marker-color: var(--fg); /* Icon/text color */
  --timeline-marker-bg: …; /* Marker fill — each status variant overrides it */
  --timeline-line-width: 2px; /* Connecting line width */
  --timeline-line-color: var(--fg-1); /* Connecting line color */
  --timeline-gap: var(--pad-l); /* Gap between marker and content */
}
```

## Visual Features

- **Shadows**: Multi-layered box-shadow for depth
- **Inner highlight**: Subtle top highlight for 3D effect
- **Borders**: Colored borders matching status variants
- **Glow rings**: `0 0 0 3px` spread shadow for colored halo effect
- **Gradients**: Completed markers have gradient fill (lighter top, darker bottom)

## Use Cases

- **Activity feeds**: PR activity, commit history, user actions
- **Changelogs**: Version history with status indicators
- **Steppers**: Multi-step forms, checkout flow, onboarding
- **Build logs**: CI/CD pipeline status
- **Notifications**: Action history with status

---

<a id="topic-kanban"></a>

## Kanban Board

Board, lane, task card, pointer drag, drop target, selected, and keyboard-drag visual states.

**When to use:** Moving ordered work items among named workflow stages.

**Classes:** `.kanban-board`, `.kanban-column`, `.kanban-column-header`, `.kanban-card`, `.kanban-dropzone`

**Direct topic doc:** [https://graffiti-ui.com/ui-blocks/kanban](https://graffiti-ui.com/ui-blocks/kanban)

The board scrolls horizontally and keeps columns snap-aligned on narrow containers. A column contains `.kanban-column-header`, a card list, and one or more `.kanban-dropzone` destinations. Task cards compose `.card kanban-card`.

```html
<section class="kanban-board" aria-label="Project board">
  <section class="kanban-column drag-over">
    <header class="kanban-column-header">
      <h2>Doing</h2>
      <span class="tag">2</span>
    </header>
    <article class="card kanban-card keyboard-dragging" tabindex="0">…</article>
    <div class="kanban-dropzone active">Drop here</div>
  </section>
</section>
```

Decks toggles `dragging` / `data-dragging`, `keyboard-dragging` / `data-keyboard-dragging`, row selection, `drag-over`, and active/invalid dropzone states. Keyboard drag mode must provide grab/cancel/move commands, preserve focus, and announce every successful or rejected move through a polite live region. Pointer drag is an enhancement, never the only path.

---

<a id="topic-footer"></a>

## Footer

Site footer with navigation columns, copyright, and legal links.

**When to use:** Site footer with grouped navigation and legal links.

**Classes:** `.footer`

**Direct topic doc:** [https://graffiti-ui.com/ui-blocks/footer](https://graffiti-ui.com/ui-blocks/footer)

Uses container queries for responsive behavior.

## Required Classes

- `.footer` - Container with `container-type: inline-size`, removes link underlines (shows on hover)
- `.grid.auto` - Responsive auto-fit grid for nav columns

## Basic Structure

```html
<footer class="footer box stack">
  <!-- Nav columns -->
  <div class="grid auto" style="--grid-min: 120px;">
    <nav class="stack">
      <strong>Documentation</strong>
      <a href="/getting-started">Getting Started</a>
      <a href="/components">Components</a>
      <a href="/utilities">Utilities</a>
    </nav>
    <nav class="stack">
      <strong>Resources</strong>
      <a href="/changelog">Changelog</a>
      <a href="https://github.com/example">GitHub</a>
    </nav>
    <nav class="stack">
      <strong>Company</strong>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>
  </div>

  <hr />

  <!-- Bottom bar -->
  <div class="split">
    <small>Company Name &copy; 2024</small>
    <nav class="cluster">
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms</a>
    </nav>
  </div>
</footer>
```

## With Social Links

```html
<footer class="footer box stack">
  <div class="layout-sidebar wide">
    <!-- Left: Social section -->
    <div class="stack">
      <h2 class="h3">Stay in touch</h2>
      <div class="cluster">
        <a href="#" aria-label="Twitter">
          <svg><!-- icon --></svg>
        </a>
        <a href="#" aria-label="GitHub">
          <svg><!-- icon --></svg>
        </a>
      </div>
    </div>

    <!-- Right: Nav columns -->
    <div class="grid auto" style="--grid-min: 120px;">
      <nav class="stack">
        <strong>Product</strong>
        <a href="#">Features</a>
        <a href="#">Pricing</a>
      </nav>
      <!-- more columns... -->
    </div>
  </div>

  <hr />

  <div class="split">
    <div class="cluster">
      <strong>Brand</strong>
      <span>All rights reserved</span>
    </div>
    <nav class="cluster">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </nav>
  </div>
</footer>
```

## Key Features

1. **Container queries** - `.footer` sets `container-type: inline-size` so child layouts respond to footer width, not viewport
2. **No underlines** - Links have no text-decoration by default, underline appears on hover
3. **Responsive grid** - `.grid.auto` uses `auto-fit` with `--grid-min` variable for responsive columns
4. **Layout stacking** - `.layout-sidebar` and `.split` automatically stack in narrow containers

## CSS Variables

- `--grid-min` - Minimum column width for `.grid.auto` (default: 150px, recommended: 120px for footer)

## Responsive Behavior

The footer uses container queries, not media queries:

- When footer container is narrow, `.layout-sidebar` stacks vertically
- `.grid.auto` columns wrap based on `--grid-min`
- `.split` stacks when container is < 500px

## Utility Classes Used

- `.box` - Adds padding and border
- `.stack` - Vertical spacing between children
- `.cluster` - Horizontal wrapping layout
- `.split` - Space-between horizontal layout
- `.layout-sidebar` - Two-column layout (stacks in narrow containers)
- `.grid.auto` - Auto-fit responsive grid

---

<a id="topic-login-form"></a>

## Login Form

A complete login form using Graffiti's base form styles.

**When to use:** Email/password auth form with native control styling.

**Classes:** `form`, `.stack`

**Direct topic doc:** [https://graffiti-ui.com/ui-blocks/login-form](https://graffiti-ui.com/ui-blocks/login-form)

No custom CSS needed.

## Example

```html
<form class="stack" style="max-width: 400px;">
  <h2>Login Form</h2>

  <label for="email">Email</label>
  <input type="email" id="email" placeholder="you@example.com" required />

  <label for="password">Password</label>
  <input
    type="password"
    id="password"
    placeholder="Enter your password"
    required
  />

  <div class="split">
    <label><input type="checkbox" /> Remember me</label>
    <a href="#forgot">Forgot password?</a>
  </div>

  <button type="submit" class="primary">Sign In</button>

  <p style="text-align: center;">
    Don't have an account? <a href="#signup">Sign up</a>
  </p>
</form>
```

## Key Classes Used

- `.stack` - Vertical layout with consistent spacing
- `.split` - Flexbox with space-between (checkbox left, link right)
- `.primary` - Primary action button style

## Notes

- Form inputs are styled automatically (no classes needed on inputs)
- Labels automatically get proper spacing
- Use `.error`, `.success`, `.warning` classes on inputs for validation borders (or rely on `:user-invalid` / `[aria-invalid="true"]`)
- A `<small>` placed directly after an input is auto-styled as a caption — colour it inline (`style="color: var(--red-6)"`) or use a `.callout.error` for prominent messages

---

<a id="topic-forms"></a>

## Forms

All form inputs are styled automatically. No classes needed on inputs.

**When to use:** Field rows and form actions.

**Classes:** `.row`, `.form-option-row`, `.form-actions`

**Direct topic doc:** [https://graffiti-ui.com/ui-blocks/forms](https://graffiti-ui.com/ui-blocks/forms)

## Text Inputs

```html
<label for="name">Name</label>
<input type="text" id="name" placeholder="Enter name..." />

<label for="email">Email</label>
<input type="email" id="email" placeholder="you@example.com" />

<label for="password">Password</label>
<input type="password" id="password" />
```

## Textarea

```html
<label for="message">Message</label>
<textarea id="message" rows="3" placeholder="Your message..."></textarea>
```

## Select

```html
<label for="country">Country</label>
<select id="country">
  <option>United States</option>
  <option>Canada</option>
  <option>United Kingdom</option>
</select>
```

## Checkboxes & Radios

```html
<!-- Checkboxes -->
<label><input type="checkbox" /> Remember me</label>
<label><input type="checkbox" checked /> Subscribe to newsletter</label>

<!-- Radio buttons -->
<label><input type="radio" name="plan" checked /> Free</label>
<label><input type="radio" name="plan" /> Pro</label>
<label><input type="radio" name="plan" /> Enterprise</label>
```

## Option Row Labels

Use `.form-option-row` on checkbox/radio labels to align controls and text with consistent spacing.

```html
<fieldset class="stack" style="--gap: 0.5rem;">
  <legend>Size</legend>
  <label class="form-option-row"
    ><input type="radio" name="size" checked /> Small</label
  >
  <label class="form-option-row"
    ><input type="radio" name="size" /> Medium</label
  >
  <label class="form-option-row"
    ><input type="radio" name="size" /> Large</label
  >
</fieldset>
```

## Validation States

Add `.error`, `.success`, or `.warning` to inputs. These classes set the input's border color; `:user-invalid` and `[aria-invalid="true"]` produce the same error styling automatically.

```html
<input type="email" class="error" />
<small>Please enter a valid email</small>

<input type="text" class="success" />
<small>Username is available</small>

<input type="password" class="warning" />
<small>Password is weak</small>
```

A `<small>` placed directly after an input is auto-styled as a caption (block display, spacing). Style its color inline (`style="color: var(--red-6)"`) or use a `.callout.error` if you need a prominent validation message.

## Field Rows

Use `.row` as a field wrapper to group label + control + help text.

```html
<form class="stack" style="--gap: var(--vs-m);">
  <div class="row">
    <label for="email">Email</label>
    <input type="email" id="email" />
    <small class="text-faint">Used for account notifications.</small>
  </div>

  <div class="row">
    <label for="password">Password</label>
    <input type="password" id="password" />
  </div>
</form>
```

Notes:

- Outside forms, `.row` keeps its spacing utility behavior (`margin-block`).
- Inside forms and fieldsets, `.row` becomes a compact field-group wrapper.

## Form Actions

Use `.form-actions` for submit/cancel rows.

```html
<div class="form-actions">
  <button class="ghost" type="button">Cancel</button>
  <button class="primary" type="submit">Save changes</button>
</div>
```

Behavior:

- End-aligned action row on larger containers
- Wrap-friendly spacing for longer labels
- Stacks action controls full-width in narrow containers

## Disabled Inputs

```html
<input type="text" disabled value="Can't edit this" />
<select disabled>
  <option>Can't change</option>
</select>
```

---

<a id="topic-composer"></a>

## Composer

Multi-line input with an inline toolbar — model, tool, attach controls alongside the text.

**When to use:** AI chat surfaces, comment and post composers, email drafts — anywhere a textarea has adjacent affordances. Use plain `.chat-composer` when only a single input + send button is needed.

**Classes:** `.composer`, `.composer > textarea`, `.composer > .toolbar`, `.composer > .toolbar > .spacer`

**Direct topic doc:** [https://graffiti-ui.com/ui-blocks/composer](https://graffiti-ui.com/ui-blocks/composer)

`.composer` is a multi-line input with an inline toolbar. It supersedes
[`.chat-composer`](/elements#bubble) when you need model, tool, or attach
controls next to the text input. Also useful for comment and post surfaces —
anywhere a textarea has adjacent affordances.

## Basic Usage

```html
<form class="composer">
  <textarea name="message" rows="2" placeholder="Ask Atlas anything…"></textarea>
  <div class="toolbar">
    <button type="button" class="minimal" aria-label="Attach">📎</button>
    <span class="chip">web</span>
    <span class="chip">warehouse</span>
    <div class="spacer"></div>
    <button class="primary" type="submit">Send</button>
  </div>
</form>
```

## Anatomy

- `.composer` — column container. Border, `--br-l` radius, `--shadow-2` lift.
- `:focus-within` — border switches to `--primary`, adds a brand-tinted ring.
  Pure CSS, no JS.
- `> textarea`, `> input[type="text"]` — borderless inputs that inherit the
  composer's surface. `resize: none`; size with `rows`.
- `> .toolbar` — horizontal action row. Children are typically icon buttons,
  chips, or a `.spacer` to push the submit to the trailing end.
- `> .toolbar > .spacer` — `flex: 1` push-to-end helper.

## Mobile Behavior

Inside `.layout-rail`, the toolbar wraps automatically at narrow container
widths (`<768px`). Use the existing `.chip` density rather than introducing
new mobile-specific classes.

---

<a id="topic-workbench-panel"></a>

## Workbench Panel

Right-aligned pane with a tabbed body — artifact viewer, properties inspector, code preview.

**When to use:** IDE-shaped surfaces — agent artifacts, file previews, properties inspectors, anything that wants a "right rail" alongside the main reading column.

**Classes:** `.workbench-panel`, `.workbench-panel > header`, `.workbench-panel > header > .tabs`, `.workbench-panel > .body`

**Direct topic doc:** [https://graffiti-ui.com/ui-blocks/workbench-panel](https://graffiti-ui.com/ui-blocks/workbench-panel)

`.workbench-panel` is a right-aligned content pane with a tabbed header
and a scrolling body. Pairs with [`.layout-rail.with-workbench`](/utilities#layouts)
to build IDE-shaped surfaces.

## Basic Usage

```html
<aside class="workbench-panel">
  <header>
    <p><strong>Q3 retention</strong></p>
    <div class="tabs">
      <button type="button" aria-pressed="true">Preview</button>
      <button type="button">Code</button>
      <button type="button">Spec</button>
    </div>
  </header>
  <div class="body">
    <!-- artifact, preview, properties — anything -->
  </div>
</aside>
```

## Anatomy

- `> header` — title row with a `.tabs` group pushed to the trailing end.
  Tab activation uses `aria-pressed="true"` (no `aria-selected` — there's no
  ARIA tab semantics implied; treat each as an independent toggle that the
  consumer wires up).
- `> .body` — the scrolling content area (`flex: 1; overflow: auto`).

## Layout

Pair with `.layout-rail.with-workbench` for a 4-column shell (rail / list /
main / workbench). On mobile (`<768px` container width), the workbench
collapses with the other rail children.

```html
<div class="layout-rail with-workbench">
  <aside class="icon-rail">…</aside>
  <aside class="chat-list">…</aside>
  <section class="app-shell">…</section>
  <aside class="workbench-panel">…</aside>
</div>
```
