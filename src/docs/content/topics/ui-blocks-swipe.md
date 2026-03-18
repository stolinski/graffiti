---
id: swipe
title: Swipe
route: ui-blocks
order: 180
summary: Horizontal swipe-to-reveal component using CSS scroll-snap.
when_to_use: Swipe-to-reveal row actions for touch interactions.
classes:
  - .swipe
  - .stop
demos:
  - Swipe
tags:
  - ui-blocks
  - mobile
---

Reveal action buttons by swiping left or right.

## Basic Example

```html
<div class="swipe">
  <button class="error">Delete</button>
  <div>Swipeable content</div>
  <button class="success">Archive</button>
</div>
```

## Stop Variant

Stays in "open" position after swiping:

```html
<div class="swipe stop">
  <button class="error">Delete</button>
  <div>Swipe to reveal, stays open</div>
  <button class="success">Archive</button>
</div>
```

## Structure

```
[Left actions] [Main content] [Right actions]
```

- First child = left action
- Second child = main visible content
- Third child = right action

## Styling Details

- CSS scroll-snap for smooth snapping
- Three-column layout
- Hidden scrollbar
- Container query for center content width

## JavaScript for Events (Optional)

```javascript
const swipe = document.querySelector(".swipe");

// Detect when actions are revealed
swipe.addEventListener("scroll", () => {
  const scrollLeft = swipe.scrollLeft;
  const maxScroll = swipe.scrollWidth - swipe.clientWidth;

  if (scrollLeft === 0) {
    // Left actions visible
  } else if (scrollLeft === maxScroll) {
    // Right actions visible
  } else {
    // Centered (default)
  }
});
```
