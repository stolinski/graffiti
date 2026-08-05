<script lang="ts">
  import { onDestroy } from "svelte";

  const TIMED_TOAST_DURATION_MS: number = 5000;

  let timedToastTimer: number | undefined;
  let timedToastRun = $state(0);

  function clearTimedToastTimer(): void {
    if (timedToastTimer === undefined) return;

    window.clearTimeout(timedToastTimer);
    timedToastTimer = undefined;
  }

  function showTimedToast(event: MouseEvent & { currentTarget: HTMLButtonElement }): void {
    const timedToastViewport = event.currentTarget.popoverTargetElement;
    if (!(timedToastViewport instanceof HTMLElement)) {
      throw new Error("Timed toast trigger must target an HTML element.");
    }

    clearTimedToastTimer();
    timedToastRun += 1;
    timedToastTimer = window.setTimeout(() => {
      if (timedToastViewport.matches(":popover-open")) {
        timedToastViewport.hidePopover();
      }

      timedToastTimer = undefined;
    }, TIMED_TOAST_DURATION_MS);
  }

  onDestroy(clearTimedToastTimer);
</script>

<div class="cluster">
  <button
    class="mini"
    type="button"
    popovertarget="toast-demo-viewport"
    popovertargetaction="show"
  >
    Show toast
  </button>
  <button
    class="mini"
    type="button"
    popovertarget="timed-toast-demo-viewport"
    popovertargetaction="show"
    onclick={showTimedToast}
  >
    Show timed toast
  </button>
</div>

<div id="toast-demo-viewport" class="toast-viewport top-end" popover="manual">
  <div class="toast-item">
    <article class="toast" role="status" aria-atomic="true">
      <strong>Draft saved</strong>
      <p>Your latest changes are synced.</p>
      <button
        type="button"
        popovertarget="toast-demo-viewport"
        popovertargetaction="hide"
        aria-label="Dismiss draft saved notification"
      >
        ×
      </button>
    </article>
  </div>
</div>

<div id="timed-toast-demo-viewport" class="toast-viewport bottom-end" popover="manual">
  <div class="toast-item">
    <article
      class="toast success"
      role="status"
      aria-atomic="true"
      style:--toast-duration={`${TIMED_TOAST_DURATION_MS}ms`}
    >
      <strong>Upload complete</strong>
      <p>Your file is ready.</p>
      <button
        type="button"
        popovertarget="timed-toast-demo-viewport"
        popovertargetaction="hide"
        aria-label="Dismiss upload complete notification"
        onclick={clearTimedToastTimer}
      >
        ×
      </button>
      {#key timedToastRun}
        <span class="toast-progress" aria-hidden="true"></span>
      {/key}
    </article>
  </div>
</div>
