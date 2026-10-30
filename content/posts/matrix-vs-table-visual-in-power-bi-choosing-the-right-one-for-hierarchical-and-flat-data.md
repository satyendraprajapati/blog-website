---
title: "Matrix vs. Table Visual in Power BI: Choosing the Right One for Hierarchical and Flat Data"
date: "2026-10-30"
tags: ["power-bi", "data-visualization", "beginner"]
excerpt: "Table and Matrix look almost identical in the visual gallery, but they're built for different shapes of data and picking the wrong one costs you drill-down and subtotals."
---

Table and Matrix sit next to each other in Power BI's visual gallery and both just show rows and columns of numbers, so it's easy to default to whichever one you clicked first. They behave very differently once real data goes in.

**1. Table is a flat list — one row per record, no grouping.** Drop fields into a Table and you get exactly as many visual rows as there are rows in your data (or in your aggregated query). There's no concept of a parent row with children folded underneath it. It's the right choice for a detail grid — a transaction log, an export-ready list, anything where every row stands on its own.

**2. Matrix groups by the fields in Rows and Columns, with subtotals built in.** Put Region in Rows and Year in Columns, and Matrix collapses every matching record into one cell per Region/Year combination, automatically summing (or averaging, counting, etc.) whatever measure you put in Values — and it adds subtotal and grand total rows without you building them. Table has no equivalent; you'd need a measure or a separate visual to fake a total row.

**3. Matrix supports true drill-down; Table doesn't.** Stack multiple fields in Matrix's Rows well — say Region, then Category — and you get expandable hierarchy arrows: click one to drill from Region totals into that region's categories. Table has no concept of levels to drill through, because it has no grouping to begin with.

**4. Column headers behave differently when you add a second dimension.** Put a field in Matrix's Columns well and each distinct value becomes its own column automatically — Matrix is effectively doing a pivot for you. Table has no Columns well at all; every field you add becomes another column, full stop, so there's no way to "spread" a field across the top without switching visual types.

**5. Conditional formatting and value-as-% work on both, but subtotals change the math.** Format by Rules and Data Bars apply the same way in either visual. The difference shows up with "Show value as % of grand total" — in Matrix, you get a meaningful choice between row, column, and grand-total percentages because the subtotal structure actually exists; in Table, every row is already at the bottom of the hierarchy, so there's only one total to compare against.

**6. A quick DAX measure makes Matrix's subtotal structure pay off.** Because Matrix evaluates a measure at every level — detail row, subtotal, and grand total — you can write a measure that reacts to which level it's currently being calculated at, instead of needing a separate visual for the summary view:

```dax
Pct of Parent =
DIVIDE(
    SUM(Sales[Amount]),
    CALCULATE(SUM(Sales[Amount]), ALLSELECTED(Sales[Category]))
)
```

Dropped into a Matrix with Region and Category in Rows, that single measure shows each category's share of its region's total at the detail level, and each region's share of the grand total at the subtotal level — something a Table visual, with no subtotal rows to evaluate against, simply has no context for.

The short version: reach for Table when you want a list, and Matrix the moment you want grouping, subtotals, or drill-down — swapping one for the other later means rebuilding the Rows/Columns/Values wells from scratch, so it's worth deciding up front.
