<script lang="ts">
  import SvelteMarkdown from "@humanspeak/svelte-markdown";
  import type { Component } from "svelte";
  import CodeExample from "./CodeExample.svelte";
  import { getDemo } from "./demos/registry";

  interface Topic {
    id: string;
    title: string;
    summary: string;
    whenToUse: string;
    classes: string[];
    demos: string[];
    markdown: string;
  }

  interface Props {
    topic: Topic;
  }

  let { topic }: Props = $props();

  function formatTopicMarkdown(markdown: string): string {
    const lines = markdown.split("\n");
    let inFence = false;
    const headingDepthShift = 3;

    return lines
      .map((line) => {
        if (/^```/.test(line)) {
          inFence = !inFence;
          return "";
        }

        if (inFence) {
          return "";
        }

        const match = /^(#{1,6})(\s+.+)$/.exec(line);
        if (!match) {
          return line;
        }

        const depth = Math.min(6, match[1].length + headingDepthShift);
        return `${"#".repeat(depth)}${match[2]}`;
      })
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  const topicMarkdown = $derived(formatTopicMarkdown(topic.markdown));

  function asComponent(value: unknown): Component<any> {
    return value as Component<any>;
  }
</script>

<section class="stack readable demo-section" aria-labelledby={topic.id}>
  <h3 class="heading" id={topic.id}>{topic.title}</h3>
  <p>{topic.summary}</p>
  <p class="fs-xs text-muted"><strong>When to use:</strong> {topic.whenToUse}</p>

  {#if topic.classes.length > 0}
    <p class="fs-xs text-muted"><strong>Classes:</strong> {topic.classes.join(", ")}</p>
  {/if}

  {#each topic.demos as demoName (demoName)}
    {@const demo = getDemo(demoName)}
    {#if demo}
      {#await Promise.all([demo.component(), demo.code()]) then [demoModule, code]}
        {@const DemoComponent = asComponent(demoModule.default)}
        <CodeExample {code} title={demoName}>
          <DemoComponent />
        </CodeExample>
      {:catch error}
        <p class="fs-xs text-muted">
          Could not load demo "{demoName}" ({error instanceof Error
            ? error.message
            : "Unknown error"}).
        </p>
      {/await}
    {:else}
      <p class="fs-xs text-muted">Demo "{demoName}" is not registered.</p>
    {/if}
  {/each}

  <SvelteMarkdown source={topicMarkdown} />
</section>
