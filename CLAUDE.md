# CLAUDE.md

**Note**: This project uses Dex for issue tracking. Use `npx -y @zeeg/dex`
commands instead of markdown TODOs. See AGENTS.md for workflow details.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@drop-in/graffiti` is a CSS theming package that provides base styles, fluid typography, and a responsive layout system. It can be used as either:
1. **CLI tool**: `pnpm dlx @drop-in/graffiti` copies `drop-in.css` to `src/` folder
2. **Registry package**: Install and import in Vite-based apps

## Commands

```bash
# Build the docs and package outputs
pnpm build

# Build package outputs without the docs site
pnpm package

# Run required quality gates
pnpm test:ci:quality

# Test CLI locally
node bin.js
```

## Architecture

### Core Files

- **src/lib/drop-in.css**: Canonical CSS framework source - contains base styles, utilities, layouts, and typography
- **build-modules.js**: Generates every modular CSS output and compatibility JS string module under `dist/`
- **bin.js**: CLI entry point that copies `drop-in.css` to user's project at `src/drop-in.css`
- **scripts/graffiti-lookup.mjs**: Source for the generated registry lookup CLI

### Build Pipeline

1. `src/lib/drop-in.css` is the canonical CSS source.
2. `pnpm package` derives mirrors, packages Svelte helpers, validates annotations, and generates every `dist/` entry.
3. `dist/` is generated and ignored; root-level CSS string artifacts are not sources.

## CSS System Architecture

### Fluid Typography
Uses a custom CSS variable system based on `--fl` (fluid level) values:
- Elements set `--fl` to define their scale (-1 to 6)
- Calculations use `pow()` with modular scale ratios
- Supports both viewport units (100vi) and container query units (100cqi) via `.fc` class

### Layout System
`.layout` class provides a responsive 12-column grid system:
- Columns: 12 (desktop), 8 (tablet <1000px), 4 (mobile <500px)
- Uses CSS Grid with named lines: `[start]`, `[content]`, `[col-start]`, `[content-end]`, `[end]`
- Custom properties: `--start` and `--span` to position elements
- Helper classes: `.col`, `.sidebar`, `.main`, `.c-half`, `.c-quarter`, `.c-full`

### Theming System
- Uses CSS custom properties extensively
- `light-dark()` function for automatic color scheme switching
- `color-mix()` for tint/shade calculations
- Custom properties for spacing (`--vs-*`), border radius (`--br-*`), padding (`--pad-*`), shadows (`--s-*`)

## Package Exports

`package.json` is the authoritative export map. The historical `./drop-in.css`,
and `./raw` paths are generated compatibility aliases; do not create or edit
root-level copies.

## Authoring drop-in.css

Every primary class definition (rules with selector exactly `.classname` inside a `@layer` block) and every token at `:root` inside `@layer base` in `src/lib/drop-in.css` requires a structured annotation comment. Use `@pattern` / `@pattern-group` for classes and `@token` / `@token-group` for tokens.

`pnpm lint:graffiti` enforces the annotations and emits `registry.json` (the machine-readable catalogue consumed by lookup tools and downstream lint). The lint also runs pre-commit. See [docs/ANNOTATION-SPEC.md](docs/ANNOTATION-SPEC.md) for the full format and validation rules.

## Development Workflow

1. Edit `src/lib/drop-in.css` for framework changes.
2. Run `pnpm package` to regenerate `dist/`.
3. Run `pnpm test:ci:quality`; browser tests serve the SvelteKit site on port `6124`.
4. The package smoke test installs a packed tarball and exercises both CLIs.

## Usage

Users can import the framework in several ways:

```js
// Option 1: Import the base framework
import '@drop-in/graffiti'

// Option 2: Import as a JavaScript module
import css from '@drop-in/graffiti/raw'
```
