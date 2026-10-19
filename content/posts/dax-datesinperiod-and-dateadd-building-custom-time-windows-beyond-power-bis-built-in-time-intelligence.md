---
title: "DAX DATESINPERIOD and DATEADD: Building Custom Time Windows Beyond Power BI's Built-In Time Intelligence"
date: "2026-10-19"
tags: ["power-bi", "dax", "time-intelligence"]
excerpt: "SAMEPERIODLASTYEAR covers the standard year-over-year comparison -- DATESINPERIOD and DATEADD cover every time window that doesn't line up with a calendar boundary."
---

Power BI's built-in time-intelligence functions like `SAMEPERIODLASTYEAR` and `TOTALYTD` cover the comparisons most reports actually need, but they only cover the shapes Microsoft anticipated — a full year ago, year-to-date, quarter-to-date. The moment a stakeholder asks for "trailing 90 days" or "the same 6-week window two periods back," those named functions stop being enough, and `DATESINPERIOD` and `DATEADD` are the general-purpose tools underneath them.

**1. `DATESINPERIOD` returns a rolling window of a fixed length ending (or starting) on a given date.** Instead of a fixed calendar period, you specify a date column, a start point, a number of units, and the unit itself:

```dax
Trailing 90 Day Sales =
CALCULATE(
    SUM(Sales[Amount]),
    DATESINPERIOD(
        'Date'[Date],
        MAX('Date'[Date]),
        -90,
        DAY
    )
)
```

That builds a window of the 90 days ending on the last date in the current filter context — a rolling total that has no equivalent built-in function, because "90 days" isn't a calendar concept the way a month or quarter is.

**2. The sign and unit of the third and fourth arguments control the direction and granularity.** A negative number counts backward from the start date; a positive number counts forward. The unit can be `DAY`, `MONTH`, `QUARTER`, or `YEAR`, which is what lets the same function build a trailing-90-days measure and a rolling-6-month measure just by changing two arguments:

```dax
Rolling 6 Month Sales =
CALCULATE(
    SUM(Sales[Amount]),
    DATESINPERIOD('Date'[Date], MAX('Date'[Date]), -6, MONTH)
)
```

**3. `DATEADD` shifts a whole date range by a period, rather than defining a window length.** Where `DATESINPERIOD` builds a window of N days/months, `DATEADD` takes whatever dates are already in the current filter context and moves all of them by an offset — which is exactly what `SAMEPERIODLASTYEAR` does internally:

```dax
Sales Same Period Last Year =
CALCULATE(
    SUM(Sales[Amount]),
    DATEADD('Date'[Date], -1, YEAR)
)
```

This produces the same result as `SAMEPERIODLASTYEAR` for a year shift, but `DATEADD` also accepts `MONTH`, `QUARTER`, and `DAY`, so it covers "same period last quarter" or "same period 3 months ago" that the named shortcuts don't.

**4. Use `DATEADD` for comparisons that need to track whatever period is currently selected.** If a report has a slicer letting users pick any month, `DATEADD('Date'[Date], -1, MONTH)` inside a measure automatically compares whatever month is selected to the one before it — the comparison logic doesn't need to know in advance which month that will be.

```dax
Sales vs Prior Month =
VAR CurrentSales = SUM(Sales[Amount])
VAR PriorSales =
    CALCULATE(
        SUM(Sales[Amount]),
        DATEADD('Date'[Date], -1, MONTH)
    )
RETURN
    CurrentSales - PriorSales
```

**5. Both functions require a proper, marked date table.** Like every other time-intelligence function, `DATESINPERIOD` and `DATEADD` need a contiguous date column from a table marked as a date table (*Model view → Mark as Date Table*) — running them against a plain date column from a fact table, or a date column with gaps, produces results that look plausible but silently skip or double-count periods.

**6. Reach for the named functions first; drop to these two only when the shape doesn't fit.** `SAMEPERIODLASTYEAR`, `PREVIOUSMONTH`, and `TOTALYTD` are easier to read in a model other people will maintain, and they cover the comparisons most reports need. `DATESINPERIOD` and `DATEADD` are worth knowing specifically because they're what you reach for the first time a request doesn't match any calendar boundary Microsoft already named.

Once a report needs a window that isn't "this year vs. last year" or "month-to-date," these two functions are usually the shortest path to it — everything else tends to be the same two patterns wrapped in a different label.
