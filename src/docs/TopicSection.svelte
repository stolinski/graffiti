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
    contentOnly?: boolean;
  }

  let { topic, contentOnly = false }: Props = $props();

  function formatTopicMarkdown(markdown: string): string {
    const lines = markdown.split("\n");
    let inFence = false;
    const headingDepthShift = 3;
    const withoutFences = lines
      .map((line) => {
        if (/^```/.test(line)) {
          inFence = !inFence;
          return "";
        }

        if (inFence) {
          return "";
        }

        return line;
      })
      .join("\n")
      .split("\n");

    const isListLine = (value: string): boolean =>
      /^[-*+]\s+/.test(value) || /^\d+\.\s+/.test(value);

    const hasMeaningfulContent = (body: string[]): boolean => {
      const nonEmpty = body.map((line) => line.trim()).filter(Boolean);
      if (nonEmpty.length === 0) return false;

      return nonEmpty.some((line) => {
        if (isListLine(line)) return true;
        if (line.endsWith(":")) return false;
        return true;
      });
    };

    const trimTrailingBlanks = (body: string[]): string[] => {
      const clone = [...body];
      while (clone.length > 0 && clone[clone.length - 1].trim() === "") {
        clone.pop();
      }
      return clone;
    };

    const output: string[] = [];
    let currentHeading: string | null = null;
    let currentBody: string[] = [];

    const flushSection = () => {
      if (currentHeading === null) {
        output.push(...trimTrailingBlanks(currentBody));
      } else if (hasMeaningfulContent(currentBody)) {
        output.push(currentHeading, ...trimTrailingBlanks(currentBody));
      }

      currentBody = [];
    };

    for (const line of withoutFences) {
      const match = /^(#{1,6})(\s+.+)$/.exec(line);
      if (!match) {
        currentBody.push(line);
        continue;
      }

      flushSection();
      const depth = Math.min(6, match[1].length + headingDepthShift);
      currentHeading = `${"#".repeat(depth)}${match[2]}`;
    }

    flushSection();

    return output
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  const topicMarkdown = $derived(formatTopicMarkdown(topic.markdown));
  const hasTopicNotes = $derived(topicMarkdown.length > 0);

  function asComponent(value: unknown): Component<any> {
    return value as Component<any>;
  }
</script>

<section
  class="stack readable demo-section"
  aria-labelledby={contentOnly ? undefined : topic.id}
  aria-label={contentOnly ? topic.title : undefined}
>
  {#if !contentOnly}
    <h3 class="heading" id={topic.id}>{topic.title}</h3>
    <p>{topic.summary}</p>
    <p class="fs-xs text-muted"><strong>When to use:</strong> {topic.whenToUse}</p>

    {#if topic.classes.length > 0}
      <p class="fs-xs text-muted"><strong>Classes:</strong> {topic.classes.join(", ")}</p>
    {/if}
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

  {#if hasTopicNotes}
    <details class="topic-notes right">
      <summary>Reference Notes</summary>
      <div class="stack" style="--gap: var(--vs-s); margin-top: var(--vs-s);">
        <SvelteMarkdown source={topicMarkdown} />
      </div>
    </details>
  {/if}
</section>

<style>
  .topic-notes {
    margin-top: var(--vs-s);
  }
</style>
