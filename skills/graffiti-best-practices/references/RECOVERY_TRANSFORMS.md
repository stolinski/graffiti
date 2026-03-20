# Recovery Transforms

Deterministic rewrite rules for fixing common Graffiti anti-patterns.

Use these transforms after anti-pattern detection.

Each transform includes:

- Trigger
- Rewrite steps
- Before/after example
- Verification checks

---

## RT-001: Inline Layout to Class-First Layout

### Trigger

- Wrapper has inline `display`, `grid-template-*`, `justify-content`, `align-items`
- Layout can be represented with `layout-*`, `stack`, `cluster`, or `split`

### Rewrite steps

1. Identify intended structure (card grid, split, sidebar, vertical flow).
2. Replace inline layout declarations with nearest layout class.
3. Keep only tokenized inline gap/min-width overrides if needed.

### Before

```html
<section style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2rem;">
  ...
</section>
```

### After

```html
<section class="layout-three-col" style="--gap: var(--vs-l);">...</section>
```

### Verification

- No inline `display`/`grid-template-*` remains
- Layout class exists in hosted docs markdown and/or installed `drop-in.css`

---

## RT-002: Margin Reset Noise to Stack Rhythm

### Trigger

- Multiple children with `margin: 0` or ad-hoc margin values

### Rewrite steps

1. Wrap related elements in `stack`.
2. Remove per-element margin resets.
3. Set rhythm using `--gap` token on parent if required.

### Before

```html
<div>
  <h2 style="margin: 0;">Title</h2>
  <p style="margin: 0 0 12px 0;">Copy</p>
</div>
```

### After

```html
<div class="stack" style="--gap: var(--vs-s);">
  <h2>Title</h2>
  <p>Copy</p>
</div>
```

### Verification

- Margin reset declarations removed
- Spacing represented by parent gap tokens

---

## RT-003: Hardcoded Colors to Semantic Tokens

### Trigger

- Inline literal colors (`#`, `rgb`, `hsl`, `oklch`) are used for status/content styling

### Rewrite steps

1. Map element to semantic component (`tag`, `callout`, button variant).
2. Use component variant first.
3. If no variant exists, use approved custom property override.

### Before

```html
<span style="background: #16a34a; color: #fff; border-radius: 999px;"
  >Active</span
>
```

### After

```html
<span class="tag success">Active</span>
```

### Verification

- No raw color literals remain for semantic states
- Uses semantic class variant path

---

## RT-004: Div Soup to Semantic Landmarks

### Trigger

- Page-level output is mostly generic `<div>` wrappers

### Rewrite steps

1. Replace top-level wrappers with landmarks (`header`, `main`, `section`, `footer`).
2. Replace nav lists with `nav > ul` or `nav` + links as appropriate.
3. Replace data wrappers with semantic tables/lists/forms where relevant.

### Before

```html
<div class="page">
  <div class="top">...</div>
  <div class="content">...</div>
</div>
```

### After

```html
<header class="header border">...</header>
<main>
  <section class="section">...</section>
</main>
<footer class="footer">...</footer>
```

### Verification

- Landmark structure present
- Heading hierarchy remains valid

---

## RT-005: Competing Layout Primitives to Single Primitive

### Trigger

- A single wrapper mixes incompatible layout strategies

### Rewrite steps

1. Decide wrapper purpose: split, card grid, sidebar shell, or row cluster.
2. Keep exactly one primary layout class on that wrapper.
3. Move secondary concerns to child wrappers.

### Before

```html
<div
  class="layout-card"
  style="display: flex; justify-content: space-between;"
></div>
```

### After

```html
<div class="layout-card" style="--min-card-width: 220px;"></div>
```

### Verification

- One primary layout strategy per wrapper
- Responsive behavior comes from class defaults

---

## RT-006: Hand-Built Component to Canonical Component

### Trigger

- Markup manually reproduces existing component behavior (card, stat-card, toc, bubble, etc.)

### Rewrite steps

1. Identify closest canonical component class.
2. Replace manual wrappers with component skeleton.
3. Keep only required content and token overrides.

### Before

```html
<div
  class="box"
  style="padding: 1.5rem; border-radius: 16px; box-shadow: var(--shadow-2);"
></div>
```

### After

```html
<article class="card">
  <div class="card-body">...</div>
</article>
```

### Verification

- Uses canonical component class
- Manual shadow/radius declarations removed

---

## RT-007: Unknown Class Fallback

### Trigger

- One or more class names are not found in current library

### Rewrite steps

1. Remove unknown class names.
2. Substitute nearest known class combination from recipes.
3. If exact variant is missing, add a limitation note and minimal tokenized fallback.

### Before

```html
<div class="metric-tile emphasis">...</div>
```

### After

```html
<article class="stat-card">...</article>
```

### Verification

- Class validation reports zero unknown classes

---

## RT-008: `100vh` Shell to `100dvh` Shell

### Trigger

- App shell uses `height: 100vh` in mobile-sensitive contexts

### Rewrite steps

1. Switch shell to `min-height: 100dvh`.
2. Use `layout-sidebar fill` and/or `app-shell` where appropriate.
3. Ensure scrolling happens in intended pane.

### Before

```html
<div class="layout-sidebar fill" style="height: 100vh; --layout-gap: 0;"></div>
```

### After

```html
<div
  class="layout-sidebar fill"
  style="min-height: 100dvh; --layout-gap: 0;"
></div>
```

### Verification

- No `100vh` dependency for shell height
- Pane scroll behavior remains intact

---

## RT-009: Oversized Token Dump to Minimal Theme Overrides

### Trigger

- Root element has many inline custom properties (10+)

### Rewrite steps

1. Keep base visual structure using existing classes (`surface`, gradients, semantic components).
2. Remove non-essential token overrides.
3. Retain only minimal overrides directly tied to requested variant.

### Before

```html
<section
  style="--bg: ...; --fg: ...; --fg-1: ...; --fg-2: ...; --border-1: ...; --primary: ...;"
></section>
```

### After

```html
<section class="surface" style="--surface-bg: var(--fg-05);"></section>
```

### Verification

- Inline token count significantly reduced
- Visual intent preserved with class-led styling

---

## RT-010: JS-First Disclosure to Native Disclosure

### Trigger

- JS-driven accordion/dropdown behavior for simple show/hide content

### Rewrite steps

1. Replace custom toggle wrapper with `details/summary`.
2. Preserve labels and content structure.
3. Add `bordered` class if sectioned appearance is needed.

### Before

```html
<div class="faq-item" onclick="toggleFaq(this)">...</div>
```

### After

```html
<details class="bordered">
  <summary>Question</summary>
  <p>Answer</p>
</details>
```

### Verification

- Removes custom JS requirement for simple disclosure
- Native keyboard and accessibility behavior retained

---

## Transform Application Order

Apply transforms in this order for deterministic cleanup:

1. RT-007 unknown classes
2. RT-004 semantics
3. RT-001 and RT-005 layout normalization
4. RT-002 spacing cleanup
5. RT-003 semantic colors
6. RT-006 canonical component substitution
7. RT-008 shell viewport fix
8. RT-009 token dump reduction
9. RT-010 native interaction replacement

Then run the full verification checklist from `OUTPUT_CONTRACT.md`.
