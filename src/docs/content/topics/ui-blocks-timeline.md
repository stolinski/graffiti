---
id: timeline
title: Timeline
route: ui-blocks
order: 210
summary: Activity feeds, step indicators, and progress tracking with status variants and glow effects.
when_to_use: Progress steps and chronological activity flows.
classes:
  - .timeline
  - .horizontal
  - .active
  - .completed
  - .success
  - .warning
  - .error
  - .info
demos:
  - Timeline
  - TimelineStepper
  - TimelineStatus
tags:
  - ui-blocks
  - progress
---

## Vertical Timeline (Activity Feed)

```html
<ol class="timeline">
  <li>
    <span class="marker">
      <svg><!-- icon --></svg>
    </span>
    <p><strong>username</strong> performed an action</p>
  </li>
  <li class="completed">
    <span class="marker">
      <svg><!-- checkmark icon --></svg>
    </span>
    <p><strong>reviewer</strong> approved changes</p>
  </li>
</ol>
```

## Horizontal Timeline (Stepper)

Add `.horizontal` for step indicators:

```html
<ol class="timeline horizontal">
  <li class="completed">
    <span class="marker">
      <svg><!-- checkmark --></svg>
    </span>
    <p>Account</p>
  </li>
  <li class="completed">
    <span class="marker">
      <svg><!-- checkmark --></svg>
    </span>
    <p>Shipping</p>
  </li>
  <li class="active">
    <span class="marker">3</span>
    <p>Payment</p>
  </li>
  <li>
    <span class="marker">4</span>
    <p>Confirm</p>
  </li>
</ol>
```

## Status Variants

Apply status classes to `<li>` for colored markers with glow effects:

```html
<ol class="timeline">
  <li class="success">
    <span class="marker"
      ><svg><!-- check --></svg></span
    >
    <p>Build completed successfully</p>
  </li>
  <li class="warning">
    <span class="marker"
      ><svg><!-- warning --></svg></span
    >
    <p>3 deprecation warnings</p>
  </li>
  <li class="error">
    <span class="marker"
      ><svg><!-- x --></svg></span
    >
    <p>Deployment failed</p>
  </li>
  <li class="info">
    <span class="marker"
      ><svg><!-- info --></svg></span
    >
    <p>New version available</p>
  </li>
</ol>
```

## State Classes

| Class        | Use                      | Visual                             |
| ------------ | ------------------------ | ---------------------------------- |
| `.active`    | Current step in progress | Bold filled marker with ring       |
| `.completed` | Finished step            | Green filled marker with glow      |
| `.success`   | Success status           | Green-tinted background with glow  |
| `.warning`   | Warning status           | Yellow-tinted background with glow |
| `.error`     | Error status             | Red-tinted background with glow    |
| `.info`      | Info status              | Blue-tinted background with glow   |

## Marker Content

The `.marker` element can contain:

- **Text/numbers**: `<span class="marker">1</span>`
- **SVG icons**: `<span class="marker"><svg>...</svg></span>`
- **Emoji**: `<span class="marker">✓</span>`

SVG icons are automatically sized to 1.125rem (18px).

## CSS Custom Properties

```css
.timeline {
  --timeline-marker-size: 2.5rem; /* Marker circle size */
  --timeline-marker-color: var(--fg); /* Icon/text color */
  --timeline-line-width: 2px; /* Connecting line width */
  --timeline-line-color: var(--fg-1); /* Connecting line color */
  --timeline-gap: var(--pad-l); /* Gap between marker and content */
}
```

## Visual Features

- **Shadows**: Multi-layered box-shadow for depth
- **Inner highlight**: Subtle top highlight for 3D effect
- **Borders**: Colored borders matching status variants
- **Glow rings**: `0 0 0 3px` spread shadow for colored halo effect
- **Gradients**: Completed markers have gradient fill (lighter top, darker bottom)

## Use Cases

- **Activity feeds**: PR activity, commit history, user actions
- **Changelogs**: Version history with status indicators
- **Steppers**: Multi-step forms, checkout flow, onboarding
- **Build logs**: CI/CD pipeline status
- **Notifications**: Action history with status
