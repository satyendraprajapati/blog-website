---
title: "Building a Progress Ring Chart in PowerPoint to Show a Single KPI's Percent Complete"
date: "2026-11-27"
tags: ["powerpoint", "data-visualization", "beginner"]
excerpt: "A progress ring turns one percentage into a clean circular indicator using nothing but a two-slice doughnut chart with its colors, hole size, and rotation tuned by hand."
---

A gauge chart shows one KPI against a target, but it needs a needle, tick marks, and a fair amount of slide space to read correctly. For a plain "how much of this is done" number — percent of budget spent, percent of a project complete, percent of quota hit — a progress ring is lighter, more familiar from app dashboards, and builds natively in PowerPoint from a doughnut chart with no add-in required.

**1. Start from a two-value doughnut chart, not a pie.** Insert → Chart → **Doughnut**, with exactly two data points: the KPI's value and its remainder. For a metric at 72%, that's `72` and `28` (100 minus 72). The first slice becomes the visible progress arc; the second fills in the rest of the circle.

**2. Hide the remainder slice instead of coloring it like data.** Right-click the remainder wedge → **Format Data Point** → set its fill to **No Fill**, or a very light gray if you want a faint background track. Give the progress slice your actual brand or status color. Only one of the two slices should look like it's carrying information.

**3. Widen the hole so it reads as a ring, not a pie with a bite missing.** Click the chart → **Format Data Series** → push **Doughnut Hole Size** up to somewhere around 70–80%. A thin band around a large empty center is what makes this look like a progress indicator instead of a two-category statistics chart.

**4. Rotate the start point to 12 o'clock.** Still in **Format Data Series**, set **Angle of First Slice** to `0` (adjust if your chart's first-listed value isn't the progress slice). Progress rings everywhere start at the top and move clockwise — starting anywhere else makes the ring read like a stopped clock instead of a percentage.

**5. Drop the number itself into the hole as a text box, not a data label.** PowerPoint's native data labels attach to a slice, and a doughnut's center hole has no slice to attach to. Add a separate text box sized to sit inside the ring, type the percentage in large bold type, then select both the chart and the text box and **Group** them — grouping keeps the number centered automatically if the ring is later resized or moved.

**6. Rebuild it per KPI by changing two numbers, not the whole chart.** Because the entire chart is driven by one value and its complement, copying this ring to a second KPI slide is a paste-and-edit-two-cells job. That's the real case for building one of these over reaching for a plain "72%" callout every time — the one-time setup on the first ring pays for itself on every KPI slide that follows it.

Stack several of these side by side — on-time %, budget %, scope %, each its own small ring — and a status slide reads faster than the same three numbers written out as plain text, without needing a gauge's extra space to do it.
