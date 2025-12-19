<!-- App Shell Layout Demo -->
<!-- Uses .layout-sidebar.fill for sticky full-height sidebar -->
<!-- Uses .split.vertical for sidebar internal layout (nav top, footer bottom) -->

<div class="layout-sidebar fill" style="--layout-gap: 0; height: 400px;">
  <aside class="split vertical box">
    <nav class="stack no-list">
      <strong>APP NAME</strong>
      <a href="#home">Home</a>
      <a href="#dashboard">Dashboard</a>
      <a href="#settings">Settings</a>
    </nav>
    <div class="stack">
      <small>v1.0.0</small>
      <button class="mini">Upgrade</button>
    </div>
  </aside>
  <section class="stack" style="padding: var(--pad-l);">
    <h3>Main Content</h3>
    <p>The sidebar stays fixed while this content scrolls independently.</p>
    <div class="box">Content block 1</div>
  </section>
</div>
