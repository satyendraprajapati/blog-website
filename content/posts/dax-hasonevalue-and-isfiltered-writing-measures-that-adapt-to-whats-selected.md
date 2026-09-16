---
title: "DAX HASONEVALUE and ISFILTERED: Writing Measures That Adapt to What's Selected"
date: "2026-09-16"
tags: ["power-bi", "dax", "data-analysis"]
excerpt: "Two functions for detecting filter state so a measure can change its behavior depending on how much is selected."
---

A lot of DAX bugs come from a measure assuming a single value is selected when it isn't — a total that quietly averages across ten products instead of showing one, or a title that reads "Region: " with nothing after it because three regions are selected at once. `HASONEVALUE` and `ISFILTERED` exist to catch exactly that, and they answer slightly different questions.

**1. `HASONEVALUE`** — checks whether exactly one value remains visible for a given column after all current filters are applied. It returns `TRUE` only when the user has drilled down (or filtered) to a single item, not when there are zero, two, or more.
```dax
Product Margin % =
IF(
    HASONEVALUE(Products[ProductName]),
    DIVIDE([Total Profit], [Total Revenue]),
    "Select one product"
)
```
This is the pattern behind `SELECTEDVALUE`, but writing it out with `HASONEVALUE` directly is still worth knowing because you sometimes need the `TRUE`/`FALSE` check on its own — for example, to switch between two entirely different calculations rather than just picking a display value.

**2. `ISFILTERED`** — checks whether a column has *any* filter applied to it at all, whether that's one value, three values, or a filter coming from a slicer on a related column. It doesn't care how many values remain, only whether the column is constrained compared to its full, unfiltered state.
```dax
Filter Status =
IF(
    ISFILTERED(Sales[Region]),
    "Filtered view — not comparable to company total",
    "Showing all regions"
)
```

**The distinction that trips people up.** `HASONEVALUE` answers "is it down to exactly one?" while `ISFILTERED` answers "is it constrained at all?" A slicer with three regions selected out of five makes `ISFILTERED` return `TRUE` and `HASONEVALUE` return `FALSE`. Reach for `HASONEVALUE` when a calculation only makes sense at the single-item grain (a margin percentage, a specific SKU's reorder point); reach for `ISFILTERED` when you just need to warn users that what they're looking at isn't the full picture, regardless of how many items are selected.

**A common use: flagging drill-level in a matrix.** In a matrix visual with Region, then Category nested underneath, you can use `HASONEVALUE` on the inner column to change what a measure calculates depending on which level the user is looking at.
```dax
Level-Aware Total =
IF(
    HASONEVALUE(Products[Category]),
    [Category Total],
    [Region Total]
)
```

**Checking a table instead of a column.** Both functions also accept a table name, which checks whether any filter exists on that table's underlying columns — handy for a general "is this report currently filtered by date at all" check without naming every column in the date table individually.
```dax
Date Filter Applied = ISFILTERED('Date')
```

Neither function changes what gets aggregated on its own — they're conditions you wrap around a calculation. But that condition is often the difference between a measure that silently returns a misleading number and one that tells the report user exactly why what they're seeing looks the way it does.
