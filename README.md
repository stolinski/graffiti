# Graffiti

The standards-first, full-featured CSS library for the modern web.


## Install

### Package

```bash
pnpm add @drop-in/graffiti
```

Then import in your project:

```js
// Import everything (readable, layered source)
import "@drop-in/graffiti";

// Or import only what you need
import "@drop-in/graffiti/minimal"; // core + utilities
import "@drop-in/graffiti/standard"; // core + utilities + layouts

// Or pick individual modules
import "@drop-in/graffiti/core"; // variables, reset, typography
import "@drop-in/graffiti/utilities"; // helper classes
import "@drop-in/graffiti/layouts"; // page layouts
import "@drop-in/graffiti/components"; // UI components

// Optionally import aesthetic presets (apply as a class on any container)
import "@drop-in/graffiti/themes"; // all eight presets
// or tree-shake to a single preset
import "@drop-in/graffiti/themes/soft-consumer"; // also: editorial, paper, system, neon-arcade, studio, signal, lumen
```

For a pre-minified full distributable, use the layered production entry:

```js
import "@drop-in/graffiti/min";
```

`@drop-in/graffiti/min` is generated deterministically from the same canonical
CSS as the readable package root. It preserves the cascade layers and removes
comments and formatting only. `@drop-in/graffiti/drop-in.min.css` is the
equivalent minification of the flat `dist/drop-in.css` used by the CLI; use it
only when the consumer intentionally does not want Graffiti's layer wrappers.
Existing root, `drop-in.css`, and module imports remain readable and unchanged.

`components`, `utilities`, and `layouts` are standalone: each build
contains the transitive canonical token declarations its CSS requires. The
layer entries also preserve Graffiti's cascade order and global safety rules.
Theme entries are additive, not standalone; load the default bundle, or `core`
plus the relevant modular entries, alongside a theme import.

### Bundle Budgets

Every public CSS entry is measured from an installed packed tarball. Local
`@import` dependencies are included, so the all-themes entry reports its full
eight-file payload. The checked metrics are raw bytes, level-9 gzip bytes, CSS
rule and declaration counts, unique class names, and unique declared custom
properties (including `@property` registrations).

```bash
pnpm size:report # fresh package, report only
pnpm size:check  # fresh package, enforce reviewed maxima
pnpm size:update # deliberately replace maxima after reviewing growth
```

Checks never rewrite `css-size-budgets.json`. Any new CSS export, dependency
closure change, or metric above its reviewed maximum fails with the entry,
metric, exact delta, and update command.

### Token Registry

`@drop-in/graffiti/registry` exposes Registry v2. Its flat `tokenInventory`
classifies every token Graffiti declares, registers, or consumes as
primitive/reference, global semantic, public component-contract, or private
calculated. Each entry also records inheritance, default stability, theme-scope
behavior, and source evidence.

```bash
pnpm lookup --button-color
pnpm lookup list --tokens
pnpm lookup search spacing
```

List and search return public tokens by default. Private calculated tokens are
framework implementation details, not theme or component override hooks.

Apply a preset via class on `:root`, `html`, or any container element:

```html
<html class="theme-editorial">...</html>

<section class="theme-system">...</section>
```

### Legacy Compatibility Imports

Versions through `4.1.0` published `@drop-in/graffiti/raw` and
`@drop-in/graffiti/drop-in.css`. These paths remain compatibility aliases and
are generated from the same current CSS as the primary exports. New code should
import `@drop-in/graffiti` unless it specifically needs a CSS string.

### Copy & Paste

Download the CSS file directly:

```
https://raw.githubusercontent.com/stolinski/graffiti/refs/heads/main/src/lib/drop-in.css
```

### CLI Tool

```bash
pnpm dlx @drop-in/graffiti
```

This copies `drop-in.css` to your `src/` folder.

## Features

- **Fluid Typography**: Automatically scales between min/max viewport sizes using `clamp()` and `pow()`
- **Container Queries**: Typography can respond to container width with `.fc` class
- **OKLCH Color System**: Perceptually uniform colors with automatic 1-9 scales using relative color syntax
- **Auto Dark Mode**: Uses `light-dark()` with `color-scheme` for automatic theming
- **CSS Scroll-Snap Layouts**: Carousel and reel patterns with no JavaScript required
- **Form Validation States**: Built-in error, success, and warning styles
- **Modern Layout Patterns**: Cluster, carousel, reel, holy grail, and more
- **Design Tokens**: Comprehensive spacing, shadows, colors, line heights, and easing functions
- **Logical Properties**: Full RTL/LTR support throughout
- **Minimal & Composable**: Small footprint, mix and match classes

## Browser Support

Graffiti uses modern CSS features and requires recent browser versions:

**Minimum versions:**

- Chrome 123+ (March 2024)
- Safari 17.5+ (May 2024)
- Firefox 128+ (July 2024)
- Edge 123+ (March 2024)

**Key features requiring modern browsers:**

- OKLCH color space with relative color syntax
- `light-dark()` function for automatic theming
- Container queries for responsive typography
- `linear()` easing functions
- Logical properties for RTL/LTR support

## Documentation

Full documentation: https://graffiti-ui.com/

## License

MIT
