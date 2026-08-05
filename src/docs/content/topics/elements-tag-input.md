---
id: tag-input
title: Tag Input
route: elements
order: 195
summary: Multi-value input frame composed from tags, a combobox input, and a listbox.
when_to_use: Adding and removing several short values such as labels, recipients, or filters.
classes:
  - .tag-input
  - .tag
  - .listbox
  - .option
demos:
  - TagInput
tags:
  - elements
  - forms
---

`.tag-input` contains existing `.tag` values and one borderless text or combobox input. Each removal control needs a value-specific accessible label. Decks owns tokenization, duplicate prevention, Backspace behavior, selection, and announcements.

```html
<div class="tag-input">
  <span class="tag">CSS <button aria-label="Remove CSS">×</button></span>
  <input role="combobox" aria-controls="tag-options" aria-label="Add tag" />
</div>
<div id="tag-options" class="listbox" role="listbox">…</div>
```

The frame exposes focus-within, invalid, and disabled visuals. Keep the source-order input reachable after existing tags. Do not make an entire tag removable without a dedicated focusable control.
