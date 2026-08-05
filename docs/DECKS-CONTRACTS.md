# Decks to Graffiti contract map

This is Graffiti's reconciliation of the accepted Decks component catalog. Registered class contracts resolve through `src/lib/registry.json`; native rows intentionally have no class registry entry. Decks owns Svelte typing and behavior. Graffiti owns the listed structure and visual states.

## Foundations and layout

| Decks API           | Graffiti contract                          | Child/state contract                                                                                                                  |
| ------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `Stack`             | `.stack`                                   | Direct children flow vertically; `--gap` is the documented spacing override.                                                          |
| `Cluster`           | `.cluster`                                 | Direct children wrap inline; `.center` centers the row.                                                                               |
| `Split`             | `.split`                                   | Direct children separate across the inline axis; `.even`, `.vertical`, `.center`.                                                     |
| `Grid`              | `.grid`, `.grid.auto`                      | Direct children form explicit or auto-fit columns.                                                                                    |
| `Section`           | `.section`                                 | Section rhythm around semantic sectioning content.                                                                                    |
| `Readable`          | `.readable`, `.narrow`, `.layout-readable` | Width constraints only; consumers keep semantic host elements.                                                                        |
| `Box`               | `.box`                                     | Neutral bounded surface; documented box modifiers remain literal classes.                                                             |
| `Surface`           | `.surface`                                 | Off-canvas section surface using existing semantic tokens.                                                                            |
| `CardGrid`          | `.layout-card`                             | Direct children are repeating card-like records.                                                                                      |
| `SidebarLayout`     | `.layout-sidebar`                          | Sidebar then main; documented fixed/fill behavior remains CSS-owned.                                                                  |
| `SplitLayout`       | `.layout-split`                            | Two responsive panes.                                                                                                                 |
| `ThreeColumnLayout` | `.layout-three-col`                        | Three responsive columns.                                                                                                             |
| `RailLayout`        | `.layout-rail`                             | `.icon-rail`, sub-sidebar, main, optional `.workbench-panel`.                                                                         |
| `HolyGrailLayout`   | `.layout-holy-grail`                       | Optional direct `.rail-start` → direct main/article → optional direct `.rail-end`; CSS owns the centered middle and responsive rails. |
| `Carousel`          | `.carousel`                                | Native scroll/snap container with direct slides.                                                                                      |
| `Reel`              | `.reel`                                    | Horizontal overflow list.                                                                                                             |
| `SwipeActions`      | `.swipe`                                   | Graffiti renders geometry; Decks owns gesture state.                                                                                  |
| `AspectRatio`       | `.aspect-*` registry group                 | Direct media fills the selected ratio box.                                                                                            |
| `VisuallyHidden`    | `.visually-hidden`                         | Content remains available to assistive technology.                                                                                    |

## Content and display

| Decks API      | Graffiti contract                | Child/state contract                                                   |
| -------------- | -------------------------------- | ---------------------------------------------------------------------- |
| `Card`         | `.card`                          | Direct `header`/`footer` opt into edge chrome; `.featured`, `.linked`. |
| `StatCard`     | `.stat-card`                     | Direct `small` label and `strong` value.                               |
| `FeatureCard`  | `.feature-card`                  | Optional `.icon`, heading, and copy.                                   |
| `Callout`      | `.callout`                       | `.warning`, `.error`, `.success`, `.ghost`, `.fill`, `.stack`.         |
| `PullQuote`    | `.pull-quote`                    | Use a native `blockquote`.                                             |
| `LogCard`      | `.log-card`                      | Direct header with `.label`/`.status`, optional `pre`.                 |
| `Avatar`       | `.avatar`                        | Image or initials; `.bordered`, `.xs`, `.s`, `.l`, `.xl`.              |
| `Tag`          | `.tag`                           | Semantic tone modifiers; interactive hosts remain links/buttons.       |
| `Pill`, `Chip` | `.chip`                          | `aria-pressed` or `.selected`; `.mini`.                                |
| `Pills`        | `.cluster` + `.chip`             | Decks owns coordinated selection.                                      |
| `Share`        | Native links/dialog + `.cluster` | No duplicate share visual primitive.                                   |
| `Accordion`    | Native `details`/`summary`       | Decks may coordinate `open`; Graffiti keeps native disclosure styling. |
| `Newsletter`   | `.newsletter`                    | Heading/form composition in a primary-tinted section.                  |

## Forms and choice

| Decks API                                   | Graffiti contract                                                                           | Child/state contract                                                                                            |
| ------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `Field`                                     | `.row`                                                                                      | Label, control, description, error in source order.                                                             |
| `Label`                                     | Native `label`                                                                              | `for`/`id` or wrapping association.                                                                             |
| `Description`                               | Native descriptive text                                                                     | Decks wires `aria-describedby`.                                                                                 |
| `Error`                                     | Native text/live region + `[aria-invalid]`                                                  | Decks owns IDs and announcement timing.                                                                         |
| `TextField`, `TextAreaField`, `SelectField` | Native control + `.row`                                                                     | Native attributes and validation states are forwarded.                                                          |
| `Checkbox`                                  | Native checkbox                                                                             | Graffiti element defaults; preserve the label.                                                                  |
| `RadioGroup`                                | Native `fieldset` + radios                                                                  | Shared `name`, legend, native arrow-key behavior.                                                               |
| `OptionRow`                                 | `.form-option-row`                                                                          | Direct checkbox/radio and label text.                                                                           |
| `Toggle`                                    | `input.toggle`                                                                              | Native checkbox state; `.compact`.                                                                              |
| `ToggleGroup`                               | `.segmented-control`                                                                        | Direct labels each contain one radio; `.compact`, `.full`.                                                      |
| `Combobox`                                  | `.combobox` + `.listbox` + `.option`                                                        | ARIA combobox relationships; active, selected, disabled, open/closed states.                                    |
| `SearchField`                               | `.search`                                                                                   | Icon plus native search input.                                                                                  |
| `InputGroup`                                | `.input-group`                                                                              | Direct input then action; `.stack-mobile`.                                                                      |
| `Dropzone`                                  | `.dropzone`                                                                                 | Full-bleed file input; `.dragover`, focus, disabled.                                                            |
| `FormActions`                               | `.form-actions`                                                                             | Direct submit/cancel controls; responsive stacking.                                                             |
| `TagInput`                                  | `.tag-input` + `.tag` + listbox contracts                                                   | Dedicated remove controls; Decks owns tokenization and keyboard behavior.                                       |
| `DatePicker`                                | `.date-picker`; optional `.calendar`, `.calendar-header`, `.calendar-grid`, `.calendar-day` | Native date input first; enhanced calendar states use native buttons/table and documented ARIA/data attributes. |

## Navigation and overlays

| Decks API                            | Graffiti contract                                                                      | Child/state contract                                                                                |
| ------------------------------------ | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `Header`                             | `.header`                                                                              | Logo/nav/actions; `.border`, `.sticky`, `.readable`.                                                |
| `Footer`                             | `.footer`                                                                              | Responsive nested grid/nav content.                                                                 |
| `Breadcrumbs`                        | `.breadcrumbs`                                                                         | Native nav/list; current item uses `aria-current="page"`.                                           |
| `Pagination`                         | `.pagination`                                                                          | Native nav/list; current page uses `aria-current`.                                                  |
| `SidebarNav`                         | `.sidebar-nav`                                                                         | Links/details/headings; active state uses `aria-current`.                                           |
| `ListNav`                            | `.list-nav`                                                                            | Direct links/buttons.                                                                               |
| `BottomNav`                          | `.bottom-nav`                                                                          | Current route uses `aria-current`; safe-area aware.                                                 |
| `IconRail`                           | `.icon-rail`                                                                           | Icon links/buttons plus optional `.status`.                                                         |
| `TableOfContents`                    | `.toc`                                                                                 | Native nav/ordered list; current section state.                                                     |
| `Menu`                               | `.dropdown` + `.dropdown-menu` + `.dropdown-header`                                    | Native popover anchor; Decks owns menu keyboard behavior.                                           |
| `Tabs`, `TabList`, `Tab`, `TabPanel` | `.tabs`                                                                                | Existing native details contract or Decks ARIA enhancement.                                         |
| `Dialog`                             | Native `dialog` + `.close` + `.stack` + `.form-actions`                                | Decks owns modal synchronization, cancel, backdrop, and focus behavior.                             |
| `ConfirmAction`                      | `Dialog` contract + semantic buttons                                                   | No second confirmation surface.                                                                     |
| `Drawer`                             | `.drawer[popover]`                                                                     | `.end`/`.right`, `.top`, `.bottom`; native popover dismissal.                                       |
| `BottomSheet`                        | `.bottom-sheet`                                                                        | Bottom-anchored safe-area surface.                                                                  |
| `Popover`                            | `.popover-anchor` + `.popover[popover]`                                                | `.end`, `.top`, `.left`, `.right`; interactive content allowed.                                     |
| `Tooltip`                            | `.tooltip` + `.tooltip-trigger` + `.tooltip-content`; `.tip` compatibility/pseudo form | `aria-describedby`, `role="tooltip"`, controlled open/closed state, registered offset/delay tokens. |

## Feedback, data, and workflow

| Decks API                      | Graffiti contract                                                                                                                      | Child/state contract                                                                                                                                                |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Toast`, `toaster`             | Canonical: `.toast-viewport`, `.toast-item`, `.toast`; optional `.toast-progress`; legacy anatomy classes are compatibility hooks only | Direct title/message/native dismiss; neutral configurable elevated surface; optional tracked progress. Existing button variants compose actions; Decks owns timing. |
| `Progress`                     | Native `progress.progress`                                                                                                             | Determinate uses `value`; indeterminate omits it.                                                                                                                   |
| `Meter`                        | Native `meter.meter`                                                                                                                   | `.signaling` opts into low/high/optimum semantic tone.                                                                                                              |
| `EmptyState`                   | `.empty`                                                                                                                               | Optional icon, heading, body, `.form-actions`; `.compact`.                                                                                                          |
| `Skeleton`                     | `.skeleton`                                                                                                                            | Decorative placeholder; `.text`, `.circle`; containing region owns busy semantics.                                                                                  |
| `Spinner`                      | `.spinner`                                                                                                                             | Status label or adjacent loading text; `.s`, `.l`.                                                                                                                  |
| `SimpleTable`                  | `.table > table`                                                                                                                       | Native table semantics; `.zebra`.                                                                                                                                   |
| `DataTable`, `ServerDataTable` | `.data-table` + `.table`                                                                                                               | Sort button/header state, selected rows, toolbar/actions, empty/loading, `.compact`, `.sticky`.                                                                     |
| `FilterBar`                    | `.data-table-toolbar` or `.cluster` + `.search` + controls                                                                             | Use table toolbar only when it controls a data table.                                                                                                               |
| `Timeline`                     | `.timeline`                                                                                                                            | Direct list items with `.marker` and semantic item states; `.horizontal`.                                                                                           |
| `Steps`                        | `.steps`                                                                                                                               | Direct list items with active/completed workflow states; `.horizontal`.                                                                                             |
| `KanbanBoard`                  | `.kanban-board`                                                                                                                        | Direct columns; horizontal responsive overflow.                                                                                                                     |
| `KanbanColumn`                 | `.kanban-column` + `.kanban-column-header`                                                                                             | `drag-over` destination state.                                                                                                                                      |
| `TaskCard`                     | `.card.kanban-card` + `.kanban-dropzone`                                                                                               | Pointer dragging, keyboard dragging, selected, active/invalid drop targets.                                                                                         |

For `Toast`/`toaster`, placement maps to a viewport modifier or logical `data-inline`/`data-block` attributes; tone maps to `.info`, `.success`, `.warning`, or `.error`; progress maps to the presence of `.toast-progress`; and duration maps to `--toast-duration`. The surface has no default border or accent marker and remains configurable through the public `--toast-*` properties.

## Application and chat

| Decks API         | Graffiti contract             | Child/state contract                                                   |
| ----------------- | ----------------------------- | ---------------------------------------------------------------------- |
| `AppShell`        | `.app-shell`                  | Direct header/main/footer, safe-area aware.                            |
| `WorkbenchPanel`  | `.workbench-panel`            | Header/tabs and `.body` inside `.layout-rail`.                         |
| `ChatThread`      | `.chat-thread`                | Direct `.chat-row` sequence; `.flowing` editorial variant.             |
| `ChatRow`         | `.chat-row`                   | `.self` aligns the current user's message.                             |
| `MessageBubble`   | `.bubble`                     | Direct content flow; thinking/streaming states remain modifiers.       |
| `MessageComposer` | `.composer`, `.chat-composer` | Text control plus direct `.toolbar`; Decks owns submission/tool state. |
| `ActivityLog`     | `.log-card` + `.stack`        | Sequence of compact log records.                                       |
