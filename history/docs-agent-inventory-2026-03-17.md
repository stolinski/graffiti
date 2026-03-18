# Docs Inventory Baseline (2026-03-17)

This baseline captures the documentation surface before agent-optimization changes. It is intended to reduce migration risk and avoid content loss.

## Inventory Scope

- Human docs routes: `src/routes/(docs)/`
- Reusable docs components: `src/docs/`
- Demo source files: `src/docs/demos/*.svelte`
- Existing agent docs index and topics: `static/llms.txt`, `static/llms/*.txt`

## Top-Level Counts

- Docs files under `src/docs/`: 43
- Demo files under `src/docs/demos/`: 40
- Section files under `src/docs/sections/`: 1
- Docs pages under `src/routes/(docs)/**/+page.svelte`: 6
- Topic files under `static/llms/*.txt`: 38

## Human Docs Route Surface

- `src/routes/(docs)/+page.svelte` (Get Started)
- `src/routes/(docs)/base/+page.svelte`
- `src/routes/(docs)/utilities/+page.svelte`
- `src/routes/(docs)/elements/+page.svelte`
- `src/routes/(docs)/ui-blocks/+page.svelte`
- `src/routes/(docs)/changelog/+page.svelte`

Shared shell and navigation:

- `src/routes/(docs)/+layout.svelte`

## Demo Usage Mapping (Route -> Demo Files)

- `src/routes/(docs)/elements/+page.svelte`
  - Uses 21 demos: `Avatar.svelte`, `Bubble.svelte`, `Buttons.svelte`, `Callout.svelte`, `Card.svelte`, `Carousel.svelte`, `Chips.svelte`, `Dialog.svelte`, `Dropzone.svelte`, `FeatureCard.svelte`, `FeaturedCard.svelte`, `InputGroup.svelte`, `ListNav.svelte`, `Reel.svelte`, `Search.svelte`, `Select.svelte`, `StatCard.svelte`, `Tabs.svelte`, `Tags.svelte`, `Toggle.svelte`, `Tooltip.svelte`
- `src/routes/(docs)/ui-blocks/+page.svelte`
  - Uses 17 demos: `AppShell.svelte`, `BottomNav.svelte`, `BottomSheet.svelte`, `Breadcrumbs.svelte`, `ConfirmDialog.svelte`, `Details.svelte`, `Dropdown.svelte`, `Footer.svelte`, `FormActions.svelte`, `FormRow.svelte`, `LoginForm.svelte`, `Pagination.svelte`, `SidebarNav.svelte`, `Timeline.svelte`, `TimelineStatus.svelte`, `TimelineStepper.svelte`, `UserMenu.svelte`
- `src/routes/(docs)/+page.svelte`
  - Imports `UserMenu.svelte` but does not currently render a `CodeExample`
- `src/routes/(docs)/base/+page.svelte`
  - No `src/docs/demos/*` imports (inline examples only)
- `src/routes/(docs)/utilities/+page.svelte`
  - No `src/docs/demos/*` imports (inline examples only)
- `src/routes/(docs)/changelog/+page.svelte`
  - Uses markdown source (`CHANGELOG.md`) via `@humanspeak/svelte-markdown`

### Demo Usage Totals

- Demos referenced by docs pages: 38
- Demos currently not referenced by docs pages: `Gradients.svelte`, `Mobile.svelte`

## Existing Agent Docs Surface

- Agent entry index: `static/llms.txt`
- Topic files: 38 under `static/llms/*.txt`

### llms Topics Not Directly Derived From Demo Filenames

- `accordion`, `boxes`, `callouts`, `forms`, `header`, `layouts`, `stack-cluster`, `swipe`, `tables`, `typography`, `utilities`, `variables`

### Demo Files Missing a Matching llms Slug (name-derived)

- `AppShell`, `BottomNav`, `BottomSheet`, `Callout`, `Details`, `FeatureCard`, `FeaturedCard`, `FormActions`, `FormRow`, `Gradients`, `Select`, `StatCard`, `TimelineStatus`, `TimelineStepper`

## Risk Notes Before Migration

- Human docs and agent docs are currently maintained in separate structures, which increases drift risk.
- Some content is class-first in `static/llms/*.txt` but not clearly connected to route sections.
- Several docs pages are large; agents that read first-N lines can miss canonical usage patterns.

## Preservation Checklist For Agent Optimization

- Keep all existing human docs routes and rendered content unchanged.
- Keep current topic-level llms docs available during migration.
- Add manifest-driven generation as an additive layer first.
- Start with one section (`Elements`) before wider rollout.
- Keep this baseline file as regression reference during follow-up updates.

## Migration Status Snapshot (2026-03-17)

Current manifest and generated agent docs status:

- **Map-driven routes (ordered topic maps):**
  - `base` -> `static/llms/generated/base.md`
  - `utilities` -> `static/llms/generated/utilities.md`
  - `elements` -> `static/llms/generated/elements.md`
  - `ui-blocks` -> `static/llms/generated/ui-blocks.md`
- **Guide-driven routes (shallow references):**
  - `changelog` -> `static/llms/generated/changelog.md`
- **Agent index:**
  - `static/llms/generated/index.md`

Validation guardrails:

- `scripts/check-agent-docs.mjs` verifies:
  - section and guide slug uniqueness
  - routePath collisions between sections and guides
  - existence of every referenced `static/llms/*.txt` file in section topic maps
  - docs route file existence for every section/guide routePath
  - fallback anchor existence for topics that use `routeAnchor` instead of `llmsFile`
- `scripts/report-agent-docs-coverage.mjs` writes:
  - `history/docs-agent-coverage-latest.md` with section topic maps, extracted route headings, and uncovered IDs summary

Remaining route-level migration opportunities:

- Optionally add a dedicated map for the root docs route (`/`) if route-specific topic ordering is needed beyond the index.
- Add a generated coverage report that maps route topics to rendered headings for drift detection.
