---
title: "Building a Gauge Chart Natively in PowerPoint to Show a Single KPI Against a Target Range"
date: "2026-11-06"
tags: ["powerpoint", "data-visualization", "beginner"]
excerpt: "How to build a speedometer-style gauge chart in PowerPoint using a doughnut chart, without an add-in."
---

A gauge (speedometer) chart is a quick way to show one number against a range — a satisfaction score, a utilization rate, a single KPI versus a red/amber/green band — when a full KPI dashboard slide would be overkill for a single metric. PowerPoint has no built-in gauge chart type, but it's straightforward to fake convincingly with a doughnut chart.

**1. Build the background band as a doughnut chart.** Insert a doughnut chart with one series split into three values that sum to your scale — for example 60/20/20 for a 0–100 scale with a "good" zone up to 60, "watch" up to 80, and "risk" above that. Color the three slices red/amber/green (or your palette) and set the doughnut hole size large, around 60–70%, so it reads as a ring rather than a pie.

**2. Rotate it into a half-circle.** Right-click the series, open Format Data Series, and under Series Options set the angle of the first slice to 270°. Then add a fourth, invisible slice equal to the sum of the other three (no fill, no border) to push the visible band into the bottom half of the circle — this is the standard trick for turning a full doughnut into a gauge arc.

**3. Add the needle as a separate pie chart layered on top.** A second, transparent pie chart with two slices — one representing the current value, one representing the remainder up to the max, plus the same invisible fourth slice to mirror the rotation — gives you a layer you can place a thin triangle or line shape on, positioned at the angle matching the value. It's manual positioning rather than a formula-driven pointer, so you're nudging the needle shape by eye, lining it up against the band using the slide's gridlines for the pivot point.

**4. Add the number as a text box, not a chart label.** Gauge charts read fastest when the number is large and sits below or inside the arc rather than as a tiny data label on the chart itself. A text box linked to the source cell (see the "linking a live Excel number into PowerPoint text" approach) keeps the displayed figure in sync if the underlying number changes before you present.

**5. Use it sparingly.** A gauge is good for exactly one thing: a single number against a known good/bad range, viewed for two seconds in passing. It's a poor choice for comparing several KPIs side by side — a row of simple KPI cards or a bullet chart communicates relative performance faster than a row of gauges, and a gauge built from two stacked, manually-aligned charts is more fragile to edit later than almost any other native PowerPoint chart. Reach for it when the "speedometer" framing genuinely matches how the audience thinks about the metric, not because it looks more impressive than a number and a colored background.

It takes more fiddling than any of PowerPoint's native chart types, but for a single headline metric on an exec summary slide, it's a recognizable shape that needs no explanation.
