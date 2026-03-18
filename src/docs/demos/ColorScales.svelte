<script>
  const colors = [
    "yellow",
    "amber",
    "orange",
    "red",
    "pink",
    "purple",
    "purple-deep",
    "indigo",
    "blue",
    "green",
    "lime",
    "highlighter",
    "brown",
    "teal",
    "gray",
    "slate",
  ];

  const static_colors = [
    {
      name: "white",
      note: "Does not change with light/dark mode. Use --fg/--bg for adaptive colors.",
    },
    {
      name: "black",
      note: "Does not change with light/dark mode. Use --fg/--bg for adaptive colors.",
    },
  ];

  const scale = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const scale_with_05 = ["05", 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const theming_scales = [
    {
      name: "fg",
      label: "Foreground",
      note: "Contrasting shades that automatically adapt to light/dark mode. Great for borders, subtle backgrounds, and text emphasis.",
    },
    {
      name: "bg",
      label: "Background",
      note: "Contrasting tints that automatically adapt to light/dark mode. Useful for layered surfaces and subtle overlays.",
    },
  ];
</script>

<div class="stack">
  <p>
    OKLCH color system with automatic 1-9 scales generated from base colors
    (scale 5) using relative color syntax
  </p>

  {#each colors as color (color)}
    <div class="stack">
      <h4>{color.charAt(0).toUpperCase() + color.slice(1)} Scale</h4>
      {#if color !== "gray"}
        <div class="auto-color" style="--bg-color: var(--{color})">--{color}</div>
      {/if}
      <div class="cluster">
        {#each scale as n (n)}
          <div class="auto-color" style="--bg-color: var(--{color}-{n})">
            --{color}-{n}
          </div>
        {/each}
      </div>
    </div>
  {/each}

  {#each static_colors as { name, note } (name)}
    <div class="stack">
      <h4>{name.charAt(0).toUpperCase() + name.slice(1)} Scale (Static)</h4>
      <p class="fs-xs">{note}</p>
      <div class="auto-color" style="--bg-color: var(--{name})">--{name}</div>
      <div class="cluster">
        {#each scale as n (n)}
          <div class="auto-color" style="--bg-color: var(--{name}-{n})">
            --{name}-{n}
          </div>
        {/each}
      </div>
    </div>
  {/each}

  {#each theming_scales as { name, label, note } (name)}
    <div class="stack">
      <h4>{label} Scale</h4>
      <p class="fs-xs">{note}</p>
      <div class="auto-color" style="--bg-color: var(--{name})">--{name}</div>
      <div class="cluster">
        {#each scale_with_05 as n (n)}
          <div class="auto-color" style="--bg-color: var(--{name}-{n})">
            --{name}-{n}
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>
