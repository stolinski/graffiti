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
