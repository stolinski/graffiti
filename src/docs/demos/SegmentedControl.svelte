<script lang="ts">
  let view = $state("board");
</script>

<div class="stack">
  <fieldset class="segmented-control">
    <legend class="visually-hidden">Project view</legend>
    <label>
      <input type="radio" name="project-view" value="list" bind:group={view} />
      List
    </label>
    <label>
      <input type="radio" name="project-view" value="board" bind:group={view} />
      Board
    </label>
    <label>
      <input
        type="radio"
        name="project-view"
        value="timeline"
        bind:group={view}
      />
      Timeline
    </label>
  </fieldset>

  <p aria-live="polite">Current view: {view}</p>
</div>
