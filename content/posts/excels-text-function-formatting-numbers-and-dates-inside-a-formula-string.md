---
title: "Excel's TEXT Function: Formatting Numbers and Dates Inside a Formula String"
date: "2026-10-19"
tags: ["excel", "data-analysis", "beginner"]
excerpt: "Cell formatting changes how a number looks, not what a formula sees -- the TEXT function is how you bake a specific format into the string itself."
---

Applying a custom number format to a cell makes `41275` display as `Mar-2025`, but the underlying value is still the serial date `41275` — any formula that reads that cell, like a `CONCATENATE` or `&`, still sees the raw number, not the formatted text. The `TEXT` function solves a different problem: it converts a number or date into a formatted string you can combine with other text, which cell formatting alone can't do.

**1. The basic shape is a value plus a format code.** `TEXT(value, format_code)` returns a string, not a number, built using the same format codes you'd type into a custom number format:

```excel
=TEXT(1234.5, "#,##0.00")
```

That returns the text `"1,234.50"` — not the number 1234.5 displayed with two decimals, but the literal string, which is what makes it useful inside a sentence a formula builds.

**2. Combine it with `&` to build dynamic labels and titles.** A chart title or report header that needs to say "Sales as of March 2025" without being retyped every month can pull both pieces from cells:

```excel
="Sales as of "&TEXT(B2, "mmmm yyyy")
```

If `B2` holds a date, this returns `"Sales as of March 2025"` and updates automatically whenever `B2` changes — something a static text box or manually formatted cell can't do.

**3. Use it to make numbers inside a concatenated string actually readable.** Without `TEXT`, joining a label and a raw number gives you something like `"Revenue: 1284392"`. Wrapping the number first fixes that:

```excel
="Revenue: "&TEXT(C2, "$#,##0")
```

That returns `"Revenue: $1,284,392"` — the comma and dollar sign only show up because `TEXT` was told to add them, since `&` on its own just converts a number to its plainest possible string.

**4. Date format codes aren't the same as number format codes, and mixing them up is the most common mistake.** `"mmmm yyyy"` gives a full month name and year, `"mm/dd/yyyy"` gives a slash-separated date, and `"ddd"` gives a short weekday name like "Mon" — none of these work on a plain number, and a numeric format code like `"0.0%"` doesn't work on a date, because Excel is reading the code against whatever the first argument actually is.

**5. It's the right tool for VLOOKUP/XLOOKUP keys that mix text and numbers.** A lookup table keyed on strings like `"Region-01"` won't match a lookup value built from a raw number without `TEXT` normalizing the number's format first:

```excel
=XLOOKUP("Region-"&TEXT(A2, "00"), KeyTable[Key], KeyTable[Value])
```

Here `TEXT(A2, "00")` pads a single-digit region number like `1` into `"01"`, so the built key matches the table's `"Region-01"` instead of silently returning `#N/A` over a formatting mismatch.

**6. Know when to reach for cell formatting instead.** If a number only needs to *look* right in its own cell — a percentage column, a currency column — a custom number format is simpler and keeps the cell as a real number other formulas can still do math on. `TEXT` is for the specific case where you need that formatted appearance glued into a larger string, not displayed on its own.

Most of Excel's date and number formatting happens invisibly through cell formatting, which is exactly why `TEXT` catches people off guard the first time they need a formatted value inside a sentence a formula is building — the cell format simply doesn't travel with the number once it's been grabbed by `&` or `CONCATENATE`.
