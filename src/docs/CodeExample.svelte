<!--
	@component CodeExample

	Documentation code example component for displaying live previews with syntax-highlighted source code.
	DRY approach: import demo component once, get both rendered preview and raw source.

	Features:
	- Resizable preview container (CSS resize: horizontal) for testing responsive behavior
	- Syntax highlighting via svelte-highlight with auto-detection or explicit language
	- Light/dark theme support using Graffiti's CSS variables
	- Collapsible code section with toggle button

	@prop {string} code - Raw source code string (import with ?raw suffix)
	@prop {string} [title] - Title for the example
	@prop {'html' | 'svelte' | 'css' | 'js'} [language] - Language for syntax highlighting
	  - Auto-detects: 'svelte' if code contains script tags or Svelte syntax, otherwise 'html'
	@prop {Snippet} [children] - Rendered demo component

	Demo files go in src/docs/demos/ - each is a standalone .svelte file.
-->
<script lang="ts">
  import Highlight from "svelte-highlight";
  import { HighlightSvelte } from "svelte-highlight";
  import xml from "svelte-highlight/languages/xml";
  import css from "svelte-highlight/languages/css";
  import javascript from "svelte-highlight/languages/javascript";
  import type { Snippet } from "svelte";

  type Language = "html" | "svelte" | "css" | "js";

  interface Props {
    /** Raw source code string (import with ?raw suffix) */
    code: string;
    /** Title for the example (optional) */
    title?: string;
    /** Language for syntax highlighting (auto-detected if not specified) */
    language?: Language;
    /** Rendered demo component via default slot */
    children?: Snippet;
  }

  let { code, title, language, children }: Props = $props();

  /**
   * Auto-detect if code contains Svelte-specific syntax
   * Returns true if code has <script>, {#if}, {#each}, {@html}, $state, etc.
   */
  function hasSvelteSyntax(code: string): boolean {
    return (
      /<script[\s>]/.test(code) ||
      /\{#(if|each|await|key|snippet)/.test(code) ||
      /\{@(html|render|debug|const)/.test(code) ||
      /\$state|$derived|$effect|$props|$bindable/.test(code) ||
      /on:\w+|bind:\w+/.test(code)
    );
  }

  // Determine effective language (auto-detect if not specified)
  let effectiveLanguage = $derived<Language>(
    language ?? (hasSvelteSyntax(code) ? "svelte" : "html"),
  );

  // Map language to highlight.js language module
  const languageMap = {
    html: xml,
    css: css,
    js: javascript,
  } as const;
</script>

<svelte:head>
  {@html `<style>
		/* svelte-highlight theme - adapted for Graffiti light/dark */
		.hljs {
			background: transparent !important;
			padding: 0 !important;
		}
		.hljs-keyword,
		.hljs-selector-tag,
		.hljs-title,
		.hljs-section,
		.hljs-doctag,
		.hljs-name,
		.hljs-strong {
			color: var(--yellow);
			font-weight: 600;
		}
		.hljs-string,
		.hljs-title.class_,
		.hljs-title.class_.inherited__,
		.hljs-template-variable,
		.hljs-variable,
		.hljs-template-tag {
			color: var(--pink);
		}

		.hljs-quote {
			color: var(--fg-9);
		}

		.hljs-comment,
		.hljs-deletion {
			color: var(--fg-3);
			font-style: italic;
		}
		.hljs-number,
		.hljs-regexp,
		.hljs-literal,
		.hljs-bullet,
		.hljs-link {
			color: var(--yellow);
		}
		.hljs-meta,
		.hljs-tag {
			color: var(--fg-5);
		}

		.hljs-attr,
		.hljs-attribute {
			color: var(--yellow);
		}
		.hljs-built_in,
		.hljs-builtin-name {
			color: var(--teal);
		}
		.hljs-addition {
			color: var(--green);
			background: var(--green-1);
		}
		.hljs-emphasis {
			font-style: italic;
		}
	</style>`}
</svelte:head>

<article class="code-example">
  {#if title}
    <header class="example-header">
      <h4 class="example-title">{title}</h4>
    </header>
  {/if}

  {#if children}
    <div class="preview-container">
      <div class="preview-content">
        {@render children()}
      </div>
      <div class="resize-handle" aria-hidden="true"></div>
    </div>
  {/if}

  <details class="right">
    <summary>Code</summary>
    <div class="code-content">
      {#if effectiveLanguage === "svelte"}
        <HighlightSvelte {code} />
      {:else}
        <Highlight language={languageMap[effectiveLanguage]} {code} />
      {/if}
    </div>
  </details>
</article>

<style>
  .code-example {
    border: var(--border-1);
    border-radius: var(--br-m);
    overflow: hidden;
    margin-block: var(--vs-m);
    width: 100%;
    contain: inline-size;
  }

  .example-header {
    padding: var(--pad-m) var(--pad-l);
    border-bottom: var(--border-1);
    background: var(--fg-05);
  }

  .example-title {
    margin: 0;
    font-weight: 600;
  }

  .preview-container {
    position: relative;
    min-height: 100px;
    max-width: 100%;
    resize: horizontal;
    overflow: auto;
    border-bottom: var(--border-1);
    background: repeating-conic-gradient(
        var(--fg-05) 0% 25%,
        transparent 0% 50%
      )
      50% / 16px 16px;
  }

  .preview-content {
    padding: var(--pad-l);
    background: var(--bg);
    min-height: 100px;
    overflow: hidden;
  }

  .resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 16px;
    height: 16px;
    cursor: ew-resize;
    background: linear-gradient(
      135deg,
      transparent 50%,
      var(--fg-3) 50%,
      var(--fg-3) 60%,
      transparent 60%,
      transparent 70%,
      var(--fg-3) 70%,
      var(--fg-3) 80%,
      transparent 80%
    );
    opacity: 0.5;
    pointer-events: none;
  }

  .code-content {
    padding: var(--pad-l);
    overflow-x: auto;
    font-family:
      ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      "Liberation Mono", monospace;
    --fl: -1;
    line-height: var(--lh-l);
  }

  .code-content :global(pre) {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .code-content :global(code) {
    font-family: inherit;
  }
</style>
