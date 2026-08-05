<script>
  import CanonicalFixture from "$docs/CanonicalFixture.svelte";
  import SchematicFixture from "$docs/SchematicFixture.svelte";

  // Import all preset CSS files. Page itself does NOT apply any preset
  // class to <html> — the wrapping below carries each scope.
  import "$lib/themes/soft-consumer.css";
  import "$lib/themes/editorial.css";
  import "$lib/themes/paper.css";
  import "$lib/themes/system.css";
  import "$lib/themes/neon-arcade.css";
  import "$lib/themes/studio.css";
  import "$lib/themes/signal.css";
  import "$lib/themes/lumen.css";
  import "$lib/themes/schematic.css";

  const presets = [
    { name: "soft-consumer", label: ".theme-soft-consumer" },
    { name: "editorial", label: ".theme-editorial" },
    { name: "paper", label: ".theme-paper" },
    { name: "system", label: ".theme-system" },
    { name: "neon-arcade", label: ".theme-neon-arcade" },
    { name: "studio", label: ".theme-studio" },
    { name: "signal", label: ".theme-signal" },
    { name: "lumen", label: ".theme-lumen" },
    { name: "schematic", label: ".theme-schematic" },
  ];
</script>

<svelte:head>
  <title>Themes — Graffiti</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1;1,9..144,100..900,0..100,0..1&family=Big+Shoulders+Display:wght@100..900&family=Space+Grotesk:wght@300..700&family=Inter:wght@100..900&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<section class="stack readable">
  <h1>Aesthetic presets</h1>
  <p class="text-muted">
    Nine presets, each wrapped on a container so they re-skin only their subtree
    (ADR-0003). Same markup, different voice. Open the dialogs to see how each
    preset styles modals.
  </p>
</section>

{#each presets as preset (preset.name)}
  <section class="theme-{preset.name} stack" style="--gap: var(--vs-m);">
    <p class="text-faint" style="font-family: ui-monospace, monospace; margin-block-end: 0;">{preset.label}</p>
    <div class="surface" style="padding: var(--pad-xl);">
      <CanonicalFixture id={preset.name} />
    </div>
  </section>
{/each}

<section class="theme-schematic stack" style="--gap: var(--vs-m);">
  <p class="mono text-faint">.theme-schematic · reference composition</p>
  <div class="surface box">
    <SchematicFixture />
  </div>
</section>
