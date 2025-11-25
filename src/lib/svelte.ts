import type { Attachment } from "svelte/attachments";

export const swipe_event: Attachment = (
  threshold: number,
  on_threshold: ({ triggered, dx, dxp }) => unknown,
) => {
  return (element: HTMLDivElement) => {
    function on_scroll(e) {
      const scroll_div = e.currentTarget;
      const scroll_center = scroll_div.scrollWidth / 2;
      const viewport_center = scroll_div.clientWidth / 2;
      const current = scroll_div.scrollLeft + viewport_center;

      return {
        dx: current - scroll_center,

        dxp: (current - scroll_center) / scroll_div.scrollLeft,
      };
    }

    element.addEventListener("scroll", on_scroll);

    return () => {
      element.removeEventListener("scroll", on_scroll);
    };
  };
};

export const scroll_on_load: Attachment = (element) => {
  const parent = element.parentElement as HTMLElement | null;
  if (!parent) return () => {};

  // Ensure we can safely access offsetLeft
  if (!(element instanceof HTMLElement)) return () => {};

  // run after layout
  requestAnimationFrame(() => {
    parent.scrollLeft = element.offsetLeft;
  });

  return () => {};
};
