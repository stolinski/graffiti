<div class="stack">
  <p>
    Add <code>.error</code>, <code>.success</code>, or <code>.warning</code> classes
    to inputs for validation feedback.
  </p>
  <label for="email-error">Email (error state)</label>
  <input type="email" id="email-error" class="error" value="invalid-email" />
  <small class="error">Please enter a valid email address</small>

  <label for="username-success">Username (success state)</label>
  <input
    type="text"
    id="username-success"
    class="success"
    value="cool_username"
  />
  <small class="success">Username is available!</small>

  <label for="password-warning">Password (warning state)</label>
  <input
    type="password"
    id="password-warning"
    class="warning"
    value="password123"
  />
  <small class="warning"
    >Password is weak. Consider using a stronger password.</small
  >
</div>
