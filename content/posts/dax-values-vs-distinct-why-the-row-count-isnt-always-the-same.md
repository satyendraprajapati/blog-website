---
title: "DAX VALUES vs. DISTINCT: Why the Row Count Isn't Always the Same"
date: "2026-11-22"
tags: ["power-bi", "dax", "beginner"]
excerpt: "VALUES and DISTINCT both return the unique values of a column, but one of them can quietly add an extra row that throws off a count."
---

`VALUES` and `DISTINCT` get introduced as if they're the same function with two names — both take a column and hand back a one-column table of its unique values, and in a tooltip or a quick demo they behave identically. The difference only shows up once your model has unmatched rows somewhere, and by then it's usually surfacing as a count that's off by exactly one.

**1. Both return a table of unique values, used the same way.** Wrapped in `COUNTROWS`, either one gives you a distinct count:
```dax
Distinct Regions (VALUES) := COUNTROWS( VALUES( Sales[Region] ) )
Distinct Regions (DISTINCT) := COUNTROWS( DISTINCT( Sales[Region] ) )
```
Run these side by side on a clean column with no blanks and no filter weirdness, and they return the same number. That's where most explanations of the two stop — which is the problem.

**2. `VALUES` can add a blank row that isn't in your data.** If `Sales[Region]` comes from a table on the many side of a relationship, and some rows in `Sales` have a `RegionID` that doesn't match anything in the `Region` lookup table (a referential integrity violation — an orphaned foreign key), `VALUES` adds one extra row to represent those unmatched rows: a blank. `DISTINCT` does not do this. It only returns blanks that genuinely exist as a value in the column itself.

**3. That one row changes your count without changing your data.** If `Sales[Region]` has 5 real region values but a handful of orders reference a region that was deleted from the lookup table, `COUNTROWS(VALUES(Sales[Region]))` returns 6, while `COUNTROWS(DISTINCT(Sales[Region]))` returns 5. Whoever built the "number of regions we sell into" card on a dashboard now has a measure that's quietly wrong by one, with no error anywhere to flag it.

**4. `VALUES` is filter-context-aware in a way that matters inside iterators.** This is the other half of why `VALUES` exists at all: it's commonly used inside `SUMX`, `AVERAGEX`, or `FILTER` specifically because it reflects whatever filter context is active when the measure runs, which is the whole point of wrapping it around a column in the first place.
```dax
Revenue From Visible Regions :=
SUMX( VALUES( Sales[Region] ), [Total Revenue] )
```
`DISTINCT` works inside iterators too, but reach for `VALUES` by convention here — it signals "the current filter context's unique values," which is what you actually mean.

**5. Use `DISTINCT` when you need a guaranteed-accurate count.** For anything presented as "number of distinct X" on a report — distinct customers, distinct products, distinct order dates — `DISTINCT` is the safer default specifically because it won't introduce a phantom row your data doesn't actually contain. Reserve `VALUES` for measures where you're deliberately leaning on its filter-context behavior rather than just counting uniques.

**6. The real fix is usually the relationship, not the function choice.** A `VALUES`/`DISTINCT` mismatch is a symptom — it means somewhere in your model there's a fact row with no matching dimension row. Finding and fixing that referential integrity gap (or at minimum building an "Unknown" member for it) removes the discrepancy at the source, rather than just picking the function that happens to hide it.

The two functions aren't interchangeable shortcuts for the same thing — they encode a real decision about whether a measure should surface a data-quality gap or stay silent about it.
