## HTML/CSS Best Practices — Standard Rules

This document defines mandatory practices for generating or modifying HTML and CSS in any project using this skill.

### CSS File Separation (MANDATORY)

**Rule: CSS must ALWAYS be in dedicated external files — NEVER embedded in HTML.**

#### Forbidden patterns

```html
<!-- ❌ NEVER use inline styles -->
<div style="color: red; margin: 10px;">Content</div>

<!-- ❌ NEVER use embedded <style> blocks -->
<head>
  <style>
    .my-class { color: red; }
  </style>
</head>
```

#### Required pattern

```html
<!-- ✅ ALWAYS link to external CSS files -->
<head>
  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="css/components.css">
</head>
```

#### Why this matters

- **Maintainability**: Styles in one place, easier to update
- **Cacheability**: External CSS files can be cached by browsers
- **Separation of concerns**: HTML for structure, CSS for presentation
- **Reusability**: Styles can be shared across multiple pages
- **Testing**: Easier to test and audit styles
- **Performance**: Avoids duplicate CSS across pages

### CSS File Organization

For vanilla HTML projects, use this structure:

```
project/
├── emea-staffing-review.html   # Descriptive name — NEVER use index.html
├── client-dashboard.html       # Each page gets a unique, kebab-case name
├── css/
│   ├── global.css              # MDS tokens + bridge layer (shared)
│   ├── layout.css              # Page layout (grid, containers)
│   ├── components.css          # Component-specific styles (shared)
│   └── utilities.css           # Utility classes (optional)
└── js/
    └── main.js
```

> **Important:** Never use `index.html`. Multiple pages share the same `css/` and `js/` directories, so generic filenames cause overwrites across agent sessions. Always check existing files before creating a new one.

#### Import order in global.css

```css
/* 1. MDS Foundation tokens */
@import './mds/colors.css';
@import './mds/typography.css';
@import './mds/elevation.css';
@import './mds/spacing.css';
@import './mds/grid.css';

/* 2. MDS Component tokens (as needed) */
@import './mds/button.css';
@import './mds/card.css';

/* 3. Project layout */
@import './layout.css';

/* 4. Project components */
@import './components.css';

/* 5. Utilities (last, for override capability) */
@import './utilities.css';
```

### HTML Document Structure

Always include proper document structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title</title>
  
  <!-- External CSS (no embedded styles) -->
  <link rel="stylesheet" href="css/global.css">
  
  <!-- Preconnect for external resources (if needed) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
</head>
<body>
  <!-- Skip link for keyboard/screen reader users -->
  <a href="#main-content" class="skip-link">Skip to main content</a>
  
  <!-- Semantic structure -->
  <header>...</header>
  <nav>...</nav>
  <main id="main-content">
    <article>...</article>
    <aside>...</aside>
  </main>
  <footer>...</footer>
  
  <!-- Scripts at end of body, or use defer -->
  <script src="js/main.js" defer></script>
</body>
</html>
```

### Semantic HTML Requirements

Use semantic elements appropriately:

| Element | Use for |
|---------|---------|
| `<header>` | Page or section header |
| `<nav>` | Navigation links |
| `<main>` | Primary content (one per page) |
| `<article>` | Self-contained content |
| `<section>` | Thematic grouping |
| `<aside>` | Tangentially related content |
| `<footer>` | Page or section footer |
| `<figure>` / `<figcaption>` | Images with captions |
| `<time>` | Dates and times |
| `<address>` | Contact information |

#### Avoid div soup

```html
<!-- ❌ Avoid -->
<div class="header">
  <div class="nav">...</div>
</div>

<!-- ✅ Prefer -->
<header>
  <nav>...</nav>
</header>
```

### Accessibility Requirements

#### Required attributes

- **Images**: Always include `alt` attribute
  ```html
  <img src="logo.png" alt="Company logo">
  <img src="decorative.png" alt="" role="presentation"> <!-- Decorative -->
  ```

- **Form inputs**: Always include labels
  ```html
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required>
  ```

- **Interactive elements**: Include ARIA when needed
  ```html
  <button aria-expanded="false" aria-controls="menu">Menu</button>
  <nav id="menu" aria-hidden="true">...</nav>
  ```

- **Skip links**: Provide for keyboard users
  ```html
  <a href="#main-content" class="skip-link">Skip to main content</a>
  ```

#### Focus states (CSS requirement)

```css
/* NEVER remove focus outlines without replacement */
/* ❌ Forbidden */
*:focus { outline: none; }

/* ✅ Required: visible focus states */
:focus-visible {
  outline: 2px solid var(--mds-color-electric-blue-500);
  outline-offset: 2px;
}
```

### Responsive Design

#### Viewport meta (required)

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

#### Mobile-first CSS

```css
/* Base styles (mobile) */
.card {
  width: 100%;
}

/* Tablet and up */
@media (min-width: 768px) {
  .card {
    width: 50%;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .card {
    width: 33.333%;
  }
}
```

#### Use MDS grid tokens

Grid tokens are breakpoint-specific. Choose the breakpoint that fits your layout:

```css
.container {
  /* Use breakpoint-specific tokens (xxl, xl, lg, md, sm, xs, xrs) */
  max-width: var(--mds-grid-xxl-max-width);
  padding-inline: var(--mds-grid-lg-gutter);
}
```

### Performance Best Practices

#### CSS loading

```html
<!-- Critical CSS can be preloaded -->
<link rel="preload" href="css/global.css" as="style">
<link rel="stylesheet" href="css/global.css">
```

#### JavaScript loading

```html
<!-- Use defer for non-critical scripts -->
<script src="js/main.js" defer></script>

<!-- Use async for independent scripts -->
<script src="js/analytics.js" async></script>
```

#### Image optimization

```html
<!-- Responsive images -->
<img 
  src="image-800.jpg" 
  srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
  alt="Description"
  loading="lazy"
>
```

### Reduced Motion Support

```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Overriding a Presentation-Mode Global Stylesheet for Scrollable Pages

When `global.css` locks the viewport for slide/presentation pages:

```css
html, body { overflow: hidden; height: 100%; }
```

Overriding only the `body` (via a page-specific class) is **not enough** — the `html` element still clips content at the viewport height and blocks all scrolling.

Use `:has()` to override the `html` element scoped to just the dashboard page, without affecting any other page that loads the same global stylesheet:

```css
/* ✅ GOOD — override both html AND body */
html:has(.dashboard-body) { overflow-y: auto; height: auto; }
.dashboard-body            { overflow-y: auto; height: auto; min-height: 100vh; }
```

```css
/* ❌ BAD — html still clips; users cannot scroll the page */
.dashboard-body { overflow-y: auto; height: auto; }
```

Add this at the top of the page-specific CSS file, scoped to the body class applied to that page only.

### Summary Checklist

When generating HTML/CSS, verify:

- [ ] CSS in external files only (no inline, no embedded `<style>`)
- [ ] Proper HTML5 document structure
- [ ] Semantic HTML elements used appropriately
- [ ] All images have `alt` attributes
- [ ] All form inputs have labels
- [ ] Skip link provided for keyboard users
- [ ] Focus states are visible
- [ ] Viewport meta tag present (with `initial-scale=1.0`)
- [ ] Mobile-first responsive approach
- [ ] MDS tokens used wherever available (avoid hard-coded values when tokens exist)
- [ ] Reduced motion respected
- [ ] Scripts use `defer` or `async`
