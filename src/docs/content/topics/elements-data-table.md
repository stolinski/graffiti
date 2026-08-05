---
id: data-table
title: Data Table
route: elements
order: 295
summary: Complete visual states for sortable, selectable, actionable, empty, loading, compact, sticky data tables.
when_to_use: Interactive tabular datasets whose behavior is managed by Decks or another table engine.
classes:
  - .data-table
  - .data-table-toolbar
  - .data-table-sort
  - .data-table-actions
  - .data-table-empty
  - .data-table-loading
demos:
  - DataTable
tags:
  - elements
  - data
---

`.data-table` composes a `.data-table-toolbar` with the existing `.table > table` contract. Decks owns TanStack state, callbacks, keyboard behavior, and server coordination.

- Put `aria-sort` on the `<th>` and a `.data-table-sort` button inside it.
- Put `aria-selected="true"` on selected rows. Selection checkboxes retain value-specific labels.
- Use `.data-table-actions` on an action cell or toolbar group.
- Use a spanning `.data-table-empty` cell for filtered zero-results.
- Use `.data-table-loading` with `.skeleton` cells, and set `aria-busy="true"` on `.data-table`.
- `.compact` tightens cell padding. `.sticky` bounds the table wrapper and pins headers.

The toolbar responds to its own container, not the viewport. Tables continue to scroll horizontally on narrow hosts. Never replace native table semantics with a grid of generic elements for styling convenience.
