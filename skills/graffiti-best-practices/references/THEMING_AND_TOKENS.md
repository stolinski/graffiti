# Theming and Tokens — Gotchas Other Agents Miss

The framework's tokens are robust but have two non-obvious behaviors that, if missed, produce surface bugs that look like generic rendering glitches. Both come up the moment you try to re-color or theme nested content.

Read this **after** `GRAFFITI_SYSTEM.md` if you're doing any of: applying themes per-section, overriding `--primary`/`--blue`/`--bg` in markup, embedding Graffiti UI inside another page, or building anything that ships inside an iframe.

---

## 1. Pin `color-scheme` explicitly

### The trap

The framework uses `light-dark(...)` throughout — for `--bg`, `--fg`, shadow palettes, hairlines, and (transitively) every opaque scale. `light-dark()` resolves to the **first** argument when `color-scheme: light` is in effect at the consuming element, and to the **second** when `color-scheme: dark`.

If `color-scheme` is unset or `light dark`, the **browser** decides — based on OS preference, parent iframe, user-agent default. So the same markup renders light on a Mac in light mode and dark inside a dark-mode iframe — without you doing anything wrong.

### The fix

For any surface where you control the look, set `color-scheme` explicitly at the page root (or section root):

```css
:root {
  color-scheme: light;            /* or "dark", or "light dark" if you actually want both */
}
```

In Svelte/React component scope, set it on the outermost element:

```html
<section style="color-scheme: light;">…</section>
```

### When the bug shows up

- Backgrounds of "user" message bubbles render near-black on a light page.
- Shadow palette looks heavy (dark-mode shadows on a light page).
- `.card` borders disappear (hairlines were tuned for the other branch).
- Embedded preview inside a documentation iframe doesn't match its parent.

Every one of these is the same root cause: `light-dark()` resolving to the wrong branch.

### Rule of thumb

If your page has a hard-coded `--bg` or `--fg`, you also want a hard-coded `color-scheme`. They come as a pair.

---

## 2. Opaque scales don't re-derive on inline overrides (ADR-0006)

### The trap

The framework defines per-hue opaque scales like this:

```css
:root {
  --blue: oklch(0.5 0.28 270);
  --blue-opaque-1: color-mix(in oklab, var(--blue), var(--bg) 90%);
  --blue-opaque-2: color-mix(in oklab, var(--blue), var(--bg) 80%);
  /* … */
}
```

Custom properties **substitute their `var()` references at the scope where the property was set**, not at every consumption point. So `--blue-opaque-1` is computed at `:root` against the root's `--blue` and `--bg`. Inheriting `--blue-opaque-1` to a deeper element passes the already-resolved color down.

If you then do this at a deeper scope:

```html
<section style="--blue: oklch(0.55 0.22 305);"> <!-- override to purple -->
  <div class="bubble" style="--bubble-bg: var(--blue-opaque-1);">…</div>
</section>
```

`--blue-opaque-1` is **still the original indigo** — not a purple-derived pale color — because the opaque scale was computed at `:root` before your override existed in the cascade.

### The fix — three options, in order of preference

**Option A — Use a theme class.** This is the canonical answer. The framework's `:where([class*="theme-"])` block re-declares **every** opaque scale at that scope:

```html
<section class="theme-studio">
  <div class="bubble">…</div>   <!-- bubble bg picks up the theme's --blue-opaque-1 -->
</section>
```

Any class starting with `theme-` (yours, or a stock preset) triggers the re-derivation. Write a theme file even for a single page — it's the smallest piece of CSS that handles the lazy-eval correctly.

**Option B — Override `--primary` only.** `--primary` is a single semantic alias, not a derived scale. Inline-overriding it is fine and well-supported by every component that reads `--primary`:

```html
<section style="--primary: oklch(0.55 0.22 305);">…</section>
```

What you give up: per-hue opaque scales (e.g. `--blue-opaque-1` for a user-bubble background). If you only need the brand accent on buttons, links, chips, focus rings — `--primary` is sufficient.

**Option C — Re-declare the opaque scale yourself.** Possible but verbose; only do this if A and B don't fit. Copy the relevant `--blue-opaque-1..9` declarations from `drop-in.css` into your section scope. Document why.

### Rule of thumb

If your override is **`--primary` only** → inline is fine.
If your override changes **a hue's surface variants** (e.g. you want pale-purple bubble backgrounds) → use a theme class.
Never inline-override `--blue` (or any hue token) and then expect `--blue-opaque-N` to follow.

---

## 3. The override chain — pick the right level

Pick the lowest level that solves the problem. Decide **before writing markup**, not after.

| Want to change                                                | Use                                                            | Why                                                                                  |
| ------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Just the brand accent color                                   | `style="--primary: ..."` inline                                | Semantic alias; single var; safest inline override                                   |
| The whole app/site identity                                   | `class="theme-X"` on `<html>` or `<body>`                      | One source of truth; every nested surface inherits                                   |
| One section/feature distinct from the rest                    | `class="theme-X"` on the section root                          | Triggers per-hue opaque-scale re-derivation locally; siblings stay default           |
| One component's variant (button color, callout tint, etc.)    | Component override token like `--button-color`, `--callout-tint` | Documented per-component; respects theme contract                                    |
| Spacing of one specific layout                                | `style="--gap: ..."` / `--layout-gap` / `--max-width`          | Documented layout knobs; bounded local override                                      |
| The semantic role of an element (success / warning / error)   | `.tag.success`, `.callout.warning`, `.button.primary`, etc.    | Semantic class variants ALWAYS beat color overrides                                  |

If you find yourself reaching for multiple inline tokens, that's a sign you want a theme class. Make a project-level theme even if it's only used once.

### Global vs local — when to scope which

- **Global** (`<html class="theme-X">` or `<body>`): the whole product has one identity. This is the most common case. Most apps and sites live here.
- **Local** (`<section class="theme-X">` or `<aside class="theme-X">`): one feature inside a larger product has a distinct mode. Examples: a docs surface inside a console app, a chat surface inside a dashboard, a marketing page embedded in a logged-in app. Local themes still re-derive opaque scales correctly — any class starting with `theme-` triggers the framework's full re-declaration at that scope.
- **Mixed (rare)**: a global theme on `<html>` plus a section theme override on a single feature. Use sparingly — it's correct CSS but harder to reason about.
- **Inline `--primary` swap**: only when nothing else needs to change. Good for: highlighting one accent button row, recoloring focus rings in a sub-section. Bad for: anything that needs a tinted background surface (those won't follow — see §2).

---

## 4. Writing a project-level theme (when stock presets don't fit)

Stock themes available (verify the file exists in `src/lib/themes/` before referencing):

- `theme-soft-consumer`
- `theme-editorial`
- `theme-paper`
- `theme-system`
- `theme-neon-arcade`
- `theme-studio`
- `theme-signal`
- `theme-lumen`
- `theme-schematic`

The stock themes follow a strict template (`bg-light` / `bg-dark` / `fg-light` / `fg-dark` / `primary` / `accent` + the radii / shadow scales + an `@layer themes` block for component-shape overrides). To write a new theme, copy `editorial.css` or `system.css` as a starting point — never start from blank.

Minimum viable custom theme:

```css
:root.theme-my-brand,
.theme-my-brand {
  --font-sans: "Inter", system-ui, sans-serif;
  --bg-light: #ffffff;
  --bg-dark: #0a0a0c;
  --fg-light: #111114;
  --fg-dark: #e8e8eb;
  --primary: oklch(0.55 0.22 145);  /* your brand */
  --accent: var(--primary);
}
```

That's enough to re-color the whole surface and re-derive every opaque scale. Add radii, shadows, motion, and component-shape overrides only if you actually want them different.

Register your theme in `src/lib/themes/index.css`:

```css
@import "./my-brand.css";
```

Apply via class on `<html>`, `<body>`, or any container.

---

## 5. Quick diagnostic — "the colors look wrong"

A short checklist to run when output doesn't match expectations:

1. **Is `color-scheme` set on `<html>`?** If not, set it (`light` or `dark`). Almost half of "wrong colors" cases come from this.
2. **Are you overriding a hue token (`--blue`, `--red`, …) inline?** That's the lazy-eval trap. Convert to a theme class or override only `--primary`.
3. **Is the element inside an `@layer` that's wrong?** Component-layer overrides only beat layout-layer overrides. If a project rule isn't winning, check layer order.
4. **Did you override `--bg` inline without `color-scheme`?** Common combo — sets the surface but the shadows / borders inherit the wrong branch.
5. **Is the page rendering in light-dark "system" mode?** Check OS preference; verify by toggling and reloading. If results change, you forgot to pin `color-scheme`.

When in doubt: add `class="theme-default"` (or the actual stock theme you want) to the root and remove all inline color tokens. Build back up from a working baseline.

---

## 6. What NOT to do

- ❌ Inline `--blue: ...` and expect `--blue-opaque-1` to follow.
- ❌ Inline-override `--bg` without also setting `color-scheme`.
- ❌ Set `color-scheme: dark` on a section while keeping light-mode `--bg` and `--fg` inherited from the parent.
- ❌ Build a "theme" as a one-off inline-style cluster on the page root. Move it to `themes/yourname.css` even if the project has one consumer.
- ❌ Use the `.theme-*` class on a deeply-nested element when the change applies to most of the page. Apply themes high.
- ❌ Use `!important` to force a token to apply. If a token isn't propagating, the cause is structural (one of the issues above), not specificity.

---

## 7. Reference

- `src/lib/drop-in.css` — the source of truth for all tokens
- `src/lib/themes/*.css` — every stock theme as a worked example
- ADR-0006 (in the repo's `docs/adr/` folder) — the canonical writeup of the per-theme opaque-scale re-derivation
