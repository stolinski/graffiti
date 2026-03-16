<script lang="ts">
  import { slide } from "svelte/transition";
  import type { ThemeValues, FontSettings, BorderRadiusSettings } from "$lib/types";

  let {
    theme_values = $bindable(),
    font_settings = $bindable(),
    border_radius = $bindable(),
  }: { theme_values: ThemeValues; font_settings: FontSettings; border_radius: BorderRadiusSettings } = $props();

  const themes: { name: string; values: ThemeValues }[] = [
    {
      name: "Default",
      values: {
        fg_light: "#111111",
        fg_dark: "#ffffff",
        bg_light: "#ffffff",
        bg_dark: "#111111",
        primary: "#0066ff",
      },
    },
    {
      name: "Ocean",
      values: {
        fg_light: "#0a2540",
        fg_dark: "#e0f0ff",
        bg_light: "#f0f7ff",
        bg_dark: "#0a1628",
        primary: "#0891b2",
      },
    },
    {
      name: "Forest",
      values: {
        fg_light: "#1a2e1a",
        fg_dark: "#e8f0e0",
        bg_light: "#f5f7f0",
        bg_dark: "#111a0e",
        primary: "#2d8a4e",
      },
    },
    {
      name: "Sunset",
      values: {
        fg_light: "#2d1b0e",
        fg_dark: "#fff0e0",
        bg_light: "#fffbf5",
        bg_dark: "#1a0f05",
        primary: "#e2622d",
      },
    },
    {
      name: "Berry",
      values: {
        fg_light: "#1e0a2e",
        fg_dark: "#f0e0ff",
        bg_light: "#faf5ff",
        bg_dark: "#130820",
        primary: "#8b5cf6",
      },
    },
    {
      name: "Rose",
      values: {
        fg_light: "#2b1015",
        fg_dark: "#ffe4ea",
        bg_light: "#fff5f7",
        bg_dark: "#1a0a0e",
        primary: "#e11d48",
      },
    },
    {
      name: "Monochrome",
      values: {
        fg_light: "#000000",
        fg_dark: "#e8e8e8",
        bg_light: "#ffffff",
        bg_dark: "#0a0a0a",
        primary: "#555555",
      },
    },
    {
      name: "Midnight",
      values: {
        fg_light: "#0f172a",
        fg_dark: "#cbd5e1",
        bg_light: "#f1f5f9",
        bg_dark: "#020617",
        primary: "#6366f1",
      },
    },
    {
      name: "Clay & Cobalt",
      values: {
        fg_light: "#2b1f19",
        fg_dark: "#f7ede4",
        bg_light: "#faf3ed",
        bg_dark: "#19130f",
        primary: "#326fdf",
      },
    },
    {
      name: "Sea Glass",
      values: {
        fg_light: "#12332d",
        fg_dark: "#dbf7ef",
        bg_light: "#ecfcf7",
        bg_dark: "#08201c",
        primary: "#128277",
      },
    },
    {
      name: "Night Market",
      values: {
        fg_light: "#26163a",
        fg_dark: "#efe8ff",
        bg_light: "#f8f4ff",
        bg_dark: "#140b1f",
        primary: "#c026d3",
      },
    },
    {
      name: "Terminal Amber",
      values: {
        fg_light: "#2d2418",
        fg_dark: "#ffe4b8",
        bg_light: "#fff8eb",
        bg_dark: "#120d06",
        primary: "#b95b13",
      },
    },
    {
      name: "Noir Neon",
      values: {
        fg_light: "#14161b",
        fg_dark: "#dff5ff",
        bg_light: "#f1f4f7",
        bg_dark: "#090d14",
        primary: "#0b79bb",
      },
    },
    {
      name: "Moss & Plum",
      values: {
        fg_light: "#232914",
        fg_dark: "#eaf1d8",
        bg_light: "#f4f8ea",
        bg_dark: "#12170b",
        primary: "#a148e3",
      },
    },
  ];

  let selected_theme = $state("Default");
  let copied = $state(false);
  let show_export = $state(false);

  type TypeScale = Omit<FontSettings, "font_family">;

  const typeScales: { name: string; values: TypeScale }[] = [
    {
      name: "Compact",
      values: { min_ratio: 1.067, max_ratio: 1.125, min_font_size: 14, max_font_size: 15, min_viewport: 320, max_viewport: 1500 },
    },
    {
      name: "Small Text",
      values: { min_ratio: 1.125, max_ratio: 1.2, min_font_size: 15, max_font_size: 16, min_viewport: 320, max_viewport: 1500 },
    },
    {
      name: "Default",
      values: { min_ratio: 1.2, max_ratio: 4 / 3, min_font_size: 16, max_font_size: 18, min_viewport: 320, max_viewport: 1500 },
    },
    {
      name: "Comfortable",
      values: { min_ratio: 1.2, max_ratio: 4 / 3, min_font_size: 17, max_font_size: 20, min_viewport: 320, max_viewport: 1500 },
    },
    {
      name: "Large Text",
      values: { min_ratio: 1.25, max_ratio: 1.333, min_font_size: 18, max_font_size: 22, min_viewport: 320, max_viewport: 1500 },
    },
    {
      name: "Big Spread",
      values: { min_ratio: 1.2, max_ratio: 1.5, min_font_size: 16, max_font_size: 18, min_viewport: 320, max_viewport: 1500 },
    },
    {
      name: "Editorial",
      values: { min_ratio: 1.25, max_ratio: 1.618, min_font_size: 18, max_font_size: 22, min_viewport: 320, max_viewport: 1400 },
    },
  ];

  const borderRadiusPresets: { name: string; values: BorderRadiusSettings }[] = [
    { name: "Square", values: { br_xs: "0", br_s: "0", br_m: "0", br_l: "0", br_xl: "0", br_xxl: "0" } },
    { name: "Subtle", values: { br_xs: "1px", br_s: "2px", br_m: "4px", br_l: "6px", br_xl: "8px", br_xxl: "12px" } },
    { name: "Default", values: { br_xs: "2px", br_s: "4px", br_m: "8px", br_l: "16px", br_xl: "24px", br_xxl: "32px" } },
    { name: "Rounded", values: { br_xs: "4px", br_s: "8px", br_m: "12px", br_l: "20px", br_xl: "32px", br_xxl: "48px" } },
  ];

  function apply_border_radius(e: Event) {
    const select = e.target as HTMLSelectElement;
    const preset = borderRadiusPresets.find((p) => p.name === select.value);
    if (preset) {
      Object.assign(border_radius, preset.values);
    }
  }

  function apply_type_scale(e: Event) {
    const select = e.target as HTMLSelectElement;
    const scale = typeScales.find((s) => s.name === select.value);
    if (scale) {
      Object.assign(font_settings, scale.values);
    }
  }

  function apply_theme(e: Event) {
    const select = e.target as HTMLSelectElement;
    selected_theme = select.value;
    const theme = themes.find((t) => t.name === select.value);
    if (theme) {
      theme_values = { ...theme.values };
    }
  }

  function get_google_font_link(): string {
    const font = fontOptions.find((f) => f.value === font_settings.font_family);
    if (!font || !font.google) return "";
    return `<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=${font.google}&display=swap" rel="stylesheet">`;
  }

  function generate_export(): string {
    const parts: string[] = [];

    // Google Fonts link
    const font_link = get_google_font_link();
    if (font_link) {
      parts.push("<!-- Google Font -->");
      parts.push(font_link);
      parts.push("");
    }

    // CSS overrides
    parts.push("<!-- Theme Overrides -->");
    parts.push("<style>");
    parts.push(":root {");
    for (const key in theme_values) {
      const css_var = `--${key.replace(/_/g, "-")}`;
      parts.push(`  ${css_var}: ${theme_values[key as keyof ThemeValues]};`);
    }
    parts.push(`  --font-sans: ${font_settings.font_family};`);
    parts.push(`  --font-size-min: ${font_settings.min_font_size};`);
    parts.push(`  --font-size-max: ${font_settings.max_font_size};`);
    parts.push(`  --font-ratio-min: ${font_settings.min_ratio};`);
    parts.push(`  --font-ratio-max: ${font_settings.max_ratio};`);
    parts.push(`  --font-width-min: ${font_settings.min_viewport};`);
    parts.push(`  --font-width-max: ${font_settings.max_viewport};`);
    for (const key in border_radius) {
      const css_var = `--${key.replace(/_/g, "-")}`;
      parts.push(`  ${css_var}: ${border_radius[key as keyof BorderRadiusSettings]};`);
    }
    parts.push("}");
    parts.push("</style>");
    return parts.join("\n");
  }

  async function copy_theme() {
    await navigator.clipboard.writeText(generate_export());
    copied = true;
    setTimeout(() => { copied = false; }, 2000);
  }

  function download_theme() {
    const blob = new Blob([generate_export()], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "graffiti-theme.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  const fontOptions = [
    { name: "System UI", value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif", google: "" },
    { name: "Inter", value: "'Inter', sans-serif", google: "Inter:wght@100..900" },
    { name: "Plus Jakarta Sans", value: "'Plus Jakarta Sans', sans-serif", google: "Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800" },
    { name: "Space Grotesk", value: "'Space Grotesk', sans-serif", google: "Space+Grotesk:wght@300..700" },
    { name: "Outfit", value: "'Outfit', sans-serif", google: "Outfit:wght@100..900" },
    { name: "DM Sans", value: "'DM Sans', sans-serif", google: "DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000" },
    { name: "Syne", value: "'Syne', sans-serif", google: "Syne:wght@400..800" },
    { name: "Lexend", value: "'Lexend', sans-serif", google: "Lexend:wght@100..900" },
    { name: "Manrope", value: "'Manrope', sans-serif", google: "Manrope:wght@200..800" },
    { name: "Nunito Sans", value: "'Nunito Sans', sans-serif", google: "Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000" },
    { name: "Geist Mono", value: "'Geist Mono', monospace", google: "Geist+Mono:wght@100..900" },
    { name: "Monospace", value: "'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace", google: "" },
  ];
</script>

<div class="theme-controls">
  <button
    class="theme-fab"
    aria-label="Open theme controls"
    aria-controls="theme-controls-popover"
    popovertarget="theme-controls-popover"
    popovertargetaction="toggle"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <title>palette-2</title>
      <g fill="currentColor">
        <path d="M17 9C17 4.53657 13.3437 0.926057 8.8627 1.00109C4.69746 1.07071 1.18068 4.4953 1.00711 8.65877C0.827379 12.9705 4.06314 16.5663 8.23221 16.9636C8.95801 17.0332 9.61501 16.6823 10.0212 16.1745C10.5513 15.5118 10.6344 14.5963 10.2319 13.8493L9.99465 13.4085C9.7736 12.9981 10.071 12.5 10.537 12.5H13.5C15.433 12.5 17 10.9333 17 9Z" fill-opacity="0.4" />
        <path d="M13.2426 6.5251C12.7544 7.0131 11.963 7.0131 11.4748 6.5251C10.9866 6.0368 10.9866 5.2456 11.4748 4.7573C11.963 4.269 12.7544 4.269 13.2426 4.7573C13.7308 5.2456 13.7308 6.0368 13.2426 6.5251Z" />
        <path d="M3 9C3 9.6904 3.5596 10.25 4.25 10.25C4.9404 10.25 5.5 9.6904 5.5 9C5.5 8.3096 4.9404 7.75 4.25 7.75C3.5596 7.75 3 8.3096 3 9Z" />
        <path d="M4.75729 6.5251C5.24549 7.0131 6.03689 7.0131 6.52509 6.5251C7.01329 6.0368 7.01329 5.2456 6.52509 4.7573C6.03689 4.269 5.24549 4.269 4.75729 4.7573C4.26909 5.2456 4.26909 6.0368 4.75729 6.5251Z" />
        <path d="M7.75 4.25C7.75 4.9404 8.3096 5.5 9 5.5C9.6904 5.5 10.25 4.9404 10.25 4.25C10.25 3.5596 9.6904 3 9 3C8.3096 3 7.75 3.5596 7.75 4.25Z" />
      </g>
    </svg>
  </button>

  <div
    id="theme-controls-popover"
    class="settings-popover"
    popover="auto"
  >
    <div class="settings">
      <div class="theme-header">
        <div class="theme-select">
          <label for="theme-preset">Theme</label>
          <select id="theme-preset" onchange={apply_theme}>
            {#each themes as theme (theme.name)}
              <option value={theme.name}>{theme.name}</option>
            {/each}
            <option value="Custom">Custom</option>
          </select>
        </div>
        <div class="theme-header-actions">
          <button class="export-toggle" onclick={() => { show_export = !show_export; }}>
            Export Theme
          </button>
          <button class="close-popover" aria-label="Close theme controls" popovertarget="theme-controls-popover" popovertargetaction="hide">
            Close
          </button>
        </div>
      </div>

      {#if show_export}
        <div transition:slide class="export-panel">
          <pre><code>{generate_export()}</code></pre>
          <div class="export-actions">
            <button onclick={copy_theme}>{copied ? "Copied!" : "Copy CSS"}</button>
            <button onclick={download_theme}>Download</button>
          </div>
        </div>
      {/if}

      {#if selected_theme === "Custom"}
        <div class="cluster" transition:slide>
          {#each Object.keys(theme_values) as key (key)}
            <label>
              {key.replace("_", "-")}:
              <input type="color" bind:value={theme_values[key as keyof ThemeValues]} />
            </label>
          {/each}
        </div>
      {/if}

      <div class="controls">
        <div class="control-row">
          <label for="font-family">Font</label>
          <select name="font-family" id="font-family" bind:value={font_settings.font_family}>
            {#each fontOptions as font (font.value)}
              <option value={font.value}>{font.name}</option>
            {/each}
          </select>
        </div>
        <div class="control-row">
          <label for="type-scale">Type Scale</label>
          <select id="type-scale" onchange={apply_type_scale}>
            {#each typeScales as scale (scale.name)}
              <option value={scale.name} selected={scale.name === "Default"}>{scale.name}</option>
            {/each}
          </select>
        </div>
        <div class="control-row">
          <label for="border-radius">Corners</label>
          <select id="border-radius" onchange={apply_border_radius}>
            {#each borderRadiusPresets as preset (preset.name)}
              <option value={preset.name} selected={preset.name === "Default"}>{preset.name}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .theme-controls {
    position: fixed;
    left: var(--vs-base);
    bottom: var(--vs-base);
    z-index: 100;
  }

  .theme-fab {
    width: 3.25rem;
    height: 3.25rem;
    border-radius: 999px;
    border: var(--border-1);
    background: var(--bg);
    color: var(--fg);
    box-shadow: var(--shadow-4);
    padding: 0;
    font-size: var(--fs-xs);
    line-height: 1;
    display: grid;
    place-items: center;
  }

  .settings-popover {
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    inset: auto auto calc(var(--vs-base) + 3.75rem) var(--vs-base);
    width: min(44rem, calc(100vw - (var(--vs-base) * 2)));
    max-height: min(80vh, 42rem);
    overflow: auto;
  }

  .settings-popover::backdrop {
    background: color-mix(in oklab, var(--bg-dark) 28%, transparent);
  }

  .settings {
    padding: var(--pad-m) var(--vs-l);
    border: var(--border-1);
    border-radius: var(--br-l);
    background: var(--bg);
    box-shadow: var(--shadow-5);
  }

  .theme-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vs-base);
    margin-bottom: var(--vs-base);
  }

  .theme-header-actions {
    display: flex;
    gap: var(--vs-s);
  }

  .theme-select {
    display: flex;
    align-items: center;
    gap: var(--vs-s);
    label {
      margin: 0;
      white-space: nowrap;
    }
    select {
      margin: 0;
      width: auto;
    }
  }

  .export-toggle {
    width: auto;
    font-size: var(--fs-s);
  }

  .close-popover {
    width: auto;
    font-size: var(--fs-s);
  }

  .export-panel {
    margin-bottom: var(--vs-base);
    pre {
      margin: 0 0 var(--vs-s);
      padding: var(--pad-s) var(--pad-m);
      background: var(--fg-05);
      border-radius: var(--br-s);
      font-size: var(--fs-xs);
      overflow-x: auto;
    }
  }

  .export-actions {
    display: flex;
    gap: var(--vs-s);
    button {
      width: auto;
      font-size: var(--fs-s);
    }
  }

  .cluster {
    align-items: center;
    margin-bottom: var(--vs-base);
    input {
      margin-bottom: 0;
    }
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: var(--vs-base);
  }

  .control-row {
    display: flex;
    align-items: center;
    gap: var(--vs-s);
    label {
      margin: 0;
      white-space: nowrap;
    }
    select {
      margin: 0;
      width: auto;
    }
  }

  @media (max-width: 40rem) {
    .theme-controls {
      left: var(--vs-s);
      bottom: var(--vs-s);
    }

    .settings-popover {
      inset: auto var(--vs-s) calc(var(--vs-s) + 3.5rem) var(--vs-s);
      width: auto;
      max-height: min(75vh, 34rem);
    }

    .settings {
      padding: var(--pad-m);
    }

    .theme-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>
