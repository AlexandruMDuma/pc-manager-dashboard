## MDS React — standard usage

This doc describes the recommended, “standard approach” usage for MDS React projects.

### Detection

If `package.json` includes `@mds/mds-reactjs-library`, treat the repo as **mds-react** (unless Bootstrap is also widely used → **mixed**).

### Principles

- Prefer **MDS React components** over custom implementations for:
  - Forms (inputs/selects/date pickers)
  - Navigation (header/vertical navigation/breadcrumbs)
  - Feedback (alerts/toasts/loading/progress)
- Prefer **token-driven styling** for layout and small adjustments.
- Avoid hard-coded CSS values; use token variables where possible.

### ThemeProvider (high-level guidance)

Most MDS React setups rely on a theme provider at the application root.

Standard setup expectations:
- Wrap your app with the MDS `ThemeProvider`.
- Keep theming configuration centralized.
- Avoid per-component theme overrides.

See `reference/31-mdss-react-snippets.md` for example patterns.

### Styling approach

Use the MDS React component API first, then:

- Add spacing/layout with your own CSS (modules or global), referencing tokens: `var(--mds-...)`.
- If your stack uses Emotion (common in MDS React ecosystems), prefer component props and theme tokens over raw CSS overrides.

### Migration guidance (mixed Bootstrap + React)

If the repo is React + Bootstrap:

1. Introduce MDS tokens globally (colors/typography/elevation).
2. Map existing Bootstrap theme variables to MDS tokens (bridge layer).
3. Migrate UI “hot spots” first (buttons, forms, navigation).
4. Replace remaining Bootstrap components with MDS React equivalents.

### Component library enforcement

**Never use raw HTML controls** (`<button>`, `<input>`, `<select>`, `<textarea>`) in app code. Always use MDS React components or the project's component library facade.

If a needed component doesn't exist in the library, create a thin wrapper and import it through the facade — never use raw controls directly in app code.

### Common pitfalls

- Using raw HTML controls instead of MDS React components.
- Mixing two component systems without a plan (inconsistent states/focus behavior).
- Overriding component internals via brittle selectors.
- Importing token CSS multiple times, leading to unclear precedence.

