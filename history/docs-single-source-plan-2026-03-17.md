# Single-Source Docs Migration Plan (Runtime Fan-Out)

## Objective

Move Graffiti docs to a single authored source and fan out at runtime to all delivery surfaces.

Author once:

- Topic content in `src/docs/content/topics/*.md`
- Demo code in `src/docs/demos/*.svelte`

Deliver many (at request time):

- Human docs pages (`/base`, `/utilities`, `/elements`, `/ui-blocks`)
- Agent markdown for docs routes (`Accept: text/markdown`)
- Compatibility endpoints (`/llms.txt`, `/llms/*.txt`)

Core rule: no manual multi-surface editing.

## Phase A Status (Implemented Scaffold)

- Added markdown topic source directory: `src/docs/content/topics/*.md`
- Added shared parsing + schema normalization modules:
  - `src/docs/content/frontmatter.js`
  - `src/docs/content/schema.js`
  - `src/docs/content/topics.js`
- Added runtime content graph scaffold:
  - `src/docs/content/runtime.js`
- Added validation command:
  - `npm run check:docs-content` (`scripts/check-docs-content.mjs`)

This establishes the single-source runtime foundation without changing existing docs route behavior yet.

## Phase B Status (Pilot Cutover Started)

- `Accept: text/markdown` route map rendering now hydrates migrated topic fields from runtime content graph where slugs match (currently visible on `/elements` for `.button`).
- Added runtime compatibility endpoint: `src/routes/llms/[slug].txt/+server.ts`.
- Added runtime topic renderer: `src/docs/content/render.js`.
- Added pilot runtime-only llms topic slug to prove endpoint behavior while static files still exist:
  - `/llms/runtime-fanout-pilot.txt` (from `src/docs/content/topics/elements-runtime-fanout-pilot.md`)

This keeps existing static llms topics stable while validating runtime fan-out path in production code.

## Decision Summary

We are not using committed generated docs artifacts as the primary delivery model.

- No long-lived generated docs files as source-of-truth
- Runtime composition from a single content graph
- Validation scripts are still allowed (and required)
- Build caches created by tooling are fine, but not authored content

## Current State (Snapshot)

- Human docs authored in `src/routes/(docs)/*/+page.svelte`
- Topic docs currently exist in `static/llms/*.txt`
- Route-map markdown currently exists in `static/llms/generated/*.md`
- `src/hooks.server.ts` already performs markdown content negotiation

This is functional, but still has split authorship and drift risk.

## Target Runtime Architecture

## 1) Single authored content source

Create topic files in:

- `src/docs/content/topics/*.md`

Each topic file uses frontmatter + markdown body.

Example:

```yaml
id: buttons
title: ".button"
route: elements
order: 100
summary: "Buttons and links styled as actions."
when_to_use: "Actions and CTAs"
classes:
  - ".button"
  - ".primary"
llms_slug: buttons
demos:
  - Buttons
tags:
  - element
```

## 2) Runtime content graph service

Add a runtime module (example location: `src/docs/content/runtime.ts`) that:

- loads topic markdown via `import.meta.glob`
- parses frontmatter/body
- validates schema
- builds in-memory indexes:
  - by `route`
  - by `id`
  - by `llms_slug`
- exposes helper methods:
  - `getRouteTopics(route)`
  - `getTopicByLlmsSlug(slug)`
  - `getLlmsIndex()`

No committed generated docs files required.

## 3) Runtime docs delivery surfaces

### Human docs (`/base`, `/utilities`, `/elements`, `/ui-blocks`)

- Route `+page.server.ts` (or `+page.ts`) loads route topics from runtime content graph
- Existing Svelte pages become render shells for:
  - markdown narrative
  - live demos from registry
  - raw demo code blocks

### Agent route markdown (`Accept: text/markdown`)

- Keep negotiation in `src/hooks.server.ts`
- On markdown accept, render route map directly from runtime content graph
- No `static/llms/generated/*.md` dependency

### Compatibility endpoints

- `/llms.txt` served by endpoint from runtime content graph index
- `/llms/[slug].txt` served by endpoint from topic markdown
- During cutover, preserve existing URL behavior and format

## 4) Demo integration (still Svelte-first)

Keep demos in `src/docs/demos/*.svelte`.

Add demo registry resolver that maps demo IDs to:

- component import (live preview)
- raw source import (`?raw`) for code examples

Topic markdown references demo IDs only (no embedded Svelte).

## Migration Principles

- Additive migration first; no route breaks
- Preserve stable public URLs during transition
- Prefer runtime fan-out over committed generated docs files
- Fail fast on invalid content references

## Execution Phases

## Phase A - Runtime scaffold

Deliverables:

- `src/docs/content/topics/` with initial schema examples
- runtime content graph service
- schema validation script (`scripts/check-docs-content.mjs`)
- demo registry validation

Checks:

- required frontmatter keys
- unique `id` and `llms_slug`
- valid `route` values
- every `demos[]` item exists

## Phase B - Pilot route (Elements)

Deliverables:

- migrate Elements topics to markdown source
- load Elements page from runtime content graph
- render `/elements` markdown response from runtime content graph
- serve `/llms/buttons.txt` (and related) from runtime data path

Verification:

- docs UI parity for Elements (live demos + code)
- markdown parity for `/elements` route map
- llms endpoint parity for migrated topics

## Phase C - Remaining route migration

Deliverables:

- migrate Base, Utilities, UI Blocks topics
- route pages consume runtime content graph
- markdown negotiation for all docs routes sourced at runtime

Verification:

- no manual edits needed in old duplicated surfaces
- coverage checks show all mapped topics resolvable

## Phase D - Cutover + compatibility cleanup

Deliverables:

- replace static llms files with runtime endpoints (same paths)
- remove/retire legacy duplicated authored content
- keep redirects/aliases only where needed

Verification:

- `/llms.txt` and `/llms/*.txt` still stable externally
- no source-of-truth files under `static/llms/`

## Drift Prevention Controls

- Single authored source for topic text (`src/docs/content/topics/*.md`)
- Single source for demos (`src/docs/demos/*.svelte`)
- Runtime fan-out for all surfaces
- CI checks:
  - content schema and uniqueness
  - demo reference validity
  - endpoint/route smoke checks
  - anchor/reference consistency checks

## URL + Format Policy

- Keep `/llms.txt` and `/llms/*.txt` stable (runtime served)
- Keep docs-route markdown negotiation as primary agent strategy
- Optional `.md` alias support can be added later, but not required for this migration

## Risks and Mitigations

- Risk: runtime parsing cost
  - Mitigation: build content graph once per server process and cache in memory
- Risk: migration regressions in docs UI
  - Mitigation: route-by-route rollout with snapshot/smoke tests
- Risk: static vs endpoint path conflicts for `/llms/*`
  - Mitigation: staged cutover; remove conflicting static files only when endpoint parity is verified

## Acceptance Criteria

- All topic prose authored in `src/docs/content/topics/*.md`
- Human docs routes render from runtime content graph
- `Accept: text/markdown` docs responses render from runtime content graph
- `/llms.txt` and `/llms/*.txt` served from runtime content graph
- No hand-authored duplicated docs content in `static/llms/`
- CI enforces schema + reference + smoke checks

## Proposed Implementation Tasks

1. Add topic schema and runtime content graph service.
2. Add content validation and demo registry checks.
3. Pilot Elements route + llms runtime endpoints.
4. Migrate Base/Utilities/UI Blocks.
5. Cut over `/llms*` from static files to runtime endpoints.
6. Remove legacy duplicate authored docs and finalize contributor workflow.
