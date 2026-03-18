<script>
  import SvelteMarkdown from "@humanspeak/svelte-markdown";
  import TopicSection from "$docs/TopicSection.svelte";
  import * as docsContentRuntime from "$docs/content/runtime.js";

  const routeKey = "utilities";
  const routeIntro = /** @type {any} */ (docsContentRuntime).getRouteIntro(routeKey);
  const topics = docsContentRuntime.getTopicsForRoute(routeKey);

  if (!routeIntro) {
    throw new Error(`Missing route intro content for "${routeKey}"`);
  }
</script>

<section class="stack readable">
  <h1>{routeIntro.title}</h1>
  <p class="pull-quote">{routeIntro.tagline}</p>
  <SvelteMarkdown source={routeIntro.markdown} />
</section>

{#each topics as topic (topic.id)}
  <TopicSection {topic} />
{/each}
