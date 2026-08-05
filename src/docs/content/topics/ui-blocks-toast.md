---
id: toast
title: Toast
route: ui-blocks
order: 215
summary: Shallow notification viewport, item, toast, optional progress, tone, and placement contracts.
when_to_use: Brief asynchronous feedback that should not interrupt the current task.
classes:
  - .toast-viewport
  - .toast-item
  - .toast
  - .toast-progress
demos:
  - Toast
tags:
  - ui-blocks
  - feedback
---

Decks owns the queue, live-region urgency, timeouts, pause/resume, insertion, and removal. The canonical public authoring surface is `.toast-viewport`, `.toast-item`, `.toast`, and optional `.toast-progress`. New toast markup stays shallow and class-light.

A persistent toast has no progress indicator and remains visible until the consumer or dismiss control hides it:

```html
<div id="notifications" class="toast-viewport bottom-end" popover="manual">
  <div class="toast-item">
    <article class="toast" role="status" aria-atomic="true">
      <strong>Draft saved</strong>
      <p>Your changes are synced.</p>
      <button
        type="button"
        popovertarget="notifications"
        popovertargetaction="hide"
        aria-label="Dismiss draft saved notification"
      >
        ×
      </button>
    </article>
  </div>
</div>
```

The modern visual contract is a neutral, configurable surface with elevation. It has no default border or accent marker. Tone modifiers are `.info`, `.success`, `.warning`, and `.error`; each sets `--toast-tone`, which colors optional tracked progress by default without recoloring the surface. Use `role="status"` for info/success. Reserve `role="alert"` for urgent warning/error.

A timed semantic toast includes `.toast-progress` and sets `--toast-duration` to the same duration as its real auto-dismiss timer:

```html
<div
  id="upload-notifications"
  class="toast-viewport bottom-end"
  popover="manual"
>
  <div class="toast-item">
    <article
      class="toast success"
      role="status"
      aria-atomic="true"
      style="--toast-duration: 5s"
    >
      <strong>Upload complete</strong>
      <p>Your file is ready.</p>
      <button
        type="button"
        popovertarget="upload-notifications"
        popovertargetaction="hide"
        aria-label="Dismiss upload complete notification"
      >
        ×
      </button>
      <span class="toast-progress" aria-hidden="true"></span>
    </article>
  </div>
</div>
```

The progress indicator is decorative and tracks `--toast-duration`; it does not provide the timer. Add `data-paused="true"` to `.toast-progress` whenever the matching dismissal timer is paused. Under reduced motion, the countdown stops and toast visibility and movement transitions become effectively immediate. Omit `.toast-progress` for persistent or manually dismissed notifications.

Adding `popover="manual"` gives the viewport native top-layer visibility. Closed popover viewports stay hidden until opened. Placement modifiers are `.top-start`, `.top-center`, `.top-end`, `.bottom-start`, `.bottom-center`, and `.bottom-end`; they use logical insets and safe-area tokens. Omitting `popover` remains valid for application-controlled stacks.

Consuming component inputs map to Graffiti output rather than requiring a particular framework implementation:

| Consumer concern | Graffiti output                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Placement        | A viewport modifier, or `data-inline="start\|center\|end"` with `data-block="start\|end"` on `.toast-viewport`            |
| Tone             | `.info`, `.success`, `.warning`, or `.error` on `.toast`                                                                  |
| Progress         | Presence or absence of a direct `.toast-progress` child                                                                   |
| Duration         | `--toast-duration` on `.toast`, synchronized with the consumer's dismissal timeout                                        |
| Dismissible      | A direct native `button[popovertargetaction="hide"]` targeting the viewport's `id`; omit it when dismissal is unavailable |
| Surface/config   | Public custom properties applied to the viewport or toast                                                                 |

Public controls are grouped by purpose:

- **Viewport geometry:** `--toast-width`, `--toast-offset`.
- **Surface and spacing:** `--toast-bg`, `--toast-border`, `--toast-radius`, `--toast-shadow`, `--toast-padding-block`, `--toast-padding-inline`, `--toast-gap`.
- **Typography:** `--toast-fg`, `--toast-muted`, `--toast-font-size`, `--toast-line-height`, `--toast-title-weight`.
- **Tone and progress:** `--toast-tone`, `--toast-progress-color`, `--toast-progress-track`, `--toast-progress-size`, `--toast-duration`.

An optional direct action composes the existing button system rather than introducing toast-owned styling. For example, add `<button class="mini minimal" type="button">Undo</button>`, or choose another documented button variant when the action needs different emphasis. Do not wrap or stretch the action to the toast width.

`.toast-header`, `.toast-body`, `.toast-actions`, and `.toast-dismiss` remain compatibility selectors for existing consumers, but new markup does not need them.
