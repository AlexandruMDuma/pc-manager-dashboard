## McKinsey Logo — Usage Reference

### Available variants

All logos are served from the McKinsey CDN. No local SVG files are bundled — always fetch from the CDN URLs below.

#### ScriptMark (canonical)

| Variant | Fill colour | CDN URL | Use on |
|---------|------------|---------|--------|
| White | `#FFFFFF` | `https://cdn.mckinsey.com/assets/images/McK_ScriptMark_RGB_White.svg` | Dark backgrounds (`--mds-color-deep-blue-900`, `--mds-color-background-inverse`) |
| Deep Blue | `#051C2C` | `https://cdn.mckinsey.com/assets/images/McK_ScriptMark_RGB_McKDeepBlue.svg` | Light backgrounds (`--mds-color-white`, `--mds-color-background-subtle`) |
| Black | `#000000` | `https://cdn.mckinsey.com/assets/images/McK_ScriptMark_RGB_Black.svg` | Light backgrounds (when deep blue is unavailable) |

All three share the same geometry: `viewBox="0 0 283.4 90.2"` (aspect ratio ≈ 3.14:1). The logo is a two-line wordmark — "McKinsey" on top, "& Company" below.

### Critical: always set explicit dimensions

These SVG files have **no** `width` or `height` attributes. Without them, browsers render at the viewBox's intrinsic size (283 x 90 px), which is far too large for a nav bar.

**Always** add `width` and `height` on the `<svg>` element:

```html
<!-- GOOD — explicit dimensions, renders at 88×28 px -->
<svg width="88" height="28" viewBox="0 0 283.4 90.2" ...>

<!-- BAD — no dimensions, renders at 283×90 px -->
<svg viewBox="0 0 283.4 90.2" ...>
```

### Recommended sizes

| Context | Height | Width (auto from ratio) |
|---------|--------|------------------------|
| Top nav bar (56 px) | `28` | `88` |
| Compact header (48 px) | `24` | `75` |
| Footer | `20` | `63` |
| Splash / hero | `40` | `126` |

### Inline SVG pattern (preferred)

Fetch the SVG from the CDN, then inline the paths directly. This gives full CSS `fill` control and avoids render-blocking `<img>` limitations.

Strip the XML prolog, `style` block, and Illustrator comments. Use a flat `fill` attribute on the `<g>` element instead of a CSS class:

```html
<svg class="page-header__logo" width="88" height="28"
     viewBox="0 0 283.4 90.2"
     xmlns="http://www.w3.org/2000/svg"
     aria-label="McKinsey &amp; Company" role="img">
  <g fill="#FFFFFF">
    <!-- paste <path> elements fetched from the CDN SVG here -->
  </g>
</svg>
```

### AI workflow: embedding a logo

1. **Determine background** — dark or light?
2. **Select variant** — White for dark backgrounds, Deep Blue for light backgrounds. Black only as a fallback.
3. **Fetch the SVG from CDN** — Use the URL from the table above.
4. **Extract the paths** — Copy the `<g>` element containing the `<path>` elements. Strip the XML prolog, `<style>` block, and Illustrator comments.
5. **Replace CSS classes with flat fill** — Remove `class="st0"` from paths and add `fill="<colour>"` on the `<g>` wrapper. Use `#FFFFFF` for white, `#051C2C` for deep blue, or `#000000` for black.
6. **Set explicit dimensions** — Add `width` and `height` attributes matching the context (see table above).
7. **Add accessibility** — `aria-label="McKinsey &amp; Company" role="img"` for standalone, `aria-hidden="true"` if decorative.

### Colour variant selection

| Header / banner background | Logo variant | Inline fill |
|---------------------------|-------------|-------------|
| `--mds-color-deep-blue-900` | White | `#FFFFFF` |
| `--mds-color-background-inverse` | White | `#FFFFFF` |
| `--mds-color-white` | Deep Blue | `#051C2C` |
| `--mds-color-background-subtle` | Deep Blue | `#051C2C` |

Never use the white logo on a light background or the deep blue logo on a dark background.

### Accessibility

- Always include `aria-label="McKinsey &amp; Company"` and `role="img"` on the `<svg>`.
- The logo is decorative in nav bars where the site name is also present as text — in that case use `aria-hidden="true"` instead.

### Do not

- Do not store local copies of logo SVGs in the project — always fetch from CDN.
- Do not apply CSS `width`/`height` alone — always set attributes on the `<svg>` element for reliable sizing.
- Do not fabricate or approximate the logo paths — always copy from the official CDN files.
- Do not use Bower-styled text as a logo substitute.
- Do not use `<img src="...">` for the logo — inline SVG is required for colour control.