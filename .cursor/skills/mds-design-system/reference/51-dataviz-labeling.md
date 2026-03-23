# MDS Data Visualization Labeling and Annotations

## Use This Skill For

- Adding labels, legends, and annotations to charts
- Deciding between direct labeling vs legends vs grid axes
- Placing insight callouts and highlighting key data
- Adding titles, footnotes, and source citations
- Using icons in data visualizations
- Styling grid lines, axes, and reference lines

## Core Rules

### 1. **Direct Labeling Preferred**

Always prefer labels on data marks over legends when possible. Remove grid axes when direct labeling provides clarity.

**Priority order:**
1. **Direct labels** on data marks (bars, lines, bubbles, etc.)
2. **Legends** only when direct labeling is impractical
3. **Grid axes** only when neither direct labeling nor legends work well (e.g., stacked bars with many small segments)

```tsx
// ✅ GOOD - Direct labels on bars
<g className="bar-group">
  <rect className="bar" />
  <text className="bar-label" x={barX} y={barY - 5}>{value}</text>
</g>

// ❌ AVOID if possible - Legend for simple bar chart
<div className="chart-legend">
  <div>Category A</div>
  <div>Category B</div>
</div>
```

### 2. **Legend Placement**

When legends are necessary:

**Stack vertically** following the order of data segments (e.g., for stacked bars, legend order matches stack order bottom-to-top)

**Place next to line ends** for line charts (label directly at line end points, stacked vertically on right side)

**Never place legend above chart** (breaks reading order; always place on right side or below)

```css
/* Legend styling */
.chart-legend {
  display: flex;
  flex-direction: column; /* vertical stack */
  gap: 0.5rem;
  margin-left: 1rem; /* place to the right */
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-body);
  line-height: var(--mds-line-height-body);
}

.legend-color-box {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
```

### 3. **Axis and Grid Lines**

Use grid axes only when direct labeling is impractical (e.g., stacked bars with many segments, complex heatmaps).

**Line weight rule:** Grid/axis lines should be **half the weight** of chart data lines.

- Example: Data lines at **1.5px** → Grid lines at **0.75px**
- Example: Data lines at **2px** → Grid lines at **1px**

**Color:** Use light neutral colors for grids (e.g., `--mds-color-neutral-20` or `--mds-color-neutral-10`)

```css
/* Chart data lines */
.line-chart .data-line {
  stroke: var(--mds-color-deep-blue-900);
  stroke-width: 1.5px;
}

/* Grid lines - half weight, light color */
.line-chart .grid-line {
  stroke: var(--mds-color-neutral-20);
  stroke-width: 0.75px;
}

.line-chart .axis-line {
  stroke: var(--mds-color-neutral-70);
  stroke-width: 1px;
}
```

### 4. **Zero Baseline Requirement**

**Bar charts MUST start at zero.** Include a "0" label on the baseline axis.

**Line charts and scatterplots** can omit zero baseline (they show position and slope, not discrete quantities).

```tsx
// Bar chart - always include zero
<g className="y-axis">
  <text y={chartHeight}>0</text>
  <text y={chartHeight * 0.75}>25</text>
  <text y={chartHeight * 0.5}>50</text>
  {/* ... */}
</g>
```

### 5. **Insight Callouts**

Use shaded highlight areas + text callouts alongside key data points to direct viewer attention.

**Shaded areas:** Use `--mds-color-neutral-30` with opacity (e.g., 30%) to highlight relevant chart segments

**Callout text:** Place insight text adjacent to highlighted area; use sentence-style descriptive titles

```css
.chart-highlight-area {
  fill: var(--mds-color-neutral-30);
  opacity: 0.3;
}

.chart-callout {
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-body);
  font-weight: var(--mds-font-weight-medium);
  fill: var(--mds-color-text-default);
}

.chart-callout-line {
  stroke: var(--mds-color-neutral-54);
  stroke-width: 1px;
  stroke-dasharray: 3, 3; /* optional dashed line */
}
```

### 6. **Footnotes and Sources**

Place footnotes, methodology notes, and source citations at the **bottom of the chart area**.

Use smaller, subtle text styling.

```html
<div class="chart-container">
  <div class="chart-title">Chart title here</div>
  <svg class="chart"><!-- chart content --></svg>

  <div class="chart-footnote">
    *Footnotes, explanations or additional details of methodology go here.
  </div>
  <div class="chart-source">
    Source: mckinsey.com/insights
  </div>
</div>
```

```css
.chart-footnote,
.chart-source {
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-caption);
  line-height: var(--mds-line-height-caption);
  color: var(--mds-color-text-subtle);
  margin-top: 0.5rem;
}

.chart-source {
  font-weight: var(--mds-font-weight-medium);
}
```

### 7. **Chart Titles**

Use descriptive, sentence-style titles that frame the insight (not just "Revenue by Quarter").

**Good:** "Oil consumption ramped up towards the end of 2017 as an effect of changes in US tariffs policy"

**Bad:** "Energy Consumption 2016-2018"

```css
.chart-title {
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-heading-4);
  font-weight: var(--mds-font-weight-medium);
  line-height: var(--mds-line-height-heading);
  color: var(--mds-color-text-headings);
  margin-bottom: 1rem;
}

.chart-subtitle {
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-body);
  line-height: var(--mds-line-height-body);
  color: var(--mds-color-text-default);
  margin-bottom: 1rem;
}
```

### 8. **Icons in Data Visualization**

Icons are **optional** and should only be used when they add clarity. If you can communicate clearly without an icon, don't use one.

**Allowed uses:**
- **Tallies** - Icons as tally marks to convey quantities (e.g., person icon = 1 million people)
- **Category markers** - Simple icons to highlight categories (e.g., car, health, tech icons)

**Prohibited:**
- **Scaling both dimensions** - Never scale an icon's width AND height (leads to incorrect visual comparison). Scale one dimension only.

```html
<!-- ✅ GOOD - Icons as tallies (convey quantity) -->
<div class="infographic-tally">
  <div class="tally-label">1m people</div>
  <div class="tally-icons">
    <svg class="icon"><!-- person icon --></svg>
    <svg class="icon"><!-- person icon --></svg>
    <svg class="icon"><!-- person icon --></svg>
    <!-- Each icon = 1m people -->
  </div>
</div>

<!-- ❌ BAD - Icon scaled in both dimensions -->
<svg class="icon" width="20" height="20"><!-- small value --></svg>
<svg class="icon" width="80" height="80"><!-- large value - misleading! --></svg>

<!-- ✅ GOOD - Icons scaled in one dimension only (or use count) -->
<svg class="icon" width="20" height="20"><!-- small value --></svg>
<svg class="icon" width="20" height="20"><!-- small value --></svg>
<svg class="icon" width="20" height="20"><!-- small value --></svg>
<svg class="icon" width="20" height="20"><!-- large value = more icons --></svg>
```

**Icon styling:**

```css
.chart-icon {
  fill: var(--mds-color-deep-blue-900);
  width: 24px;
  height: 24px;
}

.chart-icon.category-tech { fill: var(--mds-color-electric-blue-500); }
.chart-icon.category-health { fill: var(--mds-color-cyan-500); }
```

#### MDS Icons Inside SVG Charts

When the chart itself is an `<svg>` element (inline SVG or D3-rendered), place MDS icons using one of two approaches depending on context.

**When to use plain SVG vs a chart library:**

| Data complexity | Approach |
|---|---|
| 1–3 series, static data | Plain inline `<svg>` — no library needed |
| 4+ series, or dynamic/interactive data | D3.js or Chart.js — use MDS color tokens for fills/strokes |
| React project | Recharts or Victory with MDS color tokens |

**Approach A — `<g>` + `transform` (preferred for SVG charts)**

Translate an MDS icon's `<path>` elements directly into the chart's SVG coordinate space using a `<g transform="translate(x, y)">`. The icon's `viewBox="0 0 16 16"` describes a 16-unit space; use `scale()` to match chart units.

```html
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- chart content (bars, lines, axes…) -->

  <!-- MDS icon placed at chart coordinate (180, 120), scaled 1.5× -->
  <g transform="translate(180, 120) scale(1.5)" aria-hidden="true">
    <!-- paste <path> elements from the chosen icon SVG here -->
    <path fill-rule="evenodd" clip-rule="evenodd" d="M..." fill="currentColor"/>
  </g>
</svg>
```

```css
/* Set color via the SVG `color` or `fill` cascade */
.chart-annotation-icon {
  color: var(--mds-color-electric-blue-500);
}
```

**Coordinate system note:** The chart SVG uses its own `viewBox` units (e.g., `0 0 400 300`). The icon's internal paths are drawn in a 16-unit space. The `scale()` in the `transform` bridges these — for example, `scale(1.5)` renders the icon as a 24-unit square within the chart's coordinate space. Place the `translate()` at the exact chart coordinate where the icon anchor point should sit.

**Approach B — `<foreignObject>` (HTML icons inside SVG)**

Use `<foreignObject>` when you need to embed an HTML element (including a styled `<svg class="icon">`) inside a chart SVG. This works well in browsers but has limited support in static SVG exports.

```html
<svg viewBox="0 0 400 300">
  <!-- chart content -->

  <!-- HTML icon embedded at chart coordinate (160, 100) -->
  <foreignObject x="160" y="100" width="24" height="24">
    <div xmlns="http://www.w3.org/1999/xhtml">
      <svg class="icon icon--lg" aria-hidden="true" focusable="false"
           width="24" height="24" viewBox="0 0 16 16" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M..." fill="currentColor"/>
      </svg>
    </div>
  </foreignObject>
</svg>
```

**When to choose each approach:**

| Approach | Use when |
|---|---|
| `<g transform>` | SVG-only output, D3, static export, maximum browser compat |
| `<foreignObject>` | React/HTML hybrid charts, need CSS layout inside SVG |

### 9. **"Other" Category**

When grouping categories beyond the top 10, use **Gray 60%** (`--mds-color-neutral-60`, #666666) for the "Other" category.

```css
.chart-segment.other {
  fill: var(--mds-color-neutral-60);
}
```

---

## Code Examples

### Direct Labeling on Bars

```tsx
function BarChart({ data }: { data: Array<{ label: string; value: number }> }) {
  return (
    <svg viewBox="0 0 400 300">
      {data.map((item, i) => (
        <g key={i}>
          <rect
            x={i * 60}
            y={300 - item.value}
            width={50}
            height={item.value}
            fill="var(--mds-color-deep-blue-900)"
          />
          {/* Direct label on bar */}
          <text
            x={i * 60 + 25}
            y={300 - item.value - 8}
            textAnchor="middle"
            className="bar-label"
          >
            {item.value}
          </text>
          {/* Category label below */}
          <text
            x={i * 60 + 25}
            y={310}
            textAnchor="middle"
            className="category-label"
          >
            {item.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
```

```css
.bar-label {
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-body);
  font-weight: var(--mds-font-weight-medium);
  fill: var(--mds-color-text-default);
}

.category-label {
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-small);
  fill: var(--mds-color-text-subtle);
}
```

### Line Chart with Direct Labels at Line Ends

```tsx
function LineChart({ series }: { series: Array<{ name: string; data: number[]; highlight?: boolean }> }) {
  return (
    <svg viewBox="0 0 400 300">
      {/* Grid lines */}
      <g className="grid">
        <line x1={0} y1={75} x2={400} y2={75} className="grid-line" />
        <line x1={0} y1={150} x2={400} y2={150} className="grid-line" />
        <line x1={0} y1={225} x2={400} y2={225} className="grid-line" />
      </g>

      {/* Data lines */}
      {series.map((s, i) => (
        <g key={i}>
          <polyline
            points={s.data.map((v, idx) => `${idx * 40},${300 - v}`).join(' ')}
            className={s.highlight ? 'data-line highlight' : 'data-line'}
          />
          {/* Label at line end */}
          <text
            x={410}
            y={300 - s.data[s.data.length - 1] + 4}
            className="line-label"
          >
            {s.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
```

```css
.grid-line {
  stroke: var(--mds-color-neutral-20);
  stroke-width: 0.75px;
}

.data-line {
  fill: none;
  stroke: var(--mds-color-neutral-30); /* background noise */
  stroke-width: 1.5px;
}

.data-line.highlight {
  stroke: var(--mds-color-deep-blue-900); /* highlight key line */
}

.line-label {
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-small);
  font-weight: var(--mds-font-weight-medium);
  fill: var(--mds-color-text-default);
}
```

### Insight Callout with Shaded Area

```tsx
<svg viewBox="0 0 400 300">
  {/* Chart content */}

  {/* Shaded highlight area */}
  <rect
    x={200}
    y={0}
    width={100}
    height={300}
    className="chart-highlight-area"
  />

  {/* Callout text */}
  <text x={250} y={50} className="chart-callout" textAnchor="middle">
    Oil ramps up
  </text>
  <text x={250} y={75} className="chart-callout-detail" textAnchor="middle">
    Towards the end of 2017...
  </text>
</svg>
```

```css
.chart-highlight-area {
  fill: var(--mds-color-neutral-30);
  opacity: 0.3;
}

.chart-callout {
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-heading-6);
  font-weight: var(--mds-font-weight-medium);
  fill: var(--mds-color-text-default);
}

.chart-callout-detail {
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-small);
  fill: var(--mds-color-text-subtle);
}
```

### Legend for Stacked Bar Chart

```tsx
<div className="chart-with-legend">
  <svg className="chart">
    {/* Stacked bar chart */}
  </svg>

  <div className="chart-legend">
    {categories.map((cat, i) => (
      <div key={i} className="legend-item">
        <div
          className="legend-color-box"
          style={{ '--legend-color': CATEGORICAL_COLORS[i] } as React.CSSProperties}
        />
        <span>{cat.name}</span>
      </div>
    ))}
  </div>
</div>
```

```css
.chart-with-legend {
  display: flex;
  gap: 1.5rem;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-small);
  line-height: var(--mds-line-height-body);
  color: var(--mds-color-text-default);
}

.legend-color-box {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  /* Color is set via --legend-color CSS custom property passed from JS */
  background: var(--legend-color, var(--mds-color-neutral-60));
}
```

### Complete Chart with Title, Labels, Footnote, and Source

```tsx
<div className="chart-container">
  <h3 className="chart-title">
    Service companies have exposed fewer personal records than any other industry
  </h3>
  <p className="chart-subtitle">
    Personal records exposed, 2011–2016, millions
  </p>

  <svg className="chart" viewBox="0 0 800 400">
    {/* Chart visualization */}
  </svg>

  <p className="chart-footnote">
    *Footnotes, explanations or additional details of methodology go here. Expand where necessary.
  </p>
  <p className="chart-source">
    Source: mckinsey.com/insights
  </p>
</div>
```

```css
.chart-container {
  padding: 1.5rem;
}

.chart-title {
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-heading-4);
  font-weight: var(--mds-font-weight-medium);
  line-height: var(--mds-line-height-heading);
  color: var(--mds-color-text-headings);
  margin-bottom: 0.5rem;
}

.chart-subtitle {
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-body);
  line-height: var(--mds-line-height-body);
  color: var(--mds-color-text-default);
  margin-bottom: 1rem;
}

.chart {
  width: 100%;
  height: auto;
  margin-bottom: 0.5rem;
}

.chart-footnote {
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-caption);
  line-height: var(--mds-line-height-caption);
  color: var(--mds-color-text-subtle);
  margin-top: 0.5rem;
  font-style: italic;
}

.chart-source {
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-caption);
  line-height: var(--mds-line-height-caption);
  color: var(--mds-color-text-subtle);
  font-weight: var(--mds-font-weight-medium);
}
```

---

## Best Practices Summary

### Direct Labeling

✅ **DO:**
- Label directly on data marks (bars, bubbles, lines) when possible
- Remove grid axes when direct labeling provides clarity
- Place line chart labels at line ends, stacked vertically on right

❌ **DON'T:**
- Use legends when direct labeling would work
- Place legends above charts (breaks reading order)
- Use grid lines when direct labels suffice

### Grid Lines and Axes

✅ **DO:**
- Use grid lines only when direct labeling is impractical (e.g., stacked bars, heatmaps)
- Set grid line weight = half of data line weight (e.g., 0.75px grid vs 1.5px data)
- Use light neutral colors for grids (`--mds-color-neutral-20`)
- Include zero baseline for bar charts

❌ **DON'T:**
- Make grid lines as heavy as data lines
- Use dark, prominent grid colors
- Omit zero baseline from bar charts

### Insight Callouts

✅ **DO:**
- Use shaded areas (`--mds-color-neutral-30` at 30% opacity) to highlight key regions
- Place callout text adjacent to highlighted area
- Use sentence-style descriptive callouts

❌ **DON'T:**
- Overwhelm chart with too many callouts
- Place callouts without visual connection to data

### Icons

✅ **DO:**
- Use icons as tallies or category markers when they add clarity
- Keep icon size consistent (don't scale both dimensions)
- Use simple, recognizable icons

❌ **DON'T:**
- Scale icons in both width and height (misleading comparison)
- Use icons when they're unnecessary for comprehension

---

## Fast Checklist

- [ ] **Direct labeling** used on data marks when possible
- [ ] **Legends** only when direct labeling is impractical
- [ ] Legends placed on **right side** or below (never above), stacked **vertically**
- [ ] Legend order matches data segment order (e.g., stacked bar legend follows stack order)
- [ ] **Grid lines** only when direct labeling doesn't work
- [ ] Grid line weight = **half** of data line weight (e.g., 0.75px vs 1.5px)
- [ ] Grid lines use **light neutral colors** (`--mds-color-neutral-20`)
- [ ] **Zero baseline** included for bar charts
- [ ] **Insight callouts** placed adjacent to highlighted data with shaded area
- [ ] **Chart titles** are descriptive and sentence-style (frame the insight)
- [ ] **Footnotes and sources** placed at bottom of chart
- [ ] **Icons** (if used) are tallies or category markers, not scaled in both dimensions
- [ ] **"Other" category** uses Gray 60% (`--mds-color-neutral-60`)
