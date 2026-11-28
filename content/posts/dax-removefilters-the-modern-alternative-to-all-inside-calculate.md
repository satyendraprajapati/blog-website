---
title: "DAX REMOVEFILTERS: The Modern, Clearer Alternative to ALL() Inside CALCULATE"
date: "2026-11-28"
tags: ["power-bi", "dax", "beginner"]
excerpt: "Why REMOVEFILTERS reads better than ALL() for clearing filters inside CALCULATE, and the one place they still behave differently."
---

`ALL()` has done double duty in DAX for years: it returns all the rows of a table or column, and — when used as a `CALCULATE` filter argument — it's the standard way to strip existing filters off that column. `REMOVEFILTERS` was introduced to split that second job out into its own, more honestly-named function.

**1. The basic swap.** Anywhere you've written `CALCULATE(..., ALL(Sales[Region]))` purely to clear the Region filter, `REMOVEFILTERS` does the same job:

```dax
% of All Regions =
DIVIDE (
    [Total Sales],
    CALCULATE ( [Total Sales], REMOVEFILTERS ( Sales[Region] ) )
)
```

Both versions ignore whatever region slicer selection is active and compute total sales across every region. The result is identical — the difference is intent.

**2. Why the name matters.** `ALL()` is overloaded: used as a table expression (say, inside `SUMX`) it returns rows; used inside `CALCULATE` it removes filters as a side effect of how filter arguments work. That dual meaning trips up people reading a measure later — does this `ALL()` return a table of data, or is it just here to clear a filter? `REMOVEFILTERS` can *only* be used as a `CALCULATE`/`CALCULATETABLE` filter argument, so seeing it in a measure tells you exactly what it's doing with no ambiguity.

**3. Clearing multiple filters at once.** Like `ALL()`, `REMOVEFILTERS` accepts a whole table, which removes every filter on that table, including ones from related tables through active relationships:

```dax
Total Sales (All Time, All Products) =
CALCULATE (
    [Total Sales],
    REMOVEFILTERS ( Calendar ),
    REMOVEFILTERS ( Product )
)
```

**4. Where it genuinely differs from ALL().** Outside of `CALCULATE`, `ALL()` can be used as a table expression — for example, iterating over `ALL(Product[Category])` inside a `SUMX` to compute something across every category regardless of the current filter. `REMOVEFILTERS` can't do this; it has no meaning outside a filter-argument position. If you see a measure using `ALL()` as the thing being iterated over rather than just a `CALCULATE` argument, that's a case `REMOVEFILTERS` can't replace.

**5. No change in performance.** `REMOVEFILTERS` isn't faster or slower than the equivalent `ALL()` — the engine treats them the same way when both appear as `CALCULATE` filter arguments. This is purely about writing measures your teammates (and future you) can read correctly on the first pass.

**6. A good default going forward.** If you're writing a new measure and the only reason you're reaching for `ALL()` is to clear a filter inside `CALCULATE`, reach for `REMOVEFILTERS` instead. Keep `ALL()` for the cases where you actually need it to behave like a table — everywhere else, the more specific function name is the better habit to build.
