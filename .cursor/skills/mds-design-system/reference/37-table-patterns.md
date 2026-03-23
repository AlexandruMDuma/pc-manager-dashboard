# MDS Table Layout Best Practices

## Default: All Data Tables Must Have Resizable Columns

**Every data table must include column resize handles.** This is not optional — users must always be able to adjust column widths by dragging the border between header cells. Implement using the pattern in §8 (Resizable Columns) below. Omit resize handles only on the last column (there is no right neighbor to trade space with).

## Critical Rule: No Flexbox or Grid Directly on Table Cells

**NEVER apply `display: flex` or `display: grid` directly on `<td>` or `<th>` elements.** Child wrapper elements inside cells may use `inline-flex` for internal alignment (e.g. `.th-inner`, `.th-sort-btn`).

Applying flex/grid on the cell itself creates a different formatting context that causes:
- Border misalignment across columns
- Inconsistent row heights
- Cell content rendering issues

### ❌ BAD - Flex on the cell element itself
```css
.table-actions {
  display: flex;  /* applied to a <td> — breaks table layout */
  gap: 0.5rem;
}
```

### ✅ GOOD - Use Natural Inline Flow
```css
.table-actions {
  white-space: nowrap;
}

.table-actions .mds-button {
  margin-right: 0.5rem;
}
```

## Table Structure Requirements

### 1. Use MDS Table Tokens
Always reference table tokens from `css/mds/table.css` (bundled with this skill):

```css
.data-table {
  font-family: var(--mds-table-font-family);
  font-size: var(--mds-table-font-size);
  line-height: var(--mds-table-line-height);
}

.data-table th {
  font-weight: var(--mds-table-header-font-weight);
  padding: var(--mds-table-cell-padding-y) var(--mds-table-cell-padding-x);
}

.data-table td {
  font-weight: var(--mds-table-body-font-weight);
  padding: var(--mds-table-cell-padding-y) var(--mds-table-cell-padding-x);
  border-bottom: var(--mds-table-border-width) var(--mds-table-border-style) var(--mds-table-border);
}
```

### 2. Fixed Layout for Complex Tables
For tables with action columns or varying content:

```css
.data-table {
  table-layout: fixed;
  width: 100%;
}

/* Specify explicit widths */
.data-table th:nth-child(1) { width: 25%; }
.data-table th:nth-child(2) { width: 20%; }
```

#### Cell overflow in fixed-layout tables

`table-layout: fixed` sets column widths but does **not** clip content — long text or inline-block wrappers (tooltips, badges, monospace branch names) will paint over adjacent columns.

**Always add `overflow: hidden` to any fixed-width column that may contain variable-length content:**

```css
.data-table .col-branch { width: 20%; overflow: hidden; }
```

**Any inline-block wrapper inside a fixed-width cell must also be constrained:**

```css
/* Without max-width the inline-block sizes to its intrinsic content, ignoring the cell boundary */
.tooltip-wrap {
  display: inline-block;
  max-width: 100%;
}
```

Both are required. `overflow: hidden` on the cell clips at the column edge; `max-width: 100%` on the wrapper lets inner truncation (`text-overflow: ellipsis`) activate before overflow happens.

### ❌ BAD - Content overflows into adjacent column
```css
.data-table .col-branch { width: 20%; }

.tooltip-wrap { display: inline-block; }
.branch-name  { max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
```

### ✅ GOOD - Content stays within column
```css
.data-table .col-branch { width: 20%; overflow: hidden; }

.tooltip-wrap { display: inline-block; max-width: 100%; }
.branch-name  { max-width: 100%; overflow: hidden; text-overflow: ellipsis; }
```

### 3. Default Left Alignment
By default, all text, badges, and icons in table cells must be left-aligned:

```css
.data-table th,
.data-table td {
  text-align: left;
}
```

Do NOT center-align badges, icons, or status indicators in table cells unless explicitly required by the design. Left alignment is the default for all table content.

### 4. Vertical Alignment
Always center content vertically:

```css
.data-table td {
  vertical-align: middle;
}
```

### 5. Action Columns
For cells with multiple buttons:

```css
.table-actions {
  white-space: nowrap;  /* Prevent wrapping */
}

.table-actions .mds-button {
  margin-right: 0.5rem;  /* Use margin, not gap */
}

.table-actions .mds-button:last-child {
  margin-right: 0;
}
```

## Common Patterns

### Status Badges in Tables
```tsx
<td>
  <Badge variant="success">Active</Badge>
</td>
```

### Action Buttons in Tables
```tsx
<td className="table-actions">
  <Button variant="tertiary" size="sm">View</Button>
  <Button variant="tertiary" size="sm">Edit</Button>
  <Button variant="danger" size="sm">Delete</Button>
</td>
```

### Responsive Tables
```css
.table-container {
  overflow-x: auto;
}

@media (max-width: 768px) {
  .table-actions {
    display: block;  /* Stack buttons on mobile */
  }

  .table-actions .mds-button {
    display: block;
    margin-bottom: 0.25rem;
    width: 100%;
  }
}
```

## Interactive Table Headers

Interactive data tables often need sortable columns, filterable columns, and resizable columns. All three must coexist inside `<th>` without using flex or grid — use inline flow and absolute positioning instead.

### 5.5 When to Add Sort and Filter (Decision Criteria)

Before implementing a data table, **evaluate the provided data** to decide whether sorting and filtering are needed. Do not skip this step — include a brief justification in the output (section 4 or 8) for why sort/filter were included or omitted.

#### Sorting — add when ALL conditions are met:

1. The table has **8 or more rows** (sorting a smaller table adds UI clutter for minimal benefit — the full dataset is visible at a glance)
2. At least one column contains **orderable scalar data**: names, dates, numbers, durations, or status labels with a natural rank

**Do NOT sort:** compound/composite columns (e.g. a cell with multiple badges), free-text description columns, or action columns.

#### Filtering — add when ALL conditions are met:

1. The table has **12 or more rows** (filtering a smaller table is overkill — users can scan visually)
2. At least one column contains **discrete categorical values** with **2–15 unique values** (e.g. status enums, departments, roles, environments)

**Do NOT filter:** free-form text columns, unique-per-row columns (names, IDs), continuous numeric columns, or timestamp columns — those are better served by sort alone.

#### Quick decision matrix

| Row count | Sort? | Filter? |
|-----------|-------|---------|
| < 8       | No    | No      |
| 8–11      | Yes (on orderable columns) | No |
| 12+       | Yes (on orderable columns) | Yes (on categorical columns with 2–15 unique values) |

#### Override: explicit user intent

If the user explicitly requests "basic," "simple," or "static" and does not mention interactivity, omit sort and filter regardless of row count — but still note in the output what would have been added and why it was skipped.

If the user explicitly requests sorting or filtering, always include it regardless of row count.

### 6. Sortable Columns

Make a column sortable when the decision criteria in §5.5 are met. Typical candidates: IDs, names, status labels, dates, durations. Do NOT make compound/composite columns sortable (e.g. a "stages" column with multiple badges).

#### Header structure

Wrap the column label and sort indicator in a `<button>` for keyboard access. The button uses `display: inline-flex` to align the label and icon vertically while staying in natural inline flow inside the `<th>`.

```html
<th scope="col" data-col="branch">
  <button class="th-sort-btn" aria-label="Sort by Branch">
    Branch
    <svg class="icon th-sort-icon" aria-hidden="true" focusable="false" width="12" height="12">
      <use href="#icon-chevron-down"/>
    </svg>
  </button>
</th>
```

#### Sort cycling

Clicking the sort button cycles through three states: **ascending → descending → unsorted**. Resetting to unsorted restores the original data order rather than leaving a stale sort.

#### `aria-sort` attribute

Set `aria-sort="ascending"` or `aria-sort="descending"` on the `<th>` element containing the active sort button. Remove the attribute entirely when unsorted — do not set `aria-sort="none"`.

#### Sort icon — stacked chevron pair

Use a **stacked up/down chevron pair** (not a single arrow that switches direction). This is the standard sort affordance — both directions are always visible, and the active direction is highlighted.

- **Unsorted**: both chevrons at equal opacity in subtle color (`--mds-color-text-subtle`)
- **Ascending**: up chevron full opacity, down chevron dimmed (opacity 0.35)
- **Descending**: down chevron full opacity, up chevron dimmed (opacity 0.35)

**Never use** thick filled arrows, single switching chevrons, or up/down arrow icons — these look like download/upload buttons, not sort affordances.

SVG icons (inject via JS, swap on sort state change):

```js
const SORT_ICONS = {
  unsorted: '<svg viewBox="0 0 12 12" class="sort-icon" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,4.5 6,1.5 9,4.5"/><polyline points="3,7.5 6,10.5 9,7.5"/></svg>',
  asc:      '<svg viewBox="0 0 12 12" class="sort-icon" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,7.5 6,10.5 9,7.5" opacity="0.35"/><polyline points="3,4.5 6,1.5 9,4.5"/></svg>',
  desc:     '<svg viewBox="0 0 12 12" class="sort-icon" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,4.5 6,1.5 9,4.5" opacity="0.35"/><polyline points="3,7.5 6,10.5 9,7.5"/></svg>'
};
```

#### Header cell inner layout

Wrap column label, sort button, and filter button in a `.th-inner` container using inline-flex for vertical alignment:

```css
.th-inner {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
```

#### CSS

```css
.th-sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  color: inherit;
}

.th-sort-btn:focus-visible {
  outline: 2px solid var(--mds-color-electric-blue-500);
  outline-offset: 2px;
  border-radius: 2px;
}

.sort-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  color: var(--mds-color-text-subtle);
}

th[aria-sort="ascending"] .sort-icon,
th[aria-sort="descending"] .sort-icon {
  color: var(--mds-color-electric-blue-500);
}
```

#### Data pipeline

Sorting must compose with filtering and pagination:

```
allRows → filter → sort → paginate → render
```

Sort operates on the filtered dataset. Changing sort resets to page 1.

### 7. Filterable Columns

Add a filter control when the decision criteria in §5.5 are met and the column has **discrete categorical values** with 2–15 unique values. Good candidates: status enums, branch names, usernames, environments. Do NOT add filters to free-form numeric or timestamp columns — those are better served by sort alone.

#### Header structure

Add a filter button after the sort button (or column label if not sortable). Use `display: inline-block` to keep it in inline flow.

```html
<th scope="col" data-col="status">
  <button class="th-sort-btn" aria-label="Sort by Status">Status ...</button>
  <button class="th-filter-btn" aria-label="Filter by Status" aria-expanded="false">
    <svg class="icon" aria-hidden="true" focusable="false" width="14" height="14">
      <use href="#icon-funnel"/>
    </svg>
  </button>
</th>
```

#### Filter dropdown

Clicking the filter button opens a positioned dropdown below the header cell. The dropdown contains:

1. **Action bar** — "Select all" and "Clear" buttons
2. **Checkbox list** — one native `<input type="checkbox">` per unique value in the column

```html
<div class="filter-dropdown" role="dialog" aria-label="Filter options">
  <div class="filter-dropdown__actions">
    <button class="filter-dropdown__action-btn">Select all</button>
    <button class="filter-dropdown__action-btn">Clear</button>
  </div>
  <div class="filter-dropdown__list">
    <div class="filter-dropdown__option">
      <input type="checkbox" id="filter-status-passed" value="Passed" checked>
      <label for="filter-status-passed">Passed</label>
    </div>
    <!-- ... more options ... -->
  </div>
</div>
```

Use native checkboxes (not custom toggles) — they are accessible by default and styled with `accent-color: var(--mds-color-electric-blue-500)`.

#### Positioning

The dropdown is `position: absolute` inside the `<th>` (which already has `position: sticky`). Limit width with `min-width: 200px; max-width: 280px` and scroll the list with `max-height` + `overflow-y: auto`.

#### Closing behavior

The dropdown closes on:
- **Escape** key
- Clicking **outside** the dropdown and filter button
- Clicking the **filter button** again (toggle)

Remove document-level listeners when the dropdown closes to avoid memory leaks.

#### Filter icon states — gray default, blue when active

The filter icon must clearly communicate whether a filter is currently applied. **Default (unapplied) is gray; active (applied) is electric blue.** Without this distinction, users cannot tell which columns are filtered.

```css
.th-filter-btn {
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  padding: 2px;
  cursor: pointer;
  color: var(--mds-color-text-subtle);  /* gray when no filter applied */
}

.th-filter-btn svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.th-filter-btn:hover {
  color: var(--mds-color-electric-blue-500);
}

.th-filter-btn--active {
  color: var(--mds-color-electric-blue-500);  /* blue when filter is applied */
}

.th-filter-btn--active:hover {
  color: var(--mds-color-electric-blue-700);
}
```

Toggle the `--active` class in JS whenever the filter selection changes:

```js
function updateFilterButtons() {
  document.querySelectorAll('.th-filter-btn[data-col]').forEach(function (btn) {
    var col = btn.getAttribute('data-col');
    if (state.filters[col] && state.filters[col].length > 0) {
      btn.classList.add('th-filter-btn--active');
    } else {
      btn.classList.remove('th-filter-btn--active');
    }
  });
}
```

Optionally, show a count badge on the filter button when active:

```css
.filter-count {
  display: inline-block;
  min-width: 1rem;
  height: 1rem;
  padding: 0 0.25rem;
  background: var(--mds-color-electric-blue-500);
  color: var(--mds-color-white);
  font-size: 0.625rem;
  font-weight: var(--mds-font-weight-medium);
  line-height: 1rem;
  text-align: center;
  border-radius: var(--mds-badge-border-radius);
  vertical-align: middle;
}
```

#### Filter logic

- **All checked** or **none checked** = no filter active (show all rows). Delete the filter entry entirely rather than storing a full set.
- Filters compose: `allRows → filter(status) → filter(branch) → filter(trigger) → sort → paginate`.
- Changing any filter resets to page 1.

### 8. Resizable Columns

Allow users to drag column borders to adjust widths. Use a `<colgroup>` for width management — it is the semantic HTML mechanism for column sizing.

#### Colgroup setup

Define initial widths as percentages on `<col>` elements. JS converts to pixel values on first resize.

```html
<table class="data-table">
  <colgroup>
    <col data-col="id"     style="width:6%">
    <col data-col="name"   style="width:20%">
    <col data-col="status" style="width:12%">
    <!-- ... -->
  </colgroup>
  <thead>...</thead>
  <tbody>...</tbody>
</table>
```

#### Resize handle

Add an absolutely positioned `<div>` at the right edge of each `<th>` (except the last column). The `<th>` must have `position: sticky` or `position: relative` to contain the handle.

```html
<th scope="col">
  Name
  <div class="th-resize" aria-hidden="true"></div>
</th>
```

```css
.th-resize {
  position: absolute;
  top: 0;
  right: -2px;
  width: 5px;
  height: 100%;
  cursor: col-resize;
  z-index: 3;
}

.th-resize:hover,
.th-resize--active {
  background: var(--mds-color-electric-blue-500);
  opacity: 0.4;
}
```

#### Resize behavior

1. **On first mousedown**: capture the actual pixel width of every `<col>` element (from rendered `th.offsetWidth`). Set these as explicit pixel `style.width` values on each `<col>`. Lock the table's pixel width.
2. **During drag**: add delta to the left column, subtract delta from the right column. Clamp both to a minimum width (50px recommended).
3. **On mouseup**: clean up listeners and cursor override.

This approach keeps the total table width constant — the two columns adjacent to the handle trade space with each other. The container scrolls horizontally only if the user later makes the table wider than its container.

#### Global cursor override during drag

Set `cursor: col-resize` on `<body>` during drag so the cursor doesn't flicker when the pointer moves faster than the handle:

```css
body.col-resizing {
  cursor: col-resize !important;
  user-select: none !important;
}
```

Add/remove this class in JS at drag start/end.

#### Preserving widths

Column widths persist across sort, filter, and pagination changes because they live on the `<colgroup>` — they are not re-rendered when the `<tbody>` content changes.

## Why These Rules Matter

1. **Consistent Borders**: Natural table cell flow ensures borders render at the same position
2. **Predictable Heights**: Table cells calculate height consistently without flex interference
3. **Cross-Browser Compatibility**: Standard table layout works reliably everywhere
4. **Maintainability**: Following table semantics makes code easier to understand

## When You Need Layout Control

If you absolutely need flex/grid layout, extract that content into a component:
- ✅ Use flex inside a `<div>` wrapper component
- ✅ Then place that component in the table cell
- ❌ Never apply flex directly to `<td>` or `<th>`

## Quick Checklist

- [ ] **Sort/filter decision documented** — evaluated row count and column data types against §5.5 criteria; output includes brief justification for inclusion or omission
- [ ] **Resizable columns present** — every data table has `.th-resize` handles on all columns except the last (§8)
- [ ] No flexbox or grid on `<td>` or `<th>` elements
- [ ] Table uses MDS table tokens for font, padding, borders
- [ ] `table-layout: fixed` for tables with action columns or varying content
- [ ] Fixed-width columns with variable content have `overflow: hidden`
- [ ] Sortable headers (when §5.5 criteria met) use `<button>` with `aria-sort`, three-state cycling (§6)
- [ ] Sort icon is a **stacked chevron pair** (up+down), not a single arrow or filled shape — active direction full opacity, inactive dimmed
- [ ] Filter dropdowns (when §5.5 criteria met) with checkbox list, gray icon when unapplied, **electric blue when active** — toggle `--active` class in JS on filter change (§7)
- [ ] Header cell inner wrapper uses `display: inline-flex; align-items: center; gap: 4px` for label/sort/filter alignment
- [ ] Sort and filter SVGs have explicit `width: 12px; height: 12px` in CSS — never rely on SVG intrinsic size
- [ ] Resize handles are absolutely positioned, widths managed via `<colgroup>`, global cursor override during drag
