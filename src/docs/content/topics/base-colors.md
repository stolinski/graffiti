---
id: colors
title: Colors
route: base
order: 120
summary: OKLCH palette scales, semantic color tokens, and adaptive foreground/background variables.
when_to_use: Defining theme color systems and contrast-safe UI surfaces.
classes:
  - --primary
  - --accent
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

Graffiti ships an OKLCH palette with generated `-1` through `-9` scales. Palette anchors and their reference scales are primitive/reference tokens; purpose-bound aliases and scales are global semantic tokens.

- Semantic colors (`--primary`, `--error`, `--warning`, `--success`) support scale variants.
- `--accent` defaults to `var(--primary)` and is the interactive-accent knob — checkbox/radio `accent-color` and the dropzone hover/dragover state read from it. Override `--accent` independently when the accent UI shouldn't follow the brand primary.
- Adaptive tokens (`--fg`, `--bg`) flip automatically for light and dark themes.
- Prefer global semantic tokens in app UI; reserve primitive/reference palette tokens for illustration-heavy surfaces and theme construction.
