---
title: "ISNUMBER, ISTEXT, and COUNTBLANK: Catching Data Type Problems Before They Break a Formula in Excel"
date: "2026-11-25"
tags: ["excel", "data-cleaning", "beginner"]
excerpt: "A quick way to audit a column for mixed data types and hidden blanks before you build SUMIFS, VLOOKUP, or a PivotTable on top of it."
---

A `SUMIFS` that quietly returns 0, or a `VLOOKUP` that throws `#N/A` on a row that looks perfectly normal, is almost always a data type problem, not a formula problem. A number stored as text, or a cell that looks empty but holds a stray space, won't match or sum the way you expect. Running a quick audit before you build on top of a column saves the debugging later.

**1. `ISNUMBER`** — tells you whether a cell actually holds a number, as opposed to text that merely looks like one. This catches the classic case of numbers imported from a CSV or a copy-pasted web table landing as left-aligned text.
```excel
=ISNUMBER(A2)
```
Wrap it around a whole column with a helper formula to flag every offender at once:
```excel
=SUMPRODUCT(--NOT(ISNUMBER(A2:A500)))
```
That returns a count of non-numeric cells in the range in one shot, instead of scrolling for left-aligned values.

**2. `ISTEXT`** — the mirror image, useful when you expect every cell in a column to be text (an ID, a category code) and want to flag the rows where someone accidentally typed a bare number instead.
```excel
=ISTEXT(B2)
```
This matters more than it sounds: a product code of `045` typed as text and `45` typed as a number look identical on screen but will never match each other in a lookup.

**3. `COUNTBLANK`** — counts cells that are empty *or* contain an empty string returned by a formula (`=""`), which is not the same thing `COUNTA` or a manual scroll-through will tell you. A column that looks fully populated can still have a nonzero `COUNTBLANK` if it was built from formulas that sometimes resolve to nothing.
```excel
=COUNTBLANK(C2:C500)
```

**4. Combine them into a one-row audit.** Before trusting a new column, run all three checks side by side so you see the whole picture at once instead of discovering each problem separately:
```excel
=SUMPRODUCT(--NOT(ISNUMBER(A2:A500))) & " non-numeric, " & COUNTBLANK(A2:A500) & " blank"
```

**5. Watch for the cell that "looks" blank but isn't.** A cell containing a single space or a non-breaking space pasted from a web page passes a manual eyeball check but fails `COUNTBLANK` and breaks an exact-match lookup. `=LEN(TRIM(A2))=0` is a more reliable blank test than `A2=""` when you suspect this.

None of these functions do anything glamorous, but running them on a new dataset's key columns before you build a single `SUMIFS` or `XLOOKUP` on top of it turns a mysterious wrong total into an obvious, fixable one.
