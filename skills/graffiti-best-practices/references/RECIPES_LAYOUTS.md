# Recipe Pack: Layouts

These are canonical page-shell and layout composition recipes for Graffiti.

Use these recipes when the request is page-level (not just a single component).

See also:

- `RECIPES_SECTIONS.md` for section internals
- `RECIPES_COMPONENTS.md` for reusable building blocks
- `OUTPUT_CONTRACT.md` for quality gates

## Shared Layout Rules

1. Prefer `section` + `layout-readable` for rhythm and readable measure.
2. Prefer `stack` and `cluster` for spacing/alignment before inline layout CSS.
3. Use inline styles only for approved token overrides (`--gap`, `--min-card-width`, etc.).
4. Use semantic landmarks (`header`, `nav`, `main`, `aside`, `footer`).
5. If a matching baseline exists in `src/routes/templates/*/+page.svelte`, adapt that file's structure first.

## In-Repo Baseline Map (Required First Check)

Before using recipes alone, check for a matching baseline template:

- Marketing/landing -> `src/routes/templates/landing/+page.svelte`
- Dashboard/admin -> `src/routes/templates/dashboard/+page.svelte`
- Blog/content -> `src/routes/templates/blog/+page.svelte`
- Settings/account -> `src/routes/templates/settings/+page.svelte`
- AI chat -> `src/routes/templates/ai-chat/+page.svelte`

Recipes in this file are canonical composition guides. When a baseline template exists, they should be used to refine/adapt the baseline, not replace it.

---

## LAYOUT-001: Marketing Landing Shell

Use case: SaaS/product marketing page with multiple stacked sections.

### Minimal skeleton

```html
<main>
  <section class="section gradient-aurora">
    <div
      class="layout-readable center stack text-center"
      style="--gap: var(--vs-l);"
    >
      <!-- hero content -->
    </div>
  </section>

  <section class="section">
    <div class="layout-readable center stack" style="--gap: var(--vs-xl);">
      <!-- features/pricing/testimonials -->
    </div>
  </section>

  <section class="section surface">
    <div class="layout-readable center stack" style="--gap: var(--vs-xl);">
      <!-- faq or conversion section -->
    </div>
  </section>

  <footer class="footer">
    <!-- footer columns -->
  </footer>
</main>
```

### Recommended class set

- `section`, `layout-readable`, `center`, `stack`, `text-center`
- `surface` and gradient utilities for visual alternation
- `layout-three-col` and `layout-card` for repeatable grids

### Optional variants

- Alternate hero backgrounds with `gradient-surface`, `gradient-slate`, `gradient-ocean`
- Use `layout-split` for value-prop + media section

### Accessibility notes

- Keep one `h1` in hero
- Use heading hierarchy by section (`h2`, then `h3`)

### Anti-pattern warnings

- Do not inline `display: grid/flex` for section wrappers when layout classes exist
- Do not use repeated `margin: 0` resets on stack children

### Fallback path

- If a desired visual card variant does not exist, use `card` + tokenized `surface`/gradient wrapper instead of raw colors

---

## LAYOUT-002: Dashboard App Shell

Use case: Admin/product dashboard with sidebar and content pane.

### Minimal skeleton

```html
<div class="layout-sidebar fill" style="--layout-gap: 0; min-height: 100dvh;">
  <aside
    class="split vertical surface"
    style="padding: var(--pad-l); border-inline-end: var(--border-1);"
  >
    <nav class="sidebar-nav">
      <!-- nav links and details -->
    </nav>
    <p class="fs-xs text-faint">v1.0.0</p>
  </aside>

  <main class="stack" style="padding: var(--pad-xl); --gap: var(--vs-xl);">
    <!-- toolbar, kpis, table cards -->
  </main>
</div>
```

### Recommended class set

- `layout-sidebar fill`, `split vertical`, `sidebar-nav`, `stack`
- `layout-card` for KPI rows
- `card` + `table` wrapper for tabular data

### Optional variants

- `layout-sidebar.narrow` or `.wide`
- `sidebar-nav compact` for dense menus

### Accessibility notes

- Mark active nav item with `aria-current="page"`
- Use `<details><summary>` for collapsible nav groups

### Anti-pattern warnings

- Do not use `height: 100vh` for full shells; prefer `min-height: 100dvh`
- Do not manually indent nested nav links with inline padding when `.sub` or nested patterns apply

### Fallback path

- If filter-bar utility is missing, use `split` + `cluster` composition instead of custom flex rules

---

## LAYOUT-003: Blog + TOC Shell

Use case: Long-form article with right-rail table of contents.

### Minimal skeleton

```html
<main class="layout-readable center" style="padding-block: var(--vs-xl);">
  <div class="layout-sidebar invert">
    <aside
      class="stack"
      style="--gap: var(--vs-l); align-self: start; position: sticky; top: var(--pad-xl);"
    >
      <nav class="toc" aria-label="Table of contents">
        <!-- toc links -->
      </nav>
    </aside>

    <article class="stack" style="--gap: var(--vs-m);">
      <!-- article content -->
    </article>
  </div>
</main>
```

### Recommended class set

- `layout-readable center`, `layout-sidebar invert`
- `toc`, `stack`, `cluster`, `text-muted`

### Optional variants

- Use `.surface` sections to separate newsletter/related content
- Use `.layout-card` for related posts grid

### Accessibility notes

- TOC should be in `<nav aria-label="Table of contents">`
- Use valid heading anchors in article

### Anti-pattern warnings

- Do not replace semantic heading structure with arbitrary font-size inline styles

### Fallback path

- If sticky behavior is undesirable in a host app, keep same markup and remove sticky inline tokens only

---

## LAYOUT-004: Settings/Account Shell

Use case: Settings pages with left nav and right form sections.

### Minimal skeleton

```html
<div class="layout-sidebar fill" style="--layout-gap: 0; min-height: 100dvh;">
  <aside
    class="split vertical"
    style="padding: var(--pad-l); border-inline-end: var(--border-1);"
  >
    <nav class="sidebar-nav">
      <!-- profile/account/security links -->
    </nav>
    <p class="fs-xs text-faint">user@example.com</p>
  </aside>

  <main class="stack" style="padding: var(--pad-xl); --gap: var(--vs-xl);">
    <section class="stack" style="--gap: var(--vs-m);">
      <!-- profile form -->
    </section>
    <section class="stack" style="--gap: var(--vs-m);">
      <!-- notification toggles -->
    </section>
    <section class="stack" style="--gap: var(--vs-m);">
      <!-- danger zone -->
    </section>
  </main>
</div>
```

### Recommended class set

- `layout-sidebar fill`, `sidebar-nav`, `stack`, `layout-split`
- `input-group`, `toggle`, `callout error`, `row`, `form-actions`

### Optional variants

- Use `.box split` for preference/toggle rows with `label[for]` + `id` association
- Use `.row` inside forms for field wrappers (label + input + help text)
- Use `.form-actions` for submit/cancel button rows (responsive stacking built in)

### Accessibility notes

- Group theme/radio controls in `fieldset` + `legend`
- Label every input and toggle

### Anti-pattern warnings

- Avoid ad-hoc inline flex declarations on label rows; use `cluster`/`split` patterns
- Avoid bare `cluster` for form action rows; use `.form-actions` for responsive stacking
- Avoid repeated `stack` + `--gap` wrappers for form fields; use `.row` inside forms

### Fallback path

- If utility for compact field rows is missing, use minimal inline token gap only, not raw spacing values

---

## LAYOUT-005: AI Chat Shell

Use case: Two-pane chat app with thread and composer.

### Minimal skeleton

```html
<section
  class="app-shell surface"
  style="--app-shell-min-height: calc(100dvh - 6rem);"
>
  <main class="layout-sidebar wide" style="--layout-gap: 0;">
    <aside class="app-shell surface">
      <!-- conversations list -->
    </aside>

    <section class="app-shell surface">
      <header class="header border">
        <!-- assistant metadata -->
      </header>

      <main class="hide-scrollbar momentum-scroll">
        <div class="chat-thread" style="--chat-thread-padding: var(--pad-l);">
          <!-- chat rows/messages -->
        </div>
      </main>

      <footer
        style="padding: var(--pad-m); border-block-start: var(--border-1);"
      >
        <form class="chat-composer">
          <div class="input-group">
            <input type="text" placeholder="Message" />
            <button class="primary" type="submit">Send</button>
          </div>
        </form>
      </footer>
    </section>
  </main>
</section>
```

### Recommended class set

- `app-shell`, `layout-sidebar wide`, `chat-thread`, `chat-row`, `chat-message`, `bubble`, `chat-composer`
- `hide-scrollbar`, `momentum-scroll` for mobile-friendly scroll behavior

### Optional variants

- Dense list pane with `sidebar-nav compact`
- User message bubble tint with `--bubble-bg` and `--bubble-border`

### Accessibility notes

- Provide labels for message input and conversation lists
- Mark current conversation in list with `aria-current="page"`

### Anti-pattern warnings

- Avoid giant inline root color token blocks when a neutral surface layout is acceptable

### Fallback path

- If branded chat theme tokens are required and no preset exists, apply only minimal token overrides (`--bubble-*`, `--surface-bg`) and record gap for theme presets

---

## LAYOUT-006: Shared Responsive Composition Primitives

Use this when composing any of the shells above.

### Primitive pattern

```html
<section class="section">
  <div class="layout-readable center stack" style="--gap: var(--vs-xl);">
    <div class="cluster" style="--gap: var(--vs-s);">
      <!-- controls/tags/actions -->
    </div>

    <div class="layout-card" style="--min-card-width: 240px;">
      <!-- repeatable cards -->
    </div>
  </div>
</section>
```

### Notes

- Prefer `layout-three-col` when exactly three cards should balance at desktop.
- Prefer `layout-card` when card count is variable.
- Keep spacing changes tokenized (`--gap`) rather than raw px values.
