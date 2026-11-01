---
title: "INDEX/MATCH: The Classic Two-Function Lookup Every Data Analyst Should Still Know"
date: "2026-11-01"
tags: ["excel", "data-analysis", "beginner"]
excerpt: "How INDEX and MATCH work together as a lookup combo, and the specific situations where this older pair still beats XLOOKUP."
---

XLOOKUP gets most of the attention these days, and for good reason — it's shorter to write and more forgiving than VLOOKUP ever was. But INDEX/MATCH came first, it's still the formula you'll find in decades of existing workbooks, and it does a couple of things XLOOKUP genuinely can't. Worth knowing both.

**1. MATCH finds a position, not a value.** That's the part that trips people up first. `MATCH` doesn't return the thing you're looking for — it returns where that thing sits in a range, as a number.
```excel
=MATCH(A2, ProductTable[SKU], 0)
```
If SKU "B-104" is the 7th item in that column, this returns `7`. The `0` at the end means "exact match" — almost always what you want.

**2. INDEX returns a value at a position.** `INDEX` takes a range and a position number and hands back whatever is sitting there.
```excel
=INDEX(ProductTable[Price], 7)
```
Nest `MATCH` inside `INDEX` and you get a lookup: use `MATCH` to find where the SKU lives, then `INDEX` to grab the price at that same spot.
```excel
=INDEX(ProductTable[Price], MATCH(A2, ProductTable[SKU], 0))
```
That's the whole combo. Two simple functions, each doing one job, chained together.

**3. It doesn't care which column is "first."** VLOOKUP forces the lookup column to be the leftmost one in your range — ask it to return a value from a column to the *left* of what you're searching, and it just can't. INDEX/MATCH has no such restriction, because `INDEX` and `MATCH` are pointed at two completely independent ranges. Search a column on the far right, return a value from the far left, no restructuring required.

**4. It powers a two-way lookup with one extra MATCH.** Need the value where a specific row *and* a specific column intersect — say, revenue for "West" region in "March"? Give `INDEX` a full 2-D range and feed it two `MATCH` calls, one for the row position and one for the column position.
```excel
=INDEX(SalesGrid, MATCH("West", RegionLabels, 0), MATCH("March", MonthLabels, 0))
```
XLOOKUP can do this too, but only by nesting one XLOOKUP as the row argument of another — INDEX/MATCH reads more directly once you're used to the pattern.

**5. It's the safer bet in files that have to work everywhere.** XLOOKUP needs a reasonably modern version of Excel. If you're building a workbook that might get opened in an older desktop install, a locked-down corporate version, or certain export/compatibility modes, INDEX/MATCH works everywhere VLOOKUP does — which is to say, almost everywhere. For anything you're handing off without knowing exactly what the recipient runs, that's not a small consideration.

**6. Swap `0` for `1` and MATCH does approximate lookups too.** With a sorted range, `MATCH(A2, Range, 1)` finds the largest value less than or equal to A2 — the same tiering logic behind commission brackets or tax tables. It's the same skill VLOOKUP's approximate mode covers, just decoupled from the "return a value" step.

None of this makes XLOOKUP wrong — it's genuinely less fussy for a plain one-column lookup. But INDEX/MATCH is the one that still shows up in files you didn't build, does two-way lookups more plainly, and never asks what version of Excel is on the other end. Knowing both means you're never stuck rewriting a formula just because of which spreadsheet you happened to open.
