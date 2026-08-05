---
id: popover
title: Popover
route: ui-blocks
order: 205
summary: Generic interactive popover using the native Popover API and CSS anchor positioning.
when_to_use: Rich revealed content containing links, controls, or forms that would be invalid inside a tooltip.
classes:
  - .popover-anchor
  - .popover
  - .end
  - .top
  - .left
  - .right
demos:
  - Popover
tags:
  - ui-blocks
  - overlays
---

`.popover-anchor` creates a local anchor scope. Its direct `popovertarget` trigger names that anchor, and a sibling `.popover[popover]` attaches below it without per-instance positioning styles.

```html
<span class="popover-anchor">
  <button popovertarget="profile-popover">Profile</button>
  <aside id="profile-popover" class="popover end" popover>
    <a href="/profile">Open profile</a>
  </aside>
</span>
```

The default placement is block-end aligned to inline-start. Add `.end`, `.top`, `.left`, or `.right` to the popover. Keep `popover="auto"` for light dismissal; use `manual` only when Decks explicitly owns dismissal. A popover may contain interactive content. A tooltip may not.
