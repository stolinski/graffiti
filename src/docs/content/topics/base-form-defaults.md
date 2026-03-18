---
id: form-defaults
title: "Forms"
route: base
order: 200
summary: "Classless native input styling and validation states."
when_to_use: "Building forms with minimal custom classes"
classes:
  - "input"
  - "textarea"
  - "select"
  - ".error"
  - ".success"
  - ".warning"
demos:
  - "FormInputs"
  - "FormCheckboxRadio"
  - "FormDateTime"
  - "FormRange"
  - "FormFile"
  - "FormValidation"
tags:
  - "base"
  - "forms"
---

<span id="forms"></span>

Native controls are styled out of the box, with support for consistent validation classes.

- Prefer semantic form markup (`label`, `fieldset`, help text) before custom wrappers.
- Use `.error`, `.success`, and `.warning` classes for status styling.
- Keep spacing and grouping consistent with `.row` and `.stack` helpers.
