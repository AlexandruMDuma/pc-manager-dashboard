## Multi-Project CSS — Shared Token Protection

When multiple projects coexist in the same workspace and share `css/global.css` as the MDS token entrypoint, follow these rules to prevent one project from breaking another.

### Rule 1: Never overwrite `css/global.css`

`css/global.css` imports all MDS foundation and component token files. Every page in the workspace depends on it.

- **Append only** — add new `@import` lines if a new component token is needed.
- **Never remove** existing `@import` lines — other projects may depend on them.
- **Never replace** the file contents wholesale.

Unused token imports have zero runtime cost — they only define CSS custom properties.

```css
/* ✅ GOOD — append a missing import */
@import './mds/date-picker.css';  /* added for new project */

/* ❌ BAD — rewrite the file with only what your project needs */
@import './mds/colors.css';
@import './mds/typography.css';
/* (everything else deleted) */
```

### Rule 2: Namespace all project-specific files

Every project must prefix its files with a unique project slug to avoid collisions.

| File type | Pattern | Example |
|-----------|---------|---------|
| HTML | `<slug>.html` | `staffing-request.html` |
| Layout CSS | `css/<slug>-layout.css` | `css/staffing-layout.css` |
| Component CSS | `css/<slug>-components.css` | `css/staffing-components.css` |
| JavaScript | `js/<slug>.js` | `js/staffing.js` |

**Forbidden generic names** (will collide):

- `index.html`
- `css/layout.css`, `css/components.css`, `css/styles.css`
- `js/main.js`, `js/app.js`

### Rule 3: Pre-edit check

Before editing any CSS file:

1. Is it `css/global.css`? → append only, never replace.
2. Does the filename start with the current project's slug? → safe to edit.
3. Does it belong to a different project? → do not edit.

### What went wrong (cautionary example)

Project A created `css/global.css` with all 41 MDS token imports. Project B later replaced `css/global.css` with only 5 foundation imports. Project A's form lost all component tokens (button, input, select, card, toggle, progress-bar, textarea) and rendered without styling.

Fix: restore the full import list and namespace project-specific files.
