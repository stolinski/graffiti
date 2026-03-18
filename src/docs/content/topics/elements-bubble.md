---
id: bubble
title: Bubble
route: elements
order: 260
summary: Chat-friendly message container with configurable colors, width, and spacing.
when_to_use: Chat message presentation and conversation snippets.
classes:
  - .bubble
  - .chat-thread
  - .chat-row
  - .chat-row.self
  - .chat-message
  - .chat-composer
demos:
  - Bubble
tags:
  - elements
  - chat
---

`.bubble` uses a rounded fallback shape and upgrades to squircle corners in browsers that support `corner-shape`.

## Basic Usage

```html
<article class="bubble">Assistant message with default bubble tokens.</article>
```

## Sender Variants with CSS Variables

```html
<article class="bubble">Assistant response bubble.</article>

<article
  class="bubble"
  style="--bubble-bg: var(--primary-1); --bubble-border: var(--primary-5);"
>
  User message bubble.
</article>
```

## Multi-Element Content

```html
<article class="bubble">
  <h5>Deployment status</h5>
  <p>Build finished in 43s and staging is ready for QA.</p>
</article>
```

## Chat Layout Helpers

Use these helpers to build complete chat threads:

- `.chat-thread` - Vertical message stack with configurable spacing/padding
- `.chat-row` - Left-aligned row
- `.chat-row.self` - Right-aligned row
- `.chat-message` - Width-constrained wrapper for each message
- `.chat-composer` - Composer row where `.input-group` expands to fill space

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

<footer class="chat-composer">
  <button class="circle" type="button">+</button>
  <div class="input-group">
    <input type="text" placeholder="Message..." />
    <button class="primary" type="button">Send</button>
  </div>
</footer>
```

## CSS Variables

- `--bubble-bg` - Bubble background color
- `--bubble-border` - Bubble border color
- `--bubble-max-inline` - Max bubble width
- `--bubble-pad-block` - Block-axis padding
- `--bubble-pad-inline` - Inline-axis padding
- `--bubble-radius` - Fallback rounded corner radius
- `--bubble-flow-space` - Spacing between child elements
