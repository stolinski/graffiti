# Graffiti System Primer

Use this file to ground outputs in how Graffiti actually works for hosted docs + templates and installed package usage.

## What Graffiti Is

- Graffiti is the baseline design layer for projects using this skill.
- It provides the default system for elements, layouts, utilities, components, and a full tokenized color/spacing/radius/shadow model.
- Graffiti is class-first and drop-in: most styling should come from composing existing classes in markup.
- Inline styles are for narrow token overrides, not for rebuilding layout/component primitives.
- Creating a parallel styling system in markup (new utility sets, custom component systems, ad-hoc token families) is a contract failure.

## System-First Preflight (Required)

Run this before writing or editing markup:

1. Variables: identify required tokens from `https://graffiti-ui.com/base` markdown and installed Graffiti CSS contracts.
2. Theme: confirm styling relies on Graffiti theme-aware tokens/classes, not raw color literals.
3. Layout primitives: map major wrappers to existing layout classes (`layout-*`, `stack`, `cluster`, `split`, etc.).
4. Utilities: select existing text/state/spacing utilities before considering overrides.
5. Components: map each requested UI part to canonical built-in component patterns.

If any preflight category is unresolved, do not write final markup yet; resolve with fallback mapping first.

## Source-of-Truth Hierarchy

When there is any uncertainty, resolve in this order:

1. Hosted docs markdown from `https://graffiti-ui.com/base`, `https://graffiti-ui.com/utilities`, `https://graffiti-ui.com/elements`, `https://graffiti-ui.com/ui-blocks`, plus topic routes such as `https://graffiti-ui.com/elements/buttons`
2. Hosted template index + pages at `https://graffiti-ui.com/templates` and `https://graffiti-ui.com/templates/*`
3. Installed Graffiti stylesheet/package exports (real selectors and variable contracts)
4. Skill recipe docs in `skills/graffiti-best-practices/references/*.md`

If references conflict with source files, source files win.

## Variable Model (Do Not Invent)

Graffiti variables are contract-based.

### 1) Global tokens

Defined in Graffiti CSS contracts and documented on `https://graffiti-ui.com/base` markdown.

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

1. Fetch relevant hosted docs markdown pages (`/base`, `/utilities`, `/elements`, `/ui-blocks`) from `https://graffiti-ui.com` using `Accept: text/markdown`.
2. When working on a single component/topic, fetch its topic route (for example `/elements/buttons`) to keep context focused.
3. Read documented class lists/pattern examples first.
4. Use hosted template routes at `https://graffiti-ui.com/templates/*` for page-level structure.
5. Confirm uncertain class names against selectors in installed Graffiti CSS.

## Primitive Mapping Requirement

Before coding, create a per-component mapping from request language to Graffiti primitives.

Template:

- Requested piece: `<user phrase>` -> Primitive: `<class/element pattern>` -> Source: `<path>`

Every requested component or interaction must have a mapped primitive or an explicit fallback note.

## Fast Guardrails

- If a class is not documented in hosted docs and not present in installed Graffiti CSS, treat it as unknown.
- If a custom property is not documented in hosted docs and not present in installed Graffiti CSS, treat it as unknown.
- Prefer semantic variants before custom token overrides (example: `.tag.success` before `--tag-color`).
- Prefer built-in form patterns (`.row`, `.form-option-row`, `.form-actions`) over ad-hoc wrappers.
- Prefer built-in card/link patterns (`.card`, `.card.featured`, `.card.linked`) over manual recreation.
- Use canonical snippets for critical patterns from `references/CANONICAL_SNIPPETS.md`.

## Known Canonical Templates

- Landing: `https://graffiti-ui.com/templates/landing`
- Dashboard: `https://graffiti-ui.com/templates/dashboard`
- Blog: `https://graffiti-ui.com/templates/blog`
- Settings: `https://graffiti-ui.com/templates/settings`
- AI chat: `https://graffiti-ui.com/templates/ai-chat`
- Docs portal: `https://graffiti-ui.com/templates/docs-portal`
