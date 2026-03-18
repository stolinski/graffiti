---
id: pagination
title: Pagination
route: ui-blocks
order: 120
summary: Card footer style pagination with previous/next controls and current page state.
when_to_use: Paginated result navigation with previous and next controls.
classes:
  - .pagination
demos:
  - Pagination
tags:
  - ui-blocks
  - navigation
---

## Basic Example

Uses `.button.ghost` for pagination controls:

```html
<nav class="pagination" aria-label="Pagination">
  <a class="button ghost" href="/page/1" aria-disabled="true">Previous</a>
  <ul>
    <li><a class="button ghost" href="/page/1">1</a></li>
    <li><a class="button ghost" href="/page/2" aria-current="page">2</a></li>
    <li><a class="button ghost" href="/page/3">3</a></li>
    <li><a class="button ghost" href="/page/4">4</a></li>
  </ul>
  <a class="button ghost" href="/page/3">Next</a>
</nav>
```

## Card Footer Pattern

Use inside a card or box with a top border footer feel:

```html
<div class="box">
  <div>
    <h4>Results</h4>
    <p>Showing 1-20 of 120</p>
  </div>
  <nav class="pagination" aria-label="Pagination">
    <a class="button ghost" href="/page/1" aria-disabled="true">Previous</a>
    <ul>
      <li><a class="button ghost" href="/page/1">1</a></li>
      <li><a class="button ghost" href="/page/2" aria-current="page">2</a></li>
      <li><a class="button ghost" href="/page/3">3</a></li>
    </ul>
    <a class="button ghost" href="/page/3">Next</a>
  </nav>
</div>
```

## Current Page

Use `aria-current="page"` on the active page link:

```html
<a class="button ghost" href="/page/2" aria-current="page">2</a>
```

## Disabled States

Use `aria-disabled="true"` on Previous/Next at boundaries:

```html
<a class="button ghost" href="/page/1" aria-disabled="true">Previous</a>
```

## Styling Details

- `.pagination` handles layout only (flex, gap, border-top)
- Buttons use existing `.button.ghost` styles
- Page number buttons in `ul` get fixed 2rem square sizing
- Current page uses primary border and stronger text
- Border-top and padding give card footer feel

## Accessibility

- Use `aria-label="Pagination"` on the `<nav>`
- Use `aria-current="page"` on the active page link
- Use `aria-disabled="true"` for disabled controls
