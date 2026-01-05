<button commandfor="confirm-dialog-demo" command="show-modal"
  >Open Confirm Dialog</button
>

<dialog id="confirm-dialog-demo">
  <button class="close" commandfor="confirm-dialog-demo" command="close"
    >×</button
  >
  <div class="stack" style="--layout-gap: var(--vs-l)">
    <p class="h4">Confirm Action</p>
    <p>Are you sure you want to proceed? This cannot be undone.</p>
    <div class="cluster" style="justify-content: flex-end;">
      <button commandfor="confirm-dialog-demo" command="close">Cancel</button>
      <button class="primary" commandfor="confirm-dialog-demo" command="close"
        >Confirm</button
      >
    </div>
  </div>
</dialog>
