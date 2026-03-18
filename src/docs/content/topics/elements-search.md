---
id: search
title: Search Input
route: elements
order: 360
summary: Search input with icon positioned inside.
when_to_use: Search field with icon and compact action behavior.
classes:
  - .search
demos:
  - Search
tags:
  - elements
  - forms
---

## Basic Example

```html
<div class="search">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="currentColor"
    viewBox="0 0 256 256"
  >
    <path
      d="M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z"
    ></path>
  </svg>
  <input type="search" placeholder="Search..." />
</div>
```

## With Value

```html
<div class="search">
  <svg><!-- search icon --></svg>
  <input type="search" value="graffiti css" />
</div>
```

## Disabled

```html
<div class="search">
  <svg><!-- search icon --></svg>
  <input type="search" placeholder="Search..." disabled />
</div>
```

## Icon Source

Get icons from [Phosphor Icons](https://phosphoricons.com/). The magnifying glass icon shown above is the "MagnifyingGlass" icon.

## Styling Details

- Icon is absolutely positioned, vertically centered
- Input has left padding to accommodate the icon
- Icon color matches input text color
