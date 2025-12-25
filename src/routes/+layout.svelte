<script lang="ts">
  import { version } from "$app/environment";
  import { page } from "$app/state";
  import "$lib/drop-in.css";
  import type { FontSettings, ThemeValues } from "$lib/types";
  import ThemeControls from "../docs/ThemeControls.svelte";

  const { children } = $props();

  let theme_values: ThemeValues = $state({
    fg_light: "#050505",
    fg_dark: "#ffffff",
    bg_light: "#ffffff",
    bg_dark: "#050505",
  });

  let font_settings: FontSettings = $state({
    min_ratio: 6 / 5,
    max_ratio: 4 / 3,
    min_font_size: 16,
    max_font_size: 18,
    min_viewport: 320,
    max_viewport: 1500,
  });

  $effect(() => {
    const temp_root = document.documentElement;
    for (var key in theme_values) {
      temp_root.style.setProperty(
        `--${key.replace("_", "-")}`,
        theme_values[key],
      );
    }
  });
</script>

<svelte:head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Graffiti - A minimal CSS toolkit</title>
</svelte:head>

<ThemeControls bind:theme_values bind:font_settings />

<div
  style:--fg-light={theme_values.fg_light}
  style:--bg-light={theme_values.bg_light}
  style:--fg-dark={theme_values.fg_dark}
  style:--bg-dark={theme_values.bg_dark}
  style:--font-size-min={font_settings.min_font_size}
  style:--font-size-max={font_settings.max_font_size}
  style:--font-ratio-min={font_settings.min_ratio}
  style:--font-ratio-max={font_settings.max_ratio}
  style:--font-width-min={font_settings.min_viewport}
  style:--font-width-max={font_settings.max_viewport}
>
  <style>
    .demo-section {
      margin-block: 3rem;
    }
    .code {
      background: var(--fg-05);
      padding: 1rem;
      border-radius: var(--br-s);
      border: 1px solid var(--fg-1);
    }
    .heading {
      border-bottom: solid 1px;
    }
    h4 {
      font-weight: 400;
    }

    .auto-color {
      padding: var(--pad-m) var(--pad-l);
      border-radius: var(--br-s);
      min-width: 150px;
    }

    a {
      color: var(--fg);
      text-decoration-color: var(--primary);
      text-decoration-thickness: 5px;
    }
  </style>

  <div class="layout-sidebar fixed" style="--layout-gap: 0;">
    <aside
      class="split vertical box invisible"
      style="top: 44px; max-height: calc(100dvh - 44px);"
    >
      <nav class="sidebar-nav">
        <a aria-current={page.url.pathname === "/" ? "page" : null} href="/"
          >Get Started</a
        >
        <a
          aria-current={page.url.pathname.startsWith("/base") ? "page" : null}
          href="/base">Base</a
        >
        <a
          aria-current={page.url.pathname.startsWith("/utilities")
            ? "page"
            : null}
          href="/utilities">Utilities</a
        >
        <a
          aria-current={page.url.pathname.startsWith("/elements")
            ? "page"
            : null}
          href="/elements">Elements</a
        >
        <a
          aria-current={page.url.pathname.startsWith("/ui-blocks")
            ? "page"
            : null}
          href="/ui-blocks">UI Blocks</a
        >
        <a
          aria-current={page.url.pathname.startsWith("/changelog")
            ? "page"
            : null}
          href="/changelog">Changelog</a
        >
      </nav>
      <div class="stack" style="padding: var(--pad-s) var(--pad-m);">
        <small>v{version}</small>
      </div>
    </aside>
    <section
      class="stack layout-readable center"
      style="padding: var(--pad-xxxl) var(--pad-l); --layout-gap: 4rem;"
    >
      {@render children()}
    </section>
  </div>
</div>
