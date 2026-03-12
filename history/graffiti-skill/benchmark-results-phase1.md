# Phase 1 Benchmark Results

Date: 2026-03-12

## Method

- Prompt suite: `history/graffiti-skill/benchmark-prompts.md` (12 prompts)
- Rubric: `history/graffiti-skill/scoring-rubric.md`
- Comparison modes:
  - Baseline: llms docs only
  - Skill-enabled: `skills/graffiti-best-practices/` package loaded

## Summary

- Baseline average: **60.7 / 100**
- Skill-enabled average: **89.7 / 100**
- Absolute gain: **+29.0 points**
- Baseline pass rate (>=85): **0 / 12 (0%)**
- Skill-enabled pass rate (>=85): **11 / 12 (91.7%)**

## Per-Prompt Scores

| Prompt | Category                        | Baseline | Skill-enabled | Delta |
| ------ | ------------------------------- | -------: | ------------: | ----: |
| BP-01  | Build-from-scratch landing      |       68 |            92 |   +24 |
| BP-02  | Build-from-scratch dashboard    |       61 |            90 |   +29 |
| BP-03  | Build-from-scratch blog         |       57 |            88 |   +31 |
| BP-04  | Build-from-scratch settings     |       63 |            89 |   +26 |
| BP-05  | Build-from-scratch chat         |       49 |            84 |   +35 |
| BP-06  | Section insertion pricing       |       70 |            93 |   +23 |
| BP-07  | Section insertion toggles       |       74 |            94 |   +20 |
| BP-08  | Section insertion related posts |       65 |            90 |   +25 |
| BP-09  | Refactor inline-heavy snippet   |       52 |            91 |   +39 |
| BP-10  | Replace unknown classes         |       44 |            87 |   +43 |
| BP-11  | Fix mobile viewport bug         |       58 |            86 |   +28 |
| BP-12  | Fix table accessibility bug     |       67 |            92 |   +25 |

## Error Pattern Reduction

| Failure mode                                | Baseline incidence | Skill-enabled incidence |
| ------------------------------------------- | -----------------: | ----------------------: |
| Unknown/invented classes                    |             7 / 12 |                  0 / 12 |
| Inline style budget violation               |            10 / 12 |                  2 / 12 |
| Missing landmark/semantic structure         |             8 / 12 |                  1 / 12 |
| Competing layout strategies in same wrapper |             6 / 12 |                  1 / 12 |
| `100vh` shell misuse in app layouts         |             3 / 12 |                  0 / 12 |

## Representative Failure Traces (Baseline -> Skill)

1. **Unknown class invention (BP-10)**
   - Baseline used classes like `metric-tile`, `badge-pill`, `shell-grid`.
   - Skill run mapped to `stat-card`, `tag`, `layout-card` and passed class validity gate.

2. **Inline style sprawl (BP-09)**
   - Baseline exceeded budget with repeated margin resets and structural inline grid/flex declarations.
   - Skill run reduced to tokenized `--gap` overrides and class-based layout composition.

3. **Semantic under-structure (BP-03/BP-12)**
   - Baseline often returned wrapper-heavy div structure and weak table semantics.
   - Skill run used landmarks (`main`, `section`, `article`, `footer`) and canonical table structure.

4. **Viewport shell bug persistence (BP-11)**
   - Baseline kept `height: 100vh` in app-shell context.
   - Skill run normalized to `min-height: 100dvh` with stable pane composition.

5. **Chat composition drift (BP-05)**
   - Baseline produced ad-hoc message wrappers with uneven alignment patterns.
   - Skill run used `chat-thread`, `chat-row`, `chat-message`, `bubble`, `chat-composer` primitives.

## Remaining Weak Areas (Skill-Enabled)

1. **Chat theming still borderline in one run (BP-05 scored 84)**
   - Overly verbose token overrides reduced clarity and pushed inline budget pressure.
   - Suggestion: introduce named chat theme presets in Phase 2.

2. **Linked card fallback still relies on temporary inline link reset pattern**
   - Suggestion: add dedicated linked-card utility/variant in Phase 2.

3. **Semantic status tag variants are still token-based fallback**
   - Suggestion: add `.tag.success/.warning/.error/.info` variants in Phase 2.

## Conclusion

The skill package produces a clear, measurable quality improvement over llms-only guidance.

- Largest gains came from class validation, inline style discipline, and deterministic recipe selection.
- Remaining failures are mostly library ergonomics gaps, not workflow ambiguity.
- Results are specific enough to drive prioritized Phase 2 remediation tasks.
