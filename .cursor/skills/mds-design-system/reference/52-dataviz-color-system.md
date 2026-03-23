# MDS Data Visualization Color System

## Use This Reference For

- Any chart or graph implementation requiring color selection
- Bar charts, line charts, area charts, pie/donut charts, scatter plots, heatmaps, maps
- Determining which color palette to use (categorical, linear, or diverging)
- Mapping PDF color guidance to CSS custom properties

## Core Rules

### 1. **Solid Colors Only**

**NEVER use gradients, fades, or color transitions** in data visualization marks (bars, lines, areas, points).

```css
/* ✅ GOOD - Solid fill */
.bar {
  fill: var(--mds-color-electric-blue-500);
}

/* ❌ BAD - Gradient */
.bar {
  fill: linear-gradient(to top, #2251FF, #5B7FFF);
}

/* ❌ BAD - Transparent/faded */
.area {
  fill: rgba(34, 81, 255, 0.7);
}
```

### 2. **Single-Category Charts**

When the visualization does not require color for distinguishing categories:

**On white background:** Use either `--mds-color-deep-blue-900` or `--mds-color-electric-blue-900`

**On Deep Blue 900 background:** Use `--mds-color-cyan-500`

```css
/* Single-category bar chart on white */
.bar {
  fill: var(--mds-color-deep-blue-900);
}

/* Single-category chart on dark background */
body[data-theme="dark"] .bar {
  fill: var(--mds-color-cyan-500);
}
```

### 3. **Highlight Color**

To highlight specific data points or information of interest on white backgrounds:

**Always use `--mds-color-cyan-500` for highlights**, regardless of whether the base color is Deep Blue 900 or Electric Blue 900.

```css
/* Base bars */
.bar {
  fill: var(--mds-color-deep-blue-900);
}

/* Highlighted bar */
.bar.highlight {
  fill: var(--mds-color-cyan-500);
}
```

### 4. **3-Category Charts**

**On white background:**
1. `--mds-color-deep-blue-900` (#051C2C)
2. `--mds-color-cyan-500` (#00A9F4)
3. `--mds-color-electric-blue-500` (#2251FF)

**On Deep Blue 900 background:**
1. `--mds-color-cyan-500` (#00A9F4)
2. `--mds-color-cyan-200` (#99E6FF)
3. `--mds-color-electric-blue-500` (#2251FF)

```tsx
// React example
const THREE_CATEGORY_COLORS = [
  'var(--mds-color-deep-blue-900)',
  'var(--mds-color-cyan-500)',
  'var(--mds-color-electric-blue-500)'
];
```

### 5. **Categorical Scale (4-10 Categories)**

Use this exact sequence for charts with 4-10 distinct categories. All colors are tested for colorblindness accessibility.

#### Color Sequence by Number of Categories

**4 categories:**
1. `--mds-color-electric-blue-900` (#061F79)
2. `--mds-color-cyan-500` (#00A9F4)
3. `--mds-color-electric-blue-500` (#2251FF)
4. `--mds-color-crimson-red-300` (#F4A3A3)

**5 categories:**
1. `--mds-color-electric-blue-900` (#061F79)
2. `--mds-color-cyan-500` (#00A9F4)
3. `--mds-color-electric-blue-500` (#2251FF)
4. `--mds-color-crimson-red-300` (#F4A3A3)
5. `--mds-color-orchid-pink-400` (#E479E4)

**6 categories:**
1. `--mds-color-electric-blue-900` (#061F79)
2. `--mds-color-cyan-500` (#00A9F4)
3. `--mds-color-cyan-700` (#0679C3)
4. `--mds-color-electric-blue-500` (#2251FF)
5. `--mds-color-crimson-red-300` (#F4A3A3)
6. `--mds-color-orchid-pink-400` (#E479E4)

**7 categories:**
1. `--mds-color-electric-blue-900` (#061F79)
2. `--mds-color-cyan-500` (#00A9F4)
3. `--mds-color-cyan-700` (#0679C3)
4. `--mds-color-electric-blue-500` (#2251FF)
5. `--mds-color-crimson-red-300` (#F4A3A3)
6. `--mds-color-orchid-pink-900` (#9C217D)
7. `--mds-color-orchid-pink-400` (#E479E4)

**8 categories:**
1. `--mds-color-electric-blue-900` (#061F79)
2. `--mds-color-marine-green-300` (#75F0E7)
3. `--mds-color-cyan-500` (#00A9F4)
4. `--mds-color-cyan-700` (#0679C3)
5. `--mds-color-electric-blue-500` (#2251FF)
6. `--mds-color-crimson-red-300` (#F4A3A3)
7. `--mds-color-orchid-pink-900` (#9C217D)
8. `--mds-color-orchid-pink-400` (#E479E4)

**9 categories:**
1. `--mds-color-electric-blue-900` (#061F79)
2. `--mds-color-marine-green-300` (#75F0E7)
3. `--mds-color-cyan-500` (#00A9F4)
4. `--mds-color-cyan-700` (#0679C3)
5. `--mds-color-electric-blue-500` (#2251FF)
6. `--mds-color-crimson-red-300` (#F4A3A3)
7. `--mds-color-orchid-pink-900` (#9C217D)
8. `--mds-color-marine-green-900` (#108980)
9. `--mds-color-orchid-pink-400` (#E479E4)

**10 categories:**
1. `--mds-color-electric-blue-900` (#061F79)
2. `--mds-color-marine-green-300` (#75F0E7)
3. `--mds-color-cyan-500` (#00A9F4)
4. `--mds-color-cyan-700` (#0679C3)
5. `--mds-color-electric-blue-500` (#2251FF)
6. `--mds-color-crimson-red-300` (#F4A3A3)
7. `--mds-color-orchid-pink-900` (#9C217D)
8. `--mds-color-marine-green-900` (#108980)
9. `--mds-color-marine-green-700` (#14B8AB)
10. `--mds-color-orchid-pink-400` (#E479E4)

**More than 10 categories:** Group remaining categories into "Other" using `--mds-color-neutral-60` (Gray 60%, #666666)

#### On Deep Blue 900 Background (4-10 categories)

Use this alternate sequence:

**4+ categories on dark:**
1. `--mds-color-white` (#FFFFFF)
2. `--mds-color-cyan-200` (#99E6FF)
3. `--mds-color-cyan-500` (#00A9F4)
4. `--mds-color-electric-blue-500` (#2251FF)
5. `--mds-color-orchid-pink-400` (#E479E4)
6. `--mds-color-crimson-red-300` (#F4A3A3)
7. `--mds-color-marine-green-900` (#108980)
8. `--mds-color-marine-green-700` (#14B8AB)
9. `--mds-color-cyan-700` (#0679C3)
10. `--mds-color-orchid-pink-900` (#9C217D)

```tsx
// React example - categorical palette builder
function getCategoricalColor(index: number, total: number): string {
  const palettes = {
    4: [
      'var(--mds-color-electric-blue-900)',
      'var(--mds-color-cyan-500)',
      'var(--mds-color-electric-blue-500)',
      'var(--mds-color-crimson-red-300)'
    ],
    5: [
      'var(--mds-color-electric-blue-900)',
      'var(--mds-color-cyan-500)',
      'var(--mds-color-electric-blue-500)',
      'var(--mds-color-crimson-red-300)',
      'var(--mds-color-orchid-pink-400)'
    ],
    // ... etc
  };

  const palette = palettes[total] || palettes[10];
  return palette[index % palette.length];
}
```

### 6. **Linear/Quantitative Scales**

Linear scales show a range of values from low to high. Use up to 7 steps.

#### 3-step Linear Scales

**Electric Blue (primary option):**
1. `--mds-color-electric-blue-300` (#A2B8FF)
2. `--mds-color-electric-blue-500` (#2251FF)
3. `--mds-color-electric-blue-900` (#061033)

**Deep Blue (alternate):**
1. `--mds-color-electric-blue-300` (#A2B8FF)
2. `--mds-color-electric-blue-500` (#2251FF)
3. `--mds-color-deep-blue-900` (#051C2C)

#### 4-step Linear Scale

1. `--mds-color-electric-blue-300` (#A2B8FF)
2. `--mds-color-electric-blue-500` (#2251FF)
3. `--mds-color-electric-blue-700` (#143199)
4. `--mds-color-electric-blue-900` (#061033)

#### 5-step Linear Scale

1. `--mds-color-electric-blue-200` (#99C4FF)
2. `--mds-color-electric-blue-300` (#A2B8FF)
3. `--mds-color-electric-blue-500` (#2251FF)
4. `--mds-color-electric-blue-700` (#143199)
5. `--mds-color-electric-blue-900` (#061033)

#### 6-step Linear Scale (Mixed Blue)

1. `--mds-color-cyan-300` (#80D4F9)
2. `--mds-color-electric-blue-300` (#A2B8FF)
3. `--mds-color-electric-blue-500` (#2251FF)
4. `--mds-color-electric-blue-700` (#143199)
5. `--mds-color-electric-blue-900` (#061033)
6. `--mds-color-deep-blue-900` (#051C2C)

#### 7-step Linear Scale (Mixed Blue)

1. `--mds-color-cyan-200` (#99E6FF)
2. `--mds-color-cyan-300` (#80D4F9)
3. `--mds-color-electric-blue-300` (#A2B8FF)
4. `--mds-color-electric-blue-500` (#2251FF)
5. `--mds-color-electric-blue-700` (#143199)
6. `--mds-color-electric-blue-900` (#061033)
7. `--mds-color-deep-blue-900` (#051C2C)

**General rule:** Darkest shade represents highest value. Reverse logic for dark backgrounds.

```css
/* Heatmap example with 5-step linear scale */
.heatmap-cell[data-value="1"] { background: var(--mds-color-electric-blue-200); }
.heatmap-cell[data-value="2"] { background: var(--mds-color-electric-blue-300); }
.heatmap-cell[data-value="3"] { background: var(--mds-color-electric-blue-500); }
.heatmap-cell[data-value="4"] { background: var(--mds-color-electric-blue-700); }
.heatmap-cell[data-value="5"] { background: var(--mds-color-electric-blue-900); }
```

### 7. **Diverging Scales**

Diverging scales visualize contrasting values changing in opposite directions from a breakpoint (e.g., positive/negative, agree/disagree).

**Two options:**

#### Option A: Electric Blue ↔ Crimson Red

**3-step:**
- Left: `--mds-color-electric-blue-500` (#2251FF)
- **Breakpoint:** `--mds-color-neutral-10` (Gray 10%, #E6E6E6) or Sand Neutral 300
- Right: `--mds-color-crimson-red-300` (#F4A3A3)

**5-step:**
- `--mds-color-electric-blue-500`
- `--mds-color-electric-blue-200` (#99C4FF)
- **Breakpoint:** `--mds-color-neutral-10` or Sand Neutral 300
- `--mds-color-crimson-red-300`
- `--mds-color-crimson-red-600` (#B80000)

**7-step:**
- `--mds-color-electric-blue-900` (#061033)
- `--mds-color-electric-blue-700` (#143199)
- `--mds-color-electric-blue-500` (#2251FF)
- **Breakpoint:** `--mds-color-neutral-10` or Sand Neutral 300
- `--mds-color-crimson-red-300` (#F4A3A3)
- `--mds-color-crimson-red-500` (#E60000)
- `--mds-color-crimson-red-900`

#### Option B: Marine Green ↔ Crimson Red

**3-step:**
- Left: `--mds-color-marine-green-600` (#259684)
- **Breakpoint:** `--mds-color-neutral-10` or Sand Neutral 300
- Right: `--mds-color-crimson-red-300` (#F4A3A3)

**5-step:**
- `--mds-color-marine-green-900` (#108980)
- `--mds-color-marine-green-600` (#259684)
- **Breakpoint:** `--mds-color-neutral-10` or Sand Neutral 300
- `--mds-color-crimson-red-300` (#F4A3A3)
- `--mds-color-crimson-red-600` (#B80000)

**7-step:**
- `--mds-color-marine-green-900` (#108980)
- `--mds-color-marine-green-700` (#14B8AB)
- `--mds-color-marine-green-500` (#2EBBA5)
- **Breakpoint:** `--mds-color-neutral-10` or Sand Neutral 300
- `--mds-color-crimson-red-300` (#F4A3A3)
- `--mds-color-crimson-red-500` (#E60000)
- `--mds-color-crimson-red-700` (#8A0000)

**Breakpoint color guidance:**
- Use **Gray** (`--mds-color-neutral-10`) for quantitative diverging scales (e.g., representing "zero")
- Use **Sand Neutral 300** (`--mds-color-sand-neutral-300`, #E0D3C3) for qualitative diverging scales (e.g., survey midpoint like "neutral" between "strongly agree" and "strongly disagree")

**Direction:** Diverging scales can flow in either direction to suit the data logic (blue-left/red-right or vice versa).

```css
/* Diverging heatmap example */
.heatmap-cell[data-direction="negative"][data-intensity="high"] {
  background: var(--mds-color-electric-blue-900);
}
.heatmap-cell[data-direction="neutral"] {
  background: var(--mds-color-neutral-10);
}
.heatmap-cell[data-direction="positive"][data-intensity="high"] {
  background: var(--mds-color-crimson-red-600);
}
```

## Code Examples

### Categorical Bar Chart (6 categories)

```tsx
import { useState } from 'react';

const CATEGORICAL_6 = [
  'var(--mds-color-electric-blue-900)',
  'var(--mds-color-cyan-500)',
  'var(--mds-color-cyan-700)',
  'var(--mds-color-electric-blue-500)',
  'var(--mds-color-crimson-red-300)',
  'var(--mds-color-orchid-pink-400)'
];

function CategoricalBarChart({ data }: { data: Array<{ label: string; value: number }> }) {
  return (
    <svg viewBox="0 0 400 300">
      {data.map((item, i) => (
        <rect
          key={i}
          x={i * 60}
          y={300 - item.value}
          width={50}
          height={item.value}
          fill={CATEGORICAL_6[i % CATEGORICAL_6.length]}
        />
      ))}
    </svg>
  );
}
```

### Linear Heatmap (5 steps)

```tsx
const LINEAR_5 = [
  'var(--mds-color-electric-blue-200)',
  'var(--mds-color-electric-blue-300)',
  'var(--mds-color-electric-blue-500)',
  'var(--mds-color-electric-blue-700)',
  'var(--mds-color-electric-blue-900)'
];

function getLinearColor(value: number, min: number, max: number): string {
  const normalized = (value - min) / (max - min);
  const index = Math.floor(normalized * (LINEAR_5.length - 1));
  return LINEAR_5[Math.max(0, Math.min(index, LINEAR_5.length - 1))];
}
```

### Single-Category with Highlight

```css
/* All bars use base color */
.chart-bar {
  fill: var(--mds-color-deep-blue-900);
}

/* Highlighted bar uses Cyan 500 */
.chart-bar[data-highlight="true"] {
  fill: var(--mds-color-cyan-500);
}
```

## Fast Checklist

- [ ] All chart marks use **solid colors only** (no gradients, no transparency)
- [ ] Single-category charts use Deep Blue 900 or Electric Blue 900 (white bg) or Cyan 500 (dark bg)
- [ ] Highlights use Cyan 500 on white backgrounds
- [ ] 3-category charts use the core McKinsey trio (Deep Blue 900, Cyan 500, Electric Blue 500)
- [ ] 4-10 category charts use the exact categorical sequence from this skill
- [ ] More than 10 categories? Group extras into "Other" using Gray 60%
- [ ] Linear scales use Electric Blue or mixed Blue scales (3-7 steps)
- [ ] Diverging scales use Electric Blue↔Crimson Red or Marine Green↔Crimson Red with neutral breakpoint
- [ ] All color references use `var(--mds-color-*)` CSS custom properties from `colors.css`
- [ ] Darkest shades represent highest values (reverse for dark backgrounds)
