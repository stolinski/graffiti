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
    primary: "var(--blue)",
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
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="manifest" href="/site.webmanifest" />
</svelte:head>

<ThemeControls bind:theme_values bind:font_settings />

<div
  style:--fg-light={theme_values.fg_light}
  style:--bg-light={theme_values.bg_light}
  style:--fg-dark={theme_values.fg_dark}
  style:--bg-dark={theme_values.bg_dark}
  style:--primary={theme_values.primary}
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
  <header class="header readable">
    <div>
      <h1
        class="fs-m flex"
        style="margin: 0; align-items: center;line-height: 1;"
      >
        <svg
          width="30"
          viewBox="0 0 927 1443"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_1_9)">
            <rect
              x="172.09"
              y="1101.07"
              width="583.143"
              height="342.396"
              fill="var(--primary)"
            />
            <rect
              x="57.9576"
              y="280.831"
              width="811.407"
              height="258.58"
              fill="var(--primary)"
            />
            <rect
              x="367.362"
              width="192.598"
              height="231.831"
              fill="var(--primary)"
            />
            <path
              d="M463.661 588.411C207.588 588.411 0 795.999 0 1052.07H927.322C927.322 795.999 719.734 588.411 463.661 588.411Z"
              fill="var(--primary)"
            />
          </g>
          <defs>
            <clipPath id="clip0_1_9">
              <rect width="927" height="1443" fill="white" />
            </clipPath>
          </defs>
        </svg>

        Graffiti
      </h1>
    </div>
    <a
      href="https://github.com/stolinski/graffiti"
      style="align-self: flex-start;"
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <title>github</title>
        <g fill="var(--fg)">
          <path
            d="M16,2.345c7.735,0,14,6.265,14,14-.002,6.015-3.839,11.359-9.537,13.282-.7,.14-.963-.298-.963-.665,0-.473,.018-1.978,.018-3.85,0-1.312-.437-2.152-.945-2.59,3.115-.35,6.388-1.54,6.388-6.912,0-1.54-.543-2.783-1.435-3.762,.14-.35,.63-1.785-.14-3.71,0,0-1.173-.385-3.85,1.435-1.12-.315-2.31-.472-3.5-.472s-2.38,.157-3.5,.472c-2.677-1.802-3.85-1.435-3.85-1.435-.77,1.925-.28,3.36-.14,3.71-.892,.98-1.435,2.24-1.435,3.762,0,5.355,3.255,6.563,6.37,6.913-.403,.35-.77,.963-.893,1.872-.805,.368-2.818,.963-4.077-1.155-.263-.42-1.05-1.452-2.152-1.435-1.173,.018-.472,.665,.017,.927,.595,.332,1.277,1.575,1.435,1.978,.28,.787,1.19,2.293,4.707,1.645,0,1.173,.018,2.275,.018,2.607,0,.368-.263,.787-.963,.665-5.719-1.904-9.576-7.255-9.573-13.283,0-7.735,6.265-14,14-14Z"
          ></path>
        </g></svg
      ></a
    >
  </header>

  <div class="layout-sidebar fixed layout-readable" style="--layout-gap: 0;">
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
      style="padding: 0 var(--pad-l) var(--pad-xxxl); --layout-gap: 4rem;"
    >
      {@render children()}
    </section>
  </div>
</div>
