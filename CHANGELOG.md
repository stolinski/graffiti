# @drop-in/graffiti

## 4.32.0

### Minor Changes

- Add the `.reactions` emoji reaction picker element.

  ### What changed
  - `.reactions` — an emoji reaction picker built on a native `<select>` with `appearance: base-select`. The whole control is a single class on the `<select>`: the trigger shows the chosen reaction and the picker opens as a horizontal bar of emoji `<option>`s. Zero JavaScript. It is token-driven (`var(--shadow-4)` elevation, `--br-l`/`--br-xl` radii, `--fg-05`/`--fg-1` surfaces, `--focus-ring`, and the motion tokens); the only component-local knob is `--reaction-size` (default `1.35rem`). The bar opens centred above the trigger (`position-area: block-start` + `justify-self: anchor-center`) and flips below via `position-try-fallbacks: flip-block` when there isn't room. Lives in the `components` layer.

  ### Migration notes
  - No breaking changes, purely additive. Use:

    ```html
    <select class="reactions" aria-label="React">
      <button><selectedcontent></selectedcontent></button>
      <option value="like" selected>
        👍<span class="visually-hidden"> Like</span>
      </option>
      <option value="love">❤️<span class="visually-hidden"> Love</span></option>
      <option value="haha">😂<span class="visually-hidden"> Haha</span></option>
    </select>
    ```

    Give the `<select>` an `aria-label` and each emoji a `.visually-hidden` text label so the choice is announced. Where customizable `<select>` is unsupported, the `<button>` / `<selectedcontent>` children are ignored and the element degrades to a normal native dropdown of the same options — no JavaScript shim.

## 4.31.0

### Minor Changes

- Add the `.fab` floating action button pattern.

  ### What changed
  - `.fab` — a circular, fixed-position, elevated primary action pinned to the bottom-inline-end corner and held clear of the device safe area. It is composition-first: pair it with `.button` (surface, color variant, hover lift, focus ring) and `.circle` (round footprint); `.fab` adds only the fixed positioning, `--z-sticky` layering, and `var(--shadow-4)` elevation, mirroring the `.bottom-nav` safe-area idiom. Default `--size: 56px`. Lives in the `components` layer.

  ### Migration notes
  - No breaking changes, purely additive. Use `<button class="button primary circle fab" aria-label="Compose"><svg aria-hidden="true">…</svg></button>`. Always supply an `aria-label` since it is icon-only. The hover lift comes from `.button` and degrades under `prefers-reduced-motion`; `.fab` adds no animation of its own.

- Add static field affixes to `.input-group`.

  ### What changed
  - `.input-group > .affix` — a new inert adornment slot for a leading currency symbol (`$`) or a trailing unit (`kg`, `%`, `USD`). The affix mirrors the native input's `--fg-05` fill, `--border-1` hairline, and `--br-m` radius and flattens the touching corners so the affix and input read as one continuous control.
  - The affix is non-interactive (`pointer-events: none`, `user-select: none`) — the real value lives in the input, so it works with native HTML + CSS and zero JavaScript.
  - `.input-group.stack-mobile` now also re-rounds and re-borders `.affix` children when the group breaks into a vertical stack under 640px.

  ### Migration notes
  - No breaking changes. Existing `.input-group` markup (input + button) is unaffected; the affix is purely additive.

- Add the `.rating` star-rating pattern in two zero-JS forms.

  ### What changed
  - `.rating` (display form) — a read-only five-star meter. Set `--rating` (0–5, decimals allowed) on a `<span class="rating">` and the fill is clipped to `--rating / 5`, so half- and quarter-stars render faithfully. Filled stars use the semantic `--warning` token; the empty track uses `--fg-2`. Retint via `--rating-on` / `--rating-off`, resize via `--rating-size`. Pair with `role="img"` + `aria-label` for the announced value.
  - `.rating` (input form) — apply the same class to a `<fieldset class="rating">` of five reversed `radio` + `label` pairs. It collects a real form value, supports keyboard selection and a hover preview, and degrades to native radio buttons when the styling is unavailable. Lives in the `components` layer.

  ### Migration notes
  - No breaking changes, purely additive. The hover/checked transition is short-circuited under `prefers-reduced-motion` by the global motion guard; `.rating` adds no animation of its own.

- Add the `.skip-link` utility — a zero-JS bypass-navigation anchor.

  ### What changed
  - `.skip-link` — screen-reader-only until it receives keyboard focus, then reveals as a pinned pill at the top inline-start of the page with the standard focus ring. Reuses the visibility idiom alongside `.visually-hidden` and lives in the `utilities` layer.

  ### Migration notes
  - No breaking changes. Add `<a class="skip-link" href="#main">Skip to content</a>` as the first focusable element and point it at your main landmark.

- Add a `.sticky` modifier for `.table` that pins the header row while the body scrolls.

  ### What changed
  - `.table.sticky` — turns the table wrapper into a vertical scroll context (capped by `--table-max-height`, default `70vh`) and pins each `<th>` via `position: sticky` so the header stays visible while rows scroll. Pure CSS, zero JavaScript; composes with `.zebra`. Header cells use an opaque `var(--bg)` so scrolling rows do not show through.

  ### Migration notes
  - No breaking changes. Existing `.table` and `.table.zebra` markup is unaffected.
  - A scroll-shadow-under-header affordance (via scroll-state container queries) is deferred until that feature gains broad browser support.

- Add a public `.toolbar` control-bar pattern and refactor `.composer` to consume it.

  ### What changed
  - `.toolbar` — new public horizontal control bar: a wrapping flex row of buttons
    and controls. Two slot children: `.toolbar > .spacer` (a `flex: 1` push-to-end
    helper, already an established slot convention) and `.toolbar > .separator`
    (a new hairline vertical divider for grouping related controls).
  - `.composer` now consumes the public `.toolbar` instead of defining a private
    `.composer > .toolbar` from scratch. The private layout rules (flex, align,
    gap) and the private `.composer > .toolbar > .spacer` were removed; the
    composer keeps only its own `padding-inline` as a context override, and the
    now-redundant `@container rail-shell` `flex-wrap: wrap` override was dropped
    since `.toolbar` ships `flex-wrap: wrap` by default.

  ### Migration notes
  - No breaking changes. `.composer` markup is unchanged — it already rendered a
    `<div class="toolbar">` with a `.spacer` child, which is now the public
    pattern. The previously component-internal `.composer > .toolbar` selectors
    (private surface per ADR-0011) are subsumed by the new public `.toolbar`.

- Add classless `<figure>` / `<figcaption>` base styling.

  ### What changed
  - Native `<figure>` now gets vertical rhythm via the `--vs-*` spacing scale.
  - Native `<figcaption>` renders one fluid step smaller (`--fl: -1`) in the muted `--fg-5` color.
  - Documented under the Base route as "Figures and captions" with a demo covering captioned media and quotations.

  ### Migration notes
  - No breaking changes. These are classless base-element rules; `.card > figure` edge-bleed styling continues to win via higher specificity.

- Add a canonical `.icon-button` pattern for icon-only actions.

  ### What changed
  - `.icon-button` — square button for an icon-only action (toolbar control, close affordance, overflow menu). Standardizes glyph size, square padding, and focus ring instead of re-deriving them per consumer. Composes with the existing button variants (`.primary`, `.ghost`, `.minimal`, `.mini`).
  - Classless glyph sizing: any `<svg>` inside a `<button>` / `.button` is sized from `--button-icon-size` (default `1.15em`), so label+icon and icon-only buttons share one optical glyph size.
  - Classless auto-square: a `button[aria-label]:has(> svg:only-child)` collapses to a square footprint with no class, while the `aria-label` requirement keeps the control accessible.

  ### Migration notes
  - No breaking changes. The new behavior is additive; the classless rules only enhance buttons that contain an `<svg>`. Existing buttons with text labels are unaffected.

- Theme the native `<mark>` element with the highlighter scale.

  ### What changed
  - `<mark>` now gets classless base styling: a translucent tint from the previously-unused `--highlighter` scale (`--highlighter-3`), inherited text color, small inline padding, and `--br-xs` rounding. It degrades to the system `Mark`/`MarkText` colors under forced-colors.
  - Documented in the Base docs as a new "Highlighted Text" topic with a demo.

  ### Migration notes
  - No breaking changes. This is additive classless base styling; override the tint by reassigning the `--highlighter` token scale.

### Patch Changes

- Fix the `<details>`/accordion height animation that was a no-op.

  ### What changed
  - Added `interpolate-size: allow-keywords` at `:root` so the authored `details::details-content` transition from `block-size: 0` to `auto` is actually interpolable. Open/close now animates height smoothly instead of snapping.
  - Scoped the declaration to `@media (prefers-reduced-motion: no-preference)` and relied on the existing global reduced-motion duration guard, so the panel snaps instead of animating when motion is reduced (ADR-0001).
  - Documented the working animation and reduced-motion behavior in the Accordion topic.

  ### Migration notes
  - No breaking changes. No new classes or tokens; the previously-inert `@starting-style`/`block-size` transition simply works now. `interpolate-size` inherits from `:root` document-wide.

- Fix dangling `.prose` reference in the editorial theme.

  ### What changed
  - Retargeted the editorial drop-cap (`.theme-editorial … ::first-letter`) from the non-existent `.prose` class to the public `.readable` long-form container, so the flourish actually applies and no rule dangles.
  - Updated the canonical theme fixture (`CanonicalFixture.svelte`) to use `.readable` instead of `.prose`.

  ### Migration notes
  - No breaking changes. `.prose` was never a shipped class; long-form content should already be wrapped in `.readable`, which now also receives the editorial drop-cap.
- Repair the published CSS and package contracts. Standalone module entries now preserve Graffiti's cascade layers, reduced-motion and print safeguards, and transitive token dependencies without leaking forced-colors overrides. Add safe-area inset tokens and collision-safe default dropdown anchors, and make every package export and CLI build and execute from a clean packed artifact.

  Correct the documented layer assignments for `.split` and `.cluster`: `.split` now receives layout-layer priority, while `.cluster` is classified as a utility. Consumers relying on their previous relative cascade priority should review composed class conflicts.

## 4.30.0

### Minor Changes

- **Chat-pattern additions + three new themes + AI chat template refresh.**

  ### New components (added to `drop-in.css`)

  Seven additive patterns, all token-driven, none renaming existing classes. Named for shape rather than AI-chat domain — they earn their place next to `.card`, `.cluster`, `.bubble`, `.chip`, `.callout`.
  - **`.icon-rail`** — narrow vertical column of icon buttons with active state and optional `.status` dot. General-purpose nav rail; sits left of a `.layout-sidebar`.
  - **`.layout-rail`** — 3-col app shell (`rail · sidebar · main`). Extends the `.layout-sidebar` pattern. Add `.with-workbench` for a 4th pane. Uses a `@container` query (not `@media`) for mobile collapse, so it responds to its own width.
  - **`.bubble.thinking`** — dashed-italic message variant for reasoning / system thought.
  - **`.bubble.streaming`** — blinking caret cursor for in-progress generation. Pure-CSS `@keyframes`.
  - **`.log-card`** — compact card with mono label header, status slot, optional `<pre>` body. Used by AI tool calls, deploy logs, build steps, activity feeds.
  - **`.composer`** — multi-line input + inline toolbar. Supersedes `.chat-composer` when you need model / tool / attach controls next to text. Useful for chat, comments, email, post surfaces.
  - **`.workbench-panel`** — right-aligned pane with tabbed body (Preview · Code · Spec). Pairs with `.layout-rail.with-workbench`. Artifact viewers, properties inspectors, code previews.
  - **`.chat-thread.flowing`** — bubble-less continuous-reading variant. Turns become rows in a single reading column. For long-form / editorial agents.

  ### Mobile

  `.layout-rail` collapses via a container query at `<768px`: rail / chat-list / workbench-panel all hide, and a `.drawer-toggle` in the header opens a `[popover].drawer` (existing Graffiti pattern) carrying agents + conversations + account. No bottom tab bar.

  ### New themes (`themes/*.css`)
  - **`theme-studio`** — warm off-white parchment + electric violet + lime accent. Inter body, moderate radii, soft layered shadows. Pushes beyond color: chips with brand-tinted hover, composer with violet focus glow, user bubbles soft-violet tint, featured cards with violet halo. Voice: Linear, Vercel, v0, Figma, Framer.
  - **`theme-signal`** — cool white + alert-red primary + presence-blue accent. Tight modular scale, crisp shadows. Pushes beyond color: bubbles flatten to card-rows (less rounded, hairline border), thread densifies, `.presence` dot utility, `.badge` unread styling, action-red primary buttons. Voice: Front, Linear inbox, Superhuman, Loops.
  - **`theme-lumen`** — off-black + amber primary + warm-white accent. Dark-first; the most opinionated theme. Pushes beyond color: composer becomes a generous pill with amber focus glow, primary buttons are amber pills with hover-glow, bubbles drop borders for tinted backgrounds, `.icon-rail > .brand` wears the amber halo, cards lose hairlines for shadow elevation, `.brand-glow` utility available. Voice: ChatGPT, Claude, Arc browser.

  All three follow the existing theme contract: set `--bg-light`/`--bg-dark`/`--fg-light`/`--fg-dark`/`--primary` plus the radii/shadow/duration scales; `@layer themes` for any component-shape overrides. Registered in `themes/index.css` so `import "@drop-in/graffiti/themes"` ships all eight presets.

  ### Templates
  - **`templates/ai-chat`** rebuilt on the new shell. Studio direction — full message anatomy in one screen (user / tool calls / assistant answer with `.callout` citations / streaming next turn / `.cluster + .chip` follow-ups / `.composer` with toolbar). Persona: Atlas, research analyst.
  - **`templates/ai-chat/inbox`** ⚐ NEW. Async / multi-participant direction — grouped feed of message-rows (not bubbles), presence dots, unread badges, right participants rail. Persona: Loop, async team agent. Wears `theme-signal`.
  - **`templates/ai-chat/stage`** ⚐ NEW. Hero empty-state direction — centered composer with four suggestion cards above and a continue-conversation pickup below. Persona: Lumen, generalist. Wears `theme-lumen`.

  Templates index gains three cards (one per direction) replacing the single AI-chat tile.

  ### Migration notes
  - No breaking changes. All additions are additive; no existing class is renamed or removed.
  - The current `.chat-composer` keeps working; `.composer` is its richer sibling for surfaces that need a toolbar.
  - The default `theme-studio` violet matches the design-tool feel many `ai-chat` consumers want; if you preferred the v4.29 green primary, override `--primary: var(--green)` on the page root.

- **Tooltip API refresh — `.tip` shorthand + standalone `aria-label` pattern.**

  ### Breaking
  - **Renamed `.tooltip-content` → `.tip`.** The rich-content pattern (parent `.tooltip` wrapper + child tip body) now uses `.tip` as the child class. Update any markup that uses `.tooltip-content`.

  ### New: standalone `.tip[aria-label]`

  Apply `.tip` to any focusable element that carries an `aria-label`. The pseudo-element reads `attr(aria-label)` for its content, so the screen-reader name and the visible tooltip text are a single source.

  ```html
  <button class="tip" aria-label="Save to draft">
    <svg>…</svg>
  </button>
  ```

  Position modifiers (`.bottom`, `.left`, `.right`) work on the same element. Plain text only — for tooltips containing links or formatted markup, keep using the `.tooltip` wrapper + child `.tip` pattern.

  ### Accessibility note

  Don't combine `.tip` with visible text content (`<button class="tip" aria-label="Save to draft">Save</button>`) — `aria-label` overrides the visible "Save" label for screen readers, which fails WCAG 2.5.3 (Label in Name). For buttons that already have visible text, use the rich `.tooltip` + child `.tip` pattern with `aria-describedby` pointing at the tip's `id`.

## 4.29.0

### Minor Changes

- ### Breaking changes
  - Redesign `.callout`. Default becomes a neutral hairline surface with a semantic icon in the gutter; `.fill` becomes a soft tint on the semantic alpha-1 fill. Removes the chrome-heavy 2px-colored-border treatment, drops `.hard` (left-stripe variant), and standardises on `--br-m` to match `.card` / `.surface`.
  - Token rename: `--callout-color` → `--callout-tint` (applies to `.fill` only). `--callout-border-color` is removed (default uses `--border-1`). New: `--callout-accent` for the semantic icon color.
  - `.callout.hard` is removed with no replacement.

## 4.28.0

### Minor Changes

- **Docs site sidebar redesign + `.sidebar-nav` variations are now documented.**

  The graffiti-ui.com docs site picks up a richer left navigation: grouped sections (Start / Foundations / Library / Customize), inline Lucide icons on every row, `.compact` density, and an opt-in `--sn-color: var(--primary)` highlighted active row. Mobile collapse behavior and routing are unchanged.

  The `/ui-blocks#sidebar-nav` topic now showcases every `.sidebar-nav` variation in a single demo so the modifiers are discoverable from one place:
  - default (filled active row, sectioned with `<details>` + `.sidebar-nav-heading`)
  - `.compact` — denser rows, smaller icons
  - `.ghost` — outlined row, no background gradient
  - `.minimal` + `.strong-active` — text-only rows with full-brightness active
  - `--sn-color: var(--primary)` — active row paints with a theme color

  The previously-shown `.sidebar-nav.primary` and `.sidebar-nav.dark` examples were removed; neither modifier exists in the framework, so the demo had been rendering them as fall-through button/tag styling. The topic's `classes` frontmatter is updated to list all real modifiers.

- **`.sidebar-nav` gains a `.strong-active` modifier and tightens nested `.tag` padding.**

  Two small additions to the existing `.sidebar-nav` component, both additive — no existing markup changes meaning.

  **`.strong-active` modifier.** When composed with `.minimal` or `.ghost`, the active row gets full `--fg` color instead of the framework's default `--fg-8` slight emphasis. Useful for sidebars where you want hierarchy via brightness and weight rather than a button-style filled active row.

  ```html
  <!-- before — active row reads as "slightly darker than inactive" -->
  <nav class="sidebar-nav minimal">
    <a aria-current="page">Active</a>
    <a>Inactive</a>
  </nav>

  <!-- after — active row reads as "the brightest thing in the list" -->
  <nav class="sidebar-nav minimal strong-active">
    <a aria-current="page">Active</a>
    <a>Inactive</a>
  </nav>
  ```

  **Tighter `.tag` padding inside `.sidebar-nav`.** `.tag`'s default padding is designed for standalone pills in cards and headers; inside a sidebar row it inflates row height. A descendant override (`.sidebar-nav .tag`) applies tighter padding (`1px 8px`) so kbd-style hints, status chips, and counts sit comfortably alongside row text.

  ```html
  <a href="/elements">
    Elements
    <span class="tag">g 4</span>
    <!-- now fits the row -->
  </a>
  ```

  Inline `style="…"` overrides on a tag continue to win as they always do; consumers wanting to re-override the padding can target `.sidebar-nav .tag` with equal-or-higher specificity.

## 4.27.0

### Minor Changes

- Add `.steps` as an alias for `.timeline`, and `.drawer.right`, `.drawer.top`, `.drawer.bottom` direction modifiers. Drawers can now be anchored to any edge — `.top`/`.bottom` slide vertically and cap at `85dvh`.

## 4.26.0

### Minor Changes

- 285de2c: **Card redesign: padding on `.card` itself, `.card-body` removed.**

  `.card` is now the padded surface — drop content directly inside without a `.card-body` wrapper. Direct `<header>`, `<footer>`, `<img>`, `<picture>`, and `<figure>` children bleed edge-to-edge through the card's padding via negative margins, so the divided-bar and edge-to-edge media patterns still work without extra markup. Children stack vertically with `gap: var(--gap)` (default `var(--vs-s)`), overridable inline.

  The old `.card-body` selector is gone. Migration:

  ```html
  <!-- before -->
  <article class="card">
    <div class="card-body stack">
      <p>…</p>
    </div>
  </article>

  <!-- after -->
  <article class="card">
    <p>…</p>
  </article>
  ```

  Header/footer/media variants are unchanged at the markup level — drop them directly as children of `.card`.

  **`--gap` is now registered as a non-inheriting `@property`.**

  Previously, setting `--gap` on a parent `.stack` would cascade into every nested `.card`, `.cluster`, or other component that read `var(--gap, …)`, producing surprising spacing. `--gap` is now registered with `inherits: false`, so each component falls back to its own designed default and only the element you set it on uses the override.

  `.cluster` and `.card` set their own `--gap` defaults explicitly (`0.5rem` and `var(--vs-s)` respectively). Inline overrides via `style="--gap: …"` work the same as before, but no longer leak into descendants.

  If you were relying on a parent's `--gap` cascading into a nested component, set `--gap` directly on that component instead.

- Add `--border-3`, `--border-4`, `--border-5` border tokens and `--ls-h1`, `--ls-h2`, `--ls-h3` letter-spacing tokens to `:root`. Heading rules now consume `var(--ls-h*)` instead of hardcoded values, making it easy for presets and users to override heading letter-spacing without fighting specificity.

## 4.25.1

### Patch Changes

- Aesthetic preset system iteration: rebuilt the demo fixture against canonical Graffiti patterns (the previous version used `<dialog open>` with override CSS, `.card` for a single non-record demo unit, and a made-up `.form-row` class), reworked five preset aesthetics with stronger references, and fixed a framework-level gap that was preventing preset `--fg`/`--font-sans` from reaching descendants.
  - **Framework fix:** the `:where([class*="theme-"])` re-derivation block now re-applies `color`, `background`, `font-family`, and `line-height` from the local tokens. Without this, descendants inherit `body`'s already-resolved values and the preset's `--fg`/`--font-sans` overrides reach nothing — every preset was silently rendering in system sans + default ink despite tokens being correctly overridden.
  - **Fixture rewrite:** `<dialog>` now uses the canonical `commandfor` / `command` API with `<button class="close">`. Card uses `<article class="card">` with proper `header` (h4 + tag) / `.card-body.stack` / `footer.cluster` structure. Forms use `.row` + `.input-group` + `.form-option-row` + `.form-actions` from canonical templates.
  - **`theme-soft-consumer`:** dropped the pink-tinted box-shadow stack — soft elevation now uses neutral cool-dark layered shadows. Listed first in the preset catalog as the most defensible v1 design.
  - **`theme-editorial`:** type ratio dropped from 1.25–1.333 to 1.2–1.25 (less wallpaper-loud). Drop cap reduced from 3.4em to 2.6em and stripped of the terracotta tint (now current-color). Brick red primary deepened.
  - **`theme-paper`:** olive primary replaced with ink blue (`#1e3a8a`, Penguin Classics convention). Type ratio locked at 1.2.
  - **`theme-brutalist`:** dropped highlighter yellow and Big Shoulders Display headlines entirely. Workhorse Inter at extreme weights for hierarchy; one saturated red accent (`#c8102e`, printer's-ink red) instead of an attempt at full monochrome (which broke `color-mix()` resolution in the button gradient and produced unreadable near-white primary buttons).
  - **`theme-neon-arcade`:** concept reframed away from generic synthwave. New direction: classic vintage arcade marquee — black background in both color schemes, cream/wheat foreground, ruby + amber palette, hard offset shadows in primary/accent (extruded marquee letter effect). Dropped magenta + cyan, dropped text-shadow glow, dropped Big Shoulders. **Still needs further refinement; flagged as known-weak.**

## 4.25.0

### Minor Changes

- Ship aesthetic preset system — five v1 presets that demonstrate Graffiti's container-scope theming. Each preset is token-dominant per ADR-0003 with focused selector rules for character treatments only. Apply via class on `:root`, `html`, or any container element; the existing theme-scope re-derivation (ADR-0006) handles re-shading inside the subtree.
  - `theme-editorial` — magazine long-form: Fraunces serif, larger ratios, terracotta accent, ivory paper / deep ink, drop-cap opener on `.prose > p:first-of-type`.
  - `theme-paper` — printable document feel: serif body, sepia warm dark, deep olive primary, zero radii, all shadows removed.
  - `theme-brutalist` — raw high-contrast: pure black + white, highlighter-yellow primary, chunky 3–5px borders, hard offset (no-blur) Memphis shadows, uppercase Big Shoulders Display headings.
  - `theme-neon-arcade` — synthwave glow: dark magenta-tinted surfaces in both color schemes, neon magenta primary + cyan accent, oklch-derived glow shadows replace the physical drop-shadow scale, Big Shoulders Display headlines with text-shadow glow.
  - `theme-soft-consumer` — modern friendly SaaS: DM Sans, soft lavender-white / warm dark, indigo primary + pink accent, generous 4–24px radii, multi-layer soft drop shadows, slightly slowed `--d-base` / `--d-slow`.

  New cascade layer: `@layer base, themes, components, utilities, layouts;` (per ADR-0003). The `themes` layer is declared in core so the order is stable whether the preset bundle is imported or not.

  New `ThemeControls` font roster entries: Fraunces (variable serif) and Big Shoulders Display (variable display-condensed) — prereqs for editorial, paper, brutalist, and neon-arcade.

  Distribution: import the full catalog with `@drop-in/graffiti/themes`, or tree-shake to a single preset via `@drop-in/graffiti/themes/<preset>`. Raw JS module variants exposed under `@drop-in/graffiti/themes/<preset>/raw` for build-tool integration.

  Demo: `/themes` route renders the same six-surface CanonicalFixture (buttons, card, form, dialog, prose, tags) under each preset so visual deltas read against identical markup.

  Small framework gap closed in passing: form elements (`input`, `textarea`, `button`, `select`) now `font-family: inherit` so preset `--font-sans` overrides flow through to controls (previously controls fell back to the browser's system UI font).

## 4.24.15

### Patch Changes

- Add semantic motion-duration and z-index stacking-tier token scales at `:root`, and refactor every transition and `z-index` declaration in `drop-in.css` to consume them. New tokens: `--d-instant`/`--d-fast`/`--d-base`/`--d-slow`/`--d-emphatic` (0.1 / 0.15 / 0.2 / 0.3 / 0.4 s) and `--z-base`/`--z-raised`/`--z-overlay`/`--z-sticky`/`--z-modal`/`--z-toast` (0 / 1 / 10 / 100 / 200 / 300). The values codify the literals already scattered through the framework so consumers — and future motion presets — share one vocabulary. Hardcoded duration and z-index numbers in component overrides should switch to `var(--d-*)` and `var(--z-*)`. See ADR-0008.

## 4.24.14

### Patch Changes

- Fix `.dark` button label color in dark mode. The previous tuning used `--button-text: light-dark(var(--white), var(--black))`, which flipped the label to black in dark mode and made the text unreadable on the dark surface. The `.dark` variant intentionally keeps a dark surface in both color schemes, so the label needs to stay white in both.

## 4.24.13

### Patch Changes

- Logical-property pass on inline-flow sizing: swap `width` / `max-width` / `min-width` to `inline-size` / `max-inline-size` / `min-inline-size` and `scroll-padding-top` to `scroll-padding-block-start`. Vertical sizing (`height`, `min-height`, `max-height`) intentionally kept physical since vertical doesn't flip in RTL. Helps in-context translation tooling and RTL consumers without changing default LTR rendering.

## 4.24.12

### Patch Changes

- Refactor print styles: move `color` to `body` only (uses `CanvasText` so forced-colors users print correctly), drop `!important` from shadow/image/no-print rules, swap `max-width` to logical `max-inline-size`. The `*` selector for background/shadow stripping is kept since it's the entire point of the print reset.

## 4.24.11

### Patch Changes

- Form fields now style as invalid via `:user-invalid` in addition to `[aria-invalid="true"]` and `.error`. The platform pseudo-class only matches after the user interacts with the field, so required-empty fields no longer show error styling on page load. `:user-valid.success` gates green styling on user interaction too.

## 4.24.10

### Patch Changes

- Replace `min-height: 100vh` with `100dvh` on `html`, `body`, and `body > .body-fill` so root-level layout stops jumping when mobile browser UI (address bar) appears or disappears.

## 4.24.9

### Patch Changes

- Fix forced-colors token overrides: the `@media (forced-colors: active)` block inside `:root` had a nested `:root { ... }` rule that resolved to the descendant selector `:root :root` and never matched. Removed the nested selector so the overrides apply to `:root` directly.

## 4.24.8

### Patch Changes

- Add Forced Colors Mode (Windows High Contrast) support. Semantic color tokens override to system keywords (`CanvasText`, `Canvas`, `LinkText`, `Mark`, `ButtonText`, etc.) in `@media (forced-colors: active)`, and `button` / `.card` get structural border fallbacks since `box-shadow` and gradient backgrounds are stripped in this mode.

## 4.24.7

### Patch Changes

- Tune `.dark`, `.light`, `.contrast` button variants to use high color-mix percentages so the surface stays solid. The previous neutral-base mix percentages (18%/28%) washed out variants whose `--button-color` is a strong anchor (`#fff`, `var(--fg)`).

## 4.24.6

### Patch Changes

- Tune `color-mix()` percentages for `.primary`, `.error`, `.warning`, `.success` button variants to preserve saturation. The previous 18%/28% / 35%/45% mixes were calibrated for a neutral gray base and washed out vivid variants in both color schemes. Variants now override the bg-top/bg-bottom/hover/active stops with high color-percentage mixes for a solid, saturated surface.

## 4.24.5

### Patch Changes

- Refactor button color system to use `color-mix()` instead of `oklch(from ... l c h)` lightness manipulation. Avoids gamut clipping on saturated tokens like `--primary`. `.dark` / `.light` / `.contrast` variants now reassign `--button-color` semantically instead of hardcoding `oklch(...)` literals. Visual character (two-stop gradient, inset gloss, hover lift, active depress) preserved.

## 4.24.4

### Patch Changes

- Flip cascade layer order to `base, components, utilities, layouts` so layout primitives win over utility classes applied to their children. Removes the two `display: none !important` workarounds in `.layout-sidebar` mobile rules that the previous order required. See `docs/adr/0002-cascade-layer-order.md`.

## 4.24.3

### Patch Changes

- Replace global `* { animation-duration: 0.01ms }` reduced-motion override with the `@property --animation-reduced` opt-in pattern. Components can now declare a reduced-motion variant per-keyframe-name instead of having all looping animations snap to their end frame. See `docs/adr/0001-reduced-motion-animation-property.md`.

## 4.24.2

### Patch Changes

- Reorganize `:root` tokens into two commented tiers — literal tokens (concrete colors, scales, durations) and semantic tokens (`--primary`, `--accent`, `--focus-ring`, `--border-*`, `--shadow-*`, `--fg`, `--bg`). No value changes; only declaration order and comment headers. Aligns with the 2-tier token model documented in `CONTEXT.md`.

## 4.24.1

### Patch Changes

- Fix focus rings on buttons, tags, and dialog elements by defining the previously-undefined `--focus-ring`, `--focus-ring-offset`, and `--focus-ring-offset-inset` tokens in `:root`. Collapses duplicate base-layer `:focus-visible` rules to use the tokens.

## 4.24.0

### Minor Changes

- Add `.table.zebra` variant that stripes even `tbody` rows with `var(--fg-05)`.

## 4.23.4

### Patch Changes

- Update `.tag` to use `var(--br-xxl)` for border radius so it follows global `--br-*` radius settings instead of using a fixed pill radius value.

## 4.23.3

### Patch Changes

- Fix sidebar navigation overflow in constrained vertical sidebars by making `.sidebar-nav` scrollable and preventing nav items from shrinking.

## 4.23.2

### Patch Changes

- Fix `.tag` fluid typography by including `.tag` in the fluid selector so `--fl: -1` applies consistently inside table cells and other inherited text contexts.

## 4.23.1

### Patch Changes

- Add reset button examples to the Buttons demo for both default and mini variant clusters.

## 4.23.0

### Minor Changes

- Typography system overhaul for tighter, more professional type rendering:
  - **Type scale**: Reduced `--font-ratio-max` from `1.33` (Perfect Fourth) to `1.25` (Major Third). Mobile scale unchanged. Desktop headings are now ~55px max instead of ~75px — strong editorial feel without poster-scale blowout.
  - **Heading line-height**: All h1–h6 now use `var(--lh-s)` (1.2) instead of inheriting `1.5` from the fluid system. Eliminates the excessive leading on large headings.
  - **Letter-spacing**: Added tighter tracking on display headings — h1: `-0.02em`, h2: `-0.015em`, h3: `-0.01em`. Compensates for optical looseness at large sizes.
  - **Font-weight tokens**: Added `--fw-medium` (500), `--fw-semibold` (600), `--fw-bold` (700) custom properties. Migrated all hardcoded font-weight values to use tokens (buttons `560` and sidebar-nav-heading `620` intentionally kept as one-offs).
  - **Hardcoded value cleanup**: Replaced all remaining hardcoded `line-height` values with token vars (`--lh-xs`, `--lh-s`, `--lh`).
  - **Pull quote**: `.pull-quote` is now a real styled component (italic, muted color, left border, proper margins) instead of just a fluid-level alias for `.fs-m`.
  - **Bottom nav**: `.bottom-nav span` switched from hardcoded `0.75rem` to fluid system (`--fl: -1`).

## 4.22.0

### Minor Changes

- Add form field rows, form actions, and improved hr defaults. `.row` now serves as a form field wrapper inside forms/fieldsets. `.form-actions` provides end-aligned action rows with mobile stacking. Global `<hr>` is now styled by default with consistent spacing and border.

## 4.21.1

### Patch Changes

- Refresh the `.tabs.pill` variant as a segmented control with a pure CSS sliding thumb and updated docs examples.

## 4.21.0

### Minor Changes

- Add `.narrow.center` for centered constrained content and `.input-group.stack-mobile` for responsive stacked form actions on small screens.

## 4.20.1

### Patch Changes

- Hardened app-shell and sidebar layout primitives so dashboard, settings, and chat templates can use class-first full-height shells with predictable scrolling and mobile fallbacks.

## 4.20.0

### Minor Changes

- Added semantic status tag variants, a linked card variant, and a form option row helper to reduce inline styling and improve class-first template ergonomics.

## 4.19.0

### Minor Changes

- Added a new `.bubble` chat message component with squircle corners, plus chat layout helpers for aligned threads and full-width composers. Updated docs, LLM docs, and the AI chat template to use the new primitives.

## 4.18.0

### Minor Changes

- Add timeline component for activity feeds and step indicators
  - Vertical layout (default) for activity feeds, changelogs, PR activity
  - Horizontal layout with `.horizontal` modifier for steppers and progress
  - Status variants: `.success`, `.warning`, `.error`, `.info` with colored glows
  - State classes: `.active` for current step, `.completed` for done steps
  - Icon-friendly 2.5rem markers with SVG sizing built-in
  - Premium visual treatment with shadows, borders, and glow effects
  - Full light/dark mode support

## 4.17.0

### Minor Changes

- Added 10 curated, theme-aware gradient utility classes (sunset, ocean, aurora, midnight, dawn, forest, lavender, neon, slate, surface) plus a .gradient-text modifier for text gradients. Each gradient is a fully designed composition with its own gradient type, angle, and color stops that adapt to light/dark mode via light-dark() color stop variables.

## 4.16.1

### Patch Changes

- Enhanced select and toggle styling: select now has dark-mode adaptive chevron, hover state with transitions, subtle box-shadow, pointer cursor, disabled styling, and fixed validation state specificity for .error/.success/.warning classes

## 4.16.0

### Minor Changes

- c6f3837: Add card, pagination, mobile app patterns, and scroll utilities

  **New components:**
  - `.card` — Content container with header/footer borders, padded body sections (`.card-body`, `main`, `section`), and full-width media support
  - `.pagination` — Layout-only pagination bar (flex row with centered page list and border-top); pairs with `.button.ghost` for controls
  - `.app-shell` — Mobile-first app container using CSS grid (`auto 1fr auto`) with safe-area inset padding and sticky header/footer
  - `.bottom-nav` — Fixed bottom tab bar with icon + label pattern, active state via `aria-current="page"`, safe-area aware
  - `.bottom-sheet` — Fixed bottom drawer with rounded top corners, drag handle pseudo-element, and safe-area bottom padding

  **New utilities:**
  - `.safe-top` / `.safe-bottom` / `.safe-x` — Apply safe-area inset padding for mobile viewports
  - `.hide-scrollbar` — Hide scrollbar cross-browser while preserving scroll
  - `.momentum-scroll` — iOS momentum scrolling with overscroll containment

  **Reworked:**
  - `.pagination` uses `.button.ghost` instead of custom button styles — pagination is now layout-only, no longer re-declares button properties
  - `.list-nav` focus state updated to use `--focus-ring` / `--focus-ring-offset-inset` tokens instead of hardcoded values

## 4.15.3

### Patch Changes

- Retune `.tag` styling to match the rounded status-pill direction with softer light-mode pastels, clearer text contrast, and less gloss while preserving existing `--tag-color`, `.muted`, and interactive behaviors.

## 4.15.2

### Patch Changes

- aba9d82: Fix CSS cascade layers - wrap base styles in @layer base so utilities can properly override element defaults (fixes .circle not working on buttons)

## 4.15.1

### Patch Changes

- Update llms.txt documentation with new utilities and variables:
  - Add .focus-ring, .transition-\*, .no-print utilities
  - Add semantic color scales (--primary-_, --error-_, etc.)
  - Add complete vertical spacing scale
  - Add CSS @layer and accessibility info
  - Remove obsolete --lh-m reference

## 4.15.0

### Minor Changes

- Add CSS @layer for cascade organization: utilities, layouts, components

  Layers are ordered from lowest to highest priority:
  - utilities (lowest)
  - layouts
  - components (highest among layers)

  Base styles and media queries are unlayered for maximum override capability.

## 4.14.15

### Patch Changes

- Standardize CSS variable fallback patterns: fix .callout to use component pattern, add documentation for gap variable conventions

## 4.14.14

### Patch Changes

- Add --vs-xxxl: 8rem to vertical spacing scale for very large spacing needs

## 4.14.13

### Patch Changes

- Add semantic color scales: --primary-1 through -9, --error-1 through -9, --warning-1 through -9, --success-1 through -9

## 4.14.12

### Patch Changes

- Add section markers: COMPONENTS, END COMPONENTS, ACCESSIBILITY & PRINT for better file navigation

## 4.14.11

### Patch Changes

- Add print styles: clean typography, link URLs, page break control, and .no-print utility

## 4.14.10

### Patch Changes

- Add transition utility classes: .transition, .transition-fast, .transition-slow, .transition-bounce, .transition-none

## 4.14.9

### Patch Changes

- Add .focus-ring and .focus-ring-inset utility classes for consistent focus styling

## 4.14.8

### Patch Changes

- Add prefers-reduced-motion support for accessibility - disables animations/transitions for users who prefer reduced motion

## 4.14.7

### Patch Changes

- Add container query to .footer so grid stacks at narrow widths (uses existing container-type)

## 4.14.6

### Patch Changes

- Remove redundant --lh-m variable (was just an alias for --lh, never used)

## 4.14.5

### Patch Changes

- Add label element to fluid type system so --fl variable works on labels

## 4.14.4

### Patch Changes

- Replace hardcoded gap: 20px with var(--gap, 1rem) in .flex, .split, and .header for token consistency

## 4.14.3

### Patch Changes

- Add text-wrap: balance to headings for more visually pleasing line breaks

## 4.14.2

### Patch Changes

- Fix duplicate comment: Purple scale → Purple deep scale

## 4.14.1

### Patch Changes

- Fix typo in CSS comment: Typeography → Typography

## 4.14.0

### Minor Changes

- Added Tabs component - pure CSS tabs using details/summary with CSS Grid and Subgrid. Features three variants: default (underline), boxed (card-style), and pill (rounded). No JavaScript required.

## 4.13.0

### Minor Changes

- Add tooltip component using CSS anchor positioning
  - Uses modern `anchor-scope` and `position-area` for clean positioning
  - No JavaScript required - pure CSS with `:hover`/`:focus-within`
  - Supports top (default), bottom, left, right positions
  - Clean API: just wrap trigger + `.tooltip-content` in `.tooltip`
  - Background inherits from theme (`--bg`), includes border and shadow

## 4.12.2

### Patch Changes

- Updated list-nav items to have individual squircle shape and shadow styling for a card-like appearance
- Removed margin-block from fluid type system. Typography elements no longer include default vertical margins, giving consumers full control over spacing.
- Refined shadow system for softer, more subtle appearance. Removed `--input-shadow` variable - buttons now use `--shadow-1` for consistency. Updated `--shadow-1` and `--shadow-2` with layered shadows that provide gentle lift without being heavy.

## 4.12.1

### Patch Changes

- Added footer component with `.footer` class and `.grid.auto` utility for responsive auto-fit grids

## 4.12.0

### Minor Changes

- 96af2b7: Added native `<dialog>` element styling with open/close animations, and a reusable `.close` button class. Demos use HTML invokers (`commandfor`/`command`) - no JavaScript required.

### Patch Changes

- 96af2b7: Added tags component - subtle category labels with customizable colors via `--tag-color`. Supports text, icons, emoji, and works as static labels or interactive links/buttons. Use `.muted` for neutral text color when you need guaranteed contrast.
- 96af2b7: Added chips component - small interactive tag/label elements for filters, categories, and selections. Supports icons, selected state (via `.selected` class or `aria-pressed`), disabled state, and a compact `.mini` variant.

## 4.11.1

### Patch Changes

- Added file dropzone component - drag-and-drop file upload zone with dashed border styling, hover/dragover states, and click-to-upload fallback using native file input

## 4.11.0

### Minor Changes

- Form improvements: fixed text input and toggle styles, added base styles for checkbox and radio inputs, added .search element with icon positioning, expanded Base docs with number, date/time, range, and file inputs

## 4.10.0

### Minor Changes

- Added input-group component for connected input + button patterns, commonly used for copy-to-clipboard, search, and form submission UIs

## 4.9.0

### Minor Changes

- 4fdcf2f: Refactored .box modifiers to use compound class syntax (.box.ghost instead of .box-ghost) and added .box.invisible variant
- 4fdcf2f: Standardized line height tokens to follow consistent sizing scale (--lh-xs, --lh-s, --lh, --lh-m, --lh-l, --lh-xl)
- 4fdcf2f: Added `.layout-sidebar.fixed` modifier for sticky sidebar layouts. The sidebar stays pinned to the viewport while main content scrolls independently - perfect for app shells and dashboards. Works seamlessly with headers/footers without requiring hardcoded heights.

### Patch Changes

- 4fdcf2f: Added --br-xl (24px) and --br-xxl (32px) border radius tokens
- 4fdcf2f: Added .pull-quote class for styled pull quote text

## 4.8.1

### Patch Changes

- Updated callout styles and added br-xl border radius utility

## 4.8.0

### Minor Changes

- 5a568c4: Added sidebar navigation component (.sidebar-nav) for app sidebars with collapsible sections using native details/summary. Fixed dropdown anchor positioning conflicts by using CSS variable (--anchor) for unique anchor names per dropdown.

## 4.7.1

### Patch Changes

- Added user menu block - a composed pattern combining avatar trigger with dropdown menu for user account navigation. Works with both image and initials avatars. Also added button reset styles for clickable avatars.

## 4.7.0

### Minor Changes

- c315536: Added `.layout-sidebar.fill` modifier for full-height sidebars and `.split.vertical` for vertical space-between layouts. Also added `@property --layout-gap` to prevent gap values from cascading to nested layout elements.

## 4.6.0

### Minor Changes

- f330776: Added avatar component for circular user images or initials. Features include:
  - Multiple size variants (xs, s, default, l, xl) via modifier classes
  - Automatic initials/icon fallback when no image provided
  - Optional bordered variant
  - Fluid typography scaling for initials

## 4.5.0

### Minor Changes

- 7cbea8f: Added dropdown menu component using native HTML popover API and CSS anchor positioning. Features include:
  - No JavaScript required for open/close behavior
  - CSS anchor positioning for automatic placement
  - Smooth open/close animations with @starting-style
  - Links and buttons inside menu are automatically styled (no extra classes needed)
  - End-aligned variant with `.dropdown.end`

## 4.4.2

### Patch Changes

- Added --separator CSS variable to breadcrumbs component for customizable separators (default: "/")

## 4.4.1

### Patch Changes

- 790d028: Added breadcrumbs component - simple breadcrumb navigation with slash separators. Uses semantic HTML with `.breadcrumbs` class on nav element, supports light/dark themes, and includes proper ARIA attributes for accessibility. Current page indicator uses `[aria-current="page"]` selector.
- d6dded6: Added toggle switch component - accessible toggle/switch input using native checkbox semantics with `.toggle` class. Supports checked, disabled, hover, and focus states. Includes `.compact` variant for smaller toggles.

## 4.4.0

### Minor Changes

- 3449db5: Added details/summary accordion component with smooth open/close animations using @starting-style and allow-discrete. Includes variants: `.bordered` (container with border), `.right` (right-aligned trigger), and `.minimal` (+/− toggle). Also added `button.minimal` for text-only buttons.

## 4.3.0

### Minor Changes

- Added new color scales and default input styles:
  - Added `--white` and `--black` static color scales (do not change with light/dark mode)
  - Added `--bg` scale (`--bg-05`, `--bg-1` through `--bg-9`) for contrasting tints that adapt to light/dark mode
  - Added default input styles for `input`, `select`, and `textarea` elements

## 4.2.0

### Minor Changes

- Adds .swipe class giving swipe components with ZERO js

## 4.1.0

### Minor Changes

- Adds JS-less swiper

## 4.0.0

### Major Changes

- - Removes tint-or-shade in favor of --fg-# vars
  - Adds initial border vars
  - Connects more vars throughout codebase

## 3.1.0

### Minor Changes

- Add new `.callout` component with multiple variants for displaying informational messages, warnings, errors, and success states.

  **New Classes:**
  - `.callout`: Base callout component with blue styling
  - `.callout.warning`: Yellow warning callout
  - `.callout.error`: Red error callout
  - `.callout.success`: Green success callout
  - `.callout.ghost`: Neutral gray callout
  - `.callout.hard`: Adds a thick left border accent

  **Features:**
  - Customizable colors via `--callout-color` and `--callout-border-color` CSS variables
  - Vertical flex layout with configurable gap
  - Resets margins on child elements for consistent spacing
  - Uses framework design tokens for padding, border radius, and colors

## 3.0.1

### Patch Changes

- Fixes Holy grail mobile

## 3.0.0

### Major Changes

- - Adds many new colors (highlighter, indego, slate, brown, amber, lime)
  - Renames layout-carousel to carousel layout-reel to reel
  - Adds header component

## 2.0.0

### Major Changes

- Adds new box styles, renames all box classes.

  New classes include:
  - .box
  - .box-glow
  - .box-semi-gloss
  - .box-semi-ghost

### Minor Changes

- Adds Header Layout component

## 1.0.0

### Major Changes

- Update color system to use alpha transparency instead of lightness variations

  All color scales (yellow, orange, red, pink, green, teal, blue, gray) now use alpha transparency from 10% to 100% opacity instead of varying lightness and chroma. This creates more consistent and predictable color scales.

  **Breaking changes:**
  - Scale 5 is now 50% opacity instead of the full base color
  - Scale 9 is now the full opacity base color
  - All intermediate scales use alpha transparency
  - Added new `--gray` base variable

  **Benefits:**
  - More predictable color behavior
  - Better layering and composition
  - Cleaner relative color syntax
  - Maintains hue and chroma consistency

### Minor Changes

- 140b9c8: Separate @drop-in/decks component styles into optional import

  Component styles for @drop-in/decks (accordion, dialog, drawer, menu, toast) are now available as a separate import to reduce main bundle size. Users who don't use @drop-in/decks components can now import just the base framework.

  **New exports:**
  - `@drop-in/graffiti/decks` - Component styles CSS file
  - `@drop-in/graffiti/decks/raw` - Component styles as JS module

  **Migration:**
  If you use @drop-in/decks components, add this import:

  ```js
  import "@drop-in/graffiti/decks";
  ```

  **Bundle size improvement:**
  Main CSS bundle is now ~15% smaller for projects that don't use decks components.

## 0.5.0

### Minor Changes

- Adds full color system and additional needed sizes

## 0.4.0

Initial release with base CSS framework features.
