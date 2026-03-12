---
name: graffiti-best-practices
description: Use when generating or refactoring Graffiti UI markup so output is class-first, semantic, accessible, responsive, and aligned with current Graffiti capabilities.
metadata:
  version: 1.0.0
---

# Graffiti Best Practices

Generate high-quality Graffiti markup using current library constraints.

This skill is strict about class-first composition, minimal inline style usage, semantic HTML, and repeatable quality checks.

Audience: developers using Graffiti in real applications and websites.

## Package Structure

- `SKILL.md` - activation rules, boundaries, and execution workflow
- `references/OUTPUT_CONTRACT.md` - required response structure and scoring gates
- `references/RECIPES_LAYOUTS.md` - page shell and layout recipes
- `references/RECIPES_SECTIONS.md` - section-level recipes by intent
- `references/RECIPES_COMPONENTS.md` - component-level recipe snippets
- `references/ANTI_PATTERNS.md` - failure mode catalog and detection heuristics
- `references/RECOVERY_TRANSFORMS.md` - deterministic rewrite transforms
- `references/EXAMPLES.md` - prompt/response behavior examples
- `references/TROUBLESHOOTING.md` - ambiguous prompt handling and recovery guidance

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
2. Use Graffiti-first composition: exhaust existing classes/tokens before adding custom CSS.
3. Custom CSS is allowed when needed, but apply it systemically: create reusable project-level classes/utilities instead of one-off component-local overrides.
4. Do not hardcode raw color literals (`#hex`, `rgb()`, `oklch(...)`) inline unless explicitly requested.
5. Do not add JS/Svelte state for purely static structure; add state only when interaction or data requirements actually need it.
6. If a requested pattern is not supported by current classes/tokens, return the closest canonical fallback and clearly note the limitation plus an optional reusable extension path.

## Required Workflow

Follow this sequence every time.

1. **Classify intent**
   - Map request to one or more intents: layout shell, nav, form, card surface, table/data, chat, utility/text.

2. **Select canonical recipe path**
   - Choose the closest reference pattern from:
     - `references/OUTPUT_CONTRACT.md`
     - `references/RECIPES_LAYOUTS.md`, `references/RECIPES_SECTIONS.md`, `references/RECIPES_COMPONENTS.md`

3. **Build a class plan before writing markup**
   - Identify layout classes, component classes, utility classes, semantic wrappers, and ARIA/state attributes.

4. **Apply class-first decision tree**
   - If a class exists, use it.
   - Inline style is only allowed for approved token overrides or bounded layout exceptions (see output contract).
   - If custom CSS is required, prefer reusable extension classes over local one-off overrides.

5. **Write semantic structure first, then style with classes**
   - Use landmarks and semantic tags (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, lists, tables, labels).

6. **Run accessibility minimum checks**
   - Labels, heading order, keyboard-relevant semantics, `aria-current`/state attributes, table semantics, media alt text.

7. **Run responsiveness checks**
   - Ensure composition degrades correctly at mobile widths using existing layout primitives.

8. **Emit output using required contract**
   - Response must follow `references/OUTPUT_CONTRACT.md` section order.

9. **Handle ambiguity with deterministic defaults**
   - Apply troubleshooting defaults from `references/TROUBLESHOOTING.md`.
   - Prefer safe class-first fallback plus explicit limitation note over invented classes.

## Class-First Decision Tree

1. Is there an existing Graffiti class or class combination for this requirement?
   - **Yes:** use class-based implementation.
   - **No:** go to step 2.

2. Can this be represented as an approved token override?
   - **Yes:** use inline custom properties only (for example `--gap`, `--tag-color`).
   - **No:** go to step 3.

3. Is it a bounded layout exception (for example one-off max width wrapper)?
   - **Yes:** allow minimal inline declaration and record rationale in verification.
   - **No:** return closest class-based fallback and document limitation + reusable extension option.

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
- Disallowed inline styles
- Missing required semantic/accessibility structure
- Response does not follow output contract sections

Treat output as pass only if all sections in `references/OUTPUT_CONTRACT.md` pass their checks.

## References

- `references/OUTPUT_CONTRACT.md`
- `references/RECIPES_LAYOUTS.md`
- `references/RECIPES_SECTIONS.md`
- `references/RECIPES_COMPONENTS.md`
- `references/ANTI_PATTERNS.md`
- `references/RECOVERY_TRANSFORMS.md`
- `references/EXAMPLES.md`
- `references/TROUBLESHOOTING.md`
