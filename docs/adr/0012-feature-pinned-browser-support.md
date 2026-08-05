# Feature-pinned browser support, not version-pinned

Graffiti's browser-support contract is expressed as a list of **Web Platform features the framework depends on**, not as a list of browser-version floors. The actual minimum versions are published in [`docs/BROWSER-SUPPORT.md`](../BROWSER-SUPPORT.md) as a *reference snapshot* — useful for sanity-checking but not part of the contract. The contract is: if a browser supports the listed features, Graffiti works in it; the framework will not polyfill or shim features it depends on.

Today's feature list:

- `oklch()` colour values
- `light-dark()` colour function
- Relative colour syntax (`oklch(from var(--x) l c h / N)`)
- `color-mix()` in `oklab` space
- `@container` queries with `inline-size`
- `linear()` cubic easing
- `popover` HTML attribute and `:popover-open` pseudo-class
- CSS anchor positioning (`anchor()`, `anchor-scope`, `position-anchor`, `position-try`)
- Cascade layers (`@layer`)
- `forced-colors` media queries and CSS system colours
- `accent-color`

The binding constraint among these is currently CSS anchor positioning. Three Graffiti components depend on it directly: `tooltip`, `dropdown-menu`, and `badge`. As of 2026-05-18 anchor positioning is stable in Chrome 125+ and Safari 17.4+ (partial); Firefox does not yet ship it in stable. Consumers running browsers without anchor positioning will see those three components fail to position correctly — the documents explicitly disclose this.

## Considered options

- **Version-pinned floor.** Declare "Graffiti supports Chrome 125+, Safari 17.5+, Firefox 130+." Rejected: more legible but less honest. The contract isn't really about Chrome 125; it's about the features that landed there. Pinning versions invites bit-rot — every time the platform moves, the floor needs maintenance, and the relationship between "the version" and "what actually matters" becomes muddier over time. Feature-pinning captures the actual dependency directly.
- **Feature-gated import path.** Move anchor-positioning-dependent components (`tooltip`, `dropdown-menu`, `badge`) into a separate opt-in import — analogous to the aesthetic-preset bundle from [ADR-0003](./0003-aesthetic-preset-architecture.md). Consumers on older browsers use most of Graffiti and skip the modern parts. Rejected for now: splits the framework into tiers and creates a slippery slope (every future feature with imperfect support becomes a candidate for gating). The framework's stance is "modern web platform"; gating contradicts that stance. If anchor-positioning support meaningfully drags for years, this option becomes reviseable.
- **Polyfill or shim missing features.** Rejected: Graffiti is a CSS-only package. Polyfills would require JS, breaking the "drop-in CSS" promise. Consumers needing to support older browsers can layer their own polyfills (e.g. the floating-ui anchor-positioning polyfill); they cannot expect the framework to ship them.
- **No formal contract; treat browser support as best-effort.** Rejected: leaves consumers without a way to reason about whether Graffiti will work for their audience. The whole point of [ADR-0011](./0011-public-surface-and-deprecation-policy.md) is that consumers need a contract they can plan against; the same logic applies to platform features.

## Consequences

- [`docs/BROWSER-SUPPORT.md`](../BROWSER-SUPPORT.md) becomes the authoritative reference for the current feature list and a snapshot of implementing versions. ADRs that introduce new Web Platform feature dependencies (or remove them) must update that file.
- When Graffiti adopts a new feature that raises the effective version floor, that adoption is itself a breaking change under [ADR-0011](./0011-public-surface-and-deprecation-policy.md) (it removes implicit support for some browsers that previously worked). The ADR that introduces the new dependency must say so explicitly and choose a deprecation handling.
- The `graffiti-best-practices` skill must not assume a feature is supported without checking the feature list. When new components require an additional feature, the skill update lands in the same release as the doc update.
- Graffiti's commitment is to forward-move with the platform, not to maintain compatibility floors. Older-browser support is a consumer concern, not a framework concern.
- The disclosure for anchor-positioning-dependent components stays explicit: tooltip / dropdown-menu / badge will not position correctly in browsers without anchor positioning. They are not removed, they are not fallback-styled, they are not polyfilled — they fail visibly so consumers know the dependency exists.
