# MDS Data Visualization Chart Guide

## Use This Skill For

- Choosing the right chart type for your data story
- Implementing specific chart types (bar, line, pie, donut, waterfall, treemap, etc.)
- Applying MDS best practices for chart structure, spacing, labeling, and styling
- Understanding do's and don'ts for each chart type

## Chart Selection Decision Guide

Choose your chart type based on the data story:

### Magnitude (Comparing Size)
**When comparing relative or absolute differences:**
- **Bar chart** - comparing categories, showing discrete quantities
- **Stacked bar chart** - comparing multiple sub-categories within categories
- **Bubble chart** - comparing proportions with large value variations

### Part-to-Whole (Distribution)
**When showing how parts make up a whole:**
- **Donut/Pie chart** - composition (max 5 categories)
- **Waterfall chart** - cumulative effect of sequential values
- **Treemap** - hierarchical part-to-whole with nested rectangles
- **Stacked bar chart** - part-to-whole over categories

### Trend Over Time
**When emphasizing changing trends:**
- **Line chart** - continuous trends over time
- **Stacked area chart** - multiple variables changing over intervals
- **Bubble timeline** - events/items on timeline with variable bubble size

### Correlation
**When showing relationships between variables:**
- **Scatterplot** - correlation between two variables
- **Bubble scatterplot** - correlation with third dimension (bubble size)
- **Heatmap** - variance across multiple variables, patterns in correlations
- **Trend lines** - correlation trends overlaid on scatter data

### Relationships
**When showing logical connections or volume changes:**
- **Sankey diagram** - flow/transfer volume between processes
- **Venn diagram** - set relationships (metaphorical, not mathematical)

### Geospatial
**When highlighting locations or geographical patterns:**
- **Choropleth** - color-themed map with values by region
- **Bubble map** - location + proportion via bubble size
- **Dot density map** - concentration patterns via dot placement

---

## Bar Charts

### Core Rules

1. **Zero baseline required** - Bar charts MUST start at zero; the bar height represents discrete quantity
2. **Direct labeling preferred** - Label bars directly; avoid grid axes when possible
3. **Same color unless highlighting** - Use single color for same category; use highlight color (Cyan 500) for emphasis
4. **Spacing:** Bar width ≥ gap between bars (gap should not exceed bar width)

### Do's

✅ Start at zero baseline (include "0" axis label)
✅ Use direct labels on bars when possible
✅ Keep bars same color; use Cyan 500 to highlight key insight
✅ Space bars so gaps ≤ bar width
✅ Use horizontal orientation for long labels or mobile layouts

### Don'ts

❌ Truncate bars (misleading - bar height must accurately represent quantity)
❌ Use different colors for each bar without purpose (distracts reader)
❌ Make bars too narrow (eyes focus on negative space)
❌ Add grid lines when direct labeling works
❌ Use more than 10 categories without grouping extras into "Other"

### Variants

**Horizontal bar chart** - Easier to read labels; better for mobile; use when many bars
**Butterfly chart** - Two datasets side-by-side with shared parameters; use Crimson Red 500 for negative values if needed
**Grouped bar chart** - Two or more datasets clustered under categories on same axis
**Diverging bar chart** - Handles negative and positive values; use Crimson Red 500 for negative bars if emphasis needed
**Stacked bar chart** - Multiple categories per bar; use categorical palette order; stack legend vertically following bar order

```css
/* Bar chart styling */
.bar-chart .bar {
  fill: var(--mds-color-deep-blue-900);
}

.bar-chart .bar[data-highlight] {
  fill: var(--mds-color-cyan-500);
}

/* Spacing: gap ≤ bar width */
.bar-chart {
  --bar-width: 50px;
  --bar-gap: 40px; /* gap ≤ bar-width */
}
```

---

## Bubble Charts

### Core Rules

1. **Scale by area, not diameter** - Bubble size represents value via area calculation
2. **Sort by size** - Order largest to smallest to facilitate comparisons
3. **Meaningful color grouping** - Use color to encode categories or emphasis, not decoration

### Do's

✅ Scale bubbles by area (not diameter)
✅ Sort bubbles from largest to smallest (or layout logically)
✅ Use color to group categories or highlight key data
✅ Use direct labeling (bubbles don't rely on grid axes)
✅ Use bubble charts when large value variations make bar charts ineffective

### Don'ts

❌ Use arbitrary/decorative layouts that hide insights
❌ Apply color without functional purpose (styling only)
❌ Use bubble charts when values are similar (bar charts handle small differences better)
❌ Scale by diameter instead of area

```tsx
// Bubble area scaling
function getBubbleRadius(value: number, maxValue: number, maxRadius: number): number {
  // Scale by area: A = πr²
  const area = (value / maxValue) * (Math.PI * maxRadius * maxRadius);
  return Math.sqrt(area / Math.PI);
}
```

---

## Donut and Pie Charts

### Core Rules

1. **Max 5 categories** - More than 5 makes chart hard to read
2. **Largest first, clockwise** - Start at 0° (top), stack largest to smallest clockwise
3. **Group small wedges into "Other"** - Use Gray 60% for "Other" category
4. **Donut preferred over pie** - Donut charts are easier to read around circumference
5. **Labels outside chart** - Place labels and values outside the chart in meaningful order

### Do's

✅ Limit to 5 categories maximum
✅ Stack wedges largest to smallest, clockwise from 0° (top)
✅ Group small segments (beyond 5) into "Other" category
✅ Use donut over pie for better readability
✅ Label outside chart for clarity
✅ Use blank center of donut for contextual callout or total

### Don'ts

❌ Use more than 5 categories without grouping
❌ Arbitrarily mix small and large wedges
❌ Label directly on chart when many small wedges
❌ Use pie when donut would be clearer (donut shows "length" around circumference better)

### Variants

**Pie chart matrix** - Multiple small pies showing size and breakdown (e.g., population size + gender breakdown per country)
**Circular dials** - Comparing percentage values across categories

```css
/* Donut/pie wedge colors follow categorical palette */
.donut-wedge:nth-child(1) { fill: var(--mds-color-electric-blue-900); }
.donut-wedge:nth-child(2) { fill: var(--mds-color-cyan-500); }
.donut-wedge:nth-child(3) { fill: var(--mds-color-electric-blue-500); }
.donut-wedge:nth-child(4) { fill: var(--mds-color-crimson-red-300); }
.donut-wedge:nth-child(5) { fill: var(--mds-color-orchid-pink-400); }
.donut-wedge.other { fill: var(--mds-color-neutral-60); }
```

---

## Waterfall Charts

### Core Rules

1. **Light connecting lines** - Use thin, light gray strokes (avoid heavy lines that distract)
2. **Horizontal format for mobile** - Horizontal orientation better for narrow layouts
3. **Diverging palette for +/- values** - Use Electric Blue↔Crimson Red when emphasizing positive/negative changes
4. **Insights alongside tallest bars** - Place callouts near key data

### Do's

✅ Use thin, light gray connecting lines (don't overwhelm the bars)
✅ Use horizontal orientation for mobile/narrow layouts
✅ Use diverging palette (Electric Blue vs Crimson Red) when positive/negative distinction is important
✅ Label incremental bars and total bars clearly
✅ Add axis labels when direct labeling is impractical (many small increments)

### Don'ts

❌ Use heavy stroke weight for connecting lines
❌ Use red/green from PowerPoint default palette (not colorblind-friendly)
❌ Omit direct labeling when scale makes small values unreadable

```css
/* Waterfall bars */
.waterfall-bar.increment { fill: var(--mds-color-deep-blue-900); }
.waterfall-bar.total { fill: var(--mds-color-cyan-500); }

/* Light connecting lines */
.waterfall-connector {
  stroke: var(--mds-color-neutral-20);
  stroke-width: 1px;
}
```

---

## Treemaps

### Core Rules

1. **Largest-to-smallest flow** - Arrange rectangles top-left to bottom-right in descending size
2. **Consistent padding** - Even padding between rectangles (avoid uneven gaps)
3. **Label inside rectangles** - Place labels within rectangles; if too small, label outside
4. **Color by category** - Use categorical palette to distinguish data categories

### Do's

✅ Sort rectangles largest to smallest (top-left to bottom-right)
✅ Use consistent padding between all blocks
✅ Label inside rectangles when possible
✅ Color-code by category using categorical palette
✅ Ensure rectangles fill the entire treemap (no gaps or incomplete sections)

### Don'ts

❌ Leave empty gaps or uneven padding (distracting, breaks visual comparison)
❌ Organize without functional purpose (hinders comparison)
❌ Create new boxes/overlays for text (distorts size perception)

### Variants

**Geographic treemap** - Rectangles positioned to represent world regions
**Marimekko chart** - Two-dimensional stacked chart with varied column widths + heights

```css
/* Treemap rectangles */
.treemap-rect {
  stroke: var(--mds-color-white);
  stroke-width: 2px; /* consistent padding */
}

/* Category colors */
.treemap-rect[data-category="americas"] { fill: var(--mds-color-electric-blue-900); }
.treemap-rect[data-category="europe"] { fill: var(--mds-color-cyan-500); }
.treemap-rect[data-category="asia"] { fill: var(--mds-color-electric-blue-500); }
```

---

## Line Charts

### Core Rules

1. **Direct labels at line ends** - Label lines at the end; stack vertically if multiple lines
2. **Gray background for noise** - Gray out (Gray 30%) less-important lines to highlight insight
3. **No shading unless zero baseline** - Don't shade below line unless chart starts at zero (that's an area chart)
4. **Avoid dual axes** - Dual Y-axes are misleading; split into separate side-by-side charts instead
5. **Line weight = 2× grid weight** - Chart lines (e.g., 1.5px) should be twice grid line weight (e.g., 0.75px)

### Do's

✅ Label lines directly at line ends (stack vertically on right if multiple)
✅ Use gray (Gray 30%) for background noise; highlight key insight line with Deep Blue 900
✅ Use shaded highlight areas (Gray 30%) to flag relevant chart segments
✅ Use line charts when Y-axis doesn't start at zero (they show position and slope)
✅ Set line stroke = 2× grid stroke (e.g., 1.5px line vs 0.75px grid)

### Don'ts

❌ Shade below a line unless it has a zero baseline (that turns it into an area chart)
❌ Use legend above chart (breaks reading order; place on right side, stacked vertically)
❌ Use dual Y-axes (arbitrary scales mislead; split into two separate charts)
❌ Show too many color-coded lines (grays out noise, highlights 1-2 key lines instead)

```css
/* Line chart */
.line-chart .line {
  stroke: var(--mds-color-deep-blue-900);
  stroke-width: 1.5px;
  fill: none;
}

.line-chart .line.background {
  stroke: var(--mds-color-neutral-30);
}

.line-chart .grid-line {
  stroke: var(--mds-color-neutral-20);
  stroke-width: 0.75px; /* half of line weight */
}

.line-chart .highlight-area {
  fill: var(--mds-color-neutral-30);
  opacity: 0.3;
}
```

---

## Stacked Area Charts

### Core Rules

1. **Follow categorical palette order** - Color stacks from bottom to top using categorical sequence
2. **Low-variability on bottom** - Place categories with low variability at bottom; high-variability on top
3. **Stack segments (don't overlap)** - Segments must stack; overlapping is confusing (use line chart instead)

### Do's

✅ Apply categorical palette in order from bottom to top (Electric Blue 900 at bottom)
✅ Arrange data: low-variability categories at bottom, high-variability on top
✅ Stack segments (each starts from previous segment's end point)
✅ Use lightly shaded areas (Gray 30%) to highlight insights

### Don'ts

❌ Use arbitrary color order (colors next to each other must be distinctive)
❌ Put high-variability data at bottom (makes it hard to read)
❌ Overlap segments (use line chart instead if overlapping is needed)

```css
/* Stacked area chart - bottom to top */
.area-segment:nth-child(1) { fill: var(--mds-color-electric-blue-900); }
.area-segment:nth-child(2) { fill: var(--mds-color-cyan-500); }
.area-segment:nth-child(3) { fill: var(--mds-color-electric-blue-500); }
.area-segment:nth-child(4) { fill: var(--mds-color-crimson-red-300); }
/* ... continue categorical palette */
```

---

## Bubble Timeline

### Core Rules

1. **Monochrome unless categorizing** - Keep bubbles single color unless categories need distinction
2. **Large bubbles in background** - Layer largest bubbles behind smaller ones; add white stroke or transparency to show contours

### Do's

✅ Keep bubbles monochrome to allow size comparison and outlier identification
✅ Place largest bubbles in background
✅ Add white stroke and/or transparency to bubble outlines so they stand out
✅ Use color only when encoding additional categories

### Don'ts

❌ Color categories unnecessarily (they're already split across lines)
❌ Cover smaller bubbles with large ones (layer correctly)

```css
.bubble-timeline .bubble {
  fill: var(--mds-color-deep-blue-900);
  stroke: var(--mds-color-white);
  stroke-width: 2px;
  opacity: 0.85;
}

/* Layer large bubbles behind by setting lower z-index or SVG order */
```

---

## Scatterplot and Bubble Scatterplot

### Core Rules

1. **Limit trend lines** - Too many trend lines make data hard to interpret; use fewest needed
2. **Color to encode categories or ranges** - Use color for additional variables (categories or value ranges)
3. **Label only relevant bubbles** - Only label data points relevant to the story/insight

### Do's

✅ Use color to encode categories (3-category or categorical palette) or to emphasize ranges
✅ Limit trend lines to fewest needed for the story
✅ Label only bubbles/points relevant to insight
✅ Use shaded areas to highlight relevant regions

### Don'ts

❌ Add too many trend lines (makes interpretation difficult)
❌ Use color without functional purpose

```tsx
// Scatterplot with categorical color encoding
const categories = ['North America', 'Europe', 'Asia'];
const colors = [
  'var(--mds-color-deep-blue-900)',
  'var(--mds-color-cyan-500)',
  'var(--mds-color-electric-blue-500)'
];

<circle
  cx={x}
  cy={y}
  r={bubbleRadius}
  fill={colors[categories.indexOf(dataPoint.category)]}
/>
```

---

## Heatmaps

### Core Rules

1. **Sequential vs diverging palette** - Use linear scale for one-directional data (low→high); diverging scale for contrasting data (e.g., ±)
2. **Sort data to reveal patterns** - Rank/sort rows or columns to make color patterns emerge (not alphabetical unless it helps)
3. **Include zero step** - Sequential heatmaps should include neutral/zero step; diverging heatmaps must include zero in legend
4. **Balanced color steps** - Thresholds should be incremental and balanced (not arbitrary)

### Do's

✅ Use **sequential scale** (Electric Blue linear) for one-directional data (e.g., number of deals)
✅ Use **diverging scale** (Electric Blue↔Crimson Red or Marine Green↔Crimson Red) for contrasting data
✅ Sort/rank data to reveal patterns (not always alphabetical)
✅ Include zero step as neutral point
✅ Use balanced, sequential color thresholds

### Don'ts

❌ Use two cool scales together (e.g., Electric Blue + Marine Green—not enough contrast)
❌ Omit zero step from diverging heatmap legend
❌ Create arbitrary or unbalanced color thresholds
❌ Sort alphabetically when ranking by value would reveal better patterns

```css
/* Sequential heatmap (5 steps) */
.heatmap-cell[data-value="0"] { background: var(--mds-color-neutral-5); }
.heatmap-cell[data-value="1"] { background: var(--mds-color-electric-blue-300); }
.heatmap-cell[data-value="2"] { background: var(--mds-color-electric-blue-500); }
.heatmap-cell[data-value="3"] { background: var(--mds-color-electric-blue-700); }
.heatmap-cell[data-value="4"] { background: var(--mds-color-electric-blue-900); }

/* Diverging heatmap */
.heatmap-cell[data-value="-2"] { background: var(--mds-color-electric-blue-700); }
.heatmap-cell[data-value="-1"] { background: var(--mds-color-electric-blue-500); }
.heatmap-cell[data-value="0"] { background: var(--mds-color-neutral-10); }
.heatmap-cell[data-value="1"] { background: var(--mds-color-crimson-red-300); }
.heatmap-cell[data-value="2"] { background: var(--mds-color-crimson-red-600); }
```

---

## Sankey Diagrams

### Core Rules

1. **Color-coded transfers** - Use color to distinguish transfer types across steps
2. **Transparency for overlapping flows** - Use transparency so overlapped flows remain visible
3. **Curved, organic paths** - Maintain organic, curved flow; avoid straight boxed lines
4. **Thin vertical lines for values** - Use simple vertical lines to describe volumes (don't box values)

### Do's

✅ Color-code different types of transfers across diagram steps
✅ Use transparency on flows so overlaps are visible
✅ Maintain curved, organic flow paths
✅ Use thin vertical lines to mark volumes
✅ Use categorical or diverging palette when appropriate (e.g., approvals vs rejections)

### Don'ts

❌ Box values between steps
❌ Use straight lines instead of organic curves
❌ Use flat, opaque colors when flows overlap
❌ Switch colors to highlight obvious separations (color should encode transfer type)

```css
.sankey-path {
  fill: var(--mds-color-cyan-500);
  opacity: 0.7; /* transparency for overlaps */
}

.sankey-path.rejected {
  fill: var(--mds-color-crimson-red-500);
  opacity: 0.7;
}

.sankey-divider {
  stroke: var(--mds-color-neutral-70);
  stroke-width: 1px;
}
```

---

## Venn Diagrams

### Core Rules

1. **Darker overlaps** - Overlapped areas should be darker shades of the colors
2. **Text outside diagram** - Place descriptions outside diagram to avoid overwhelming content
3. **Regular shapes** - Use regular, balanced shapes; avoid irregular objects or unbalanced layouts

### Do's

✅ Make overlapped areas darker (blend the circle colors)
✅ Move descriptor text outside diagram with connecting lines
✅ Use regular, organic layouts with clear hierarchy
✅ Use Cyan 500 for lighter circles; Electric Blue 500 and Electric Blue 900 for overlaps

### Don'ts

❌ Lighten overlapped areas (incorrect—overlaps should darken)
❌ Place long text blocks on diagram (obscures shaded areas)
❌ Use irregular shapes that create unbalanced layouts

```css
.venn-circle.light { fill: var(--mds-color-cyan-500); opacity: 0.6; }
.venn-overlap.medium { fill: var(--mds-color-electric-blue-500); }
.venn-overlap.dark { fill: var(--mds-color-electric-blue-900); }
```

---

## Maps (Choropleth, Bubble, Dot Density)

### Core Rules

1. **Light gray boundaries** - Use light gray or white outlines for boundaries; dark boundaries distract (use darker for print)
2. **Linear or diverging palette** - Use sequential palette for intensity (low→high); diverging for contrasting data
3. **Consider split maps** - Sometimes splitting into two maps shows distribution differences better than one map

### Do's

✅ Use light gray/white boundary lines (screen); darker lines for print
✅ Use **linear scale** (Electric Blue) for choropleth intensity
✅ Use **bubble map** to encode proportion via area (avoids geographic size bias—e.g., Russia's large area)
✅ Use **dot density map** for location concentration patterns
✅ Consider split maps when single map hides differences
✅ Direct label key regions/bubbles

### Don'ts

❌ Use thick, prominent boundary lines (boundaries shouldn't compete with data)
❌ Distort map proportions
❌ Use non-McKinsey palette colors

```css
/* Choropleth map */
.map-region {
  stroke: var(--mds-color-neutral-20); /* light gray boundary */
  stroke-width: 1px;
}

.map-region[data-value="low"] { fill: var(--mds-color-electric-blue-300); }
.map-region[data-value="medium"] { fill: var(--mds-color-electric-blue-500); }
.map-region[data-value="high"] { fill: var(--mds-color-electric-blue-900); }

/* Bubble map */
.map-bubble {
  fill: var(--mds-color-cyan-500);
  stroke: var(--mds-color-white);
  stroke-width: 2px;
}
```

---

## Fast Checklist

### General

- [ ] Chart type matches data story (magnitude, part-to-whole, trend, correlation, relationships, geospatial)
- [ ] All chart marks use solid colors only (no gradients, no fades)
- [ ] Colors follow MDS palettes (categorical, linear, diverging)
- [ ] Direct labeling used when possible (avoid grid axes if unnecessary)
- [ ] SVG chart inside a card follows the flex-column card pattern (see reference/35-layout-patterns.md, Pattern 7)
- [ ] `<figure>` and `<svg>` use distinct BEM class names — never the same class on both

### Bar Charts

- [ ] Zero baseline included
- [ ] Bars same color unless highlighting
- [ ] Gap between bars ≤ bar width
- [ ] Direct labels preferred over grid lines

### Bubble Charts

- [ ] Bubbles scaled by area (not diameter)
- [ ] Sorted by size or logically organized
- [ ] Color encodes categories or emphasis

### Donut/Pie

- [ ] Max 5 categories (group extras into "Other")
- [ ] Largest to smallest, clockwise from 0°
- [ ] Labels placed outside chart

### Line Charts

- [ ] Line weight = 2× grid weight
- [ ] Direct labels at line ends
- [ ] No shading below line unless zero baseline
- [ ] No dual Y-axes (split into separate charts)

### Heatmaps

- [ ] Sequential or diverging palette matches data type
- [ ] Data sorted to reveal patterns
- [ ] Zero step included
- [ ] Balanced, incremental color thresholds

### Maps

- [ ] Light gray boundaries (screen) or darker for print
- [ ] Linear or diverging palette for regions
- [ ] Consider split maps for better comparison
