## MDS Spacing Tokens — Foundation Reference

### Background

The MDS `grid.css` token file contains only breakpoints and column configurations — it does **not** define a spacing scale. Without a dedicated `spacing.css` file, any reference to `--mds-spacing-*` tokens silently resolves to nothing, collapsing all gaps, padding, and margins to zero.

This is especially dangerous because it produces no errors — the layout simply renders with missing whitespace, which is easy to overlook until icons, text, and interactive elements appear visually crammed together.

### Token file

`css/mds/spacing.css` defines the full spacing scale on a **4px base grid**:

| Token | Value | Pixels |
|---|---|---|
| `--mds-spacing-0` | `0` | 0 |
| `--mds-spacing-0-5` | `0.125rem` | 2 |
| `--mds-spacing-1` | `0.25rem` | 4 |
| `--mds-spacing-1-5` | `0.375rem` | 6 |
| `--mds-spacing-2` | `0.5rem` | 8 |
| `--mds-spacing-2-5` | `0.625rem` | 10 |
| `--mds-spacing-3` | `0.75rem` | 12 |
| `--mds-spacing-3-5` | `0.875rem` | 14 |
| `--mds-spacing-4` | `1rem` | 16 |
| `--mds-spacing-5` | `1.25rem` | 20 |
| `--mds-spacing-6` | `1.5rem` | 24 |
| `--mds-spacing-7` | `1.75rem` | 28 |
| `--mds-spacing-8` | `2rem` | 32 |
| `--mds-spacing-9` | `2.25rem` | 36 |
| `--mds-spacing-10` | `2.5rem` | 40 |
| `--mds-spacing-12` | `3rem` | 48 |
| `--mds-spacing-14` | `3.5rem` | 56 |
| `--mds-spacing-16` | `4rem` | 64 |
| `--mds-spacing-20` | `5rem` | 80 |
| `--mds-spacing-24` | `6rem` | 96 |
| `--mds-spacing-32` | `8rem` | 128 |

### Import order

`spacing.css` is a **foundation** token file. It must be imported alongside the other foundations, before any component tokens:

```css
/* Foundations */
@import './mds/colors.css';
@import './mds/typography.css';
@import './mds/elevation.css';
@import './mds/spacing.css';   /* ← required */
@import './mds/grid.css';

/* Component tokens (as needed) */
@import './mds/button.css';
/* ... */
```

### Icon spacing guidance

When placing icons adjacent to text (nav items, dropdown menu items, button labels, list items), always account for the additional visual footprint of the icon by using an appropriate `gap` token:

| Context | Recommended gap | Token |
|---|---|---|
| Sub-navigation (icon + label) | 8px | `--mds-spacing-2` |
| Dropdown menu items (icon + label) | 12px | `--mds-spacing-3` |
| Utility bar (between icon buttons) | 12px | `--mds-spacing-3` |
| Button (icon + text) | 8px | `--mds-spacing-2` |
| Inline badge (icon + text) | Uses `--mds-badge-size-sm-gap` | (component token) |

Without explicit icon-aware spacing, icons crowd against text and adjacent controls. The default `gap: 0` from unresolved tokens makes this worse.

### Common pitfall

If you see icons pressed against text or nav items with no padding, check two things:

1. Is `spacing.css` imported in `global.css`?
2. Are `--mds-spacing-*` tokens actually resolving? (Inspect in DevTools — unresolved custom properties show as empty.)
