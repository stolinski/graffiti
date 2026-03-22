<script>
  import { page } from "$app/state";
  import TopicSection from "$docs/TopicSection.svelte";
</script>

<TopicSection topic={page.data.topic} />
