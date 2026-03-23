# MDS Fonts Reference

## Font Families

The MDS Design System uses two proprietary font families:

| Font | Purpose | CSS Variable | Weights |
|------|---------|--------------|---------|
| **Bower** | Display text only (headlines, hero) | `--mds-font-display` | Medium (500), Bold (700) |
| **McKinsey Sans** | Everything else (body, headings, data, labels, nav) | `--mds-font-body` | Light (300), Regular (400), Medium (500) |

### Bower Usage Restrictions

Bower is strictly limited. It may ONLY be used when ALL conditions are met:

1. **Display sizes only** — minimum 2.75rem (44px), which is display-6 or larger
2. **Weights 500 or 700 only** — never 300 or 400
3. **Display contexts only** — hero headlines, large page titles

**One exception**: the application name/logo in the top navigation banner may use Bower at a minimum of 1.5rem (24px), weights 500 or 700. This is the only exception to the 2.75rem minimum.

**Bower must NEVER be used for**: data/quantities ($2.4M, 148, 94%), dashboard widget titles, headings smaller than 2.75rem, body text, labels, captions, table content, navigation links, or buttons. Use McKinsey Sans (`--mds-font-body`) for all of these.

See `16-presentation-typography.md` for full typography rules.

## Font Loading Strategy

### 1. CDN (Primary - Recommended)

Always prefer loading fonts from the McKinsey CDN:

```css
@font-face {
  font-family: "McKinsey Sans";
  src: url("https://cdn.mckinsey.com/assets/fonts/web/McKinseySans-Regular.woff") format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

**CDN URLs:**
- `https://cdn.mckinsey.com/assets/fonts/web/Bower-Bold.woff`
- `https://cdn.mckinsey.com/assets/fonts/web/McKinseySans-Light.woff`
- `https://cdn.mckinsey.com/assets/fonts/web/McKinseySans-Regular.woff`
- `https://cdn.mckinsey.com/assets/fonts/web/McKinseySans-Medium.woff`

### 2. Static Fonts (Fallback - Obtain from McKinsey)

If CDN is unavailable (offline development, network restrictions, or hosting requirements), obtain the font files from the McKinsey CDN or your internal font distribution channel and place them in your project:

> **Note:** Font files are not bundled in this skill. Download them from the CDN URLs listed above or request them through your internal McKinsey distribution channel.

**Place in your project:**
```
your-project/css/fonts/
├── Bower-Bold.woff
├── McKinseySans-Light.woff
├── McKinseySans-Medium.woff
└── McKinseySans-Regular.woff
```

Then update `@font-face` to use local paths:

```css
@font-face {
  font-family: "McKinsey Sans";
  src: url("./fonts/McKinseySans-Regular.woff") format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

### 3. Combined Approach (CDN + Local Fallback)

For maximum reliability, use both CDN and local fallback in the `src` declaration:

```css
@font-face {
  font-family: "McKinsey Sans";
  src: url("https://cdn.mckinsey.com/assets/fonts/web/McKinseySans-Regular.woff") format("woff"),
       url("./fonts/McKinseySans-Regular.woff") format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

The browser will try CDN first, then fall back to local if CDN fails.

### 4. System Font Fallbacks

If proprietary fonts fail to load entirely, use these system font stacks:

| MDS Font | Web Fallback Stack |
|----------|-------------------|
| Bower | `Georgia, "Times New Roman", serif` |
| McKinsey Sans | `"Helvetica Neue", Arial, Calibri, Helvetica, Roboto, sans-serif` |

## Usage in CSS

### Using MDS Tokens (Recommended)

```css
/* Display text - uses Bower Bold */
.headline {
  font-family: var(--mds-font-display);
  font-weight: var(--mds-font-weight-bold);
}

/* Body text - uses McKinsey Sans */
.body-text {
  font-family: var(--mds-font-body);
  font-weight: var(--mds-font-weight-regular);
}
```

### Using MDS Classes

```html
<!-- Display styles (Bower Bold) -->
<h1 class="mds-display-1">Hero Headline</h1>

<!-- Heading styles (McKinsey Sans Medium) -->
<h2 class="mds-heading-2">Section Title</h2>

<!-- Body styles (McKinsey Sans Regular) -->
<p class="mds-body-regular-md">Body text content</p>
```

## File Structure for HTML Projects

```
project/
├── my-page.html          <!-- Descriptive name — never index.html -->
└── css/
    ├── fonts.css        <!-- @font-face declarations -->
    ├── mds-tokens.css   <!-- MDS CSS variables -->
    ├── global.css       <!-- Global styles -->
    └── fonts/           <!-- Static font files (fallback) -->
        ├── Bower-Bold.woff
        ├── McKinseySans-Light.woff
        ├── McKinseySans-Medium.woff
        └── McKinseySans-Regular.woff
```

## HTML Setup

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Preload fonts for better performance -->
  <link rel="preload" href="css/fonts/McKinseySans-Regular.woff" as="font" type="font/woff" crossorigin>
  <link rel="preload" href="css/fonts/Bower-Bold.woff" as="font" type="font/woff" crossorigin>
  
  <!-- Load font CSS first -->
  <link rel="stylesheet" href="css/fonts.css">
  <link rel="stylesheet" href="css/mds-tokens.css">
  <link rel="stylesheet" href="css/global.css">
</head>
```

## PowerPoint Fallbacks

When creating presentations or documents outside web context:

| MDS Font | PowerPoint Fallback |
|----------|---------------------|
| Bower | Georgia |
| McKinsey Sans | Arial or Calibri |

## Font Weight Reference

| Weight Name | CSS Value | McKinsey Sans Variant |
|-------------|-----------|----------------------|
| Light | 300 | McKinseySans-Light |
| Regular | 400 | McKinseySans-Regular |
| Medium | 500 | McKinseySans-Medium |
| Bold | 700 | (Bower Bold for display) |

## Quick Reference — Font by Text Role

**McKinsey Sans maximum weight is 500 (medium).** There is no McKinsey Sans Bold font file — never use weight 700 with `--mds-font-body`. Weight 700 is exclusively for Bower.

| Text role | Font family | Weight |
|---|---|---|
| Display text (2.75rem+) | `--mds-font-display` (Bower) | 500 or 700 |
| Application name in top banner | `--mds-font-display` (Bower), min 1.5rem | 500 or 700 |
| Page titles and headings | `--mds-font-body` (McKinsey Sans) | 500 |
| Widget and section titles | `--mds-font-body` (McKinsey Sans) | 500 |
| Data values and quantities | `--mds-font-body` (McKinsey Sans) | 500 |
| Body, labels, captions | `--mds-font-body` (McKinsey Sans) | 400 or 500 |
| Table content | `--mds-font-body` (McKinsey Sans) | 400 or 500 |
| Buttons and navigation | `--mds-font-body` (McKinsey Sans) | 500 |

## Troubleshooting

### Fonts not loading

1. Check network tab for 404 errors on font files
2. Verify `fonts.css` is loaded before other stylesheets
3. Ensure `crossorigin` attribute is set for preload links
4. Check CSP headers allow font sources

### Wrong font rendering

1. Verify correct `font-weight` is specified
2. Check if font file for that weight exists
3. Use browser DevTools to inspect computed font-family
