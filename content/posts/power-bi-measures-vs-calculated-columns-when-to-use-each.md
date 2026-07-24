---
title: "Power BI: Measures vs. Calculated Columns and When to Use Each"
date: "2026-07-20"
tags: ["power-bi", "dax", "data-modeling"]
excerpt: "Both are written in DAX, but measures and calculated columns get evaluated completely differently — and picking the wrong one bloats your model or breaks your visuals."
---

New Power BI users often reach for whichever one they wrote first — a calculated column and a measure can look identical in the DAX editor — and only run into trouble later, when the model is slow or a total doesn't match what a chart shows. The difference comes down to *when* each one is evaluated, not how it's written.

**A calculated column is computed once, per row, at refresh time.** It behaves like a real column in the table — it gets stored on disk in the model, you can filter by it, slice by it, and put it on an axis. Once refresh finishes, the value is fixed for every row until the next refresh:

```dax
Full Name = Customers[FirstName] & " " & Customers[LastName]
```

**A measure is computed on the fly, for whatever's currently in view.** It has no stored value — it recalculates every time a filter, slicer, or visual changes what rows are in context:

```dax
Total Revenue = SUM(Sales[Revenue])
```

**1. Default to a measure unless you specifically need row-level output.** Measures are lighter on the model (nothing is stored) and automatically respect whatever filters are applied — a `Total Revenue` measure just works whether it's sliced by region, by month, or both. A calculated column doing the same aggregation would need to be recomputed and wouldn't respond to slicers at all.

**2. Use a calculated column when the result needs to sit on a slicer or axis.** Measures can't be filtered on or placed on a chart's category axis — they only produce numbers. If you need a categorical bucket like `Price Tier` (`"Budget"`, `"Mid"`, `"Premium"`) that a user filters by, that has to be a calculated column, because it needs to exist as a real value per row before anything is sliced.

**3. Watch model size — calculated columns cost storage, measures don't.** Every calculated column is compressed and stored in the model file just like an imported column, which adds up on large fact tables. A measure adds essentially nothing to file size since it's just a formula evaluated at query time. On a million-row fact table, an unnecessary calculated column can meaningfully bloat refresh time and file size where an equivalent measure wouldn't.

**4. Don't build a calculated column that references measures — it's usually a sign you want the reverse.** Calculated columns evaluate in row context without visual filter context, so they can't reference another measure's filtered result the way you'd expect. If you catch yourself trying to do this, the aggregation almost always belongs in a measure instead.

**5. Use `SELECTEDVALUE` in a measure to react to a slicer choice, not a calculated column.** A common beginner pattern is trying to compute "revenue for the selected region" as a column — but a column has no concept of "currently selected." That's exactly what a measure combined with `SELECTEDVALUE` or filter context is for:

```dax
Revenue for Selected Region =
CALCULATE(SUM(Sales[Revenue]), Sales[Region] = SELECTEDVALUE(Regions[Region]))
```

The short version: if the answer needs to change depending on what the user clicks, it's a measure; if it needs to exist as a fixed attribute you can filter, slice, or group by, it's a calculated column. Getting this right early saves a model rebuild later.
