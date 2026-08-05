<article class="stack" style="--gap: var(--vs-xl);">
  <header class="layout-split" style="--layout-gap: var(--vs-xl);">
    <div class="stack" style="--gap: var(--vs-s);">
      <p class="mono text-faint">09 · Schematic system</p>
      <h1>Build the system in visible layers.</h1>
    </div>
    <p class="text-muted">
      This preset turns Graffiti into a product field manual without changing component markup.
    </p>
  </header>

  <section
    class="layout-card"
    style="--min-card-width: 11rem;"
    aria-label="Theme decisions"
  >
    <article class="stat-card">
      <small>Canvas</small>
      <strong>Warm paper</strong>
    </article>
    <article class="stat-card">
      <small>Type</small>
      <strong>Manrope + DM Mono</strong>
    </article>
    <article class="stat-card">
      <small>Geometry</small>
      <strong>1 px rules</strong>
    </article>
    <article class="stat-card">
      <small>Signals</small>
      <strong>Coral + mint</strong>
    </article>
  </section>

  <section class="stack" style="--gap: var(--vs-l);" aria-labelledby="schematic-decisions">
    <header class="cluster">
      <h2 id="schematic-decisions">One system, four decisions.</h2>
      <fieldset class="segmented-control compact">
        <legend class="visually-hidden">Schematic reference view</legend>
        <label><input type="radio" name="schematic-reference-view" checked /> Overview</label>
        <label><input type="radio" name="schematic-reference-view" /> Components</label>
        <label><input type="radio" name="schematic-reference-view" /> Tokens</label>
      </fieldset>
    </header>

    <div class="layout-card" style="--min-card-width: 15rem;">
      <article class="feature-card">
        <h3>01 · Hierarchy</h3>
        <p>Large, tightly tracked Manrope headings sit against compact DM Mono annotations.</p>
      </article>
      <article class="feature-card">
        <h3>02 · Surfaces</h3>
        <p>Near-square corners, shared one-pixel rules, and zero shadow keep every role on one plane.</p>
      </article>
      <article class="feature-card">
        <h3>03 · State</h3>
        <p>Selected controls invert ink and paper; focus and active states stay short, flat, and explicit.</p>
      </article>
    </div>
  </section>

  <section class="layout-split" aria-label="Theme scope and implementation">
    <article class="card featured">
      <header>
        <h3>Composition remains consumer-owned.</h3>
        <span class="tag success">Scope</span>
      </header>
      <p>
        Theme tokens and role selectors set the visual grammar; page sequence, density, and narrative remain decisions in consumer markup.
      </p>
      <aside class="callout">
        <p>Illustrations and alternating section bands are not synthesized by a theme.</p>
      </aside>
    </article>

    <div class="table">
      <table>
        <caption>Theme implementation</caption>
        <thead>
          <tr>
            <th scope="col">Role</th>
            <th scope="col">Implementation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Typography</th>
            <td>Manrope hierarchy; DM Mono labels, controls, code, and data.</td>
          </tr>
          <tr>
            <th scope="row">Surface</th>
            <td>One-pixel rules, 2–4 px radii, no shadows, and shared card-grid edges.</td>
          </tr>
          <tr>
            <th scope="row">Action</th>
            <td>Flat controls, 80–180 ms transitions, and a one-pixel active offset.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</article>
