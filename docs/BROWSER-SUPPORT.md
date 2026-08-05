# Browser Support

Graffiti's support contract is feature-pinned, not version-pinned. See [ADR-0012](./adr/0012-feature-pinned-browser-support.md) for the rationale. This document lists the Web Platform features the framework depends on and the **current** implementing versions for the major browsers. The version numbers below are a *reference snapshot* — useful for planning, but the canonical contract is the feature list itself.

## Required platform features

Graffiti requires support for all of the following. A browser that supports all of these features will render Graffiti correctly; a browser missing any of them will see degraded output in the areas that depend on the missing feature.

| Feature | Used by |
|---|---|
| `oklch()` colour values | Entire colour system |
| `light-dark()` colour function | Light/dark theme resolution |
| Relative colour syntax (`oklch(from var(--x) ...)`) | Alpha scale derivation |
| `color-mix()` in `oklab` space | Opaque scale ([ADR-0007](./adr/0007-opaque-color-scale.md)), `.auto-color` |
| `@container` queries (`inline-size`) | Responsive layout primitives |
| `linear()` cubic easing | `--ease-smooth`, `--ease-bounce`, `--ease-emphasized` |
| `popover` HTML attribute and `:popover-open` | `.drawer`, dialogs, dropdown menus |
| Cascade layers (`@layer`) | The entire cascade architecture ([ADR-0002](./adr/0002-cascade-layer-order.md)) |
| CSS anchor positioning (`anchor()`, `anchor-scope`, `position-anchor`, `position-try`) | `tooltip`, `dropdown-menu`, `badge` |
| `forced-colors` and CSS system colours | High-contrast control states and structural boundaries |
| `accent-color` | Native checkbox and radio selected states |

## Reference snapshot — current implementing versions

| Feature | Chrome | Safari | Firefox |
|---|---|---|---|
| `oklch()` | 111+ | 15.4+ | 113+ |
| `@container` (inline-size) | 105+ | 16+ | 110+ |
| `linear()` easing | 113+ | 17.2+ | 112+ |
| `popover` | 114+ | 17+ | 125+ |
| Relative colour syntax | 119+ | 16.4+ | 128+ |
| `light-dark()` | 123+ | 17.5+ | 120+ |
| Cascade layers | 99+ | 15.4+ | 97+ |
| `color-mix()` (oklab) | 111+ | 16.2+ | 113+ |
| `forced-colors` | 89+ | 16+ | 89+ |
| `accent-color` | 93+ | 15.4+ | 92+ |
| **CSS anchor positioning** | **125+** | **17.4+ (partial)** | **not in stable** |

The effective floor at the time of this snapshot is **Chrome 125+, Safari 17.5+, Firefox (no stable version yet)** — driven by anchor positioning and `light-dark()`. Once Firefox ships anchor positioning, the floor will reduce to the highest among the other features.

## Forced-colors contract

Graffiti keeps native HTML state as the source of truth and adds structural fallbacks only where authored paint would disappear. Under `@media (forced-colors: active)`:

- Custom selects return to native `appearance` and remove the URL-based arrow, so the platform supplies a contrast-safe affordance.
- Native checkboxes and radios use the user's `Highlight` accent. `.toggle` keeps its native checkbox semantics while its track, translated knob, checked, and disabled states use system colours.
- Pressed chips, open tab summaries, workbench tabs, and current navigation items gain a `Highlight` fill, border, outline, or underline that does not depend on gradients or shadows.
- Tags, list navigation rows, dialogs, drawers, bottom navigation, icon rails, and pagination retain visible system-colour boundaries when shadows and decorative backgrounds are removed.
- Dropzones retain their dashed boundary; keyboard focus and `.dragover` remain separately visible through outlines and `Highlight`.
- Existing `:focus-visible` rings remain active in normal and forced-colour modes.

The framework deliberately does not use `forced-color-adjust: none` for these controls: user-selected colours remain authoritative. Chromium fixtures use Playwright's `forcedColors: "active"` emulation for computed-style and screenshot evidence. Safari and Firefox should additionally be checked on platforms that expose their real forced-colour settings because emulation is not equivalent to an operating-system palette.

## Known degraded behaviour

The following components depend on features that may not yet be universally available. They will render but not function correctly without their dependency:

- **`tooltip`** — without anchor positioning, the tooltip element appears in the document flow rather than anchored to its trigger.
- **`dropdown-menu`** — without anchor positioning the menu appears at its unanchored fallback position. Without `anchor-scope`, repeated dropdowns may bind to another instance's trigger.
- **`badge`** — without anchor positioning, badge positioning relative to its host is incorrect.

Consumers needing to support browsers without anchor positioning should either avoid these three components or layer their own JS-based positioning fallback (e.g., the [floating-ui anchor-positioning polyfill](https://floating-ui.com/)).

Graffiti does not ship polyfills. The framework is CSS-only and forward-moves with the Web Platform.

## Updating this document

When an ADR introduces a new feature dependency:

1. Add the feature to the "Required platform features" table.
2. Add a row to the "Reference snapshot" table with the current versions.
3. If the new dependency raises the effective floor, the ADR also notes this as a breaking change under [ADR-0011](./adr/0011-public-surface-and-deprecation-policy.md).
