---
id: dropdown
title: Dropdown Menu
route: ui-blocks
order: 130
summary: Native dropdown menu using HTML popover API and CSS anchor positioning.
when_to_use: Action menus using popover and anchor positioning.
classes:
  - .dropdown
  - .dropdown-menu
  - .dropdown-header
  - .end
demos:
  - Dropdown
tags:
  - ui-blocks
  - navigation
---

No JavaScript required for open/close. The trigger and menu must be children of the
same `.dropdown`, and each menu still needs a document-unique `id` referenced by
its trigger's `popovertarget`.

## Anchor Setup (Automatic)

`.dropdown` supplies a locally scoped `--dropdown` anchor by default. The local
scope lets several dropdowns reuse that internal name without a menu attaching to
another instance. No inline custom property is required.

```html
<div class="dropdown">
  <!-- trigger + menu -->
</div>
```

The legacy `--anchor` override remains available for integrations that already
assign an explicit dashed-ident:

```html
<div class="dropdown" style="--anchor: --account-menu">
  <!-- trigger + menu -->
</div>
```

Normal dropdowns should use the automatic local anchor. If supplied, the override
must start with `--`; local scoping still keeps it isolated to that dropdown.

## Basic Example

```html
<div class="dropdown">
  <button popovertarget="menu-id">Options</button>
  <div id="menu-id" popover class="dropdown-menu">
    <a href="/profile">Profile</a>
    <a href="/settings">Settings</a>
    <hr />
    <button>Sign Out</button>
  </div>
</div>
```

## How It Works

- `.dropdown` scopes the default anchor name to its subtree
- The direct `[popovertarget]` trigger declares the anchor used by its menu
- `popovertarget` on the button points to the menu's `id`
- `popover` attribute enables native popover behavior
- `.dropdown-menu` provides styling and positioning
- Clicking outside automatically closes the menu

## With Section Headers

```html
<div class="dropdown">
  <button popovertarget="actions-menu">Actions</button>
  <div id="actions-menu" popover class="dropdown-menu">
    <div class="dropdown-header">Account</div>
    <a href="/profile">Profile</a>
    <a href="/settings">Settings</a>
    <hr />
    <div class="dropdown-header">Danger Zone</div>
    <button>Delete Account</button>
  </div>
</div>
```

## End-Aligned

Use `.end` to align the menu to the trigger's inline-end edge:

```html
<div class="dropdown end">
  <button popovertarget="menu">Options</button>
  <div id="menu" popover class="dropdown-menu">
    <!-- menu items -->
  </div>
</div>
```

## Browser Behavior

Opening and dismissal require the HTML Popover API. Placement requires CSS anchor
positioning, including `anchor-scope`. In supporting browsers, the default aligns
the menu's inline-start edge to the trigger and `.end` aligns their inline-end
edges. In browsers without all of those placement features, the native popover
still opens and its actions remain usable, but it may render at an unanchored
fallback position. Graffiti does not add a JavaScript positioning polyfill.

## Disabled Items

```html
<a href="/edit" aria-disabled="true">Edit (disabled)</a>
<!-- or -->
<a href="/edit" class="disabled">Edit (disabled)</a>
```

## Menu Item Types

Links and buttons inside `.dropdown-menu` are automatically styled:

```html
<div class="dropdown-menu" popover>
  <a href="/page">Link item</a>
  <!-- navigates -->
  <button>Button item</button>
  <!-- triggers action -->
  <hr />
  <!-- divider -->
  <div class="dropdown-header">Section</div>
  <!-- section header -->
</div>
```
