<div class="stack" style="max-width: 320px;">
  <div class="stack">
    <label for="project-status">Project status</label>
    <select id="project-status" name="project-status">
      <option value="planning">Planning</option>
      <option value="in-review" selected>In review</option>
      <option value="approved">Approved</option>
      <option value="archived">Archived</option>
    </select>
  </div>

  <div class="stack">
    <label for="select-error">Validation error</label>
    <select id="select-error" class="error">
      <option value="">Select a role…</option>
      <option value="admin">Admin</option>
      <option value="editor">Editor</option>
    </select>
    <small>Please select a role</small>
  </div>

  <div class="stack">
    <label for="select-disabled">Disabled</label>
    <select id="select-disabled" disabled>
      <option>Cannot change</option>
    </select>
  </div>
</div>
