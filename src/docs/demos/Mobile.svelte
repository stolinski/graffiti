<!--
  Mobile App Patterns Demo
  Shows safe areas, app shell, bottom nav, and bottom sheet
  Note: Safe areas only visible on actual devices with notches
-->

<h2>App Shell</h2>
<p class="fs-s" style="color: var(--fg-6);">
  Grid-based container with sticky header/footer. Respects iOS safe areas.
</p>

<div class="box" style="height: 350px; padding: 0; overflow: hidden;">
  <div class="app-shell" style="--app-shell-min-height: 100%; background: var(--fg-05);">
    <header style="position: static; padding: var(--pad-m); border-bottom: var(--border-1); background: var(--bg);">
      <strong>App Header</strong>
      <span style="color: var(--fg-5); margin-inline-start: 1rem;">(sticky in real use)</span>
    </header>
    <main class="stack" style="padding: var(--pad-l); overflow-y: auto; --gap: var(--pad-m);">
      <p>Main content area scrolls independently.</p>
      <p>Uses <code>100dvh</code> to avoid iOS URL bar issues.</p>
      <p>Safe area variables:</p>
      <ul class="stack" style="--gap: var(--pad-xs);">
        <li><code>--safe-top</code></li>
        <li><code>--safe-bottom</code></li>
        <li><code>--safe-left</code></li>
        <li><code>--safe-right</code></li>
      </ul>
      <p>This content demonstrates scrolling within the main area while header and footer remain fixed in place.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
      <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </main>
    <footer style="position: static; padding: var(--pad-m); border-top: var(--border-1); background: var(--bg);">
      <span>App Footer</span>
      <span style="color: var(--fg-5); margin-inline-start: 1rem;">(sticky in real use)</span>
    </footer>
  </div>
</div>

<pre class="fs-s" style="background: var(--fg-05); padding: var(--pad-m); border-radius: var(--br-m); overflow-x: auto;"><code>&lt;div class="app-shell"&gt;
  &lt;header&gt;Sticky Header&lt;/header&gt;
  &lt;main&gt;Scrollable content&lt;/main&gt;
  &lt;footer&gt;Sticky Footer&lt;/footer&gt;
&lt;/div&gt;</code></pre>

<h2>Bottom Navigation</h2>
<p class="fs-s" style="color: var(--fg-6);">
  Fixed tab bar with icon + label. Active state via <code>aria-current="page"</code> or <code>.active</code>.
</p>

<div class="box" style="position: relative; height: 200px; overflow: hidden;">
  <div style="padding: var(--pad-l);">
    <p>Page content behind bottom nav</p>
  </div>
  <nav class="bottom-nav" style="position: absolute;">
    <a href="#" aria-current="page">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      <span>Home</span>
    </a>
    <a href="#">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <span>Search</span>
    </a>
    <a href="#">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      <span>Profile</span>
    </a>
    <a href="#">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      <span>Settings</span>
    </a>
  </nav>
</div>

<h2>Bottom Sheet</h2>
<p class="fs-s" style="color: var(--fg-6);">
  Drawer from bottom with drag handle. Use with <code>&lt;dialog&gt;</code> or popover for open/close.
</p>

<div class="box" style="position: relative; height: 300px; overflow: hidden;">
  <div style="padding: var(--pad-l);">
    <p>Content behind the sheet</p>
  </div>
  <aside class="bottom-sheet" style="position: absolute;">
    <h3>Bottom Sheet</h3>
    <p>Drag handle at top. Respects safe-bottom padding.</p>
    <p>Common uses: action sheets, share panels, filters.</p>
  </aside>
</div>

<h2>Mobile Utilities</h2>

<div class="stack">
  <div>
    <code class="fs-s">.safe-top</code>
    <code class="fs-s">.safe-bottom</code>
    <code class="fs-s">.safe-x</code>
    <p class="fs-xs" style="color: var(--fg-5);">Apply safe area padding individually</p>
  </div>
  <div>
    <code class="fs-s">.hide-scrollbar</code>
    <p class="fs-xs" style="color: var(--fg-5);">Hide scrollbar while keeping scroll</p>
  </div>
  <div>
    <code class="fs-s">.momentum-scroll</code>
    <p class="fs-xs" style="color: var(--fg-5);">iOS-style momentum scrolling</p>
  </div>
</div>
