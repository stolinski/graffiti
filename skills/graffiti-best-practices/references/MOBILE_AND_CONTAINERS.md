# Mobile and Container Queries

Most AI-generated Graffiti pages handle mobile by writing `@media (max-width: 768px) { ... }` and hoping for the best. That's a regression — Graffiti has a more durable set of patterns. Use the right one for the right layer.

---

## 1. Container queries over media queries (default)

### The principle

Components should respond to **the width of their own container**, not the viewport. A card that switches from a 2-up grid to a stacked layout should do so when it's narrow — whether that's because the viewport is small, or because it's sitting in a sidebar, or because it's embedded in a docs page next to a long table of contents.

Graffiti's layout primitives are designed for this. `.layout-three-col` already collapses based on its own width. `.layout-card` uses `grid-template-columns: repeat(auto-fit, minmax(...))` — a container-aware idiom. When you write new layout-shaped CSS, follow suit.

### When to use `@container`

Almost always for component-internal responsiveness. Examples:

- A composer that has a multi-line toolbar at desktop but wraps to a single-line tap target on phone.
- An app shell with a left rail + sub-sidebar + main, collapsing to a single column at narrow widths.
- A card whose body switches from side-by-side image/text to stacked.
- A tab strip that becomes a select dropdown when there's not enough room.

Setup:

```css
.layout-rail {
  display: grid;
  grid-template-columns: auto auto 1fr;
  container-type: inline-size;
  container-name: rail-shell;
}

@container rail-shell (max-width: 767px) {
  .layout-rail { grid-template-columns: 1fr; }
  .layout-rail > .icon-rail,
  .layout-rail > .chat-list { display: none; }
}
```

This works the same way whether `.layout-rail` is full-viewport or embedded inside a sized iframe / preview / artboard.

### When to use `@media` instead

Reserve `@media` for **page-shaped concerns** that legitimately depend on the viewport — not the component:

- Visibility of a full-bleed hero section.
- Reading-column line-length (where viewport size and font scale interact).
- Type-scale ramp changes that should follow the viewport's `vi` units.
- Print stylesheets.

If you're writing a `@media` query about a single component, that's a code smell — convert to `@container`.

### Don't mix

Avoid pages that have both `@media` and `@container` rules competing on the same element. Pick one strategy per surface.

---

## 2. The drawer pattern for mobile nav (zero-JS)

The framework already ships a popover-based drawer. Use it. **Do not write a JS-toggled menu** for a mobile sidebar.

### Markup

```html
<!-- Trigger — anywhere in the header -->
<button class="drawer-toggle minimal" popovertarget="main-drawer" aria-label="Open menu">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2" stroke-linecap="round">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
</button>

<!-- Drawer — anywhere in the DOM; popover detaches it positionally -->
<aside id="main-drawer" popover="auto" class="drawer">
  <header>…drawer header with close button…</header>
  <nav>…nav items…</nav>
  <footer>…account row…</footer>
</aside>
```

The drawer slides in via the popover API. A close button works by adding `popovertarget="main-drawer" popovertargetaction="hide"`. The backdrop tap-to-close, focus management, and `Esc` to dismiss are all native.

### `.drawer-toggle` visibility

By convention `.drawer-toggle` is hidden at desktop (the sidebar is already visible inline) and shown at mobile. The framework's `.layout-sidebar` integration does this via `@media`. If you're using `.layout-rail` (container-query–driven), the equivalent rule lives in the patterns CSS — `.layout-rail .drawer-toggle { display: none }` outside the container query, then `display: inline-flex` inside. **Source order matters** because both rules have the same specificity.

### What to put inside the drawer at mobile

On mobile, the drawer is the home for **all** sidebar nav — the icon-rail (if any), the chat / topic list, and the account footer. No bottom tab bar. A horizontal tab bar might feel native but it forces a separate icon set, eats footer space, and clutters the thread. The drawer keeps the thread surface clean.

Recommended drawer layout at mobile:

1. Header: brand mark + close `X`
2. Section: "Agents" or top-level switcher (vertical list, not icons)
3. Action: "New conversation" + search
4. Body: history list (`.sidebar-nav`)
5. Footer: user account row

---

## 3. Full-height shells — `dvh` and safe-area

### The trap

`height: 100vh` is wrong for app shells. On iOS Safari, `100vh` doesn't shrink when the URL bar appears, so the bottom of your page (composer, tab bar) is clipped under the chrome.

### The fix

Use `100dvh` for any "fill the visible viewport" need:

```css
.layout-rail { block-size: 100dvh; }
```

Or pair with the framework's `.app-shell` / `.layout-sidebar.fill` primitives, which already use `dvh`.

### Safe-area insets

For elements pinned to the **bottom** of the screen (composer, tab bar, footer with primary action):

```css
.composer {
  padding-block-end: max(var(--pad-s), env(safe-area-inset-bottom));
}
```

Same idea for left/right insets on landscape:

```css
.icon-rail {
  padding-inline-start: max(var(--pad-m), env(safe-area-inset-left));
  padding-inline-end:   max(var(--pad-m), env(safe-area-inset-right));
}
```

These do nothing on desktop and gracefully handle notches / home indicators on phones.

---

## 4. Tap-target sizes

The framework's defaults are designed for 44px minimum tap targets at mobile. Be careful with these patterns that can drop below:

- `.chip` with custom `--pad-xs` overrides
- `.sidebar-nav.compact` items inside a drawer
- Custom icon buttons (`<button class="minimal" style="padding: 4px">`) — that's a 28px target with a 20px icon

Easy rule: at mobile widths, any interactive element should be ≥ 44px in its smaller dimension. When in doubt, padding it out is cheap.

---

## 5. Type at mobile

Graffiti's fluid typography is already mobile-aware — `--fl` scales down via `clamp()` automatically. Don't override `font-size` per breakpoint; trust the fluid system.

Three corollaries:

- Use the `.fc` (fluid-container) class on any narrow container where headings need to shrink relative to the container, not the viewport.
- Don't ship a "mobile body font of 14px" override. Body text never drops below 16px in well-designed mobile pages, and Graffiti's defaults respect that.
- The `.fs-*` size utilities only set `--fl`; that becomes a `font-size` only on text elements (`p`, `a`, `li`, `h1`–`h6`, `.tag`, form controls, `th`, `td`, `label`) or an element carrying `.fluid`. To size a bare `<span>` / `<div>`, add `.fluid` (`<span class="fluid fs-xs">`). See AP-016.

---

## 6. Image handling at mobile

The framework doesn't auto-art-direct images. If your page has a desktop wide-format hero and you want a portrait crop on phone:

```html
<picture>
  <source media="(min-width: 768px)" srcset="hero-wide.jpg" />
  <img src="hero-portrait.jpg" alt="…" />
</picture>
```

For data dashboards, prefer **collapsing density** over **shrinking type**. A 6-up KPI grid should drop to 2-up on phone, not 6 tiny cards.

---

## 7. Validation — quick mobile checks

Before shipping a Graffiti page that claims to work on phone:

- [ ] Open at 390 × 844. Does everything fit without horizontal scroll?
- [ ] Is the bottom action (composer / submit button / nav) tappable without zooming?
- [ ] Are 44px tap targets met for every interactive element?
- [ ] Does `100dvh` get used anywhere `100vh` would clip?
- [ ] If there's a drawer, does it close on backdrop tap and `Esc`?
- [ ] Do `@container` queries trigger correctly when content is embedded (try wrapping the design in a sized iframe and check)?
- [ ] No `@media` query is gating a component-level concern that should be `@container`.

---

## 8. Quick decisions

| Need                                            | Use                                                    |
| ----------------------------------------------- | ------------------------------------------------------ |
| Layout responds to viewport (page-level)        | `@media`                                               |
| Layout responds to its own width (component)    | `@container` + `container-type: inline-size`           |
| Mobile sidebar / menu                           | `[popover].drawer` + `.drawer-toggle`                  |
| Full-height app shell                           | `.app-shell` / `.layout-sidebar.fill` + `100dvh`       |
| Bottom-pinned bar respecting iOS home indicator | `env(safe-area-inset-bottom)` in `padding-block-end`   |
| Headings that shrink in narrow containers       | `.fc` + fluid `--fl`                                   |
| Different image per breakpoint                  | `<picture>` with `<source media="...">`                |
| Custom JS toggle for a menu                     | **No.** Use the drawer / `<details>` / `<dialog>` flows. |
