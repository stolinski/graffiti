# Troubleshooting

Use this guide when prompts are ambiguous, conflicting, or impossible to satisfy exactly with current Graffiti classes.

---

## T1: Prompt Is Too Vague

### Symptom

- Prompt like "make this better" or "improve the UI" without context.

### Default action

1. Preserve existing semantics and content intent.
2. Reduce inline style debt using class-first transforms.
3. Improve layout using nearest canonical shell.
4. Report assumptions in "Intent and Constraints".

### What to avoid

- Do not invent new visual systems or classes.

---

## T2: Requested Class Does Not Exist

### Symptom

- User asks for class names not present in Graffiti.

### Default action

1. Apply RT-007 (Unknown Class Fallback).
2. Substitute nearest canonical recipe/component.
3. Record a limitation note under "Known Limitations and Adaptation Path".

### Example

- Requested: `metric-tile`
- Fallback: `stat-card`

---

## T3: Pixel-Perfect Requirement Conflicts with Class-First Rules

### Symptom

- Prompt asks for exact visual clone with custom spacing/colors but also "Graffiti only".

### Default action

1. Prioritize canonical Graffiti composition.
2. Apply only approved token overrides.
3. Document any fidelity tradeoffs and unresolved gaps.

### What to avoid

- Do not add raw color literals or large inline style payloads to force exact clone behavior.
- Do not rely on one-off local overrides; if custom CSS is needed, propose reusable project-level classes.

---

## T4: Inline Style Budget Is Exceeded

### Symptom

- Candidate output exceeds section/page inline declaration limits.

### Default action

1. Run RT-001, RT-002, RT-003, RT-005.
2. Replace structural inline styles with existing layout/utility classes.
3. Recalculate inline declaration counts before final output.

---

## T5: Missing Semantic Structure in Candidate Markup

### Symptom

- Output relies on generic div wrappers and lacks landmarks.

### Default action

1. Run RT-004.
2. Rebuild shell with `header/nav/main/section/footer` as needed.
3. Validate heading order and form/table semantics.

---

## T6: App Shell Height/Scroll Bugs

### Symptom

- Uses `100vh` and exhibits clipping/double-scroll behavior.

### Default action

1. Run RT-008.
2. Use `min-height: 100dvh` with `layout-sidebar fill` and/or `app-shell`.
3. Ensure only intended pane scrolls.

---

## T7: Chat Theme Requires Heavy Token Overrides

### Symptom

- Prompt asks for branded chat theme requiring many inline tokens.

### Default action

1. Start from neutral `surface` + chat primitives.
2. Apply minimal required overrides (`--bubble-*`, `--surface-bg`) only.
3. Record remaining gap for future theme preset support.

---

## T8: Request Needs Interactivity but Prompt Also Says "No JS"

### Symptom

- User requests interactive behavior while requiring static/no JS output.

### Default action

1. Prefer native HTML interaction (`details/summary`, `dialog` where feasible).
2. Provide state examples with attributes (`open`, `aria-current`, checked).
3. If full interaction still needs JS, provide static fallback and explicitly call out limitation.

---

## T9: Framework Ambiguity (HTML vs Svelte)

### Symptom

- Prompt does not clearly specify framework format.

### Default action

1. Return framework-agnostic HTML by default.
2. Keep markup portable and class-first.
3. Add framework note in assumptions if relevant.

---

## T10: Multiple Intents in One Prompt

### Symptom

- Prompt combines multiple page intents (for example dashboard + blog + settings).

### Default action

1. Split into primary + secondary intents.
2. Build shell from primary intent recipe.
3. Add secondary patterns as sections/components only if composition remains coherent.
4. If conflicting, return primary intent implementation and document tradeoff.

---

## T11: Matching In-Repo Template Exists

### Symptom

- Prompt intent maps cleanly to one of `src/routes/templates/*/+page.svelte`

### Default action

1. Select the matching template as baseline before recipe selection.
2. Preserve the baseline section/component skeleton.
3. Apply requested changes as targeted modifications.
4. Record baseline path in the output contract.

### What to avoid

- Do not generate a fresh page composition when baseline exists unless user explicitly requests from-scratch output.

---

## T12: User Explicitly Requests Fresh Build

### Symptom

- Prompt clearly asks for "from scratch", "new structure", or "ignore existing template".

### Default action

1. Confirm in assumptions that baseline is intentionally not used.
2. Use canonical recipes as primary source.
3. Keep class-first and accessibility gates unchanged.

---

## T13: Prompt Suggests Rebuilding a Built-In Primitive

### Symptom

- Request includes custom wrapper/CSS instructions for patterns that Graffiti already provides (dialog/modal, card, bubble/chat, callout, form rows/actions, input-group).

### Default action

1. Map request to existing primitive first.
2. Start from canonical snippet for that primitive.
3. Preserve requested content intent while keeping built-in structure.
4. If user explicitly needs extension behavior, apply minimal tokenized adaptation and record it.

### What to avoid

- Do not create bespoke component wrappers that duplicate Graffiti built-ins.

---

## T14: Agent Loses Graffiti Baseline Context

### Symptom

- Output reads like generic CSS utility framework usage and ignores Graffiti system constraints.

### Default action

1. Re-anchor using `references/GRAFFITI_SYSTEM.md`.
2. Run full system-first preflight (variables, theme, layout, utilities, components).
3. Build primitive mapping table from docs/CSS before writing markup.
4. Re-run validation and compliance report sections.

---

## Quick Triage Sequence

When in doubt, run this order:

1. Re-anchor to Graffiti system primer (`GRAFFITI_SYSTEM.md`)
2. Resolve baseline template match (if any)
3. Run system-first preflight (variables, theme, layout, utilities, components)
4. Build primitive mapping for requested components/interactions
5. Validate classes and custom properties (unknown first)
6. Restore semantics and landmarks
7. Normalize layout primitives
8. Reduce inline styles to budget
9. Verify accessibility and responsive behavior
10. Record unresolved gaps explicitly
