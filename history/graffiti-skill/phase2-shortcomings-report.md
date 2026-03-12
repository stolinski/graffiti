# Phase 2 Shortcomings Report

Date: 2026-03-12

## Inputs

- `history/graffiti-skill/phase1-pattern-inventory.md`
- `history/graffiti-skill/phase1-guidance-gaps.md`
- `history/graffiti-skill/benchmark-results-phase1.md`

## Goal

Translate Phase 1 findings into direct, implementation-ready Phase 2 backlog items.

---

## Consolidated Deficiencies

| ID  | Deficiency                                                                                                                | Classification                    | Benchmark signal                              | Affected files                                                                     | User-visible outcome                                         |
| --- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| S1  | High-use classes not covered in llms docs (`section`, `surface`, `text-*`, gradients, `toc`, `stat-card`, `feature-card`) | Documentation mismatch            | Pattern drift in BP-01/02/03/05               | `static/llms.txt`, `static/llms/*.txt`                                             | AI outputs miss canonical classes and overuse inline styling |
| S2  | llms defaults conflict with CSS defaults (`cluster` and `split` gaps)                                                     | Documentation mismatch            | Layout inconsistency in BP-01/02/09           | `static/llms/stack-cluster.txt`, `src/lib/drop-in.css`                             | Generated spacing feels inconsistent vs live framework       |
| S3  | `100vh` guidance in docs conflicts with mobile-safe `100dvh` usage                                                        | Documentation mismatch            | Shell regressions in BP-11                    | `static/llms/layouts.txt`, `static/llms/sidebar-nav.txt`, `static/llms/mobile.txt` | iOS clipping/double-scroll behavior                          |
| S4  | Status tag variants require repeated inline `--tag-color` fallback                                                        | Library API/utility gap           | Inline budget pressure in BP-02/06/12         | `src/lib/drop-in.css`, template files                                              | No semantic status shorthand; noisy markup                   |
| S5  | No linked-card utility/variant (requires inline `text-decoration/color/gap` fallback)                                     | Library API/utility gap           | Remaining weakness in BP-08                   | `src/lib/drop-in.css`, blog/template docs                                          | Repeated ad-hoc linked-card patterns                         |
| S6  | Missing utilities for frequent resets/alignment (`m-0`, `mx-auto`, `self-start`, `w-full`)                                | Library API/utility gap           | Inline budget failures in BP-01/04/09         | `src/lib/drop-in.css`, `static/llms/utilities.txt`                                 | Verbose markup with repetitive inline declarations           |
| S7  | Form row alignment and preference row patterns not standardized                                                           | Library API/utility gap           | Drift in BP-04/07                             | `src/lib/drop-in.css`, settings template                                           | Inconsistent form layout patterns across outputs             |
| S8  | Chat theme ergonomics require oversized token blocks                                                                      | Library API/utility gap           | BP-05 scored 84 due token verbosity           | `src/lib/drop-in.css`, `src/routes/templates/ai-chat/+page.svelte`                 | Hard-to-maintain chat markup and weak reuse                  |
| S9  | Template inline style debt remains high in canonical templates                                                            | Template-only cleanup             | Baseline failure mode driver in BP-01..BP-09  | `src/routes/templates/*.svelte`                                                    | Templates are less copy-paste-friendly for users and models  |
| S10 | No automated guardrails for unknown classes and inline budget                                                             | Cross-cutting quality process gap | Unknown class and inline failures in BP-09/10 | CI scripts/check tooling (new), docs guidance                                      | Regressions can reappear silently                            |
| S11 | Recipe/docs coverage not tied to template drift checks                                                                    | Cross-cutting quality process gap | Periodic mismatch risk across all prompts     | `skills/...`, `static/llms/*.txt`, template routes                                 | Documentation gets stale relative to real usage              |
| S12 | Native-first interaction policy is not explicitly enforced in docs examples                                               | Documentation mismatch            | Potential JS drift in pattern generation      | `static/llms/*.txt`, especially interactive docs                                   | Unnecessary JS in simple disclosure/dialog flows             |

---

## Phase 2 Backlog Proposals with Acceptance Criteria

### S1 - Expand llms coverage for high-use classes (P0)

- **Type:** Documentation mismatch
- **Acceptance criteria:**
  - Add dedicated llms documentation/examples for `section`, `surface`, `text-muted`, `text-faint`, `text-center`, `text-end`, gradients, `toc`, `stat-card`, `feature-card`.
  - Cross-link new docs from `static/llms.txt`.
  - Validate examples only use classes in `drop-in.css`.

### S2 - Correct stale defaults in stack/cluster docs (P0)

- **Type:** Documentation mismatch
- **Acceptance criteria:**
  - `stack-cluster.txt` default values match CSS source of truth.
  - Existing examples updated and re-verified.

### S3 - Normalize shell guidance to `100dvh` (P0)

- **Type:** Documentation mismatch
- **Acceptance criteria:**
  - `layouts.txt` and `sidebar-nav.txt` app shell examples use `min-height: 100dvh`.
  - Guidance explicitly references mobile-safe viewport behavior.

### S4 - Add semantic status variants for tags (P1)

- **Type:** Library API/utility gap
- **Acceptance criteria:**
  - Implement `.tag.success`, `.tag.warning`, `.tag.error`, `.tag.info` variants.
  - Replace repeated status tag inline overrides in at least dashboard and table examples.

### S5 - Add linked-card utility/variant (P1)

- **Type:** Library API/utility gap
- **Acceptance criteria:**
  - Provide canonical linked-card class/variant that removes inline link reset requirements.
  - Update blog related-card recipe + template usage.

### S6 - Add utility pack for repetitive inline declarations (P1)

- **Type:** Library API/utility gap
- **Acceptance criteria:**
  - Add utilities covering top inline repeats (margin reset, centering, self-alignment, full-width).
  - Demonstrate reduction of repeated inline declarations in templates.

### S7 - Add form row utility/pattern primitives (P1)

- **Type:** Library API/utility gap
- **Acceptance criteria:**
  - Introduce canonical pattern/class for inline form option rows.
  - Update settings-style docs and template snippets to use it.

### S8 - Add chat theme presets (P2)

- **Type:** Library API/utility gap
- **Acceptance criteria:**
  - Add class-driven chat theme presets reducing need for large token blocks.
  - Rework AI chat template to use preset + minimal overrides.

### S9 - Refactor templates to class-first baseline (P0/P1)

- **Type:** Template-only cleanup
- **Acceptance criteria:**
  - Materially reduce inline declaration count across `src/routes/templates/*.svelte`.
  - Keep visual parity and accessibility semantics intact.
  - Document before/after inline counts per template.

### S10 - Add automated quality checks (P0)

- **Type:** Cross-cutting quality process gap
- **Acceptance criteria:**
  - Add a reproducible check for unknown classes in template/reference outputs.
  - Add inline style budget checks with fail thresholds.
  - Integrate into CI or standard validation command.

### S11 - Add docs/template drift check process (P1)

- **Type:** Cross-cutting quality process gap
- **Acceptance criteria:**
  - Add recurring check/report for class usage in templates vs docs references.
  - Fail or warn on high-use class omissions in llms docs.

### S12 - Reinforce native-first interaction guidance in docs (P1)

- **Type:** Documentation mismatch
- **Acceptance criteria:**
  - Remove or quarantine JS-first examples where native patterns exist.
  - Add explicit native-first rule callouts in interactive docs.

---

## Coverage Mapping (Benchmark Failures -> Remediation IDs)

| Benchmark failure family    | Mapped IDs              |
| --------------------------- | ----------------------- |
| Unknown/invented classes    | S1, S10, S11            |
| Inline budget overrun       | S4, S5, S6, S7, S9, S10 |
| Semantic/landmark weakness  | S9, S11, S12            |
| Competing layout strategies | S6, S9                  |
| `100vh` mobile shell bug    | S3, S9                  |

Mapped benchmark failure coverage: **5/5 families (100%)**.

---

## Recommended Execution Order

1. **P0 first:** S1, S2, S3, S10, S9-core
2. **P1 second:** S4, S5, S6, S7, S11, S12
3. **P2 third:** S8

This order maximizes immediate reliability gains while reducing recurrence risk.
