---
id: mobile
title: Mobile Patterns
route: ui-blocks
order: 150
summary: iOS and Android-friendly CSS patterns for PWAs and native-like web apps.
when_to_use: App shell, bottom nav, bottom sheet, safe areas.
classes:
  - .app-shell
  - .bottom-nav
  - .bottom-nav.blur
  - .bottom-sheet
  - .safe-top
  - .safe-bottom
  - .safe-x
  - .hide-scrollbar
  - .momentum-scroll
demos:
  - AppShell
  - BottomNav
  - BottomSheet
tags:
  - ui-blocks
  - mobile
---

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
