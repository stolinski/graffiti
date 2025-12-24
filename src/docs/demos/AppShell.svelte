<!-- App Shell Layout Demo -->
<!-- Uses .layout-sidebar.fill for sticky full-height sidebar -->
<!-- Uses .split.vertical for sidebar internal layout (nav top, footer bottom) -->

<div class="layout-sidebar fill" style="--layout-gap: 0; height: 400px;">
  <aside class="split vertical box">
    <nav class="sidebar-nav">
      <strong style="padding: var(--pad-s) var(--pad-m);">APP NAME</strong>
      <a href="#home" class="active"> Home </a>
      <a href="#dashboard"> Dashboard </a>
      <details>
        <summary> Settings </summary>
        <a href="#general">General</a>
      </details>
    </nav>
    <div class="stack" style="padding: var(--pad-s) var(--pad-m);">
      <small>v1.0.0</small>
      <button class="mini">Upgrade</button>
    </div>
  </aside>
  <section class="stack" style="padding: var(--pad-l); ">
    <h3>Main Content</h3>
    <p>The sidebar stays fixed while this content scrolls independently.</p>
    <div class="box">Content block 1</div>
  </section>
</div>
