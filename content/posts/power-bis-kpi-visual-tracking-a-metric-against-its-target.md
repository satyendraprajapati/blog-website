---
title: "Power BI's KPI Visual: Tracking a Metric Against Its Target"
date: "2026-11-03"
tags: ["power-bi", "data-visualization", "beginner"]
excerpt: "How to set up Power BI's native KPI visual to show a metric, its trend, and its progress against a goal in one compact tile."
---

A card visual shows a number. A line chart shows a trend. The **KPI visual** is Power BI's purpose-built way to show both at once, plus how that number stacks up against a target — all in a tile small enough to tile several across a dashboard header.

**Add it from the Visualizations pane like any other visual.** Look for "KPI" in the visual gallery — it's distinct from the Card and Gauge visuals, and from the separate Goals feature, which tracks metrics over time at the workspace level rather than inside a report page.

**Feed it three fields.** The KPI visual takes an Indicator (the current value, e.g. a measure for `Total Sales`), a Trend axis (usually a date field, so it can draw a small sparkline behind the number), and a Target goal (a second measure, like `Sales Target`, or a fixed value).

```dax
Sales vs Target % =
DIVIDE([Total Sales], [Sales Target]) - 1
```

A measure like this isn't required for the visual itself, but it's handy paired alongside the KPI tile to show the percentage gap as a separate card.

**Let the visual color itself automatically.** Once Indicator and Target are both set, the KPI visual shades its trend and distance-to-goal text green or red depending on whether you're ahead of or behind target — no manual conditional formatting rules to write, unlike a table or matrix.

**Set the "Direction" in formatting correctly.** In the formatting pane, check that Trend Axis direction matches your metric — for most revenue or volume metrics, higher is better, but for something like `Average Resolution Time`, lower is better, and getting this backwards flips the colors to say the opposite of what's true.

**Use it for a single headline number, not a full breakdown.** The KPI visual deliberately shows one indicator against one target — if a viewer needs to see the number broken out by region or product, that's a job for a matrix or bar chart next to it, not for cramming more fields into the KPI tile itself.

**Pair several in a row for a scorecard-style header.** A common layout is three or four KPI visuals side by side across the top of a report page — Revenue, Orders, Margin, Churn — each with its own target, giving viewers an at-a-glance read before they scroll into the detail visuals below.

It's a small visual, but it solves a specific problem well: a card alone can't show trend or target, and a line chart alone buries the single number a stakeholder actually wants first. The KPI visual is the native way to give them both without building a custom layout from scratch.
