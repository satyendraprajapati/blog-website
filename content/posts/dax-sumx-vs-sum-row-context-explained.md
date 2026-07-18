---
title: "DAX: SUMX vs. SUM and Why Row Context Matters"
date: "2026-07-26"
tags: ["power-bi", "dax", "data-modeling"]
excerpt: "The difference between aggregating a column and evaluating an expression row by row in DAX."
---

`SUM` and `SUMX` look interchangeable at first — both give you a total — but they solve different problems, and mixing them up is a common source of DAX measures that are subtly wrong.

**`SUM` aggregates an existing column.** It takes one column that already has the numbers you want and adds them up:

```dax
Total Revenue = SUM(Sales[Revenue])
```

This only works if `Revenue` already exists as a column. If your revenue isn't stored directly — say you only have `Quantity` and `Unit Price` — `SUM` has nothing to add.

**`SUMX` evaluates an expression per row, then sums the results.** This is an *iterator*: it walks through a table row by row, computes something for each row, and totals it afterward.

```dax
Total Revenue = SUMX(Sales, Sales[Quantity] * Sales[Unit Price])
```

Here, `Quantity * Unit Price` is calculated fresh for every row before anything gets summed — which matters, because `SUM(Sales[Quantity]) * SUM(Sales[Unit Price])` gives you a completely different (and wrong) number. Multiplying two totals is not the same as multiplying per row and then totaling.

**The mental model worth keeping:** `SUM` answers "add up this column." `SUMX` answers "for each row, calculate this, then add up the results." Any time your calculation depends on combining *multiple columns from the same row* — revenue from quantity and price, margin from cost and price — reach for an iterator (`SUMX`, `AVERAGEX`, `COUNTX`) instead of trying to force it through plain aggregation functions.
