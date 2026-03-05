<script lang="ts">
  import SvelteMarkdown from "@humanspeak/svelte-markdown";

  import source from "../../../../CHANGELOG.md?raw";
</script>

<section class="stack">
  <SvelteMarkdown {source} />
</section>
