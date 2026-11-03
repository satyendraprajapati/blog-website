---
title: "Power Query's Group By: Aggregating Data Without a PivotTable"
date: "2026-11-03"
tags: ["excel", "power-query", "data-analysis"]
excerpt: "How to use Power Query's Group By transformation to summarize data by category as a repeatable, refreshable step instead of a one-off PivotTable."
---

PivotTables are the usual go-to for summarizing data by category, but they live on top of the data as a separate object you have to rebuild or refresh every time the source changes shape. Power Query's **Group By** does the same aggregation — sum, count, average, min, max — as a query step, so the summary is baked into a refreshable pipeline instead of something you maintain by hand.

**Start from Data > Get Data > From Table/Range (or an existing query).** Group By works on any tabular data Power Query can see, not just Excel Tables — a CSV import, a database query, or a combination of several files all qualify.

**Open Transform > Group By and pick your grouping column(s).** Group by `Region`, for example, and every row sharing the same region collapses into one output row. You can group by multiple columns at once (say, `Region` and `Month`) to get a summary at that intersection, the same granularity a PivotTable's row/column labels would give you.

**Add the aggregation in the same dialog.** Click "Add aggregation" to sum `Revenue`, count rows, or average `OrderValue` — each becomes its own output column, and you can stack several aggregations in one Group By step instead of writing separate formulas for each.

```excel
// Equivalent logic to a Group By on Region, summing Revenue and counting rows:
= Table.Group(Source, {"Region"}, {
    {"Total Revenue", each List.Sum([Revenue]), type number},
    {"Order Count", each List.Count([Revenue]), type number}
  })
```

That's the M code Power Query generates behind the scenes — you never need to type it, but seeing it helps when you want to tweak an aggregation the dialog doesn't expose directly, like a weighted average.

**Use "All Rows" when you need more than a single number per group.** The Group By dialog has an advanced option that keeps the full set of rows for each group as a nested table column, instead of collapsing to one aggregate. That's useful when a later step needs the raw rows — for example, picking out the single highest-value order per region rather than just the regional total.

**Chain it after your cleanup steps, not before.** Because Group By is just another step in the query, put it after you've already removed duplicates, fixed types, and filled blanks — the aggregation only reflects whatever state the data is in at that point in the pipeline, same as any other transform.

**Refresh instead of rebuild.** The real payoff over a PivotTable: when next month's export lands with the same columns, right-click the query and hit Refresh. The grouped summary recalculates automatically, with no re-dragging fields into a pivot layout.

Group By won't replace a PivotTable for ad-hoc, drag-and-drop exploration — slicers and quick layout changes are still a pivot's strength. But for a summary that feeds a fixed report or chart and needs to survive the next data refresh untouched, building it as a query step is sturdier than rebuilding a pivot each time.
