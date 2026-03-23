# MDS Layout Patterns

## Use This Skill For

- Dashboard or page shell layout work
- Header/title/subtitle sizing and alignment
- Tab navigation spacing and section spacing
- Button group spacing around tables/cards/forms

## Required Patterns

### 1) Banner and Dashboard Title Sizing

- App/banner name: `var(--mds-font-size-heading-5)` (~1.5rem) — Bower allowed here as app-name exception
- Banner label (page/section title inside a banner): `var(--mds-font-size-heading-4)` (~1.4rem) — McKinsey Sans, **weight 500** (`var(--mds-font-weight-medium)`)
- Dashboard page title: `var(--mds-font-size-heading-2)` (~2rem) — McKinsey Sans, weight 500 (`var(--mds-font-weight-medium)`), `margin-bottom: 0.25rem`
- Dashboard subtitle: `var(--mds-font-size-heading-6)` (~1rem) — McKinsey Sans, weight 400. **Never use `body-xs` or `body-sm` for subtitles** — these are too small for a page-level label.
- Full-width widget title: `var(--mds-font-size-heading-4)` (~1.4rem) — McKinsey Sans, weight 500

The title-to-subtitle gap is `margin-bottom: 0.25rem` — tight coupling shows they are a single header unit. Never flush (0) and never a full paragraph gap (0.75rem+) which visually separates them too far. If title is centered, subtitle must also be centered. If title is left-aligned, subtitle must also be left-aligned.

### 2) Dashboard Background With White Elevated Cards

When the page contains elevated white cards/panels, set:

```css
.dashboard {
  background: var(--mds-color-background-subtle);
}
```

Do not force this background on flat table pages with no elevated card/panel structure.

### 3) Card Surface Contrast

A card or panel must always use a **different background color from its page background**. When the surface and page share the same color token, borders and shadows lose their ability to create separation.

**Two failure modes:**

| Page background | Card background | Result | Fix |
|---|---|---|---|
| `--mds-color-background-default` (white) | `--mds-color-background-default` (white) | `border-default` invisible (~1.17:1) | Switch page to `--mds-color-background-subtle` |
| `--mds-color-background-subtle` (gray) | `--mds-color-background-subtle` (gray) | No separation at all (1:1) | Switch card to `--mds-color-background-default` |

**Correct pairings:**

```css
/* ✅ GOOD — white cards on subtle gray page (most common dashboard pattern) */
.page { background: var(--mds-color-background-subtle); }
.card { background: var(--mds-color-background-default); border: 1px solid var(--mds-color-border-default); }

/* ✅ GOOD — white page, use shadow or strong border for card separation */
.page { background: var(--mds-color-background-default); }
.card { background: var(--mds-color-background-default); box-shadow: var(--mds-elevation-card-box-shadow); }
/* or */
.card { background: var(--mds-color-background-default); border: 1px solid var(--mds-color-border-strong); }
```

```css
/* ❌ BAD — same token on both page and card; border-default is invisible */
.page { background: var(--mds-color-background-default); }
.card { background: var(--mds-color-background-default); border: 1px solid var(--mds-color-border-default); }

/* ❌ BAD — subtle-on-subtle; card is indistinguishable from page */
.page { background: var(--mds-color-background-subtle); }
.card { background: var(--mds-color-background-subtle); border: 1px solid var(--mds-color-border-default); }
```

**Quick decision rule:**

- Elevated white cards → put them on `--mds-color-background-subtle`
- Cards that must sit on a white page → use `box-shadow` or `--mds-color-border-strong`
- Never use `--mds-color-border-default` as the sole separator when card and page share the same background token

**3b) Inset Depth Hierarchy — within a card**

Any inset, highlighted section, or nested panel inside a card must use the **next step darker** in the neutral scale from its containing surface. An inset must never echo the page background, even when the card itself is correct.

Full depth stack:

```
Page          --mds-color-neutral-5   (#F2F2F2)  ← subtle page
  Card        --mds-color-white       (#FFFFFF)  ← one step lighter than page
    Inset     --mds-color-neutral-10  (#E6E6E6)  ← one step darker than card
      Header  --mds-color-neutral-20  (#CCCCCC)  ← one step darker than inset
```

The rule cascades at every level. If a table header or nested element sits inside an inset at `neutral-10`, it must step to `neutral-20` — never back to `neutral-5`.

```css
/* ✅ GOOD — inset steps one level darker than the card */
.page   { background: var(--mds-color-neutral-5); }
.card   { background: var(--mds-color-white); }
.inset  { background: var(--mds-color-neutral-10); }

/* ❌ BAD — inset matches page background; appears to punch a visual hole through the card */
.page   { background: var(--mds-color-neutral-5); }
.card   { background: var(--mds-color-white); }
.inset  { background: var(--mds-color-neutral-5); }  /* same as page = invisible */
```

### 4) Button Spacing

- Section header above content: `margin-bottom: 1.5rem` minimum
- Horizontal button groups: `gap: 0.75rem` to `1rem`
- Table action buttons: use `margin-right: 0.5rem` with `:last-child` reset

### 5) Tab Navigation and Content Spacing

- Tab bar must have spacing below (`1.5rem` minimum, `2rem` preferred)
- Tab content should not be flush to tab bar (`margin-top: 1.5rem` when needed)
- Active indicator belongs on active tab only, never full-width container border

### 6) McKinsey Logo in Banner

When the McKinsey name or brand identity appears in the top navigation banner, **always use the official SVG logo** — never plain text, a heading element, or Bower-styled text.

Three color variants are available in `.cursor/skills/mds-design-system/logo/`:

| Variant | File | Use when |
|---|---|---|
| White | `02_White/McK_Logo_RGB_White.svg` | Banner background is dark / deep blue (most common) |
| Deep Blue | `01_Deep Blue/McK_Logo_RGB_DeepBlue.svg` | Banner background is white or light gray |
| Black | `03_Black/McK_Logo_RGB_Black.svg` | Banner background is white / light, high-contrast context |

**Selection rule:** match logo fill to banner background:
- `--mds-color-deep-blue-900` background → **White** variant
- White or light background → **Deep Blue** or **Black** variant

**HTML pattern (vanilla):**

```html
<!-- GOOD — white logo on deep blue banner (inline SVG from CDN) -->
<header class="top-banner">
  <svg class="top-banner__logo" width="88" height="28"
       viewBox="0 0 283.4 90.2"
       xmlns="http://www.w3.org/2000/svg"
       aria-label="McKinsey &amp; Company" role="img">
    <g fill="#FFFFFF">
      <!-- paste <path> elements from https://cdn.mckinsey.com/assets/images/McK_ScriptMark_RGB_White.svg -->
    </g>
  </svg>
  <!-- other nav content -->
</header>
```

```css
.top-banner {
  background: var(--mds-color-deep-blue-900);
  padding: 0 var(--mds-spacing-6);
  height: 56px;
  display: flex;
  align-items: center;
  gap: var(--mds-spacing-4);
}

.top-banner__logo {
  height: 28px;   /* scales proportionally; viewBox is 283.4 × 90.2 */
  width: auto;
  display: block;
  flex-shrink: 0;
}
```

**Do not:**
- Write `McKinsey & Company` as plain HTML text or a `<span>`/`<h*>` element in the top banner
- Apply Bower font or any font styling to simulate the logo — the SVG is the only approved representation
- Modify the SVG fill color inline — choose the correct file variant instead

### 7) Banner Horizontal Padding with Max-Width Layout

When a banner sits above content that uses a `max-width` + `margin: 0 auto` container, **the horizontal padding must be applied inside the inner container — not on the outer banner wrapper.**

If the outer wrapper carries the padding, banner content left-edges diverge from page content left-edges on any viewport wider than `max-width + 2×padding`.

```css
/* ✅ GOOD — padding inside the constrained inner container */
.top-banner        { padding: 1.25rem 0; }
.top-banner__inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
.page-content      { max-width: 1200px; margin: 0 auto; padding: 2rem; }

/* ❌ BAD — padding on outer wrapper; logo starts 2rem left of page content */
.top-banner        { padding: 1.25rem 2rem; }
.top-banner__inner { max-width: 1200px; margin: 0 auto; }
.page-content      { max-width: 1200px; margin: 0 auto; padding: 2rem; }
```

Apply the same inner-container pattern to the footer if it also has a `max-width` content area below it.

### 8) SVG Charts Inside Dashboard Cards

When a widget card contains an SVG chart, follow this structure to ensure charts fill the card and both cards in a row stay equal height.

**Card must be a flex column:**

```css
.widget-card {
  display: flex;
  flex-direction: column;
}

.widget-title {
  flex-shrink: 0;
}
```

**Chart figure fills remaining space:**

```css
.chart-figure {
  flex: 1 1 auto;
  display: flex;
  align-items: stretch;
  min-height: 0;
}

.chart-figure__svg {
  width: 100%;
  height: auto;
  min-height: 240px;
}
```

**Grid rows equalize card heights:**

```css
.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: stretch;
}
```

**HTML pattern — use BEM naming, never share classes between `<figure>` and `<svg>`:**

```html
<div class="widget-card">
  <h2 class="widget-title">Revenue by Practice Area</h2>
  <figure class="chart-figure" role="img" aria-label="Description of chart">
    <svg class="chart-figure__svg" viewBox="0 0 520 280" aria-hidden="true">
      <!-- chart content -->
    </svg>
  </figure>
  <div class="chart-legend"><!-- legend items --></div>
</div>
```

**Rules:**

1. **Never reuse the same class on both `<figure>` and `<svg>`** — CSS like `min-height` and `width` applied to both causes sizing conflicts. Use BEM: `.chart-figure` for the container, `.chart-figure__svg` for the SVG.
2. **Widget cards must use `display: flex; flex-direction: column`** — without this, the chart cannot grow to fill remaining card space below the title.
3. **Chart figure uses `flex: 1 1 auto`** — this makes the chart expand into all available vertical space rather than collapsing to its intrinsic height.
4. **SVG uses `width: 100%; height: auto`** — the `viewBox` attribute handles aspect ratio; `width: 100%` ensures the SVG scales to the container, `height: auto` preserves proportions.
5. **Grid rows use `align-items: stretch`** — ensures side-by-side chart cards are the same height even when their SVG viewBoxes differ.
6. **Legends and other siblings use `flex-shrink: 0`** — prevents legends and titles from being compressed when the chart grows.

## Fast Checklist

- [ ] Title uses `heading-2`, subtitle uses `heading-6` (never `body-xs` or `body-sm`), gap is `0.25rem` between them
- [ ] Elevated-card dashboards use subtle page background
- [ ] Card background differs from page background — never same token on both
- [ ] Cards on white page use shadow or border-strong, not border-default alone
- [ ] Inset/highlight sections inside a card use the next neutral step darker than the card surface (not the same token as the page background)
- [ ] Table headers and nested panels within an inset also step darker (neutral-20 inside a neutral-10 inset)
- [ ] Buttons are not flush with surrounding content
- [ ] Tabs have breathing room before content
- [ ] Active tab indicator is scoped to active tab only
- [ ] McKinsey brand in banner uses the correct SVG logo variant — never plain text or Bower-styled text
- [ ] Widget cards with charts use `display: flex; flex-direction: column` so charts fill available space
- [ ] `<figure>` and `<svg>` never share the same class name — use BEM (`.chart-figure` / `.chart-figure__svg`)
- [ ] Chart SVGs use `width: 100%; height: auto` (never fixed pixel width)
- [ ] Side-by-side chart grids use `align-items: stretch` for equal card heights
