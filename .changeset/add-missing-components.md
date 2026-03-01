---
"@drop-in/graffiti": minor
---

Add card, pagination, mobile app patterns, and scroll utilities

**New components:**

- `.card` — Content container with header/footer borders, padded body sections (`.card-body`, `main`, `section`), and full-width media support
- `.pagination` — Layout-only pagination bar (flex row with centered page list and border-top); pairs with `.button.ghost` for controls
- `.app-shell` — Mobile-first app container using CSS grid (`auto 1fr auto`) with safe-area inset padding and sticky header/footer
- `.bottom-nav` — Fixed bottom tab bar with icon + label pattern, active state via `aria-current="page"`, safe-area aware
- `.bottom-sheet` — Fixed bottom drawer with rounded top corners, drag handle pseudo-element, and safe-area bottom padding

**New utilities:**

- `.safe-top` / `.safe-bottom` / `.safe-x` — Apply safe-area inset padding for mobile viewports
- `.hide-scrollbar` — Hide scrollbar cross-browser while preserving scroll
- `.momentum-scroll` — iOS momentum scrolling with overscroll containment

**Reworked:**

- `.pagination` uses `.button.ghost` instead of custom button styles — pagination is now layout-only, no longer re-declares button properties
- `.list-nav` focus state updated to use `--focus-ring` / `--focus-ring-offset-inset` tokens instead of hardcoded values
