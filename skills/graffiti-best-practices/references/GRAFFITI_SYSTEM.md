# Graffiti System Primer

Use this file to ground outputs in how Graffiti actually works in this repo.

## What Graffiti Is

- Graffiti is the baseline design layer for this repository.
- It provides the default system for elements, layouts, utilities, components, and a full tokenized color/spacing/radius/shadow model.
- Graffiti is class-first and drop-in: most styling should come from composing existing classes in markup.
- Inline styles are for narrow token overrides, not for rebuilding layout/component primitives.
- Creating a parallel styling system in markup (new utility sets, custom component systems, ad-hoc token families) is a contract failure.

## System-First Preflight (Required)

Run this before writing or editing markup:

1. Variables: identify required tokens from `src/docs/content/topics/base-variables.md` and `src/lib/drop-in.css`.
2. Theme: confirm styling relies on Graffiti theme-aware tokens/classes, not raw color literals.
3. Layout primitives: map major wrappers to existing layout classes (`layout-*`, `stack`, `cluster`, `split`, etc.).
4. Utilities: select existing text/state/spacing utilities before considering overrides.
5. Components: map each requested UI part to canonical built-in component patterns.

If any preflight category is unresolved, do not write final markup yet; resolve with fallback mapping first.

## Source-of-Truth Hierarchy

When there is any uncertainty, resolve in this order:

1. `src/lib/drop-in.css` (real selectors and variable contracts)
2. `src/docs/content/topics/*.md` (canonical usage patterns and frontmatter `classes`)
3. `src/routes/templates/*/+page.svelte` (canonical page composition)
4. Skill recipe docs in `skills/graffiti-best-practices/references/*.md`

If references conflict with source files, source files win.

## Variable Model (Do Not Invent)

Graffiti variables are contract-based.

### 1) Global tokens

Defined in `src/lib/drop-in.css` and documented in `src/docs/content/topics/base-variables.md`.

- Color tokens: `--red`, `--blue`, `--green`, etc. plus `-1` through `-9` scales
- Semantic colors: `--primary`, `--error`, `--warning`, `--success` and scale variants
- Surface/foreground tokens: `--fg`, `--bg`, `--fg-*`, `--bg-*`
- Spacing/radius/border/shadow/easing: `--vs-*`, `--pad-*`, `--br-*`, `--border-*`, `--shadow-*`, `--ease-*`

### 2) Layout knobs

Use only when class composition cannot express the requested spacing/size.

- `--gap`
- `--layout-gap`
- `--min-card-width`
- `--max-width`

### 3) Component override tokens

Use only with the matching component pattern and when a semantic class variant does not solve it.

- `--tag-color`
- `--button-color`
- `--toggle-color`
- `--callout-*`
- `--bubble-*`

## Do Not Re-Implement Built-ins (Hard Fail)

If Graffiti already has a primitive, use it directly rather than recreating it.

- Dialog/modal: native `<dialog>` with `.close` and invoker commands
- Cards: `.card`, `.card.featured`, `.card.linked`, `.card-body`
- Chat bubbles: `.chat-thread`, `.chat-row`, `.chat-row.self`, `.chat-message`, `.bubble`, `.chat-composer`
- Form primitives: `.row`, `.form-option-row`, `.form-actions`, `.input-group`
- Messaging/status: `.callout` variants, `.tag` semantic variants

Rebuilding these with custom wrappers + bespoke CSS/JS counts as duplicate-system behavior.

## Component Pattern Grounding

Before writing markup:

1. Find relevant topic docs in `src/docs/content/topics/*.md`.
2. Read frontmatter `classes` first, then example markup.
3. Use template routes in `src/routes/templates/*/+page.svelte` for page-level structure.
4. Confirm uncertain class names against selectors in `src/lib/drop-in.css`.

## Primitive Mapping Requirement

Before coding, create a per-component mapping from request language to Graffiti primitives.

Template:

- Requested piece: `<user phrase>` -> Primitive: `<class/element pattern>` -> Source: `<path>`

Every requested component or interaction must have a mapped primitive or an explicit fallback note.

## Fast Guardrails

- If a class is not documented and not present in `src/lib/drop-in.css`, treat it as unknown.
- If a custom property is not documented and not present in `src/lib/drop-in.css`, treat it as unknown.
- Prefer semantic variants before custom token overrides (example: `.tag.success` before `--tag-color`).
- Prefer built-in form patterns (`.row`, `.form-option-row`, `.form-actions`) over ad-hoc wrappers.
- Prefer built-in card/link patterns (`.card`, `.card.featured`, `.card.linked`) over manual recreation.
- Use canonical snippets for critical patterns from `references/CANONICAL_SNIPPETS.md`.

## Known Canonical Templates

- Landing: `src/routes/templates/landing/+page.svelte`
- Dashboard: `src/routes/templates/dashboard/+page.svelte`
- Blog: `src/routes/templates/blog/+page.svelte`
- Settings: `src/routes/templates/settings/+page.svelte`
- AI chat: `src/routes/templates/ai-chat/+page.svelte`
- Docs portal: `src/routes/templates/docs-portal/+page.svelte`
