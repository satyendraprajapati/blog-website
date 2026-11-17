---
title: "DAX TOTALYTD, TOTALQTD, and TOTALMTD: Built-In Shortcuts for Year-to-Date Calculations"
date: "2026-11-17"
tags: ["power-bi", "dax", "time-intelligence"]
excerpt: "Three DAX functions that collapse a CALCULATE-plus-DATESYTD pattern into a single line for year-, quarter-, and month-to-date totals."
---

A lot of DAX time intelligence boils down to the same shape: take a measure, and total it from the start of some period up to the current date. You can build that with `CALCULATE` and a date-filtering function like `DATESYTD`, but Power BI also ships three functions that do the common case in one call: `TOTALYTD`, `TOTALQTD`, and `TOTALMTD`.

**1. `TOTALYTD` sums a measure from the start of the year to the current filter context.** It needs a base expression and a date column from a marked date table.
```dax
Revenue YTD = TOTALYTD(SUM(Sales[Amount]), 'Date'[Date])
```
Drop that into a visual filtered to, say, September, and it returns January through September — no separate `CALCULATE` wrapper required.

**2. `TOTALQTD` does the same thing for the current quarter.** Useful for quarterly targets where you want progress reset every three months instead of accumulating all year.
```dax
Revenue QTD = TOTALQTD(SUM(Sales[Amount]), 'Date'[Date])
```

**3. `TOTALMTD` resets at the start of each month.** This is the one analysts reach for most often, since "how are we doing this month so far" is a near-daily question in most reporting.
```dax
Revenue MTD = TOTALMTD(SUM(Sales[Amount]), 'Date'[Date])
```

**4. All three take an optional filter argument for a custom fiscal start.** If your fiscal year doesn't run January–December, pass a fourth argument to shift the year-end.
```dax
Revenue FYTD = TOTALYTD(SUM(Sales[Amount]), 'Date'[Date], "6/30")
```
That single string argument is the whole reason these functions exist as separate shortcuts — write the equivalent with `DATESYTD` and you'd pass the same fiscal year-end argument there instead, but the `TOTALx` versions read more clearly when all you need is the running total, not an intermediate date table to combine with something else.

**5. Know when to drop back to `CALCULATE` + `DATESYTD` instead.** `TOTALYTD(expr, dates)` is really shorthand for `CALCULATE(expr, DATESYTD(dates))`. The shorthand only covers a single measure with no extra filters — the moment you need to also filter by region or product category inside the same calculation, you need the longer form anyway:
```dax
Revenue YTD West = CALCULATE(
    SUM(Sales[Amount]),
    DATESYTD('Date'[Date]),
    Sales[Region] = "West"
)
```

For the plain "total so far this period" case, `TOTALYTD`, `TOTALQTD`, and `TOTALMTD` are worth defaulting to — they're one function call instead of two, and the intent of the measure is obvious from its name. Reach for `CALCULATE` with `DATESYTD`/`DATESQTD`/`DATESMTD` only once you need to combine the date logic with another filter in the same expression.
