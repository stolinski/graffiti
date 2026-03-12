# Phase 1.1 Guidance Gaps

Date: 2026-03-12

This report converts inventory findings into concrete gaps that can drive:

1. Phase 1 skill guardrails (contract/workflow behavior)
2. Phase 2 library/template/documentation improvements

## Executive Summary

- Current llms docs are strong at isolated component examples, but weak at page-level composition and class-first decision flow.
- Template reality shows heavy inline style usage (231 style attributes), primarily for spacing, text resets, and variant coloring.
- Several high-frequency classes used in templates are absent from llms docs, causing avoidable model drift.
- A few docs conflict on defaults (`cluster`/`split` gaps) and viewport strategy (`100vh` vs `100dvh`).

## Gap Register

| ID  | Gap                                                                      | Evidence                                                                                                                                         | Impact                                                     | Skill guardrail needed                                                     | Phase 2 remediation type                  |
| --- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------- |
| G1  | No explicit class-first decision tree for inline style usage             | Templates contain 231 inline `style` attributes across 7 files                                                                                   | Models overuse inline style for routine layout/text tasks  | Require class lookup first; allow inline only for approved token overrides | Cross-cutting quality process             |
| G2  | Missing llms coverage for high-use helper classes                        | `section`, `surface`, `text-muted`, `text-faint`, `text-center`, `text-end`, gradients, `toc`, `feature-card`, `stat-card` absent from llms docs | Models miss native classes and reinvent with inline styles | Require "missing-class fallback" rules and reference map in skill          | Documentation mismatch                    |
| G3  | Conflicting defaults in docs vs CSS                                      | `stack-cluster.txt` says cluster gap `1rem` and split gap `20px`; CSS uses `0.5rem` and `1rem`                                                   | Prompt outputs drift from actual rendered behavior         | Rule: when docs conflict, prefer CSS source-of-truth table in skill        | Documentation mismatch                    |
| G4  | Viewport height guidance conflicts (`100vh` vs `100dvh`)                 | `layouts.txt` and `sidebar-nav.txt` examples use `100vh`; `mobile.txt` recommends `100dvh`                                                       | Mobile shell regressions on iOS URL bar                    | Rule: app-shell/full-height layouts must use `100dvh` strategy             | Documentation mismatch + template cleanup |
| G5  | Tag/status coloring relies on repeated inline var overrides              | Top repeated clusters include `--tag-color: var(--green/blue)`                                                                                   | Excessive inline usage for common semantic states          | Rule: use semantic state mapping first, inline var as fallback             | Library API/utility gap                   |
| G6  | Frequent margin/text reset inline declarations                           | `margin: 0` appears 40 times; `margin-top` micro-adjustments are common                                                                          | Boilerplate-heavy generated markup                         | Rule: prefer utility classes for resets/alignment where available          | Library API/utility gap                   |
| G7  | Link-card patterns repeatedly use inline presentational resets           | Repeated `text-decoration: none; color: var(--fg); --gap: 0` on linked cards                                                                     | Inconsistent linked-card implementation quality            | Rule: use canonical linked-card recipe with no ad-hoc overrides            | Template-only cleanup + docs              |
| G8  | Chat shell theming requires oversized inline token block                 | AI chat template sets many color tokens inline on root shell                                                                                     | Models may copy brittle, hardcoded color blocks            | Rule: cap inline token block size and prefer named theme recipe            | Library API/utility gap                   |
| G9  | Form option row pattern lacks canonical class recipe                     | Settings template uses repeated inline `display: inline-flex; align-items: center; gap` on labels                                                | Repeated ad-hoc form row markup                            | Rule: use canonical form-row recipe or utility class                       | Library API/utility gap                   |
| G10 | llms docs are mostly component-scoped; major intent recipes are implicit | Landing/dashboard/blog/settings/chat templates show composition not captured as recipes                                                          | AI output quality varies for full-page requests            | Rule: force recipe selection by intent before generation                   | Documentation + skill workflow gap        |

## Required Skill Guardrails (Phase 1.2 Input)

1. **Class-first contract**
   - Before writing markup, map request intent to canonical recipe and class set.
   - If class exists in recipe/CSS, inline style is disallowed.

2. **Inline style exception policy**
   - Allowed: token overrides like `--gap`, `--tag-color`, `--bubble-*`, and one-off width constraints when no utility exists.
   - Disallowed: raw color literals, repeated margin resets, ad-hoc text alignment when utility exists.

3. **Inline style budget**
   - Per section: max 3 declarations.
   - Per page: max 12 declarations unless explicitly justified in a verification checklist.

4. **Conflict resolution hierarchy**
   - Source of truth order: `drop-in.css` > templates > llms docs.
   - Skill must state when docs conflict and choose CSS-compatible output.

5. **Mobile shell rule**
   - Full-height app/page shells default to `100dvh` strategy.
   - `100vh` only with explicit fallback rationale.

6. **Accessibility and semantics floor**
   - Require semantic wrappers (`header/nav/main/section/footer`, list semantics, table semantics, input/label pairing).
   - Require active state markers (`aria-current`, `open`, checked state attributes where relevant).

## Phase 2 Candidate Backlog (Task-Ready)

| Priority | Candidate task                                                                                           | Type                   | Acceptance criteria                                                                                        |
| -------- | -------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| P0       | Add llms docs for `section`, `surface`, `text-*`, gradient utilities, `toc`, `stat-card`, `feature-card` | Documentation mismatch | New docs/examples added and cross-linked from `llms.txt`; examples validated against current CSS selectors |
| P0       | Resolve `stack-cluster` default value mismatches                                                         | Documentation mismatch | Defaults in `stack-cluster.txt` match CSS (`cluster` 0.5rem, `split` 1rem)                                 |
| P0       | Normalize app shell guidance to `100dvh`                                                                 | Documentation mismatch | `layouts.txt` and `sidebar-nav.txt` app-shell examples updated to `100dvh`-safe pattern                    |
| P1       | Introduce semantic tag variants (`.tag.success/.warning/.error/.info`)                                   | Library utility gap    | Common status tag use cases no longer need inline `--tag-color`                                            |
| P1       | Add utility set for high-frequency resets/alignment (`m-0`, `mx-auto`, `self-start`, `w-full`, etc.)     | Library utility gap    | Top 5 repeated inline declarations can be replaced by class usage                                          |
| P1       | Add canonical linked-card recipe and/or utility class                                                    | Template/docs          | Linked card examples avoid inline color/text-decoration resets                                             |
| P1       | Add form option row utility/recipe                                                                       | Library utility gap    | Inline label alignment pattern removed from settings-like examples                                         |
| P2       | Add named chat shell theme presets to reduce giant inline token blocks                                   | Library API gap        | Chat examples can switch visual themes with class-level variant instead of 10+ inline tokens               |

## Skill Benchmark Risks to Track in Phase 1.6

- Over-budget inline styles despite available classes
- Wrong default spacing due to stale docs (`cluster`/`split`)
- Mobile shell regression from `100vh`
- Missing semantic structure in generated page templates
- Non-canonical handling of status/tag variants

## Definition of "Gap Resolved"

A gap is resolved only when:

1. The skill contract has a deterministic rule for it.
2. At least one canonical recipe demonstrates the correct pattern.
3. Benchmark prompts that previously failed now pass with reproducible scoring notes.
