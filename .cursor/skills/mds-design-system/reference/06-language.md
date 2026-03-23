# US English Standard

All generated content defaults to US English — UI copy, labels, code comments, documentation, presentations, and data annotations.

## Common Substitutions

| Use (US) | Not (UK/other) |
|-----------|----------------|
| color | colour |
| customize | customise |
| organize | organise |
| analyze | analyse |
| optimize | optimise |
| recognize | recognise |
| authorize | authorise |
| center | centre |
| fiber | fibre |
| meter | metre |
| license | licence |
| defense | defence |
| catalog | catalogue |
| program | programme |
| dialog | dialogue |
| gray | grey |
| fulfill | fulfil |
| enrollment | enrolment |
| canceled | cancelled |
| modeling | modelling |
| traveled | travelled |
| jewelry | jewellery |

## Spelling Patterns

### -ize not -ise
`organize`, `customize`, `optimize`, `authorize`, `recognize`, `summarize`

### -or not -our
`color`, `favor`, `behavior`, `neighbor`, `honor`, `labor`

### -er not -re
`center`, `meter`, `fiber`, `theater`, `caliber`

### -og not -ogue
`catalog`, `dialog`, `analog`, `prolog`

### -ense not -ence
`defense`, `offense`, `license` (noun and verb)

### Single consonant before suffix
`canceled`, `modeling`, `traveled`, `labeled`, `leveled`

## Date Formats

Use month-first ordering when writing dates in prose:
- `March 15, 2026` not `15 March 2026`
- `Mar 15` not `15 Mar`

In data tables and code, ISO 8601 (`2026-03-15`) is acceptable.

## Currency and Numbers

- **Default currency is US dollars ($).** All monetary values use `$` unless the user explicitly specifies another currency.
- Use period as decimal separator: `$1,234.56` not `$1.234,56`
- Symbol placement: `$1,234` (symbol before number, no space)
- Use "billion" (10^9) not "milliard"
- Format with `en-US` locale in JavaScript: `toLocaleString('en-US', { style: 'currency', currency: 'USD' })`

### Why this matters
Prompts may reference non-US currencies (£, €, ¥) or use British spelling without intending a locale override. Treat the **content** as locale-neutral sample data and silently convert to US defaults. Only preserve a non-US currency when the user makes an explicit, deliberate choice (e.g. "prices are in GBP", "this dashboard serves the London office").

## Exception

When the user explicitly requests a non-US locale or currency (e.g., "use GBP", "this is for a UK audience", "EU regulatory text"), follow the target locale. Flag the exception in a code comment so future maintainers understand the intent.
