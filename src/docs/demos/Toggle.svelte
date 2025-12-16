<div class="stack">
  <!-- Basic toggles -->
  <div class="cluster">
    <input type="checkbox" class="toggle" />
    <input type="checkbox" class="toggle" checked />
    <input type="checkbox" class="toggle" checked style="--toggle-color: var(--green)" />
  </div>

  <!-- Disabled states -->
  <div class="cluster">
    <input type="checkbox" class="toggle" disabled />
    <input type="checkbox" class="toggle" checked disabled />
  </div>

  <!-- Compact variant -->
  <div class="cluster">
    <input type="checkbox" class="toggle compact" />
    <input type="checkbox" class="toggle compact" checked />
  </div>

  <!-- With labels -->
  <div class="stack">
    <label class="cluster">
      <input type="checkbox" class="toggle" />
      <span>Enable notifications</span>
    </label>
    <label class="cluster">
      <input type="checkbox" class="toggle" checked />
      <span>Dark mode</span>
    </label>
  </div>
</div>
