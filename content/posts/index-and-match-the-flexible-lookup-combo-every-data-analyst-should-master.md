---
title: "INDEX and MATCH: The Flexible Lookup Combo Every Data Analyst Should Master"
date: "2026-08-26"
tags: ["excel", "formulas", "beginner"]
excerpt: "XLOOKUP handles most single-column lookups now, but INDEX and MATCH combined still do things no single lookup function can — starting with a true two-way lookup."
---

`XLOOKUP` gets most of the attention these days, and for a straightforward "find this value, return that column" lookup it's the right default. But `INDEX` and `MATCH` used together aren't just a legacy workaround — combined, they solve a category of problems a single lookup function, XLOOKUP included, can't touch on its own: a lookup where *both* the row and the column depend on a value you're searching for.

**1. Understand the two pieces separately first.** `MATCH` doesn't return a value — it returns a *position*: the row or column number where a value was found inside a range. `INDEX` takes a range and a position and returns whatever's sitting there. Neither is very useful alone, but together, `MATCH` finds the address and `INDEX` fetches what's at it.
```excel
=MATCH("West", A1:A10, 0)
=INDEX(B1:B10, 5)
```

**2. Chain them for a standard single-lookup.** This is the classic pattern, and it's what `XLOOKUP` was built to replace for most cases — but it's still worth knowing, because it's the only lookup that works identically on every version of Excel a file might ever be opened in, including ones without `XLOOKUP`.
```excel
=INDEX(ProductTable[Price], MATCH(A2, ProductTable[SKU], 0))
```

**3. Build a true two-way lookup by nesting a second `MATCH` inside `INDEX`.** This is the case a single `XLOOKUP` genuinely can't do in one step: finding a value at the intersection of a matching row *and* a matching column, like a region-by-month matrix. Give `INDEX` two `MATCH` calls instead of one — the first locates the row, the second locates the column.
```excel
=INDEX(SalesGrid, MATCH(A2, SalesGrid[#Headers], 0), MATCH(B2, RegionColumn, 0))
```

**4. Use `MATCH`'s approximate mode to bucket a number into a range.** With the third argument set to `1` instead of `0`, `MATCH` stops looking for an exact hit and instead returns the position of the largest value that's less than or equal to your lookup value — as long as the lookup column is sorted ascending. That turns a raw score or age into a tier lookup without a nested `IF` chain.
```excel
=INDEX(TierNames, MATCH(A2, TierThresholds, 1))
```

**5. Return an entire row or column, not just one cell.** Feed `INDEX` a `0` for the row or column argument and it returns the whole row/column at that position instead of a single value — useful when you want to pull an entire record once you've located it, rather than writing a separate lookup per field.
```excel
=INDEX(CustomerTable, MATCH(A2, CustomerTable[CustomerID], 0), 0)
```

**6. Know when `INDEX/MATCH` is still the better call over `XLOOKUP`.** Beyond compatibility, `INDEX/MATCH` is also the more efficient choice inside a very large workbook when you only need a position calculated once and reused across several `INDEX` calls — computing `MATCH` a single time and referencing that cell from multiple `INDEX` formulas avoids re-searching the same column repeatedly, which a chain of separate `XLOOKUP`s would do.

`XLOOKUP` is the right first reach for a plain "look this up" formula. But the moment you're pulling a value from a grid using two conditions at once, or building a formula that has to open cleanly in a decade-old copy of Excel, `INDEX/MATCH` is still the tool that gets it done.
