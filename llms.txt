# Graffiti CSS Framework

> A minimal CSS framework with fluid typography, responsive layouts, and utility classes

## Package Structure

The framework is split into two entry points for optimal bundle size:
- **Main CSS** (`@drop-in/graffiti`): Core framework with typography, layouts, and utilities
- **Decks CSS** (`@drop-in/graffiti/decks`): Optional styles for `@drop-in/decks` components (accordion, dialog, drawer, menu, toast)

Import only what you need:
```js
import '@drop-in/graffiti'        // Base framework
import '@drop-in/graffiti/decks'  // Optional decks components
```

## CSS Variables

### Typography & Fluid System
- `--fl`: Fluid level (-1 to 6) - Set on elements to control fluid typography scale
- `--font-sans`: System font stack
- `--font-size-min`: 14px (minimum font size)
- `--font-size-max`: 18px (maximum font size)
- `--font-ratio-min`: 1.2 (modular scale ratio for small screens)
- `--font-ratio-max`: 1.33 (modular scale ratio for large screens)
- `--variable-unit`: 100vi (viewport inline) or 100cqi (container query inline) when using `.fc`

### Spacing
- `--vs-s`: 0.5rem (vertical spacing small)
- `--vs-base`: 1rem (vertical spacing base)
- `--vs-m`: 1.5rem (vertical spacing medium)
- `--vs-l`: 2rem (vertical spacing large)
- `--vs-xl`: 4rem (vertical spacing extra large)

### Border Radius
- `--br-xs`: 2px
- `--br-s`: 4px
- `--br-m`: 8px
- `--br-l`: 16px

### Padding
- `--pad-xs`: 2px
- `--pad-s`: 6px
- `--pad-m`: 12px
- `--pad-l`: 25px

### Shadows
Layered, adaptive shadows (deeper in dark mode):
- `--shadow-1`: Subtle shadow
- `--shadow-2`: Light lift
- `--shadow-3`: Moderate depth
- `--shadow-4`: Strong elevation
- `--shadow-5`: Dramatic shadow
- `--shadow-6`: Maximum depth
- `--box`: Inset highlights with subtle shadow

### Line Heights
- `--lh-tight`: 1.2 (tight line height for headings/display text)
- `--lh-normal`: 1.5 (default for body text)
- `--lh-loose`: 1.8 (extra space for large body text)

### Easing Functions
Modern `linear()` based easing functions:
- `--ease-smooth`: Smooth acceleration/deceleration
- `--ease-bounce`: Bouncy spring-like motion
- `--ease-emphasized`: Emphasized material design easing

### Colors (OKLCH)
Perceptually uniform OKLCH color space with automatic 1-9 scales generated via relative color syntax.
Base colors are scale 5. Lower numbers are lighter, higher numbers are darker.

#### Yellow
- `--yellow` (scale 5): oklch(0.88 0.15 95) - Base yellow
- `--yellow-1` through `--yellow-9`: Full scale from lightest to darkest

#### Orange
- `--orange` (scale 5): oklch(0.75 0.18 65) - Base orange
- `--orange-1` through `--orange-9`: Full scale from lightest to darkest

#### Red
- `--red` (scale 5): oklch(0.62 0.22 35) - Base red
- `--red-1` through `--red-9`: Full scale from lightest to darkest

#### Pink
- `--pink` (scale 5): oklch(0.62 0.25 350) - Base pink
- `--pink-1` through `--pink-9`: Full scale from lightest to darkest

#### Green
- `--green` (scale 5): oklch(0.72 0.18 165) - Base green
- `--green-1` through `--green-9`: Full scale from lightest to darkest

#### Teal
- `--teal` (scale 5): oklch(0.82 0.08 185) - Base teal
- `--teal-1` through `--teal-9`: Full scale from lightest to darkest

#### Blue
- `--blue` (scale 5): oklch(0.5 0.28 270) - Base blue
- `--blue-1` through `--blue-9`: Full scale from lightest to darkest

#### Neutral Gray
- `--gray-1` through `--gray-9`: Neutral gray scale from lightest to darkest (no base color variable)

### Theming (light-dark mode)
- `--fg`: Foreground color (auto switches: black in light, white in dark)
- `--bg`: Background color (auto switches: white in light, black in dark)
- `--tint-or-shade`: 5% foreground mix (subtle backgrounds)
- `--tint-or-shade-harder`: 10% foreground mix (stronger backgrounds)

### Layout Customization
- `--gap`: Default gap for layout utilities (default: varies per layout)
- `--layout-gap`: Override gap for specific layout
- `--min-card-width`: Minimum card width for `.layout-card` (default: 290px)
- `--layout-min-card-width`: Override for specific card layout
- `--max-width`: Max width for `.layout-readable` (default: 1200px)
- `--layout-max-width`: Override for specific readable layout
- `--padding`: Inline padding for `.layout-readable` (default: 2rem)
- `--layout-padding`: Override for specific readable layout

## Typography Classes

### Font Size Utilities
- `.fs-xs`: Extra small (--fl: -1)
- `.fs-base`: Base size (--fl: 0)
- `.fs-s`: Small heading (--fl: 1)
- `.fs-m`: Medium heading (--fl: 2)
- `.fs-l`: Large heading (--fl: 3)
- `.fs-xl`: Extra large (--fl: 4)
- `.fs-xxl`: Double extra large (--fl: 5)
- `.fs-xxxl`: Triple extra large (--fl: 6)

### Heading Classes
- `.h1` through `.h6`: Apply heading styles to non-heading elements

### Fluid Typography
- `.fc` or `.fluid-text-container`: Makes typography responsive to container width instead of viewport (uses container queries)

## Layout Classes

### `.layout-card`
Auto-fill responsive card grid
```css
/* Usage */
<div class="layout-card">
  <div>Card 1</div>
  <div>Card 2</div>
</div>

/* Customize */
<div class="layout-card" style="--min-card-width: 250px; --gap: 1rem;">
```

### `.layout-sidebar`
Sidebar + main content (default: 250px sidebar)
```css
/* Variants */
.layout-sidebar          /* 250px sidebar */
.layout-sidebar.narrow   /* 150px sidebar */
.layout-sidebar.wide     /* 350px sidebar */
.layout-sidebar.invert   /* Sidebar on right */

/* Stacks to single column on mobile (<768px) */
```

### `.layout-split`
50/50 two-column layout
```css
/* Variants */
.layout-split           /* Stacks on mobile */
.layout-split.no-stack  /* Stays side-by-side on mobile */
```

### `.layout-three-col`
Three equal columns
```css
/* Responsive breakpoints */
/* 3 columns on desktop (≥1024px) */
/* 2 columns on tablet (≥768px) */
/* 1 column on mobile (<768px) */
```

### `.layout-readable`
Max-width container for optimal readability
```css
/* Variants */
.layout-readable        /* Start-aligned (default) */
.layout-readable.center /* Centered */
.layout-readable.end    /* End-aligned */

/* Child utility */
.full-bleed             /* Breaks out of container to full viewport width */
```

### `.layout-holy-grail`
Three-column layout: sidebar + content + sidebar
```css
/* Usage */
<div class="layout-holy-grail">
  <div style="width: 200px">Left sidebar</div>
  <div>Main content</div>
  <div style="width: 200px">Right sidebar</div>
</div>
```

### `.stack`
Vertical flexbox with gap
```css
/* Default gap: 1rem */
/* Customize with --gap variable */
```

### `.layout-cluster`
Horizontal wrapping flexbox layout, perfect for tags, pills, and breadcrumbs
```css
/* Usage */
<div class="layout-cluster">
  <span>Tag 1</span>
  <span>Tag 2</span>
  <span>Tag 3</span>
</div>

/* Customize gap */
<div class="layout-cluster" style="--gap: 0.5rem;">
```

### `.layout-carousel`
Horizontal scrolling with CSS scroll-snap (no JavaScript required)
```css
/* Usage */
<div class="layout-carousel">
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</div>

/* Features */
/* - scroll-snap-type: x mandatory */
/* - overflow-x: auto */
/* - Smooth scrolling with scroll-snap-align: start */
```

### `.layout-reel`
Vertical scrolling with CSS scroll-snap (no JavaScript required)
```css
/* Usage */
<div class="layout-reel" style="--reel-height: 400px">
  <div>Panel 1</div>
  <div>Panel 2</div>
  <div>Panel 3</div>
</div>

/* Features */
/* - scroll-snap-type: y mandatory */
/* - overflow-y: auto */
/* - Customizable height with --reel-height variable */
/* - Smooth scrolling with scroll-snap-align: start */
```

## Utility Classes

### Display & Layout
- `.flex`: Display flex with 20px gap
- `.grid`: Display grid with 1rem gap (customize with `--gap`)
- `.split`: Flex layout with space-between and top alignment
- `.readable`: Max-width 900px container

### List Utilities
- `.no-list`: Remove list styling (margin, padding, list-style)

### Spacing
- `.row`: Add vertical margin (--vs-m)

### Visibility
- `.visually-hidden`: Hide element visually but keep accessible to screen readers

### Shape
- `.circle`: Circular element (default --size: 40px)

### Box Styles
- `.box-1`: Subtle box with tint background and soft shadow
- `.box-2`: Semi-gloss box with gradient and stronger shadow

### Button
- `.button`: Button styling for links and non-button elements

### Aspect Ratio Utilities
Maintain specific aspect ratios for containers (useful for images, videos, cards):
- `.aspect-square`: 1:1 aspect ratio
- `.aspect-video`: 16:9 aspect ratio (standard video)
- `.aspect-4-3`: 4:3 aspect ratio (classic TV)
- `.aspect-21-9`: 21:9 aspect ratio (ultrawide)
- Custom: Use `aspect-ratio: var(--aspect-ratio)` or `aspect-ratio: 2 / 1`

### Form Validation States
Built-in styles for form inputs and messages:
- `.error`: Red border/color for error state (inputs and text)
- `.success`: Green border/color for success state (inputs and text)
- `.warning`: Orange border/color for warning state (inputs and text)

Usage:
```html
<input class="error" />
<small class="error">Error message</small>

<input class="success" />
<small class="success">Success message</small>

<input class="warning" />
<small class="warning">Warning message</small>
```

## How It Works

### Fluid Typography System
Graffiti uses a custom fluid typography system based on the `--fl` (fluid level) variable:

1. Set `--fl` on any element (-1 to 6)
2. Font size automatically scales between viewport min/max
3. Uses `clamp()`, `pow()`, and modular scale ratios
4. All text elements inherit fluid sizing

Example:
```css
.custom-text {
  --fl: 3; /* Will scale like an h3 */
}
```

### Container-Based Fluid Typography
Add `.fc` to a container to make child typography responsive to container width instead of viewport:
```html
<div class="fc">
  <h1>Scales with container, not viewport</h1>
</div>
```

### OKLCH Color System
Graffiti uses the OKLCH color space for perceptually uniform colors:

**Why OKLCH?**
- Perceptually uniform: Equal numeric changes = equal visual changes
- Wide color gamut support (P3 displays)
- Better interpolation than RGB/HSL
- Predictable lightness adjustments

**Automatic Color Scales**
Each color has a 1-9 scale generated using relative color syntax:
```css
/* Base color (scale 5) */
--yellow: oklch(0.88 0.15 95);

/* Lighter shades (1-4) */
--yellow-1: oklch(from var(--yellow) calc(l + 0.10) calc(c * 0.3) h);
--yellow-2: oklch(from var(--yellow) calc(l + 0.06) calc(c * 0.5) h);
/* ... */

/* Darker shades (6-9) */
--yellow-6: oklch(from var(--yellow) calc(l - 0.08) calc(c * 1.1) h);
--yellow-9: oklch(from var(--yellow) calc(l - 0.32) calc(c * 0.9) h);
```

Scale 5 is always the base color. Lower numbers are lighter, higher are darker.

### Theming
Uses `light-dark()` function for automatic color scheme switching:
- `color-scheme: light dark` enables auto detection
- All theme colors automatically adapt
- Shadows become deeper in dark mode

### CSS Scroll-Snap Layouts
Carousel and reel use native CSS scroll-snap for smooth scrolling:
- No JavaScript required
- Native browser performance
- Touch/trackpad/mouse wheel support
- Accessibility keyboard navigation

### Logical Properties
Framework uses logical properties throughout for RTL/LTR support:
- `inset-block-start` instead of `top`
- `margin-inline-start` instead of `margin-left`
- `padding-block` instead of `padding-top/bottom`
- Full bidirectional text support

### Layout Philosophy
- Mobile-first responsive design
- CSS Grid-based layouts
- CSS scroll-snap for carousels and reels
- Customize via CSS variables (--gap, --min-card-width, etc.)
- Minimal, composable classes
- No JavaScript dependencies

## Browser Support

Graffiti requires modern browsers for full functionality:

**Minimum versions:**
- Chrome 123+ (March 2024)
- Safari 17.5+ (May 2024)
- Firefox 128+ (July 2024)
- Edge 123+ (March 2024)

**Critical features:**
- OKLCH color space: Chrome 111+, Safari 15.4+, Firefox 113+
- Relative color syntax: Chrome 119+, Safari 16.4+, Firefox 128+
- `light-dark()` function: Chrome 123+, Safari 17.5+, Firefox 120+
- Container queries: Chrome 105+, Safari 16.0+, Firefox 110+
- `linear()` easing: Chrome 113+, Safari 17.2+, Firefox 112+
- Logical properties: Chrome 89+, Safari 15+, Firefox 66+
- CSS scroll-snap: Chrome 69+, Safari 11+, Firefox 68+

**Graceful degradation:**
Use `@supports` queries for progressive enhancement:
```css
@supports (color: oklch(0.5 0.2 180)) {
  /* OKLCH styles */
}
```
