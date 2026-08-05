---
name: graffiti-best-practices
description: Use when generating or refactoring Graffiti UI markup so output is class-first, semantic, accessible, responsive, and aligned with current Graffiti capabilities.
metadata:
  version: 1.10.0
---

# Graffiti Best Practices

Generate high-quality Graffiti markup using current library constraints.

Graffiti is the baseline design layer when this skill is active: it provides the default system for elements, layout primitives, utilities, components, and color/theme tokens.

This skill extends Graffiti patterns; it does not create a parallel styling system.

This skill is strict about class-first composition, minimal inline style usage, semantic HTML, and repeatable quality checks.

It is also strict about template-first adaptation: when a matching hosted template baseline exists, start from that template and customize it.

Quality bar: passing the markup contract is necessary but not sufficient. Output must also clear an aesthetic bar (voice, density, imagery, restraint). Markup that satisfies every contract check but ships with AI-shaped content (generic copy, decorative gradients, invented SVG icons, fake numbers, emoji-as-icons) still fails. See `references/AESTHETIC_GUIDE.md`.

Audience: developers using Graffiti in real applications and websites.

## Package Structure

- `SKILL.md` - activation rules, boundaries, and execution workflow
- `references/OUTPUT_CONTRACT.md` - required response structure and scoring gates
- `references/GRAFFITI_SYSTEM.md` - Graffiti identity, token/variable model, and source-of-truth lookup rules
- `references/COMPONENT_INTENT_MATRIX.md` - role boundaries for core components (use-when, do-not-use, fallback)
- `references/CANONICAL_SNIPPETS.md` - critical pattern snippets that must be used as first-choice baselines
- `references/RECIPES_LAYOUTS.md` - page shell and layout recipes
- `references/RECIPES_SECTIONS.md` - section-level recipes by intent
- `references/RECIPES_COMPONENTS.md` - component-level recipe snippets
- `references/ANTI_PATTERNS.md` - failure mode catalog and detection heuristics
- `references/RECOVERY_TRANSFORMS.md` - deterministic rewrite transforms
- `references/EXAMPLES.md` - prompt/response behavior examples
- `references/TROUBLESHOOTING.md` - ambiguous prompt handling and recovery guidance
- `references/AESTHETIC_GUIDE.md` - taste / voice / density / imagery / anti-slop rules (output quality)
- `references/THEMING_AND_TOKENS.md` - color-scheme and opaque-scale gotchas, theme override chain
- `references/MOBILE_AND_CONTAINERS.md` - container queries vs media queries, drawer pattern, dvh + safe-area
- `references/CHEAT_SHEET.md` - fast "I want X, use Y" lookup

## Trigger Conditions

Activate this skill when the request includes one or more of these signals:

- Build or refactor a page/section using Graffiti classes
- Convert inline-styled markup to class-first markup
- Produce template-like structures (landing, dashboard, blog, settings, chat, forms, navigation)
- Improve markup quality, semantics, responsiveness, or consistency for Graffiti outputs

## Do Not Activate For

- Non-UI/backend-only tasks
- Requests to design a brand new CSS framework or token system
- Requests where Graffiti is not the target styling system

## Hard Boundaries (Refusal + Redirect Rules)

1. Do not invent class names not present in current Graffiti CSS/docs.
2. Do not invent CSS custom properties (`--*`) that are not part of Graffiti's public Registry v2 token contracts. Never emit a token whose `tokenInventory` entry has `public: false`.
3. Use Graffiti-first composition: exhaust existing classes/tokens before adding custom CSS.
4. Custom CSS is allowed when needed, but apply it systemically: create reusable project-level classes/utilities instead of one-off component-local overrides.
5. Do not hardcode raw color literals (`#hex`, `rgb()`, `oklch(...)`) inline unless explicitly requested.
6. Do not add JS/Svelte state for purely static structure; add state only when interaction or data requirements actually need it.
7. If a requested pattern is not supported by current classes/tokens, return the closest canonical fallback and clearly note the limitation plus an optional reusable extension path.
8. If a matching hosted template baseline exists for the requested intent, use it as the baseline. Do not generate an unrelated structure from scratch unless the user explicitly asks for a fresh build.
9. Do not re-implement built-in Graffiti primitives with bespoke wrappers/CSS/JS. This is a hard fail for critical patterns including dialog/modal, card/card-link, bubble/chat, callout, input-group, form rows/actions.
10. Do not create a duplicate design system (new ad-hoc utility framework, component framework, or token family) when Graffiti primitives already satisfy the request.
11. Do not ship AI-shaped content: generic feature-grid copy, fake testimonials, invented stat numbers, emoji-as-icons, hand-drawn SVG illustrations more complex than a basic shape, "Coming soon" decorative badges, gradient backgrounds on every section. See `references/AESTHETIC_GUIDE.md` for the full anti-slop list.
12. Do not inline-override hue tokens (`--blue`, `--red`, etc.) and expect their opaque scales (`--blue-opaque-N`) to follow. Use a theme class instead. See `references/THEMING_AND_TOKENS.md`.
13. Do not use `@media` queries for component-internal responsiveness. Default to `@container` queries with `container-type: inline-size`. See `references/MOBILE_AND_CONTAINERS.md`.

## Graffiti Identity (Non-Negotiable)

Treat these as fixed truths for this skill:

- Graffiti is a class-first drop-in CSS system. Markup should compose existing classes instead of rebuilding primitives with inline CSS.
- Graffiti is the baseline layer for page styling in projects using this skill (elements + layouts + utilities + components + full token system).
- Graffiti is a **substrate, not a look**. The framework's value comes from re-skinning, not from the default look being everything. Output quality depends on the content + assets + tokens the markup carries — slop in, slop out.
- The source of truth is hosted Graffiti docs/templates plus local package evidence, in this order:
  1. `https://graffiti-ui.com/base`, `https://graffiti-ui.com/utilities`, `https://graffiti-ui.com/elements`, `https://graffiti-ui.com/ui-blocks` requested with `Accept: text/markdown`, plus topic routes like `https://graffiti-ui.com/elements/buttons`
  2. `https://graffiti-ui.com/templates` and template pages such as `https://graffiti-ui.com/templates/landing`, `https://graffiti-ui.com/templates/dashboard`, `https://graffiti-ui.com/templates/blog`, `https://graffiti-ui.com/templates/settings`, `https://graffiti-ui.com/templates/ai-chat`, `https://graffiti-ui.com/templates/docs-portal`
  3. Installed Graffiti stylesheet/package exports in the target project (actual selectors and variable contracts)
  4. Skill recipes in `references/*` (guidance layer, never higher authority than source files)
- Graffiti tokens are contracts, not free-form style knobs. Use only Registry v2 primitive/reference, global semantic, and public component-contract tokens; private calculated tokens are unavailable even if their spelling appears in CSS.
- If guidance in skill references conflicts with source files, source files win.

## System-First Preflight (Required)

Before writing or editing markup, run this preflight in order:

1. Variables: identify required tokens from `https://graffiti-ui.com/base` markdown and installed Graffiti CSS contracts.
2. Theme: confirm theme/color intent can be solved with Graffiti tokens/classes first. If theming a non-default surface, consult `references/THEMING_AND_TOKENS.md` to pick the right override level (theme class vs `--primary` swap vs component override token).
3. Layout: map top-level structure to existing layout primitives. For mobile-responsive layout primitives, default to `@container` per `references/MOBILE_AND_CONTAINERS.md`.
4. Utilities: map text/state/alignment behavior to existing utilities.
5. Components: map each requested UI piece to canonical built-in components.

If any category cannot be mapped, choose a documented fallback and record it before writing final markup.

## Aesthetic-First Preflight (Required for content surfaces)

For any surface that includes content (marketing, dashboard with copy, templates, blog, etc.) ALSO run this preflight per `references/AESTHETIC_GUIDE.md`:

1. **Theme**: pick a theme class FIRST. Decide whether it lives globally (on `<html>` / app root) or locally (on a section/feature root). Default-canvas-with-no-theme is a deliberate choice, not a fallback. See `references/THEMING_AND_TOKENS.md`.
2. **Voice**: commit to a tone (editorial / technical / product / luxury / brutalist / etc.) and stay in it.
3. **Density**: declare the per-section content budget (e.g. hero = 1 headline + 1 subhead + 2 CTAs; feature grid = 3–6 items, each ≤30 words). If unsure, default LOW.
4. **Imagery**: decide what every image slot actually contains. If no real imagery is available, use `.box.invisible` + `gradient-*` + monospace label as placeholder. Never invent decorative SVGs.
5. **Icons**: Graffiti ships no icon set and blesses none. Use whatever icon library the project already includes (check `package.json` and existing imports first). If the project has no icon library, use the `<span class="icon" aria-hidden="true">` placeholder pattern with a single Unicode glyph until a real icon is supplied. Never invent SVG icons more complex than a basic shape (circle / square / arrow / chevron / plus / minus / X / check). Never use emoji as feature icons. Never mix icon sets in one page.

If theme / voice / density / imagery is ambiguous in the user's request and they didn't provide guidance, ASK before generating — do not silently choose generic SaaS defaults.

## Component Intent Steering (Required)

Classes are role-bearing primitives, not generic visual wrappers.

### Specific-Over-Generic Rule (the anti-generic-container rule)

`.box`, `.stack`, `.cluster`, `.split`, `.surface` are **fallbacks**, not defaults. Reaching for them when a role-specific primitive exists is the single largest source of ugly, generic-looking Graffiti output.

Before composing any container with a neutral wrapper, walk the role menu in this order and stop at the first match:

1. Is this a **metric/KPI readout**? → `.stat-card`
2. Is this a **feature/value-prop entry**? → `.feature-card`
3. Is this a **record-like content unit** (article, product, plan, recipe, post preview)? → `.card` (or `.card.featured` / `.card.linked`)
4. Is this a **notice / contextual message** (info, warning, error, success)? → `.callout` + semantic variant
5. Is this a **chat / message turn**? → `.chat-thread` + `.chat-row` + `.bubble`
6. Is this a **tool call / activity log entry / function invocation**? → `.log-card`
7. Is this a **compact disclosure** (FAQ-style)? → `<details class="bordered">` + `<summary>`
8. Is this a **modal/confirmation surface**? → native `<dialog>` + `.close`
9. Is this a **form field row / submit row / option label**? → `.row` / `.form-actions` / `.form-option-row`
10. Is this an **input coupled with one button**? → `.input-group`
11. Is this a **multi-line message composer with toolbar**? → `<form class="composer">`
12. Is this a **TOC for a long document**? → `.toc`
13. Is this a **vertical icon-only nav rail**? → `.icon-rail`
14. Is this a **secondary inspector/workbench pane in an app shell**? → `.workbench-panel` inside `.layout-rail.with-workbench`
15. Is this a **selectable pill / filter / suggestion**? → `.chip` (with `aria-pressed`)
16. Is this a **status pill / category label**? → `.tag` (semantic variant first)
17. Is this a **pull quote**? → `<blockquote class="pull-quote">`
18. Is this a **section eyebrow / overline**? → `.eyebrow`

**Only after exhausting the role menu** is `.box` / `.stack` / `.cluster` / `.split` / `.surface` allowed — and even then, justify why no role primitive fits.

Three-fit validation (apply once a role primitive is selected):

1. **Intent fit**: component role matches the requested job.
2. **Semantic fit**: host element semantics match the pattern.
3. **Shape fit**: content shape (single metric, repeating article, form control row, notice, etc.) matches the primitive.

Hard boundaries:

- `.card` and `.card.featured` are for repeating content units (article/product/plan-like records), not generic section/page wrappers.
- `.card.linked` is for card-as-link preview units, not nav containers or generic anchor wrappers.
- `.stat-card` is for KPI/metric values, not long-form copy or feature marketing blurbs.
- `.feature-card` is for feature-list entries, not arbitrary content blocks.
- `.log-card` is for activity entries (tool calls, deploys, audit lines), not generic cards.
- `.composer` is for multi-line message composition with a toolbar; do not reach for it as a generic form wrapper.
- `.icon-rail` and `.workbench-panel` belong inside `.layout-rail` shells; do not use them as standalone decoration.
- Neutral wrappers are *fallbacks*. If you used `.box` / `.stack` / `.surface` and the result looks unstyled, you probably skipped the role menu above — go back and reselect.

## Variable System Rules

When using inline custom properties or token references:

1. Prefer core tokens documented on `https://graffiti-ui.com/base` markdown and implemented in Graffiti CSS contracts.
2. Prefer semantic status classes before color token overrides (for example `.tag.success` before `--tag-color`).
3. Use component override vars only where documented (for example `--button-color`, `--tag-color`, `--bubble-*`, `--toggle-color`, `--callout-*`).
4. Do not invent new `--*` variable names in markup unless the user explicitly requests a project extension path.
5. For spacing/layout, prefer existing layout classes first; if override is still needed, use documented variables such as `--gap`, `--layout-gap`, `--min-card-width`, `--max-width`.
6. To re-color a whole surface, prefer applying a theme class (`class="theme-X"`) over inline-overriding hue tokens. Inline hue overrides do not propagate to opaque scales. See `references/THEMING_AND_TOKENS.md`.
7. When inline-overriding `--bg` or `--fg`, also pin `color-scheme` on the same element to prevent `light-dark()` resolution drift.
8. Resolve uncertain custom properties with `graffiti-lookup`; list/search exclude private tokens by default, and an exact result with `public: false` is a hard stop.

## Theming Decision (Required Before Markup)

Pick the lowest level that solves the requested change. Decide once, apply once.

| Scope of change                                                | Apply theme at                                                         | Why                                                            |
| -------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| Whole application / site has a brand identity                  | `class="theme-X"` on `<html>` (or `<body>`)                            | One source of truth; every nested surface inherits             |
| One section/feature needs a distinct visual mode               | `class="theme-X"` on the section/feature root                          | Triggers per-hue opaque-scale re-derivation locally            |
| Only the accent color needs to shift                           | `style="--primary: ..."` on the section root                           | Smallest correct override; safe inline                         |
| One component needs a documented variant tweak                 | Component override token (e.g. `--bubble-bg`, `--callout-tint`)        | Respects theme contract                                        |
| Status/role color (success / warning / error / info)           | Semantic class variant (`.tag.success`, `.callout.error`, etc.)        | Semantic variants always beat color overrides                  |

Available stock themes (verify against `src/lib/themes/` before referencing):
`theme-editorial`, `theme-paper`, `theme-system`, `theme-soft-consumer`, `theme-neon-arcade`, `theme-studio`, `theme-signal`, `theme-lumen`, `theme-schematic`. The unstyled canvas (no theme class) is also a valid choice — pick it deliberately, not by accident.

Hard rules:

- Do **not** inline-override a hue token (`--blue`, `--red`, etc.) and expect the opaque scales (`--blue-opaque-N`) to follow. Use a theme class instead.
- Do **not** scatter theme decisions across many elements. Apply theme high; let inheritance handle the rest.
- Do **not** use `!important` to force a token to win — that always means the structural choice was wrong.

## Required Workflow

Follow this sequence every time.

1. **Classify intent**
   - Map request to one or more intents: layout shell, neutral container, nav, form, repeating content unit, table/data, chat, utility/text.

2. **Resolve hosted template baseline first**
   - Check `https://graffiti-ui.com/templates/*` for the closest intent match.
   - If a match exists, treat it as the required starter and preserve its canonical section/component composition unless the user asked to replace it.
   - Record the selected template path in the output contract.

3. **Run system-first preflight**
   - Complete variable/theme/layout/utilities/components checks from `references/GRAFFITI_SYSTEM.md`.

4. **Run aesthetic-first preflight (content surfaces)**
   - For any output that includes content/copy/imagery, declare voice / density / imagery / icons / theme up front per `references/AESTHETIC_GUIDE.md`.
   - If the user's brief doesn't fix these choices, ask before generating.

5. **Resolve source-of-truth class and variable contracts**
   - For requested components/sections, read `https://graffiti-ui.com/base`, `https://graffiti-ui.com/utilities`, `https://graffiti-ui.com/elements`, and `https://graffiti-ui.com/ui-blocks` with `Accept: text/markdown` and use documented classes/examples as canonical patterns.
   - Prefer topic routes (for example `https://graffiti-ui.com/elements/buttons`) when you only need one topic to reduce context noise.
   - Use `https://graffiti-ui.com/base` markdown for global token names and categories.
   - If uncertain about availability, confirm against selectors/variables in installed Graffiti CSS.

6. **Create primitive mapping before coding**
   - For each requested component/interaction, map user intent to an existing Graffiti primitive and cite source file.
   - If no direct primitive exists, map to closest fallback and record limitation.
   - Use `references/CHEAT_SHEET.md` as a fast lookup when the intent is unambiguous.

7. **Run component intent fit check**
   - Validate each selected component class against `references/COMPONENT_INTENT_MATRIX.md` before writing markup.
   - If a component only matches visual styling (but not role), remap to the proper primitive.
   - Treat role mismatch as a blocking error, not a stylistic preference.

8. **Resolve canonical snippets for critical patterns**
   - For dialog/modal, card/link, bubble/chat, form actions/options, input-group, and callouts, start from `references/CANONICAL_SNIPPETS.md` baselines.

9. **Select canonical recipe path**
   - Choose the closest reference pattern from:
     - `references/OUTPUT_CONTRACT.md`
     - `references/RECIPES_LAYOUTS.md`, `references/RECIPES_SECTIONS.md`, `references/RECIPES_COMPONENTS.md`, `references/CANONICAL_SNIPPETS.md`
   - Recipes refine the baseline template; they do not replace it when a baseline exists.

10. **Build a class plan before writing markup**
    - Identify layout classes, component classes, utility classes, semantic wrappers, and ARIA/state attributes.
    - Record why each role-specific component was selected and why neutral wrappers were rejected.
    - Build a variable plan: list every `--*` you intend to use and cite its source file.

11. **Plan responsive behavior**
    - Decide whether each responsive concern is page-shaped (`@media`) or component-shaped (`@container`). Default to `@container` for component internals per `references/MOBILE_AND_CONTAINERS.md`.
    - Use `[popover].drawer` + `.drawer-toggle` for mobile menus; do not write a JS-toggled menu.
    - Use `100dvh` (not `100vh`) for any "fill the visible viewport" need.

12. **Apply class-first decision tree**
    - If a class exists, use it.
    - Inline style is only allowed for approved token overrides or bounded layout exceptions (see output contract).
    - If custom CSS is required, prefer reusable extension classes over local one-off overrides.

13. **Write semantic structure first, then style with classes**
    - Use landmarks and semantic tags (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, lists, tables, labels).

14. **Run accessibility minimum checks**
    - Labels, heading order, keyboard-relevant semantics, `aria-current`/state attributes, table semantics, media alt text.

15. **Run responsiveness checks**
    - Ensure composition degrades correctly at narrow widths using existing layout primitives + container queries.

16. **Run class and variable validation checks**
    - Every class in output must be traceable to hosted docs markdown, hosted templates, or installed Graffiti CSS.
    - Every inline `--*` override must map to a Registry v2 entry with `public: true`.
    - Every role-specific component must pass intent-fit validation from `references/COMPONENT_INTENT_MATRIX.md`.
    - Confirm no built-in primitives were re-implemented with custom wrappers/CSS/JS.
    - Confirm no duplicate utility/component/token system was introduced.

17. **Run aesthetic compliance checks**
    - Run the anti-slop checklist from `references/AESTHETIC_GUIDE.md`.
    - Confirm no AI-shaped content (generic copy, decorative gradients on every section, emoji icons, fake numbers, hand-drawn SVG illustrations).
    - Confirm voice is consistent throughout the output.

18. **Emit output using required contract**
    - Response must follow `references/OUTPUT_CONTRACT.md` section order.
    - Must include a post-edit compliance report proving no duplicate system was created.

19. **Handle ambiguity with deterministic defaults**
    - Apply troubleshooting defaults from `references/TROUBLESHOOTING.md`.
    - Prefer safe class-first fallback plus explicit limitation note over invented classes.

## Hosted Template Baseline Map

Use this map before writing markup:

- Landing/marketing pages -> `https://graffiti-ui.com/templates/landing`
- Dashboard/admin pages -> `https://graffiti-ui.com/templates/dashboard`
- Blog/content pages -> `https://graffiti-ui.com/templates/blog`
- Settings/account pages -> `https://graffiti-ui.com/templates/settings`
- AI chat pages -> `https://graffiti-ui.com/templates/ai-chat`
- Docs/knowledge-base pages -> `https://graffiti-ui.com/templates/docs-portal`

If no direct match exists, use recipes as primary source and state "No baseline template match found" in the output contract.

## Class-First Decision Tree

1. Is there an existing Graffiti class or class combination for this requirement?
   - **Yes:** use class-based implementation.
   - **No:** go to step 2.

2. Can this be represented as an approved token override?
   - **Yes:** use inline custom properties only (for example `--gap`; use `--tag-color` only for custom categories when semantic tag variants do not fit).
   - **No:** go to step 3.

3. Is it a bounded layout exception (for example one-off max width wrapper)?
   - **Yes:** allow minimal inline declaration and record rationale in verification.
   - **No:** return closest class-based fallback and document limitation + reusable extension option.

Status defaults:

- Prefer semantic tag variants for status labels: `.tag.success`, `.tag.warning`, `.tag.error`, `.tag.info`.
- Use `--tag-color` as a fallback for non-status category colors.
- Prefer `.card.linked` for card-as-link patterns instead of inline link reset styles.
- Prefer `.form-option-row` for checkbox/radio label rows instead of inline `display: inline-flex` recipes.
- Prefer `.row` inside forms/fieldsets for field wrappers (label + input + help text) instead of repeated `stack` + `--gap` compositions.
- Prefer `.form-actions` for submit/cancel rows instead of bare `cluster` compositions (provides responsive stacking).
- Prefer native `<dialog>` + `.close` for modal flows before custom modal wrappers or JS toggles.

## Accessibility Minimums (Must Pass)

- Landmark structure is present for page-level outputs.
- Heading hierarchy is logical (no skipped levels without rationale).
- Every form control has an accessible label.
- Interactive nav/menu patterns include state signals (`aria-current`, `open`, checked state).
- Tables use proper `table`, `thead`, `tbody`, `th`, and `td` semantics.

## Compatibility Policy

- Default output is framework-agnostic HTML.
- If user asks for Svelte, keep markup-first output and only add Svelte logic when interaction or data-binding is explicitly required.
- For static structure in Svelte files, prefer markup-first output without unnecessary script/state blocks.

## Pass/Fail Gates

Treat output as failed if any hard fail occurs:

- Unknown class names
- Unknown custom property names
- Re-implementation of built-in Graffiti primitives
- Role-specific component used outside its intended role boundary (for example `.card` as generic wrapper)
- Duplicate styling system introduced instead of Graffiti composition
- Disallowed inline styles
- Missing required semantic/accessibility structure
- Response does not follow output contract sections
- Matching hosted template exists but output does not use it as baseline (unless user explicitly requested a fresh build)
- AI-shaped content shipped (generic feature copy, fake testimonials, emoji icons, decorative gradients on multiple sections, hand-drawn SVG illustrations)
- Inline hue token override expected to propagate to opaque scales (without a theme class)
- `@media` query used for component-internal responsiveness when `@container` was appropriate

Treat output as pass only if all sections in `references/OUTPUT_CONTRACT.md` pass their checks AND the aesthetic checklist in `references/AESTHETIC_GUIDE.md` is clear.

## References

- `references/OUTPUT_CONTRACT.md`
- `references/GRAFFITI_SYSTEM.md`
- `references/COMPONENT_INTENT_MATRIX.md`
- `references/CANONICAL_SNIPPETS.md`
- `references/RECIPES_LAYOUTS.md`
- `references/RECIPES_SECTIONS.md`
- `references/RECIPES_COMPONENTS.md`
- `references/ANTI_PATTERNS.md`
- `references/RECOVERY_TRANSFORMS.md`
- `references/EXAMPLES.md`
- `references/TROUBLESHOOTING.md`
- `references/AESTHETIC_GUIDE.md`
- `references/THEMING_AND_TOKENS.md`
- `references/MOBILE_AND_CONTAINERS.md`
- `references/CHEAT_SHEET.md`
