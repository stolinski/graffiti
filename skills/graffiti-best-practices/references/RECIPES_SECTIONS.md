# Recipe Pack: Sections

Canonical section recipes grouped by product intent.

Use these after selecting a page shell from `RECIPES_LAYOUTS.md`.

See also `RECIPES_COMPONENTS.md` for smaller sub-patterns.

---

## Marketing Landing Sections

### SECTION-MKT-001: Hero (headline + support copy + dual CTA)

Use case: top-of-page value proposition.

```html
<section class="section gradient-aurora">
  <div
    class="layout-readable center stack text-center"
    style="--gap: var(--vs-l);"
  >
    <span class="tag">Now in beta</span>
    <h1>Ship faster with less complexity</h1>
    <p class="text-muted narrow">
      Short value prop that explains the core benefit.
    </p>
    <div class="cluster center">
      <a href="#pricing" class="button primary">Start Free Trial</a>
      <a href="#features" class="button ghost">See Features</a>
    </div>
  </div>
</section>
```

- Recommended classes: `section`, `layout-readable`, `stack`, `text-center`, `narrow`, `cluster`, `button` variants, `tag`
- Optional variants: swap hero gradient class; use `chip` instead of `tag` for non-status labels
- Accessibility: one `h1` only
- Anti-pattern: avoid inline text alignment when `text-center` exists

### SECTION-MKT-002: Feature Grid

Use case: highlight core capabilities.

```html
<section id="features" class="section">
  <div class="layout-readable center stack" style="--gap: var(--vs-xl);">
    <div class="stack text-center" style="--gap: var(--vs-s);">
      <h2>Everything you need</h2>
      <p class="text-muted narrow">Feature summary copy.</p>
    </div>

    <div class="layout-three-col">
      <article class="feature-card">
        <span class="icon" aria-hidden="true">*</span>
        <h3>Fast deploys</h3>
        <p>Feature explanation.</p>
      </article>
      <article class="feature-card">
        <span class="icon" aria-hidden="true">*</span>
        <h3>Built-in security</h3>
        <p>Feature explanation.</p>
      </article>
    </div>
  </div>
</section>
```

- Recommended classes: `layout-three-col`, `feature-card`, `icon`
- Optional variants: use `layout-card` for variable feature counts
- Accessibility: icons are decorative with `aria-hidden`
- Anti-pattern: do not rebuild feature card with custom box shadow inline

### SECTION-MKT-003: Pricing Table (three plans)

Use case: side-by-side plan comparison.

```html
<section id="pricing" class="section surface">
  <div class="layout-readable center stack" style="--gap: var(--vs-xl);">
    <div class="layout-three-col" style="align-items: stretch;">
      <article class="card stack" style="--gap: 0;">
        <header><h3>Hobby</h3></header>
        <div class="card-body stack" style="--gap: var(--vs-m);">...</div>
        <footer><a class="button ghost" href="#">Get Started</a></footer>
      </article>

      <article class="card featured stack" style="--gap: 0;">
        <header>
          <h3>Pro</h3>
          <span class="tag">Popular</span>
        </header>
        <div class="card-body stack" style="--gap: var(--vs-m);">...</div>
        <footer><a class="button primary" href="#">Start Trial</a></footer>
      </article>

      <article class="card stack" style="--gap: 0;">...</article>
    </div>
  </div>
</section>
```

- Recommended classes: `card`, `card-body`, `card.featured`, `button` variants, `tag`
- Optional variants: compact pricing with `layout-card` + min card width token
- Accessibility: plan headers should be headings, CTA labels should be action specific
- Anti-pattern: avoid manual header tinting when `.card.featured` fits
- Status mapping: use `.tag.success`, `.tag.warning`, `.tag.error`, `.tag.info` for status labels

### SECTION-MKT-004: FAQ (details/summary)

Use case: objection handling in landing pages.

```html
<section class="section">
  <div
    class="layout-readable center stack"
    style="--max-width: 800px; --gap: var(--vs-xl);"
  >
    <h2>Frequently asked questions</h2>
    <div class="stack" style="--gap: 0;">
      <details class="bordered">
        <summary>How does billing work?</summary>
        <p>Answer text.</p>
      </details>
      <details class="bordered">
        <summary>Can I cancel anytime?</summary>
        <p>Answer text.</p>
      </details>
    </div>
  </div>
</section>
```

- Recommended classes: `stack`, `bordered`
- Accessibility: rely on native `details/summary`
- Anti-pattern: avoid JS accordion for simple FAQ

### SECTION-MKT-005: Final CTA + Footer

Use case: conversion close with nav footer.

```html
<section class="section gradient-surface">
  <div
    class="layout-readable center stack text-center"
    style="--gap: var(--vs-l);"
  >
    <h2>Ready to get started?</h2>
    <p class="text-muted narrow">Short closing message.</p>
    <div class="cluster center">
      <a class="button primary" href="#">Start Free Trial</a>
      <a class="button ghost" href="#">Talk to Sales</a>
    </div>
  </div>
</section>

<footer class="footer" style="padding: var(--pad-xxxl) 0 var(--pad-xxl);">
  <div class="layout-readable center stack" style="--gap: var(--vs-xl);">
    <div class="grid auto" style="--grid-min: 150px;">
      <nav class="stack" style="--gap: var(--vs-s);">...</nav>
      <nav class="stack" style="--gap: var(--vs-s);">...</nav>
    </div>
    <hr />
    <div class="split">
      <p class="fs-xs text-muted">Copyright text</p>
      <div class="cluster" style="--gap: var(--vs-m);">...</div>
    </div>
  </div>
</footer>
```

- Recommended classes: `footer`, `grid auto`, `split`, `cluster`
- Anti-pattern: avoid ad-hoc footer column layout when `grid auto` is sufficient

---

## Dashboard Sections

### SECTION-APP-001: Header + Filters Row

```html
<div class="split">
  <h1 class="h3">Dashboard</h1>
  <div class="cluster" style="--gap: var(--vs-s);">
    <button class="ghost">Last 30 days</button>
    <button class="primary">Export</button>
  </div>
</div>
```

- Recommended classes: `split`, `cluster`, `h3`
- Fallback: if dedicated filter bar variant is missing, keep this composition

### SECTION-APP-002: KPI Stats

```html
<div class="layout-card" style="--min-card-width: 200px;">
  <article class="stat-card">
    <small>Total Revenue</small>
    <strong>$48,250</strong>
    <span class="tag success">+12.5%</span>
  </article>
  <article class="stat-card">...</article>
</div>
```

- Recommended classes: `layout-card`, `stat-card`, `tag`
- Anti-pattern: avoid hand-built KPI boxes when `stat-card` exists

### SECTION-APP-003: Data Table Card

```html
<article class="card">
  <header><h2 class="h5">Recent Orders</h2></header>
  <div class="table">
    <table>
      <thead>
        ...
      </thead>
      <tbody>
        ...
      </tbody>
    </table>
  </div>
</article>
```

- Recommended classes: `card`, `table`, `tag` status cells
- Accessibility: use table semantics and scope where needed

---

## Blog Sections

### SECTION-CONTENT-001: Article Header

```html
<header class="stack" style="--gap: var(--vs-s);">
  <div class="cluster" style="--gap: var(--vs-s);">
    <span class="tag info">Accessibility</span>
    <span class="fs-xs text-muted">10 min read</span>
  </div>
  <h1>Article title</h1>
  <p class="text-muted">Article dek.</p>
</header>
```

### SECTION-CONTENT-002: Related Articles

```html
<section class="stack" style="--gap: var(--vs-s);">
  <h3>Related articles</h3>
  <div class="layout-card" style="--min-card-width: 200px;">
    <a href="/blog" class="card linked">
      <div class="card-body stack" style="--gap: var(--vs-xs);">
        <span class="tag" style="--tag-color: var(--purple);">CSS</span>
        <strong>Card title</strong>
      </div>
    </a>
  </div>
</section>
```

### SECTION-CONTENT-003: Newsletter Card

```html
<section class="section surface">
  <div class="layout-readable center">
    <article class="card" style="max-width: 860px; margin-inline: auto;">
      <div
        class="card-body stack text-center"
        style="--gap: var(--vs-m); align-items: center;"
      >
        <h3>Stay in the loop</h3>
        <p class="text-muted narrow">Newsletter copy.</p>
        <div class="input-group" style="max-width: 400px;">
          <input type="email" placeholder="you@example.com" />
          <button class="primary">Subscribe</button>
        </div>
      </div>
    </article>
  </div>
</section>
```

---

## Settings Sections

### SECTION-SET-001: Profile Form Block

```html
<section
  class="stack"
  aria-labelledby="profile-heading"
  style="--gap: var(--vs-m);"
>
  <header class="stack" style="--gap: var(--vs-xs);">
    <h1 id="profile-heading" class="h3">Profile</h1>
    <p class="text-muted">Manage your profile info.</p>
  </header>

  <form
    class="stack"
    aria-labelledby="profile-heading"
    style="--gap: var(--vs-m);"
  >
    <div class="layout-split" style="--layout-gap: var(--vs-m);">
      <div class="row">
        <label for="first-name">First name</label>
        <input id="first-name" type="text" />
      </div>
      <div class="row">
        <label for="last-name">Last name</label>
        <input id="last-name" type="text" />
      </div>
    </div>

    <div class="row">
      <label for="email">Email</label>
      <input id="email" type="email" />
      <small class="text-faint">Used for notifications and login.</small>
    </div>

    <div class="form-actions">
      <button class="primary" type="button">Save</button>
      <button class="ghost" type="button">Cancel</button>
    </div>
  </form>
</section>
```

- Uses `.row` for field wrappers, `.form-actions` for action row
- Accessibility: `aria-labelledby` on section and form, explicit `label[for]` on all fields

### SECTION-SET-002: Notification Toggles

```html
<section
  class="stack"
  aria-labelledby="notifications-heading"
  style="--gap: var(--vs-m);"
>
  <header class="stack" style="--gap: var(--vs-xs);">
    <h2 id="notifications-heading" class="h3">Notifications</h2>
    <p class="text-muted">Choose what notifications you receive.</p>
  </header>

  <fieldset
    class="stack"
    style="padding: 0; margin: 0; border: none; --gap: var(--vs-s);"
  >
    <legend class="visually-hidden">Notification preferences</legend>
    <div class="box split" style="--gap: var(--vs-s);">
      <div class="stack" style="--gap: var(--vs-xs);">
        <label for="notif-email"><strong>Email notifications</strong></label>
        <p class="fs-xs text-muted">Toggle description.</p>
      </div>
      <input id="notif-email" class="toggle" type="checkbox" checked />
    </div>
  </fieldset>
</section>
```

- Uses `fieldset` + `legend` for grouping, explicit `label[for]` + `id` for toggles
- Accessibility: `visually-hidden` legend for screen readers

### SECTION-SET-003: Danger Zone

```html
<section
  class="stack"
  aria-labelledby="danger-zone-heading"
  style="--gap: var(--vs-m);"
>
  <header>
    <h2 id="danger-zone-heading" class="h3" style="color: var(--red);">
      Danger Zone
    </h2>
  </header>

  <div class="callout error fill">
    <div class="stack" style="--gap: var(--vs-s);">
      <p><strong>Delete account</strong></p>
      <p class="text-muted">This action is permanent.</p>
      <div class="cluster" style="--gap: var(--vs-s);">
        <button class="error" type="button">Delete Account</button>
      </div>
    </div>
  </div>
</section>
```

- Uses `callout error fill` for stronger visual weight
- Fallback warning: semantic heading color variant is not standardized; one inline color is acceptable until variant exists

---

## Chat Sections

### SECTION-CHAT-001: Conversation List Panel

```html
<aside class="app-shell surface">
  <header class="header border">
    <strong>All chats</strong>
    <span class="chip">Model</span>
  </header>

  <main class="hide-scrollbar momentum-scroll" style="padding: var(--pad-m);">
    <nav class="sidebar-nav compact">
      <a href="#" aria-current="page">
        <span class="avatar s">A</span>
        <span>Conversation title</span>
      </a>
    </nav>
  </main>
</aside>
```

### SECTION-CHAT-002: Thread + Composer

```html
<section class="app-shell surface">
  <header class="header border">...</header>

  <main class="hide-scrollbar momentum-scroll">
    <div class="chat-thread" style="--chat-thread-padding: var(--pad-l);">
      <div class="chat-row">
        <article class="chat-message">
          <div class="bubble"><p>Assistant message</p></div>
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
    </div>
  </main>

  <footer style="padding: var(--pad-m); border-block-start: var(--border-1);">
    <form class="chat-composer">
      <div class="input-group">
        <input type="text" placeholder="Message" />
        <button class="primary" type="submit">Send</button>
      </div>
    </form>
  </footer>
</section>
```

- Recommended classes: `chat-thread`, `chat-row`, `chat-row self`, `chat-message`, `bubble`, `chat-composer`
- Anti-pattern: avoid ad-hoc message layout wrappers when chat primitives already solve alignment and flow
