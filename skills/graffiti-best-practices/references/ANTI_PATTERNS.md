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
- Manual KPI blocks instead of `.stat-card`
- Manual chat rows instead of `.chat-thread`/`.chat-row`/`.bubble`
- TOC styles created from scratch instead of `.toc`

### Why this is problematic

- Duplicates implementation effort
- Creates visual drift from canonical patterns
- Increases chance of missing states/accessibility hooks

### Preferred direction

- Start from canonical component classes first
- Only tokenize appearance when a variant is missing

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
- Component token overrides: `--tag-color`, `--bubble-*`, `--toggle-color`, `--callout-*`
- One-off wrapper constraints: limited `max-width`/`width` when no utility exists

Disallowed even as exceptions:

- Raw color literals for semantic states
- Inline structural layout declarations when layout classes exist
- Repeated manual margin reset patterns
