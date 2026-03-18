---
id: input-group
title: Input Group
route: elements
order: 350
summary: Input field with connected button.
when_to_use: Input plus attached action button patterns.
classes:
  - .input-group
demos:
  - InputGroup
tags:
  - elements
  - forms
---

Use for copy-to-clipboard, search with button, URL sharing, or any input that needs an action.

## Basic Example

```html
<div class="input-group">
  <input type="text" value="https://example.com/share/abc123" readonly />
  <button>Copy</button>
</div>
```

## Search with Button

```html
<div class="input-group">
  <input type="search" placeholder="Search documentation..." />
  <button class="primary">Search</button>
</div>
```

## Code/Coupon Input

```html
<div class="input-group">
  <input type="text" placeholder="Enter code..." />
  <button class="success">Apply</button>
</div>
```

## Mini Button Variant

```html
<div class="input-group">
  <input type="text" value="some-value" />
  <button class="mini">Copy</button>
</div>
```

## Styling Details

- Input stretches to fill available space
- Button stays sized to content
- Connected with no gap, shared border-radius
- Works with all button variants (`.primary`, `.ghost`, etc.)
