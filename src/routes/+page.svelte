<script lang="ts">
  import { swipe_event, scroll_on_load } from "$lib/svelte";

  import UserMenu from "../docs/demos/UserMenu.svelte";
  import userMenuCode from "../docs/demos/UserMenu.svelte?raw";
  import type { ThemeValues, FontSettings } from "$lib/types";
  import CodeExample from "$docs/CodeExample.svelte";
</script>

<main style="padding-block: var(--pad-xxxl)">
  <p
    class="h5"
    style="font-weight: 900; text-align: center; text-wrap: balance; --fl:4;"
  >
    Useful CSS utilities, elements, complete UI blocks and templates.
  </p>
  <section
    class="layout-readable center stack"
    style="align-items: center; margin-block: var(--vs-xl) var(--vs-xxl);"
  >
    <h2>Install</h2>
    <p class="code">npm install @drop-in/graffiti</p>
    <p>Then drop in to your project.</p>
    <p class="code">import @drop-in/graffiti</p>
    <p class="fs-xl">or</p>
    <p>
      <a
        class="button"
        href="https://raw.githubusercontent.com/stolinski/graffiti/refs/heads/main/src/lib/drop-in.css"
        >Just copy and paste from here</a
      >
    </p>
    <p>
      <a
        href="https://raw.githubusercontent.com/stolinski/graffiti/refs/heads/main/llms.txt"
        >Give you LLM our docs</a
      >
    </p>
  </section>
</main>
