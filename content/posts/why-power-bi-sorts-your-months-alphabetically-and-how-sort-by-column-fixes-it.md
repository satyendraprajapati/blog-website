---
title: "Why Power BI Sorts Your Months Alphabetically (and How Sort By Column Fixes It)"
date: "2026-11-16"
tags: ["power-bi", "data-modeling", "beginner"]
excerpt: "A chart that lists months as April, August, December... isn't a bug -- it's Power BI sorting text the only way it knows how, and Sort By Column is the one-click fix."
---

Load a "Month" column into a chart and Power BI will cheerfully sort it A to Z: April, August, December, February... That's not a bug. Power BI sorts a text column alphabetically because that's the only ordering it has any reason to assume — it has no idea April comes before August in a calendar. Here's how to actually fix it instead of working around it.

**1. The root cause is that Power BI treats a column's values at face value.** Whether your "Month" column holds the text `"April"` or the number `4`, Power BI sorts by what's literally in the column unless you tell it otherwise. A number column sorts correctly by coincidence; a text column doesn't, because there's no implicit calendar logic behind the word "April."

**2. Sort By Column lets you point one column at another for ordering.** In the Table view (or Model view), select the Month column, go to the **Column tools** ribbon, and click **Sort by Column**. Pick a different column that holds the correct order — typically a `MonthNumber` column (1–12) sitting right next to your `Month` text column in the same table. From then on, every chart, slicer, and table that uses `Month` sorts by `MonthNumber` behind the scenes, while still displaying the readable month name.

**3. You need that helper column to exist first.** If your date table doesn't already have a numeric month column, add one with a simple calculated column in DAX:

```dax
MonthNumber = MONTH('Date'[Date])
```

Create it once on your date table, then use `Sort by Column` on `Month` (or `MonthName`, or `Weekday`) to point at it. The same pattern fixes weekday names (Monday before Tuesday, not alphabetically) and fiscal period labels that don't sort correctly on their own.

**4. It's a one-time setup per column, not a per-visual setting.** This is the detail that trips people up: Sort by Column is a model-level property on the column itself, so you set it once and every visual across every report page that uses that column inherits the correct order automatically — you never touch it again, even in a brand-new visual built later.

**5. If you're building a proper date table anyway, build the sort columns into it from the start.** A well-built date table already has `MonthNumber`, `Year`, and `Weekday Number` columns sitting alongside their text equivalents for exactly this reason — sorting is one of the main jobs a dedicated date table exists to solve cleanly, alongside the time-intelligence functions that depend on it.

Once the sort is set, you can stop fighting the chart's x-axis order and trust that any report built on that table will read left to right the way a calendar actually works.
