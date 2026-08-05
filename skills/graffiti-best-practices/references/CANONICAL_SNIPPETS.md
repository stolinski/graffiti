# Canonical Snippets

Use these snippets as first-choice building blocks for critical patterns.

Rules:

- Start from these snippets when the user asks for the same pattern.
- Change content, IDs, and minor token overrides as needed, but keep primitive structure.
- Do not recreate these patterns with bespoke wrappers/CSS if the canonical primitive already fits.

## 1) Native Dialog + `.close`

Source:

- `https://graffiti-ui.com/elements` (markdown, dialog section)
- `https://graffiti-ui.com/ui-blocks` (markdown, confirm dialog section)

```html
<button commandfor="my-dialog" command="show-modal">Open Dialog</button>

<dialog id="my-dialog">
  <button class="close" commandfor="my-dialog" command="close">x</button>
  <p>You can put anything in a dialog.</p>
</dialog>
```

## 2) Linked Card

Source:

- `https://graffiti-ui.com/elements` (markdown, card section)

```html
<a class="card linked" href="/docs/release-notes">
  <header>
    <h3>Release notes</h3>
  </header>
  <div class="card-body">
    <p>Read what changed in the latest update.</p>
  </div>
</a>
```

Intent boundary:

- Use for record-like preview units where the whole card is one link destination.
- Do not use as a generic page/section wrapper.

## 3) Chat Thread + Bubble Rows

Source:

- `https://graffiti-ui.com/elements` (markdown, bubble/chat section)

```html
<section class="chat-thread">
  <div class="chat-row">
    <article class="chat-message bubble">Assistant message</article>
  </div>

  <div class="chat-row self">
    <article
      class="chat-message bubble"
      style="--bubble-bg: var(--primary-1); --bubble-border: var(--primary-5);"
    >
      User message
    </article>
  </div>
</section>
```

## 4) Form Option Rows + Form Actions

Source:

- `https://graffiti-ui.com/ui-blocks` (markdown, forms section)

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

<div class="form-actions">
  <button class="ghost" type="button">Cancel</button>
  <button class="primary" type="submit">Save changes</button>
</div>
```

## 5) Input Group

Source:

- `https://graffiti-ui.com/elements` (markdown, input-group section)

```html
<div class="input-group" style="max-width: 420px;">
  <input type="email" placeholder="you@example.com" />
  <button class="primary" type="button">Subscribe</button>
</div>
```

## 6) Callout Variants

Source:

- `https://graffiti-ui.com/elements` (markdown, callout section)

```html
<div class="callout">Default callout for general information.</div>
<div class="callout warning">Warning callout for important notices.</div>
<div class="callout error">Error callout for critical issues.</div>
<div class="callout success">Success callout for confirmations.</div>
```

## 7) Accessible Tooltip

Source:

- `https://graffiti-ui.com/elements` (markdown, tooltip section)
- `docs/adr/0015-accessible-tooltip-semantics.md`

```html
<span class="tooltip">
  <button aria-describedby="save-tip">Save</button>
  <span class="tip" id="save-tip" role="tooltip">
    Saves to your local draft folder.
  </span>
</span>
```

Intent boundary:

- Keep tooltip content non-interactive and supplemental. Use a popover or disclosure for links and controls.
- The trigger must remain focusable and retain its normal accessible name.
- For an icon-only decorative pseudo tip, use identical `aria-label` and `data-tooltip` values. Never generate pseudo content from `aria-label`, and never put a replacement `aria-label` on a visible-label control.
- CSS-only tooltips dismiss on pointer or focus exit, not Escape while activation remains. Choose an enhanced pattern when Escape dismissal is required.
