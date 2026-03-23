---
name: mds-design-system
description: >
  Applies a standard McKinsey Design System (MDS) approach in any repo.
  Detects whether the project is using MDS React, McKinsey Bootstrap, or vanilla CSS,
  then guides you to design pages, add components, set up styles, create data visualizations,
  or convert/migrate the project toward MDS standards (tokens + component patterns).
  Also applies when creating presentations, slide decks, HTML slides, or any display-oriented
  content — enforces Bower for titles, McKinsey Sans for body, and MDS token usage.
allowed-tools:
  - filesystem
  - shell
  - git
---

# MDS Design System — Standard Approach

This skill helps developers build consistent UI aligned with **MDS** across different stacks:

- **MDS React** (`@mds/mds-reactjs-library`): component-first, Emotion styling, ThemeProvider, design tokens
- **Bootstrap** (McKinsey Bootstrap conventions): migrate toward MDS tokens/components
- **Vanilla CSS/HTML**: establish token imports and build token-driven components

## What you can ask (examples)

- “Design my page for a module catalog landing page.”
- “Add a header + vertical navigation using MDS.”
- “Set up my styles using MDS tokens.”
- “Convert my Bootstrap project to MDS tokens (and then to MDS React components).”
- “I have vanilla CSS—how do I adopt MDS gradually?”
- “Build a bar chart showing monthly revenue with proper MDS colors and labeling.”
- “What chart type should I use for comparing 5 categories over time?”

- "Create a presentation for a client check-in."
- "Build an HTML slide deck with 8 slides."

More examples are in `examples/`.

## When not to use this skill

- Projects that do not use or plan to adopt MDS (e.g., third-party open-source libraries)
- Non-web projects (CLI tools, backend APIs, mobile apps)
- MDS component library development itself (internal MDS team only)

## Guardrails (always enforced)

Before producing any code, read `reference/05-guardrails.md` and enforce every constraint it contains. These guardrails apply regardless of the user's request or the detected stack.

## Workflow (always follow in order)

### Step 0 — Discover and classify the project

Determine the UI stack and readiness by inspecting:

- `package.json` (and workspace package manifests if monorepo)
- CSS entrypoints (e.g. `global.css`, `index.css`, `app.css`)
- Any existing MDS token imports

Classify into one of:

- **mds-react**
- **bootstrap**
- **vanilla**
- **mixed**

Use the decision procedure in `scripts/detect-ui-stack.md` and the detailed heuristics in `reference/10-detection.md`.

### Step 1 — Identify the user intent

Route the request to one primary intent:

1. **Design my page**
2. **Add components**
   - **2a. Use icons** — Any request to add, find, or embed an MDS icon. Consult `reference/27-icons.md` for the full workflow: manifest lookup (search names + tags) → style selection (outline/glyph/colored) → read inline SVG from category source JSON → embed with `currentColor` → sizing → accessibility. Use the sprite method (Method 4) when 6 or more icons are needed on a single page. The library contains 3,092 icons across 33 categories.
3. **Setup my style**
4. **Convert my project**
5. **Create data visualizations** — chart selection, color palettes, labeling, annotations
6. **Create a presentation or slide deck** — HTML slides, client decks, display-oriented content

If multiple intents are present, start with **Setup my style** first (tokens + foundation), then proceed.

For intent 5, consult the dataviz references (`reference/50-*`, `reference/51-*`, `reference/52-*`) for chart type selection, labeling rules, and color palette guidance.

For intent 6, consult `reference/16-presentation-typography.md` for Bower/McKinsey Sans rules, `reference/15-fonts.md` for font loading (CDN + fallbacks), and `reference/05-guardrails.md` and `reference/06-language.md` for always-on constraints.

### Step 2 — Produce MDS-standard guidance

Always prefer, in this order:

1. **MDS tokens** (CSS variables) for color/typography/spacing/elevation
2. **MDS React components** when the project is React-capable (or migrating to React)
3. A **migration path** from Bootstrap/vanilla to MDS (incremental, safe, testable)

### Step 3 — Provide actionable outputs

Use the standard output templates in `reference/90-output-format.md`:

- Detected stack summary
- Recommended MDS-first approach
- Concrete steps (files to add/change, import order)
- Component recommendations (React) or token-driven CSS patterns (vanilla)
- Migration guidance + pitfalls
- Accessibility and responsive notes

**Cross-cutting — Icon integration (all intents):** Before finalizing any output, scan the generated code for Unicode symbols (e.g. `&#8595;`, `→`, `✓`, `▶`), emoji, or third-party icon markup. Replace every instance with an MDS SVG icon from `icons/mds/` using the lookup workflow in `reference/27-icons.md`. This applies regardless of the primary intent — icon compliance is an always-on constraint (guardrail #2).

## Definition of done

A response is considered complete only if it meets all criteria below:

- **Output format contract**: Uses the exact section structure from `reference/90-output-format.md` (all 8 sections, with sections 5-7 included when applicable).
- **Detected stack completeness**:
  - Includes **stack** (`mds-react` | `bootstrap` | `vanilla` | `mixed`)
  - Includes **tokenSetup** (`present` | `missing` | `partial`)
  - Includes **evidence** with **3–10 bullets**
- **Actionability**: “Concrete steps” includes a short checklist with explicit **file paths** to add/edit and **CSS import order** guidance where relevant.
- **MDS-first guidance**: Recommends tokens-first and avoids hard-coded visual values (hex colors, pixel spacing) when tokens exist.
- **Components + tokens**: Names recommended MDS React components (when applicable) and the token categories to use (colors/typography/spacing/elevation + state tokens).
- **Badge completeness** (when applicable): Badges use the full MDS badge component CSS (`reference/26-vanilla-component-patterns.md`) with three required classes — base `.badge` + style `.badge--outlined` or `.badge--filled` + variant. Style choice follows `reference/36-badge-variant-selection.md`.
- **Migration when needed**: If stack is `bootstrap`, `vanilla`, or `mixed`, includes an incremental migration plan and at least 2 pitfalls to avoid.
- **A11y + responsive**: Always includes keyboard/focus-visible guidance and a responsiveness strategy (grid/breakpoints). Mentions reduced motion guidance when proposing animations/transitions.
- **HTML/CSS file separation**: When generating HTML, CSS must ALWAYS be in dedicated external files — NEVER embedded in `<style>` tags or inline `style` attributes. Follow all rules in `reference/25-html-css-best-practices.md`.
- **Dataviz completeness** (when applicable): If the response involves charts or data visualization, references the chart guide (`reference/50-dataviz-chart-guide.md`) for type selection, the color system (`reference/52-dataviz-color-system.md`) for palette choice, and the labeling guide (`reference/51-dataviz-labeling.md`) for annotation standards.
- **Typography enforcement**: Bower font is restricted to display sizes (≥2.75rem) with weights 500 or 700 only. See `reference/16-presentation-typography.md` for full rules. The guardrails in `reference/05-guardrails.md` enforce this automatically.
- **Layout patterns** (when applicable): Dashboard layouts, title sizing, and component spacing follow the patterns in `reference/35-layout-patterns.md`.
- **Table patterns** (when applicable): Tables follow the rules in `reference/37-table-patterns.md` — no flexbox/grid in cells, proper MDS token usage for alignment and borders. All data tables must include resizable column handles (§8). Sorting (§6) and filtering (§7) must be evaluated against the row-count and data-type criteria in §5.5 — the output must include a brief justification for why sort/filter were included or omitted.
- **Icon compliance**: All indicator symbols, arrows, and decorative glyphs use MDS SVGs from `icons/mds/` — no emoji or Unicode symbols (guardrail #2). Inline SVG method (Method 1) used unless 6+ icons trigger the sprite method (Method 4). All icons use `fill="currentColor"` and have proper `aria-hidden` / `aria-label` attributes per `reference/27-icons.md`.

## Bundled MDS CSS (for portability)

This skill includes a copy of the extracted MDS CSS tokens:

- `css/mds/*.css` — all foundation + component token files
- `css/global.css` — imports the token files in the standard order and includes a bridge-layer pattern

Use these files to bootstrap MDS token usage in repos that do not yet have MDS tokens set up.

## Key references

### Core (always relevant)
- **Guardrails**: `reference/05-guardrails.md` (always-on constraints)
- **Language**: `reference/06-language.md` (US English standard, spelling, date/number formats)
- **Detection**: `reference/10-detection.md`
- **Fonts**: `reference/15-fonts.md` (CDN, static fallbacks, font stacks)
- **Presentation typography**: `reference/16-presentation-typography.md` (Bower/McKinsey Sans rules for slides and display text)
- **MDS CSS tokens**: `reference/20-mdss-css.md` (import strategy, bridge layer, component token usage)
- **Spacing tokens**: `reference/21-spacing-tokens.md` (4px base grid scale, icon spacing guidance, import order)
- **Multi-project CSS**: `reference/22-multi-project-css.md` (shared global.css protection, per-project file namespacing)
- **HTML/CSS best practices**: `reference/25-html-css-best-practices.md`
- **Vanilla component patterns**: `reference/26-vanilla-component-patterns.md` (token loading, vanilla HTML/CSS patterns)
- **MDS React guidance**: `reference/30-mdss-react.md` and `reference/31-mdss-react-snippets.md`

### Patterns and components
- **Layout patterns**: `reference/35-layout-patterns.md` (dashboard titles, spacing, tab/button gaps)
- **Badge variants**: `reference/36-badge-variant-selection.md` (outlined vs filled decision logic)
- **Table patterns**: `reference/37-table-patterns.md` (no-flex-in-cells, MDS token usage, sortable/filterable/resizable columns)
- **Icons**: `reference/27-icons.md` (icon catalog, fill vs outline rules, inline SVG vs img, color + a11y)
- **Logo**: `reference/28-logo.md` (official SVG logo files, sizing, colour variants, inline pattern)
- **Favicon**: `reference/29-favicon.md` (official McKinsey favicon, `<head>` link pattern, copy instructions)
- **Bootstrap → MDS mapping**: `reference/40-bootstrap-mapping.md`

### Data visualization
- **Chart guide**: `reference/50-dataviz-chart-guide.md` (chart type selection, per-chart best practices)
- **Labeling**: `reference/51-dataviz-labeling.md` (legends, axes, annotations, icons)
- **Color system**: `reference/52-dataviz-color-system.md` (categorical, linear, diverging palettes)

### Meta
- **Output templates**: `reference/90-output-format.md`

