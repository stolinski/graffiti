<script module lang="ts">
  declare const __APP_VERSION__: string;
</script>

<script lang="ts">
  import { page } from "$app/state";
  import { afterNavigate } from "$app/navigation";
  const version = __APP_VERSION__;
  import { getDocsContentGraph } from "../../docs/content/runtime.js";
  import * as docsRuntime from "../../docs/content/runtime.js";
  import type {
    FontSettings,
    ThemeValues,
    BorderRadiusSettings,
    ColorSchemeSettings,
  } from "$lib/types";
  import { COLOR_SCHEME } from "$docs/theme-controls";
  import ThemeControls from "../../docs/ThemeControls.svelte";
  import CommandPalette from "../../docs/CommandPalette.svelte";
  import Icon from "./Icon.svelte";

  let search_open = $state(false);

  // The mobile nav is a `popover` drawer (`#docs-mobile-nav`). On desktop the
  // toggle that opens it is hidden by the framework, so it's never shown there.
  let drawer_el: HTMLElement | undefined = $state();
  function closeDrawer() {
    if (drawer_el?.matches(":popover-open")) drawer_el.hidePopover();
  }
  function openSearch() {
    search_open = true;
    closeDrawer();
  }

  // Close the drawer after navigating. Real navigations fire afterNavigate;
  // same-page hash links (sub-topic anchors) don't, so also close on any link
  // click inside the drawer (wired imperatively to keep the <aside> clean).
  afterNavigate(() => closeDrawer());
  $effect(() => {
    const el = drawer_el;
    if (!el) return;
    const onClick = (event: Event) => {
      if ((event.target as HTMLElement)?.closest("a")) closeDrawer();
    };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  });

  // Preset CSS files are pulled in here so the Aesthetic selector in
  // ThemeControls can apply a `.theme-*` class on <html> and the styles
  // are already available. Selector rules live in @layer themes and only
  // match when the class is present, so importing all five is a no-op
  // unless one is actually selected.
  import "$lib/themes/soft-consumer.css";
  import "$lib/themes/editorial.css";
  import "$lib/themes/paper.css";
  import "$lib/themes/system.css";
  import "$lib/themes/neon-arcade.css";
  import "$lib/themes/studio.css";
  import "$lib/themes/signal.css";
  import "$lib/themes/lumen.css";
  import "$lib/themes/schematic.css";

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
    max_ratio: 5 / 4,
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

  let scheme_settings: ColorSchemeSettings = $state("system");

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

  type IconName =
    | "sparkles" | "box" | "wrench" | "atom" | "layers"
    | "grid" | "palette" | "history";
  const routeIcon: Record<string, IconName> = {
    "/": "sparkles",
    "/base": "box",
    "/utilities": "wrench",
    "/elements": "atom",
    "/ui-blocks": "layers",
    "/templates": "grid",
    "/themes": "palette",
    "/changelog": "history",
  };

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

  $effect(() => {
    document.documentElement.style.setProperty(
      "color-scheme",
      COLOR_SCHEME[scheme_settings],
    );
  });
</script>

{#snippet navLinks()}
  <button type="button" class="cmdk-trigger" onclick={openSearch}>
    <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
    <span>Search</span>
    <kbd>⌘K</kbd>
  </button>

  <div class="sidebar-nav-heading">Start</div>
  <a aria-current={page.url.pathname === "/" ? "page" : null} href="/">
    <Icon name="sparkles" /> Get Started
  </a>

  <div class="sidebar-nav-heading">Foundations</div>
  {#each docsRoutes as route (route.key)}
    {#if route.key === "elements"}
      <div class="sidebar-nav-heading">Library</div>
    {/if}
    <a
      aria-current={page.url.pathname.startsWith(route.path) ? "page" : null}
      href={route.path}
      title={route.introTitle}
    >
      <Icon name={routeIcon[route.path]} /> {route.navLabel}
    </a>
    {#if page.url.pathname.startsWith(route.path)}
      {#each route.topics as topic (topic.id)}
        <a href={`${route.path}#${topic.id}`} class="sub">{topic.title}</a>
      {/each}
    {/if}
  {/each}
  <a
    aria-current={page.url.pathname.startsWith("/templates") ? "page" : null}
    href="/templates"
  >
    <Icon name="grid" /> Templates
  </a>

  <div class="sidebar-nav-heading">Customize</div>
  <a
    aria-current={page.url.pathname.startsWith("/themes") ? "page" : null}
    href="/themes"
  >
    <Icon name="palette" /> Themes
  </a>
  <a
    aria-current={page.url.pathname.startsWith("/changelog") ? "page" : null}
    href="/changelog"
  >
    <Icon name="history" /> Changelog
  </a>
{/snippet}

<ThemeControls
  bind:theme_values
  bind:font_settings
  bind:border_radius
  bind:scheme_settings
/>

<CommandPalette bind:open={search_open} />

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

    /* The global thick-underline a {} treatment collides with
       .sidebar-nav's row borders/gradients. Strip it inside the nav. */
    .sidebar-nav a {
      text-decoration: none;
    }

    .cmdk-trigger {
      display: flex;
      align-items: center;
      gap: var(--vs-s);
      width: 100%;
      margin-block-end: var(--vs-s);
      padding: var(--pad-s) var(--pad-m);
      border: 1px solid var(--fg-2);
      border-radius: var(--br-s);
      background: var(--fg-05);
      color: var(--fg-7);
      cursor: pointer;
      font-size: var(--fs-base);
    }
    .cmdk-trigger:hover {
      border-color: var(--primary);
      color: var(--fg);
    }
    .cmdk-trigger span {
      flex: 1;
      text-align: left;
    }
    .cmdk-trigger kbd {
      font-size: var(--fs-xs);
      font-family: var(--font-mono, monospace);
      color: var(--fg-6);
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
      <nav class="sidebar-nav compact" style="--sn-color: var(--primary);">
        {@render navLinks()}
      </nav>
      <div
        class="cluster"
        style="padding: var(--pad-s) var(--pad-m); align-items: center; --gap: var(--vs-s);"
      >
        <small style="color: var(--fg-7);">v{version}</small>
      </div>
    </aside>
    <section
      class="stack layout-readable center"
      style="padding: 0 var(--pad-l) var(--pad-xxxl); --layout-gap: 4rem;"
    >
      <button
        class="drawer-toggle ghost icon-button"
        popovertarget="docs-mobile-nav"
        aria-label="Open navigation"
        style="align-self: start; margin-block-start: var(--pad-m);"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
      </button>

      {@render children()}
    </section>
  </div>

  <!-- Standalone popover drawer (outside .layout-sidebar). The flex layout
       lives on an inner wrapper, NOT the popover itself — a display-setting
       class on the popover would override the UA's closed-hide and leak it
       onto every page. -->
  <aside bind:this={drawer_el} id="docs-mobile-nav" popover class="drawer">
    <div class="stack" style="--gap: var(--vs-m); padding: var(--pad-m); block-size: 100%;">
      <nav class="sidebar-nav compact" style="--sn-color: var(--primary);">
        {@render navLinks()}
      </nav>
      <small style="margin-block-start: auto; padding-inline: var(--pad-s); color: var(--fg-7);">v{version}</small>
    </div>
  </aside>

  <footer class="footer layout-readable stack" style="--max-width: 1400px; margin-top: var(--vs-xl); padding-block: var(--pad-xl);">
    <div class="grid auto" style="--grid-min: 140px;">
      <nav class="stack">
        <strong>Documentation</strong>
        <a href="/">Get Started</a>
        <a href="/base">Base</a>
        <a href="/utilities">Utilities</a>
        <a href="/elements">Elements</a>
        <a href="/ui-blocks">UI Blocks</a>
        <a href="/themes">Themes</a>
      </nav>
      <nav class="stack">
        <strong>Resources</strong>
        <a href="/changelog">Changelog</a>
        <a href="https://github.com/stolinski/graffiti">GitHub</a>
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
