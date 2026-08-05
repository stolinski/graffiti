<div class="stack" style="--gap: var(--vs-l)">
  <div class="grid auto">
    <label class="stack">
      Upload progress
      <progress class="progress" value="68" max="100">68%</progress>
    </label>

    <label class="stack">
      Storage quota
      <meter
        class="meter signaling"
        min="0"
        max="100"
        low="30"
        high="80"
        optimum="40"
        value="72">72%</meter
      >
    </label>
  </div>

  <p class="cluster">
    <span class="spinner" role="status" aria-label="Loading projects"></span>
    Loading projects
  </p>

  <div class="stack" aria-busy="true" aria-label="Loading project summary">
    <span class="skeleton text" aria-hidden="true">Loading heading</span>
    <span class="skeleton text" aria-hidden="true">Loading summary</span>
  </div>

  <section class="empty compact">
    <span class="icon" aria-hidden="true">○</span>
    <h3>No archived projects</h3>
    <p>Projects you archive will appear here.</p>
  </section>
</div>
