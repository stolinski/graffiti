---
id: forms
title: Forms
route: ui-blocks
order: 230
summary: All form inputs are styled automatically. No classes needed on inputs.
when_to_use: Field rows and form actions.
classes:
  - .row
  - .form-option-row
  - .form-actions
demos:
  - Forms
tags:
  - ui-blocks
  - forms
---

## Text Inputs

```html
<label for="name">Name</label>
<input type="text" id="name" placeholder="Enter name..." />

<label for="email">Email</label>
<input type="email" id="email" placeholder="you@example.com" />

<label for="password">Password</label>
<input type="password" id="password" />
```

## Textarea

```html
<label for="message">Message</label>
<textarea id="message" rows="3" placeholder="Your message..."></textarea>
```

## Select

```html
<label for="country">Country</label>
<select id="country">
  <option>United States</option>
  <option>Canada</option>
  <option>United Kingdom</option>
</select>
```

## Checkboxes & Radios

```html
<!-- Checkboxes -->
<label><input type="checkbox" /> Remember me</label>
<label><input type="checkbox" checked /> Subscribe to newsletter</label>

<!-- Radio buttons -->
<label><input type="radio" name="plan" checked /> Free</label>
<label><input type="radio" name="plan" /> Pro</label>
<label><input type="radio" name="plan" /> Enterprise</label>
```

## Option Row Labels

Use `.form-option-row` on checkbox/radio labels to align controls and text with consistent spacing.

```html
<fieldset class="stack" style="--gap: 0.5rem;">
  <legend>Size</legend>
  <label class="form-option-row"
    ><input type="radio" name="size" checked /> Small</label
  >
  <label class="form-option-row"
    ><input type="radio" name="size" /> Medium</label
  >
  <label class="form-option-row"
    ><input type="radio" name="size" /> Large</label
  >
</fieldset>
```

## Validation States

Add `.error`, `.success`, or `.warning` to inputs:

```html
<input type="email" class="error" />
<small class="error">Please enter a valid email</small>

<input type="text" class="success" />
<small class="success">Username is available</small>

<input type="password" class="warning" />
<small class="warning">Password is weak</small>
```

## Field Rows

Use `.row` as a field wrapper to group label + control + help text.

```html
<form class="stack" style="--gap: var(--vs-m);">
  <div class="row">
    <label for="email">Email</label>
    <input type="email" id="email" />
    <small class="text-faint">Used for account notifications.</small>
  </div>

  <div class="row">
    <label for="password">Password</label>
    <input type="password" id="password" />
  </div>
</form>
```

Notes:

- Outside forms, `.row` keeps its spacing utility behavior (`margin-block`).
- Inside forms and fieldsets, `.row` becomes a compact field-group wrapper.

## Form Actions

Use `.form-actions` for submit/cancel rows.

```html
<div class="form-actions">
  <button class="ghost" type="button">Cancel</button>
  <button class="primary" type="submit">Save changes</button>
</div>
```

Behavior:

- End-aligned action row on larger containers
- Wrap-friendly spacing for longer labels
- Stacks action controls full-width in narrow containers

## Disabled Inputs

```html
<input type="text" disabled value="Can't edit this" />
<select disabled>
  <option>Can't change</option>
</select>
```
