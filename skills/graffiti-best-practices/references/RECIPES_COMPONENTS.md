# Recipe Pack: Components

Canonical component-level recipes for reuse across landing, dashboard, blog, settings, and chat intents.

See also:

- `RECIPES_LAYOUTS.md`
- `RECIPES_SECTIONS.md`
- `OUTPUT_CONTRACT.md`

---

## COMP-001: Header Bar

Use case: simple site/app top bar.

```html
<header class="header border">
  <a href="#"><strong>Brand</strong></a>
  <nav>
    <ul>
      <li><a href="#">Docs</a></li>
      <li><a href="#">Pricing</a></li>
    </ul>
  </nav>
</header>
```

- Variants: add `sticky` for sticky header
- Accessibility: include clear nav labels/link text

---

## COMP-002: Sidebar Navigation Group

Use case: settings/dashboard side navigation.

```html
<nav class="sidebar-nav">
  <a href="#" aria-current="page">Dashboard</a>

  <details open>
    <summary>Settings</summary>
    <a href="#">General</a>
    <a href="#">Billing</a>
  </details>
</nav>
```

- Variants: `sidebar-nav compact`, `.sub` top-level links
- Accessibility: use `aria-current="page"` on active item
- Anti-pattern: avoid custom JS for expand/collapse when `details/summary` is enough

---

## COMP-003: Feature Card

Use case: feature lists on landing/product pages.

```html
<article class="feature-card">
  <span class="icon" aria-hidden="true">*</span>
  <h3>Feature title</h3>
  <p>Feature summary text.</p>
</article>
```

- Accessibility: icon is decorative unless it carries meaning
- Anti-pattern: avoid manually rebuilding this pattern with `box`

---

## COMP-004: Stat Card

Use case: KPI metrics in dashboard headers.

```html
<article class="stat-card">
  <small>Active users</small>
  <strong>2,420</strong>
  <span class="tag success">+8.1%</span>
</article>
```

- Recommended: use in `layout-card`
- Status mapping: use `.tag.success`, `.tag.warning`, `.tag.error`, `.tag.info` before token overrides

---

## COMP-005: Content Card with Header and Footer

Use case: reusable container for pricing, related posts, summaries.

```html
<article class="card">
  <header>
    <h3>Card title</h3>
    <span class="tag">Meta</span>
  </header>
  <div class="card-body stack" style="--gap: var(--vs-s);">
    <p>Body content</p>
  </div>
  <footer>
    <button class="primary">Action</button>
  </footer>
</article>
```

- Variants: `.card.featured` for emphasized card
- Anti-pattern: avoid duplicated manual separators that `card` already provides

---

## COMP-006: Data Table Wrapper

Use case: tabular records with horizontal overflow handling.

```html
<div class="table">
  <table>
    <thead>
      <tr>
        <th>Order</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>#3210</td>
        <td>
          <span class="tag success">Completed</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

- Accessibility: preserve native table semantics
- Anti-pattern: do not replace table with div grid for data tables

---

## COMP-007: TOC Block

Use case: long article table of contents.

```html
<nav class="toc" aria-label="Table of contents">
  <h4>On this page</h4>
  <ol>
    <li><a href="#intro" aria-current="true">Intro</a></li>
    <li><a href="#details">Details</a></li>
  </ol>
</nav>
```

- Accessibility: links must target valid heading IDs
- Anti-pattern: avoid non-link TOC entries

---

## COMP-008: Callout (info/warning/error/success)

Use case: contextual notices, warnings, and critical actions.

```html
<div class="callout fill">
  <p><strong>Heads up</strong></p>
  <p>Informational message.</p>
</div>

<div class="callout error">
  <p><strong>Danger</strong></p>
  <p>Irreversible action warning.</p>
</div>
```

- Variants: `.warning`, `.error`, `.success`, `.ghost`, `.hard`

---

## COMP-009: Toggle Row

Use case: settings preferences row.

```html
<div class="box split" style="--gap: var(--vs-s);">
  <div class="stack" style="--gap: var(--vs-xs);">
    <label for="notif-email"><strong>Email notifications</strong></label>
    <p class="fs-xs text-muted">Receive account updates.</p>
  </div>
  <input id="notif-email" type="checkbox" class="toggle" checked />
</div>
```

- Accessibility: use explicit `label[for]` + `id` association instead of `aria-label`
- Anti-pattern: avoid custom switch JS/CSS when native `input.toggle` fits

---

## COMP-016: Form Field Row

Use case: label + input + optional help text grouping inside forms.

```html
<form class="stack" style="--gap: var(--vs-m);">
  <div class="row">
    <label for="email">Email</label>
    <input type="email" id="email" />
    <small class="text-faint">Used for account notifications.</small>
  </div>

  <div class="row">
    <label for="password">Password</label>
    <input type="password" id="password" />
  </div>
</form>
```

- `.row` becomes a grid field wrapper inside `form` or `fieldset` contexts
- Outside forms, `.row` retains its spacing utility behavior (`margin-block`)
- Anti-pattern: avoid repeated `stack` + `--gap: var(--vs-xs)` wrappers when `.row` handles it

---

## COMP-017: Form Actions

Use case: submit/cancel button row at end of form.

```html
<div class="form-actions">
  <button class="ghost" type="button">Cancel</button>
  <button class="primary" type="submit">Save changes</button>
</div>
```

- End-aligned on desktop, stacks full-width on narrow containers via container query
- Tunable via `--form-actions-justify`, `--form-actions-gap`, `--form-actions-margin`
- Anti-pattern: avoid bare `cluster` for form actions when `.form-actions` provides responsive stacking

---

## COMP-010: Form Option Row

Use case: compact checkbox/radio label rows without inline alignment styles.

```html
<fieldset class="stack" style="--gap: var(--vs-xs);">
  <legend>Theme</legend>
  <label class="form-option-row">
    <input type="radio" name="theme" value="light" checked />
    Light
  </label>
  <label class="form-option-row">
    <input type="radio" name="theme" value="dark" />
    Dark
  </label>
</fieldset>
```

- Accessibility: keep a grouped `fieldset` + `legend` for related options
- Anti-pattern: avoid repeated inline `display: inline-flex; align-items: center; gap: ...`

---

## COMP-011: Input Group

Use case: search, invite flow, newsletter form, username check.

```html
<div class="input-group" style="max-width: 420px;">
  <input type="email" placeholder="you@example.com" />
  <button class="primary" type="button">Subscribe</button>
</div>
```

- Anti-pattern: avoid separate, disconnected input + button rows

---

## COMP-012: Chat Message Row

Use case: assistant/user message formatting in threaded chat.

```html
<div class="chat-row">
  <article class="chat-message">
    <div class="bubble">
      <p>Assistant message</p>
    </div>
  </article>
</div>

<div class="chat-row self">
  <article class="chat-message text-end">
    <div
      class="bubble"
      style="--bubble-bg: var(--primary-1); --bubble-border: var(--primary-5);"
    >
      <p>User message</p>
    </div>
  </article>
</div>
```

- Recommended pairing: wrap rows in `.chat-thread`
- Fallback: if rich chat theme is unavailable, keep neutral `bubble` defaults

---

## COMP-013: Chat Composer

Use case: bottom message input in chat UIs.

```html
<form class="chat-composer" action="#" method="post">
  <div class="input-group">
    <input type="text" placeholder="Your message..." />
    <button class="primary" type="submit">Send</button>
  </div>
</form>
```

- Accessibility: keep button text explicit; add `aria-label` on input when no visible label

---

## COMP-014: Linked Card Variant

Use case: clickable article/product cards using the canonical card-as-link variant.

```html
<a href="/articles/css" class="card linked">
  <div class="card-body stack" style="--gap: var(--vs-xs);">
    <span class="tag info">Category</span>
    <strong>Card title</strong>
    <span class="fs-xs text-muted">Meta line</span>
  </div>
</a>
```

- Use `.card.linked` instead of inline `text-decoration`/`color` resets on anchors.

---

## COMP-015: Footer Column Group

Use case: multi-column footer with legal row.

```html
<footer class="footer">
  <div class="layout-readable center stack" style="--gap: var(--vs-xl);">
    <div class="grid auto" style="--grid-min: 150px;">
      <nav class="stack" style="--gap: var(--vs-s);">...</nav>
      <nav class="stack" style="--gap: var(--vs-s);">...</nav>
    </div>
    <hr />
    <div class="split">
      <p class="fs-xs text-muted">Copyright</p>
      <div class="cluster" style="--gap: var(--vs-m);">...</div>
    </div>
  </div>
</footer>
```

- Anti-pattern: avoid separate ad-hoc media queries for footer column wrapping when `grid auto` and container behavior handle it
