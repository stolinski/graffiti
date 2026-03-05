<script>
  import CodeExample from "$docs/CodeExample.svelte";
  import AppShell from "$docs/demos/AppShell.svelte";
  import appShellCode from "$docs/demos/AppShell.svelte?raw";
  import BottomNav from "$docs/demos/BottomNav.svelte";
  import bottomNavCode from "$docs/demos/BottomNav.svelte?raw";
  import BottomSheet from "$docs/demos/BottomSheet.svelte";
  import bottomSheetCode from "$docs/demos/BottomSheet.svelte?raw";
  import Breadcrumbs from "$docs/demos/Breadcrumbs.svelte";
  import breadcrumbsCode from "$docs/demos/Breadcrumbs.svelte?raw";
  import Pagination from "$docs/demos/Pagination.svelte";
  import paginationCode from "$docs/demos/Pagination.svelte?raw";
  import Details from "$docs/demos/Details.svelte";
  import detailsCode from "$docs/demos/Details.svelte?raw";
  import Dropdown from "$docs/demos/Dropdown.svelte";
  import dropdownCode from "$docs/demos/Dropdown.svelte?raw";
  import SidebarNav from "$docs/demos/SidebarNav.svelte";
  import sidebarNavCode from "$docs/demos/SidebarNav.svelte?raw";
  import UserMenu from "$docs/demos/UserMenu.svelte";
  import userMenuCode from "$docs/demos/UserMenu.svelte?raw";
  import LoginForm from "$docs/demos/LoginForm.svelte";
  import loginFormCode from "$docs/demos/LoginForm.svelte?raw";
  import ConfirmDialog from "$docs/demos/ConfirmDialog.svelte";
  import confirmDialogCode from "$docs/demos/ConfirmDialog.svelte?raw";
  import Timeline from "$docs/demos/Timeline.svelte";
  import timelineCode from "$docs/demos/Timeline.svelte?raw";
  import Footer from "$docs/demos/Footer.svelte";
  import footerCode from "$docs/demos/Footer.svelte?raw";
</script>

<section class="stack readable">
  <h1>UI Blocks</h1>
  <p class="pull-quote">Common UI patterns done simply, without 100 classes.</p>
  <p>
    These are common, UI patterns that can be accomplished easily with a couple
    of classes or a combination of other Graffiti elements. Many other UI
    libraries make you bring in a react component with endless props options and
    clutter. Cut that out with real, practical html and css that you can connect
    to your framework of choice. Clientside or otherwise.
  </p>
</section>
<section class="stack">
  <h3>Accordion</h3>
  <p>
    Native HTML accordion using details/summary with smooth animations via
    @starting-style and allow-discrete.
  </p>
  <CodeExample code={detailsCode} title="Accordion Variants">
    <Details />
  </CodeExample>
</section>

<section class="stack">
  <h3>Breadcrumbs</h3>
  <p>
    Simple breadcrumb navigation with slash separators. Uses semantic HTML with
    proper ARIA attributes for accessibility.
  </p>
  <CodeExample code={breadcrumbsCode} title="Breadcrumbs">
    <Breadcrumbs />
  </CodeExample>
</section>

<section class="stack">
  <h3>Pagination</h3>
  <p>
    Compact pagination with previous/next controls and current page state using
    semantic HTML and ARIA attributes.
  </p>
  <CodeExample code={paginationCode} title="Pagination">
    <Pagination />
  </CodeExample>
</section>

<section class="stack">
  <h3>Dropdown Menu</h3>
  <p>
    Native dropdown menu using HTML popover API and CSS anchor positioning. No
    JavaScript required for open/close.
  </p>
  <CodeExample code={dropdownCode} title="Dropdown Menu">
    <Dropdown />
  </CodeExample>
</section>

<section class="stack">
  <h3>Sidebar Navigation</h3>
  <p>
    Vertical navigation for app sidebars with collapsible sections. Uses native
    details/summary for expand/collapse. Add <code>.active</code> class to show
    current page. Use <code>.sub</code> class for indented sub-items without a collapsible
    wrapper.
  </p>
  <CodeExample code={sidebarNavCode} title="Sidebar Navigation">
    <SidebarNav />
  </CodeExample>
</section>

<section class="stack">
  <h3>App Shell</h3>
  <CodeExample code={appShellCode} title="App Shell Layout">
    <AppShell />
  </CodeExample>
</section>

<section class="stack">
  <h3>Bottom Navigation</h3>
  <p>
    Floating pill-shaped tab bar for mobile apps. Active state via <code>aria-current="page"</code> or <code>.active</code>. Add <code>.blur</code> for a frosted glass effect.
  </p>
  <CodeExample code={bottomNavCode} title="Bottom Navigation">
    <BottomNav />
  </CodeExample>
</section>

<section class="stack">
  <h3>Bottom Sheet</h3>
  <p>
    Drawer from bottom with drag handle. Use with <code>&lt;dialog&gt;</code> or popover for open/close. Respects safe-bottom padding.
  </p>
  <CodeExample code={bottomSheetCode} title="Bottom Sheet">
    <BottomSheet />
  </CodeExample>
</section>

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
</section>

<section class="stack">
  <h3>User Menu</h3>
  <p>
    User account dropdown combining avatar trigger with dropdown menu. Works
    with both image and initials avatars.
  </p>
  <CodeExample code={userMenuCode} title="User Menu">
    <UserMenu />
  </CodeExample>
</section>

<section class="stack">
  <h3 id="confirm-dialog">Confirm Dialog</h3>
  <p>
    Confirmation dialog pattern using native dialog element with close button,
    title, message, and action buttons.
  </p>
  <CodeExample code={confirmDialogCode} title="Confirm Dialog">
    <ConfirmDialog />
  </CodeExample>
</section>

<section class="stack">
  <h3 id="timeline">Timeline</h3>
  <p>
    Vertical and horizontal timeline for activity feeds, step indicators, and progress tracking.
    Customize markers with icons, numbers, or any content.
  </p>
  <CodeExample code={timelineCode} title="Timeline">
    <Timeline />
  </CodeExample>
</section>

<section class="stack">
  <h3 id="footer">Footer</h3>
  <p>
    Full-featured site footer with social links, navigation columns, and legal links.
    Uses existing layout and utility classes.
  </p>
  <CodeExample code={footerCode} title="Footer">
    <Footer />
  </CodeExample>
</section>

<section class="stack">
  <h2 class="heading" id="forms">Forms</h2>
  <section class="stack readable">
    <p>
      Complete form patterns and compositions. For default input styling see <a
        href="/base#forms">Base → Forms</a
      >. For individual form elements see
      <a href="/elements#forms">Elements → Forms</a>.
    </p>
  </section>

  <section class="stack">
    <h3>Login Form</h3>
    <p>
      Simple login form using Graffiti's base form styles. No custom CSS needed.
    </p>
    <CodeExample code={loginFormCode} title="Login Form">
      <div style="max-width: 400px;">
        <LoginForm />
      </div>
    </CodeExample>
  </section>
</section>
