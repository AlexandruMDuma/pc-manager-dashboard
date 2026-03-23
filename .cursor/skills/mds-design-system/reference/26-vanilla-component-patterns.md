# MDS Vanilla Patterns (Components + Core)

## Scope

Use when building UI in pure vanilla HTML/CSS/JS — no React, no TSX, no `@ui` wrappers. Express design decisions with CSS classes and MDS tokens.

## Token Loading Order

Load token files first, then page/component CSS:

```html
<link rel="stylesheet" href="css/mds/colors.css">
<link rel="stylesheet" href="css/mds/typography.css">
<link rel="stylesheet" href="css/mds/elevation.css">
<link rel="stylesheet" href="css/mds/spacing.css">
<link rel="stylesheet" href="css/mds/grid.css">
```

Add component token files only as needed (tabs, badge, table, button, progress-bar, etc.).

## Core Guardrails (Vanilla)

1. Use MDS tokens (`var(--mds-...)`) instead of hard-coded values.
2. No gradients/fades for chart marks.
3. In tables, never apply `display:flex` or `display:grid` directly to `td`/`th`.
4. Bower restrictions remain: only display contexts + approved sizes/weights.
5. **Always include `[hidden] { display: none !important; }` in the global reset.** Without this, component styles like `display: inline-flex` or `display: flex` on author stylesheets will override the browser's default `[hidden]` rule, causing visually hidden elements (e.g. wizard buttons toggled via JS) to remain visible.

```css
/* global.css — required reset */
[hidden] {
  display: none !important;
}
```

## Vanilla Baseline Pattern

```html
<section class="dashboard">
  <header class="dashboard-header">
    <h1 class="dashboard-title">Project Portfolio</h1>
    <p class="dashboard-subtitle">Track delivery and resourcing</p>
  </header>
</section>
```

```css
.dashboard-title {
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-heading-2);
  font-weight: var(--mds-font-weight-medium);
}

.dashboard-subtitle {
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-body-1);
}
```

## Decision Branch

- If task mentions React, `@ui`, TSX, or wrapper components: use React guidance (`30-mdss-react.md`).
- If task mentions vanilla HTML/CSS/JS: stay in this doc and related vanilla references.

## Tabs (Vanilla)

Use `--mds-tabs-*` tokens and active-tab-only indicator.

```html
<nav class="tabs" role="tablist">
  <button class="tabs__tab tabs__tab--active" role="tab">Upload</button>
  <button class="tabs__tab" role="tab">Preview</button>
</nav>
```

```css
.tabs {
  display: flex;
  gap: var(--mds-tabs-gap);
  margin-bottom: var(--mds-spacing-8);
}

.tabs__tab {
  padding: var(--mds-tabs-padding-y) var(--mds-tabs-padding-x);
  color: var(--mds-tabs-text-default);
  border: none;
  border-bottom: var(--mds-tabs-indicator-height) solid transparent;
}

.tabs__tab--active {
  color: var(--mds-tabs-text-active);
  border-bottom-color: var(--mds-tabs-indicator-color);
}
```

## Progress Bars (Vanilla)

Use `--mds-progress-bar-*` tokens and square corners.

```html
<div class="progress">
  <!-- Width is set via JS: fill.style.width = pct + '%' -->
  <div class="progress__fill" role="progressbar" aria-valuenow="48" aria-valuemin="0" aria-valuemax="100"></div>
</div>
```

```css
.progress {
  height: var(--mds-progress-bar-height-8px);
  background: var(--mds-progress-bar-track);
  overflow: hidden;
}

.progress__fill {
  height: 100%;
  width: 0%;
  background: var(--mds-progress-bar-fill);
}
```

## Buttons (Vanilla)

### Color token roles

| Token | Hex | Use for |
|---|---|---|
| `--mds-color-electric-blue-500` | `#2251FF` | Primary buttons, active CTAs, interactive actions |
| `--mds-color-deep-blue-900` | `#051C2C` | Page headers, nav bars, dark structural backgrounds |

Never swap these. Deep blue is a **brand/structure** color; electric blue is the **interactive/action** color.

### Button variants

```html
<button class="mds-button mds-button--primary" type="submit">Save</button>
<button class="mds-button mds-button--secondary" type="button">Cancel</button>
```

```css
/* ✅ GOOD — electric blue for primary CTA */
.mds-button--primary {
  background: var(--mds-color-electric-blue-500);
  border: 1.5px solid var(--mds-color-electric-blue-500);
  color: var(--mds-color-white);
}

.mds-button--primary:hover {
  background: #1a40e0;
  border-color: #1a40e0;
}

.mds-button--secondary {
  background: transparent;
  border: 1.5px solid var(--mds-color-electric-blue-500);
  color: var(--mds-color-electric-blue-500);
}

/* ❌ BAD — deep blue used as primary button color */
.mds-button--primary {
  background: var(--mds-color-deep-blue-900); /* wrong — structural color, not interactive */
}
```

### Common base styles (apply to all variants)

```css
.mds-button {
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-body-sm);
  font-weight: var(--mds-font-weight-medium);
  padding: 0.625rem 1.75rem;
  border-radius: 4px;
  cursor: pointer;
}

.mds-button:focus-visible {
  outline: 2px solid var(--mds-color-electric-blue-500);
  outline-offset: 2px;
}
```

### Button placement and hierarchy

**Rules — all are absolute:**

1. **Only one primary button per form page or view.** If a page has multiple actions, all others must be secondary or tertiary. The AI/system must decide the hierarchy — do not default every action to primary.
2. **The primary button is always the rightmost button** in any button group.
3. **The button group is always left-aligned.** Use `justify-content: flex-start` with `gap`. Never use `space-between`, `flex-end`, or `center` to position button rows.

**Decision guide — which button gets `--primary`?**

| Scenario | Primary | Secondary |
|---|---|---|
| Single forward action | The forward CTA | — |
| Back + forward | Forward CTA (e.g. Continue, Submit) | Back |
| Save + Cancel | Save / Confirm | Cancel |
| Submit + Save Draft | Submit | Save Draft |
| Multi-step form (mutually exclusive CTAs) | The one visible at that step | Hidden one has no visible style |

**Multi-step forms:** When two primary CTAs swap based on step (e.g. "Continue" on steps 1–3, "Submit" on step 4), both may carry `mds-button--primary` in the DOM provided they are **never visible simultaneously**. Visibility is controlled by `hidden` — only the visible button's style matters at runtime.

```html
<!-- ✅ GOOD — group left-aligned, primary rightmost within the group -->
<div class="form-actions">
  <button class="mds-button mds-button--secondary" type="button">← Back</button>
  <button class="mds-button mds-button--primary" type="submit">Continue →</button>
</div>

<!-- ✅ GOOD — multi-step: mutually exclusive primaries, only one visible at a time -->
<div class="form-actions">
  <button class="mds-button mds-button--secondary" id="btn-back" hidden>← Back</button>
  <button class="mds-button mds-button--primary" id="btn-continue">Continue →</button>
  <button class="mds-button mds-button--primary" id="btn-submit" hidden>Confirm and submit</button>
</div>

<!-- ❌ BAD — primary on the left of secondary -->
<div class="form-actions">
  <button class="mds-button mds-button--primary" type="submit">Continue →</button>
  <button class="mds-button mds-button--secondary" type="button">← Back</button>
</div>

<!-- ❌ BAD — two primary buttons simultaneously visible on the same page -->
<button class="mds-button mds-button--primary">Save Draft</button>
<button class="mds-button mds-button--primary">Submit</button>

<!-- ❌ BAD — buttons right-aligned or spread with space-between -->
<div style="justify-content: space-between"> ... </div>
<div style="justify-content: flex-end"> ... </div>
```

```css
/* ✅ GOOD — all buttons left-aligned as a group; primary last = rightmost */
.form-actions {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.75rem;
}
```

## Toggle Switch (Vanilla)

Use a **thumb-style toggle switch** for any binary choice within a form. This is the standard MDS toggle pattern — a sliding white thumb on a pill-shaped track.

**When to use toggle switch vs other controls:**

| Situation | Use |
|---|---|
| Binary Yes/No or A/B choice (e.g. New/Existing, Yes/No) | **Toggle switch** |
| 3+ mutually exclusive options | Select dropdown or radio group |
| 4+ options | Select dropdown |

**Toggles never need a required `*` indicator** — they always have a value (default = off/first option). Remove the required indicator from toggle fields.

**Token source:** Always import `css/mds/toggle.css`. All sizing, colors, and typography come from `--mds-toggle-*` tokens.

### HTML pattern

The DOM order must be: `input` → off-label → track (with thumb inside) → on-label.
This order is required for pure-CSS state styling via the `~` sibling combinator.

```html
<fieldset class="form-fieldset">
  <legend class="form-field__label">Client status</legend>
  <div class="form-toggle-switch">
    <input type="checkbox" class="form-toggle-switch__input" id="client-status-toggle">
    <span class="form-toggle-switch__side-label" aria-hidden="true">New client</span>
    <label class="form-toggle-switch__track" for="client-status-toggle">
      <span class="form-toggle-switch__thumb" aria-hidden="true"></span>
    </label>
    <span class="form-toggle-switch__side-label" aria-hidden="true">Existing client</span>
  </div>
</fieldset>
```

- Side labels use `aria-hidden="true"` — the fieldset `<legend>` provides the accessible name.
- The `<label for>` on the track is the clickable interactive zone.
- Read value in JS: `document.getElementById('client-status-toggle').checked ? 'existing' : 'new'`

### CSS

```css
/* Requires css/mds/toggle.css to be imported */

.form-toggle-switch {
  display: inline-flex;
  align-items: center;
  gap: var(--mds-toggle-gap); /* 8px */
}

.form-toggle-switch__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.form-toggle-switch__track {
  position: relative;
  display: block;
  width: var(--mds-toggle-width-md);   /* 40px */
  height: var(--mds-toggle-height-md); /* 20px */
  background: var(--mds-toggle-track-off); /* neutral-20 */
  border-radius: 100px;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s ease;
}

.form-toggle-switch__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(var(--mds-toggle-height-md) - 4px);  /* 16px */
  height: calc(var(--mds-toggle-height-md) - 4px); /* 16px */
  background: var(--mds-toggle-thumb); /* white */
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease;
}

/* Checked state: track turns electric blue, thumb slides right */
.form-toggle-switch__input:checked ~ .form-toggle-switch__track {
  background: var(--mds-toggle-track-on); /* electric-blue-500 */
}

.form-toggle-switch__input:checked ~ .form-toggle-switch__track .form-toggle-switch__thumb {
  transform: translateX(calc(var(--mds-toggle-width-md) - var(--mds-toggle-height-md)));
  /* 40px - 20px = 20px */
}

.form-toggle-switch__input:focus-visible ~ .form-toggle-switch__track {
  outline: 2px solid var(--mds-color-electric-blue-500);
  outline-offset: 2px;
}

/* Side labels */
.form-toggle-switch__side-label {
  font-family: var(--mds-toggle-label-font-family);
  font-size: var(--mds-toggle-label-font-size);
  font-weight: var(--mds-toggle-label-font-weight);
  line-height: var(--mds-toggle-label-line-height);
  color: var(--mds-color-text-subtle);
  user-select: none;
}

/* Active side label gets default text color + medium weight */
.form-toggle-switch__input:not(:checked) ~ .form-toggle-switch__side-label:first-of-type,
.form-toggle-switch__input:checked ~ .form-toggle-switch__track ~ .form-toggle-switch__side-label {
  color: var(--mds-color-text-default);
  font-weight: var(--mds-font-weight-medium);
}
```

**Do not hardcode `--mds-color-deep-blue-900`** — the MDS toggle token `--mds-toggle-track-on` resolves to electric blue, which is correct for both CTA actions and active state indicators.

## Form Field Errors (Vanilla)

### Typography tokens (from `css/mds/input.css`)

| Property | Token | Resolved value |
|---|---|---|
| `font-weight` | `--mds-input-error-message-font-weight` | `--mds-font-weight-regular` (400) — **not medium, not bold** |
| `font-size` | — | `1em` (relative to parent field size) |
| `color` | `--mds-input-error-message-color` | `--mds-color-crimson-red-500` |

### Icon

Use `x-circle-fill-16.svg` from the MDS icon set (fill style — strong emphasis rule applies to errors).

**Always inject as inline SVG via JavaScript.** Do NOT use `mask-image` with an external file URL — it fails silently on `file://` protocol.

Color is controlled by `fill="currentColor"` + CSS `color` property on the icon element.

### CSS

```css
.form-field__error {
  font-family: var(--mds-font-body);
  font-size: 1em;
  font-weight: var(--mds-input-error-message-font-weight, var(--mds-font-weight-regular));
  color: var(--mds-input-error-message-color, var(--mds-color-crimson-red-500));
  display: none;
  align-items: center;
  gap: 0.35rem;
  line-height: var(--mds-input-helper-line-height, 1rem);
}

.form-field__error--visible {
  display: flex;
}

/* Icon injected inline by JS — color via currentColor */
.form-field__error-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  color: var(--mds-color-crimson-red-500);
}
```

### JavaScript pattern

```js
// Inline SVG string — copy path from icons/x-circle-fill-16.svg
const ERROR_ICON_SVG = `<svg class="form-field__error-icon" aria-hidden="true" focusable="false"
  width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd"
    d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0Z
       M11.5 10.1L10.1 11.5L8 9.4L5.9 11.5L4.5 10.1L6.6 8L4.5 5.9L5.9 4.5
       L8 6.6L10.1 4.5L11.5 5.9L9.4 8L11.5 10.1Z"
    fill="currentColor"/>
</svg>`;

function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = ERROR_ICON_SVG + '<span>' + msg + '</span>';
  el.classList.add('form-field__error--visible');
}

function hideError(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = '';
  el.classList.remove('form-field__error--visible');
}
```

### HTML

```html
<div class="form-field">
  <label class="form-field__label" for="budget-code">
    Budget code <span class="form-field__required" aria-label="required">*</span>
  </label>
  <input class="form-field__input" type="text" id="budget-code" required>
  <!-- role="alert" + aria-live ensure screen readers announce errors on inject -->
  <span class="form-field__error" id="budget-code-error" role="alert" aria-live="polite"></span>
</div>
```

## MDS Badge Component (Vanilla)

Badges display status labels with optional leading icons. **Always import `css/mds/badge.css`** for the token definitions, then apply the component CSS below.

### Variant selection

See `reference/36-badge-variant-selection.md` for the full decision flow. Quick rule:

- **Outlined** (`badge--outlined`): use when the badge shares an organizing unit (table row, card, widget) with action buttons.
- **Filled** (`badge--filled`): use when the badge's organizing unit has no competing buttons.

### HTML pattern

Three required classes: base `.badge` + style `.badge--outlined` or `.badge--filled` + variant `.badge--success`, `.badge--warning`, `.badge--error`, `.badge--neutral`, or `.badge--info`.

```html
<!-- Outlined (row has actions) -->
<span class="badge badge--outlined badge--success">
  <svg class="icon" aria-hidden="true" focusable="false" width="12" height="12">
    <use href="#icon-check-circle"/>
  </svg>
  On track
</span>

<!-- Filled (no competing buttons) -->
<span class="badge badge--filled badge--warning">At risk</span>
```

### Required CSS (copy into your component stylesheet)

```css
/* --- Badge base (uses sm size tokens — swap to md/lg as needed) --- */
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--mds-badge-size-sm-gap);
  height: var(--mds-badge-size-sm-height);
  padding: 0 var(--mds-badge-size-sm-padding-x);
  font-family: var(--mds-badge-font-family);
  font-weight: var(--mds-badge-font-weight);
  font-size: var(--mds-badge-size-sm-font-size);
  line-height: var(--mds-badge-size-sm-line-height);
  border-radius: var(--mds-badge-border-radius);
  white-space: nowrap;
  vertical-align: middle;
  transition: var(--mds-badge-transition-property)
              var(--mds-badge-transition-duration)
              var(--mds-badge-transition-timing);
}

.badge .icon {
  width: var(--mds-badge-size-sm-icon-size);
  height: var(--mds-badge-size-sm-icon-size);
  flex-shrink: 0;
  color: inherit;
}

/* --- Style modifiers --- */
.badge--outlined {
  border: var(--mds-badge-border-width-outlined) solid;
  background: transparent;
}

.badge--filled {
  border: var(--mds-badge-border-width-filled) solid transparent;
}

/* --- Success --- */
.badge--outlined.badge--success {
  color: var(--mds-badge-text-success-outlined-text);
  border-color: var(--mds-badge-text-success-outlined-border);
  background: var(--mds-badge-text-success-outlined-background);
}
.badge--filled.badge--success {
  color: var(--mds-badge-text-success-filled-text);
  background: var(--mds-badge-text-success-filled-background);
}

/* --- Warning --- */
.badge--outlined.badge--warning {
  color: var(--mds-badge-text-warning-outlined-text);
  border-color: var(--mds-badge-text-warning-outlined-border);
  background: var(--mds-badge-text-warning-outlined-background);
}
.badge--filled.badge--warning {
  color: var(--mds-badge-text-warning-filled-text);
  background: var(--mds-badge-text-warning-filled-background);
}

/* --- Error --- */
.badge--outlined.badge--error {
  color: var(--mds-badge-text-error-outlined-text);
  border-color: var(--mds-badge-text-error-outlined-border);
  background: var(--mds-badge-text-error-outlined-background);
}
.badge--filled.badge--error {
  color: var(--mds-badge-text-error-filled-text);
  background: var(--mds-badge-text-error-filled-background);
}

/* --- Neutral --- */
.badge--outlined.badge--neutral {
  color: var(--mds-badge-text-neutral-outlined-text);
  border-color: var(--mds-badge-text-neutral-outlined-border);
  background: var(--mds-badge-text-neutral-outlined-background);
}
.badge--filled.badge--neutral {
  color: var(--mds-badge-text-neutral-filled-text);
  background: var(--mds-badge-text-neutral-filled-background);
}

/* --- Info --- */
.badge--outlined.badge--info {
  color: var(--mds-badge-text-info-outlined-text);
  border-color: var(--mds-badge-text-info-outlined-border);
  background: var(--mds-badge-text-info-outlined-background);
}
.badge--filled.badge--info {
  color: var(--mds-badge-text-info-filled-text);
  background: var(--mds-badge-text-info-filled-background);
}
```

### Notes

- `display: inline-flex` is on the **badge `<span>`**, not on a `<td>` — this is safe inside table cells (see `reference/37-table-patterns.md`).
- Height is set via `--mds-badge-size-sm-height` with `padding: 0` vertically so the pill size is precise.
- For medium or large badges, swap `sm` → `md` or `lg` in all token references.
- Icon inherits `color` from the badge text color; no separate icon color class is needed.

## Table + Badge + Actions (Vanilla)

- Keep table semantics.
- If row contains status badge + actions, use **outlined** badge class (see badge section above).
- For `table-layout: fixed` tables, add `overflow: hidden` to any column with variable-length content, and `max-width: 100%` to any inline-block wrapper inside it (see `reference/37-table-patterns.md` §2).
- For interactive tables, see `reference/37-table-patterns.md` §6–8 for sortable columns, filterable columns, and resizable columns. All three use inline flow inside `<th>` — no flex/grid.

```html
<tr>
  <td>Project Alpha</td>
  <td>
    <span class="badge badge--outlined badge--success">
      <svg class="icon" aria-hidden="true" focusable="false" width="12" height="12">
        <use href="#icon-check-circle"/>
      </svg>
      Active
    </span>
  </td>
  <td class="table-actions">
    <button class="mds-button mds-button--tertiary mds-button--sm">View</button>
    <button class="mds-button mds-button--tertiary mds-button--sm">Edit</button>
  </td>
</tr>
```

```css
.table-actions { white-space: nowrap; }
.table-actions .mds-button { margin-right: var(--mds-spacing-2); }
.table-actions .mds-button:last-child { margin-right: 0; }
```

## Header Spacing and Alignment

- Section headers above content: `margin-bottom: var(--mds-spacing-6)` minimum
- Badge next to heading: match heading font-size
- Title/subtitle alignment must match (left/left or center/center)

## Accessibility — Interactive Controls

All MDS-styled interactive controls must meet these baseline requirements:

- **Semantic elements**: Use `<button>`, `<input>`, `<select>`, `<textarea>` — never `<div>` or `<span>` with click handlers for interactive roles.
- **Accessible labels**: Every control must have a visible label or an `aria-label` / `aria-labelledby` attribute.
- **Focus styles**: Every interactive element must have a visible focus indicator. Use `outline` or `box-shadow` on `:focus-visible` — never `outline: none` without a replacement.
- **Disabled state**: When a control is disabled, set the `disabled` attribute (not just a CSS class). Ensure disabled controls are visually distinct (reduced opacity or muted color via MDS tokens).

```css
/* Baseline focus style for all interactive elements */
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--mds-color-electric-blue-500);
  outline-offset: 2px;
}

/* Disabled state */
button:disabled,
input:disabled,
select:disabled,
textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Quick Checklist

- [ ] **Badges use full MDS badge CSS** — base `.badge` + style `.badge--outlined` / `.badge--filled` + variant class, all built from `--mds-badge-*` tokens (see "MDS Badge Component" section above). Never use bare `.badge--success` without the style modifier.
- [ ] Badge style chosen correctly: `badge--outlined` when row/card/widget has action buttons, `badge--filled` when no competing buttons (see `reference/36-badge-variant-selection.md`)
- [ ] `[hidden] { display: none !important; }` present in global reset (prevents component `display` rules from overriding `hidden` attribute)
- [ ] Only token-backed values where available
- [ ] No React-specific API references
- [ ] Primary buttons use `--mds-color-electric-blue-500` (not deep blue)
- [ ] Deep blue (`--mds-color-deep-blue-900`) used only for structural elements (headers, nav)
- [ ] Toggle selected state uses `--mds-toggle-track-on` token (not hardcoded deep blue) — requires `css/mds/toggle.css` imported
- [ ] Toggle fields use **thumb-style switch** (checkbox + `.form-toggle-switch`) — not radio-based segmented controls
- [ ] Toggle fields do NOT have a required `*` indicator (always have a value)
- [ ] Only ONE primary button **visible** per page or view — AI must decide hierarchy; do not default all actions to primary
- [ ] Primary button is always the rightmost button in its group
- [ ] Button group is **left-aligned** (`justify-content: flex-start`) — never `space-between`, `flex-end`, or `center`
- [ ] Multi-step forms: two mutually exclusive primary CTAs allowed in DOM if only one is visible at a time (`hidden` attribute)
- [ ] Form error messages: `font-weight: regular`, `font-size: 1em`, color from `--mds-input-error-message-color`
- [ ] Form error icons: `x-circle-fill-16.svg` inline SVG — never `mask-image` with external URL
- [ ] Active tab indicator only on active tab
- [ ] Progress bars have no border radius
- [ ] Table actions use inline flow and margin spacing
- [ ] Sortable headers use `<button>` with `aria-sort`, sort icon color from `--mds-color-electric-blue-500`, cycling asc → desc → unsorted
- [ ] Filter dropdowns use native `<input type="checkbox">` with `accent-color`, close on Escape / outside click
- [ ] Resize handles are absolutely positioned in the `<th>`, widths managed via `<colgroup>` `<col>` elements, global cursor override during drag
- [ ] McKinsey name in top banner uses the official SVG logo (correct color variant for the background) — never plain HTML text or Bower-styled text. See `reference/35-layout-patterns.md` §5.