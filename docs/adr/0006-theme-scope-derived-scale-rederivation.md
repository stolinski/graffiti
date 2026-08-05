# Theme scope: re-derive color scales on preset and opt-in containers

Graffiti's derived color scales — `--{base}-1..9` for every derived semantic base (`fg`, `bg`, `primary`, `error`, `warning`, `success`) — are declared on `:root` as `oklch(from var(--{base}) l c h / N)` expressions. The relative color syntax resolves its `<color>` argument at computed-value time, so the browser substitutes `var(--{base})` at `:root` and inherits the resolved colors downstream. Overriding `--primary` (or any other base) on a descendant element therefore does **not** re-shade that base's alpha scale on the descendant; the descendant inherits the original `:root`-computed scale. This is well-formed CSS, but it directly limits the "apply on any container" promise made by [ADR-0003](./0003-aesthetic-preset-architecture.md): a preset class on a `<section>` can change `--primary` but leaves every tinted derivative stale.

To close this hole, `drop-in.css` declares a single re-derivation block keyed on the `theme-` class-name fragment. The block re-declares the alpha scale for every derived semantic base, plus `--fg` and `--bg` themselves so `--fg-light`/`--fg-dark` / `--bg-light`/`--bg-dark` overrides on a scope propagate through `light-dark()`:

```css
:where([class*="theme-"]) {
  --fg: light-dark(var(--fg-light), var(--fg-dark));
  --bg: light-dark(var(--bg-light), var(--bg-dark));
  --fg-05: oklch(from var(--fg) l c h / 0.05);
  --fg-1: oklch(from var(--fg) l c h / 0.1);
  /* … --fg-2..9, --bg-05/1..9, --primary-1..9,
        --error-1..9, --warning-1..9, --success-1..9 */
}
```

The `:where()` zero-specificity wrapper keeps the rule from outranking consumer overrides. The block lives in the core layer so the contract is stable whether or not the preset bundle is imported. The attribute selector matches any class containing `theme-` — including the bare `.theme-scope` marker, every named preset (`.theme-brutalist`, `.theme-editorial`, …), and any consumer-authored `.theme-*` class — so the catalog can grow without touching `drop-in.css`. Consumers wanting an ad-hoc scoped recolor without a full preset apply `.theme-scope` directly:

```html
<section class="theme-scope" style="--primary: gold">
  <!-- --primary-1..9 inside here re-shade to gold -->
</section>
```

## Considered options

- Register `--primary`/`--primary-N` with `@property` and rely on re-resolution. Rejected because `@property` controls typing, inheritance, and animation — it does not re-evaluate `oklch(from var(--X) ...)` expressions on the cascade. The rule still applies only where its selector matches.
- Rewrite the four framework consumption sites of `--primary-1..2` (and the zero sites of `--error-1..9`) with `color-mix(in oklab, var(--primary), transparent N%)` at the use site, and document `--primary-N` tokens as `:root`-stable only. Rejected: leaves a two-tier surface where `--primary-3` works for some consumers and silently misshades for others, exactly the leaky abstraction the system-integrity stance forbids.
- Re-declare derived scales on `:where(*)` so every element re-evaluates. Rejected: real performance cost (the derived surface is ~270 custom properties once the opaque scale from [ADR-0007](./0007-opaque-color-scale.md) is included, applied to every element), and a global rule on `*` for custom properties has surprising interactions with paint, animation, and registered properties. Maximalist beyond the actual surface. The class-fragment selector chosen here pays the same per-element property count, but only on elements that opt into a theme scope.
- Enumerated allowlist — `:where(.theme-scope, .theme-brutalist, .theme-editorial, …)` listing every preset by name. Rejected: every new preset has to touch `drop-in.css` to be a real theme scope, and forgetting that step is a silent, scattered footgun. Consumer-authored scopes have no path at all without adding their class to the core list.
- Closed allowlist — re-derive only on the named preset classes, no `.theme-scope` utility. Rejected: forces any consumer who wants a scoped recolor to author a full preset (or accept stale scales), penalising the smallest legitimate use case.
- Drop the derived scales entirely and require all consumers to use `color-mix` at the use site. Rejected as a breaking change disproportionate to the problem; the precomputed scale is a useful token surface at `:root` scope, which covers the majority of consumption.

## Consequences

- Aesthetic presets ([ADR-0003](./0003-aesthetic-preset-architecture.md)) deliver on the "apply on any container" promise. A preset on a `<section>` re-shades its full alpha scale.
- `.theme-scope` enters the glossary as a first-class concept, distinct from layout primitives and from aesthetic presets. It is the smallest opt-in surface for container-scoped recolors.
- The re-derivation selector is open-ended: any class containing the `theme-` fragment qualifies. Catalog growth (new presets, consumer-authored scopes) requires no change to `drop-in.css`. The naming convention itself is the contract.
- Trade-off: a non-Graffiti class that happens to contain `theme-` (for example `.my-theme-toggle` on a UI control) also receives the re-declared block. The cost is the extra computed custom properties on those elements; since none of the underlying tokens are typically overridden there, the resolved values are identical to what the element would inherit from `:root`, and nothing renders differently. The naming overlap is judged rare enough — and the failure mode benign enough — to keep the open selector.
- Residual limitation, accepted by design: re-derivation fires once on the scope element. A descendant that further overrides `--primary` inside a theme scope still inherits the scope's derived scale; its own `--primary` change does not re-shade. The realistic frequency of nested overrides is near zero, and the alternative (`:where(*)`) was rejected. If a real use case surfaces, the consumer applies a nested `.theme-scope` on the inner element.
- `--fg` and `--bg` are re-declared inside the block alongside their alpha scales. Without re-declaring the base token itself, a scope that overrides only `--fg-light`/`--fg-dark` (or `--bg-light`/`--bg-dark`) would still inherit the `:root`-substituted `--fg`/`--bg` and the alpha scale would stay stale; re-declaring each as `light-dark(var(--{base}-light), var(--{base}-dark))` makes both the base token and its alpha derivatives react to either form of override on the scope. The dominant light/dark case continues to work via `color-scheme` and `light-dark()` resolution semantics, unchanged.
- The alpha re-derivation is symmetric across all six derived semantic bases (`fg`, `bg`, `primary`, `error`, `warning`, `success`). The initial revision of this ADR enumerated only `fg`, `primary`, `error`; that was an oversight — overriding `--warning` or `--success` on a scope would have left the corresponding tinted scale stale. The completed block covers every base with a derived alpha scale at `:root`.
- When the opaque color scale ships ([ADR-0007](./0007-opaque-color-scale.md)), `--{base}-opaque-1..9` joins this re-derivation block alongside the alpha scale. The block stays a single rule with the same selector; only the property count grows.
- The `graffiti-best-practices` skill gains a one-line rule: "to recolor a subtree, apply `.theme-scope` (or any `theme-*` class) on the container — not just an inline `--primary` override."
- The re-derivation block is **generated** from canonical `:root` declarations, not hand-maintained. Each `:root` scale block is wrapped in `/* derive:source */ ... /* /derive:source */` markers; the `[class*="theme-"]` rule contains a single `/* derive:mirror */ ... /* /derive:mirror */` region. `scripts/derive-mirror.mjs` runs first in `pnpm build` (and `pnpm package`), concatenates every source block in source order, and rewrites the mirror region in `src/lib/drop-in.css`. The script is idempotent and edits in place — the source is canonical, the mirror is overwritten on every build. This closes the drift surface that grew with the opaque scale (the mirror now declares ~270 custom properties; without generation a single edit to a `:root` formula could silently miss its mirror).
