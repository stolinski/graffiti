<div class="stack">
  <!-- Default tabs (3 tabs) -->
  <div class="tabs">
    <details name="tabs-default" open style="--n: 1">
      <summary>Overview</summary>
      <div>
        <p>Pure CSS tabs using details/summary with CSS Grid and Subgrid. No JavaScript required - the <code>name</code> attribute on details ensures only one tab can be open at a time.</p>
      </div>
    </details>
    <details name="tabs-default" style="--n: 2">
      <summary>Features</summary>
      <div>
        <p>Supports keyboard navigation, works with screen readers, and uses semantic HTML. Each tab panel smoothly animates in.</p>
      </div>
    </details>
    <details name="tabs-default" style="--n: 3">
      <summary>Usage</summary>
      <div>
        <p>Set <code>--tab-count</code> on the container to match your number of tabs. Use <code>--n</code> on each details element to position its tab.</p>
      </div>
    </details>
  </div>

  <!-- Boxed variant -->
  <div class="tabs boxed">
    <details name="tabs-boxed" open style="--n: 1">
      <summary>Account</summary>
      <div>
        <p>Manage your account settings and preferences.</p>
      </div>
    </details>
    <details name="tabs-boxed" style="--n: 2">
      <summary>Security</summary>
      <div>
        <p>Update your password and security settings.</p>
      </div>
    </details>
    <details name="tabs-boxed" style="--n: 3">
      <summary>Billing</summary>
      <div>
        <p>View your billing history and payment methods.</p>
      </div>
    </details>
  </div>

  <!-- Pill variant -->
  <div class="tabs pill" style="--tab-count: 3">
    <details name="tabs-pill" open style="--n: 1">
      <summary>Content</summary>
      <div>
        <p>Primary content view with full details and context.</p>
      </div>
    </details>
    <details name="tabs-pill" style="--n: 2">
      <summary>History</summary>
      <div>
        <p>Timeline of previous updates, edits, and activity.</p>
      </div>
    </details>
    <details name="tabs-pill" style="--n: 3">
      <summary>Insights</summary>
      <div>
        <p>Key observations and highlights from recent engagement.</p>
      </div>
    </details>
  </div>
</div>
