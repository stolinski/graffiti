---
id: table
title: Tables
route: elements
order: 290
summary: Responsive table wrapper with clean data table styling.
when_to_use: Responsive table wrapper and default table styling.
classes:
  - .table
demos:
  - Table
tags:
  - elements
  - data
---

## Basic Example

```html
<div class="table">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Jane Doe</td>
        <td>jane@example.com</td>
        <td>Admin</td>
      </tr>
      <tr>
        <td>John Smith</td>
        <td>john@example.com</td>
        <td>User</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Why the Wrapper?

The `.table` wrapper provides:

- Horizontal scrolling on small screens
- Border and border-radius on the container
- Proper overflow handling

## Styling Details

- Tables are 100% width with collapsed borders
- Headers have bottom border separator
- Cells have consistent padding
- Last row has no bottom border
- Wrapper has `overflow-x: auto` for responsiveness

## CSS Variables

- `--table-border` - Custom border-radius for wrapper

## Without Wrapper

Basic table styling also works without the wrapper, but you lose the responsive overflow and container styling:

```html
<table>
  <thead>
    <tr>
      <th>Header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data</td>
    </tr>
  </tbody>
</table>
```
