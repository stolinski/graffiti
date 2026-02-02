# @drop-in/graffiti

## 4.14.5

### Patch Changes

- Add label element to fluid type system so --fl variable works on labels

## 4.14.4

### Patch Changes

- Replace hardcoded gap: 20px with var(--gap, 1rem) in .flex, .split, and .header for token consistency

## 4.14.3

### Patch Changes

- Add text-wrap: balance to headings for more visually pleasing line breaks

## 4.14.2

### Patch Changes

- Fix duplicate comment: Purple scale → Purple deep scale

## 4.14.1

### Patch Changes

- Fix typo in CSS comment: Typeography → Typography

## 4.14.0

### Minor Changes

- Added Tabs component - pure CSS tabs using details/summary with CSS Grid and Subgrid. Features three variants: default (underline), boxed (card-style), and pill (rounded). No JavaScript required.

## 4.13.0

### Minor Changes

- Add tooltip component using CSS anchor positioning
  - Uses modern `anchor-scope` and `position-area` for clean positioning
  - No JavaScript required - pure CSS with `:hover`/`:focus-within`
  - Supports top (default), bottom, left, right positions
  - Clean API: just wrap trigger + `.tooltip-content` in `.tooltip`
  - Background inherits from theme (`--bg`), includes border and shadow

## 4.12.2

### Patch Changes

- Updated list-nav items to have individual squircle shape and shadow styling for a card-like appearance
- Removed margin-block from fluid type system. Typography elements no longer include default vertical margins, giving consumers full control over spacing.
- Refined shadow system for softer, more subtle appearance. Removed `--input-shadow` variable - buttons now use `--shadow-1` for consistency. Updated `--shadow-1` and `--shadow-2` with layered shadows that provide gentle lift without being heavy.

## 4.12.1

### Patch Changes

- Added footer component with `.footer` class and `.grid.auto` utility for responsive auto-fit grids

## 4.12.0

### Minor Changes

- 96af2b7: Added native `<dialog>` element styling with open/close animations, and a reusable `.close` button class. Demos use HTML invokers (`commandfor`/`command`) - no JavaScript required.

### Patch Changes

- 96af2b7: Added tags component - subtle category labels with customizable colors via `--tag-color`. Supports text, icons, emoji, and works as static labels or interactive links/buttons. Use `.muted` for neutral text color when you need guaranteed contrast.
- 96af2b7: Added chips component - small interactive tag/label elements for filters, categories, and selections. Supports icons, selected state (via `.selected` class or `aria-pressed`), disabled state, and a compact `.mini` variant.

## 4.11.1

### Patch Changes

- Added file dropzone component - drag-and-drop file upload zone with dashed border styling, hover/dragover states, and click-to-upload fallback using native file input

## 4.11.0

### Minor Changes

- Form improvements: fixed text input and toggle styles, added base styles for checkbox and radio inputs, added .search element with icon positioning, expanded Base docs with number, date/time, range, and file inputs

## 4.10.0

### Minor Changes

- Added input-group component for connected input + button patterns, commonly used for copy-to-clipboard, search, and form submission UIs

## 4.9.0

### Minor Changes

- 4fdcf2f: Refactored .box modifiers to use compound class syntax (.box.ghost instead of .box-ghost) and added .box.invisible variant
- 4fdcf2f: Standardized line height tokens to follow consistent sizing scale (--lh-xs, --lh-s, --lh, --lh-m, --lh-l, --lh-xl)
- 4fdcf2f: Added `.layout-sidebar.fixed` modifier for sticky sidebar layouts. The sidebar stays pinned to the viewport while main content scrolls independently - perfect for app shells and dashboards. Works seamlessly with headers/footers without requiring hardcoded heights.

### Patch Changes

- 4fdcf2f: Added --br-xl (24px) and --br-xxl (32px) border radius tokens
- 4fdcf2f: Added .pull-quote class for styled pull quote text

## 4.8.1

### Patch Changes

- Updated callout styles and added br-xl border radius utility

## 4.8.0

### Minor Changes

- 5a568c4: Added sidebar navigation component (.sidebar-nav) for app sidebars with collapsible sections using native details/summary. Fixed dropdown anchor positioning conflicts by using CSS variable (--anchor) for unique anchor names per dropdown.

## 4.7.1

### Patch Changes

- Added user menu block - a composed pattern combining avatar trigger with dropdown menu for user account navigation. Works with both image and initials avatars. Also added button reset styles for clickable avatars.

## 4.7.0

### Minor Changes

- c315536: Added `.layout-sidebar.fill` modifier for full-height sidebars and `.split.vertical` for vertical space-between layouts. Also added `@property --layout-gap` to prevent gap values from cascading to nested layout elements.

## 4.6.0

### Minor Changes

- f330776: Added avatar component for circular user images or initials. Features include:
  - Multiple size variants (xs, s, default, l, xl) via modifier classes
  - Automatic initials/icon fallback when no image provided
  - Optional bordered variant
  - Fluid typography scaling for initials

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
