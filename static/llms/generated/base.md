---
title: "Graffiti Base"
url: https://graffiti-ui.com/base
description: "Foundation tokens and classless defaults: typography, variables, colors, and native form styling."
---

# Graffiti Base

Foundation tokens and classless defaults: typography, variables, colors, and native form styling.

## Quick Reference

- [**Typography**](#topic-typography) (h1, h2, h3) - Default text hierarchy, heading utilities, and responsive type sizing. ([topic](https://graffiti-ui.com/base/typography))
- [**CSS Variables**](#topic-variables) (--vs-*, --pad-*, --br-*) - Theme-safe design tokens for consistent spacing, shape, elevation, and motion. ([topic](https://graffiti-ui.com/base/variables))
- [**Colors**](#topic-colors) (--primary, --accent, --error) - Defining theme color systems and contrast-safe UI surfaces. ([topic](https://graffiti-ui.com/base/colors))
- [**Dividers**](#topic-dividers) (hr) - Separating sections within content flows and card stacks. ([topic](https://graffiti-ui.com/base/dividers))
- [**Forms**](#topic-form-defaults) (input, textarea, select) - Building forms with minimal custom classes ([topic](https://graffiti-ui.com/base/form-defaults))

---

<a id="topic-typography"></a>

## Typography

Fluid typography defaults that scale predictably across viewport and container sizes.

**When to use:** Default text hierarchy, heading utilities, and responsive type sizing.

**Classes:** `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `.h1`, `.h2`, `.h3`, `.h4`, `.h5`, `.h6`, `.fs-xs`, `.fs-base`, `.fs-s`, `.fs-m`, `.fs-l`, `.fs-xl`, `.fs-xxl`, `.fs-xxxl`, `.fluid`, `.fluid-text-container`, `.fc`, `--fl`, `--ls-h1`, `--ls-h2`, `--ls-h3`

**Direct topic doc:** [https://graffiti-ui.com/base/typography](https://graffiti-ui.com/base/typography)

Graffiti type uses a fluid scale controlled by `--fl` and semantic heading classes.

- Use native `h1`-`h6` for document structure.
- Use `.h1`-`.h6` when non-heading elements need heading styling.
- Use `.fs-*` classes for size-only adjustments without changing semantic elements.
- Set `--fl` directly on any text element (`h1`-`h6`, `p`, `li`, `button`, `a`, `label`, `td`, `th`, `input`, `select`, `textarea`, `.fluid`, `.tag`) to step it on the fluid scale (`-1` through `6`).
- Add `.fluid` (or its alias `.fluid-text-container` / `.fc`) when typography should respond to container width via `cqi` instead of viewport units.

Line-height tokens: `--lh-xs`, `--lh-s`, `--lh` (the base, equal to `1.5`), `--lh-l`, and `--lh-xl`. Note that the middle/base token is bare `--lh` — there is no `--lh-m`.

## Heading Letter Spacing

`h1`/`h2`/`h3` apply a subtle negative letter-spacing for tight display type. The values are exposed as tokens so serif or display-font themes can override them without fighting selector specificity:

```css
:root {
  --ls-h1: -0.02em;
  --ls-h2: -0.015em;
  --ls-h3: -0.01em;
}
```

Set these to `0` (or positive em values) for serif and slab faces that don't need tightening.

---

<a id="topic-variables"></a>

## CSS Variables

Core spacing, radius, border, padding, line-height, shadow, motion, z-index, focus, and weight tokens.

**When to use:** Theme-safe design tokens for consistent spacing, shape, elevation, and motion.

**Classes:** `--vs-*`, `--pad-*`, `--br-*`, `--border-*`, `--shadow-*`, `--d-*`, `--ease-*`, `--z-*`, `--fw-*`, `--focus-ring`, `--safe-*`

**Direct topic doc:** [https://graffiti-ui.com/base/variables](https://graffiti-ui.com/base/variables)

These tokens define the core spacing, surface, motion, and stacking system used by components and utilities.

Graffiti has four explicit token tiers:

| Tier | Override? | Scope |
|---|---|---|
| Primitive/reference | Yes | Raw values and scales such as `--blue`, `--pad-*`, and `--ease-*` |
| Global semantic | Yes | Shared roles such as `--primary`, `--border-*`, `--shadow-*`, and `--d-*` |
| Component contract | Yes, on the owning pattern | Stable or fallback-backed hooks such as `--button-color`, `--gap`, and `--drawer-bg` |
| Private calculated | No | Framework intermediates; new private names use `--_component-*` |

Use `graffiti-lookup --token-name` for one token's tier, inheritance, default stability, and theme-scope behavior. `graffiti-lookup list --tokens` lists public tokens only; private tokens are implementation details and are excluded from normal search and generation guidance.

- **Spacing**: `--vs-*` for vertical rhythm and `--pad-*` for interior padding (both scale `xs` through `xxxl`).
- **Shape**: `--br-*` for corner radii (`xs` through `xxl`) and `--border-*` for border styles (`--border-05`, `--border-1`…`--border-5`).
- **Type rhythm**: `--lh-*` for line-height adjustments — see Typography for the full set.
- **Elevation**: `--shadow-*` (`--shadow-1` through `--shadow-6`) for the depth ramp. `--box` is a separate inset highlight token (outer drop + two inset white highlights) used by `.box.glow`; it is not part of the elevation ramp.
- **Motion durations**: `--d-instant`, `--d-fast`, `--d-base`, `--d-slow`, `--d-emphatic` — the semantic motion scale (see ADR-0008).
- **Motion easings**: `--ease-smooth`, `--ease-bounce`, `--ease-emphasized`, plus the physics-derived `linear()` catalog — springs `--ease-spring-smooth` (ζ = 1, drawers/panels), `--ease-spring-snappy` (toggles/tabs), `--ease-spring-pop` (popovers/dropdowns), `--ease-spring-bouncy` (badges/reactions), `--ease-spring-elastic` (drag-release snap-back); bounces `--ease-bounce-soft`, `--ease-bounce-firm` (landing metaphors); entrances `--ease-enter-glide` (sheets/route pushes), `--ease-enter-soft` (lists/cards); exits `--ease-exit-swift` (dismissals), `--ease-exit-anticipate` (send/launch); and `--ease-pop` for sub-300ms emphasis. Oscillation is baked into each curve, so tune feel by switching curves and scale only the duration — springs and bounces want 450–1000ms, well past `--d-emphatic`.
- **Stacking tiers**: `--z-base`, `--z-raised`, `--z-overlay`, `--z-sticky`, `--z-modal`, `--z-toast` — use these instead of raw integers.
- **Focus ring**: `--focus-ring`, `--focus-ring-offset`, `--focus-ring-offset-inset` for consistent keyboard focus styling.
- **Font weights**: `--fw-medium`, `--fw-semibold`, `--fw-bold` for portable weight references.
- **Safe areas**: `--safe-top`, `--safe-right`, `--safe-bottom`, `--safe-left` expose the user agent's viewport insets and can be overridden on embedded shells.

Use public tokens first, then compose utilities/components on top to keep custom themes consistent. A custom property appearing in the stylesheet is not automatically an override contract; Registry v2's `public` field is authoritative.

---

<a id="topic-colors"></a>

## Colors

OKLCH palette scales, semantic color tokens, and adaptive foreground/background variables.

**When to use:** Defining theme color systems and contrast-safe UI surfaces.

**Classes:** `--primary`, `--accent`, `--error`, `--warning`, `--success`, `--fg`, `--bg`

**Direct topic doc:** [https://graffiti-ui.com/base/colors](https://graffiti-ui.com/base/colors)

Graffiti ships an OKLCH palette with generated `-1` through `-9` scales. Palette anchors and their reference scales are primitive/reference tokens; purpose-bound aliases and scales are global semantic tokens.

- Semantic colors (`--primary`, `--error`, `--warning`, `--success`) support scale variants.
- `--accent` defaults to `var(--primary)` and is the interactive-accent knob — checkbox/radio `accent-color` and the dropzone hover/dragover state read from it. Override `--accent` independently when the accent UI shouldn't follow the brand primary.
- Adaptive tokens (`--fg`, `--bg`) flip automatically for light and dark themes.
- Prefer global semantic tokens in app UI; reserve primitive/reference palette tokens for illustration-heavy surfaces and theme construction.

---

<a id="topic-dividers"></a>

## Dividers

Styled horizontal rules for subtle visual separation.

**When to use:** Separating sections within content flows and card stacks.

**Classes:** `hr`

**Direct topic doc:** [https://graffiti-ui.com/base/dividers](https://graffiti-ui.com/base/dividers)

Native `<hr>` elements are themed by default.

- Use them between related content groups, not as decorative borders.
- Keep surrounding spacing consistent with stack/layout gap tokens.

---

<a id="topic-form-defaults"></a>

## Forms

Classless native input styling and validation states.

**When to use:** Building forms with minimal custom classes

**Classes:** `input`, `textarea`, `select`, `.error`, `.success`, `.warning`, `.row`, `.form-actions`, `.form-option-row`, `.search`, `.dropzone`

**Direct topic doc:** [https://graffiti-ui.com/base/form-defaults](https://graffiti-ui.com/base/form-defaults)

<span id="forms"></span>

Native controls are styled out of the box, with support for consistent validation classes.

- Prefer semantic form markup (`label`, `fieldset`, help text) before custom wrappers.
- Use `.error`, `.success`, and `.warning` on inputs for validation border colors. `:user-invalid` and `[aria-invalid="true"]` produce the same error styling automatically.
- Use `.stack` for the form's outer vertical rhythm.
- Inside a `<form>` or `<fieldset>`, `.row` is the field-row primitive that groups label + control + caption with tight spacing.
- Reach for `.form-option-row` for inline checkbox/radio rows, `.form-actions` for end-aligned submit/cancel bars, `.search` for inputs that need a magnifier icon, and `.dropzone` for drag-and-drop file uploads. Each has its own topic with full details.
