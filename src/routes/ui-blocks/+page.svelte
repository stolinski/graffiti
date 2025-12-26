<script>
  import CodeExample from "$docs/CodeExample.svelte";
  import AppShell from "$docs/demos/AppShell.svelte";
  import appShellCode from "$docs/demos/AppShell.svelte?raw";
  import Breadcrumbs from "$docs/demos/Breadcrumbs.svelte";
  import breadcrumbsCode from "$docs/demos/Breadcrumbs.svelte?raw";
  import Details from "$docs/demos/Details.svelte";
  import detailsCode from "$docs/demos/Details.svelte?raw";
  import Dropdown from "$docs/demos/Dropdown.svelte";
  import dropdownCode from "$docs/demos/Dropdown.svelte?raw";
  import InputGroup from "$docs/demos/InputGroup.svelte";
  import inputGroupCode from "$docs/demos/InputGroup.svelte?raw";
  import SidebarNav from "$docs/demos/SidebarNav.svelte";
  import sidebarNavCode from "$docs/demos/SidebarNav.svelte?raw";
  import UserMenu from "$docs/demos/UserMenu.svelte";
  import userMenuCode from "$docs/demos/UserMenu.svelte?raw";
  import { scroll_on_load, swipe_event } from "$lib/svelte";
</script>

<div class="stack readable">
  <h1>UI Blocks</h1>
  <p class="pull-quote">Common UI patterns done simply, without 100 classes.</p>
  <p>
    These are common, UI patterns that can be accomplished easily with a couple
    of classes or a combination of other Graffiti elements. Many other UI
    libraries make you bring in a react component with endless props options and
    clutter. Cut that out with real, practical html and css that you can connect
    to your framework of choice. Clientside or otherwise.
  </p>
</div>
<section class=" stack">
  <h3>Accordion</h3>
  <p>
    Native HTML accordion using details/summary with smooth animations via
    @starting-style and allow-discrete.
  </p>
  <CodeExample code={detailsCode} title="Accordion Variants">
    <Details />
  </CodeExample>
</section>

<section class=" stack">
  <h3>Breadcrumbs</h3>
  <p>
    Simple breadcrumb navigation with slash separators. Uses semantic HTML with
    proper ARIA attributes for accessibility.
  </p>
  <CodeExample code={breadcrumbsCode} title="Breadcrumbs">
    <Breadcrumbs />
  </CodeExample>
</section>

<section class=" stack">
  <h3>Dropdown Menu</h3>
  <p>
    Native dropdown menu using HTML popover API and CSS anchor positioning. No
    JavaScript required for open/close.
  </p>
  <CodeExample code={dropdownCode} title="Dropdown Menu">
    <Dropdown />
  </CodeExample>
</section>

<section class=" stack">
  <h3>Input Group</h3>
  <p>
    Input field with connected button - commonly used for copy-to-clipboard, search,
    or form submission patterns. Works with all button variants.
  </p>
  <CodeExample code={inputGroupCode} title="Input Group">
    <InputGroup />
  </CodeExample>
</section>

<section class=" stack">
  <h3>Sidebar Navigation</h3>
  <p>
    Vertical navigation for app sidebars with collapsible sections. Uses native
    details/summary for expand/collapse. Add <code>.active</code> class to show current
    page.
  </p>
  <CodeExample code={sidebarNavCode} title="Sidebar Navigation">
    <SidebarNav />
  </CodeExample>
</section>

<CodeExample code={appShellCode} title="App Shell Layout">
  <AppShell />
</CodeExample>

<section class="stack">
  <h3>.header</h3>
  <p>Full-width header with navigation</p>
  <header class="header">
    <h6>Your Logo</h6>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/">About</a></li>
        <li><a href="/">Contact</a></li>
      </ul>
    </nav>
  </header>

  <h4>&.border</h4>
  <p>Header with subtle border on bottom</p>
  <header class="header border">
    <h6>Your Logo</h6>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/">About</a></li>
        <li><a href="/">Contact</a></li>
      </ul>
    </nav>
  </header>

  <h4>&.sticky</h4>
  <p>Header that sticks to the top when scrolling</p>
  <header class="header border sticky">
    <span>Sticky Header</span>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/">About</a></li>
        <li><a href="/">Contact</a></li>
      </ul>
    </nav>
  </header>
</section>

<section class="stack">
  <h3>.swipe</h3>
  <p>Interactive swipe component</p>
  <div class="swipe">
    <button style="background: var(--red);">❌</button>
    <div style="min-height: 200px">
      <p>
        You can swipe me side to side, no JavaScript. (although you do need JS
        for events)
      </p>
    </div>
    <button style="background: var(--green);">✅</button>
  </div>
  <h4>&.stop</h4>
  <p>Swiper that stays in it's "open" state.</p>
  <div class="swipe stop">
    <button style="background: var(--red);">❌</button>
    <div {@attach scroll_on_load} style="min-height: 100px">
      <p>You can swipe me side to side, minor JavaScript needed for Safari</p>
    </div>
    <button style="background: var(--green);">✅</button>
  </div>

  <p>You can have multiple buttons of various styles too.</p>
  <div class="swipe stop">
    <div class="split even" style="--gap: 10px; padding: var(--pad-m)">
      <button style="height: 100%">Hide</button>
      <button style="height: 100%">Save</button>
    </div>
    <div style="min-height: 100px" {@attach scroll_on_load}>
      <p>You can swipe me side to side, minor JavaScript needed for Safari</p>
    </div>
    <div class="split even" style="--gap: 10px; padding: var(--pad-m)">
      <button style="height: 100%">Up</button>
      <button style="height: 100%">Down</button>
    </div>
  </div>
</section>

<div class="stack">
  <h3>User Menu</h3>
  <p>
    User account dropdown combining avatar trigger with dropdown menu. Works
    with both image and initials avatars.
  </p>
  <CodeExample code={userMenuCode} title="User Menu">
    <UserMenu />
  </CodeExample>
</div>
