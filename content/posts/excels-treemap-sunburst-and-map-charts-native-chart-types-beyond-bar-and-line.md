---
title: "Excel's Treemap, Sunburst, and Map Charts: Native Chart Types Beyond Bar and Line"
date: "2026-09-11"
tags: ["excel", "data-visualization", "beginner"]
excerpt: "Three built-in Excel chart types for hierarchical and geographic data that most analysts skip past because they've never opened the full Insert Chart dialog."
---

Most analysts default to bar, line, and pie because those are the first icons in the Insert Chart ribbon. Scroll further and Excel has three chart types built specifically for data that doesn't fit any of those three shapes: nested categories, multi-level hierarchies, and geography.

**1. Treemap — proportions across many categories without running out of pie slices.** A pie chart falls apart past six or seven categories; a treemap can show dozens of products or cost centers as nested rectangles sized by value, with color grouping them by parent category. Select your data (a category column, optionally a subcategory column, and a value column) and go to **Insert > Insert Hierarchy Chart > Treemap**. It's the right call whenever the actual question is "which of these many things is biggest," not "how does this trend over time."

**2. Sunburst — when the hierarchy itself is part of the story.** A sunburst draws the same kind of nested category data as concentric rings instead of rectangles, with each ring representing one level of the hierarchy (region, then country, then product line). Rings make the parent-child structure more readable than a treemap's rectangles do, at the cost of being harder to compare exact sizes at a glance — use it when a viewer needs to see how a total breaks down level by level, not just which leaf category is largest.

**3. Map chart — shading regions by value without a GIS tool.** If a column already contains recognizable place names (countries, US states, or many international regions), select it plus a value column and use **Insert > Maps > Filled Map**. Excel geocodes the names automatically and shades each region on a color scale. No separate mapping software or add-in required — this has been built into Excel since 2016.

**4. Get cleaner map results with the Geography data type first.** Plain text place names sometimes geocode ambiguously (a city name that exists in three countries, for instance). Selecting the column and applying **Data > Data Types > Geography** converts each cell into a linked data type Excel has already resolved to a specific place, and a Map chart built from that column geocodes far more reliably. It also lets you pull extra fields out with a dot-reference formula:

```excel
=A2.Population
=A2."Area"
```

**5. Match the chart to the actual shape of the question.** A treemap or sunburst needs real hierarchy — a flat list of forty unrelated categories with no grouping will just look like a treemap-shaped bar chart with extra steps. And a map chart only helps if location is the point of the comparison; if you're comparing five regions on one metric, a plain sorted bar chart still reads faster than a map, since bar length is easier to compare precisely than shading intensity.

**6. Right-click to compare chart types before committing.** Once any chart is selected, **Change Chart Type** lets you flip between treemap, sunburst, and the standard types on the same selected data without rebuilding it. It's the fastest way to sanity-check "does this actually look better as a treemap" before you spend time formatting one.

None of these three need an add-in, a plugin, or a workaround — they've been sitting in the same Insert Chart dialog as bar and line for years. The next time a dataset has real hierarchy or a geographic dimension, it's worth a detour past the default chart types before defaulting to a pivot table and a bar chart out of habit.
