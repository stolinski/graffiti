# Examples

These examples show expected skill behavior for common request types.

Each example follows the required response structure from `OUTPUT_CONTRACT.md`.

Code excerpts are intentionally partial; the actual response must still include all mandatory contract sections.

---

## Example 1: Build a Landing Hero Section

### Prompt

"Build a clean SaaS hero section with headline, subhead, and two CTAs using Graffiti classes only."

### Expected response shape

1. Intent and Constraints
2. System-First Preflight
3. Source Grounding
4. Primitive Mapping
5. Recipe Selection (`SECTION-MKT-001`)
6. Markup Output
7. Verification Checklist
8. Post-Edit Compliance Report
9. Known Limitations and Adaptation Path

### Markup excerpt

```html
<section class="section gradient-aurora">
  <div
    class="layout-readable center stack text-center"
    style="--gap: var(--vs-l);"
  >
    <span class="tag">Now in beta</span>
    <h1>Ship faster with less complexity</h1>
    <p class="text-muted narrow">
      Launch confidently with class-first UI patterns.
    </p>
    <div class="cluster center">
      <a href="#pricing" class="button primary">Start Free Trial</a>
      <a href="#features" class="button ghost">See Features</a>
    </div>
  </div>
</section>
```

---

## Example 2: Add Dashboard KPI Row

### Prompt

"Add a KPI row to my dashboard with four stats and trend tags."

### Expected recipe selection

- `LAYOUT-002` (dashboard shell)
- `SECTION-APP-002` (KPI stats)
- `COMP-004` (stat-card)

### Markup excerpt

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

---

## Example 3: Refactor Inline-Heavy Snippet

### Prompt

"Refactor this section to remove unnecessary inline styles and make it Graffiti-native."

### Expected behavior

- Detect AP-001/AP-002/AP-005
- Apply RT-001, RT-002, RT-005
- Keep only approved tokenized inline styles

### Before

```html
<div
  style="display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:1100px;margin:0 auto;"
>
  <h2 style="margin:0">Title</h2>
  <p style="margin:0;color:#666">Copy</p>
</div>
```

### After

```html
<div class="layout-readable center stack" style="--gap: var(--vs-m);">
  <h2>Title</h2>
  <p class="text-muted">Copy</p>
</div>
```

---

## Example 4: Build Blog Article + TOC Layout

### Prompt

"Create a blog article layout with a sticky table of contents sidebar and related posts section."

### Expected recipe selection

- `LAYOUT-003` (blog + toc shell)
- `SECTION-CONTENT-001` (article header)
- `SECTION-CONTENT-002` (related articles)
- `COMP-007` (`toc`)

### Markup excerpt

```html
<main class="layout-readable center" style="padding-block: var(--vs-xl);">
  <div class="layout-sidebar invert">
    <aside
      class="stack"
      style="--gap: var(--vs-l); align-self: start; position: sticky; top: var(--pad-xl);"
    >
      <nav class="toc" aria-label="Table of contents">
        <h4>On this page</h4>
        <ol>
          <li><a href="#intro" aria-current="true">Intro</a></li>
          <li><a href="#api">API Design</a></li>
        </ol>
      </nav>
    </aside>
    <article class="stack" style="--gap: var(--vs-m);">
      <h1 id="intro">Building Better Components</h1>
      <p class="text-muted">Long-form content goes here.</p>
    </article>
  </div>
</main>
```

---

## Example 5: Settings Preferences + Danger Zone

### Prompt

"Build a settings page section with notification toggles and a danger zone block."

### Expected recipe selection

- `SECTION-SET-002` (notification toggles)
- `SECTION-SET-003` (danger zone)
- `COMP-009` (toggle row)
- `COMP-008` (callout)

### Markup excerpt

```html
<fieldset
  class="stack"
  style="padding: 0; margin: 0; border: none; --gap: var(--vs-s);"
>
  <legend class="visually-hidden">Notification preferences</legend>
  <div class="box split" style="--gap: var(--vs-s);">
    <div class="stack" style="--gap: var(--vs-xs);">
      <label for="notif-email"><strong>Email notifications</strong></label>
      <p class="fs-xs text-muted">Receive activity updates.</p>
    </div>
    <input id="notif-email" class="toggle" type="checkbox" checked />
  </div>
</fieldset>

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
      <p class="text-muted">This action cannot be undone.</p>
      <button class="error" type="button">Delete Account</button>
    </div>
  </div>
</section>
```

---

## Example 6: Build Chat Thread + Composer

### Prompt

"Create a two-pane chat UI with conversation list and message composer."

### Expected recipe selection

- `LAYOUT-005` (AI chat shell)
- `SECTION-CHAT-001` and `SECTION-CHAT-002`
- `COMP-011` and `COMP-012`

### Markup excerpt

```html
<section
  class="app-shell surface"
  style="--app-shell-min-height: calc(100dvh - 6rem);"
>
  <main class="layout-sidebar wide" style="--layout-gap: 0;">
    <aside class="app-shell surface">...</aside>
    <section class="app-shell surface">
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
      <footer
        style="padding: var(--pad-m); border-block-start: var(--border-1);"
      >
        <form class="chat-composer">
          <div class="input-group">
            <input type="text" placeholder="Your message..." />
            <button class="primary" type="submit">Send</button>
          </div>
        </form>
      </footer>
    </section>
  </main>
</section>
```

---

## Example 7: Unknown Class Request

### Prompt

"Use the `metric-tile` and `badge-pill` classes for dashboard stats."

### Expected behavior

- Detect unknown class names (AP-007)
- Replace with nearest canonical classes (`stat-card`, `tag`)
- Report limitation and fallback in "Known Limitations and Adaptation Path"

### Correct fallback excerpt

```html
<article class="stat-card">
  <small>Deployments</small>
  <strong>184</strong>
  <span class="tag info">This week</span>
</article>
```

---

## Example 8: Ambiguous Prompt with Minimal Input

### Prompt

"Make this page better with Graffiti."

### Expected behavior

- Apply troubleshooting default: preserve semantics, reduce inline debt, improve layout composition
- Choose nearest known intent (for example content page)
- Explain assumptions briefly
- Return class-first rewrite + verification checklist

---

## Example 9: Template-First Pricing Customization

### Prompt

"Update the landing template pricing section to support annual billing copy and keep Pro highlighted."

### Expected behavior

- Resolve baseline template first: `https://graffiti-ui.com/templates/landing`
- Keep pricing section structure from baseline and customize plan copy/labels
- Preserve canonical `.card.featured` emphasized tier composition
- Report baseline path in "Recipe Selection" and checklist

### Correct approach excerpt

```html
<!-- Baseline: https://graffiti-ui.com/templates/landing -->
<section id="pricing" class="section surface">
  <div class="layout-readable center stack" style="--gap: var(--vs-xl);">
    <div class="layout-three-col" style="align-items: stretch;">
      <article class="card stack" style="--gap: 0;">...</article>
      <article class="card featured stack" style="--gap: 0;">...</article>
      <article class="card stack" style="--gap: 0;">...</article>
    </div>
  </div>
</section>
```
