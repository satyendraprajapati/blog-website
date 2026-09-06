---
title: "Power BI's Mark as Date Table: Why Time Intelligence Functions Need a Proper Date Table"
date: "2026-09-06"
tags: ["power-bi", "data-modeling", "dax"]
excerpt: "SAMEPERIODLASTYEAR and DATESYTD can silently return wrong numbers on an ordinary date column — marking a real date table fixes it."
---

A column of dates that looks perfectly fine in a table visual can still be the wrong foundation for time intelligence — functions like `SAMEPERIODLASTYEAR`, `DATESYTD`, and `TOTALYTD` all expect to work against a table Power BI recognizes as a date table, not just any column that happens to hold dates. Skip the setup and you don't get an error; you get a measure that runs, returns a plausible-looking number, and is quietly wrong.

**1. Know what these functions actually require.** Time-intelligence functions rely on the date column being contiguous (no gaps), covering full calendar years, containing unique values, and living in a table Power BI has been told is a date table. If your `Date` column comes from a transaction table with sales-only dates, it's missing weekends, holidays, and any day with no sales — exactly the kind of gap that breaks a year-over-year comparison without warning.

**2. Build a dedicated date table instead of relying on transaction dates.** The cleanest fix is a separate table with one row per calendar day, related to your fact table on the date key. `CALENDAR` or `CALENDARAUTO` generates one in a few lines:

```dax
DimDate = CALENDAR(DATE(2020,1,1), DATE(2026,12,31))
```

Add `Year`, `Month`, `Quarter`, and `MonthName` calculated columns to it for slicers and axis labels, since a bare date column alone isn't much use in a visual.

**3. Mark it explicitly — Power BI won't guess.** Select the table in the Fields pane, go to the **Table tools** ribbon, and choose **Mark as Date Table**, then pick the column holding the actual date values. This is the step that's easy to skip because everything still *works* without it in the simplest cases — right up until a time-intelligence function needs it and returns numbers that are off by a period or silently blank for edge dates.

**4. Watch for the model-level warning if you skip it.** An unmarked date table used inside a time-intelligence function doesn't always throw a hard error — sometimes it just produces a subtly wrong total, especially around fiscal year boundaries or partial months. If a YoY measure looks suspiciously close to last year's total for the *wrong* year, an unmarked or incomplete date table is one of the first things worth checking.

**5. Relate it on the date key, not by name-matching alone.** The relationship between your date table and the fact table needs to be built explicitly in Model view, from the date table's date column to the corresponding date column in the fact table — Power BI won't infer it just because two columns are both called "Date."

**6. Keep exactly one marked date table per model.** Having a second table also marked as a date table, or relying on multiple unrelated date columns across different fact tables, produces ambiguous filter behavior. If you need time intelligence against more than one date field on the same fact table (order date and ship date, for example), use `USERELATIONSHIP` to activate the second relationship for specific measures rather than marking a second date table.

A marked, contiguous date table is a five-minute setup that every DAX time-intelligence formula quietly assumes exists — it's worth building before you write the first `SAMEPERIODLASTYEAR` measure, not after a stakeholder catches a number that doesn't add up.
