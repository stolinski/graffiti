---
id: async-state
title: Async and Empty States
route: elements
order: 300
summary: Native progress and meter elements plus canonical empty, skeleton, spinner, and busy-button states.
when_to_use: Communicating work in flight, known-range values, loading geometry, or the absence of records.
classes:
  - .progress
  - .meter
  - .signaling
  - .empty
  - .skeleton
  - .spinner
demos:
  - AsyncStates
tags:
  - elements
  - feedback
---

Choose by meaning:

- `<progress class="progress">` is work in flight. Include `value` for determinate progress and omit it for indeterminate progress.
- `<meter class="meter">` is a current value in a known range. `.signaling` opts into success/warning/error paint based on the native range attributes.
- `.spinner` is a compact indeterminate indicator. Give it `role="status"` and an accessible label unless adjacent text already announces loading.
- `.skeleton` preserves content geometry. Mark skeleton shapes `aria-hidden="true"` and put `aria-busy="true"` plus an accessible loading label on the containing region. `.text` and `.circle` are shape modifiers.
- `.empty` is a centered no-content composition with optional icon, heading, body, and `.form-actions`. `.compact` fits bounded cards and table regions.

`button[aria-busy="true"]` gets the canonical busy indicator and stops accepting pointer input. Application behavior must still prevent duplicate submissions. Spinner and skeleton animation stops under reduced motion while their semantic loading text remains.
