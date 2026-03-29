# Graffiti

The standards-first, full-featured CSS library for the modern web.


## Install

### NPM Package

```bash
npm install @drop-in/graffiti
```

Then import in your project:

```js
// Import everything (default, ~75KB)
import "@drop-in/graffiti";

// Or import only what you need for smaller bundles
import "@drop-in/graffiti/minimal"; // core + utilities (~26KB)
import "@drop-in/graffiti/standard"; // core + utilities + layouts (~33KB)

// Or pick individual modules
import "@drop-in/graffiti/core"; // variables, reset, typography
import "@drop-in/graffiti/utilities"; // helper classes
import "@drop-in/graffiti/layouts"; // page layouts
import "@drop-in/graffiti/components"; // UI components

// Optionally import decks component styles separately
import "@drop-in/graffiti/decks";
```

### Copy & Paste

Download the CSS file directly:

```
https://raw.githubusercontent.com/stolinski/graffiti/refs/heads/main/src/lib/drop-in.css
```

### CLI Tool

```bash
npx @drop-in/graffiti
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
- **Modular Architecture**: Optional separate import for `@drop-in/decks` component styles

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

ISC
