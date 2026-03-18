# Lessons Learned — Graffiti AI Chat Template Refactor

## CSS Custom Property Inheritance — THE HARD TRUTH

**WRONG assumption**: "Just override `--fg` on a container and `--fg-1` through `--fg-9` will recalculate."

**CORRECT behavior**: The `--fg-*` scale is defined on `:root`:

```css
:root {
  --fg: light-dark(var(--fg-light), var(--fg-dark));
  --fg-1: oklch(from var(--fg) l c h / 0.1);
}
```

When the browser computes `--fg-1` on `:root`, it resolves the full expression using `:root`'s `--fg` value. The **computed value** is what inherits to descendants. Overriding `--fg` on a child element does NOT cause `--fg-1` to recompute — the child still gets the `:root`-computed `--fg-1`.

**This means the original template's massive inline token blob was NOT unnecessary — it was required to force the dark-on-green theme in light mode.**

**Solution**: Use `color-scheme: dark` on the container. This makes all `light-dark()` functions in the subtree resolve to their dark variant, so `--fg` evaluates to `--fg-dark` (#fff), and the entire `--fg-*` scale follows suit. Then add local overrides for `--primary` and `--bg`.

## Template Architecture Pattern

The canonical Graffiti pattern for sidebar app layouts (learned from the dashboard template):

```
layout-sidebar fill [wide]
├── aside (surface, stack, border-inline-end)
│   └── scroll content
└── section.app-shell
    ├── header.header.border
    ├── main (scrollable)
    └── footer (docked)
```

**Anti-pattern**: Wrapping the entire thing in an outer `.app-shell` and then nesting MORE `.app-shell` elements inside. This creates triple-nested CSS grids that fight each other.

**Rule**: Only ONE `.app-shell` per visual pane. The sidebar is a simple surface — it doesn't need header/main/footer grid semantics. The main content area IS the app-shell.

## Color Theming for Custom-Branded Containers

For a dark-themed container within a potentially light page:

1. Set `color-scheme: dark` on the container (makes all `light-dark()` resolve to dark values)
2. Optionally override `--bg` for a custom dark background (default dark bg is #050505)
3. Set `--primary` for accent color
4. Use `.surface` with `--surface-bg` for sub-panels
5. The entire `--fg-*`, `--border-*` scale inherits correctly from the dark-mode resolution

**Do NOT** manually override `--fg-05` through `--fg-8` — use `color-scheme: dark` instead.

## Mobile Chat Layout

The `.layout-sidebar` collapses at 768px via both `@container` and `@media` queries. For a chat app, this means:

- **Desktop**: sidebar (conversation list) + main (thread) side by side
- **Mobile**: both stack vertically, which is NOT ideal for chat UX

The dashboard template has the exact same mobile problem — sidebar stacks on top and takes ~52% of the viewport, leaving the main content in a tiny scroll trap (~156px).

**Root cause**: `.layout-sidebar.fill` keeps `height: 100dvh` on mobile but collapses to single column. The sidebar takes its natural height, leaving the app-shell with very little space.

## `.layout-sidebar.fill` Mobile Bug

When `.layout-sidebar.fill` collapses on mobile (`width < 768px`):

- Container stays at `height: 100dvh`
- Grid goes to `grid-template-columns: 1fr` (single column)
- Sidebar takes its natural height (often 400-500px)
- App-shell main content gets the remainder — often too small

The mobile CSS reset removes `position: sticky` and `max-height` from the sidebar, but does NOT reset the container's `height` constraint. This creates a broken scroll experience where the main content is trapped in a tiny area.

**Proposed fix**: Reset `height: auto` on `.layout-sidebar.fill` at mobile breakpoints, OR provide an opt-in collapse modifier.

## The `auto-color` Utility

`.auto-color` sets text `color` based on the lightness of `--bg-color`. It does NOT set `--fg` or any `--fg-*` scale. It's for contrast-safe text on colored surfaces, not for full theme overriding.

Use it for: badges, tags, chips with colored backgrounds.
Don't use it for: full-panel theming where you need borders, muted text, etc.

## Chat Component CSS Classes

Graffiti provides these chat-specific classes (in the components layer):

- `.chat-thread` — flex column container with gap and padding (customizable via `--chat-thread-gap`, `--chat-thread-padding`)
- `.chat-row` — flex row, left-aligned by default
- `.chat-row.self` — right-aligned (for "my" messages)
- `.chat-message` — constrained width (`--chat-message-max-inline: 72ch`)
- `.chat-composer` — flex row for input area
- `.bubble` — styled message bubble with border, radius, bg (customizable via `--bubble-bg`, `--bubble-border`, `--bubble-max-inline`, `--bubble-radius`, etc.)

These are well-designed and work. No changes needed.

## `.layout-sidebar.fill` Behavior

The `.fill` modifier on `.layout-sidebar`:

- Sets `--layout-gap: 0` (no gap between sidebar and main)
- Sets `align-items: stretch` (both panels fill height)
- Sets `height: var(--app-shell-min-height, 100dvh)`
- Gives children `min-block-size: 0` (prevents grid blowout)
- Adds `overflow-y: auto` to non-`.app-shell` children (sidebar scrolls)
- For `.app-shell` children, sets `--app-shell-min-height: 100%`

**This is exactly what a chat layout needs on desktop** — both panels stretched to full height, sidebar scrolls independently, main panel uses app-shell grid.

## `.header` Component

The `.header` class provides:

- Flex layout with `space-between` alignment
- `padding: var(--pad-l)`
- Supports `.border` modifier (adds `border-bottom: var(--border-1)`)
- Supports `.sticky` modifier (sticky positioning with z-index)

When inside `.app-shell`, the header is already sticky by the app-shell grid rules. Don't add `.sticky` modifier redundantly.

## `gradient-surface` Utility

The `.gradient-surface` class uses `light-dark()` to pick radial gradient colors:

```css
.gradient-surface {
  --g1: light-dark(oklch(0.97 0.005 260), oklch(0.22 0.008 260));
  --g2: light-dark(oklch(0.95 0.003 250), oklch(0.18 0.005 250));
  background: radial-gradient(ellipse at 50% 0%, var(--g1), var(--g2));
}
```

When used with `color-scheme: dark` on the container, it picks the dark gradient — a subtle dark radial gradient that adds depth. This is a good complement to the dark chat theme.

## CSS `@layer` Priority and `!important` — The Inversion Rule

Graffiti uses `@layer base, components, layouts, utilities;`. Normal declarations: `base < components < layouts < utilities`. BUT `!important` declarations **reverse**: `utilities! < layouts! < components! < base!`.

**Real bug encountered**: `.layout-sidebar > :first-child { display: none }` in `@layer layouts` was overridden by `.split { display: flex }` in `@layer utilities`. The sidebar wasn't hiding on mobile because utilities beats layouts for normal declarations.

**Fix**: Use `display: none !important` in `@layer layouts`. With layers, `!important` in a LOWER layer beats normal declarations in HIGHER layers. This is the **correct and principled use of !important** in layered CSS — not a hack.

**Rule of thumb**: When a layout decision MUST override utility styling (like "this element is hidden on mobile, period"), use `!important` in the layouts layer. CSS layers make `!important` behave correctly here.

## `layout-sidebar` Mobile Collapse (New Behavior)

As of this refactor, ALL `layout-sidebar` variants auto-collapse on mobile (`width < 768px`):

- Non-drawer sidebars (`:first-child:not(.drawer)`) are hidden with `display: none !important`
- Drawer sidebars (`.drawer` with `popover="auto"`) use the popover toggle — hidden by default, accessible via hamburger button
- The main content takes full viewport width
- For `.fill` variants, the main content (typically `.app-shell`) takes full viewport height

**Two flavors of sidebar on mobile:**

1. **Drawer sidebar** — `<aside popover="auto" class="drawer ...">` + `<button class="drawer-toggle" popovertarget="[id]">` in the header. On mobile: toggle shows, sidebar slides in when activated. On desktop: toggle hidden, sidebar renders inline.
2. **Hidden sidebar** — plain `<aside>` without `.drawer`. Simply hidden on mobile. Use for supplementary content like TOC that doesn't need mobile access.

**Affected templates**: AI Chat, Dashboard, Settings, Docs Portal (drawer pattern), Blog (hidden TOC).

## Static Color Scales vs. Overridable Scales

Graffiti has two types of color scales:

**Static scales** (defined from fixed colors, always work):

- `--green-1` through `--green-9` (from `--green: oklch(0.72 0.18 165)`)
- `--red-1` through `--red-9` (from `--red`)
- All other named color scales

**Derived scales** (defined from overridable base, may not cascade):

- `--primary-1` through `--primary-9` (from `--primary: var(--blue)`)
- `--error-1` through `--error-9` (from `--error: var(--red)`)
- `--fg-1` through `--fg-9` (from `--fg: light-dark(...)`)

When you override `--primary` on a child element, `--primary-1` etc. DON'T update (they were computed at `:root`). Use the static color scale instead: if you want green tint, use `--green-1` not `--primary-1`.

The `color-scheme: dark` approach works for `--fg-*` because it changes how `light-dark()` resolves at `:root` level, not because it recalculates the scale.
