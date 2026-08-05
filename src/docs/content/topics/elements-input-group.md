---
id: input-group
title: Input Group
route: elements
order: 350
summary: Input field with connected button.
when_to_use: Input plus attached action button patterns.
classes:
  - .input-group
  - .affix
  - .input-group.stack-mobile
demos:
  - InputGroup
  - InputGroupAffix
  - Select
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

## Static Affixes

Add an inert `.affix` child for a leading currency symbol or a trailing unit. The affix shares the input's fill, hairline border, and radius so the seam reads as one continuous control. It is non-interactive (`pointer-events: none`, `user-select: none`) — purely a visual adornment, with the real value living in the input.

- Use a leading `.affix` as the first child for symbols like `$` or `€`.
- Use a trailing `.affix` as the last child for units like `kg`, `%`, or `USD`.
- You can combine both around a single input.
- Pair with `type="number"` plus `inputmode` so mobile keyboards match the expected entry.

```html
<div class="input-group">
  <span class="affix">$</span>
  <input type="number" inputmode="decimal" placeholder="0.00" />
</div>
```

```html
<div class="input-group">
  <input type="number" inputmode="numeric" placeholder="Weight" />
  <span class="affix">kg</span>
</div>
```

```html
<div class="input-group">
  <span class="affix">$</span>
  <input type="number" inputmode="decimal" placeholder="0.00" />
  <span class="affix">USD</span>
</div>
```

## Stack on Mobile

Add `.stack-mobile` to break the group into a vertical stack below `640px`. Each child reclaims a full border-radius so the input and button read as separate controls.

```html
<div class="input-group stack-mobile">
  <input type="email" placeholder="you@example.com" />
  <button class="primary">Subscribe</button>
</div>
```

## Styling Details

- Input stretches to fill available space
- Button stays sized to content
- Connected with no gap, shared border-radius
- Works with all button variants (`.primary`, `.ghost`, etc.)
