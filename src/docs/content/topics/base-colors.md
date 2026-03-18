---
id: colors
title: Colors
route: base
order: 120
summary: OKLCH palette scales, semantic color tokens, and adaptive foreground/background variables.
when_to_use: Defining theme color systems and contrast-safe UI surfaces.
classes:
  - --primary
  - --error
  - --warning
  - --success
  - --fg
  - --bg
demos:
  - ColorScales
  - ThemingVariables
tags:
  - base
  - colors
---

Graffiti ships an OKLCH palette with generated `-1` through `-9` scales and semantic aliases.

- Semantic colors (`--primary`, `--error`, `--warning`, `--success`) support scale variants.
- Adaptive tokens (`--fg`, `--bg`) flip automatically for light and dark themes.
- Prefer semantic tokens in app UI; reserve raw palette tokens for illustration-heavy surfaces.
