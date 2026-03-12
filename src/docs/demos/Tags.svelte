<div class="stack">
  <!-- Default tags (using --tag-color: var(--primary)) -->
  <div class="cluster">
    <span class="tag">Default</span>
    <span class="tag">Category</span>
    <span class="tag">Label</span>
  </div>

  <!-- Semantic status variants -->
  <div class="cluster">
    <span class="tag success">Completed</span>
    <span class="tag info">Processing</span>
    <span class="tag warning">Pending</span>
    <span class="tag error">Cancelled</span>
  </div>

  <!-- Category-style tags with custom colors -->
  <div class="cluster">
    <span class="tag" style="--tag-color: var(--green)">Product</span>
    <span class="tag" style="--tag-color: var(--red)">Support</span>
    <span class="tag" style="--tag-color: var(--orange)">Design</span>
    <span class="tag" style="--tag-color: var(--purple)">Marketing</span>
    <span class="tag" style="--tag-color: var(--teal)">Docs</span>
    <span class="tag" style="--tag-color: var(--pink)">Ops</span>
  </div>

  <!-- Tags with icons -->
  <div class="cluster">
    <span class="tag" style="--tag-color: var(--green)">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><polyline points="20 6 9 17 4 12"></polyline></svg
      >
      Complete
    </span>
    <span class="tag" style="--tag-color: var(--red)">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><circle cx="12" cy="12" r="10"></circle><line
          x1="15"
          y1="9"
          x2="9"
          y2="15"
        ></line><line x1="9" y1="9" x2="15" y2="15"></line></svg
      >
      Blocked
    </span>
    <span class="tag" style="--tag-color: var(--orange)">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><circle cx="12" cy="12" r="10"></circle><line
          x1="12"
          y1="8"
          x2="12"
          y2="12"
        ></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg
      >
      Pending
    </span>
    <span class="tag">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><path
          d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
        ></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg
      >
      Tagged
    </span>
  </div>

  <!-- Tags with emoji -->
  <div class="cluster">
    <span class="tag" style="--tag-color: var(--red)">🔥 Hot</span>
    <span class="tag" style="--tag-color: var(--green)">✅ Done</span>
    <span class="tag" style="--tag-color: var(--purple)">🚀 Shipped</span>
    <span class="tag" style="--tag-color: var(--pink)">⭐ Featured</span>
    <span class="tag" style="--tag-color: var(--orange)">⚠️ Draft</span>
    <span class="tag" style="--tag-color: var(--teal)">🆕 New</span>
  </div>

  <!-- Muted variant - neutral text for better contrast -->
  <div class="cluster">
    <span class="tag muted" style="--tag-color: var(--green)">Success</span>
    <span class="tag muted" style="--tag-color: var(--red)">Error</span>
    <span class="tag muted" style="--tag-color: var(--yellow)">Warning</span>
    <span class="tag muted" style="--tag-color: var(--blue)">Info</span>
  </div>

  <!-- Interactive tags (links and buttons) -->
  <div class="cluster">
    <a href="#javascript" class="tag" style="--tag-color: var(--orange)"
      >JavaScript</a
    >
    <a href="#typescript" class="tag" style="--tag-color: var(--teal)"
      >TypeScript</a
    >
    <a href="#svelte" class="tag" style="--tag-color: var(--red)">Svelte</a>
  </div>
</div>
