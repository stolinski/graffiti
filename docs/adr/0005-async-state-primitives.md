# Async-state primitives: `.spinner`, `[aria-busy]`, `<progress>`, `<meter>`

Graffiti ships three distinct async-state surfaces, deliberately scoped so each communicates a different thing to users:

- `<progress>` — determinate or indeterminate progress bar (native HTML). Styled in `@layer base` with the system's `--primary` palette so the element-default works out of the box.
- `<meter>` — known-range gauge (native HTML, e.g. password strength, disk usage). Styled neutrally by default in `@layer base`; `.meter.signaling` opts into red/yellow/green coloring driven by the element's native `low` / `optimum` / `high` attributes.
- `.spinner` — standalone inline indeterminate loader, a component in `@layer components`. Coexists with `button[aria-busy="true"]`, which styles a busy button by overlaying a spinner, dimming the label, and disabling interaction via `pointer-events: none`.

**Superseded by [ADR-0017](./0017-decks-contracts-and-legacy-di-deprecation.md):** the accepted Decks catalog established a reusable `.skeleton` paint/shape primitive while leaving app-specific placeholder composition to consumers. The original concern remains valid at the composition layer, but it no longer blocks the base visual contract.

## Why three patterns instead of one universal `[aria-busy]`

`aria-busy` is the right a11y signal for "this region is updating," and `button[aria-busy]` leans on it directly. But a marketing page that wants a loading icon next to text ("Fetching prices…") shouldn't attach `aria-busy` to an arbitrary host element just to get a visual. A standalone `.spinner` element with `role="status"` and `aria-label` is the right shape for that case. Inline spinners and busy-buttons are genuinely different surfaces; collapsing them loses meaning.

`<progress>` and `<meter>` are kept distinct because they signal different things to users: `<progress>` is "work in flight," `<meter>` is "a current value within a known range." Browsers and assistive tech already differentiate them; Graffiti follows the element semantics instead of papering over them with a unified `.progress` component.

## Considered options

- **`[aria-busy]` as the universal switch.** Rejected — forces author to attach the attribute to host elements that have no busy state of their own.
- **Drop `.spinner` entirely, use `<progress>` indeterminate inline.** Rejected — `<progress>` is a horizontal bar; inline spinners are circular and small. Different shapes for different contexts.
- **`<meter>` always shows traffic-light colors.** Rejected — meters used for neutral "fill" indicators (e.g., a quota indicator that's just showing "60% used" without judgment) shouldn't accidentally turn red. `.meter.signaling` makes the color-by-position behavior explicit opt-in.
- **`<meter>` neutral with no opt-in.** Rejected the other direction — the whole point of `<meter>`'s `low`/`optimum`/`high` attributes is range position; not honoring them by default in some form is leaving the semantic on the floor.

## Reduced-motion contract (per [ADR 0001](./0001-reduced-motion-animation-property.md))

- **`.spinner`** stops entirely under `prefers-reduced-motion`. Visual indication is preserved by `role="status"` and `aria-label`; screen-reader users get the same signal regardless of animation. Sighted users see a static circular icon, which is a clear "loading" affordance without rotation.
- **`<progress>` indeterminate** uses a slow-slide `--animation-reduced` variant (the existing `.progress-indeterminate` precedent in ADR 0001: `slide 1s` → `slide 20s`).
- **`button[aria-busy="true"]`** — the spinner inset inherits `.spinner`'s reduced-motion behavior (stops entirely).

## Consequences

- Every author writing a busy button only needs to flip `aria-busy="true"` to get visual + interactive disable in one step. The `disabled` attribute is no longer required for the "submitting" state, which previously had to be paired manually.
- `<meter>` without `.signaling` will *not* turn red even when its value is below `low`. Authors who want the traffic-light semantic must opt in. This is a deliberate change from native browser default styling.
- `.spinner`'s "stop entirely" reduced-motion behavior means motion-sensitive users will see a static circle. The `role="status"` and `aria-label` carry the meaning. Authors who want a slow-pulse fallback can override `--animation-reduced` per-instance.
