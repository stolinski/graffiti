---
id: tooltip
title: Tooltip
route: elements
order: 320
summary: Non-interactive help shown on pointer hover and trigger focus. No JavaScript required.
when_to_use: Brief supplemental descriptions that do not contain controls or essential information.
classes:
  - .tip
  - .tooltip
  - .tooltip-trigger
  - .tooltip-content
  - .bottom
  - .left
  - .right
demos:
  - Tooltip
tags:
  - elements
  - overlays
---

Graffiti has one accessible tooltip contract and one decorative shorthand. Use the explicit rich pattern for supplemental help. Use the pseudo pattern only to visually repeat an icon control's accessible name.

## Accessible Rich Tooltip

The trigger must be focusable, keep its normal accessible name, and reference the tooltip by `id` through `aria-describedby`. The tip must use `role="tooltip"`.

```html
<span class="tooltip">
  <span class="tooltip-trigger">
    <button aria-describedby="save-tip">Save</button>
  </span>
  <span class="tooltip-content" id="save-tip" role="tooltip">
    Saves to your local draft folder.
  </span>
</span>
```

The trigger's accessible name remains "Save" and the tooltip supplies its description. The hidden tip uses `visibility: hidden`, so its `role="tooltip"` node does not sit in the normal accessibility-tree reading order. `aria-describedby` still lets assistive technology expose the text as the trigger's description; that relationship is intentional.

Rich means formatted, non-interactive text such as `strong`, `code`, or multiple lines. A tooltip must not contain links, buttons, inputs, or other controls. Use a popover or disclosure when users need to interact with the revealed content.

Position modifiers go on the wrapper:

```html
<span class="tooltip bottom">
  <span class="tooltip-trigger">
    <button aria-describedby="delete-tip">Delete</button>
  </span>
  <span class="tooltip-content" id="delete-tip" role="tooltip"
    >Permanently deletes the draft.</span
  >
</span>
```

## Decorative Pseudo Tooltip

For an icon-only control, `.tip[data-tooltip]` can visually repeat the control's explicit accessible name without using that naming attribute as CSS content:

```html
<button class="tip" aria-label="Save to draft" data-tooltip="Save to draft">
  <svg aria-hidden="true">...</svg>
</button>
```

`data-tooltip` is presentational and must exactly match the control's accessible name. It is not an accessible name or description, and the generated pseudo-element does not use `role="tooltip"`. Do not put `aria-label` on a control that already has visible text; that can replace its visible name for screen-reader users. Use the rich pattern when a visible-label control needs supplemental help.

Position modifiers (`bottom`, `left`, `right`) go on the icon control for this pseudo pattern.

## Activation and Dismissal

- Pointer hover and trigger focus reveal the same text; pointer exit and focus exit hide it.
- Focus stays on the trigger. The tooltip itself is never focusable and has `pointer-events: none`.
- Decks may render controlled state with `.open`, `data-state="open"`, or `data-state="closed"`; these produce the same visual states as pointer/focus activation.
- `--tooltip-offset`, `--tooltip-show-delay`, and `--tooltip-hide-delay` are registered override tokens for per-instance geometry and timing.
- Essential instructions must also appear persistently in the interface. A tooltip is supplemental only.
- Graffiti's zero-JavaScript CSS cannot make Escape clear `:hover` or `:focus-within`. Pressing Escape therefore does not dismiss a tooltip while the pointer or focus remains on its trigger. If Escape dismissal is required because the tip can obscure other content, add an application-level keyboard enhancement or use a native popover/disclosure pattern instead.

## Styling Details

- Uses CSS anchor positioning (`anchor-scope`, `position-anchor`, `position-area`) with `.tooltip-trigger` as the canonical anchor
- Background: `var(--bg)`
- Border: `var(--border-1)`
- Shadow: `var(--shadow-3)`
- Max width: `30ch` (wraps longer text)
- Shows on `:hover` and `:focus-visible` / `:focus-within`
- Uses `visibility: hidden` while closed so rich tooltip nodes do not create stray reading-order content
- Smooth opacity transition (`var(--d-fast)` / `var(--ease-smooth)`)

## Migration from `aria-label`-Driven Pseudo Tips

`.tip[aria-label]` no longer generates visible content. For icon-only controls, keep the naming `aria-label` and add an identical `data-tooltip`. For controls with visible text, remove any replacement `aria-label` and use `.tooltip-trigger` plus `.tooltip-content` when supplemental help is needed. The previous rich `.tip` child remains a compatibility alias during the migration, but new Decks output uses `.tooltip-content`. Existing rich tips must add `role="tooltip"`, a unique `id`, and the trigger's matching `aria-describedby`; move interactive content to `.popover` or a disclosure.
