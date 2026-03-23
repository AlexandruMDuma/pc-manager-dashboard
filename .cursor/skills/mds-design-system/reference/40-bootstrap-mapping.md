## Bootstrap → MDS mapping (incremental)

This doc provides practical guidance to migrate Bootstrap-styled UIs toward MDS standards.

### Principles

- Start with **tokens** (colors/typography/elevation) before swapping components.
- Use a **bridge layer** so existing CSS continues to work while you migrate.
- Replace components gradually, prioritizing high-traffic screens and form-heavy flows.

### Common class mapping (examples)

These are intentionally high-level mappings. Prefer MDS React components if React is available.

#### Layout

- **Bootstrap**: `container`, `container-fluid`
  - **MDS**: use your framework layout + MDS grid tokens (`--mds-grid-*`)
- **Bootstrap**: `row`, `col-*`
  - **MDS**: CSS grid/flex with spacing mapped to tokens

#### Buttons

- **Bootstrap**: `btn btn-primary`
  - **MDS**: MDS button tokens (`--mds-button-primary-*`) or MDS React `Button variant="primary"`
- **Bootstrap**: `btn btn-secondary`
  - **MDS**: token set `--mds-button-secondary-*` or `variant="secondary"`
- **Bootstrap**: `btn btn-link`
  - **MDS**: link tokens or MDS React Link component (if used in your stack)

#### Forms

- **Bootstrap**: `form-control`
  - **MDS**: input tokens (`--mds-input-*`) / `Input` component
- **Bootstrap**: `form-select`
  - **MDS**: select tokens (`--mds-select-*`) / `Select` component
- **Bootstrap**: validation states (`is-invalid`, `is-valid`)
  - **MDS**: rely on component state props (React) or token-driven error styles

#### Feedback

- **Bootstrap**: `alert alert-*`
  - **MDS**: alert tokens (`--mds-alert-*`) / `Alert` component
- **Bootstrap**: `spinner-border`
  - **MDS**: loading tokens (`--mds-loading-*`) / `Loading` component (if available)

### Bridge layer example (token-first migration)

Create a small mapping file (imported after MDS foundations) that rebinds your legacy variables:

- Map your old `--primary` / `--secondary` to MDS brand tokens
- Map text and background variables to semantic MDS tokens

Keep this mapping centralized and temporary.

### Suggested migration phases

1. **Phase 1: Token setup**
   - Import MDS foundations (`colors`, `typography`, `elevation`, `grid`)
   - Add bridge layer mapping for existing variables
2. **Phase 2: Critical interactive components**
   - Buttons, inputs, selects, checkboxes, radios
   - Ensure focus-visible behavior matches accessibility requirements
3. **Phase 3: Navigation + feedback**
   - Header, vertical navigation, breadcrumbs
   - Alerts, toasts, loading, modals
4. **Phase 4: Remove Bootstrap**
   - Remove Bootstrap CSS imports
   - Delete bridge layer once all usage is migrated

### Pitfalls to avoid

- Mixing Bootstrap’s resets with token CSS in unpredictable order.
- Partial migrations that regress keyboard focus visibility.
- Excessive CSS overrides that fight component token intent.

