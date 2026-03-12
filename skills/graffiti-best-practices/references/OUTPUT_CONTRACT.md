# Output Contract

Version: 1.0

This contract defines the mandatory output structure and quality gates for Graffiti best-practices generation.

## 1) Mandatory Response Sections (In Order)

Every response must include these sections in this order:

1. **Intent and Constraints**
   - One sentence summarizing user goal.
   - List explicit constraints (framework, scope, interaction requirements, accessibility, style limits).

2. **Recipe Selection**
   - State which canonical pattern(s) are being used.
   - If no exact recipe exists, state closest fallback and why.

3. **Markup Output**
   - Provide one final code block (`html` or `svelte`) that is ready to use.
   - No pseudo-code.

4. **Verification Checklist**
   - Report pass/fail for each quality gate in section 6.
   - Include inline style declaration count and budget result.

5. **Known Limitations and Adaptation Path**
   - If any requirement could not be met with current classes, list limitation + fallback used.

## 2) Markup Rules

- Use only classes that exist in current Graffiti CSS.
- Use semantic HTML structure appropriate to the requested intent.
- Keep class usage compositional and readable (avoid unnecessary wrappers).
- Prefer existing utility/component classes over inline declarations.
- Use a Graffiti-first approach before adding custom CSS.
- Custom CSS is allowed when needed, but it must be implemented as reusable project-level classes/utilities (not ad-hoc local overrides).

## 3) Inline Style Policy

### 3.1 Allowed Inline Styles

Allowed only when using custom property overrides or bounded layout exceptions.

Approved custom property examples:

- Spacing/layout: `--gap`, `--layout-gap`, `--min-card-width`, `--max-width`, `--padding`
- Component tokens: `--tag-color`, `--bubble-*`, `--toggle-color`, `--callout-*`

Bounded layout exceptions:

- One-off `max-width` or width constraints where no utility exists

### 3.2 Disallowed Inline Styles

- Hardcoded color declarations (`color: #...`, `background: #...`) unless explicitly requested
- Repeated margin reset patterns (`margin: 0`) where utility/class pattern can be used
- Ad-hoc typography styling that duplicates existing text classes
- Layout declarations (`display`, `grid-template-*`, etc.) where existing layout classes apply

### 3.3 Inline Style Budget

- Section-level budget: maximum 3 declarations per section
- Page-level budget: maximum 12 declarations total
- Any budget overrun requires explicit justification in Verification Checklist

## 4) Accessibility and Semantics Minimums

Must satisfy all of the following:

1. Landmark tags for page-level output (`header`, `nav`, `main`, `footer` as appropriate)
2. Logical heading hierarchy
3. Labels for all form controls
4. Correct table semantics for data tables
5. State attributes where applicable (`aria-current`, `open`, checked state)
6. Meaningful link/button semantics (navigation uses links, actions use buttons)

## 5) Framework Compatibility Rules

- Default output: framework-agnostic HTML.
- Svelte output is allowed when requested.
- In Svelte mode:
  - Prefer markup-first output for static sections.
  - Add script/state only when user explicitly requires interaction or dynamic behavior.
  - Do not introduce unnecessary runes/state for static sections.

## 6) Quality Gates (Scored + Hard Fails)

### 6.1 Weighted Score

Total score: 100

- Valid class usage (all classes exist): 30
- Inline style policy and budget compliance: 20
- Accessibility and semantics: 20
- Responsive composition quality: 15
- Fidelity to canonical Graffiti patterns: 15

Minimum pass score: 85

### 6.2 Hard Fail Conditions

Any hard fail means overall fail regardless of score:

1. Uses unknown class names
2. Violates disallowed inline style rules
3. Missing required accessibility baseline (labels/landmarks/table semantics)
4. Missing one or more mandatory response sections from section 1

## 7) Verification Checklist Template

Use this exact checklist format in responses:

- Class validity: PASS/FAIL (unknown classes: N)
- Inline styles: PASS/FAIL (declarations: N, section max: N, page max: N)
- Accessibility semantics: PASS/FAIL (landmarks, headings, labels, states, table semantics)
- Responsive composition: PASS/FAIL (mobile + desktop layout behavior)
- Graffiti fidelity: PASS/FAIL (matches canonical composition patterns)
- Overall score: N/100 (PASS >= 85)

## 8) Recovery Rules

If output fails any gate:

1. Remove or replace non-canonical classes.
2. Replace disallowed inline styles with class-based alternatives.
3. Add missing semantic/accessibility structure.
4. Recalculate score and re-run checklist.

If failure is due to an unsupported pattern, keep class-first fallback and document the limitation plus an optional adaptation path (for example a reusable custom class in project styles).
