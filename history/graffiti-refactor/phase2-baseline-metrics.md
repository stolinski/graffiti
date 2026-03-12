# Phase 2 Baseline Metrics

Date: 2026-03-12  
Dex task: `qbg6hxyo`

## Scope

Measured baseline debt across the shared templates shell and all page templates:

- `src/routes/templates/+layout.svelte`
- `src/routes/templates/+page.svelte`
- `src/routes/templates/landing/+page.svelte`
- `src/routes/templates/dashboard/+page.svelte`
- `src/routes/templates/blog/+page.svelte`
- `src/routes/templates/settings/+page.svelte`
- `src/routes/templates/ai-chat/+page.svelte`

## Measurement Method

1. Counted literal inline style attributes (`style="..."`) per file.
2. Counted inline declarations by splitting each `style` value on `;`.
3. Counted Svelte style directives (`style:--token={...}`) separately.
4. Aggregated declaration/property frequency to identify the highest-leverage refactor targets.

Notes:

- Style directives only appear in `src/routes/templates/+layout.svelte` and are tracked separately from `style="..."` debt.
- Baseline is intentionally pre-refactor and includes current AI chat token overrides.

## Baseline by Template

| Template file                                 | `style="..."` attrs | Inline declarations | `style:` directives | Share of total attrs |
| --------------------------------------------- | ------------------: | ------------------: | ------------------: | -------------------: |
| `src/routes/templates/+layout.svelte`         |                   1 |                   2 |                  11 |                 0.4% |
| `src/routes/templates/+page.svelte`           |                  39 |                  47 |                   0 |                16.9% |
| `src/routes/templates/landing/+page.svelte`   |                  77 |                  95 |                   0 |                33.3% |
| `src/routes/templates/dashboard/+page.svelte` |                  20 |                  24 |                   0 |                 8.7% |
| `src/routes/templates/blog/+page.svelte`      |                  24 |                  38 |                   0 |                10.4% |
| `src/routes/templates/settings/+page.svelte`  |                  42 |                  67 |                   0 |                18.2% |
| `src/routes/templates/ai-chat/+page.svelte`   |                  28 |                  51 |                   0 |                12.1% |
| **Total**                                     |             **231** |             **324** |              **11** |             **100%** |

Top debt concentration:

- `landing` + `settings` + templates index account for **158 / 231 attrs (68.4%)**.
- `landing` alone is **33.3%** of all template inline style attrs.

## Global Declaration Frequency (Property-Level)

| Property          | Count |
| ----------------- | ----: |
| `--gap`           |    97 |
| `margin`          |    49 |
| `--tag-color`     |    21 |
| `padding`         |    15 |
| `color`           |    14 |
| `font-weight`     |    12 |
| `align-self`      |     8 |
| `align-items`     |     7 |
| `margin-inline`   |     5 |
| `text-decoration` |     4 |
| `padding-block`   |     4 |
| `max-width`       |     4 |
| `width`           |     4 |
| `border-top`      |     4 |
| `border`          |     4 |

## Top Repeated Inline Declarations (Value-Level)

| Declaration                  | Count |
| ---------------------------- | ----: |
| `margin: 0`                  |    40 |
| `--gap: var(--vs-s)`         |    29 |
| `--gap: var(--vs-xs)`        |    26 |
| `--gap: var(--vs-m)`         |    22 |
| `--tag-color: var(--green)`  |     9 |
| `--gap: var(--vs-xl)`        |     8 |
| `font-weight: 600`           |     8 |
| `--gap: 0`                   |     7 |
| `margin: var(--vs-xs) 0 0 0` |     7 |
| `align-self: start`          |     6 |

## Inline Reduction Targets (Completion Thresholds)

These thresholds are the Phase 2 targets used to determine refactor completion quality per template.

| Template file                                 | Baseline attrs | Target attrs (max) | Attr reduction target | Baseline decls | Target decls (max) | Decl reduction target |
| --------------------------------------------- | -------------: | -----------------: | --------------------: | -------------: | -----------------: | --------------------: |
| `src/routes/templates/+layout.svelte`         |              1 |                  0 |                >=100% |              2 |                  0 |                >=100% |
| `src/routes/templates/+page.svelte`           |             39 |                 10 |                 >=74% |             47 |                 15 |                 >=68% |
| `src/routes/templates/landing/+page.svelte`   |             77 |                 20 |                 >=74% |             95 |                 30 |                 >=68% |
| `src/routes/templates/dashboard/+page.svelte` |             20 |                  6 |                 >=70% |             24 |                  8 |                 >=67% |
| `src/routes/templates/blog/+page.svelte`      |             24 |                  8 |                 >=67% |             38 |                 12 |                 >=68% |
| `src/routes/templates/settings/+page.svelte`  |             42 |                 10 |                 >=76% |             67 |                 20 |                 >=70% |
| `src/routes/templates/ai-chat/+page.svelte`   |             28 |                  8 |                 >=71% |             51 |                 15 |                 >=71% |
| **Total**                                     |        **231** |             **62** |             **>=73%** |        **324** |            **100** |             **>=69%** |

These numbers are paired with mobile QA and visual parity checks in Phase 2.13; reductions alone are not sufficient for completion.
