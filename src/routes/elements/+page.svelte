<script lang="ts">
  import CodeExample from "$docs/CodeExample.svelte";
  import Carousel from "$docs/demos/Carousel.svelte";
  import carouselCode from "$docs/demos/Carousel.svelte?raw";
  import calloutCode from "$docs/demos/Callout.svelte?raw";
  import avatarCode from "$docs/demos/Avatar.svelte?raw";
  import buttonsCode from "$docs/demos/Buttons.svelte?raw";
  import Reel from "$docs/demos/Reel.svelte";
  import reelCode from "$docs/demos/Reel.svelte?raw";
  import Buttons from "$docs/demos/Buttons.svelte";
  import Avatar from "$docs/demos/Avatar.svelte";
  import Callout from "$docs/demos/Callout.svelte";
  import Toggle from "$docs/demos/Toggle.svelte";
  import toggleCode from "$docs/demos/Toggle.svelte?raw";
  import InputGroup from "$docs/demos/InputGroup.svelte";
  import inputGroupCode from "$docs/demos/InputGroup.svelte?raw";
  import Search from "$docs/demos/Search.svelte";
  import searchCode from "$docs/demos/Search.svelte?raw";
  import Dropzone from "$docs/demos/Dropzone.svelte";
  import dropzoneCode from "$docs/demos/Dropzone.svelte?raw";
  import Dialog from "$docs/demos/Dialog.svelte";
  import dialogCode from "$docs/demos/Dialog.svelte?raw";
  import Chips from "$docs/demos/Chips.svelte";
  import chipsCode from "$docs/demos/Chips.svelte?raw";
  import Tags from "$docs/demos/Tags.svelte";
  import tagsCode from "$docs/demos/Tags.svelte?raw";
  import ListNav from "$docs/demos/ListNav.svelte";
  import listNavCode from "$docs/demos/ListNav.svelte?raw";
  import Tooltip from "$docs/demos/Tooltip.svelte";
  import tooltipCode from "$docs/demos/Tooltip.svelte?raw";
  import Tabs from "$docs/demos/Tabs.svelte";
  import tabsCode from "$docs/demos/Tabs.svelte?raw";
</script>

<section class="stack readable">
  <h1>Elements</h1>
  <p class="pull-quote">
    UI components or custom elements with just a class or two.
  </p>
  <p>
    These are common, non-complex UI elements that can be done with mostly a
    single class and minimal html. You shouldn't have to bring in a whole
    JavaScript framework component for the things many of us do. It can be so
    much more simple.
  </p>
</section>

<!-- <div class="layout-sidebar invert fixed"> -->
<!-- <aside>
    <h4>On This Page</h4>
    <a href="#carousel">Carousel</a>
    <a href="#reel">Reel</a>
  </aside> -->

<!-- Carousel Layout -->
<section class="stack">
  <h3 id="carousel">.carousel</h3>
  <p>Horizontal scroll with CSS scroll-snap (no JavaScript required)</p>
  <CodeExample code={carouselCode} title=".carousel">
    <Carousel />
  </CodeExample>
</section>

<section id="reel" class="stack">
  <h3>.reel</h3>
  <p>
    Vertical scroll with CSS scroll-snap (customizable height with
    --reel-height)
  </p>
  <CodeExample code={reelCode} title="Reel Layout">
    <Reel />
  </CodeExample>
</section>
<!-- </div> -->

<section class="stack">
  <h3>Boxes</h3>
  <div class="layout-card" style="--min-card-width: 200px">
    <div class="box">.box<br />Simple</div>
    <div class="box glow">.box.glow<br />Subtle</div>
    <div class="box semi-gloss">
      .box.semi-gloss<br />Semi Gloss
    </div>
    <div class="box ghost">.box.ghost<br />Ghost</div>
    <div class="box invisible">.box.invisible<br />Invisible</div>
    <div style="box-shadow: var(--box), var(--shadow-6)">
      You can make a custom box with CSS variables box-shadow: var(--box),
      var(--shadow-5);
    </div>
  </div>
</section>
<section class="stack">
  <h3>.avatar</h3>
  <p>
    Circular avatar for user images or initials. Supports multiple sizes and
    optional border.
  </p>
  <CodeExample code={avatarCode} title="Avatar Variants">
    <Avatar />
  </CodeExample>
</section>
<section class="stack">
  <h3>.button</h3>
  <p>Button styling for links and non-button elements</p>
  <CodeExample code={buttonsCode} title="Button Variants">
    <Buttons />
  </CodeExample>
</section>
<section class="stack">
  <h3>.chip</h3>
  <p>
    Selectable pill/tag elements for filters, categories, or multi-select options.
    Use <code>aria-pressed</code> for accessible toggle state.
  </p>
  <CodeExample code={chipsCode} title="Chip Selector">
    <Chips />
  </CodeExample>
</section>
<section class="stack">
  <h3>.tag</h3>
  <p>
    Subtle category labels with customizable colors. Set <code>--tag-color</code> to any color variable.
    Works as static labels or interactive links/buttons. Add <code>.muted</code> for neutral text with better contrast.
  </p>
  <CodeExample code={tagsCode} title="Tags">
    <Tags />
  </CodeExample>
</section>
<section class="stack">
  <h3 id="tooltip">.tooltip</h3>
  <p>
    Native tooltip using HTML popover API and CSS anchor positioning. No JavaScript required.
    Uses <code>popover="hint"</code> for hover-triggered display. Supports top (default), bottom, left, and right positions.
  </p>
  <CodeExample code={tooltipCode} title="Tooltip">
    <Tooltip />
  </CodeExample>
</section>
<section class="stack">
  <h3 id="tabs">.tabs</h3>
  <p>
    Pure CSS tabs using details/summary with CSS Grid and Subgrid. No JavaScript required.
    Set <code>--tab-count</code> to match your number of tabs (default: 3).
    Use <code>--n</code> on each details element to position its tab.
  </p>
  <CodeExample code={tabsCode} title="Tabs">
    <Tabs />
  </CodeExample>
</section>
<section class="stack">
  <h3>.table</h3>
  <p>
    A wrapping div for overflow scrolling, but also generic tables styles
    defined by default without the wrapping claas.
  </p>
  <div class="table">
    <table>
      <thead>
        <tr>
          <th>Hi</th>
          <th>Hello</th>
          <th>sup</th>
          <th>✅ Icon or emoji in this</th>
          <th>Yo</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Hi</td>
          <td>Hello</td>
          <td>sup</td>
          <td>
            Some data in this cell that might be a bit long I don't know.
          </td>
          <td>Yo</td>
        </tr>
        <tr>
          <td>Hi</td>
          <td>Hello</td>
          <td>sup</td>
          <td>
            Some data in this cell that might be a bit long I don't know.
          </td>
          <td>Yo</td>
        </tr>
        <tr>
          <td>Hi</td>
          <td>Hello</td>
          <td>sup</td>
          <td>
            Some data in this cell that might be a bit long I don't know.
          </td>
          <td>Yo</td>
        </tr>
        <tr>
          <td>Hi</td>
          <td>Hello</td>
          <td>sup</td>
          <td>
            Some data in this cell that might be a bit long I don't know.
          </td>
          <td>Yo</td>
        </tr>
        <tr>
          <td>Hi</td>
          <td>Hello</td>
          <td>sup</td>
          <td>
            Some data in this cell that might be a bit long I don't know.
          </td>
          <td>Yo</td>
        </tr>
        <tr>
          <td>Hi</td>
          <td>Hello</td>
          <td>sup</td>
          <td>
            Some data in this cell that might be a bit long I don't know.
          </td>
          <td>Yo</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>
<section class="stack">
  <h3>.callout</h3>
  <p>An informational callout</p>
  <CodeExample code={calloutCode} title="Callout Variants">
    <Callout />
  </CodeExample>
</section>

<section class="stack">
  <h3 id="dialog">dialog</h3>
  <p>
    Native HTML dialog element with animations. Use <code>.close</code> for the close button.
    See <a href="/ui-blocks#confirm-dialog">UI Blocks → Confirm Dialog</a> for a complete example.
  </p>
  <CodeExample code={dialogCode} title="Dialog">
    <Dialog />
  </CodeExample>
</section>

<section class="stack">
  <h3 id="list-nav">.list-nav</h3>
  <p>
    Navigation list with clickable rows for settings pages, menus, and navigation indexes.
    Supports icons, descriptions, chevrons, and a bordered variant.
  </p>
  <CodeExample code={listNavCode} title="List Navigation">
    <ListNav />
  </CodeExample>
</section>

<h2 class="heading" id="forms">Forms</h2>

<section class="stack readable">
  <p>
    Form elements with minimal classes. For default input styling see <a href="/base#forms">Base → Forms</a>.
    For complete form patterns see <a href="/ui-blocks#forms">UI Blocks → Forms</a>.
  </p>
</section>

<section class="stack">
  <h3>Toggle Switch</h3>
  <p>Accessible toggle/switch input using native checkbox semantics</p>
  <CodeExample code={toggleCode} title="Toggle Variants">
    <Toggle />
  </CodeExample>
</section>

<section class="stack">
  <h3>Input Group</h3>
  <p>
    Input field with connected button - commonly used for copy-to-clipboard, search,
    or form submission patterns. Works with all button variants.
  </p>
  <CodeExample code={inputGroupCode} title="Input Group">
    <InputGroup />
  </CodeExample>
</section>

<section class="stack">
  <h3>Search Input</h3>
  <p>
    Search input with icon. Get icons from <a href="https://phosphoricons.com/" target="_blank" rel="noopener">Phosphor Icons</a>.
  </p>
  <CodeExample code={searchCode} title="Search Input">
    <Search />
  </CodeExample>
</section>

<section class="stack">
  <h3 id="file-dropzone">File Dropzone</h3>
  <p>
    Drag-and-drop file upload zone. Wraps a native file input for click-to-upload fallback.
  </p>
  <CodeExample code={dropzoneCode} title="File Dropzone">
    <Dropzone />
  </CodeExample>
</section>
