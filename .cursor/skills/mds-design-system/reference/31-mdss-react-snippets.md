## MDS React snippets (curated patterns)

These snippets are intentionally minimal and focus on consistent patterns.

### App root: ThemeProvider wrapper (pattern)

```tsx
import React from 'react';
import { ThemeProvider } from '@mds/mds-reactjs-library';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
```

### Buttons (pattern)

```tsx
import { Button } from '@mds/mds-reactjs-library';

export function Actions() {
  return (
    <div className="button-group">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
    </div>
  );
}
```

```css
/* In your component or layout CSS file */
.button-group {
  display: flex;
  gap: var(--mds-spacing-3);
}
```

### Form field (pattern)

```tsx
import { Input } from '@mds/mds-reactjs-library';

export function SearchField() {
  return <Input label="Search" placeholder="Search…" />;
}
```

### Layout styling using tokens (pattern)

```css
.page {
  background: var(--mds-color-background-subtle);
  color: var(--mds-color-text-default);
}

.cardGrid {
  display: grid;
  gap: var(--mds-card-gap);
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}
```

### Notes

- Component APIs may vary by version; prefer using the component props and patterns already present in the repo.
- Keep app-specific layout CSS separate from token definitions.

