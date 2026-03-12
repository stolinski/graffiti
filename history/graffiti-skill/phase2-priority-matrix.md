# Phase 2 Priority Matrix

Date: 2026-03-12

Scoring model:

- Impact: 1 (low) to 5 (high)
- Effort: 1 (low) to 5 (high)
- Priority score = (Impact \* 2) - Effort

Higher score means earlier execution priority.

## Prioritized Matrix

| ID  | Shortcoming                                           | Type             | Impact | Effort | Priority score | Priority band |
| --- | ----------------------------------------------------- | ---------------- | -----: | -----: | -------------: | ------------- |
| S10 | Automated checks for unknown classes + inline budget  | Process gap      |      5 |      2 |              8 | P0            |
| S1  | Add llms coverage for high-use classes/patterns       | Docs mismatch    |      5 |      2 |              8 | P0            |
| S9  | Template class-first refactor (inline debt reduction) | Template cleanup |      5 |      3 |              7 | P0            |
| S3  | Standardize `100dvh` shell guidance                   | Docs mismatch    |      4 |      1 |              7 | P0            |
| S2  | Fix stale stack/cluster defaults in docs              | Docs mismatch    |      4 |      1 |              7 | P0            |
| S6  | Add reset/alignment utility pack                      | Library gap      |      4 |      2 |              6 | P1            |
| S4  | Add semantic tag status variants                      | Library gap      |      4 |      2 |              6 | P1            |
| S5  | Add linked-card utility/variant                       | Library gap      |      3 |      2 |              4 | P1            |
| S11 | Add docs/template drift check process                 | Process gap      |      3 |      2 |              4 | P1            |
| S12 | Reinforce native-first interaction guidance           | Docs mismatch    |      3 |      2 |              4 | P1            |
| S7  | Add form row utility/pattern primitives               | Library gap      |      3 |      3 |              3 | P1            |
| S8  | Add chat theme presets                                | Library gap      |      3 |      4 |              2 | P2            |

## Priority Bands

### P0 (Immediate)

- S10, S1, S9, S3, S2
- Outcome target: remove top benchmark failure families quickly and prevent regressions.

### P1 (Near-Term)

- S6, S4, S5, S11, S12, S7
- Outcome target: reduce remaining inline fallback debt and improve consistency.

### P2 (Later)

- S8
- Outcome target: improve advanced ergonomics once core reliability work is complete.

## Suggested Dex Task Templates

Use these task titles for direct backlog creation:

1. "Add CI guardrails for class validity and inline budget"
2. "Document high-frequency Graffiti classes missing from llms references"
3. "Refactor templates to class-first composition baseline"
4. "Normalize app shell docs to 100dvh-safe patterns"
5. "Correct stack/cluster docs to CSS defaults"
6. "Add core utility set for reset/alignment hotspots"
7. "Add semantic tag status variants"
8. "Add linked-card utility and migrate related-post examples"
9. "Implement docs-template drift audit check"
10. "Enforce native-first interaction patterns in llms docs"
11. "Add form option-row utility and examples"
12. "Add class-based chat theme presets"

## Success Criteria for Phase 2 Completion

- At least 80% reduction in benchmark hard-fail incidence families.
- Template inline declaration counts materially reduced from Phase 1 baseline.
- llms docs and template usage are aligned on high-frequency patterns.
