<script lang="ts">
  const availableTags = ["Accessibility", "CSS", "Svelte", "TypeScript"];

  let tags = $state(["CSS", "Svelte"]);
  let query = $state("");

  let suggestions = $derived(
    availableTags.filter(
      (tag) =>
        !tags.includes(tag) &&
        tag.toLowerCase().includes(query.trim().toLowerCase()),
    ),
  );

  function addTag(tag: string): void {
    if (!tag || tags.includes(tag)) return;
    tags.push(tag);
    query = "";
  }

  function removeTag(tag: string): void {
    tags = tags.filter((candidate) => candidate !== tag);
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" && suggestions[0]) {
      event.preventDefault();
      addTag(suggestions[0]);
    } else if (event.key === "Backspace" && !query && tags.at(-1)) {
      removeTag(tags.at(-1)!);
    }
  }
</script>

<div class="stack">
  <label id="project-tags-label" for="project-tags-input">Tags</label>
  <div class="tag-input">
    {#each tags as tag (tag)}
      <span class="tag">
        {tag}
        <button
          type="button"
          aria-label={`Remove ${tag}`}
          onclick={() => removeTag(tag)}
        >
          ×
        </button>
      </span>
    {/each}
    <input
      id="project-tags-input"
      role="combobox"
      aria-labelledby="project-tags-label"
      aria-controls="project-tags-options"
      aria-expanded={Boolean(query && suggestions.length)}
      autocomplete="off"
      placeholder="Add tag"
      bind:value={query}
      onkeydown={handleKeydown}
    />
  </div>

  <div
    id="project-tags-options"
    class="listbox"
    role="listbox"
    hidden={!query || suggestions.length === 0}
  >
    {#each suggestions as suggestion (suggestion)}
      <button
        type="button"
        class="option"
        role="option"
        aria-selected="false"
        onclick={() => addTag(suggestion)}
      >
        {suggestion}
      </button>
    {/each}
  </div>
</div>
