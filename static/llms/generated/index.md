---
title: "Graffiti CSS Framework"
url: https://graffiti-ui.com/
description: "A minimal, drop-in CSS toolkit with fluid typography, modern CSS features, and zero JavaScript dependencies."
---

# Graffiti CSS Framework

A minimal, drop-in CSS toolkit with fluid typography, modern CSS features, and zero JavaScript dependencies.

## Installation

```bash
pnpm add @drop-in/graffiti
```

## Import Options

```js
// Full framework (~75KB)
import '@drop-in/graffiti'

// Minimal - core + utilities only (~26KB)
import '@drop-in/graffiti/minimal'

// Standard - core + utilities + layouts (~33KB)
import '@drop-in/graffiti/standard'
```

## Documentation Sections

- [Base](https://graffiti-ui.com/base) - Foundation tokens and classless defaults: typography, variables, colors, and native form styling.
- [Utilities](https://graffiti-ui.com/utilities) - Layout and utility classes for structure, spacing, alignment, readability, and responsive composition.
- [Elements](https://graffiti-ui.com/elements) - Single-purpose UI elements with minimal classes and native HTML semantics.
- [UI Blocks](https://graffiti-ui.com/ui-blocks) - Composed multi-element UI patterns built from Graffiti primitives and native HTML features.

## Guides

- [Templates](https://graffiti-ui.com/templates) - Production-ready page templates built from Graffiti classes and semantic HTML.

## Philosophy

Graffiti styles native HTML elements directly - no component library, no JavaScript framework required. It uses modern CSS features like OKLCH colors, container queries, CSS scroll-snap, and the popover/dialog APIs.

**Key principles:**
- **Native HTML first** - Use `<dialog>`, `<details>`, `popover`, HTML invokers before reaching for JS
- **Minimal classes** - Most elements are styled automatically, add classes only when needed
- **Public token contracts** - Customize through Registry v2 entries with `public: true`; private calculated tokens are implementation details
- **Fluid typography** - Text scales smoothly between viewport sizes
- **Automatic theming** - Light/dark mode via `light-dark()` with no extra work

Request section routes, topic routes (for example `/elements/buttons`), or template routes with `Accept: text/markdown` to get agent-optimized docs.
