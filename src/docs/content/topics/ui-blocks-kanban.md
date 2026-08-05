---
id: kanban
title: Kanban Board
route: ui-blocks
order: 260
summary: Board, lane, task card, pointer drag, drop target, selected, and keyboard-drag visual states.
when_to_use: Moving ordered work items among named workflow stages.
classes:
  - .kanban-board
  - .kanban-column
  - .kanban-column-header
  - .kanban-card
  - .kanban-dropzone
demos:
  - Kanban
tags:
  - ui-blocks
  - workflow
---

The board scrolls horizontally and keeps columns snap-aligned on narrow containers. A column contains `.kanban-column-header`, a card list, and one or more `.kanban-dropzone` destinations. Task cards compose `.card kanban-card`.

```html
<section class="kanban-board" aria-label="Project board">
  <section class="kanban-column drag-over">
    <header class="kanban-column-header">
      <h2>Doing</h2>
      <span class="tag">2</span>
    </header>
    <article class="card kanban-card keyboard-dragging" tabindex="0">…</article>
    <div class="kanban-dropzone active">Drop here</div>
  </section>
</section>
```

Decks toggles `dragging` / `data-dragging`, `keyboard-dragging` / `data-keyboard-dragging`, row selection, `drag-over`, and active/invalid dropzone states. Keyboard drag mode must provide grab/cancel/move commands, preserve focus, and announce every successful or rejected move through a polite live region. Pointer drag is an enhancement, never the only path.
