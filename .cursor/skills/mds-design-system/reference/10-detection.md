## Detection — classify the UI stack

This skill must **always** classify the target repo before giving design guidance.

### Output (required)

Return a short classification block:

- **stack**: `mds-react` | `bootstrap` | `vanilla` | `mixed`
- **tokenSetup**: `present` | `missing` | `partial`
- **entrypoints**: list of discovered CSS/JS entry files
- **evidence**: 3–10 bullet points with the detection signals

### Signals to check (ordered)

#### 1) Is this React?

Strong signals:
- `package.json` dependencies include `react` and `react-dom`
- Presence of `src/main.tsx`, `src/index.tsx`, `pages/_app.tsx`, `app/layout.tsx`

#### 2) Is this using MDS React?

Strong signals:
- `package.json` has dependency `@mds/mds-reactjs-library`
- Imports like:
  - `import { ThemeProvider, Button } from '@mds/mds-reactjs-library'`

If yes: `stack = mds-react` (unless Bootstrap is also deeply used → `mixed`)

#### 3) Is this using Bootstrap?

Strong signals:
- `package.json` has `bootstrap` dependency, or a stylesheet import referencing bootstrap
- Markup uses bootstrap-style class conventions (`container`, `row`, `col-*`, `btn`, `btn-primary`, `navbar`, etc.)
- References to the McKinsey Bootstrap CSS (direct link, or vendored file)

If yes and not MDS React: `stack = bootstrap`

#### 4) Is this vanilla CSS/HTML?

Signals:
- No React dependency
- No Bootstrap dependency
- Styling via `.css` files and custom classes

If yes: `stack = vanilla`

#### 5) Is it mixed?

Mixed is common. Mark as `mixed` when:
- React is present, but no `@mds/*` library, and Bootstrap classes/imports exist, OR
- MDS React is present, but Bootstrap is also present and widely used

### Detect token setup

Token setup is “present” if:
- A global stylesheet imports MDS token CSS files, OR
- You find `--mds-` CSS variables in a loaded stylesheet

Token setup is “partial” if:
- Some MDS variables are present but foundation imports are missing, OR
- There is a legacy variable layer but no MDS token imports

Token setup is “missing” if:
- No `--mds-` variables and no imports of MDS tokens

### Common entrypoints to scan

- CSS: `src/styles/global.css`, `src/styles/index.css`, `src/global.css`, `styles/globals.css`
- JS/TS: `src/main.tsx`, `src/index.tsx`, `app/layout.tsx`
- Frameworks:
  - Next.js: `app/layout.tsx`, `pages/_app.tsx`
  - Vite: `src/main.tsx`
  - Astro: `src/pages/*.astro` imports `../styles/global.css`

#### 6) Is this Vue, Angular, Svelte, or another framework?

Signals:
- `package.json` has `vue`, `@angular/core`, `svelte`, or similar framework dependencies
- Component files use `.vue`, `.svelte`, or Angular-style `.component.ts` patterns

If yes and no React: classify as `vanilla` for MDS purposes. MDS React components are not available for these frameworks, but MDS tokens (CSS variables) work everywhere. Use the token-first approach from `20-mdss-css.md` and vanilla patterns from `26-vanilla-component-patterns.md`.

#### 7) Is this a monorepo?

Signals:
- Workspace configuration in `package.json` (`workspaces` field)
- Presence of `lerna.json`, `pnpm-workspace.yaml`, or `nx.json`
- Multiple `package.json` files in subdirectories

If yes: scan each workspace package separately. Different packages may have different stacks. Report per-package classification and recommend a shared token foundation imported across packages.

### When no MDS component library is found

If detection finds no `@mds/mds-reactjs-library`, no `@ui` alias, no `src/ui/` or `src/components/ui/` directory, and no MDS-styled CSS component classes:

- **React projects**: Create a thin wrapper directory (e.g. `src/ui/`) that exports MDS-styled components. Raw interactive controls (`<button>`, `<input>`, `<select>`, `<textarea>`) are only acceptable **inside** this wrapper directory — never in application code.
- **Vanilla projects**: Create CSS component classes backed by MDS tokens (see `26-vanilla-component-patterns.md`). Raw HTML elements are acceptable when styled with MDS token classes.

In **all cases**, app-level code must never introduce unstyled raw controls. If a wrapper does not exist, create one before writing feature code.

### Notes

- Detection is heuristic; always show evidence signals.
- If uncertain, choose `mixed` and proceed with **Setup my style** first.
- For non-React frameworks (Vue, Angular, Svelte): MDS tokens work via CSS variables, but MDS React components do not. Use the vanilla/token approach.

