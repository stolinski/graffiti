<!--
  Form Actions Demo
  Shows .form-actions for submit/cancel button groups at the end of a form.
  Buttons stack full-width on narrow containers.
-->
<form class="stack">
  <div class="row">
    <label for="actions-name">Display Name</label>
    <input type="text" id="actions-name" placeholder="Your display name" />
  </div>

  <div class="row">
    <label for="actions-email">Email</label>
    <input type="email" id="actions-email" placeholder="you@example.com" />
  </div>

  <div class="form-actions">
    <button type="button" class="ghost">Cancel</button>
    <button type="submit" class="primary">Save Changes</button>
  </div>
</form>
