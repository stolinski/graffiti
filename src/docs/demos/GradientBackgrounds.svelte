<script>
  const gradientClasses = [
    "gradient-sunset",
    "gradient-ocean",
    "gradient-aurora",
    "gradient-midnight",
    "gradient-dawn",
    "gradient-forest",
    "gradient-lavender",
    "gradient-neon",
    "gradient-slate",
    "gradient-surface",
  ];
</script>

<div class="stack">
  <h3>Background Gradients</h3>
  <p>
    Apply to any element for an instant gradient background. Each uses a
    curated gradient type (linear, radial, or conic) with positioned stops.
  </p>
  <div class="layout-card" style="--min-card-width: 200px;">
    {#each gradientClasses as gradientClass (gradientClass)}
      <div
        class={gradientClass}
        style="padding: var(--pad-xl); border-radius: var(--br-m); min-height: 140px; display: grid; place-items: center;"
      >
        <span
          style="background: oklch(0 0 0 / 0.4); color: white; padding: var(--pad-xs) var(--pad-s); border-radius: var(--br-s); font-size: 0.85rem;"
          >.{gradientClass}</span
        >
      </div>
    {/each}
  </div>
</div>
