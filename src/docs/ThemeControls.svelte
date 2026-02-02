<script lang="ts">
  import { slide } from "svelte/transition";
  import type { ThemeValues, FontSettings } from "$lib/types";

  let {
    theme_values = $bindable(),
    font_settings = $bindable(),
  }: { theme_values: ThemeValues; font_settings: FontSettings } = $props();

  let theming = $state(false);

  const fontOptions = [
    { name: "System UI", value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif" },
    { name: "Helvetica", value: "Helvetica Neue, Helvetica, Arial, sans-serif" },
    { name: "Arial", value: "Arial, Helvetica, sans-serif" },
    { name: "Georgia", value: "Georgia, 'Times New Roman', serif" },
    { name: "Times", value: "'Times New Roman', Times, serif" },
    { name: "Verdana", value: "Verdana, Geneva, sans-serif" },
    { name: "Tahoma", value: "Tahoma, Geneva, sans-serif" },
    { name: "Trebuchet", value: "'Trebuchet MS', sans-serif" },
    { name: "Monospace", value: "'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace" },
  ];
</script>

<div class="theme-controls">
  <button onclick={() => (theming = !theming)}>Theme This Page ⇣</button>

  {#if theming}
    <div transition:slide class="settings">
      <div class="cluster">
        {#each Object.keys(theme_values) as key}
          <label>
            {key.replace("_", "-")}:
            <input type="color" bind:value={theme_values[key]} />
          </label>
        {/each}
      </div>

      <div class="controls">
        <div>
          <h2 class="h6">Global</h2>
          <label for="font-family">Font Family</label>
          <select name="font-family" id="font-family" bind:value={font_settings.font_family}>
            {#each fontOptions as font (font.value)}
              <option value={font.value}>{font.name}</option>
            {/each}
          </select>
          <label for="min-scale">Min Size Scale</label>
          <select name="min-scale" id="min-scale" bind:value={font_settings.min_ratio}>
            <option value={16 / 15}>Minor 2nd 16/15</option>
            <option value={9 / 8}>Major 2nd 9/8</option>
            <option value={6 / 5}>Minor 3rd 6/5</option>
            <option value={5 / 4}>Major 3rd 5/4</option>
            <option value={4 / 3}>Perfect Fourth 4/3</option>
            <option value={7 / 5}>Augmented Fourth 7/5</option>
            <option value={3 / 2}>Perfect Fifth 3/2</option>
            <option value={1.618}>Golden Ratio</option>
          </select>
          <label for="max-scale">Max Size Scale</label>
          <select name="max-scale" id="max-scale" bind:value={font_settings.max_ratio}>
            <option value={16 / 15}>Minor 2nd 16/15</option>
            <option value={9 / 8}>Major 2nd 9/8</option>
            <option value={6 / 5}>Minor 3rd 6/5</option>
            <option value={5 / 4}>Major 3rd 5/4</option>
            <option value={4 / 3}>Perfect Fourth 4/3</option>
            <option value={7 / 5}>Augmented Fourth 7/5</option>
            <option value={3 / 2}>Perfect Fifth 3/2</option>
            <option value={1.618}>Golden Ratio</option>
          </select>
        </div>

        <div>
          <h2 class="h6">Mobile</h2>
          <div class="conts">
            <div>
              <label for="mobile_base_font">Base Font Size</label>
              <input id="mobile_base_font" class="number" type="number" bind:value={font_settings.min_font_size} />px
            </div>
            <div>
              <label for="mobile_viewport">Viewport Size</label>
              <input id="mobile_viewport" class="viewport" type="number" bind:value={font_settings.min_viewport} />px
            </div>
          </div>
        </div>

        <div>
          <h2 class="h6">Desktop</h2>
          <div class="conts">
            <div>
              <label for="base_font">Base Font Size</label>
              <input id="base_font" class="number" type="number" bind:value={font_settings.max_font_size} />px
            </div>
            <div>
              <label for="viewport">Viewport Size</label>
              <input id="viewport" class="viewport" type="number" bind:value={font_settings.max_viewport} />px
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .theme-controls {
    position: sticky;
    top: 0;
    background: var(--bg);
    z-index: 100;
  }

  .settings {
    padding: var(--pad-m) var(--vs-l);
    border-bottom: var(--border-1);
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
    gap: var(--vs-l);
    h2 {
      margin-bottom: var(--vs-s);
    }
  }

  .conts {
    display: flex;
    gap: var(--vs-base);
  }

  .number,
  .viewport {
    width: 70px;
  }

  button {
    width: 100%;
    background: transparent;
  }
</style>
