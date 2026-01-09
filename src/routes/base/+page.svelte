<script lang="ts">
  const colors = [
    "yellow",
    "amber",
    "orange",
    "red",
    "pink",
    "purple",
    "purple-deep",
    "indigo",
    "blue",
    "green",
    "lime",
    "highlighter",
    "brown",
    "teal",
    "gray",
    "slate",
  ];

  const static_colors = [
    {
      name: "white",
      note: "Does not change with light/dark mode. Use --fg/--bg for adaptive colors.",
    },
    {
      name: "black",
      note: "Does not change with light/dark mode. Use --fg/--bg for adaptive colors.",
    },
  ];

  const scale = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const scale_with_05 = ["05", 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const theming_scales = [
    {
      name: "fg",
      label: "Foreground",
      note: "Contrasting shades that automatically adapt to light/dark mode. Great for borders, subtle backgrounds, and text emphasis.",
    },
    {
      name: "bg",
      label: "Background",
      note: "Contrasting tints that automatically adapt to light/dark mode. Useful for layered surfaces and subtle overlays.",
    },
  ];
</script>

<!-- Base: Typography defaults + CSS Variables -->
<section class="stack readable">
  <h1>Base</h1>
  <p class="pull-quote">Foundation styles and variables.</p>
  <p>
    There is a deep base of classless CSS defaults in Graffiti giving you good
    defaults without having to memorize a bunch of classes. There is also an
    extensive CSS variable base that is focused on providing a deep system for
    consistnacy but also easy customization and theming that works in light or
    dark mode out of the box.
  </p>
</section>
<h2 class="heading" id="typography">Typography</h2>
<section class="stack">
  <h1>H1 - Large Heading</h1>
  <h2>H2 - Med Heading</h2>
  <h3>H3 - Small Heading</h3>
  <h4 style="font-weight: 700">H4 - Xtra Small Heading</h4>
  <h5>H5 - Base Heading</h5>
  <h6>H6 - Small Text Heading</h6>
  <p class="readable">
    This is a paragraph of body text. Lorem ipsum dolor sit amet, consectetur
    adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
    aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
    nisi ut aliquip ex ea commodo consequat.
  </p>
</section>
<h2 class="heading" id="variables">Variables & Tokens</h2>
<section class="stack">
  <h3>Vertical Spacing</h3>
  <div class="layout-card" style="--min-card-width: 150px">
    <div class="box" style="padding: var(--vs-xs) var(--vs-xs)">
      --vs-xs: 0.25rem
    </div>
    <div class="box" style="padding: var(--vs-s) var(--vs-s)">
      --vs-s: 0.5rem
    </div>
    <div class="box" style="padding: var(--vs-base) var(--vs-s)">
      --vs-base: 1rem
    </div>
    <div class="box" style="padding: var(--vs-m) var(--vs-s)">
      --vs-m: 1.5rem
    </div>
    <div class="box" style="padding: var(--vs-l) var(--vs-s)">--vs-l: 2rem</div>
    <div class="box" style="padding: var(--vs-xl) var(--vs-s)">
      --vs-xl: 4rem
    </div>
  </div>
</section>
<section class="stack">
  <h3>Border Radius</h3>
  <div class="layout-card" style="--min-card-width: 150px">
    <div class="box" style="border-radius: var(--br-xs)">--br-xs: 2px</div>
    <div class="box" style="border-radius: var(--br-s)">--br-s: 4px</div>
    <div class="box" style="border-radius: var(--br-m)">--br-m: 8px</div>
    <div class="box" style="border-radius: var(--br-l)">--br-l: 16px</div>
    <div class="box" style="border-radius: var(--br-xl)">--br-xl: 24px</div>
    <div class="box" style="border-radius: var(--br-xxl)">--br-xxl: 32px</div>
  </div>
</section>

<section class="stack">
  <h3>Border</h3>
  <div class="stack">
    <div style="border: var(--border-05)">--border-05</div>
    <div style="border: var(--border-1)">--border-1</div>
    <div style="border: var(--border-2)">--border-2</div>
  </div>
</section>

<section class="stack">
  <h3>Padding</h3>
  <div class="layout-card" style="--min-card-width: 150px">
    <div class="box" style="padding: var(--pad-xs)">--pad-xs: 2px</div>
    <div class="box" style="padding: var(--pad-s)">--pad-s: 6px</div>
    <div class="box" style="padding: var(--pad-m)">--pad-m: 12px</div>
    <div class="box" style="padding: var(--pad-l)">--pad-l: 25px</div>
  </div>
</section>

<section class="stack">
  <h3>Line Heights</h3>
  <p>Consistent line height tokens following the standard sizing scale</p>
  <div class="stack">
    <div class="box" style="line-height: var(--lh-xs)">
      <strong>--lh-xs: 1</strong><br />
      Extra tight single line height, useful for single-line text or very compact
      UI elements.
    </div>
    <div class="box" style="line-height: var(--lh-s)">
      <strong>--lh-s: 1.2</strong><br />
      Tight line height, useful for headings and display text where you want compact
      vertical spacing. The quick brown fox jumps over the lazy dog.
    </div>
    <div class="box" style="line-height: var(--lh)">
      <strong>--lh: 1.5</strong> (also --lh-m)<br />
      Default line height for body text. It provides comfortable reading with balanced
      spacing. The quick brown fox jumps over the lazy dog. The five boxing wizards
      jump quickly.
    </div>
    <div class="box" style="line-height: var(--lh-l)">
      <strong>--lh-l: 1.8</strong><br />
      Loose line height, creating extra vertical breathing room. Useful for larger
      body text or when you want more space between lines. The quick brown fox jumps
      over the lazy dog.
    </div>
    <div class="box" style="line-height: var(--lh-xl)">
      <strong>--lh-xl: 2</strong><br />
      Very loose double line height for maximum readability or special typographic
      treatments. The quick brown fox jumps over the lazy dog.
    </div>
  </div>
</section>

<section class="stack">
  <h3>Shadows</h3>
  <p>
    Modern layered shadows - subtle in light mode, deeper and more intense in
    dark mode
  </p>
  <div class="layout-card" style="--min-card-width: 200px">
    <div class="box invisible" style="box-shadow: var(--shadow-1)">
      --shadow-1<br />Subtle
    </div>
    <div class="box invisible" style="box-shadow: var(--shadow-2)">
      --shadow-2<br />Light lift
    </div>
    <div class="box invisible" style="box-shadow: var(--shadow-3)">
      --shadow-3<br />Moderate
    </div>
    <div class="box invisible" style="box-shadow: var(--shadow-4)">
      --shadow-4<br />Strong
    </div>
    <div class="box invisible" style="box-shadow: var(--shadow-5)">
      --shadow-5<br />Dramatic
    </div>
    <div class="box invisible" style="box-shadow: var(--shadow-6)">
      --shadow-6<br />Maximum
    </div>
  </div>
</section>

<h2 class="heading" id="colors">Colors</h2>
<section class="stack">
  <p>
    OKLCH color system with automatic 1-9 scales generated from base colors
    (scale 5) using relative color syntax
  </p>

  {#each colors as color}
    <div class="stack">
      <h4>{color.charAt(0).toUpperCase() + color.slice(1)} Scale</h4>
      {#if color !== "gray"}
        <div class="auto-color" style="--bg-color: var(--{color})">
          --{color}
        </div>
      {/if}
      <div class="cluster">
        {#each scale as n}
          <div class="auto-color" style="--bg-color: var(--{color}-{n})">
            --{color}-{n}
          </div>
        {/each}
      </div>
    </div>
  {/each}

  {#each static_colors as { name, note }}
    <div class="stack">
      <h4>{name.charAt(0).toUpperCase() + name.slice(1)} Scale (Static)</h4>
      <p class="fs-xs">{note}</p>
      <div class="auto-color" style="--bg-color: var(--{name})">
        --{name}
      </div>
      <div class="cluster">
        {#each scale as n}
          <div class="auto-color" style="--bg-color: var(--{name}-{n})">
            --{name}-{n}
          </div>
        {/each}
      </div>
    </div>
  {/each}
</section>

<section class="stack">
  <h3>Theming Variables</h3>
  <div class="layout-split">
    <div class="box" style="background: var(--fg); color: var(--bg)">
      --fg<br />Foreground color
    </div>
    <div class="box" style="background: var(--bg); color: var(--fg)">
      --bg<br />Background color
    </div>
  </div>
</section>

<section class="stack">
  {#each theming_scales as { name, label, note }}
    <div class="stack">
      <h4>{label} Scale</h4>
      <p class="fs-xs">{note}</p>
      <div class="auto-color" style="--bg-color: var(--{name})">--{name}</div>
      <div class="cluster">
        {#each scale_with_05 as n}
          <div class="auto-color" style="--bg-color: var(--{name}-{n})">
            --{name}-{n}
          </div>
        {/each}
      </div>
    </div>
  {/each}
</section>

<h2 class="heading" id="forms">Forms</h2>
<section class="stack readable">
  <p>
    Default styling for form inputs - no classes required. For form elements
    like toggles and input groups see <a href="/elements#forms"
      >Elements → Forms</a
    >. For complete form patterns see
    <a href="/ui-blocks#forms">UI Blocks → Forms</a>.
  </p>
</section>

<section>
  <h3>Text Inputs</h3>
  <p>Native input, textarea, and select elements are styled automatically.</p>
  <label for="demo-text">Text Input</label>
  <input type="text" id="demo-text" placeholder="Enter text..." />

  <label for="demo-email">Email Input</label>
  <input type="email" id="demo-email" placeholder="you@example.com" />

  <label for="demo-password">Password Input</label>
  <input type="password" id="demo-password" placeholder="••••••••" />

  <label for="demo-number">Number Input</label>
  <input type="number" id="demo-number" placeholder="0" min="0" max="100" />

  <label for="demo-textarea">Textarea</label>
  <textarea id="demo-textarea" rows="3" placeholder="Enter longer text..."
  ></textarea>

  <label for="demo-select">Select</label>
  <select id="demo-select">
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
  </select>
</section>

<section>
  <h3>Checkboxes & Radios</h3>
  <p>Native checkbox and radio inputs with automatic styling.</p>
  <label><input type="checkbox" /> Remember me</label>
  <label><input type="checkbox" checked /> Subscribe to newsletter</label>
  <label><input type="checkbox" disabled /> Disabled option</label>

  <label><input type="radio" name="plan" checked /> Free plan</label>
  <label><input type="radio" name="plan" /> Pro plan</label>
  <label><input type="radio" name="plan" /> Enterprise plan</label>
  <label><input type="radio" name="plan" disabled /> Coming soon</label>
</section>

<section>
  <h3>Date & Time</h3>
  <p>Native date and time pickers with browser-provided UI.</p>
  <label for="demo-date">Date</label>
  <input type="date" id="demo-date" />

  <label for="demo-time">Time</label>
  <input type="time" id="demo-time" />

  <label for="demo-datetime">Date & Time</label>
  <input type="datetime-local" id="demo-datetime" />
</section>

<section>
  <h3>Range</h3>
  <p>Native range slider input.</p>
  <label for="demo-range">Volume</label>
  <input type="range" id="demo-range" min="0" max="100" value="50" />
</section>

<section>
  <h3>File</h3>
  <p>
    Native file upload input. For a styled dropzone, see <a
      href="/elements#file-dropzone">Elements → File Dropzone</a
    >.
  </p>
  <label for="demo-file">Upload File</label>
  <input type="file" id="demo-file" />

  <label for="demo-file-multiple">Upload Multiple Files</label>
  <input type="file" id="demo-file-multiple" multiple />
</section>

<section class="stack">
  <h3>Validation States</h3>
  <p>
    Add <code>.error</code>, <code>.success</code>, or <code>.warning</code> classes
    to inputs for validation feedback.
  </p>
  <label for="email-error">Email (error state)</label>
  <input type="email" id="email-error" class="error" value="invalid-email" />
  <small class="error">Please enter a valid email address</small>

  <label for="username-success">Username (success state)</label>
  <input
    type="text"
    id="username-success"
    class="success"
    value="cool_username"
  />
  <small class="success">Username is available!</small>

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
</section>
