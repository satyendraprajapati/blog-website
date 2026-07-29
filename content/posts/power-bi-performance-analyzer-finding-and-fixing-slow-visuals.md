---
title: "Power BI Performance Analyzer: Finding and Fixing Slow Visuals"
date: "2026-07-29"
tags: ["power-bi", "performance", "dashboard"]
excerpt: "How to use Power BI's built-in Performance Analyzer to find out which visual is actually slowing your report down, instead of guessing."
---

A report that felt instant with test data can crawl once it's pointed at the real dataset, and it's rarely obvious which visual is to blame just by looking at the page. Power BI Desktop has a built-in profiler for exactly this — Performance Analyzer — and it's underused compared to how often "why is this report slow" comes up.

**1. Turn it on from the View ribbon.** Go to *View → Performance Analyzer* to open the pane, then click **Start Recording**. Nothing is captured until you interact with the report, so refresh the visuals (there's a **Refresh Visuals** button) or click a slicer to generate activity to measure.

**2. Read the three timing categories, not just the total.** Each visual's entry breaks down into **DAX query** (time spent computing the measure), **Visual display** (time spent rendering), and **Other** (mostly waiting on other visuals or the overall page). A visual that's slow on DAX query time has a measure or model problem; one that's slow on visual display with a fast query is more likely a rendering-heavy visual type (a table with hundreds of conditionally-formatted rows, for instance) rather than a DAX problem.

**3. Sort by duration to find the actual bottleneck.** Click the column header to sort visuals by total time, and treat the top one or two as the whole investigation — on most slow reports, one or two visuals account for the majority of load time, and optimizing the rest first is wasted effort.

**4. Copy the slow visual's DAX query and test it directly.** Hovering a visual's entry shows a **Copy query** icon; paste that into DAX Studio (or the Power BI Desktop's own query view) to see the exact query being sent and iterate on a fix without clicking through the report each time.

**5. Check for the common causes before assuming the model needs a rebuild.** A few patterns account for most slow visuals:

```dax
-- Slow: row-by-row iteration over a large fact table for a filter
-- that could be pushed into the filter argument instead
SlowMeasure =
SUMX(
    FILTER(Sales, Sales[Status] = "Completed"),
    Sales[Amount]
)

-- Faster: let CALCULATE's filter context do the filtering
FastMeasure =
CALCULATE(
    SUM(Sales[Amount]),
    Sales[Status] = "Completed"
)
```

`CALCULATE` with a simple filter condition typically compiles to a more efficient query plan than `SUMX` iterating over a `FILTER`-ed table, especially as row counts grow. Beyond measure rewrites, watch for: too many visuals on one page all querying the same large table, DirectQuery visuals waiting on a slow source, and calculated columns doing at query time what could be precomputed in Power Query instead.

**6. Re-record after each change to confirm it actually helped.** Performance Analyzer numbers vary run to run, so compare a few recordings rather than trusting a single measurement — and clear the recording (**Clear** button) between tests so old results don't mix with new ones.

**7. Export the log for changes you want to document or share.** The **Export** button saves the recorded session as JSON, useful for showing a before-and-after to whoever asked "why is this report slow" in the first place.

Performance Analyzer won't fix anything on its own, but it turns "the report feels slow" into a specific visual, a specific query, and a specific number of milliseconds — which is what you actually need before touching a measure or the data model.
