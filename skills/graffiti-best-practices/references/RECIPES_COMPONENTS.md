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
  <span class="tag" style="--tag-color: var(--green);">+8.1%</span>
</article>
```

- Recommended: use in `layout-card`
- Fallback: status tag color uses inline `--tag-color` until semantic status tag variants are standardized

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
          <span class="tag" style="--tag-color: var(--green);">Completed</span>
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
<div class="box split center">
  <div>
    <p><strong>Email notifications</strong></p>
    <p class="fs-xs text-muted">Receive account updates.</p>
  </div>
  <input
    type="checkbox"
    class="toggle"
    checked
    aria-label="Email notifications"
  />
</div>
```

- Accessibility: ensure each toggle has a clear label association
- Anti-pattern: avoid custom switch JS/CSS when native `input.toggle` fits

---

## COMP-010: Input Group

Use case: search, invite flow, newsletter form, username check.

```html
<div class="input-group" style="max-width: 420px;">
  <input type="email" placeholder="you@example.com" />
  <button class="primary" type="button">Subscribe</button>
</div>
```

- Anti-pattern: avoid separate, disconnected input + button rows

---

## COMP-011: Chat Message Row

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

## COMP-012: Chat Composer

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

## COMP-013: Linked Card Fallback Pattern

Use case: clickable article/product cards before dedicated linked-card utility exists.

```html
<a
  href="#"
  class="card stack"
  style="--gap: 0; text-decoration: none; color: var(--fg);"
>
  <div class="card-body stack" style="--gap: var(--vs-xs);">
    <span class="tag" style="--tag-color: var(--blue);">Category</span>
    <strong>Card title</strong>
    <span class="fs-xs text-muted">Meta line</span>
  </div>
</a>
```

- Status: temporary fallback
- Implementation note: use a dedicated linked-card utility when available; until then keep this fallback minimal.

---

## COMP-014: Footer Column Group

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
