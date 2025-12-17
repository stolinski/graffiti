# @drop-in/graffiti

## 4.5.0

### Minor Changes

- 7cbea8f: Added dropdown menu component using native HTML popover API and CSS anchor positioning. Features include:
  - No JavaScript required for open/close behavior
  - CSS anchor positioning for automatic placement
  - Smooth open/close animations with @starting-style
  - Links and buttons inside menu are automatically styled (no extra classes needed)
  - End-aligned variant with `.dropdown.end`

## 4.4.2

### Patch Changes

- Added --separator CSS variable to breadcrumbs component for customizable separators (default: "/")

## 4.4.1

### Patch Changes

- 790d028: Added breadcrumbs component - simple breadcrumb navigation with slash separators. Uses semantic HTML with `.breadcrumbs` class on nav element, supports light/dark themes, and includes proper ARIA attributes for accessibility. Current page indicator uses `[aria-current="page"]` selector.
- d6dded6: Added toggle switch component - accessible toggle/switch input using native checkbox semantics with `.toggle` class. Supports checked, disabled, hover, and focus states. Includes `.compact` variant for smaller toggles.

## 4.4.0

### Minor Changes

- 3449db5: Added details/summary accordion component with smooth open/close animations using @starting-style and allow-discrete. Includes variants: `.bordered` (container with border), `.right` (right-aligned trigger), and `.minimal` (+/− toggle). Also added `button.minimal` for text-only buttons.

## 4.3.0

### Minor Changes

- Added new color scales and default input styles:
  - Added `--white` and `--black` static color scales (do not change with light/dark mode)
  - Added `--bg` scale (`--bg-05`, `--bg-1` through `--bg-9`) for contrasting tints that adapt to light/dark mode
  - Added default input styles for `input`, `select`, and `textarea` elements

## 4.2.0

### Minor Changes

- Adds .swipe class giving swipe components with ZERO js

## 4.1.0

### Minor Changes

- Adds JS-less swiper

## 4.0.0

### Major Changes

- - Removes tint-or-shade in favor of --fg-# vars
  - Adds initial border vars
  - Connects more vars throughout codebase

## 3.1.0

### Minor Changes

- Add new `.callout` component with multiple variants for displaying informational messages, warnings, errors, and success states.

  **New Classes:**
  - `.callout`: Base callout component with blue styling
  - `.callout.warning`: Yellow warning callout
  - `.callout.error`: Red error callout
  - `.callout.success`: Green success callout
  - `.callout.ghost`: Neutral gray callout
  - `.callout.hard`: Adds a thick left border accent

  **Features:**
  - Customizable colors via `--callout-color` and `--callout-border-color` CSS variables
  - Vertical flex layout with configurable gap
  - Resets margins on child elements for consistent spacing
  - Uses framework design tokens for padding, border radius, and colors

## 3.0.1

### Patch Changes

- Fixes Holy grail mobile

## 3.0.0

### Major Changes

- - Adds many new colors (highlighter, indego, slate, brown, amber, lime)
  - Renames layout-carousel to carousel layout-reel to reel
  - Adds header component

## 2.0.0

### Major Changes

- Adds new box styles, renames all box classes.

  New classes include:
  - .box
  - .box-glow
  - .box-semi-gloss
  - .box-semi-ghost

### Minor Changes

- Adds Header Layout component

## 1.0.0

### Major Changes

- Update color system to use alpha transparency instead of lightness variations

  All color scales (yellow, orange, red, pink, green, teal, blue, gray) now use alpha transparency from 10% to 100% opacity instead of varying lightness and chroma. This creates more consistent and predictable color scales.

  **Breaking changes:**
  - Scale 5 is now 50% opacity instead of the full base color
  - Scale 9 is now the full opacity base color
  - All intermediate scales use alpha transparency
  - Added new `--gray` base variable

  **Benefits:**
  - More predictable color behavior
  - Better layering and composition
  - Cleaner relative color syntax
  - Maintains hue and chroma consistency

### Minor Changes

- 140b9c8: Separate @drop-in/decks component styles into optional import

  Component styles for @drop-in/decks (accordion, dialog, drawer, menu, toast) are now available as a separate import to reduce main bundle size. Users who don't use @drop-in/decks components can now import just the base framework.

  **New exports:**
  - `@drop-in/graffiti/decks` - Component styles CSS file
  - `@drop-in/graffiti/decks/raw` - Component styles as JS module

  **Migration:**
  If you use @drop-in/decks components, add this import:

  ```js
  import "@drop-in/graffiti/decks";
  ```

  **Bundle size improvement:**
  Main CSS bundle is now ~15% smaller for projects that don't use decks components.

## 0.5.0

### Minor Changes

- Adds full color system and additional needed sizes

## 0.4.0

Initial release with base CSS framework features.
