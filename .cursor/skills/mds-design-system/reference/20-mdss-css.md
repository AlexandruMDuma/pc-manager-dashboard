## MDS CSS tokens — standard setup

This doc describes the recommended way to use the extracted MDS CSS token files.

### Goals

- Provide **one token source of truth** (CSS variables).
- Ensure **stable import order** (foundations before components).
- Enable incremental adoption via a **bridge layer** if you already have existing variables.

### What's included in this skill

- `css/mds/*.css`: foundation + component token files
- `css/global.css`: imports `css/mds/*.css` in the recommended order and provides an optional bridge layer

### Recommended import strategy

#### Option A — Use the skill's `css/global.css` directly (preferred)

Import `css/global.css` from your app's global stylesheet entrypoint.

Rules:
- Import once, globally (avoid importing it in multiple component scopes).
- Do not override token values in scattered files; if overrides are needed, centralize them.

#### Option B — Import token files individually

If you cannot import `css/global.css`, mimic its import order:

1. Foundations: `colors.css`, `typography.css`, `elevation.css`, `spacing.css`, `grid.css`
2. Component tokens (as needed)
3. Your app styles

### Bridge layer pattern (incremental adoption)

If your app already uses variables like `--bg`, `--text`, etc., define a small mapping layer:

- Keep the existing app variables stable.
- Map them to MDS variables (e.g., `--bg: var(--mds-color-background-subtle)`).
- Migrate usage gradually to `--mds-*` variables directly.

The skill's `css/global.css` includes a starter bridge layer you can adapt.

### Do's and don'ts

- **Do**: prefer `var(--mds-...)` tokens instead of hard-coded values.
- **Do**: use component tokens like `--mds-button-*` for stateful UI.
- **Do**: keep all overrides in one place (one file) if needed.
- **Do**: always put CSS in dedicated external files (never inline or embedded in HTML).
- **Don't**: redefine foundation tokens in many files.
- **Don't**: mix multiple competing token systems (Bootstrap variables + MDS variables) without a deliberate mapping layer.
- **Don't**: use `<style>` tags embedded in HTML files.
- **Don't**: use inline `style` attributes on HTML elements.

### Component-specific token usage

Some MDS components have dedicated token sets. Always prefer these over generic foundation tokens.

#### Tabs

Use `--mds-tabs-*` tokens when styling tabs or tab navigation:

- Typography: `--mds-tabs-font-*`
- Colors: `--mds-tabs-text-*`, `--mds-tabs-background-*`
- Spacing: `--mds-tabs-padding-*`, `--mds-tabs-gap`
- Indicator: `--mds-tabs-indicator-*`
- Transition: `--mds-tabs-transition-*`

Do not use hard-coded values or generic color/spacing tokens when tab tokens exist.

#### Progress bars

Use `--mds-progress-bar-*` tokens:

- Heights: `--mds-progress-bar-height-2px|4px|8px`
- Track: `--mds-progress-bar-track`
- Fill: `--mds-progress-bar-fill`
- Label text: `--mds-progress-bar-text`, `--mds-progress-bar-text-muted`
- Gap: `--mds-progress-bar-gap`

Critical: progress bars have no border-radius token. Use square/flat corners.

```css
.progress-bar {
  height: var(--mds-progress-bar-height-4px);
  background: var(--mds-progress-bar-track);
  overflow: hidden;
}

.progress-fill {
  background: var(--mds-progress-bar-fill);
}
```

#### Component token checklist

- [ ] Tabs use only `--mds-tabs-*` tokens where available
- [ ] Progress bars use `--mds-progress-bar-*` tokens
- [ ] No hard-coded indicator, spacing, or bar sizes
- [ ] No border-radius on progress bars

### Accessibility considerations

- Ensure focus-visible styles always remain visible; do not remove outlines.
- If you apply custom focus styling, use a token-driven approach and keep contrast high.
- Respect reduced motion (avoid aggressive transitions).
