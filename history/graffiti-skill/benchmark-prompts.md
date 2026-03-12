# Phase 1 Benchmark Prompts

Date: 2026-03-12

## Benchmark Design

Goal: compare output quality between:

1. **Baseline**: llms docs only (`static/llms.txt` + `static/llms/*.txt`)
2. **Skill-enabled**: full `skills/graffiti-best-practices/` package

Prompt set covers:

- Build-from-scratch pages
- Section insertion tasks
- Refactor/cleanup tasks
- Bug-fix/layout/accessibility tasks

## Execution Protocol

For each prompt:

1. Run once in baseline mode.
2. Run once in skill-enabled mode.
3. Score both outputs with `scoring-rubric.md`.
4. Record scores, hard fails, and failure traces.

---

## Prompt Set

### Build-From-Scratch

**BP-01 (landing page)**

"Build a complete SaaS landing page using Graffiti classes only. Include hero, feature grid, pricing cards, FAQ, and footer. No custom CSS."

**BP-02 (dashboard)**

"Create an admin dashboard shell with sidebar navigation, KPI stat cards, filters row, and a recent orders table with status tags."

**BP-03 (blog)**

"Build a blog article template with sticky table of contents, article body, related posts, and newsletter signup section."

**BP-04 (settings)**

"Create an account settings page with profile form, notification toggles, appearance preferences, and a danger zone section."

**BP-05 (chat)**

"Build a two-pane AI chat UI with conversation list, message thread, user/assistant bubbles, and message composer."

### Section Insertion

**BP-06 (pricing insertion)**

"Insert a 3-tier pricing section into this landing page using existing Graffiti patterns. Highlight the middle plan as recommended."

**BP-07 (settings insertion)**

"Add a notification preferences section with 4 toggle rows to this existing settings page."

**BP-08 (blog insertion)**

"Add a related articles section with 3 linked cards below this blog article."

### Refactor

**BP-09 (inline cleanup)**

"Refactor this inline-style-heavy snippet into class-first Graffiti markup. Remove unnecessary style attributes and improve semantics."

**BP-10 (unknown classes cleanup)**

"Replace non-Graffiti classes (`metric-tile`, `badge-pill`, `shell-grid`) with valid Graffiti classes while preserving layout intent."

### Bug-Fix

**BP-11 (mobile viewport bug)**

"Fix this app shell so it no longer clips on iOS Safari when browser chrome appears/disappears."

**BP-12 (table accessibility bug)**

"Fix this table block for accessibility and semantics while keeping Graffiti styling."

---

## Acceptance Coverage Mapping

- Landing intent: BP-01, BP-06
- Dashboard intent: BP-02, BP-10, BP-11
- Blog intent: BP-03, BP-08
- Settings intent: BP-04, BP-07
- Chat intent: BP-05
- Refactor quality guardrails: BP-09, BP-10
- Accessibility-specific fix: BP-12

Total prompts: 12
