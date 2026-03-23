## Example: Convert my project

### Prompt

Convert my project:
- Current: Bootstrap-based app
- Goal: migrate to MDS tokens first, then migrate components to MDS React where possible
- Constraint: do it incrementally (no big rewrite)

### What the skill should do

1. Detect stack and token setup.
2. Propose migration phases:
   - Phase 1: introduce MDS tokens (colors/typography/elevation) and map existing variables
   - Phase 2: replace Bootstrap theming (palette/typography/buttons/forms) with MDS tokens
   - Phase 3: replace Bootstrap components with MDS components (or token-driven equivalents)
3. Include pitfalls:
   - Avoid mixing two competing variable systems
   - Avoid “partial overrides” that regress accessibility

