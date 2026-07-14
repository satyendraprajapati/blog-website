---
title: "5 Excel Formulas Every Data Analyst Should Know (With Examples)"
date: "2026-07-17"
tags: ["excel", "data-analysis", "beginner"]
excerpt: "Five formulas that cover most day-to-day data cleaning and lookup work in Excel."
---

There are hundreds of Excel functions, but a small handful cover most of what comes up in real analysis work. Here are five worth knowing well.

**1. `XLOOKUP`** — the modern replacement for `VLOOKUP`. It looks up a value in one range and returns a matching value from another, without the column-counting and left-to-right restriction that made `VLOOKUP` fragile.
```excel
=XLOOKUP(A2, ProductTable[SKU], ProductTable[Price])
```

**2. `SUMIFS`** — sums a range based on one or more conditions, which is most of what "how much revenue did X generate" questions boil down to.
```excel
=SUMIFS(Sales[Revenue], Sales[Region], "West", Sales[Month], "March")
```

**3. `TEXTJOIN`** — combines multiple cells into one string with a separator, and ignores blanks along the way — useful for building labels or combining first/last names cleanly.
```excel
=TEXTJOIN(", ", TRUE, A2:C2)
```

**4. `IFERROR`** — wraps another formula and gives you a fallback value instead of a `#N/A` or `#DIV/0!` error leaking into a chart or downstream calculation.
```excel
=IFERROR(XLOOKUP(A2, ProductTable[SKU], ProductTable[Price]), "Not found")
```

**5. `UNIQUE`** — returns the distinct values from a range, which is the fastest way to build a clean list of categories for a dropdown, chart axis, or slicer source.
```excel
=UNIQUE(Sales[Region])
```

None of these are exotic — the value is in knowing them well enough to reach for the right one automatically instead of reconstructing similar logic from scratch every time.
