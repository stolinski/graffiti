<script lang="ts">
  import { swipe_event, scroll_on_load } from "$lib/svelte";

  import UserMenu from "$docs/demos/UserMenu.svelte";
  import userMenuCode from "$docs/demos/UserMenu.svelte?raw";
  import type { ThemeValues, FontSettings } from "$lib/types";
  import CodeExample from "$docs/CodeExample.svelte";
</script>

<main style="padding-block: var(--pad-xxxl)">
  <section class="stack">
    <h1
      class="h5"
      style="font-weight: 900; text-align: center; text-wrap: balance; --fl:4;"
    >
      The standards-first, full-featured CSS library for the modern web.
    </h1>
    <p style="text-align: center; text-wrap: balance; max-width: 60ch; margin-inline: auto;">
      Utilities, elements, blocks, and templates. Highly configurable. Endlessly themeable. Zero JavaScript. Works with your favorite framework or straight-up HTML.
    </p>
  </section>
  <section
    class="layout-readable center stack"
    style="align-items: center; margin-block: var(--vs-xl) var(--vs-xxl);"
  >
    <h2>Install</h2>
    <p class="code">npm install @drop-in/graffiti</p>
    <p>Then drop it into your project.</p>
    <p class="code">import @drop-in/graffiti</p>
    <p class="fs-xl">or</p>
    <p>
      <a
        class="button"
        href="https://raw.githubusercontent.com/stolinski/graffiti/refs/heads/main/src/lib/drop-in.css"
        >Copy the CSS directly</a
      >
    </p>
  </section>
</main>
