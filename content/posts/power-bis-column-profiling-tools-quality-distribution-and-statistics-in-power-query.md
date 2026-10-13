---
title: "Power BI's Column Profiling Tools: Quality, Distribution, and Statistics in Power Query"
date: "2026-10-13"
tags: ["power-bi", "power-query", "data-cleaning"]
excerpt: "Three panels in the Power Query Editor that show you exactly how messy a column is before you write a single transformation step."
---

Most people open the Power Query Editor, look at a column of data, and start cleaning based on what they can see in the first few hundred visible rows. That's a guess. Power BI has three built-in profiling tools that replace the guess with an actual count — they're off by default because they cost a bit of performance on large tables, but turning them on before you touch a new dataset pays for itself immediately.

**1. Turn them on from the View tab.** In the Power Query Editor, go to **View → Data Preview** and check **Column quality**, **Column distribution**, and **Column statistics**. By default Power BI only profiles the first 1,000 rows for speed; for anything you're about to build real logic on, switch to profiling the entire dataset via the status bar at the bottom of the window first.

**2. Column quality** shows a small colored bar under each column header — green for valid, red for error, gray for empty — with the exact percentages. This is the fastest way to catch a column that looks fine in the preview but is actually 8% errors further down, the kind of thing that silently breaks a relationship or a measure later and takes an hour to trace back to its source.

**3. Column distribution** shows a mini bar chart of value frequency, plus two numbers above it: distinct count and unique count. The difference between those two numbers matters more than either one alone — a column with 50 distinct values but only 12 unique ones is full of duplicates, while a column where distinct and unique match tells you it's a safe candidate for a relationship key.

**4. Column statistics** (right-click a column → right-click again on the header, or view it alongside the other two panels) gives min, max, average, and standard deviation for numeric columns without you writing a measure to check. It's a sanity check, not a report — if a "quantity sold" column has a max of 48,000 on a dataset of individual retail transactions, that's a data entry error worth finding before it inflates a dashboard total, not a real sale.

**5. Use what you find to decide the next transformation step, not after the fact.** The value of profiling is that it changes what you do next instead of confirming what you already built. A column flagging errors in Column quality is a cue to add a step right there:
```m
Table.ReplaceErrorValues(
    Source,
    {{"Quantity", 0}}
)
```
That replaces error values in the `Quantity` column with `0` instead of letting them propagate downstream, where they'd either break a sum or silently exclude rows depending on how the next step handles them.

The three panels take about ten seconds to turn on and read, and they catch the exact class of problem — hidden errors, fake uniqueness, outlier values — that usually surfaces three steps later as "why is this total wrong," long after you've forgotten which column it came from.
