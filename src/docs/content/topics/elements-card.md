---
id: card
title: Card
route: elements
order: 250
summary: Structured content container with optional header, body, and footer.
when_to_use: Structured content cards and linked card patterns.
classes:
  - .card
  - .card-body
  - .card.linked
  - .card.featured
demos:
  - Card
  - FeaturedCard
  - StatCard
  - FeatureCard
tags:
  - elements
  - containers
---

## Basic Card

```html
<article class="card">
  <header>
    <h3>Starter Plan</h3>
    <span class="tag">Popular</span>
  </header>
  <div class="card-body">
    <p>Everything you need to get started quickly.</p>
  </div>
  <footer>
    <button class="primary">Choose plan</button>
    <button class="ghost">Details</button>
  </footer>
</article>
```

## With Media

```html
<article class="card">
  <figure style="aspect-ratio: 16 / 9; background: var(--fg-05);"></figure>
  <header>
    <h3>Release notes</h3>
  </header>
  <div class="card-body">
    <p>Highlights from the latest update.</p>
  </div>
</article>
```

## Linked Card

Use `.card.linked` on an anchor for card-as-link patterns. It applies link-reset styles and an interactive affordance (hover/focus/active states):

```html
<a class="card linked" href="/docs/release-notes">
  <header>
    <h3>Release notes</h3>
  </header>
  <div class="card-body">
    <p>Read what changed in the latest update.</p>
  </div>
</a>
```

## Notes

- `.card` applies border, radius, shadow, and clips media.
- Direct `header` and `footer` get padding and separators.
- Use `.card-body`, `main`, or `section` for padded content.
