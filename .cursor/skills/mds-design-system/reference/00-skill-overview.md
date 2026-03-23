## Purpose

This skill helps you apply a **standard MDS approach** when building UI across different project types.

It is designed for teams who want consistent, token-driven, accessible UI that follows the McKinsey Design System (MDS).

## What this skill does

- Detects your UI stack (MDS React, Bootstrap, vanilla CSS/HTML, or mixed).
- Helps you do one of five things:
  - **Design my page**
  - **Add components**
  - **Setup my style**
  - **Convert my project**
  - **Create data visualizations** — chart selection, color palettes, labeling, annotations
- Always prefers **MDS tokens** and **MDS component patterns** (React components when available).
- Provides incremental migration guidance from Bootstrap/vanilla.

## How to ask for help (recommended prompt shapes)

### Design my page

Provide:
- Page goal (what outcome the page should drive)
- Primary users
- Key sections (hero, filters, table, cards, etc.)
- Content density (low/medium/high)
- Accessibility requirements (if any)

Example:
> Design my page: an internal catalog landing page with search, filters, and cards. Needs keyboard accessibility and responsive layout.

### Add components

Provide:
- Which component(s)
- Where they live (route/page/component)
- Desired behavior (states, interactions)

Example:
> Add an MDS header + vertical navigation. I need active state, collapse on mobile, and accessible focus styles.

### Setup my style

Provide:
- Your stack (if you already know it)
- Current styling approach (Tailwind, CSS modules, plain CSS, Sass, Bootstrap)
- Build tooling (Next.js/Vite/Astro/CRA)

Example:
> Setup my style: React + Vite + CSS modules. I want to use MDS tokens and keep styles scoped.

### Convert my project

Provide:
- From → to target (Bootstrap → MDS tokens; vanilla → MDS tokens; React → MDS React)
- Constraints (timeline, “no big rewrites”, etc.)

Example:
> Convert my project: Bootstrap-based React app. First migrate colors/typography to MDS tokens, then migrate buttons/forms to MDS React components.

### Create data visualizations

Provide:
- Chart purpose (comparison, trend, distribution, composition)
- Number of categories or data series
- Background color (white or dark)
- Any specific chart type preference

Example:
> Create a bar chart comparing Q1-Q4 revenue across 5 regions. White background, needs proper MDS colors and axis labeling.

## Operating rules (the “standard approach”)

1. **Start with detection**. Always classify the repo before recommending implementation changes.
2. **Prefer tokens before custom values**. Avoid hard-coded hex, font sizes, spacing values.
3. **Prefer MDS components** where available (especially for forms, navigation, feedback).
4. **Plan migrations incrementally** (safe steps, measurable change, avoid large risky rewrites).
5. **Accessibility is non-negotiable** (focus-visible, keyboard support, semantics, reduced motion).
6. **CSS in external files only**. Never embed CSS in `<style>` tags or use inline `style` attributes. See `25-html-css-best-practices.md`.

## Where to look next

- Detection heuristics: `10-detection.md`
- Fonts and Bower restrictions: `15-fonts.md`, `16-presentation-typography.md`
- MDS CSS tokens guidance: `20-mdss-css.md`
- HTML/CSS best practices: `25-html-css-best-practices.md`
- Vanilla component patterns: `26-vanilla-component-patterns.md`
- MDS React guidance: `30-mdss-react.md` and `31-mdss-react-snippets.md`
- Layout, badge, and table patterns: `35-layout-patterns.md`, `36-badge-variant-selection.md`, `37-table-patterns.md`
- Bootstrap → MDS mapping: `40-bootstrap-mapping.md`
- Data visualization: `50-dataviz-chart-guide.md`, `51-dataviz-labeling.md`, `52-dataviz-color-system.md`
- Standard output format: `90-output-format.md`

