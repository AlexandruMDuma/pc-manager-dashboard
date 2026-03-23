# MDS Design Guardrails

These constraints apply to ALL code in this project. For full guidance, invoke the MDS design system skill.

## 1. Components
In **React projects**, never use raw `<button>`, `<input>`, `<select>`, `<textarea>` in app code outside of an MDS wrapper/facade. Use the MDS component library instead (see reference/10-detection.md for how to identify it). Raw HTML controls are acceptable **inside** a thin wrapper component that renders MDS-styled output (e.g. an `<MdsButton>` that renders a `<button>`). In **vanilla (non-React) projects**, raw HTML elements are permitted when styled with MDS token classes and CSS patterns from reference/26-vanilla-component-patterns.md.

## 2. Icons
Never use emoji, Unicode symbols, or third-party icon libraries. Always use MDS library SVGs from `icons/mds/` (see reference/27-icons.md).

## 3. Card Contrast
Card background must differ from page or slide background. This applies to dashboards, presentations, and any page with box elements (KPI cards, summary panels, callout boxes, option cards, etc.). Use `--mds-color-background-subtle` for the page/slide and `--mds-color-background-default` + elevation for cards. Inset sections step one neutral shade darker than the card — never matching the page (see reference/35-layout-patterns.md, Pattern 3; for presentations see also reference/16-presentation-typography.md).

## 4. Bower Typography
Bower font (--mds-font-display) is only allowed at display sizes (2.75rem+), weights 500/700. One exception: app name in top banner at 1.5rem minimum. Everything else uses McKinsey Sans (see reference/15-fonts.md).

## 4b. McKinsey Sans Weight Ceiling
McKinsey Sans (`--mds-font-body`) only ships in three weights: Light (300), Regular (400), Medium (500). There is **no McKinsey Sans Bold font file**. Never use `--mds-font-weight-bold` (700) with `--mds-font-body` — the browser will faux-bold the text, producing incorrect rendering. The heaviest permitted weight for any McKinsey Sans text is `--mds-font-weight-medium` (500). Weight 700 is exclusively for Bower display text (`--mds-font-display`).

## 5. Badges
Never create ad-hoc badge styles with bare variant classes (e.g. `.badge--success` alone). Always use the full MDS badge component CSS from `reference/26-vanilla-component-patterns.md` — base `.badge` + style modifier `.badge--outlined` or `.badge--filled` + variant class, all backed by `--mds-badge-*` tokens from `css/mds/badge.css`. Choose outlined vs filled per `reference/36-badge-variant-selection.md`.

## 6. Language and Currency
Always use US English and US dollars ($) by default in all generated content — copy, labels, comments, documentation, and sample data. Use `$` as the currency symbol, period as the decimal separator (`$1,234.56`), and US English spelling throughout. This applies even when the user's prompt uses British spelling or non-USD currency — silently convert to US defaults unless the user explicitly requests a specific locale or currency (e.g. "use GBP" or "this is for a UK audience"). See reference/06-language.md for the full substitution table, currency rules, and formatting standards.

## 7. SVG Charts in Cards
When placing SVG charts inside dashboard cards, the card must use `display: flex; flex-direction: column` so the chart fills available space. The `<figure>` wrapper and `<svg>` element must have distinct class names (BEM: `.chart-figure` / `.chart-figure__svg`) — never the same class on both, which causes `min-height` and `width` to conflict. Chart SVGs use `width: 100%; height: auto` and side-by-side chart grids use `align-items: stretch` for equal card heights (see reference/35-layout-patterns.md, Pattern 7).

## 8. Icon viewBox Must Match Render Size
Never render an MDS icon at a CSS size smaller than its `viewBox`. A `viewBox="0 0 24 24"` icon displayed at `width: 16px` causes **jagged, distorted** icons because sub-pixel math cannot cleanly render the path geometry. Always pull the MDS variant whose `viewBox` matches the CSS display size (e.g. 16px display → pull the `width: 16` variant from the category JSON). If the exact size variant doesn't exist, use the nearest larger variant at its native size, or pick a different icon. Additionally, never apply a blanket `stroke: currentColor` to glyph-style (filled) icons — this adds unwanted outlines. **Dual-context rule**: when the same icon is used at two different sizes on a page (e.g. `c-remove` at 12px inside stage badges *and* at 16px inside action buttons), pull a **separate MDS variant for each size** and store them under distinct keys — never reuse one SVG definition across size contexts. See reference/27-icons.md, "Match viewBox to CSS render size", "Dual-context icons", and "Anti-Patterns".

## 9. Favicon
Every HTML page must include `<link rel="icon" type="image/png" href="https://cdn.mckinsey.com/assets/images/favicon.png">` in the `<head>`. Always use the CDN URL directly — do not store a local copy. See reference/29-favicon.md.

## 10. HTML File Naming
Never name a page `index.html`. Multi-page workspaces share the `css/` and `js/` directories, and `index.html` is a collision target — any agent session that creates a new page will overwrite it. Always use a descriptive, kebab-case filename that reflects the page's purpose (e.g. `emea-staffing-review.html`, `client-dashboard.html`, `quarterly-report.html`). Before creating a new HTML file, list the workspace root to check for existing files and avoid overwriting them.
