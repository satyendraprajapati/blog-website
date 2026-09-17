---
title: "Power BI's Relative Date and Between Slicers: Filters That Update Themselves"
date: "2026-09-17"
tags: ["power-bi", "interactivity", "beginner", "dashboard"]
excerpt: "How Power BI's Relative Date and Between slicer types keep a report showing the last N days or a numeric range without anyone manually resetting dates after every refresh."
---

A normal date slicer freezes on whatever start and end dates a viewer last picked, which means every scheduled refresh quietly stops showing "the last 30 days" and starts showing whatever those two fixed dates now happen to be. Power BI has two slicer types built specifically to avoid that — Relative Date and Between — and most people never notice they exist because the default slicer style hides them under a dropdown.

**1. Switch a date field slicer to "Relative Date" from the format pane's Slicer settings.** Drag a date column into a slicer, open the Format pane, and under **Slicer settings → Options → Style**, choose **Relative Date**. The slicer now shows a simple sentence — "is in the last [5] [days]" — instead of a calendar range picker.

**2. Set the anchor to "days," "weeks," "calendar months," or "calendar years" depending on how the business actually thinks about the period.** "Last 30 days" is a rolling window that moves every day; "last calendar month" jumps once, on the 1st, and holds steady until the next month starts. Picking the wrong one is the most common complaint viewers raise about a rolling-date report — a stakeholder expecting "last month" to mean the full previous calendar month, not a 30-day rolling lookback that includes part of two different months.

**3. Set a default value and pin it, so the report opens pre-filtered instead of blank.** A Relative Date slicer with no selection shows all history until someone interacts with it — set a sensible default (e.g., "last 90 days") and lock it in place with the pin icon in the top-right of the slicer so a viewer who never touches the filter still lands on a sensible view instead of an unfiltered, slow-loading visual.

**4. Use "Between" instead of Relative Date for numeric fields, not just dates.** The same slicer style menu offers **Between** for any numeric column — a price range, an order size, a discount percentage — rendering it as a two-handle range slider rather than a list of every distinct value. This is the fix for a numeric slicer that's technically a "list" style but unusable because the field has thousands of distinct values.

**5. Remember Relative Date is evaluated against today's date at view time, not the data's last refresh.** If a dataset refreshes weekly but a viewer opens the report on a Saturday, "last 7 days" still counts back from Saturday — including days the data hasn't caught up to yet, which can make the most recent days look like a sudden drop-off. Pair a Relative Date slicer with a **Mark as Date Table**-backed measure that also checks against `MAX(the data's actual last date)` when that gap matters, rather than trusting the slicer's window alone.

**6. Relative Date and Between slicers sync across pages the same way any other slicer does.** Nothing about the slicer *type* changes how Sync Slicers works — if the rolling window needs to apply report-wide, set it up through the normal View → Sync Slicers panel exactly as you would for a Region or Category slicer.

**7. Test by leaving the report untouched overnight, not by clicking through it once.** A Relative Date slicer's whole value is that it moves without anyone touching it — the only real test is confirming the visuals actually shift the day after a refresh, not just that the slicer looks right the moment you configure it.

Once set up, a Relative Date or Between slicer removes one of the most common reasons a "live" dashboard quietly goes stale between refreshes: a filter nobody remembered to reset.
