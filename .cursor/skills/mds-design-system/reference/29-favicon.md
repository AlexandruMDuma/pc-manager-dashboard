# MDS Favicon

## Source

The official McKinsey favicon is served from the CDN. No local file is bundled.

```
https://cdn.mckinsey.com/assets/images/favicon.png
```

It is a **64x64 PNG** with RGBA transparency.

---

## Adding a Favicon to an HTML Page

Every HTML page in the project must include a favicon link in the `<head>`. Place it after `<meta>` tags and before any `<link rel="stylesheet">` tags.

### Standard pattern

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title | McKinsey &amp; Company</title>
  <link rel="icon" type="image/png" href="https://cdn.mckinsey.com/assets/images/favicon.png">
  <link rel="stylesheet" href="css/global.css">
</head>
```

### Apple Touch Icon (optional)

For iOS home screen bookmarks:

```html
<link rel="apple-touch-icon" href="https://cdn.mckinsey.com/assets/images/favicon.png">
```

---

## AI Workflow

When creating or modifying an HTML page:

1. **Check for an existing favicon link** — search for `rel="icon"` in the `<head>`.
2. **If missing, add one** — use the CDN URL: `https://cdn.mckinsey.com/assets/images/favicon.png`

---

## Do Not

- Do not use a generic or placeholder favicon — always use the official McKinsey favicon.
- Do not store a local copy — always reference the CDN URL directly.
- Do not link to a `.ico` file — the PNG format is universally supported by modern browsers.
- Do not omit the `type="image/png"` attribute — it helps browsers identify the format.
