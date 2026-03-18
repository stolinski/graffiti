---
id: sidebar-nav
title: Sidebar Navigation
route: ui-blocks
order: 140
summary: Vertical navigation for app sidebars with collapsible sections.
when_to_use: Sectioned app navigation with collapsible groups.
classes:
  - .sidebar-nav
  - .sidebar-nav.compact
  - .sub
demos:
  - SidebarNav
tags:
  - ui-blocks
  - navigation
---

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

## Compact Variant

Use `.compact` when a sidebar needs denser rows:

```html
<nav class="sidebar-nav compact">
  <a href="/inbox" aria-current="page">Inbox</a>
  <a href="/assigned">Assigned</a>
  <a href="/done">Done</a>
</nav>
```

Compact mode keeps focus and hover behavior, while reducing row padding and icon size.

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
