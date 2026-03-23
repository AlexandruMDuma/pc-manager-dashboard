# MDS Presentation Typography Standards

This skill defines typography hierarchy for full-screen presentation pages, slides, and marketing layouts.

## When to Use This Skill

Apply these standards when working with:
- Full-screen slide/presentation pages
- PowerPoint-style web decks
- Marketing hero sections
- Scroll-based presentation layouts
- Any full-screen content with title + subtitle structure

## Core Typography Standards

### Slide Titles (Bower)

**Requirements:**
- Font: `var(--mds-font-display)` (Bower)
- Size: `2.75rem` (44px)
- Weight: `700` (bold) or `500` (medium)
- Color: **Always black** - `var(--text)` or `var(--mds-color-text-default)`

**CRITICAL: Bower is NEVER colored**
- No brand colors on Bower text
- No muted/subtle colors on Bower text
- Always use default text color (black)

```css
/* ✅ GOOD - Slide title with Bower */
.slide-title {
  font-family: var(--mds-font-display);
  font-size: 2.75rem;
  font-weight: var(--mds-font-weight-bold, 700);
  color: var(--text); /* Always black */
}
```

```css
/* ❌ BAD - Colored Bower or wrong font */
.slide-title {
  font-family: var(--mds-font-display);
  font-size: 2.75rem;
  color: var(--brand); /* NEVER color Bower */
}

/* ❌ BAD - Using McKinsey Sans for main title */
.slide-title {
  font-family: var(--mds-font-body);
  font-size: 2.75rem;
}
```

### Subtitles (McKinsey Sans)

**Requirements:**
- Font: `var(--mds-font-body)` (McKinsey Sans)
- Size: `1.2rem` (19.2px)
- Weight: `500` (medium) or `400` (regular)
- Color: `var(--text-muted)` or `var(--mds-color-text-subtle)`

```css
/* ✅ GOOD - Subtitle with McKinsey Sans */
.slide-subtitle {
  font-family: var(--mds-font-body);
  font-size: 1.2rem;
  font-weight: var(--mds-font-weight-medium, 500);
  color: var(--text-muted);
}
```

```css
/* ❌ BAD - Using Bower for subtitle */
.slide-subtitle {
  font-family: var(--mds-font-display); /* NEVER use Bower for subtitles */
  font-size: 1.2rem;
}
```

## Common Patterns

### Pattern 0: Cover Slide (Required)

**Every presentation must begin with a cover slide.** This is slide 1 and is never omitted.

The cover slide uses a dark background with the McKinsey scriptmark logo, the presentation title, and supporting metadata. It is the only slide where Bower text may be white (see Color Restrictions).

**Required elements:**

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| McKinsey scriptmark | Inline SVG (not text) | `width="126" height="40"` | — | `#FFFFFF` (white variant) |
| Title (e.g. client name) | Bower (`--mds-font-display`) | `2.75rem` | 700 | `--mds-color-white` |
| Program / deck name | McKinsey Sans (`--mds-font-body`) | `1.2rem` | 500 | `--mds-color-neutral-30` |
| Detail line (e.g. "Month 6 Status Review") | McKinsey Sans | `--mds-font-size-body-lg` | 400 | `--mds-color-white` |
| Date | McKinsey Sans | `--mds-font-size-body-sm` | 400 | `--mds-color-neutral-40` |
| Confidential marker (optional) | McKinsey Sans | `--mds-font-size-body-xs` | 500 | `--mds-color-neutral-54` |

**Background:** `--mds-color-deep-blue-900`

**Divider:** A short horizontal rule (64px wide, 2px tall) in `--mds-color-electric-blue-500` separates the title block from the detail block.

**Logo rules:**

- Always use the **white** scriptmark variant: fetch from `https://cdn.mckinsey.com/assets/images/McK_ScriptMark_RGB_White.svg`
- Embed as **inline SVG** with explicit dimensions (`width="126" height="40"`, `viewBox="0 0 283.4 90.2"`)
- Strip the XML prolog, `<style>` block, and Illustrator comments; wrap paths in `<g fill="#FFFFFF">`
- Add `aria-label="McKinsey &amp; Company" role="img"`
- Never use plain text, a heading element, or Bower-styled text as a logo substitute
- See `reference/28-logo.md` for the full logo embedding workflow

```html
<section class="slide slide--cover" data-slide="1">
  <div class="cover">
    <svg class="cover__logo" width="126" height="40"
         viewBox="0 0 283.4 90.2"
         xmlns="http://www.w3.org/2000/svg"
         aria-label="McKinsey &amp; Company" role="img">
      <g fill="#FFFFFF">
        <!-- paste <path> elements from CDN SVG -->
      </g>
    </svg>
    <h1 class="cover__title">Client Name</h1>
    <p class="cover__program">Program or Deck Name</p>
    <div class="cover__divider"></div>
    <p class="cover__detail">Subtitle or Context Line</p>
    <p class="cover__date">March 2026</p>
    <p class="cover__confidential">Confidential</p>
  </div>
</section>
```

```css
.slide--cover {
  background: var(--mds-color-deep-blue-900);
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.cover__logo {
  display: block;
  margin-bottom: 3rem;
}

.cover__title {
  font-family: var(--mds-font-display);
  font-size: 2.75rem;
  font-weight: var(--mds-font-weight-bold, 700);
  color: var(--mds-color-white);
  margin: 0 0 0.5rem;
}

.cover__program {
  font-family: var(--mds-font-body);
  font-size: 1.2rem;
  font-weight: var(--mds-font-weight-medium, 500);
  color: var(--mds-color-neutral-30);
  margin: 0 0 2rem;
}

.cover__divider {
  width: 64px;
  height: 2px;
  background: var(--mds-color-electric-blue-500);
  margin: 0 auto 2rem;
}

.cover__detail {
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-body-lg);
  font-weight: var(--mds-font-weight-regular, 400);
  color: var(--mds-color-white);
  margin: 0 0 0.5rem;
}

.cover__date {
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-body-sm);
  color: var(--mds-color-neutral-40);
  margin: 0 0 2.5rem;
}

.cover__confidential {
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-body-xs);
  font-weight: var(--mds-font-weight-medium, 500);
  color: var(--mds-color-neutral-54);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin: 0;
}
```

### Pattern 1: Standard Slide Layout

Each slide has a title (Bower) and subtitle (McKinsey Sans):

```html
<section class="slide">
  <div class="slide__content">
    <h2 class="slide-title">Three Column Layout</h2>
    <p class="slide-subtitle">Lorem ipsum content blocks in a classic slide format.</p>
    <!-- slide content -->
  </div>
</section>
```

```css
.slide-title {
  margin: 0;
  font-family: var(--mds-font-display);
  font-size: 2.75rem;
  font-weight: var(--mds-font-weight-bold, 700);
  color: var(--text);
}

.slide-subtitle {
  margin: 0.8rem 0 0;
  font-family: var(--mds-font-body);
  font-size: 1.2rem;
  font-weight: var(--mds-font-weight-medium, 500);
  color: var(--text-muted);
}
```

### Pattern 2: Hero/Title Slide with Multi-Line Title

When the main title spans two lines with different styling:
- **First line**: Bower at 2.75rem (bold, black)
- **Second line**: McKinsey Sans at 1.2rem (medium, muted) - this is the SUBTITLE

```html
<section class="slide">
  <div class="slide__content">
    <h1 class="hero-title">
      <span>Lorem Ipsum</span>
      <span>PowerPoint Style Deck</span>
    </h1>
    <p class="hero-subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </div>
</section>
```

```css
.hero-title {
  margin: 0;
  display: grid;
  gap: 0.2rem;
}

/* First line: Bower title */
.hero-title span:first-child {
  font-family: var(--mds-font-display);
  font-size: 2.75rem;
  font-weight: var(--mds-font-weight-bold, 700);
  color: var(--text); /* Always black */
}

/* Second line: McKinsey Sans subtitle */
.hero-title span:last-child {
  font-family: var(--mds-font-body);
  font-size: 1.2rem;
  font-weight: var(--mds-font-weight-medium, 500);
  color: var(--text-muted);
}
```

**CRITICAL: Second line uses McKinsey Sans, NOT Bower**
- Even though it's inside the title element, the secondary text is a subtitle
- Apply McKinsey Sans sizing and color rules

### Pattern 3: Additional Subtitle/Body Text

Below the main subtitle, use McKinsey Sans body sizing:

```css
.hero-body {
  margin: 1rem auto 0;
  font-family: var(--mds-font-body);
  font-size: var(--mds-font-size-body-1, 1rem);
  color: var(--text-muted);
  line-height: 1.6;
}
```

## Typography Hierarchy Summary

```
┌─────────────────────────────────────────┐
│ Main Title (Bower)                      │
│ 2.75rem, weight 700, black              │
├─────────────────────────────────────────┤
│ Subtitle (McKinsey Sans)                │
│ 1.2rem, weight 500, muted               │
├─────────────────────────────────────────┤
│ Body Text (McKinsey Sans)               │
│ 1rem, weight 400, muted                 │
└─────────────────────────────────────────┘
```

## Color Restrictions

### Bower (--mds-font-display)
- ✅ Black: `var(--text)` or `var(--mds-color-text-default)`
- ✅ White: `var(--mds-color-white)` — **only** on dark-background cover slides (Pattern 0)
- ❌ NEVER: Brand colors, muted colors, or any other color variation

### McKinsey Sans (--mds-font-body)
- ✅ Muted: `var(--text-muted)` or `var(--mds-color-text-subtle)`
- ✅ Default: `var(--text)` for emphasis
- ✅ Brand: Only for interactive elements (links, buttons)

## Key Rule

**Bower is ONLY for the slide title element.** Every other text element on a slide — narrative blurbs, summary boxes, callout text, KPI values, KPI labels, insight boxes, body paragraphs, table content, captions, pros/cons lists — uses McKinsey Sans, regardless of how prominent or important the text feels.

## Anti-Patterns to Avoid

### ❌ Using Bower for Narrative or Callout Text
```css
/* WRONG — headline box looks important but is body text */
.headline-box {
  font-family: var(--mds-font-display);
  font-size: 1rem;
}

/* WRONG — callout/summary blurb */
.callout-box {
  font-family: var(--mds-font-display);
}
```

```css
/* ✅ GOOD — narrative and callout text always uses McKinsey Sans */
.headline-box {
  font-family: var(--mds-font-body);
  font-size: 1rem;
  font-weight: var(--mds-font-weight-regular, 400);
}
```

### ❌ Using Bower for Subtitles
```css
/* WRONG */
.slide-subtitle {
  font-family: var(--mds-font-display);
  font-size: 1.2rem;
}
```

### ❌ Coloring Bower Text
```css
/* WRONG */
.slide-title {
  font-family: var(--mds-font-display);
  color: var(--brand); /* NEVER color Bower */
}

.hero-title span:last-child {
  font-family: var(--mds-font-display);
  color: var(--brand); /* This should be McKinsey Sans anyway */
}
```

### ❌ Using McKinsey Sans for Main Titles
```css
/* WRONG */
.slide-title {
  font-family: var(--mds-font-body);
  font-size: 2.75rem; /* Should use Bower at this size */
}
```

### ❌ Responsive Sizing Below 2.75rem for Bower
```css
/* WRONG */
.slide-title {
  font-family: var(--mds-font-display);
  font-size: clamp(1.7rem, 4vw, 2.75rem); /* Min size too small for Bower */
}
```

If you need responsive sizing, switch to McKinsey Sans for smaller screens:

```css
/* ✅ GOOD - Switch fonts based on size threshold */
.slide-title {
  font-family: var(--mds-font-display);
  font-size: 2.75rem;
}

@media (max-width: 768px) {
  .slide-title {
    font-family: var(--mds-font-body); /* Switch to McKinsey Sans */
    font-size: 2rem; /* Below Bower minimum */
  }
}
```

## Slide Background and Card Contrast

Slides that contain box elements (KPI cards, summary panels, callout boxes, milestone trackers, option cards, etc.) must follow the same card-contrast rules as dashboards. A white box on a white slide is invisible — the border alone does not create enough separation.

**Required pattern for content slides:**

```css
/* ✅ GOOD — subtle gray slide, white elevated cards */
.slide {
  background: var(--mds-color-background-subtle);
}

.kpi-card,
.summary-box,
.callout-box {
  background: var(--mds-color-background-default);
  border: 1px solid var(--mds-color-border-default);
  box-shadow: var(--mds-elevation-card-box-shadow);
}
```

```css
/* ❌ BAD — white cards on white slide; border-default is near-invisible */
.slide {
  background: var(--mds-color-white);
}

.kpi-card {
  background: var(--mds-color-white);
  border: 1px solid var(--mds-color-border-default);
}
```

**Rules:**

- Content slides use `--mds-color-background-subtle` as the slide background
- Box elements use `--mds-color-background-default` (white) + `--mds-elevation-card-box-shadow`
- Title slides with dark backgrounds (e.g. `--mds-color-deep-blue-900`) are exempt — contrast is already achieved by color
- Inset elements within a card step one shade darker (`--mds-color-neutral-10`), never back to the slide background token

See `reference/35-layout-patterns.md`, Pattern 3 for the full card surface contrast rules.

## Implementation Checklist

When implementing presentation pages:

### Cover slide (required)
- [ ] Presentation begins with a cover slide as slide 1
- [ ] Cover background is `--mds-color-deep-blue-900`
- [ ] McKinsey scriptmark is the **white** inline SVG from CDN — never plain text, never Bower-styled text
- [ ] Logo has explicit dimensions (`width="126" height="40"`) and `viewBox="0 0 283.4 90.2"`
- [ ] Logo has `aria-label="McKinsey &amp; Company" role="img"`
- [ ] Cover title uses Bower at 2.75rem in white (the only permitted Bower white exception)
- [ ] Cover subtitle / program name uses McKinsey Sans (not Bower)
- [ ] Electric blue divider separates title block from detail block

### Typography
- [ ] Main slide titles use Bower at 2.75rem
- [ ] Bower titles are always black (never colored)
- [ ] Bower appears ONLY on the slide title element — nowhere else
- [ ] Narrative boxes, callouts, summary blurbs, and KPI values all use McKinsey Sans
- [ ] Subtitles use McKinsey Sans at 1.2rem
- [ ] Multi-line hero titles follow first-line-Bower/second-line-McKinsey-Sans pattern
- [ ] Font weights are 700 or 500 only (never 300 or 400 for Bower)
- [ ] Color tokens are used (not hard-coded values)
- [ ] Responsive behavior switches to McKinsey Sans if size drops below 2.75rem

### Slide surfaces and card contrast
- [ ] Content slides use `--mds-color-background-subtle` (not white)
- [ ] Box elements (cards, panels, callouts) use `--mds-color-background-default` (white) with elevation
- [ ] Box elements include `box-shadow: var(--mds-elevation-card-box-shadow)`
- [ ] Dark-background title slides are exempt (contrast is inherent)
- [ ] Inset elements within a card use `--mds-color-neutral-10` (one step darker than card, never matching slide background)

## Related Guidance

- **Bower restrictions**: See `reference/15-fonts.md` for comprehensive Bower usage rules
- **Card surface contrast**: See `reference/35-layout-patterns.md`, Pattern 3 for the full contrast rules (applies to slides and dashboards equally)
- **Banner/dashboard sizing**: See `reference/35-layout-patterns.md` for dashboard title sizing (different context)
- **Typography tokens**: See `css/mds/typography.css` for all available type tokens
