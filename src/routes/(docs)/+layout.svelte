<script module lang="ts">
  declare const __APP_VERSION__: string;
</script>

<script lang="ts">
  import { page } from "$app/state";
  const version = __APP_VERSION__;
  import { getDocsContentGraph } from "../../docs/content/runtime.js";
  import * as docsRuntime from "../../docs/content/runtime.js";
  import type { FontSettings, ThemeValues, BorderRadiusSettings } from "$lib/types";
  import ThemeControls from "../../docs/ThemeControls.svelte";

  const { children } = $props();

  let theme_values: ThemeValues = $state({
    fg_light: "#111111",
    fg_dark: "#ffffff",
    bg_light: "#ffffff",
    bg_dark: "#111111",
    primary: "#0066ff",
  });

  let font_settings: FontSettings = $state({
    min_ratio: 6 / 5,
    max_ratio: 4 / 3,
    min_font_size: 16,
    max_font_size: 18,
    min_viewport: 320,
    max_viewport: 1500,
    font_family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif",
  });

  let border_radius: BorderRadiusSettings = $state({
    br_xs: "2px",
    br_s: "4px",
    br_m: "8px",
    br_l: "16px",
    br_xl: "24px",
    br_xxl: "32px",
  });

  const docsRouteKeys = ["base", "utilities", "elements", "ui-blocks"] as const;
  const docsRouteLabels = {
    base: "Base",
    utilities: "Utilities",
    elements: "Elements",
    "ui-blocks": "UI Blocks",
  } as const;
  const docsContentGraph = getDocsContentGraph();
  const getRouteIntroMap = (
    docsRuntime as {
      getRouteIntroMap?: () => Map<string, { title?: string }>;
    }
  ).getRouteIntroMap;
  const routeIntroMap = getRouteIntroMap?.() ?? new Map<string, { title?: string }>();
  const docsRoutes = docsRouteKeys
    .map((routeKey) => {
      const route = docsContentGraph.routes.find((entry) => entry.key === routeKey);
      if (!route) return null;

      return {
        ...route,
        introTitle: routeIntroMap.get(routeKey)?.title ?? routeKey,
        navLabel: docsRouteLabels[routeKey],
      };
    })
    .filter((route) => route !== null);

  $effect(() => {
    const style = document.documentElement.style;
    for (const key in theme_values) {
      const value = theme_values[key as keyof ThemeValues];
      style.setProperty(`--${key.replace("_", "-")}`, value);
    }
  });

  $effect(() => {
    document.documentElement.style.setProperty("--font-sans", font_settings.font_family);
  });

  $effect(() => {
    const style = document.documentElement.style;
    for (const key in border_radius) {
      const value = border_radius[key as keyof BorderRadiusSettings];
      style.setProperty(`--${key.replace(/_/g, "-")}`, value);
    }
  });
</script>

<ThemeControls bind:theme_values bind:font_settings bind:border_radius />

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
        {#each docsRoutes as route (route.key)}
          <a
            aria-current={page.url.pathname.startsWith(route.path)
              ? "page"
              : null}
            href={route.path}
            title={route.introTitle}>{route.navLabel}</a
          >
          {#if page.url.pathname.startsWith(route.path)}
            {#each route.topics as topic (topic.id)}
              <a href={`${route.path}#${topic.id}`} class="sub">{topic.title}</a>
            {/each}
          {/if}
        {/each}
        <a
          aria-current={page.url.pathname.startsWith("/templates")
            ? "page"
            : null}
          href="/templates">Templates</a
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

  <footer class="footer layout-readable stack" style="--max-width: 1400px; margin-top: var(--vs-xl); padding-block: var(--pad-xl);">
    <div class="grid auto" style="--grid-min: 140px;">
      <nav class="stack">
        <strong>Documentation</strong>
        <a href="/">Get Started</a>
        <a href="/base">Base</a>
        <a href="/utilities">Utilities</a>
        <a href="/elements">Elements</a>
        <a href="/ui-blocks">UI Blocks</a>
      </nav>
      <nav class="stack">
        <strong>Resources</strong>
        <a href="/changelog">Changelog</a>
        <a href="https://github.com/stolinski/graffiti">GitHub</a>
        <a href="https://graffiti-ui.com/llms.txt">LLM Docs</a>
      </nav>
      <nav class="stack">
        <strong>More</strong>
        <a href="https://syntax.fm">Syntax Podcast</a>
        <a href="https://youtube.com/@syntaxfm">Syntax on YouTube</a>
        <a href="https://youtube.com/@scotttolinski">Scott on YouTube</a>
      </nav>
    </div>
    <hr />
    <small><a href="https://github.com/stolinski/graffiti/blob/main/LICENSE">MIT License</a></small>
  </footer>
</div>
