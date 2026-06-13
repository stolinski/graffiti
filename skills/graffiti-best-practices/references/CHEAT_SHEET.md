# Cheat Sheet — "I want X" → "use Y"

Skip the preflight when the need is unambiguous. Use this as a fast pointer to the canonical Graffiti answer; fall back to the full skill workflow when the request is anything more than a primitive lookup.

This file is **fast index, not policy**. If a row here conflicts with `OUTPUT_CONTRACT.md` / `COMPONENT_INTENT_MATRIX.md` / `GRAFFITI_SYSTEM.md`, those files win.

---

## Role-First Selection (run this BEFORE picking a wrapper)

If you're about to type `<div class="box">` or `<div class="stack">` for any non-trivial content, stop and walk this list first. Stop at the first match.

| The content is…                                            | Use                                                                 |
| ---------------------------------------------------------- | ------------------------------------------------------------------- |
| A KPI / metric (label + value + delta)                     | `<article class="stat-card">`                                       |
| A feature-list entry (icon + heading + short blurb)        | `<article class="feature-card">`                                    |
| A repeating record (article, plan, product, post preview)  | `<article class="card">` / `.card.featured` / `.card.linked`        |
| A notice / inline message                                  | `.callout` + semantic variant                                       |
| A chat message turn                                        | `.chat-thread` + `.chat-row` + `.bubble`                            |
| A tool call / activity log entry                           | `.log-card`                                                         |
| A confirm / modal surface                                  | `<dialog>` + `.close`                                               |
| A disclosure (Q&A, settings group)                         | `<details class="bordered">` + `<summary>`                          |
| A form field row (label + input + help)                    | `<div class="row">` inside `<form>` / `<fieldset>`                  |
| A submit/cancel row                                        | `<div class="form-actions">`                                        |
| A checkbox/radio option                                    | `<label class="form-option-row">`                                   |
| An input glued to one button                               | `<div class="input-group">`                                         |
| A multi-line message composer with toolbar                 | `<form class="composer">`                                           |
| An in-page TOC                                             | `<nav class="toc">`                                                 |
| A narrow vertical icon-only nav rail                       | `.icon-rail`                                                        |
| A secondary inspector/workbench pane                       | `.workbench-panel` inside `.layout-rail.with-workbench`             |
| A selectable pill / filter / suggestion                    | `<button class="chip">` + `aria-pressed`                            |
| A status / category label                                  | `.tag` (semantic variant first)                                     |
| A pull quote (long-form)                                   | `<blockquote class="pull-quote">`                                   |
| A section eyebrow / overline                               | `<p class="eyebrow">`                                               |
| **None of the above (truly neutral spacing/wrapping)**     | Then — and only then — reach for `.box` / `.stack` / `.cluster` / `.split` / `.surface` |

---

## Layout — wrappers and shells

| Want                                                       | Class / pattern                                                     |
| ---------------------------------------------------------- | ------------------------------------------------------------------- |
| Reading-width body container (~65ch, centered)             | `.layout-readable.center`                                           |
| Full app shell with sidebar                                | `.layout-sidebar.fill` (+ `.wide` / `.narrow` / `.invert`)          |
| App shell with sticky header + main + footer               | `.app-shell` (`> header / main / footer`)                           |
| 3-col app shell with icon rail + sidebar + main            | `.layout-rail` (+ `.with-workbench` for 4th pane)                   |
| Responsive 3-column content                                | `.layout-three-col`                                                 |
| Card grid that auto-fits                                   | `.layout-card` + `--min-card-width`                                 |
| Vertical rhythm container                                  | `.stack` + `--gap: var(--vs-*)`                                     |
| Horizontal row that wraps                                  | `.cluster` + `--gap`                                                |
| Split row (start + end items)                              | `.split` (use `.center` for vertical centering)                     |
| Neutral surface (subtle background panel)                  | `.surface` (set `--surface-bg` to vary)                             |
| Neutral wrapper with padding + radius                      | `.box`                                                              |
| Escape the reading column for a full-bleed hero            | `.full-bleed` inside `.layout-readable`                             |

When the user says "container", "wrapper", "section" without a role: default to `.box` or `.surface`, never `.card`.

---

## Content units

| Want                                                       | Class / pattern                                                     |
| ---------------------------------------------------------- | ------------------------------------------------------------------- |
| Article / product / plan card (repeating unit)             | `<article class="card">`                                            |
| The featured tier in a pricing comparison                  | `<article class="card featured">`                                   |
| Whole card is one link                                     | `<a class="card linked" href="...">`                                |
| Marketing feature-list item with short copy                | `<article class="feature-card">`                                    |
| KPI / metric readout (label + value + delta)               | `<article class="stat-card">`                                       |
| Pull quote (long-form)                                     | `<blockquote class="pull-quote">`                                   |
| Compact log entry (tool call, deploy, activity)            | `.log-card` (with mono `.label`, optional `<pre>` body)             |
| Section eyebrow / tracked-caps label                       | `<p class="eyebrow">` (or use `.text-caps` / `<small>` per theme)   |

---

## Messages, status, notices

| Want                                                       | Class / pattern                                                     |
| ---------------------------------------------------------- | ------------------------------------------------------------------- |
| Inline info notice                                         | `.callout`                                                          |
| Inline warning / error / success / ghost notice            | `.callout.warning` / `.error` / `.success` / `.ghost`               |
| Tinted-fill notice variant                                 | `.callout.fill` (combine with semantic variant)                     |
| Citation / footnote / numbered reference                   | `<a class="callout">` + numeric badge as first child                |
| Status pill (success / warning / error / info)             | `.tag.success` / `.warning` / `.error` / `.info`                    |
| Category chip (single category color, non-status)          | `.tag` with `--tag-color` override                                  |
| Selectable pill / filter chip                              | `.chip` (+ `aria-pressed="true"` for selected)                      |
| Follow-up suggestion row                                   | `.cluster` of `<button class="chip">`                               |
| Unread / count badge                                       | `.tag` or themed `.badge` (e.g. theme-signal)                       |

---

## Chat surfaces

| Want                                                       | Class / pattern                                                     |
| ---------------------------------------------------------- | ------------------------------------------------------------------- |
| Conversation transcript                                    | `<section class="chat-thread">`                                     |
| Single message row (left / right)                          | `<div class="chat-row">` / `.chat-row.self`                         |
| Bubble                                                     | `<article class="chat-message bubble">`                             |
| User bubble color                                          | `--bubble-bg`, `--bubble-border` on the bubble                      |
| "Assistant is thinking" placeholder                        | `.bubble.thinking` (dashed italic)                                  |
| Streaming generation cursor                                | `.bubble.streaming` (caret animates via @keyframes)                 |
| Bubble-less reading-style thread                           | `<section class="chat-thread flowing">` with `> .turn > .who / .body` |
| Composer (multi-line + toolbar)                            | `<form class="composer">` (`> textarea`, `> .toolbar`)              |
| Simple single-line composer                                | `.input-group` + `<button class="primary">`                         |
| Tool call / function invocation                            | `.log-card` (mono label, status, optional `<pre>`)                  |

---

## Forms

| Want                                                       | Class / pattern                                                     |
| ---------------------------------------------------------- | ------------------------------------------------------------------- |
| Form field row (label + input + help)                      | `<div class="row">` inside `<form>` / `<fieldset>`                  |
| Checkbox / radio option label                              | `<label class="form-option-row">`                                   |
| Submit / cancel row at form end                            | `<div class="form-actions">`                                        |
| Input + appended button (search, subscribe)                | `<div class="input-group">`                                         |
| Dialog / modal                                             | `<dialog>` + `.close` + `<button commandfor=... command="show-modal">` |
| Drawer (mobile menu, side panel)                           | `<aside popover="auto" class="drawer">` + `.drawer-toggle`          |
| Toggle switch                                              | `<input type="checkbox" class="toggle">`                            |

---

## Nav

| Want                                                       | Class / pattern                                                     |
| ---------------------------------------------------------- | ------------------------------------------------------------------- |
| Primary sidebar nav                                        | `<nav class="sidebar-nav">` with `<a aria-current="page">`          |
| Dense sidebar nav                                          | `.sidebar-nav.compact`                                              |
| Outlined sidebar nav (no filled active row)                | `.sidebar-nav.ghost`                                                |
| Text-only sidebar nav                                      | `.sidebar-nav.minimal` (+ `.strong-active` to emphasize current)    |
| Themed active highlight color                              | `--sn-color: var(--primary)` on the nav                             |
| Narrow vertical icon-only nav rail                         | `.icon-rail`                                                        |
| Table of contents (in-page)                                | `<nav class="toc" aria-label="Table of contents">`                  |

---

## Type

| Want                                                       | Class / pattern                                                     |
| ---------------------------------------------------------- | ------------------------------------------------------------------- |
| Page heading                                               | `<h1>` — heading scale is automatic via `--fl`                      |
| Make a heading shrink in narrow containers                 | Add `.fc` to the heading or a parent                                |
| Small text on a `<span>` / `<div>` (not a text element)    | Add `.fluid` beside `.fs-*` — `.fs-*` only set `--fl` (see AP-016)   |
| Body that softens visually                                 | `.text-muted` / `.text-faint`                                       |
| Center-aligned text block                                  | `.text-center` (or `.text-end` / `.text-start`)                     |
| Monospace label                                            | inline `<span class="mono">` or `<code>`                            |
| Eyebrow / overline (UPPERCASE, tracked)                    | `.eyebrow` (custom) or theme-provided `<h5>` / `<small>`            |
| Drop cap on prose openers                                  | `class="prose"` on container (in `theme-editorial` / similar)       |

---

## Color

| Want                                                       | Class / pattern                                                     |
| ---------------------------------------------------------- | ------------------------------------------------------------------- |
| Change just the brand accent                               | inline `style="--primary: ..."` on the section root                 |
| Theme the entire surface                                   | `class="theme-X"` on `<html>` / section root                        |
| One-off semantic color (success / warning / error)         | Use the semantic class variant (`.tag.success`, `.callout.error`)   |
| Subtle alt-background panel                                | `.surface` + `--surface-bg`                                         |
| Hero background tint                                       | `.gradient-aurora` / `-sunset` / `-ocean` / `-midnight` / `-slate`  |
| Card bg different from page bg                             | leave `.card` default — it reads `--bg`. Override with `--card-bg`. |

If you reach for `--blue: ...` or `--red: ...` inline → see `THEMING_AND_TOKENS.md`. Use a theme class instead.

---

## Spacing — what number to reach for

| Need                                                       | Token                                                               |
| ---------------------------------------------------------- | ------------------------------------------------------------------- |
| Tight gap between related items (icon + label)             | `--vs-xs` (0.25rem)                                                 |
| Default rhythm inside a `.stack`                           | `--vs-s` (0.5rem)                                                   |
| Form field spacing                                         | `--vs-m` (0.75rem)                                                  |
| Section internal padding                                   | `--vs-l` / `--pad-l`                                                |
| Section-to-section spacing                                 | `--vs-xl` (4rem)                                                    |
| Hero vertical breathing room                               | `--vs-xxl`                                                          |
| Card / button inner padding                                | `--pad-m` / `--pad-l`                                               |

Resist micromanaging spacing inline. If `.stack` doesn't give you what you want, `--gap` is the lever.

---

## Iconography

- Graffiti ships **no icon set** beyond the logomark and GitHub mark, and blesses none.
- **Use whatever icon library the project already imports** (check `package.json` and existing imports first). Consistency with the host project wins.
- **If the project has no icon library**, use a `<span class="icon" aria-hidden="true">` placeholder with a single Unicode glyph until a real icon source is supplied. That's the framework's own placeholder convention (see the landing template).
- **Never** invent SVG icons more complex than a basic shape (circle / square / arrow / chevron / plus / minus / X / check).
- **Never** use emoji as feature icons in non-brand contexts.
- **Never** mix icon sets on one page.
- Do not wire up a third-party icon CDN inside generated markup unless the user explicitly asks.

---

## Mobile

| Want                                                       | Use                                                                 |
| ---------------------------------------------------------- | ------------------------------------------------------------------- |
| Layout responds to its own width                           | `container-type: inline-size` + `@container` query                  |
| Layout responds to viewport (page-level)                   | `@media`                                                            |
| Mobile sidebar / nav                                       | `[popover].drawer` + `.drawer-toggle`                               |
| Full-height shell that respects iOS URL bar                | `100dvh` + `.app-shell` or `.layout-sidebar.fill`                   |
| Bottom-pinned bar respecting home indicator                | `padding-block-end: max(var(--pad-s), env(safe-area-inset-bottom))` |
| Different image per breakpoint                             | `<picture>` + `<source media="...">`                                |
| Headings that shrink in narrow containers                  | `.fc` class on container                                            |

---

## Anti-patterns — fast remap

| If you wrote                                                | Convert to                                                          |
| ----------------------------------------------------------- | ------------------------------------------------------------------- |
| `style="display: grid; grid-template-columns: 1fr 1fr 1fr"` | `.layout-three-col` or `.layout-card`                               |
| `style="display: flex; gap: ..."`                           | `.cluster` or `.split`                                              |
| Repeated `style="margin: 0"`                                | Wrap in `.stack`                                                    |
| `style="background: #1d4ed8; color: #fff"`                  | `.tag` / `.callout` / `--tag-color`                                 |
| Custom modal `<div role="dialog">`                          | `<dialog>` + `.close`                                               |
| JS-toggled menu                                             | `[popover].drawer` + `.drawer-toggle`                               |
| Hand-built KPI block                                        | `.stat-card`                                                        |
| Hand-built card with `<a>` reset                            | `.card.linked`                                                      |
| Hand-built tool-call / deploy entry                         | `.log-card`                                                         |
| Hand-built multi-line message input + send button           | `<form class="composer">`                                           |
| Hand-built vertical icon-only sidebar                       | `.icon-rail`                                                        |
| Hand-built inspector / right-side panel                     | `.workbench-panel` inside `.layout-rail.with-workbench`             |
| `<div class="box">` around a metric                         | `.stat-card`                                                        |
| `<div class="box">` around a feature blurb                  | `.feature-card`                                                     |
| `<div class="box">` around a notice                         | `.callout` + variant                                                |
| `<div class="stack">` around a chat turn                    | `.chat-row` (+ `.bubble`)                                           |
| `<div class="surface">` around a confirm modal              | `<dialog>` + `.close`                                               |
| `<div class="card">` wrapping a whole page section          | `<section class="surface">` or just `<section>`                     |
| Generic "container" wrapping a form                         | `<form>` directly, optionally inside `.box` or `.surface`           |
| Three feature cards saying "Fast", "Secure", "Reliable"     | Cut the section, or write real specific copy                        |
| Inline `--blue: ...` to recolor surfaces                    | Apply a `theme-X` class instead (see `THEMING_AND_TOKENS.md`)       |

---

## When the request doesn't match anything here

- Hit the full preflight in `SKILL.md`.
- Search `drop-in.css` for the class name pattern you're looking for.
- Fall back to the closest neutral primitive and document the gap.
- Never invent a new class name to fill the gap mid-output.
