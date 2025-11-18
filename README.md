# Graffiti

A minimal CSS framework with utilities that are actually useful.

## Install

### NPM Package

```bash
npm install @drop-in/graffiti
```

Then import in your project:

```js
// Import base framework (without @drop-in/decks component styles)
import '@drop-in/graffiti'

// Optionally import decks component styles separately
import '@drop-in/graffiti/decks'
```

### Copy & Paste

Download the CSS file directly:
```
https://raw.githubusercontent.com/stolinski/graffiti/refs/heads/main/drop-in.css
```

### CLI Tool

```bash
npx @drop-in/graffiti
```

This copies `drop-in.css` to your `src/` folder.

## Usage

### Typography

Fluid typography that scales automatically between viewport sizes:

```html
<h1 class="fs-xxxl">Extra Large</h1>
<h1>H1 - Large Heading</h1>
<h2>H2 - Med Heading</h2>
<h3>H3 - Small Heading</h3>
<p class="fs-xs">Extra small text</p>
```

**Custom fluid sizing:**
```html
<div style="--fl: 3">Scales like an h3</div>
```

**Container-based fluid text:**
```html
<div class="fc">
  <h1>Scales with container, not viewport</h1>
</div>
```

### Layouts

**Auto-fill card grid:**
```html
<div class="layout-card">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>
```

**Sidebar layout:**
```html
<div class="layout-sidebar">
  <aside>Sidebar (250px)</aside>
  <main>Main Content</main>
</div>

<!-- Variants: .narrow (150px), .wide (350px), .invert (sidebar on right) -->
```

**50/50 split:**
```html
<div class="layout-split">
  <div>Left Column</div>
  <div>Right Column</div>
</div>

<!-- Add .no-stack to stay side-by-side on mobile -->
```

**Three columns:**
```html
<div class="layout-three-col">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

**Readable content container:**
```html
<div class="layout-readable center">
  <p>Optimal line length for readability</p>
  <div class="full-bleed">Breaks out to full width!</div>
</div>

<!-- Variants: .center, .end -->
```

**Holy Grail layout:**
```html
<div class="layout-holy-grail">
  <div style="width: 200px">Left sidebar</div>
  <div>Main content</div>
  <div style="width: 200px">Right sidebar</div>
</div>
```

**Stack (vertical spacing):**
```html
<div class="stack">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

**Cluster (horizontal wrapping):**
```html
<div class="cluster">
  <span>Tag 1</span>
  <span>Tag 2</span>
  <span>Tag 3</span>
</div>
<!-- Perfect for tags, pills, breadcrumbs -->
```

**Carousel (horizontal scroll-snap):**
```html
<div class="carousel">
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</div>
<!-- CSS scroll-snap, no JavaScript required -->
```

**Reel (vertical scroll-snap):**
```html
<div class="reel" style="--reel-height: 400px">
  <div>Panel 1</div>
  <div>Panel 2</div>
  <div>Panel 3</div>
</div>
<!-- Vertical scrolling with CSS scroll-snap -->
```

### Utilities

**Display utilities:**
```html
<div class="flex">Flexbox with gap</div>
<div class="grid">Grid with gap</div>
<div class="split">Space-between flex</div>
```

**Box styles:**
```html
<div class="box-1">Subtle box</div>
<div class="box-2">Semi-gloss box</div>
```

**Callout boxes:**
```html
<!-- Default info callout (blue) -->
<div class="callout">
  <h3>Information</h3>
  <p>This is an informational message.</p>
</div>

<!-- Warning callout (yellow) -->
<div class="callout warning">
  <h3>Warning</h3>
  <p>Please be careful!</p>
</div>

<!-- Error callout (red) -->
<div class="callout error">
  <h3>Error</h3>
  <p>Something went wrong!</p>
</div>

<!-- Success callout (green) -->
<div class="callout success">
  <h3>Success</h3>
  <p>Operation completed successfully!</p>
</div>

<!-- Ghost callout (gray) -->
<div class="callout ghost">
  <h3>Note</h3>
  <p>A neutral message.</p>
</div>

<!-- Hard variant with thick left border -->
<div class="callout warning hard">
  <h3>Important</h3>
  <p>This has a thick left border accent.</p>
</div>
```

**Table wrapper:**
```html
<div class="table">
  <table>
    <thead>
      <tr>
        <th>Header 1</th>
        <th>Header 2</th>
        <th>Header 3</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data 1</td>
        <td>Data 2</td>
        <td>Data 3</td>
      </tr>
      <tr>
        <td>Data 4</td>
        <td>Data 5</td>
        <td>Data 6</td>
      </tr>
    </tbody>
  </table>
</div>
<!-- Responsive with horizontal scroll on small screens -->
```

**Aspect ratio utilities:**
```html
<div class="aspect-square">1:1</div>
<div class="aspect-video">16:9</div>
<div class="aspect-4-3">4:3</div>
<div class="aspect-21-9">21:9</div>
<!-- Or use custom: aspect-ratio: var(--aspect-ratio) -->
```

**Form validation states:**
```html
<input class="error" />
<small class="error">Error message</small>

<input class="success" />
<small class="success">Success message</small>

<input class="warning" />
<small class="warning">Warning message</small>
```

**Other utilities:**
```html
<ul class="no-list">Clean list</ul>
<div class="visually-hidden">Screen reader only</div>
<button class="circle">Icon</button>
```

### CSS Variables

**Customize layouts:**
```html
<div class="layout-card" style="--min-card-width: 250px; --gap: 1rem;">
  <!-- Cards with custom min-width and gap -->
</div>
```

**Use design tokens:**
```css
.custom-box {
  padding: var(--pad-m);
  border-radius: var(--br-s);
  box-shadow: var(--shadow-3);
  background: var(--fg-05);
}
```

**Available variables:**
- Spacing: `--vs-s`, `--vs-base`, `--vs-m`, `--vs-l`, `--vs-xl`
- Border radius: `--br-xs`, `--br-s`, `--br-m`, `--br-l`
- Borders: `--border-05`, `--border-1`, `--border-2`
- Padding: `--pad-xs`, `--pad-s`, `--pad-m`, `--pad-l`
- Line heights: `--lh-tight`, `--lh-normal`, `--lh-loose`
- Shadows: `--shadow-1` through `--shadow-6`
- Easing: `--ease-smooth`, `--ease-bounce`, `--ease-emphasized`
- **OKLCH Colors** (1-9 scales, base color = scale 5):
  - Yellow: `--yellow`, `--yellow-1` through `--yellow-9`
  - Amber: `--amber`, `--amber-1` through `--amber-9`
  - Orange: `--orange`, `--orange-1` through `--orange-9`
  - Red: `--red`, `--red-1` through `--red-9`
  - Pink: `--pink`, `--pink-1` through `--pink-9`
  - Purple: `--purple`, `--purple-1` through `--purple-9`
  - Indigo: `--indigo`, `--indigo-1` through `--indigo-9`
  - Blue: `--blue`, `--blue-1` through `--blue-9`
  - Teal: `--teal`, `--teal-1` through `--teal-9`
  - Green: `--green`, `--green-1` through `--green-9`
  - Lime: `--lime`, `--lime-1` through `--lime-9`
  - Highlighter: `--highlighter`, `--highlighter-1` through `--highlighter-9`
  - Brown: `--brown`, `--brown-1` through `--brown-9`
  - Gray: `--gray-1` through `--gray-9`
  - Slate: `--slate`, `--slate-1` through `--slate-9`
- Theme: `--fg`, `--bg`, `--fg-05`, `--fg-1`

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

**Graceful degradation:**
While these features enhance the experience, basic layout and typography will work in older browsers. Consider using `@supports` queries if you need to support older browsers:

```css
@supports (color: oklch(0.5 0.2 180)) {
  /* OKLCH color styles */
}
```

## Documentation

Full documentation: https://drop-in-graffiti.netlify.app/

## License

ISC
