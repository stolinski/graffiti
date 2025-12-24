<script lang="ts">
  import SvelteMarkdown from "@humanspeak/svelte-markdown";

  import source from "../../../CHANGELOG.md?raw";
</script>

<div class="stack">
  <SvelteMarkdown {source} />
</div>
