---
id: segmented-control
title: Segmented Control
route: elements
order: 185
summary: Mutually exclusive compact choices backed by native radio inputs.
when_to_use: Switching one local view or mode when every option can be named with a short label.
classes:
  - .segmented-control
  - .compact
  - .full
demos:
  - SegmentedControl
tags:
  - elements
  - forms
---

Use a `fieldset` with a real `legend`. Each direct `label` contains one radio. The radios retain their shared `name`, form value, arrow-key behavior, and validation semantics; Graffiti only changes their presentation.

```html
<fieldset class="segmented-control">
  <legend class="visually-hidden">Project view</legend>
  <label><input type="radio" name="view" value="list" /> List</label>
  <label><input type="radio" name="view" value="board" checked /> Board</label>
</fieldset>
```

- `.compact` tightens the labels for dense toolbars.
- `.full` makes equal segments fill the available inline size.
- Checked, focus-visible, hover, and disabled states derive from the nested native input. Do not replace the radios with manually synchronized buttons.
