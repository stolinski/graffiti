---
id: variables
title: CSS Variables
route: base
order: 110
summary: Core spacing, radius, border, padding, line-height, and shadow tokens.
when_to_use: Theme-safe design tokens for consistent spacing, shape, and elevation.
classes:
  - --vs-*
  - --pad-*
  - --br-*
  - --border-*
  - --shadow-*
demos:
  - SpacingScale
  - BorderRadiusScale
  - BorderScale
  - PaddingScale
  - LineHeightScale
  - ShadowScale
tags:
  - base
  - tokens
---

These tokens define the core spacing and surface system used by components and utilities.

- Spacing: `--vs-*` for vertical rhythm and `--pad-*` for interior padding.
- Shape: `--br-*` for corner radii and `--border-*` for border styles.
- Type rhythm: `--lh-*` for line-height adjustments.
- Elevation: `--shadow-*` and `--box` for layered depth.

Use tokens first, then compose utilities/components on top to keep custom themes consistent.
