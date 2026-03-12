# Scoring Rubric

Date: 2026-03-12

## Overview

Each output is scored from 0 to 100 using weighted criteria.

Pass threshold: **85**

## Weighted Criteria

1. **Valid class usage (30 points)**
2. **Inline style policy and budget compliance (20 points)**
3. **Accessibility and semantic HTML quality (20 points)**
4. **Responsive and layout correctness (15 points)**
5. **Fidelity to canonical Graffiti patterns (15 points)**

---

## Criterion Scoring Rules

### 1) Valid class usage (0-30)

- 30: zero unknown classes
- 20: 1-2 unknown classes
- 10: 3-5 unknown classes
- 0: more than 5 unknown classes

### 2) Inline style compliance (0-20)

- 20: section and page inline budgets both pass; only approved inline categories used
- 15: minor budget overrun (<=2 declarations) or one disallowed declaration
- 8: multiple overruns/disallowed inline structure
- 0: pervasive inline sprawl

### 3) Accessibility and semantics (0-20)

Score by checklist (4 points each):

- Landmark structure
- Heading hierarchy
- Form label/state semantics
- Table/list semantics where applicable
- Navigation state semantics (`aria-current`, `open`, etc.)

### 4) Responsive/layout correctness (0-15)

- 15: canonical responsive primitives used correctly
- 10: mostly correct, minor composition issue
- 5: visible layout strategy conflicts
- 0: broken shell/section layout

### 5) Fidelity to canonical patterns (0-15)

- 15: direct alignment with recipe pack patterns
- 10: mostly aligned with minor drift
- 5: significant drift with hand-built alternatives
- 0: largely non-canonical output

---

## Hard Fail Conditions

An output is hard-fail if any condition is true:

1. Unknown classes present in final output
2. Disallowed inline style categories used repeatedly
3. Missing required semantic baseline (for example unlabeled controls in forms)
4. Output lacks required structural sections defined by output contract

Hard-fail outputs may still receive numeric scores for trend analysis, but are counted as failed.

---

## Reproducibility Protocol

For each benchmark prompt:

1. Save full model output for baseline and skill-enabled runs.
2. Count unknown classes using class extraction + CSS class dictionary from `src/lib/drop-in.css`.
3. Count inline style declarations and compare against budget.
4. Run semantics checklist manually (landmarks, headings, labels, table semantics, state semantics).
5. Assign weighted score and pass/fail.

## Score Sheet Template

Use this per prompt/run:

- Prompt ID:
- Run mode: baseline | skill-enabled
- Valid class usage: \_/30
- Inline style compliance: \_/20
- Accessibility semantics: \_/20
- Responsive/layout correctness: \_/15
- Graffiti fidelity: \_/15
- Total: \_/100
- Hard fail: yes | no
- Notes:
