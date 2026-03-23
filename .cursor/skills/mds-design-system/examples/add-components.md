## Example: Add components

### Prompt

Add components:
- Add an MDS header and vertical navigation
- Needs accessible focus states and mobile collapse behavior

### What the skill should do

1. Detect stack and token setup.
2. If MDS React is available:
   - Recommend `Header` + `VerticalNavigation` components
   - Provide setup guidance (ThemeProvider) if missing
3. If not React:
   - Provide token-driven HTML/CSS structure with recommended tokens and states
4. **Important**: Never use raw HTML controls (`<button>`, `<input>`, etc.) in app code — use MDS components or the project's component library.

