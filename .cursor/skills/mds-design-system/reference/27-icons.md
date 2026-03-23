# MDS Icon Library

## Manifest

The machine-readable icon catalog lives at:

```
.cursor/skills/mds-design-system/icons/mds/_manifest.json
```

The manifest indexes **3,092 icons** across 3 styles (glyph, outline, colored) and 6 sizes (12, 16, 24, 32, 48, 64 px). Each icon entry includes searchable tags and a category mapping to a source JSON file that contains the inline SVG content.

The inline SVG source files live at:

```
.cursor/skills/mds-design-system/icons/mds/categories/<category>.json
```

---

## Manifest Structure

The manifest is a lightweight index. Each icon entry contains:

- **`tags`** — an array of searchable keywords (e.g. `["arrow", "down", "dropdown", "caret"]`)
- **`category`** — the primary category file name (e.g. `"arrows"` → `categories/arrows.json`)
- **`categories`** — (optional) array of all category files containing this icon, when it appears in more than one
- **`styles`** — object mapping each available style to its array of sizes

```json
{
  "warning": {
    "tags": ["alert", "attention", "caution", "danger", "error"],
    "category": "user-interface",
    "styles": {
      "glyph": [16, 24, 32, 48, 64],
      "outline": [16, 24, 32, 48, 64],
      "colored": [48]
    }
  }
}
```

Top-level fields: `cdn_base` (CDN fallback URL prefix), `source_dir` (`categories/`), `total_icons`, `styles`, `sizes`.

---

## Styles

Each icon may be available in up to three visual styles:

| Style | Description | When to use |
|---|---|---|
| **outline** | Stroke-based, open paths | Default for UI — lighter visual weight, pairs well with text |
| **glyph** | Solid filled shapes | Emphasis, active states, or when outline lacks contrast |
| **colored** | Multi-color fills (often 48px only) | Decorative or illustrative contexts, not for functional UI |

**Default: use `outline` style** unless the context specifically calls for glyph or colored.

---

## Available Sizes

Icons are available in **12, 16, 24, 32, 48, and 64 px**. Not every icon has every size — check the icon's `styles` object in the manifest for available sizes per style.

**Default size is 24px** unless the context specifically calls for a smaller (12, 16) or larger (32, 48, 64) variant.

---

## Finding the Right Icon (AI Workflow)

When a user requests an icon by semantic intent (e.g. "add a delete button icon", "show a warning indicator"):

1. **Read the manifest** — Open `icons/mds/_manifest.json`. Each entry is keyed by icon name.

2. **Match intent to name** — Search icon names and `tags` arrays for the best semantic match. Tags enable fuzzy matching (e.g. searching "cart" finds `shopping-cart` via its tags `["bag", "basket", "buy", "cart", "checkout"]`).

3. **Choose style and size** — Default to `outline` style at `24px`. Use `glyph` for emphasis or active states. **The size you choose must equal the CSS render size** — if the icon will display at 16px in a nav bar, pull the 16px variant, not the 24px variant scaled down (see "Match viewBox to CSS render size" below). Confirm the desired style+size exists in the icon's `styles` object.

4. **Read the SVG content** — Open the category source file at `icons/mds/categories/<category>.json`. Find the entry matching `name`, `style`, and `width`. The `content` field contains the complete inline SVG.

5. **Embed the icon** — Paste the SVG into the HTML with proper attributes (see Embedding Icons below).

**Example lookup:**

```
User wants: "a warning icon"
→ Read _manifest.json → find "warning"
→ tags: ["alert", "attention", "caution", "danger", "error"]
→ category: "user-interface"
→ styles: { outline: [16, 24, 32, 48, 64], glyph: [...], colored: [48] }
→ Choose outline at 24px
→ Open categories/user-interface.json
→ Find entry where name="warning", style="outline", width=24
→ Extract content field → embed inline SVG
```

---

## Categories

Icons are organized into 33 category files:

| Category | File |
|---|---|
| Accessibility | `accessibility.json` |
| Animals & Nature | `animals-nature.json` |
| Animated Loops | `animated-loops.json` |
| Arrows | `arrows.json` |
| Business & Finance | `business-finance.json` |
| Clothes & Accessories | `clothes-accessories.json` |
| Design & Development | `design-development.json` |
| Emoticons | `emoticons.json` |
| Energy & Environment | `energy-environment.json` |
| Entertainment | `entertainment.json` |
| Files & Folder | `files-folder.json` |
| Flags | `flags.json` |
| Food | `food.json` |
| Healthcare & Medical | `healthcare-medical.json` |
| Holidays | `holidays.json` |
| Home & Buildings | `home-buildings.json` |
| Interactive Icons | `interactive-icons.json` |
| Loaders | `loaders.json` |
| Maps & Location | `maps-location.json` |
| Multimedia | `multimedia.json` |
| Real Estate | `real-estate.json` |
| School & Education | `school-education.json` |
| Shopping | `shopping.json` |
| Social Media | `social-media.json` |
| Sport | `sport.json` |
| Technology | `technology.json` |
| Text Editing | `text-editing.json` |
| Touch Gesture | `touch-gesture.json` |
| Transportation | `transportation.json` |
| Travel | `travel.json` |
| User Interface | `user-interface.json` |
| Users | `users.json` |
| Weather | `weather.json` |

---

## Category Source File Format

Each category JSON contains an `icons` array. Every entry has:

| Field | Type | Description |
|---|---|---|
| `name` | string | Icon name (e.g. `"shopping-cart"`) |
| `style` | string | `"outline"`, `"glyph"`, or `"colored"` |
| `width` | number | Pixel size (12, 16, 24, 32, 48, or 64) |
| `height` | number | Same as width |
| `tags` | string | Comma-separated keywords |
| `content` | string | Complete inline `<svg>` element |
| `set_id` | number | Internal set identifier |

```json
{
  "icons": [
    {
      "style": "outline",
      "width": 24,
      "height": 24,
      "tags": "alert,attention,caution,danger,error",
      "name": "warning",
      "content": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\">...</svg>",
      "set_id": 1
    }
  ]
}
```

---

## Common Icon Quick-Reference

High-frequency icons for typical UI patterns:

| Intent | Icon name | Category |
|---|---|---|
| Close / dismiss | `c-remove` | user-interface |
| Confirm / success | `check` | user-interface |
| Delete / remove | `delete` | user-interface |
| Warning / caution | `warning` | user-interface |
| Info | `c-info` | user-interface |
| Question / help | `c-question` | user-interface |
| Search | `zoom` | user-interface |
| Settings / gear | `preferences` | user-interface |
| Home | `home` | real-estate |
| Menu / hamburger | `menu` | user-interface |
| Add / plus | `add` | user-interface |
| Edit / pencil | `pen` | design-development |
| Download | `download` | arrows |
| Upload | `upload` | arrows |
| Refresh | `refresh` | arrows |
| Arrow down | `arrow-down` | arrows |
| Arrow left | `arrow-left` | arrows |
| Arrow right | `arrow-right` | arrows |
| Arrow up | `arrow-up` | arrows |
| Star / favorite | `star` | user-interface |
| Bookmark | `bookmark` | user-interface |
| Calendar | `calendar` | user-interface |
| Clock / time | `clock` | user-interface |
| Lock / secure | `lock` | user-interface |
| Unlock | `unlock` | user-interface |
| Email / mail | `email` | social-media |
| Phone / call | `contacts` | social-media |
| Shopping cart | `shopping-cart` | shopping |
| Filter | `filter` | user-interface |
| Sort | `i-sorting` | user-interface |
| Notification / bell | `notification` | user-interface |
| Trash / delete | `trash` | user-interface |
| Link | `link` | user-interface |
| Image / photo | `image` | multimedia |
| Camera | `camera` | multimedia |
| Video | `video-camera` | multimedia |
| Microphone | `microphone` | multimedia |
| Play | `btn-play` | multimedia |
| Pause | `btn-pause` | multimedia |
| Map / pin | `pin` | maps-location |
| Globe / world | `globe` | maps-location |
| Folder | `archive` | files-folder |
| File / document | `file` | files-folder |
| Cloud | `cloud` | weather |
| Printer | `print` | technology |
| Chart / graph | `chart` | business-finance |

**Form validation mapping:**

| State | Icon | Why |
|---|---|---|
| Field error / required | `c-remove` | Clear error indicator |
| Warning / advisory | `warning` | Standard caution signal |
| Success / confirmed | `check` | Confirmation indicator |
| Hint / info | `c-info` | Neutral informational |

---

## Embedding Icons

### Method 1: Inline SVG from Source (recommended)

Read the SVG content directly from the category JSON file and embed it. This gives full CSS color control via `currentColor` with no network dependency.

**Steps:**

1. Look up the icon in `_manifest.json` to get the `category` and confirm style/size availability.
2. Open `icons/mds/categories/<category>.json`.
3. Find the entry matching `name`, `style`, and `width`.
4. Copy the `content` field value — this is the complete `<svg>` element.
5. On the root `<svg>` element:
   - Add `class="mds-icon"`
   - Add `aria-hidden="true"` (decorative) **or** `role="img" aria-label="…"` (standalone)
   - Add `focusable="false"`
   - Keep `width`, `height`, and `viewBox` from the source
   - Replace any hardcoded `fill` colors with `fill="currentColor"` for CSS color control

```html
<svg class="mds-icon" aria-hidden="true" focusable="false"
     width="24" height="24" viewBox="0 0 24 24"
     xmlns="http://www.w3.org/2000/svg">
  <path d="M..." fill="currentColor"/>
</svg>
```

**Use inline SVG when:**
- You need to control color via CSS tokens
- The icon changes color on hover/focus/active state
- The icon is inside a button or link that changes color state

### Method 2: CDN `<img>` tag (fallback)

The CDN base URL `https://cdn.mckinsey.com/libraries/icons/MDSIcons/svg/` is preserved in the manifest for legacy compatibility. CDN filenames follow the pattern `glyph-{size}-{name}.svg`.

```html
<img src="https://cdn.mckinsey.com/libraries/icons/MDSIcons/svg/glyph-24-check.svg"
     alt="" aria-hidden="true" width="24" height="24">
```

**Use `<img>` when:**
- The icon is always the same color (no state changes)
- Simplicity is more important than color flexibility
- The page needs minimal markup

### Method 3: CSS mask (for color-controlled image-like usage)

When you want simplicity like `<img>` but still need CSS color control:

```html
<span class="mds-icon mds-icon--check" aria-hidden="true"></span>
```

```css
.mds-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-color: currentColor;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  mask-size: contain;
}

.mds-icon--check {
  -webkit-mask-image: url('https://cdn.mckinsey.com/libraries/icons/MDSIcons/svg/glyph-24-check.svg');
  mask-image: url('https://cdn.mckinsey.com/libraries/icons/MDSIcons/svg/glyph-24-check.svg');
}
```

### Method 4: SVG Sprite Sheet

For pages that use **6 or more icons**, an inline sprite reduces repeated SVG markup. Extract the inner elements from each icon's `content` and wrap them in `<symbol>` tags inside a hidden `<svg>`.

**Important**: Every `<symbol>` in the sprite and every `<svg>` using it must share the **same** `viewBox` dimensions that match the CSS render size. If the nav bar renders icons at 16px, pull all icons from the 16px MDS variants so every symbol has `viewBox="0 0 16 16"`. Mixing viewBox sizes within a sprite sheet, or mismatching the viewBox with the CSS display size, causes jagged rendering.

**Setup — place once near the top of `<body>`:**

```html
<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
  <symbol id="icon-c-remove" viewBox="0 0 16 16">
    <path d="M..." fill="currentColor"/>
  </symbol>
  <symbol id="icon-check" viewBox="0 0 16 16">
    <path d="M..." fill="currentColor"/>
  </symbol>
</svg>
```

**Usage:**

```html
<button class="mds-button mds-button--ghost" aria-label="Close">
  <svg class="mds-icon mds-icon--sm" aria-hidden="true" focusable="false" width="16" height="16">
    <use href="#icon-c-remove"/>
  </svg>
</button>
```

---

## Color Control

All icons should use `fill="currentColor"`. Set color via the CSS `color` property using MDS tokens:

```css
.mds-icon { color: var(--mds-color-deep-blue-900); }
.mds-icon--action { color: var(--mds-color-electric-blue-500); }
.mds-icon--success { color: var(--mds-color-green-600); }
.mds-icon--warning { color: var(--mds-color-yellow-600); }
.mds-icon--error { color: var(--mds-color-red-600); }
.mds-icon--muted { color: var(--mds-color-neutral-60); }
```

---

## Accessibility

**Decorative icons** (paired with visible label text) — hide from screen readers:

```html
<button class="mds-button mds-button--primary">
  <svg class="mds-icon" aria-hidden="true" focusable="false">...</svg>
  Save
</button>
```

**Standalone icons** (no visible label) — must have an accessible label:

```html
<svg class="mds-icon" role="img" aria-label="Close dialog" focusable="false">...</svg>

<button class="mds-button" aria-label="Close">
  <svg class="mds-icon" aria-hidden="true" focusable="false">...</svg>
</button>
```

Always add `focusable="false"` to prevent IE/Edge from focusing the SVG element itself.

---

## Base Icon CSS

Add this once in your component or global stylesheet:

```css
.mds-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  vertical-align: middle;
  color: inherit;
}
```

---

## Sizing

Override `width` and `height` via CSS to match the icon size:

```css
.mds-icon--xs { width: 12px; height: 12px; }
.mds-icon--sm { width: 16px; height: 16px; }
.mds-icon--md { width: 24px; height: 24px; } /* default */
.mds-icon--lg { width: 32px; height: 32px; }
.mds-icon--xl { width: 48px; height: 48px; }
.mds-icon--xxl { width: 64px; height: 64px; }
```

### Critical: Match viewBox to CSS render size

**Always use the MDS icon variant whose `viewBox` matches the intended CSS display size.** The CSS `width`/`height` on the `<svg>` element must equal the `viewBox` dimensions from the source icon. For a 16px icon, pull the 16px variant (`viewBox="0 0 16 16"`); for 24px, pull the 24px variant, and so on.

**Never downscale a larger viewBox via CSS** (e.g. rendering a `viewBox="0 0 24 24"` icon at `width: 16px`). This causes **jagged, distorted icons** because:

1. **Sub-pixel math**: A 24-unit viewBox at 16px means each SVG unit = 0.67 CSS pixels. Path coordinates and curves that are integers in the 24-unit space become fractional pixels. The browser anti-aliases these imprecisely, producing fuzzy or jagged edges.
2. **Micro-arc collapse**: Complex icons (gear teeth, detailed shapes) often use tiny arcs and fine decimal coordinates. When downscaled, these features fall below 1 pixel and degrade into visible artifacts.
3. **Pixel-hinted variants exist**: The MDS library provides separately designed variants at each size. The 16px `settings-gear` glyph uses integer-aligned coordinates and simpler geometry specifically optimized for 16 pixels — it is *not* a scaled-down copy of the 24px version.

**Correct workflow:**

```
Need a 16px gear icon in a nav bar?
→ Manifest: settings-gear → glyph → sizes: [12, 16, 24, 32, 48, 64]
→ Pull glyph at width=16 → viewBox="0 0 16 16"
→ CSS: width: 16px; height: 16px;  ← matches viewBox ✓
```

**Wrong:**

```
Pull glyph at width=24 → viewBox="0 0 24 24"
→ CSS: width: 16px; height: 16px;  ← mismatch, jagged ✗
```

If the desired size variant doesn't exist for an icon, choose the nearest **larger** variant and set CSS to the viewBox size, or pick a different icon that has the needed size.

### Dual-context icons — same icon, different sizes

When the same icon appears at two different sizes on a page (e.g. a small `c-remove` ✕ inside a badge *and* a larger `c-remove` in an action button), **you must pull two separate MDS variants** and store them under distinct keys in the ICONS object. Never reuse a single SVG definition across contexts that render at different sizes.

```js
const ICONS = {
  cRemove:   '…viewBox="0 0 12 12" width="12" height="12"…',  // badge context
  cRemove16: '…viewBox="0 0 16 16" width="16" height="16"…',  // action button context
};
```

Before defining any icon, **audit every call site** where the icon key is referenced. If the icon is used in two (or more) CSS size contexts, create a variant per size. Name the variant with a size suffix (e.g. `check12`, `check16`) or a context suffix (e.g. `cRemoveBadge`, `cRemoveAction`).

---

## Anti-Patterns — Never Do These

| What | Example | Why prohibited |
|---|---|---|
| Emoji characters | `🗂` `🧩` `🎨` `🔄` `📊` | Not CSS-colorable, inconsistent rendering, inaccessible |
| Unicode glyphs | `✓` `✗` `→` `⚠` | Not token-styled, fails accessibility |
| Heroicons / Lucide / Feather | `<path d="M20 6L9 17l-5-5"/>` | Not MDS-approved shapes |
| Font Awesome / Material Icons | `<i class="fa fa-check">` | Not MDS-approved, font-based |
| Hand-drawn SVG paths | Custom `<path>` not from source | Visual inconsistency with library |
| Hardcoded hex colors on icons | `fill="#051c2c"` | Must use `currentColor` + CSS tokens |
| viewBox/render size mismatch | `viewBox="0 0 24 24"` at `width:16px` | Causes jagged/distorted icons — use native-size variant |
| CSS `stroke: currentColor` on filled icons | `.icon { stroke: currentColor }` | Adds unwanted outlines around glyph shapes — only use `stroke` on outline-style icons that are designed with strokes |
| Reusing one SVG across size contexts | 12px icon key used in both badges and 16px action buttons | Pull a separate MDS variant per render size — see "Dual-context icons" above |

---

## Quick Checklist

- [ ] Icon looked up in `_manifest.json` by name (search names and tags)
- [ ] Style chosen: `outline` (default), `glyph` (emphasis), or `colored` (decorative)
- [ ] Size confirmed in manifest (default 24, use 12/16/32/48/64 when context requires)
- [ ] **viewBox matches CSS render size** — pulled the variant whose `width` equals the CSS display size (e.g. 16px render → 16px variant, never a downscaled 24px)
- [ ] **Dual-context audit** — if the same icon appears at different sizes (e.g. 12px in badges, 16px in action buttons), separate MDS variants pulled for each size
- [ ] SVG content read from `categories/<category>.json` source file
- [ ] Hardcoded fills replaced with `fill="currentColor"`
- [ ] No blanket `stroke: currentColor` on glyph/filled icons — only on stroke-based outline icons
- [ ] Color set via `color: var(--mds-color-...)` — never hardcoded hex
- [ ] Decorative icons have `aria-hidden="true" focusable="false"`
- [ ] Standalone icon-only buttons have `aria-label` on the button
- [ ] Inline SVG used when color must change on hover/focus/active
