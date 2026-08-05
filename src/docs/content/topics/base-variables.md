---
id: variables
title: CSS Variables
route: base
order: 110
summary: Core spacing, radius, border, padding, line-height, shadow, motion, z-index, focus, and weight tokens.
when_to_use: Theme-safe design tokens for consistent spacing, shape, elevation, and motion.
classes:
  - --vs-*
  - --pad-*
  - --br-*
  - --border-*
  - --shadow-*
  - --d-*
  - --ease-*
  - --z-*
  - --fw-*
  - --focus-ring
  - --safe-*
demos:
  - SpacingScale
  - BorderRadiusScale
  - BorderScale
  - PaddingScale
  - LineHeightScale
  - ShadowScale
tags:
  - base
  - tokens
---

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
