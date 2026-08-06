---
title: "Power BI Incremental Refresh: Loading Only New Data Instead of the Whole Table"
date: "2026-08-06"
tags: ["power-bi", "performance", "refresh"]
excerpt: "How to set up incremental refresh in Power BI so a scheduled refresh reloads only new or changed rows instead of re-importing the entire fact table every time."
---

A scheduled refresh that re-pulls every row of a multi-year fact table every time is slow, and it only gets slower as the table grows — most of what it's re-downloading hasn't changed since yesterday. Incremental refresh fixes that by teaching Power BI which rows are old and settled, and which are new enough to actually need reloading.

**1. Understand what problem it solves before setting it up.** Incremental refresh partitions a table by date behind the scenes, so a scheduled refresh only reprocesses the partitions you've told it are still "live" — say, the last 5 days — and leaves years of historical partitions untouched. The gain isn't just speed; it's also lower load on the source system, since most of the table simply isn't queried on a routine refresh anymore.

**2. Add the two required parameters before anything else.** Power BI Desktop needs exactly two parameters, named `RangeStart` and `RangeEnd`, both of type Date/Time, created from *Manage Parameters* in Power Query. These aren't arbitrary values you fill in — Power BI substitutes its own range into them during policy setup and at refresh time.

**3. Filter your query's date column using those parameters.** In Power Query, filter the fact table's date column to be between `RangeStart` and `RangeEnd`:
```m
Table.SelectRows(Source, each [OrderDate] >= RangeStart and [OrderDate] < RangeEnd)
```
This is what makes the table "partitionable" — Power BI can only split it into date ranges if the query itself is already filtering on a date range with those exact parameters.

**4. Set the policy by right-clicking the table, not the report.** With the parameters and filter in place, right-click the table in the Fields pane → *Incremental refresh*. This is where you define how much history to keep (say, 5 years) and how much of the recent window counts as "still changing" and should be refreshed every time (say, the last 10 days).

**5. Decide whether you need "detect data changes" or a full refresh of the incremental window.** By default, Power BI fully reprocesses every partition inside the refresh window on every run — safe, but wasteful if only a handful of rows actually changed. *Detect data changes* lets you point at a "last modified" column so Power BI only reprocesses partitions where that column indicates something actually changed, which needs that column to exist and be reliable in the source.

**6. Publish before you can see it working — it does nothing in Desktop.** Incremental refresh only takes effect once the report is published to the Power BI Service and refreshed there; Power BI Desktop always does a full refresh of whatever's in the current file, so testing the policy means publishing and watching the first couple of scheduled runs, not checking Desktop refresh times.

**7. Know it needs Power BI Pro at minimum, and the source needs to support query folding for the real payoff.** Incremental refresh works without query folding, but the speed benefit is much smaller if Power Query can't push the date filter down to the source database — for a folding-capable source like SQL Server, the first refresh after setup is still slow (it has to build every historical partition), but every refresh after that is fast.

The setup cost is entirely front-loaded — once the partitions exist, a nightly refresh on a multi-million-row fact table can drop from an hour to a couple of minutes, without changing anything about what the report shows.
