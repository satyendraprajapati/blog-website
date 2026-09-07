---
title: "DAX CONCATENATEX: Turning Filter Selections into Dynamic Report Titles"
date: "2026-09-07"
tags: ["power-bi", "dax", "beginner"]
excerpt: "Use CONCATENATEX to turn a multi-select slicer into a readable, comma-separated subtitle instead of a blank card or a generic \"Multiple Values\" label."
---

`SELECTEDVALUE` handles the case where exactly one slicer value is picked, but it falls back to a fixed placeholder the moment someone selects two or three regions instead of one. `CONCATENATEX` covers that gap — it builds an actual comma-separated list of whatever is currently selected, so a report subtitle reads "West, East" instead of just "Multiple Regions."

**1. Understand the two arguments that matter most.** `CONCATENATEX` takes a table, an expression to evaluate per row, and a delimiter: `CONCATENATEX(<table>, <expression>, <delimiter>)`. It iterates the table row by row, evaluates the expression for each one, and joins the results with the delimiter — conceptually the DAX equivalent of Excel's `TEXTJOIN`, but iterating over a filtered table instead of a static range.

**2. Build a basic dynamic subtitle.** Feed it `VALUES()` on the column you want to summarize, so it only sees the values currently in filter context:

```dax
Selected Regions =
"Region: " & CONCATENATEX(VALUES(Regions[Region]), Regions[Region], ", ")
```

With one region selected, this returns `Region: West`. With three selected, it returns `Region: East, North, West` — no `IF(HASONEVALUE(...))` branching required.

**3. Cap it for slicers with dozens of possible values.** A subtitle listing forty selected customers is worse than no subtitle at all. Use `SELECTEDVALUE` to shortcut the single-selection case, and fall back to a count instead of a full list once the selection gets large:

```dax
Selected Customers =
VAR SelCount = COUNTROWS(VALUES(Customers[Customer]))
RETURN
SWITCH(
    TRUE(),
    SelCount = 1, SELECTEDVALUE(Customers[Customer]),
    SelCount <= 5, CONCATENATEX(VALUES(Customers[Customer]), Customers[Customer], ", "),
    SelCount & " customers selected"
)
```

**4. Sort the list, not just concatenate it.** By default the order follows whatever order the engine encounters the rows in, which can look arbitrary. Add an `ORDER BY` clause directly inside the function call:

```dax
Selected Regions Sorted =
CONCATENATEX(VALUES(Regions[Region]), Regions[Region], ", ", Regions[Region], ASC)
```

**5. Use it beyond titles — for tooltip and export labels too.** The same pattern documents *what filters produced this number* on an exported PDF or a scheduled email subscription, where the person reading it later has no slicer to look at. A measure like `"Filtered by: " & CONCATENATEX(VALUES(Product[Category]), Product[Category], ", ")` placed in a text box turns a static export into something self-explanatory.

**6. Watch performance on very large distinct-value columns.** `CONCATENATEX` evaluates its expression once per row of the table argument, so running it over `VALUES()` of a column with tens of thousands of distinct values — with no active filter narrowing it down — can noticeably slow a visual. It's built for summarizing a *filtered*, human-scale selection, not for concatenating a whole unfiltered dimension.

Between `SELECTEDVALUE` for the single-value case and `CONCATENATEX` for everything past it, a report can describe its own current filter state accurately no matter how many values a viewer happens to pick.
