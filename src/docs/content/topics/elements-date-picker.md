---
id: date-picker
title: Date Picker and Calendar
route: elements
order: 200
summary: Native date input first, with an enhanced anchored calendar surface when product requirements exceed the platform picker.
when_to_use: Date entry, date selection, or range workflows that need either native browser UI or Decks-owned calendar behavior.
classes:
  - .date-picker
  - .calendar
  - .calendar-header
  - .calendar-grid
  - .calendar-day
demos:
  - DatePicker
tags:
  - elements
  - forms
---

Start with a labeled native input:

```html
<label class="date-picker">Due date <input type="date" name="due" /></label>
```

Only add an enhanced `.calendar[popover]` for range selection, unavailable dates, or product-specific month navigation. `.date-picker` anchors the trigger. `.calendar-header` contains previous/title/next controls. `.calendar-grid` remains a semantic table, and each `.calendar-day` is a button.

Use `aria-current="date"` for today, `aria-pressed` or `data-selected` for selection, `data-range-start` / `data-range-end` for range endpoints, `.outside` for adjacent-month dates, and native `disabled` for unavailable dates. Decks owns localized labels, roving focus, Page Up/Down, Home/End, month arithmetic, and focus return.
