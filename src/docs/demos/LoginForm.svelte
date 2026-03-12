<!--
  Login Form UI Block Demo
  A composition of existing Graffiti form elements - no custom CSS needed
-->
<form class="stack">
  <label for="login-email">Email</label>
  <input type="email" id="login-email" placeholder="you@example.com" />

  <label for="login-password">Password</label>
  <input
    type="password"
    id="login-password"
    placeholder="Enter your password"
  />

  <div class="split">
    <label class="form-option-row"><input type="checkbox" /> Remember me</label>
    <a href="#forgot">Forgot password?</a>
  </div>

  <button type="submit" class="primary">Sign In</button>

  <p class="fs-xs" style="text-align: center; color: var(--fg-5);">
    Don't have an account? <a href="#signup">Sign up</a>
  </p>
</form>
