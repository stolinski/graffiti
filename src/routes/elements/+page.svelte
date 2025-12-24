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

<h2 class="heading">Forms</h2>

<section class="stack">
  <div class="stack">
    <h3>Toggle Switch</h3>
    <p>Accessible toggle/switch input using native checkbox semantics</p>
    <CodeExample code={toggleCode} title="Toggle Variants">
      <Toggle />
    </CodeExample>
  </div>

  <div class="stack">
    <h3>Form Validation States</h3>
    <p>Built-in styles for error, success, and warning states</p>

    <form class="stack" style="max-width: 500px">
      <div class="stack" style="--gap: 0.5rem">
        <label for="email-error">Email (error state)</label>
        <input
          type="email"
          id="email-error"
          class="error"
          value="invalid-email"
        />
        <small class="error">Please enter a valid email address</small>
      </div>

      <div class="stack" style="--gap: 0.5rem">
        <label for="username-success">Username (success state)</label>
        <input
          type="text"
          id="username-success"
          class="success"
          value="cool_username"
        />
        <small class="success">Username is available!</small>
      </div>

      <div class="stack" style="--gap: 0.5rem">
        <label for="password-warning">Password (warning state)</label>
        <input
          type="password"
          id="password-warning"
          class="warning"
          value="password123"
        />
        <small class="warning"
          >Password is weak. Consider using a stronger password.</small
        >
      </div>

      <div class="stack" style="--gap: 0.5rem">
        <label for="name-default">Full Name (default state)</label>
        <input type="text" id="name-default" placeholder="Enter your name" />
      </div>
    </form>
  </div>
</section>
