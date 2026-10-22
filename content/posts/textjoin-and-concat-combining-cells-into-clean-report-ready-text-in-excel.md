---
title: "TEXTJOIN and CONCAT: Combining Cells Into Clean, Report-Ready Text in Excel"
date: "2026-10-22"
tags: ["excel", "data-analysis", "beginner"]
excerpt: "A dedicated look at TEXTJOIN and CONCAT for building full names, labels, and concatenated keys without a string of & signs."
---

Most analysts meet `TEXTJOIN` and `CONCAT` as a one-line mention in a formula roundup, use the `&` operator everywhere instead, and never notice how much cleaner the dedicated functions make the handful of jobs they're actually built for: combining several cells into one tidy string for a label, a report, or a lookup key.

**1. `CONCAT` replaces a chain of `&` signs for a simple join.** It takes any mix of single cells and ranges and glues their contents together with no separator unless you add one yourself.
```excel
=CONCAT(A2, " ", B2)
```
That's identical to `=A2&" "&B2`, but `CONCAT` also accepts a whole range directly — `=CONCAT(A2:C2)` joins three cells without writing out each reference, which `&` can't do without spelling out every cell.

**2. `TEXTJOIN` is the one worth learning well, because it has a separator and a skip-blanks switch built in.** The first two arguments set the delimiter and whether to ignore empty cells; everything after that is what gets joined.
```excel
=TEXTJOIN(", ", TRUE, A2:D2)
```
Set the second argument to `TRUE` and a row with a missing middle name or phone number still produces a clean comma-separated list instead of `"John, , Smith"` with a stray double comma sitting in the output.

**3. Build a display label without a helper column for every piece.** A common report need — "City, State ZIP" or "Last, First" — is one formula instead of three concatenated helper cells:
```excel
=TEXTJOIN(", ", TRUE, City, State&" "&Zip)
```
Nesting a `&` expression as one of `TEXTJOIN`'s arguments works fine — you're not limited to raw cell references, just values, so this builds "Austin, TX 78701" in a single cell.

**4. Join an entire range into a single summary cell, not just one row.** `TEXTJOIN` collapses a multi-cell range into one string, which is the fastest way to turn a filtered list into a sentence for a report header or an email subject line:
```excel
=TEXTJOIN(", ", TRUE, UNIQUE(FILTER(Sales[Region], Sales[Quarter]="Q3")))
```
Pair it with `UNIQUE` and `FILTER` and you get something like "East, West, Central" generated live from whatever regions actually show up in the filtered data — no manual retyping when the underlying list changes.

**5. Use it to build a concatenated key for a lookup, not just a label.** When two tables only match on a combination of columns — region *and* product code, say — `TEXTJOIN` can build a matching composite key in a helper column on both sides, which `XLOOKUP` or `VLOOKUP` can then match on directly instead of needing a multi-condition lookup formula:
```excel
=TEXTJOIN("-", TRUE, A2, B2)
```
It's a small trick, but it turns a two-column match into a single-column one, which keeps the lookup formula itself simple.

**6. Know the one thing `TEXTJOIN` won't do: it doesn't dedupe.** If a range has repeated values, both functions join every instance exactly as it appears — wrap the range in `UNIQUE` first, as in tip 4, if the goal is a distinct list rather than a literal join of everything in the range.

Neither function does anything `&` technically couldn't, eventually — but once a join involves more than two or three cells, a separator, or a few predictable blanks, `TEXTJOIN` is the formula that was actually designed for the job, and it reads far more clearly in a workbook someone else has to maintain later.
