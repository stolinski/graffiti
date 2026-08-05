# Accessible tooltip semantics

Graffiti tooltips are non-interactive supplemental descriptions. The canonical rich pattern has one focusable trigger and one sibling tooltip. The trigger keeps its native accessible name, references the tooltip `id` with `aria-describedby`, and the tip uses `role="tooltip"`:

```html
<span class="tooltip">
  <button aria-describedby="save-tip">Save</button>
  <span class="tip" id="save-tip" role="tooltip">
    Saves to your local draft folder.
  </span>
</span>
```

The tooltip cannot contain links, buttons, inputs, or other interactive descendants. Content requiring interaction is a popover or disclosure, not a tooltip.

## Visibility and activation

The rich `.tip` is `visibility: hidden` and transparent at rest. This removes the standalone tooltip node from normal accessibility-tree reading order while preserving the `aria-describedby` relationship as the trigger's accessible description. Pointer hover and focus within the wrapper reveal the same content. Pointer exit and focus exit hide it. The tip has `pointer-events: none`, never receives focus, and cannot trap keyboard users.

The zero-JavaScript contract cannot clear CSS `:hover` or `:focus-within` when Escape is pressed. Escape therefore does not dismiss a tooltip while its trigger remains hovered or focused. Consumers that need Escape dismissal because a tip may obscure content must add application behavior or choose a native popover/disclosure. Essential instructions cannot live only in a tooltip.

## Decorative pseudo tips

Pseudo tips are decorative visual copies for icon-only controls. CSS now reads `data-tooltip`, not `aria-label`:

```html
<button class="tip" aria-label="Save" data-tooltip="Save">
  <svg aria-hidden="true">...</svg>
</button>
```

The control still requires an accessible name. `data-tooltip` has no accessibility semantics and must exactly duplicate that name so pointer and keyboard users receive equivalent text. Pseudo tips do not use `role="tooltip"` or `aria-describedby`. They are not for supplemental descriptions, and `aria-label` must not be added to controls with visible text because it can replace the visible control name.

## Public API and migration

This is an observable change to the documented tooltip child and attribute contracts, so it is breaking under [ADR-0011](./0011-public-surface-and-deprecation-policy.md). Deprecation handling is **clean removal**: `.tip[aria-label]` no longer generates visible CSS content and is replaced by `.tip[data-tooltip]`.

Migration:

- Icon-only pseudo tip: retain the control's naming `aria-label`, add an identical `data-tooltip`, and mark its icon decorative.
- Visible-label control: do not add a replacement `aria-label`; use the explicit rich pattern only when the control needs a supplemental description.
- Existing rich tip: add a unique `id`, `role="tooltip"`, and matching `aria-describedby` on the trigger.
- Existing interactive tip: move controls into a popover or disclosure.

This change must ship in a major release. The task intentionally does not create release metadata; the release process must record this migration when the change is scheduled.

## Considered options

- Continue rendering `attr(aria-label)`. Rejected because a presentational selector should not force authors to overload an accessible naming attribute, especially when visible text already names the control.
- Keep `.tip[aria-label]` as an alias. Rejected because coexistence would preserve the unsafe naming contract and prevent pseudo tips from being explicitly decorative.
- Put `hidden` or `aria-hidden="true"` on rich tips. Rejected because CSS cannot toggle either attribute when hover or focus changes; the visible tip would remain absent from the accessibility tree.
- Adopt an experimental interest-invoker or scripted popover contract. Rejected because this tooltip remains a zero-JavaScript primitive and Graffiti does not add a new browser feature dependency here.
