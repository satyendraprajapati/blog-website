---
title: "Power BI Time Intelligence: Comparing This Period to Last Year"
date: "2026-07-20"
tags: ["power-bi", "dax", "time-intelligence"]
excerpt: "The DAX time intelligence functions that turn a single revenue measure into year-over-year and running-total comparisons."
---

"How does this compare to last year?" is one of the most common questions a stakeholder asks of a dashboard, and it's exactly what DAX's time intelligence functions are built for. They all lean on the same requirement and a small set of predictable patterns.

**0. You need a proper Date table first.** Time intelligence functions only work correctly against a continuous, marked date table related to your fact table — not the dates buried inside your sales table itself. If you haven't marked one as a date table (Modeling → Mark as Date Table), stop here and do that first; every function below silently misbehaves without it.

**1. `SAMEPERIODLASTYEAR` for the direct year-over-year comparison.** It shifts your existing date filter back exactly one year, so you can reuse whatever measure you already have.
```dax
Revenue LY =
CALCULATE([Total Revenue], SAMEPERIODLASTYEAR('Date'[Date]))
```

**2. `DATEADD` when you need something other than a full year.** `SAMEPERIODLASTYEAR` only does one-year shifts; `DATEADD` takes a number and an interval (`DAY`, `MONTH`, `QUARTER`, `YEAR`), so it also covers "same month last quarter" style comparisons.
```dax
Revenue Prior Month =
CALCULATE([Total Revenue], DATEADD('Date'[Date], -1, MONTH))
```

**3. `TOTALYTD` for a running year-to-date total.** Rather than shifting the filter, this expands it — accumulating from the start of the fiscal year up to whatever date is currently in context, which is what most "YTD revenue" cards are actually built on.
```dax
Revenue YTD =
TOTALYTD([Total Revenue], 'Date'[Date])
```

**4. Wrap the comparison in a percentage-change measure.** Raw "this year" and "last year" numbers side by side make people do mental subtraction; a explicit growth measure does it for them and is what usually ends up on the card visual.
```dax
Revenue YoY % =
DIVIDE([Total Revenue] - [Revenue LY], [Revenue LY])
```
Using `DIVIDE` instead of `/` here matters — it returns a blank instead of an error when last year's revenue is zero, which keeps the visual from breaking on a new product line with no prior-year history.

**5. Watch for partial periods skewing the comparison.** If today is July 20th, a naive YTD-vs-YTD comparison is comparing 201 days of this year against a full prior year unless you're careful — for month-in-progress or year-in-progress comparisons, filter both sides to the same relative cutoff, or label the card clearly as "through July 20" so it isn't read as a full-period result.

Once these are in place, the same handful of measures — LY, prior period, YTD, and YoY% — cover almost every "how are we trending" question a dashboard gets asked, without writing a new measure for each date range someone requests.
