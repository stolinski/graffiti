# Phase 1.1 Pattern Inventory

Date: 2026-03-12

## Scope and Inputs

- `static/llms.txt`
- `static/llms/*.txt` (38 files)
- `src/routes/templates/**/*.svelte` (7 files)
- `src/lib/drop-in.css`

## Snapshot Metrics

- Template files analyzed: 7
- llms reference files analyzed: 38
- Inline `style="..."` attributes in templates: 231
- Total inline declarations in templates: 324
- Unique classes used in templates: 76
- Template classes not represented in llms examples/docs: 14

## Canonical Pattern Matrix (Current-State)

| Intent                    | Canonical class combinations in real templates                                                                                 | Primary template references                                                                                                              | Current llms coverage                                            | Notes                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Layout shell              | `layout-readable center stack`, `section`, `surface`, `layout-sidebar fill`, `layout-split`, `layout-three-col`, `layout-card` | `src/routes/templates/landing/+page.svelte`, `src/routes/templates/dashboard/+page.svelte`, `src/routes/templates/settings/+page.svelte` | `layouts.txt`, `stack-cluster.txt`, `utilities.txt`              | Core patterns exist, but high-frequency helpers (`section`, `surface`) are under-documented in llms docs.                      |
| Navigation                | `header border` / `header border sticky`, `sidebar-nav` (+ `compact`), `breadcrumbs`, `toc`, `footer`, `cluster`               | `src/routes/templates/+layout.svelte`, `src/routes/templates/blog/+page.svelte`, `src/routes/templates/dashboard/+page.svelte`           | `header.txt`, `sidebar-nav.txt`, `breadcrumbs.txt`, `footer.txt` | `toc` is used in template and CSS but not surfaced as a first-class llms recipe.                                               |
| Forms and settings        | Native form controls + `stack`, `layout-split`, `input-group`, `toggle`, action `cluster`                                      | `src/routes/templates/settings/+page.svelte`, `src/routes/templates/blog/+page.svelte`                                                   | `forms.txt`, `input-group.txt`, `toggle.txt`, `login-form.txt`   | Core input guidance is present, but repeated inline alignment wrappers indicate missing utility variants for common form rows. |
| Cards and surfaces        | `card`, `card-body`, `card.featured`, `stat-card`, `feature-card`, `box`, `callout`                                            | `src/routes/templates/landing/+page.svelte`, `src/routes/templates/dashboard/+page.svelte`, `src/routes/templates/blog/+page.svelte`     | `card.txt`, `boxes.txt`, `callouts.txt`                          | `stat-card` and `feature-card` are used heavily but are not documented as dedicated llms recipes.                              |
| Chat UI                   | `app-shell`, `layout-sidebar wide`, `chat-thread`, `chat-row`, `chat-row self`, `chat-message`, `bubble`, `chat-composer`      | `src/routes/templates/ai-chat/+page.svelte`                                                                                              | `bubble.txt`, `mobile.txt`                                       | Chat primitives are documented, but full shell/theming guidance relies on large inline token overrides.                        |
| Tables and data           | `table` wrapper + semantic `<table>`, status `tag` color variants                                                              | `src/routes/templates/dashboard/+page.svelte`                                                                                            | `tables.txt`, `tags.txt`                                         | Table guidance is strong; status tag coloring still depends on inline `--tag-color` overrides.                                 |
| Utilities and text system | `stack`, `cluster`, `split`, `text-muted`, `text-faint`, `text-center`, `text-end`, `fs-*`, `h*`, `narrow`, gradients          | All template pages                                                                                                                       | `utilities.txt`, `typography.txt`, `variables.txt`               | High-use text helpers and gradients are defined in CSS, but only partially represented in llms docs and examples.              |

## Most Reused Class Combinations (Template Reality)

Top combinations by frequency in `src/routes/templates/**/*.svelte`:

1. `stack` (38)
2. `chip` (28)
3. `cluster` (20)
4. `tag` (19)
5. `fs-xs text-muted` (18)
6. `text-muted` (15)
7. `card-body stack` (13)
8. `text-faint fs-xs` (11)
9. `card` (9)
10. `h3` (9)
11. `fs-s` (9)
12. `layout-readable center stack` (7)
13. `button primary` (7)
14. `feature-card` (6)
15. `icon` (6)

## Top Inline Style Declarations (Top 20) with Recommendation

Category key:

- **Utility candidate**: likely deserves a reusable class to reduce repeated inline style
- **Variant candidate**: repeated token override that should map to semantic variant classes
- **Allowed exception**: acceptable inline token override under class-first policy

| Count | Declaration                          | Category          | Recommendation                                                                              |
| ----: | ------------------------------------ | ----------------- | ------------------------------------------------------------------------------------------- |
|    40 | `margin: 0`                          | Utility candidate | Add margin reset utility (for headings/paragraphs in dense card/nav contexts).              |
|    29 | `--gap: var(--vs-s)`                 | Allowed exception | Keep as token override, but define explicit "approved inline token" rule in skill contract. |
|    26 | `--gap: var(--vs-xs)`                | Allowed exception | Same as above; allowed when used only for spacing tokens.                                   |
|    22 | `--gap: var(--vs-m)`                 | Allowed exception | Same as above; constrain to layout spacing only.                                            |
|     9 | `--tag-color: var(--green)`          | Variant candidate | Add semantic tag variants (`.tag.success`, `.tag.warning`, etc.).                           |
|     8 | `--gap: var(--vs-xl)`                | Allowed exception | Same spacing-token exception rule.                                                          |
|     8 | `font-weight: 600`                   | Utility candidate | Add font-weight utility or semantic heading/meta utility.                                   |
|     7 | `--gap: 0`                           | Allowed exception | Keep for collapse patterns (`stack`/`card` compaction).                                     |
|     7 | `margin: var(--vs-xs) 0 0 0`         | Utility candidate | Add compact top-margin utility (`mt-xs`).                                                   |
|     6 | `align-self: start`                  | Utility candidate | Add self-alignment utility for CTA/button anchoring.                                        |
|     6 | `align-items: center`                | Utility candidate | Add common inline/flex center utility alias.                                                |
|     5 | `margin-inline: auto`                | Utility candidate | Add horizontal auto-centering utility (`mx-auto`).                                          |
|     5 | `--tag-color: var(--blue)`           | Variant candidate | Same semantic tag variant need as green usage.                                              |
|     4 | `color: var(--fg)`                   | Utility candidate | Add plain-link/content color utility for card links.                                        |
|     4 | `text-decoration: none`              | Utility candidate | Add `link-plain` utility for linked cards/tiles.                                            |
|     4 | `color: var(--fg-5)`                 | Utility candidate | Encourage `text-muted` class usage in docs/templates.                                       |
|     4 | `width: 100%`                        | Utility candidate | Add width utility (`w-full`) or explicit component variant where common.                    |
|     4 | `--gap: var(--vs-l)`                 | Allowed exception | Keep as spacing token exception.                                                            |
|     4 | `border-top: var(--border-1)`        | Variant candidate | Add divider utility/component pattern for section separators.                               |
|     4 | `padding: var(--pad-s) var(--pad-m)` | Variant candidate | Add compact row utility for nav/meta rows.                                                  |

## Top Inline Style Clusters (Compound Patterns)

| Count | Cluster                         | Classification                    |
| ----: | ------------------------------- | --------------------------------- |
|    26 | `--gap: var(--vs-xs)`           | Allowed exception (token spacing) |
|    24 | `--gap: var(--vs-s)`            | Allowed exception (token spacing) |
|    21 | `margin: 0`                     | Utility candidate                 |
|    20 | `--gap: var(--vs-m)`            | Allowed exception (token spacing) |
|     8 | `--tag-color: var(--green)`     | Variant candidate                 |
|     7 | `margin: var(--vs-xs) 0 0 0`    | Utility candidate                 |
|     5 | `--tag-color: var(--blue)`      | Variant candidate                 |
|     4 | `color: var(--fg-5); margin: 0` | Utility + semantic text class     |
|     4 | `align-self: start`             | Utility candidate                 |
|     4 | `width: 100%`                   | Utility candidate                 |

## Coverage Diff: Template Classes Missing from llms Docs

These classes exist in `drop-in.css` and are actively used in templates, but are not represented in llms docs/examples:

- Layout and structure: `section`, `surface`
- Text helpers: `text-muted`, `text-faint`, `text-center`, `text-end`
- Visual utilities: `gradient-aurora`, `gradient-slate`, `gradient-surface`
- Page components: `feature-card`, `stat-card`, `toc`, `icon`

## Duplicated or Conflicting Guidance in llms Docs

1. **Default gap values conflict with CSS reality**
   - `static/llms/stack-cluster.txt` says cluster gap default is `1rem` and split gap is `20px`.
   - `src/lib/drop-in.css` defines `.cluster` default gap as `0.5rem` and `.split` default gap as `1rem`.

2. **Viewport-height guidance conflicts across docs**
   - `static/llms/layouts.txt` and `static/llms/sidebar-nav.txt` app-shell examples use `height: 100vh`.
   - `static/llms/mobile.txt` recommends `100dvh` for iOS URL bar correctness.

3. **Philosophy vs examples mismatch on JS-free posture**
   - `static/llms.txt` emphasizes native-first/no JS dependency posture.
   - `static/llms/list-nav.txt` includes direct `onclick` example for primary usage pattern.

4. **Page-level composition under-documented relative to template reality**
   - Templates rely on multi-class composition (`section + layout-readable + stack + text-* + gradient/surface`) but llms docs are mostly single-component pages with minimal cross-linking.

## Implications for Phase 1 Skill Authoring

- The skill needs explicit class-first selection rules for page-level composition, not just component snippets.
- Inline style exceptions must be constrained to token overrides and tracked by a budget.
- Documentation references must include missing high-frequency classes so the model can avoid ad-hoc inline styling.
