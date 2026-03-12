# Mobile Audit Matrix

Date: 2026-03-12  
Dex task: `qbg6hxyo`

## Audit Setup

- Test viewports: `1280x800` (desktop baseline), `1024x768`, `768x1024`, `390x844`.
- Test both themes: light and dark.
- Validate with keyboard navigation for interactive regions (nav, details/summary, form controls, chat composer).
- Minimum pass criteria for each checkpoint:
  - No unintended horizontal overflow
  - No clipped or hidden critical actions
  - Readable text hierarchy at each breakpoint
  - Core interactions remain discoverable and reachable

Status values for execution phases: `Pending`, `Pass`, `Follow-up`.

## Feature-Level Matrix

| Template                                                                    | Feature group to audit                                        | Breakpoints    | Pass criteria                                                                  | Status  |
| --------------------------------------------------------------------------- | ------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------ | ------- |
| `src/routes/templates/+page.svelte` + `src/routes/templates/+layout.svelte` | Template card grid wrapping and card content readability      | 1024, 768, 390 | Cards reflow without overlap/cutoff; titles and chip rows stay readable        | Pending |
| `src/routes/templates/+page.svelte` + `src/routes/templates/+layout.svelte` | Header/nav wrapping and action alignment                      | 1024, 768, 390 | Back link/theme controls/header rows do not collide or overflow                | Pending |
| `src/routes/templates/+page.svelte` + `src/routes/templates/+layout.svelte` | Shared shell spacing/rhythm at narrow widths                  | 768, 390       | Vertical rhythm stays consistent; no compressed or excessive gaps              | Pending |
| `src/routes/templates/+page.svelte` + `src/routes/templates/+layout.svelte` | Sticky or overflow behavior in shared shell                   | 1024, 768, 390 | Sticky regions remain usable; scrolling is predictable                         | Pending |
| `src/routes/templates/landing/+page.svelte`                                 | Hero copy measure and CTA cluster wrapping                    | 1024, 768, 390 | Headline and lead remain readable; CTA buttons wrap cleanly                    | Pending |
| `src/routes/templates/landing/+page.svelte`                                 | Logo bar overflow/wrap behavior                               | 1024, 768, 390 | Brand row wraps or scrolls intentionally; no clipping                          | Pending |
| `src/routes/templates/landing/+page.svelte`                                 | Feature/testimonial/pricing card grid collapse                | 1024, 768, 390 | Grid collapse is orderly; cards keep readable padding and hierarchy            | Pending |
| `src/routes/templates/landing/+page.svelte`                                 | Split section stacking order and spacing                      | 768, 390       | Content and visual blocks stack in logical order with usable spacing           | Pending |
| `src/routes/templates/landing/+page.svelte`                                 | FAQ readability and tap targets                               | 768, 390       | Summary rows are readable and easy to tap; open content remains legible        | Pending |
| `src/routes/templates/landing/+page.svelte`                                 | Footer column stacking and link readability                   | 768, 390       | Footer nav groups stack cleanly; links remain scannable                        | Pending |
| `src/routes/templates/dashboard/+page.svelte`                               | Sidebar collapse/stacking and nav usability                   | 1024, 768, 390 | Sidebar remains navigable and does not trap content off-screen                 | Pending |
| `src/routes/templates/dashboard/+page.svelte`                               | Top bar title/actions/filter control wrapping                 | 1024, 768, 390 | Header controls wrap without overlap; primary actions remain visible           | Pending |
| `src/routes/templates/dashboard/+page.svelte`                               | KPI/stat card grid behavior                                   | 1024, 768, 390 | Cards reflow cleanly and preserve value/label readability                      | Pending |
| `src/routes/templates/dashboard/+page.svelte`                               | Table overflow and horizontal scroll affordance               | 1024, 768, 390 | Table remains readable with intentional scroll behavior on narrow widths       | Pending |
| `src/routes/templates/dashboard/+page.svelte`                               | Status readability and action/button tap-target quality       | 768, 390       | Status signals stay clear; interactive controls remain easy to tap             | Pending |
| `src/routes/templates/blog/+page.svelte`                                    | TOC sticky-to-static behavior and link usability              | 1024, 768, 390 | TOC is discoverable, readable, and does not obstruct article content           | Pending |
| `src/routes/templates/blog/+page.svelte`                                    | Article reading measure and heading spacing                   | 1024, 768, 390 | Line length and vertical rhythm remain comfortable for long-form reading       | Pending |
| `src/routes/templates/blog/+page.svelte`                                    | Callout readability and wrapping                              | 768, 390       | Callouts preserve contrast and avoid awkward overflow                          | Pending |
| `src/routes/templates/blog/+page.svelte`                                    | Related-card grid collapse and linked-card affordance         | 1024, 768, 390 | Cards stack/reflow cleanly and remain clearly clickable                        | Pending |
| `src/routes/templates/blog/+page.svelte`                                    | Newsletter input-group stacking and action alignment          | 768, 390       | Input/button layout remains usable without clipping                            | Pending |
| `src/routes/templates/settings/+page.svelte`                                | Sidebar-to-content stacking order and spacing                 | 1024, 768, 390 | Navigation and content maintain logical order and usable separation            | Pending |
| `src/routes/templates/settings/+page.svelte`                                | Profile form field transition (multi-column to single-column) | 1024, 768, 390 | Inputs stack cleanly; labels remain associated and readable                    | Pending |
| `src/routes/templates/settings/+page.svelte`                                | Toggle row alignment and label readability                    | 768, 390       | Preference rows keep label/control alignment and tappable controls             | Pending |
| `src/routes/templates/settings/+page.svelte`                                | Appearance options wrapping and control spacing               | 768, 390       | Radio/selection controls wrap cleanly with clear grouping                      | Pending |
| `src/routes/templates/settings/+page.svelte`                                | Danger-zone callout readability and action placement          | 768, 390       | Warning copy stays readable; destructive action remains obvious and accessible | Pending |
| `src/routes/templates/ai-chat/+page.svelte`                                 | Conversation list pane visibility/stacking                    | 1024, 768, 390 | Pane collapse/stacking is predictable and discoverable                         | Pending |
| `src/routes/templates/ai-chat/+page.svelte`                                 | Thread container scroll and spacing behavior                  | 1024, 768, 390 | Thread scroll works without clipping; spacing remains readable                 | Pending |
| `src/routes/templates/ai-chat/+page.svelte`                                 | Message bubble width, wrapping, and alignment                 | 1024, 768, 390 | Messages wrap correctly; self/other alignment remains clear                    | Pending |
| `src/routes/templates/ai-chat/+page.svelte`                                 | Composer placement and input-group usability                  | 768, 390       | Composer remains docked/visible and easy to interact with                      | Pending |
| `src/routes/templates/ai-chat/+page.svelte`                                 | Tap-target quality for row actions/list items                 | 768, 390       | Chat rows and action controls are comfortably tappable                         | Pending |

## Evidence Plan for Phase 2.13

- Capture screenshots per template at each audit breakpoint.
- Record any `Follow-up` items with exact template path and feature group.
- Link findings into:
  - `history/graffiti-refactor/phase2-visual-qa-report.md`
  - `history/graffiti-refactor/phase2-verification-log.md`
