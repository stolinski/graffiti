# Canonical Snippets

Use these snippets as first-choice building blocks for critical patterns.

Rules:

- Start from these snippets when the user asks for the same pattern.
- Change content, IDs, and minor token overrides as needed, but keep primitive structure.
- Do not recreate these patterns with bespoke wrappers/CSS if the canonical primitive already fits.

## 1) Native Dialog + `.close`

Source:

- `src/docs/content/topics/elements-dialog.md`
- `src/docs/content/topics/ui-blocks-confirm-dialog.md`

```html
<button commandfor="my-dialog" command="show-modal">Open Dialog</button>

<dialog id="my-dialog">
  <button class="close" commandfor="my-dialog" command="close">x</button>
  <p>You can put anything in a dialog.</p>
</dialog>
```

## 2) Linked Card

Source:

- `src/docs/content/topics/elements-card.md`

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

## 3) Chat Thread + Bubble Rows

Source:

- `src/docs/content/topics/elements-bubble.md`

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

- `src/docs/content/topics/ui-blocks-forms.md`

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

- `src/docs/content/topics/elements-input-group.md`

```html
<div class="input-group" style="max-width: 420px;">
  <input type="email" placeholder="you@example.com" />
  <button class="primary" type="button">Subscribe</button>
</div>
```

## 6) Callout Variants

Source:

- `src/docs/content/topics/elements-callout.md`

```html
<div class="callout">Default callout for general information.</div>
<div class="callout warning">Warning callout for important notices.</div>
<div class="callout error">Error callout for critical issues.</div>
<div class="callout success">Success callout for confirmations.</div>
```
