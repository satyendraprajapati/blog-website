---
title: "Building Fiscal-Year Time Intelligence in DAX When Your Year Doesn't Start in January"
date: "2026-11-19"
tags: ["power-bi", "dax", "time-intelligence"]
excerpt: "Power BI's built-in time intelligence functions assume a calendar year unless you tell them otherwise — here's how to point them at your actual fiscal year end."
---

Most DAX time intelligence examples quietly assume the year starts on January 1st. Plenty of businesses don't run that way — a fiscal year starting in April or July is common, and if your model isn't told that, functions like `TOTALYTD` will happily calculate a "year to date" that doesn't match a single number in your company's actual reporting.

The fix isn't a different function — it's one argument most tutorials skip.

**1. Know the hidden third argument on `TOTALYTD`.** `TOTALYTD` takes an optional `year_end_date` parameter that tells it where the fiscal year actually closes. Leave it out and it defaults to December 31st.
```dax
Fiscal YTD Sales =
TOTALYTD(
    SUM(Sales[Amount]),
    'Date'[Date],
    "06/30"
)
```
That third argument — a date-like string in `"MM/DD"` format — is the single most important thing to get right. For a fiscal year running July through June, the year ends June 30th, so that's what goes there, even though no actual year in your data ends on exactly that date.

**2. Add the same argument to `TOTALQTD` and `TOTALMTD`.** Both support the identical `year_end_date` parameter, and both need it for the same reason — a fiscal quarter boundary only lines up correctly once Power BI knows when the fiscal year resets.
```dax
Fiscal QTD Sales = TOTALQTD(SUM(Sales[Amount]), 'Date'[Date], "06/30")
Fiscal MTD Sales = TOTALMTD(SUM(Sales[Amount]), 'Date'[Date], "06/30")
```

**3. Build a `Fiscal Year` column on your date table instead of repeating the logic everywhere.** Time intelligence functions handle year-to-date math, but your slicers and axis labels need an actual fiscal year label to group by. A calculated column is the cleanest way to get one:
```dax
Fiscal Year =
VAR FYEndMonth = 6
VAR CalendarYear = YEAR('Date'[Date])
VAR CalendarMonth = MONTH('Date'[Date])
RETURN
    IF(
        CalendarMonth > FYEndMonth,
        "FY" & CalendarYear + 1,
        "FY" & CalendarYear
    )
```
With a July-start fiscal year, a date in August 2026 belongs to FY2027, not FY2026 — which is exactly the kind of off-by-one mistake this column exists to prevent.

**4. Mark it as your Date table, not just a date-shaped table.** `TOTALYTD` and friends need the date column to come from a table Power BI recognizes as a proper date table — one marked via Table Tools → Mark as Date Table, pointing at a column with one row per calendar day and no gaps. Without that, the fiscal-year argument won't save you; the functions won't resolve correctly in the first place.

**5. Sanity-check against a known fiscal-year total.** Before trusting the measure in a published report, filter to a completed prior fiscal year and compare the YTD total on the last day of that year to whatever total your finance team already reports for that year. If they match, the offset is right. If they're off, it's almost always the `year_end_date` string — check it's using the day *before* the new fiscal year starts, not the day it starts.

Getting this right once, in the date table and the core YTD/QTD/MTD measures, means every visual built on top of them inherits the correct fiscal boundary automatically — instead of every report builder on the team re-deriving the same offset by hand.
