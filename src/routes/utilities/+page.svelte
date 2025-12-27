<script lang="ts">
</script>

<section class="stack readable">
  <h1>CSS Utilities</h1>
  <p class="pull-quote">These utility classes actually have utility.</p>
  <p>
    We aren't replicating CSS with classnames, but providing real functionality
    to be combined or used individually. If you want a common layout or pattern
    or even automatic color contrast, we've got you.
  </p>
</section>

<!-- Layout Card -->

<h2 class="heading" id="layouts">Layouts</h2>
<section class="stack">
  <h3>.layout-card</h3>
  <p>Auto-fill responsive card grid</p>
  <div class="layout-card" style="background: var(--fg-05)">
    <div class="box">Card 1</div>
    <div class="box">Card 2</div>
    <div class="box">Card 3</div>
    <div class="box">Card 4</div>
  </div>
</section>

<!-- Layout Sidebar -->
<section class="stack">
  <h3>.layout-sidebar</h3>
  <p>Sidebar + main content (250px default)</p>
  <div class="layout-sidebar" style="background: var(--fg-05)">
    <aside class="box">Sidebar</aside>
    <main class="box">Main Content</main>
  </div>

  <h4>&.narrow</h4>
  <div class="layout-sidebar narrow" style="background: var(--fg-05)">
    <aside class="box">150px Sidebar</aside>
    <main class="box">Main Content</main>
  </div>

  <h4>&.wide</h4>
  <div class="layout-sidebar wide" style="background: var(--fg-05)">
    <aside class="box">350px Sidebar</aside>
    <main class="box">Main Content</main>
  </div>

  <h4>&.invert</h4>
  <div class="layout-sidebar invert" style="background: var(--fg-05)">
    <aside class="box">Sidebar</aside>
    <main class="box">Main Content</main>
  </div>

  <h4>&.fill</h4>
  <p>
    Full-height sticky sidebar for app shells. Combine with <code
      >.split.vertical</code
    > for sidebar internal layout.
  </p>
  <p>See <a href="/ui-blocks">UI Blocks</a> for full layout templates.</p>
</section>

<!-- Layout Split -->
<section class="stack">
  <h3>.layout-split</h3>
  <p>50/50 two column layout</p>
  <div class="layout-split" style="background: var(--fg-05)">
    <div class="box">Left Column</div>
    <div class="box">Right Column</div>
  </div>

  <h4>&.no-stack</h4>
  <p>Stays side-by-side on mobile</p>
  <div class="layout-split no-stack" style="background: var(--fg-05)">
    <div class="box">Left</div>
    <div class="box">Right</div>
  </div>
</section>

<!-- Layout Three Col -->
<section class="stack">
  <h3>.layout-three-col</h3>
  <p>Three equal columns</p>
  <div class="layout-three-col" style="background: var(--fg-05)">
    <div class="box">Column 1</div>
    <div class="box">Column 2</div>
    <div class="box">Column 3</div>
  </div>
</section>

<!-- Layout Readable -->
<section class="stack">
  <h3>.layout-readable</h3>
  <p>Max-width for optimal readability (default: start-aligned)</p>
  <div class="layout-readable" style="background: var(--fg-05)">
    <div class="box">
      <p>
        Learning to drop in on a skateboard is an exciting and challenging
        milestone for any skateboarder. Before attempting to drop in, ensure
        that you have a solid foundation of basic skateboarding skills.
      </p>
    </div>
  </div>

  <h4>&.center</h4>
  <div class="layout-readable center" style="background: var(--fg-05)">
    <div class="box">
      <p>Centered readable content with max-width constraint.</p>
    </div>
  </div>

  <h4>&.end</h4>
  <div class="layout-readable end" style="background: var(--fg-05)">
    <div class="box">
      <p>End-aligned readable content with max-width constraint.</p>
    </div>
  </div>

  <!-- <h4>.layout-readable with .full-bleed child</h4>
  <div class="layout-readable center stack" style="background: var(--fg-05)">
    <div class="box">
      <p>Regular readable content...</p>
    </div>
    <div class="full-bleed box">
      <p>Full bleed element breaks out of container!</p>
    </div>
    <div class="box">
      <p>More readable content...</p>
    </div>
  </div> -->
</section>

<h2 class="heading" id="organization">Organization</h2>
<p>Group and cluster your stuff in common ways.</p>
<section>
  <h3>.stack</h3>
  <p>Vertical flexbox stack with gap</p>
  <div class="stack">
    <div class="box">Item 1</div>
    <div class="box">Item 2</div>
    <div class="box">Item 3</div>
  </div>
</section>

<!-- Cluster Layout -->
<section class="stack">
  <h3>.cluster</h3>
  <p>
    Horizontal wrapping list with gap (perfect for tags, pills, breadcrumbs)
  </p>
  <div class="cluster" style="background: var(--fg-05); padding: 1rem">
    <span class="box" style="padding: 0.5rem 1rem">Tag 1</span>
    <span class="box" style="padding: 0.5rem 1rem">Tag 2</span>
    <span class="box" style="padding: 0.5rem 1rem">Tag 3</span>
    <span class="box" style="padding: 0.5rem 1rem">Tag 4</span>
    <span class="box" style="padding: 0.5rem 1rem">Tag 5</span>
    <span class="box" style="padding: 0.5rem 1rem">Tag 6</span>
  </div>
</section>

<section class="stack">
  <h3>.split</h3>
  <p>Flex with space-between and top alignment (used in header)</p>
  <div class="split" style="background: var(--fg-05); padding: 1rem">
    <div class="box">Left Side</div>
    <div class="box">Right Side</div>
  </div>

  <h4>&.vertical</h4>
  <p>Vertical split - pushes first and last children to opposite ends</p>
  <div
    class="split vertical"
    style="background: var(--fg-05); padding: 1rem; height: 200px;"
  >
    <div class="box">Top</div>
    <div class="box">Bottom</div>
  </div>
</section>

<section class="stack">
  <h3>.flex</h3>
  <p>Display flex with 20px gap</p>
  <div class="flex" style="background: var(--fg-05); padding: 1rem">
    <div class="box">Flex Item 1</div>
    <div class="box">Flex Item 2</div>
    <div class="box">Flex Item 3</div>
  </div>
</section>

<section>
  <h3>.grid</h3>
  <p>Minimal grid utility (like .flex)</p>
  <div
    class="grid"
    style="grid-template-columns: minmax(auto, 200px) 1fr minmax(auto, 200px)"
  >
    <div class="box">200px</div>
    <div class="box">Flexible</div>
    <div class="box">200px</div>
  </div>
</section>

<h2 class="heading" id="handy">Handy Stuff</h2>

<section class="stack">
  <h3>.readable</h3>
  <p>Max-width 900px container</p>
  <div class="readable" style="background: var(--fg-05)">
    <div class="box">
      <p>
        This content is constrained to 900px max-width for optimal readability.
        Unlike .layout-readable, this doesn't include padding.
      </p>
    </div>
  </div>
</section>

<section class="stack">
  <div class="stack">
    <h3>.no-list</h3>
    <p>Remove list styling (margin, padding, list-style)</p>
    <ul class="no-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </div>

  <div class="stack">
    <h3>.circle</h3>
    <p>Circular element (default --size: 40px)</p>
    <div class="flex">
      <button class="circle">✓</button>
      <button class="circle" style="--size: 60px">✗</button>
      <button class="circle" style="--size: 80px">!</button>
    </div>
  </div>

  <div class="stack">
    <h3>.row</h3>
    <p>Add vertical margin (--vs-m)</p>
    <div style="background: var(--fg-05); padding: 1rem">
      <div class="box">No .row class</div>
      <div class="box row">With .row class - has margin-block</div>
      <div class="box">No .row class</div>
    </div>
  </div>

  <div class="stack">
    <h3>.visually-hidden</h3>
    <p>Hide element visually but keep accessible to screen readers</p>
    <div class="box">
      <p>
        There is hidden text after this colon:
        <span class="visually-hidden"
          >This text is hidden visually but available to screen readers!</span
        >
      </p>
      <p>You can't see it, but it's there for accessibility.</p>
    </div>
  </div>

  <div class="stack">
    <h3>.auto-color</h3>
    <p>
      Automatically sets text color (light or dark) based on background
      luminosity
    </p>
    <div class="flex" style="flex-wrap: wrap; gap: 1rem">
      <div
        class="auto-color"
        style="--bg-color: var(--blue-5); padding: var(--pad-m); border-radius: var(--br-m);"
      >
        Blue background
      </div>
      <div
        class="auto-color"
        style="--bg-color: var(--yellow-3); padding: var(--pad-m); border-radius: var(--br-m);"
      >
        Yellow background
      </div>
      <div
        class="auto-color"
        style="--bg-color: var(--red-7); padding: var(--pad-m); border-radius: var(--br-m);"
      >
        Dark red background
      </div>
      <div
        class="auto-color"
        style="--bg-color: var(--green-4); padding: var(--pad-m); border-radius: var(--br-m);"
      >
        Green background
      </div>
      <div
        class="auto-color"
        style="--bg-color: var(--purple-6); padding: var(--pad-m); border-radius: var(--br-m);"
      >
        Purple background
      </div>
    </div>
    <p class="fs-xs">
      Set <code>--bg-color</code> and the text color adjusts automatically
    </p>
  </div>

  <div class="stack">
    <h3>Aspect Ratio Utilities</h3>
    <p>
      Maintain specific aspect ratios for containers (useful for images, videos,
      cards)
    </p>
    <div class="layout-card" style="--min-card-width: 200px">
      <div class="aspect-square box" style="display: grid; place-items: center">
        .aspect-square<br />1:1
      </div>
      <div class="aspect-video box" style="display: grid; place-items: center">
        .aspect-video<br />16:9
      </div>
      <div class="aspect-4-3 box" style="display: grid; place-items: center">
        .aspect-4-3<br />4:3
      </div>
      <div class="aspect-21-9 box" style="display: grid; place-items: center">
        .aspect-21-9<br />21:9
      </div>
    </div>
    <p class="fs-xs">
      Custom: Use <code>aspect-ratio: 2 / 1;</code> or
      <code>aspect-ratio: var(--aspect-ratio);</code>
    </p>
  </div>

  <div class="stack">
    <h3>.fc (Fluid Container)</h3>
    <p>Makes typography responsive to container width instead of viewport</p>
    <div class="layout-split">
      <div class="box">
        <h4>Regular (viewport-based)</h4>
        <h2>This heading scales with viewport</h2>
        <p>Text scales with viewport width</p>
      </div>
      <div class="box fc">
        <h4>With .fc (container-based)</h4>
        <h2>This heading scales with container</h2>
        <p>Text scales with this box's width</p>
      </div>
    </div>
  </div>
</section>
<h2 class="heading" id="font-sizing">Font Sizing</h2>
<section class="stack">
  <div class="stack">
    <h3>.h1 - .h6</h3>
    <p>Apply heading sizes to any element without semantic heading tags</p>
    <div class="stack" style="--gap: 0.5rem">
      <p class="h1">.h1 - Largest heading size</p>
      <p class="h2">.h2 - Second level</p>
      <p class="h3">.h3 - Third level</p>
      <p class="h4">.h4 - Fourth level</p>
      <p class="h5">.h5 - Fifth level</p>
      <p class="h6">.h6 - Sixth level</p>
    </div>
  </div>

  <div class="stack">
    <h3>.fs-* (Font Size)</h3>
    <p>Fluid font size utilities using the --fl (fluid level) system</p>
    <div class="stack" style="--gap: 0.5rem">
      <p class="fs-xs">.fs-xs - Extra small (--fl: -1)</p>
      <p class="fs-base">.fs-base - Base size (--fl: 0)</p>
      <p class="fs-s">.fs-s - Small heading (--fl: 1)</p>
      <p class="fs-m">.fs-m - Medium (--fl: 2)</p>
      <p class="fs-l">.fs-l - Large (--fl: 3)</p>
      <p class="fs-xl">.fs-xl - Extra large (--fl: 4)</p>
      <p class="fs-xxl">.fs-xxl - Double extra large (--fl: 5)</p>
      <p class="fs-xxxl">.fs-xxxl - Triple extra large (--fl: 6)</p>
    </div>
  </div>
</section>
