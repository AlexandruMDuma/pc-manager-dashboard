## Script: Detect UI stack (procedure)

Use this as a deterministic “script” (even if executed manually) to classify the repo.

### Inputs to read

- `package.json` at repo root
- If monorepo: workspace `package.json` files under common package paths
- CSS entrypoints (best-effort):
  - `src/styles/global.css`
  - `src/global.css`
  - `styles/globals.css`
  - `app/globals.css`
  - Framework entrypoints (`src/main.tsx`, `src/index.tsx`, `app/layout.tsx`)

### Decision tree

1. **React?**
   - If `react` and `react-dom` deps exist → React = yes
2. **MDS React?**
   - If `@mds/mds-reactjs-library` dep exists → `stack = mds-react`
3. **Bootstrap?**
   - If `bootstrap` dep exists OR bootstrap class conventions appear broadly OR McKinsey bootstrap CSS is referenced → Bootstrap = yes
   - If Bootstrap yes and MDS React yes → `stack = mixed`
   - If Bootstrap yes and MDS React no → `stack = bootstrap`
4. **Vanilla**
   - If React no and Bootstrap no → `stack = vanilla`
5. **Token setup**
   - If any loaded stylesheet contains `--mds-` variables OR imports MDS token files → tokenSetup = present/partial
   - Else tokenSetup = missing

### Required output

Report:

- stack
- tokenSetup
- entrypoints
- evidence

Then proceed to the 5 intent playbooks in the main skill (`SKILL.md`).

