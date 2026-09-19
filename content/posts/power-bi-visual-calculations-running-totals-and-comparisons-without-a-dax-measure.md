---
title: "Power BI Visual Calculations: Running Totals and Comparisons Without a DAX Measure"
date: "2026-09-19"
tags: ["power-bi", "dax", "visual-calculations"]
excerpt: "Visual calculations run directly on what's already plotted on a chart or matrix, sidestepping filter context and relationships entirely for a running total, a rank, or a period-over-period comparison."
---

Every DAX measure you write has to think in terms of the model — filter context, relationships, the tables the calculation can see. Visual calculations skip all of that. They run *after* a visual has already been built, operating only on the rows and columns actually shown on that chart or matrix, which makes a whole category of one-off "just on this visual" calculations dramatically simpler to write.

**1. A visual calculation lives inside the visual, not the model.** Select a table or matrix visual, then choose New Calculation from the ribbon (not New Measure) and you get a formula bar scoped only to that visual's current output — no `CALCULATE`, no relationships, no need to reference a table by name.
```dax
Running Total = RUNNINGSUM([Revenue])
```
Drop this into a matrix that already has Revenue by Month, and it adds a running-total column that follows whatever's on the rows — reorder the months, add a slicer, and it keeps summing in the order the visual displays, with zero extra model logic.

**2. `RUNNINGSUM` and `MOVINGAVERAGE` solve what used to need a full DAX time-intelligence pattern.** A 3-month moving average that used to require a calculated measure with `DATESINPERIOD` and `AVERAGEX` becomes one line, scoped to whatever axis the visual is already using.
```dax
3-Month Avg = MOVINGAVERAGE([Revenue], 3)
```

**3. `COLLAPSE` and `EXPAND` move up and down a visual's own hierarchy without touching the model.** If your matrix has Region collapsed into Country, `COLLAPSE` lets a calculation reach up to the Country-level total from a Region-level row — the visual equivalent of `ALLEXCEPT`, but referencing the layout in front of you instead of table relationships.
```dax
% of Country = DIVIDE([Revenue], COLLAPSE([Revenue], ROWS))
```

**4. Reference another visual calculation by name, the same way you'd reference a measure.** Because visual calculations behave like local variables scoped to that one visual, you can layer them — build a running total, then reference it in a second calculation that computes its percent change from the prior row.
```dax
Running Total Growth = [Running Total] - PREVIOUS([Running Total])
```

**5. `PREVIOUS`, `NEXT`, and `INDEX` navigate row-to-row inside the visual, not across the model's time dimension.** This is the detail that trips people up moving from regular DAX: `PREVIOUS` here means "the previous row currently shown," which could be the previous month, the previous rank, or the previous category — whatever order the visual is actually in — not a calendar-aware time intelligence function.

**6. They're for the calculation you don't want to maintain in the model.** A visual calculation only exists on that one visual; copy the visual to another report and it doesn't come along automatically the way a real measure would. That makes it the right tool for a one-off exploratory running total or rank on a single page, and the wrong tool for anything a second report page, or a colleague building their own report off the same dataset, will also need — write that one as a proper DAX measure instead.

The tradeoff is exactly the mirror image of a normal measure: less power (no cross-model context, no reuse), but for the specific job of "add a running total or a row-to-row comparison to what's already on this table," visual calculations get there in one line instead of a `CALCULATE`-and-`FILTER` pattern most people have to look up every time anyway.
