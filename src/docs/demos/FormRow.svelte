<!--
  Form Row Demo
  Shows .row used as a form field wrapper inside a form.
  Groups label, input, and optional help text with tight spacing.
-->
<form class="stack">
  <div class="row">
    <label for="row-name">Full Name</label>
    <input type="text" id="row-name" placeholder="Jane Doe" />
  </div>

  <div class="row">
    <label for="row-email">Email Address</label>
    <input type="email" id="row-email" placeholder="jane@example.com" />
    <small>We'll never share your email with anyone else.</small>
  </div>

  <div class="row">
    <label for="row-bio">Bio</label>
    <textarea id="row-bio" rows="3" placeholder="Tell us about yourself..."></textarea>
    <small>Brief description for your profile. Max 200 characters.</small>
  </div>
</form>
