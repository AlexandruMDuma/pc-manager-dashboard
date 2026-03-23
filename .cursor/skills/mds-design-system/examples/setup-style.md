## Example: Setup my style

### Prompt

Setup my style:
- Stack: React + Vite
- Current styling: CSS modules
- Goal: use MDS tokens and keep styles scoped

### What the skill should do

1. Detect stack and token setup.
2. Recommend the setup approach:
   - Use MDS tokens globally (import token CSS)
   - Use scoped CSS modules for layout/component rules, but reference tokens via `var(--mds-...)`
3. Provide a minimal file layout and import wiring.

