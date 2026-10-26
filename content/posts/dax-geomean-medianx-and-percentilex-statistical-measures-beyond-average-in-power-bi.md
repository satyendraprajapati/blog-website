---
title: "DAX GEOMEAN, MEDIANX, and PERCENTILEX: Statistical Measures Beyond AVERAGE in Power BI"
date: "2026-10-26"
tags: ["power-bi", "dax", "statistics"]
excerpt: "When a plain AVERAGE measure is quietly misleading your report, and the DAX functions that give you a median, a percentile, or a growth-rate-safe mean instead."
---

`AVERAGE` is the default reach for "what's typical," and in a lot of models it's the wrong one. A handful of large outliers — one huge order, one unusually long support ticket — drag a mean away from what most rows actually look like. Power BI's DAX library has three functions built for exactly this problem, and none of them get nearly the attention `AVERAGE` does.

**1. `MEDIANX` gives you the middle value instead of the mean.** Where `AVERAGEX` sums a column and divides by the count, `MEDIANX` sorts the values and returns the one sitting in the middle — far less sensitive to a handful of extreme rows.
```dax
Median Order Value =
MEDIANX(Sales, Sales[OrderValue])
```
On a distribution with a few huge whale orders pulling the mean upward, the median often tells a truer story of what a "typical" order actually looks like — report both side by side on a distribution slide and the gap between them is itself worth calling out.

**2. `PERCENTILEX.INC` and `PERCENTILEX.EXC` answer "where does this fall relative to everyone else," not just "what's typical."** Passing `0.9` gets you the 90th percentile — the value that 90% of rows fall below — which is the right metric for SLA reporting ("95% of tickets resolved within...") where an average would hide exactly the slow cases you care about.
```dax
90th Percentile Response Time =
PERCENTILEX.INC(Tickets, Tickets[ResponseTimeHours], 0.9)
```
The `.INC` variant includes the 0th and 100th percentile as valid endpoints; `.EXC` excludes them and is the stricter definition some statistical standards expect — for most business reporting, `.INC` is the one you want, but check which convention a source dataset's existing benchmark number uses before assuming they'll match.

**3. `GEOMEAN` is the right average for rates of change, not raw totals.** Averaging a set of year-over-year growth percentages with a plain mean overstates true compound growth, because percentage changes don't average arithmetically the way dollar amounts do. The geometric mean — the nth root of the product of n values — is the one that actually matches compounding.
```dax
Avg Annual Growth Rate =
GEOMEAN('Growth Rates'[YoY Growth Factor])
```
Feed it growth *factors* (1.08 for an 8% increase), not raw percentages, or the result won't mean what you expect.

**4. Reach for `MEDIANX` or `PERCENTILEX` specifically when a histogram looks skewed, not by default.** These aren't replacements for `AVERAGE` across the board — for a genuinely symmetric distribution, the mean and median land close together and the extra function buys you nothing. The tell is a long tail: a handful of very large or very small values stretching one side of a histogram, which is exactly when the mean stops representing the bulk of the data.

**5. Put more than one on the same card to make the skew visible, not just the number.** A single KPI tile showing "Median: $340" means little without context. Pairing it with "Mean: $512" on the same visual, or adding both as reference lines on a histogram, is what actually communicates "this distribution has outliers pulling the average up" to someone who'll never open the underlying table.

**6. Remember these are iterator functions, so they need a table and row context.** Like `AVERAGEX` and `SUMX`, all three take a table as their first argument and evaluate the expression row by row before aggregating — passing a column reference alone, the way `MEDIAN` works in Excel on a cell range, isn't valid DAX syntax here.

None of these functions change what's in your model — they just ask a more honest question of the same data. For anything that gets reported as a single summary number to a stakeholder who'll make a decision based on it, it's worth a few seconds to check whether `AVERAGE` is actually answering the question, or just the first function that came to mind.
