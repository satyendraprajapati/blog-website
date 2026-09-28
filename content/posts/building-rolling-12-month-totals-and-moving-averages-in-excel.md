---
title: "Building Rolling 12-Month Totals and Moving Averages in Excel"
date: "2026-09-28"
tags: ["excel", "data-analysis", "formulas"]
excerpt: "Calendar-year summaries hide the trend inside them — here's how to build a rolling 12-month total and moving average in Excel that updates automatically as new months of data arrive."
---

A calendar-year total resets every January, which makes it a poor way to spot a trend — a slow decline that started in October gets buried by the fresh start of a new year. A rolling total (also called a trailing or moving total) fixes that by always summing the most recent N periods, regardless of where the calendar sits. Here's how to build one that stays correct as new months are added.

**1. Anchor the calculation to a single reference date.** Rather than hardcoding "last 12 months" into every formula, put the as-of date in one cell (say `B1`) and build every rolling formula off it. When the report needs to move forward a month, you change one cell instead of every formula in the sheet.

**2. Use `SUMIFS` with a rolling date window.** For a rolling 12-month total ending at the reference date, sum everything strictly after 12 months before it and on-or-before it:
```excel
=SUMIFS(Sales[Revenue], Sales[Date], ">"&EOMONTH($B$1,-12), Sales[Date], "<="&$B$1)
```
`EOMONTH($B$1,-12)` gives the end of the month 12 months back, so the window always covers exactly 12 full calendar months ending at your reference date — no double-counting a partial month at either edge.

**3. Build the whole rolling column at once with a dynamic array.** If you have a list of month-end dates in a column and want a rolling total next to each one, `BYROW` with `LAMBDA` avoids copy-pasting the `SUMIFS` formula down the sheet by hand:
```excel
=BYROW(MonthEnds, LAMBDA(d, SUMIFS(Sales[Revenue], Sales[Date], ">"&EOMONTH(d,-12), Sales[Date], "<="&d)))
```
Add a new month to `MonthEnds` and the whole column recalculates and spills automatically.

**4. Swap `SUMIFS` for `AVERAGEIFS` to get a moving average instead of a total.** Same window, different aggregation — useful for smoothing a noisy weekly or daily series before charting it:
```excel
=AVERAGEIFS(Sales[Revenue], Sales[Date], ">"&EOMONTH($B$1,-12), Sales[Date], "<="&$B$1)
```

**5. Watch for an incomplete current period skewing the number.** If this month's data is only three days old, a rolling total that includes it will look like a cliff-drop compared to last month's full 30 days. Either exclude the current, still-accumulating period from the window, or clearly label the chart's last point as partial so nobody reads it as a real decline.

**6. Chart the rolling series instead of the raw one when the goal is trend, not detail.** Plot the rolling total or average as its own line next to the raw monthly bars — the raw bars show the actual ups and downs, and the rolling line shows whether the underlying direction is up, down, or flat, without either obscuring the other.

Once the reference date and window length live in their own cells, the same pattern handles a rolling 3-month, 6-month, or 90-day version just by changing the offset — you're not maintaining several different formulas, only one shape of formula with a different number plugged in.
