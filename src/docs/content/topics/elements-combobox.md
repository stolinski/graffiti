---
id: combobox
title: Combobox and Listbox
route: elements
order: 190
summary: Visual contracts for enhanced text selection, listbox popups, and option states.
when_to_use: Filtering and selecting from a choice set when a native select or datalist cannot meet the interaction requirements.
classes:
  - .combobox
  - .listbox
  - .option
demos:
  - ComboboxListbox
tags:
  - elements
  - forms
---

Decks owns filtering, `aria-expanded`, `aria-controls`, `aria-activedescendant`, active-option movement, selection, Escape, and focus return. Graffiti expects this structure:

```html
<div class="combobox" aria-expanded="true">
  <label for="owner">Owner</label>
  <input
    id="owner"
    role="combobox"
    aria-controls="owner-list"
    aria-expanded="true"
  />
  <div id="owner-list" class="listbox" role="listbox">
    <button class="option" role="option" aria-selected="true">Ada</button>
  </div>
</div>
```

Use `data-active="true"` for the active-descendant row, `aria-selected` for committed selection, and `aria-disabled` for unavailable options. Add `popover` to `.listbox` when it should use the top layer; otherwise Decks may toggle `hidden`, `.open`, or `data-state`. Prefer native `<select>` for finite non-searchable choices and `<datalist>` when its browser-provided behavior is sufficient.
