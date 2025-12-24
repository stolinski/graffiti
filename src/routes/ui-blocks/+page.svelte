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
  import SidebarNav from "$docs/demos/SidebarNav.svelte";
  import sidebarNavCode from "$docs/demos/SidebarNav.svelte?raw";
  import UserMenu from "$docs/demos/UserMenu.svelte";
  import userMenuCode from "$docs/demos/UserMenu.svelte?raw";
  import { scroll_on_load, swipe_event } from "$lib/svelte";
</script>

<h1>UI Blocks</h1>
<p>Common UI patterns done simply, without 100 classes.</p>

<section class="demo-section stack">
  <h3>Accordion</h3>
  <p>
    Native HTML accordion using details/summary with smooth animations via
    @starting-style and allow-discrete.
  </p>
  <CodeExample code={detailsCode} title="Accordion Variants">
    <Details />
  </CodeExample>
</section>

<section class="demo-section stack">
  <h3>Breadcrumbs</h3>
  <p>
    Simple breadcrumb navigation with slash separators. Uses semantic HTML with
    proper ARIA attributes for accessibility.
  </p>
  <CodeExample code={breadcrumbsCode} title="Breadcrumbs">
    <Breadcrumbs />
  </CodeExample>
</section>

<section class="demo-section stack">
  <h3>Dropdown Menu</h3>
  <p>
    Native dropdown menu using HTML popover API and CSS anchor positioning. No
    JavaScript required for open/close.
  </p>
  <CodeExample code={dropdownCode} title="Dropdown Menu">
    <Dropdown />
  </CodeExample>
</section>

<section class="demo-section stack">
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

<div class="stack">
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

  <h3>.header.border</h3>
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

  <h3>.header.sticky</h3>
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
</div>

<section class="demo-section stack">
  <h3>.swipe</h3>
  <p>Interactive swipe component</p>
  <div class="swipe" {@attach swipe_event(70, () => {})}>
    <button style="background: var(--red);">❌</button>
    <div style="min-height: 200px">
      <p>
        You can swipe me side to side, no JavaScript. (although you do need JS
        for events)
      </p>
    </div>
    <button style="background: var(--green);">✅</button>
  </div>
  <h3>.swipe.stop</h3>
  <p>Swiper that stays in it's "open" state.</p>
  <div class="swipe stop">
    <button style="background: var(--red);">❌</button>
    <div {@attach scroll_on_load} style="min-height: 100px">
      <p>
        You can swipe me side to side, minor JavaScript needed for Safari.
        (although you do need JS for events)
      </p>
    </div>
    <button style="background: var(--green);">✅</button>
  </div>

  <h3>.swipe.stop.full-bleed</h3>
  <p>Swiper that stays in it's "open" state.</p>
  <div class="swipe stop full-bleed">
    <button style="background: var(--red);">❌</button>
    <div style="min-height: 100px" {@attach scroll_on_load}>
      <p>
        You can swipe me side to side, no JavaScript. (although you do need JS
        for events)
      </p>
    </div>
    <button style="background: var(--green);">✅</button>
  </div>

  <p>You can have multiple buttons of various styles too.</p>
  <div class="swipe stop full-bleed">
    <div class="split even" style="--gap: 10px; padding: var(--pad-m)">
      <button style="height: 100%">Hide</button>
      <button style="height: 100%">Save</button>
    </div>
    <div style="min-height: 100px" {@attach scroll_on_load}>
      <p>
        You can swipe me side to side, no JavaScript. (although you do need JS
        for events)
      </p>
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
