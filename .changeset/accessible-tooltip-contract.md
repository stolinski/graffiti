---
"@drop-in/graffiti": major
---

Replace the previous tooltip API with an explicit accessible semantics contract.

Pseudo-tooltips now read visible tooltip text from `data-tooltip` instead of `aria-label`. Keep an explicit accessible name on icon-only controls and mirror that text in `data-tooltip`:

```html
<!-- Before -->
<button class="tip" aria-label="Save draft">
  <svg aria-hidden="true"><!-- icon --></svg>
</button>

<!-- After -->
<button class="tip" aria-label="Save draft" data-tooltip="Save draft">
  <svg aria-hidden="true"><!-- icon --></svg>
</button>
```

Rich tooltips now require a normally named trigger with `aria-describedby` and a matching tooltip element with `role="tooltip"`:

```html
<span class="tooltip">
  <button aria-describedby="save-help">Save</button>
  <span class="tip" id="save-help" role="tooltip">Save without publishing</span>
</span>
```

Tooltip content is non-interactive, hidden tooltips no longer create stray accessibility-tree content, and pointer and keyboard users receive the same help. The zero-JavaScript tooltip pattern dismisses on hover or focus exit; use a popover, disclosure, or application behavior when Escape dismissal is required.

## Breaking layout migration in 5.0

The previous `.layout-holy-grail` `auto 1fr auto` stretching contract is cleanly removed in 5.0 under ADR-0011; there is no deprecated alias or coexistence period. The class now provides the ADR-0010 editorial/docs reading layout: a centered max-width middle with optional named rails.

Migrate unnamed children to the direct-child contract in semantic DOM order: optional `.rail-start`, `<main>` or `<article>`, then optional `.rail-end`.

```html
<!-- Before: auto | stretching 1fr | auto -->
<div class="layout-holy-grail">
  <aside>Contents</aside>
  <main>Article</main>
  <aside>Notes</aside>
</div>

<!-- 5.0: start rail | centered max-width middle | end rail -->
<div class="layout-holy-grail">
  <aside class="rail-start">Contents</aside>
  <main>Article</main>
  <aside class="rail-end">Notes</aside>
</div>
```

At 1024px and below, `.rail-end` marginalia is hidden. At 768px and below, a plain `.rail-start` is hidden. To retain the start rail on mobile, make the rail a native drawer and place its toggle inside the middle content or another appropriate page header; no JavaScript is required:

```html
<div class="layout-holy-grail">
  <aside id="article-contents" class="rail-start drawer" popover="auto">
    Contents
  </aside>
  <main>
    <button class="drawer-toggle minimal" type="button" popovertarget="article-contents">
      Contents
    </button>
    Article
  </main>
  <aside class="rail-end">Notes</aside>
</div>
```

`.rail-start` and `.rail-end` are child-contract classes for `.layout-holy-grail`, not free-floating utilities. Continue to use `.layout-three-col` for three equal columns such as card grids and comparison rows.

This release also adds explicit forced-colors behavior for custom controls, visible keyboard focus and disabled states for dropzones, deterministic minified exports at `@drop-in/graffiti/min` and `@drop-in/graffiti/drop-in.min.css`, and enforced packed-artifact CSS size budgets. Historical `drop-in.css` and `raw` package paths remain available as generated compatibility aliases.
