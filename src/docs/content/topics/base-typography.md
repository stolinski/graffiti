---
id: typography
title: Typography
route: base
order: 100
summary: Fluid typography defaults that scale predictably across viewport and container sizes.
when_to_use: Default text hierarchy, heading utilities, and responsive type sizing.
classes:
  - h1
  - h2
  - h3
  - h4
  - h5
  - h6
  - .h1
  - .h2
  - .h3
  - .h4
  - .h5
  - .h6
  - .fs-xs
  - .fs-base
  - .fs-s
  - .fs-m
  - .fs-l
  - .fs-xl
  - .fs-xxl
  - .fs-xxxl
  - .fc
demos:
  - TypographyScale
tags:
  - base
  - typography
---

Graffiti type uses a fluid scale controlled by `--fl` and semantic heading classes.

- Use native `h1`-`h6` for document structure.
- Use `.h1`-`.h6` when non-heading elements need heading styling.
- Use `.fs-*` classes for size-only adjustments without changing semantic elements.
- Use `.fc` when typography should respond to container width.

Line-height tokens (`--lh-xs` through `--lh-xl`) are available for tighter or looser rhythm control.
