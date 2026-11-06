---
title: "Power BI's 'Show Items With No Data': Keeping Empty Categories Visible in Your Visuals"
date: "2026-11-06"
tags: ["power-bi", "data-visualization", "beginner"]
excerpt: "Why Power BI visuals silently drop categories with zero rows, and the toggle that keeps them on the chart."
---

By default, a Power BI visual only shows a category if at least one fact row exists for it in the current filter context. A product that had zero sales last month, a region with no incidents this week, a status that nobody currently has — all of them just vanish from the chart instead of showing as zero. That's usually the wrong behavior for a report meant to show the full picture.

**1. Turn it on per field.** Right-click the field in question — on the axis, legend, or rows of a table/matrix — and choose "Show items with no data." It's a per-field toggle, not a visual-wide setting, so a matrix with both a category and a sub-category needs it checked on whichever level is dropping rows.

**2. It only works off a proper dimension table.** This setting relies on the category existing somewhere even when the fact table has no matching rows — which means the field has to come from a dimension table related to your fact table, not a column pulled directly out of the fact table itself. If your model is one flat table, there's no missing-category list for Power BI to fall back on, and the toggle has nothing to restore.

**3. Blank rows usually need a measure, not a count.** A measure like `COUNTROWS(Sales)` returns blank for a category with no matching rows, and Power BI will often still hide a blank result depending on the visual. Wrapping it so it returns an explicit zero fixes this:
```dax
Order Count = COUNTROWS(Sales) + 0
```
The `+ 0` forces a true `0` instead of `BLANK()`, and most visuals treat an explicit zero as something to plot rather than something to drop.

**4. Watch what it does to totals and averages.** Showing empty categories is great for a bar chart — a visible zero-height bar tells the real story. It's less great for a table that now has extra blank-looking rows, or an average measure where the newly visible zero rows pull the average down. Check any summary numbers on the page after turning this on.

**5. Good candidates: anything where "missing" should look different from "doesn't exist."** A status report, a coverage chart ("which of our 50 stores reported this week"), or a QA dashboard ("which test categories had zero failures") are all cases where an absent bar reads as "not tracked" when it should read as "zero." Turning on "Show items with no data" is the fix, and it's one of those settings that's easy to miss because the default failure mode — a chart that just looks a little smaller than expected — doesn't look like an error.
