# Anti-Patterns

This catalog defines recurring low-quality Graffiti output patterns, how to detect them, and why they fail quality.

Use this with:

- `OUTPUT_CONTRACT.md` (quality gates)
- `RECOVERY_TRANSFORMS.md` (mechanical rewrites)

---

## AP-001: Inline Style Sprawl

### Detection heuristics

- Page has more than 12 inline declarations total
- Any section has more than 3 inline declarations
- `style="..."` appears on most structural wrappers (`section`, `main`, `article`)

### Why this is problematic

- Breaks class-first consistency
- Makes generated markup harder to reuse and maintain
- Hides intent that should be represented by classes

### Typical bad pattern

```html
<section
  style="display: grid; gap: 2rem; padding: 40px; margin: 0 auto; max-width: 1200px;"
></section>
```

### Preferred direction

- Replace layout declarations with `layout-*`, `stack`, `cluster`, `split`
- Keep inline styles only for approved token overrides

---

## AP-002: Margin Reset and Ad-Hoc Spacing Noise

### Detection heuristics

- Repeated `margin: 0` across many child elements
- Frequent one-off margin declarations like `margin: var(--vs-xs) 0 0 0`
- Raw spacing values (`12px`, `18px`, `24px`) in inline styles

### Why this is problematic

- Duplicates behavior already handled by `stack`/`cluster`
- Produces brittle spacing systems and inconsistent rhythm
- Increases verbosity with low signal

### Typical bad pattern

```html
<h2 style="margin: 0;">Title</h2>
<p style="margin: 0 0 12px 0;">Description</p>
```

### Preferred direction

- Use `stack` to normalize child margins
- Use tokenized gap overrides (`--gap`) instead of margin micromanagement
- Use `.form-option-row` for checkbox/radio label alignment instead of repeated inline `inline-flex` declarations

---

## AP-003: Hardcoded Color Overrides That Bypass Tokens

### Detection heuristics

- Inline `color`, `background`, `border-color` with `#hex`, `rgb()`, `hsl()`, `oklch()`
- Multiple handpicked colors in one section without semantic token mapping

### Why this is problematic

- Breaks theme compatibility
- Reduces consistency across components
- Prevents predictable dark/light behavior

### Typical bad pattern

```html
<span style="background: #1d4ed8; color: #fff;">Pro</span>
```

### Preferred direction

- Use existing semantic classes (`tag`, `callout`, `surface`, gradients)
- Use tokenized overrides like `--tag-color` only when class variant does not exist

---

## AP-004: Semantic Wrapper Debt (Div Soup)

### Detection heuristics

- Landmark-level output uses mostly `<div>` wrappers
- Missing `header/nav/main/section/footer/article/aside`
- Lists/tables are replaced with generic wrappers

### Why this is problematic

- Weak accessibility and document structure
- Harder for users and tools to understand intent
- Hurts reuse and long-form readability

### Typical bad pattern

```html
<div class="page">
  <div class="top">...</div>
  <div class="content">...</div>
</div>
```

### Preferred direction

- Use semantic landmarks and component-appropriate elements
- Preserve native semantics for forms, tables, disclosure content

---

## AP-005: Competing Layout Strategies in One Section

### Detection heuristics

- A wrapper has both layout classes and inline `display/grid/flex` overrides
- Section mixes `layout-*` classes with custom manual grid templates unnecessarily
- Inline alignment rewrites existing utility behavior (`text-align`, `justify-content`, etc.)

### Why this is problematic

- Creates conflicting constraints
- Makes responsive behavior unpredictable
- Increases complexity for no visual gain

### Typical bad pattern

```html
<div
  class="layout-three-col"
  style="display: flex; grid-template-columns: 1fr 1fr;"
></div>
```

### Preferred direction

- Choose one layout primitive per wrapper (`layout-three-col` OR `layout-card` OR `split`)
- Use class composition instead of inline structural overrides

---

## AP-006: Reinventing Existing Components

### Detection heuristics

- Hand-built card wrappers instead of `.card`
- Card anchors with inline `text-decoration`/`color` resets instead of `.card.linked`
- Manual KPI blocks instead of `.stat-card`
- Custom modal/dialog wrappers and JS toggles instead of native `<dialog>` + `.close`
- Repeated form option label rows with inline `display: inline-flex` instead of `.form-option-row`
- Manual chat rows instead of `.chat-thread`/`.chat-row`/`.bubble`
- Hand-built message/status boxes instead of `.callout` and semantic variants
- Custom input+button wrappers instead of `.input-group`
- TOC styles created from scratch instead of `.toc`

### Why this is problematic

- Duplicates implementation effort
- Creates visual drift from canonical patterns
- Increases chance of missing states/accessibility hooks
- Creates parallel systems that violate Graffiti-baseline contract
- Triggers hard-fail gates in `OUTPUT_CONTRACT.md`

### Preferred direction

- Start from canonical component classes first
- Use semantic status tags (`.tag.success/.warning/.error/.info`) before inline `--tag-color`
- Use `.card.linked` for card-as-link composition
- Use `.form-option-row` for radio/checkbox option labels
- Only tokenize appearance when a variant is missing
- Start from `CANONICAL_SNIPPETS.md` for critical patterns before composing custom section structure

---

## AP-007: Unknown or Invented Class Names

### Detection heuristics

- Class name not found in current `drop-in.css`
- Framework-specific utility classes mixed in (for example Tailwind-style names)

### Why this is problematic

- Markup does not render as intended
- Violates contract hard-fail conditions

### Preferred direction

- Validate every class against current library
- Fallback to nearest existing recipe and note the gap

---

## AP-008: Incorrect Full-Height Shell Strategy

### Detection heuristics

- Uses `height: 100vh` for app shells on mobile-sensitive layouts
- Omits `app-shell`/`layout-sidebar fill` composition in app-like views

### Why this is problematic

- Mobile viewport issues (especially iOS URL bar)
- Broken scroll behavior and clipped content

### Preferred direction

- Prefer `min-height: 100dvh` + `app-shell`/`layout-sidebar fill`

---

## AP-009: Oversized Theme Token Dumps in Markup

### Detection heuristics

- Root element carries many inline token overrides (10+ declarations)
- Includes full foreground/background scale override in page markup

### Why this is problematic

- Hard to maintain and reason about
- Encourages copy-paste of brittle token blocks
- Obscures intent and component composition

### Preferred direction

- Use existing theme-aware classes first (`surface`, gradients, semantic states)
- Apply only minimal token overrides needed for variant behavior

---

## AP-010: JS-First Interactive Patterns Where Native HTML Exists

### Detection heuristics

- JS used for simple disclosure/accordion behavior that `details/summary` can handle
- Custom modal toggling when native `dialog` pattern is sufficient

### Why this is problematic

- Unnecessary complexity
- Accessibility regressions from custom behavior
- Violates native-first Graffiti philosophy

### Preferred direction

- Use native HTML interaction primitives before adding JS

---

## AP-011: One-Off Local Custom CSS Instead of Reusable Overrides

### Detection heuristics

- Local `<style>` snippets created for a single component instance
- Custom selectors tightly scoped to one page/component fragment
- Repeated bespoke CSS declarations that should be reusable utilities/modifiers

### Why this is problematic

- Creates maintenance debt and inconsistent styling behavior
- Makes reuse across project screens difficult
- Works against Graffiti-first composition principles

### Typical bad pattern

```html
<section class="pricing">...</section>

<style>
  .pricing .cta-title {
    margin-bottom: 6px;
  }
</style>
```

### Preferred direction

- Keep Graffiti classes as the default composition layer
- If extension CSS is needed, define reusable project-level classes/utilities
- Prefer tokenized, composable overrides over tightly scoped one-off selectors

---

## Temporary Inline Exception Policy

Inline styles are allowed only when all conditions are true:

1. No existing class/variant can represent the requirement.
2. The inline style uses approved custom properties or bounded layout exceptions.
3. Inline budget remains within contract limits.
4. The response records why the exception was required.

Approved exception categories:

- Tokenized spacing/layout: `--gap`, `--layout-gap`, `--min-card-width`, `--max-width`
- Component token overrides: `--bubble-*`, `--toggle-color`, `--callout-*`, and `--tag-color` only for non-status category colors
- One-off wrapper constraints: limited `max-width`/`width` when no utility exists

Disallowed even as exceptions:

- Raw color literals for semantic states
- Inline structural layout declarations when layout classes exist
- Repeated manual margin reset patterns

---

## AP-012: Template Amnesia (Ignoring In-Repo Baselines)

### Detection heuristics

- Request intent matches an existing hosted template at `https://graffiti-ui.com/templates/*`
- Output composes a new page structure instead of adapting the baseline template
- Section ordering and component choices drift from baseline without explicit user request

### Why this is problematic

- Breaks consistency with documented, reviewed template patterns
- Reintroduces solved composition problems in new ad-hoc markup
- Produces outputs that feel non-native to Graffiti templates

### Typical bad pattern

```html
<!-- User asks to customize pricing section in landing template -->
<main class="layout-readable center stack">
  ...
  <!-- completely new page shell and section structure -->
</main>
```

### Preferred direction

- Start from the matching hosted template as baseline
- Preserve canonical section/component skeleton unless user requests a full replacement
- Apply customization as focused edits to baseline structure

---

## AP-013: Component Intent Drift (Role/Class Mismatch)

### Detection heuristics

- `.card` used as a generic wrapper for whole sections, forms, or app shells
- `.feature-card`, `.stat-card`, and `.card` swapped based on visual preference instead of content role
- `.form-actions` used outside a form submit/cancel context
- `.input-group` used as a generic horizontal layout row
- Role-specific classes selected without intent-fit evidence

### Why this is problematic

- Component semantics no longer match content intent
- Accessibility and structural meaning become less predictable
- Outputs drift into class-by-appearance behavior instead of canonical composition
- Reinforces incorrect class usage patterns in downstream generations

### Typical bad pattern

```html
<section class="card">
  <h2>Settings</h2>
  <form>...</form>
</section>
```

### Preferred direction

- Validate every role-specific class with `COMPONENT_INTENT_MATRIX.md`
- Use neutral wrappers (`box`, `surface`, `layout-*`, `stack`, `cluster`, `split`) for generic containers
- Keep `.card*` for record-like content units, `.stat-card` for metrics, `.feature-card` for feature-list items

---

## AP-014: Neutral-Wrapper Default (Box/Stack Reflex)

### Detection heuristics

- Page is heavy on `.box`, `.stack`, `.cluster`, `.split`, `.surface` wrappers
- A KPI metric is rendered with `<div class="box">…</div>` instead of `.stat-card`
- A feature blurb is rendered with `<div class="stack">…</div>` instead of `.feature-card`
- A notice is rendered with `<div class="box">…</div>` instead of `.callout`
- A chat turn is rendered with `<div class="stack">…</div>` instead of `.chat-row` + `.bubble`
- A tool call / activity entry is rendered with `<article class="card">` or `.box` instead of `.log-card`
- A multi-line input + send button is hand-built instead of `<form class="composer">`
- A right-side inspector is built from raw `<aside class="surface">` instead of `.workbench-panel`
- A narrow vertical icon nav is built from `.stack` instead of `.icon-rail`

### Why this is problematic

- Output looks generic and unstyled — neutral wrappers do not carry the role-specific shape, padding, and theme hooks that role primitives do.
- Other agents read the output, learn the bad pattern, and propagate it.
- Defeats the entire point of having role primitives — Graffiti's value is in named, themed, role-bearing components.
- Single largest source of "this looks ugly / generic / AI-shaped" complaints about Graffiti output.

### Typical bad pattern

```html
<div class="layout-card" style="--min-card-width: 220px;">
  <div class="box stack" style="--gap: var(--vs-xs);">
    <small>Total Revenue</small>
    <strong>$48,250</strong>
    <span class="tag success">+12.5%</span>
  </div>
  <div class="box stack" style="--gap: var(--vs-xs);">
    <small>Active Users</small>
    <strong>2,420</strong>
    <span class="tag success">+8.1%</span>
  </div>
</div>
```

### Preferred direction

```html
<div class="layout-card" style="--min-card-width: 220px;">
  <article class="stat-card">
    <small>Total Revenue</small>
    <strong>$48,250</strong>
    <span class="tag success">+12.5%</span>
  </article>
  <article class="stat-card">
    <small>Active Users</small>
    <strong>2,420</strong>
    <span class="tag success">+8.1%</span>
  </article>
</div>
```

Apply the role-first decision tree in `CHEAT_SHEET.md` and `COMPONENT_INTENT_MATRIX.md` before reaching for any neutral wrapper.

---

## AP-015: Icon-Library Recommendation Outside Project Context

### Detection heuristics

- Markup or commentary names a specific icon library (Lucide, Heroicons, Phosphor, Material, Tabler, etc.) without checking what the project already imports
- Output includes a third-party icon CDN URL (`<script src="https://...">`, `<link>` to an icon font, inline `<img src="https://unpkg.com/...">`)
- Emoji used as feature/section icons in non-brand contexts
- Hand-drawn SVG icons more complex than a basic shape (circle, square, arrow, chevron, plus, minus, X, check)

### Why this is problematic

- Graffiti deliberately ships no icon set and blesses none — recommending one biases users toward a choice they didn't make
- Mixing icon sets within a project (because each agent picks a different default) produces visually inconsistent UIs
- Pulling in a third-party icon CDN is a runtime decision that belongs in project setup, not in generated markup
- Hand-drawn SVGs read as AI-shaped slop

### Preferred direction

1. Check `package.json` and existing imports for an already-adopted icon library; use that one.
2. If none exists, use `<span class="icon" aria-hidden="true">` with a placeholder Unicode glyph until the user supplies a real source.
3. Never include a third-party icon CDN reference in output unless explicitly requested.
4. Never invent SVG icons more complex than a basic shape.

---

## AP-016: Fluid Size Utility (`.fs-*`) on a Non-Text Element

### Detection heuristics

- `.fs-xs` / `.fs-s` / … on a bare `<span>` or `<div>` without `.fluid`
- "Small" caption/meta text that renders at the parent's size

### Why this is problematic

- `.fs-*` only set `--fl`; `font-size: var(--fluid-type)` applies to text elements only (`h1`–`h6`, `p`, `li`, `.tag`, `.fluid`, form controls, `a`, `th`, `td`, `label`)
- A bare `<span>` / `<div>` is not in that list, so the class is inert — it inherits the parent's size

### Preferred direction

- Add `.fluid` beside `.fs-*` (`<span class="fluid fs-xs">`), or use a text element (`<p class="fs-xs">`)
- For a static small size, set a rem on a project class (as `.log-card` does), not `.fs-*`
