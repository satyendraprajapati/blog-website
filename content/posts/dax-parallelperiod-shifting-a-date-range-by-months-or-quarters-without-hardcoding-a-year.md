---
title: "DAX PARALLELPERIOD: Shifting a Date Range by Months or Quarters Without Hardcoding a Year"
date: "2026-11-25"
tags: ["power-bi", "dax", "time-intelligence"]
excerpt: "PARALLELPERIOD moves a whole period boundary back by months, quarters, or years instead of shifting individual dates, which matters when a fiscal month has 28, 30, or 31 days."
---

Power BI's time intelligence functions all look similar on the surface, but `PARALLELPERIOD` solves a specific problem `DATEADD` doesn't: it shifts complete period boundaries, not individual days. If you've ever compared "this month" to "last month" with `DATEADD` and gotten a mismatched day count because February is shorter than January, `PARALLELPERIOD` is the fix.

**1. The core difference from `DATEADD`.** `DATEADD` shifts every date in the current filter by an exact number of days, months, or years, keeping the same day-of-month alignment. `PARALLELPERIOD` instead finds the full calendar period — the whole month, quarter, or year — that comes N periods before or after the current one, regardless of how many days are in each.
```dax
Sales Last Month :=
CALCULATE (
    [Total Sales],
    PARALLELPERIOD ( 'Date'[Date], -1, MONTH )
)
```
That returns the complete previous month's total, even if the current filter context only covers a partial month (say, the first 10 days), because `PARALLELPERIOD` expands to the full period rather than mirroring the exact date range.

**2. Why that expansion matters for month-to-date comparisons.** If today is November 12 and your report filters to "month to date," `DATEADD(-1, MONTH)` gives you October 1–12 — a fair like-for-like comparison. `PARALLELPERIOD(-1, MONTH)` instead gives you all of October, which is the right choice when the measure next to it is a full-month total like a budget or a target, not a running MTD figure. Picking the wrong one of the two is the most common source of a "why don't these two numbers compare fairly" bug report.

**3. Quarters and years work the same way.**
```dax
Sales Same Quarter Last Year :=
CALCULATE (
    [Total Sales],
    PARALLELPERIOD ( 'Date'[Date], -4, QUARTER )
)
```
Shifting by `-4` quarters lands on the same quarter a year back — there's no `YEAR`-specific shortcut needed beyond adjusting the count, since `PARALLELPERIOD` always works in whole periods of the unit you specify.

**4. It needs a proper date table.** Like every DAX time intelligence function, `PARALLELPERIOD` requires a continuous, marked date table with no gaps — it reasons about calendar periods, not the specific dates present in your fact table. If your date table is missing days (built only from dates that appear in a sales table, say), the period boundaries it calculates will be wrong even though the formula runs without error.

**5. Prefer `CALCULATE` with `PARALLELPERIOD` over DIY date math.** It's tempting to build the previous period's start and end with `EOMONTH` and `DATE()` arithmetic in a variable, but that reimplements exactly what `PARALLELPERIOD` already does, with more room for an off-by-one error around month and year boundaries. Reach for the built-in function first and only drop to manual date math for non-standard periods it can't express.

The function is narrow by design — it only handles whole-period shifts — but for "same month/quarter/year, N periods back" comparisons against targets or budgets, it's usually the more correct choice over `DATEADD`.
