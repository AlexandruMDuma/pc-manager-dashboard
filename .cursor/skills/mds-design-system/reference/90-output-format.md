## Standard Output Format — MDS Design Recommendation

Use this exact structure for all responses. Sections 5, 6, and 7 are conditional — include them when applicable.

### 1) Detected stack

- **stack**: `mds-react` | `bootstrap` | `vanilla` | `mixed`
- **tokenSetup**: `present` | `missing` | `partial`
- **entrypoints**: list of discovered CSS/JS entry files
- **evidence**:
  - (3–10 bullets)

### 2) Recommended approach (MDS-first)

State the recommended approach in 3–6 bullets:
- Tokens-first (avoid hardcoded values)
- Prefer MDS React components when React is available
- Define a migration strategy (if bootstrap/vanilla)

### 3) Concrete steps (what to change)

Provide steps as a short checklist, including:
- Files to add/create (paths)
- Files to edit (paths)
- Import order changes (CSS)
- Component substitutions (Bootstrap/vanilla → MDS)

**File structure rules (mandatory for vanilla HTML projects):**
- CSS must be in dedicated external files (e.g., `css/global.css`, `css/components.css`)
- NEVER generate embedded `<style>` blocks in HTML
- NEVER generate inline `style` attributes in HTML
- Use proper HTML5 document structure with semantic elements
- See `25-html-css-best-practices.md` for complete rules

### 4) Component + token guidance

Provide:
- **Components**: recommended MDS React components (or vanilla components)
- **Tokens**: which token categories to use (colors/typography/spacing/elevation)
- **States**: hover/active/focus/disabled/error tokens if applicable

### 5) Typography guidance (when text styling is involved)

- **Bower restrictions**: display sizes only (≥2.75rem), weights 500/700 only. See `16-presentation-typography.md`.
- **McKinsey Sans**: use for all non-display text (headings, body, data, labels, nav, buttons)
- **Font loading**: CDN preferred, static fallback, system font stacks. See `15-fonts.md`.

### 6) Data visualization guidance (when charts/graphs are involved)

- **Chart type**: selection rationale per `50-dataviz-chart-guide.md`
- **Color palette**: categorical/linear/diverging per `52-dataviz-color-system.md`
- **Labeling**: legends, axes, annotations per `51-dataviz-labeling.md`
- **Solid colors only**: no gradients, no transparency on data marks

### 7) Migration notes (if applicable)

List:
- Incremental migration plan (2–6 steps)
- Pitfalls to avoid (e.g., mixing two competing variable systems)

### 8) Accessibility + responsiveness

Always include:
- Keyboard/focus-visible guidance
- Reduced motion guidance (if animations used)
- Layout responsiveness strategy (breakpoints/grid)
