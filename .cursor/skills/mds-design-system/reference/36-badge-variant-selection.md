# Badge Variant Selection

## Core Rule

Badge style selection depends on whether the badge shares an organizing unit with a button:

- **React path**: use `badgeStyle="outlined"` in rows/units with action buttons, otherwise `badgeStyle="filled"`.
- **Vanilla path**: use CSS classes like `badge--outlined` in rows/units with action buttons, otherwise `badge--filled`.

## Framework Mapping

- **React (`@ui`)**: `<Badge variant="success" badgeStyle="outlined">Active</Badge>`
- **Vanilla (HTML/CSS)**: `<span class="badge badge--success badge--outlined">Active</span>`

## Organizing Units

An organizing unit is a distinct visual container or grouping that holds related elements:

- **Table row**: A single row in a data table
- **Card**: A card component containing related information
- **Dashboard widget**: A panel or widget on a dashboard
- **List item**: An item in a list component
- **Form section**: A section within a form

## Examples

### ✅ Use Outlined Style (Same Organizing Unit)

**React example (table row with badge and action buttons):**
```tsx
<tr>
  <td>Project Alpha</td>
  <td>
    <Badge variant="success" badgeStyle="outlined">Active</Badge>
  </td>
  <td className="table-actions">
    <Button variant="tertiary" size="sm">View</Button>
    <Button variant="tertiary" size="sm">Edit</Button>
  </td>
</tr>
```

**Vanilla equivalent:**
```html
<tr>
  <td>Project Alpha</td>
  <td><span class="badge badge--success badge--outlined">Active</span></td>
  <td class="table-actions">
    <button class="mds-button mds-button--tertiary mds-button--sm">View</button>
    <button class="mds-button mds-button--tertiary mds-button--sm">Edit</button>
  </td>
</tr>
```

**Card with status badge and action button:**
```tsx
<Card>
  <div className="card-header">
    <h3>User Profile</h3>
    <Badge variant="warning" badgeStyle="outlined">Pending</Badge>
  </div>
  <div className="card-body">
    <p>User information...</p>
  </div>
  <div className="card-footer">
    <Button variant="primary">Approve</Button>
  </div>
</Card>
```

**Dashboard widget with badge and controls:**
```tsx
<div className="widget">
  <div className="widget-header">
    <h3>System Status</h3>
    <Badge variant="success" badgeStyle="outlined">Online</Badge>
    <Button variant="tertiary" size="sm">Refresh</Button>
  </div>
  <div className="widget-content">
    {/* widget content */}
  </div>
</div>
```

### ✅ Use Filled Style (Different Organizing Units)

**React example (table row without action buttons):**
```tsx
<tr>
  <td>Project Beta</td>
  <td>
    <Badge variant="success" badgeStyle="filled">Completed</Badge>
  </td>
  <td>2025-02-11</td>
</tr>
```

**Vanilla equivalent:**
```html
<tr>
  <td>Project Beta</td>
  <td><span class="badge badge--success badge--filled">Completed</span></td>
  <td>2025-02-11</td>
</tr>
```

**Status list without action buttons:**
```tsx
<ul className="status-list">
  <li>
    <span>Service A</span>
    <Badge variant="success" badgeStyle="filled">Running</Badge>
  </li>
  <li>
    <span>Service B</span>
    <Badge variant="error" badgeStyle="filled">Stopped</Badge>
  </li>
</ul>
```

**Badge in one card, button in a different card:**
```tsx
<div className="dashboard">
  <Card>
    <h3>Status Overview</h3>
    <Badge variant="success" badgeStyle="filled">All Systems Operational</Badge>
  </Card>

  <Card>
    <h3>Quick Actions</h3>
    <Button variant="primary">Deploy</Button>
  </Card>
</div>
```

## Header Badge Sizing Rule

When a badge appears beside a heading/title, match the badge font-size to the adjacent heading text.

```css
.section-title {
  font-size: var(--mds-font-size-heading-4);
}

.section-header .ui-Badge {
  font-size: var(--mds-font-size-heading-4);
}
```

```css
/* Vanilla equivalent */
.section-header .badge {
  font-size: var(--mds-font-size-heading-4);
}
```

## Decision Flow

When implementing a badge:

1. **Identify the organizing unit** - What container holds this badge? (row, card, widget, etc.)
2. **Check for buttons** - Are there any buttons within the SAME organizing unit?
3. **Select style**:
   - Buttons in same unit → React: `badgeStyle="outlined"` / Vanilla: `badge--outlined`
   - No competing buttons → React: `badgeStyle="filled"` / Vanilla: `badge--filled`
4. **If badge is next to a title**, match badge font-size to that title in scoped CSS

## Common Patterns

### Table Rows
- **With action column**: use outlined style (`badgeStyle="outlined"` or `badge--outlined`)
- **Without action column**: use filled style (`badgeStyle="filled"` or `badge--filled`)

### Cards
- **With card actions**: prefer outlined style when badges compete with actions
- **Without card actions**: use filled style

### Dashboard Widgets
- **With widget controls**: use outlined style
- **Display-only widgets**: use filled style

## Why This Matters

- **Visual Hierarchy**: Outline badges are subtler when competing with buttons for attention
- **Consistency**: Predictable pattern across the application
- **Balance**: Fill badges stand out more in button-free contexts where they're the primary interactive visual element
