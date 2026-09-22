---
title: "Building a Bump Chart to Show Ranking Changes Over Time Natively in PowerPoint"
date: "2026-09-22"
tags: ["powerpoint", "data-visualization", "beginner"]
excerpt: "When the story is who moved up and who fell behind, a bump chart tracks rank instead of raw value -- and PowerPoint can build one from a plain line chart with an inverted axis."
---

A line chart plotting revenue by product over six months answers "how much." It doesn't answer "who's winning" nearly as clearly, especially once you have more than three or four lines crossing each other at different heights. A bump chart fixes that by plotting rank instead of raw value on the vertical axis — every line sits on a whole-number position (1st, 2nd, 3rd...) and the chart becomes entirely about movement, not magnitude. PowerPoint has no dedicated "bump chart" type, but a standard line chart with one adjustment builds one cleanly.

**1. Rank your data before it ever reaches PowerPoint.** The chart needs each period's values already converted to a rank, not the raw numbers. If your source is Excel, this is a single `RANK` formula per period:
```excel
=RANK(B2, B$2:B$6, 0)
```
Do that for every product in every month so the table PowerPoint's chart pulls from is entirely 1s, 2s, 3s, and so on — not dollar figures.

**2. Insert a standard Line chart and plot rank on the Y-axis, period on the X-axis.** At this point it'll look upside down: rank 1 (the top performer) plots at the bottom of the chart, and rank 5 plots near the top, because a normal axis counts upward.

**3. Reverse the vertical axis so rank 1 sits at the top.** Right-click the axis, open Format Axis, and check "Values in reverse order." This is the one non-obvious step that turns a rank chart into a genuine bump chart — without it, the line for your best-ranked product visually reads as "worst," which undercuts the entire point of the chart.

**4. Force the axis to whole-number steps matching your number of categories.** Under Format Axis, set the minimum to 1, the maximum to the number of items you're ranking, and the major unit to 1. A rank axis showing 1.5 or 2.5 as tick marks looks like a mistake, because ranks are never fractional.

**5. Label lines directly instead of relying on a legend.** With several lines converging and crossing, a color-coded legend off to the side forces the audience to look back and forth constantly. Add a text box at the right edge of each line with the product or rep name, matched to that line's color, so the reading is "trace this line, see the name at the end" instead of "match this color, find it in the key."

**6. Use markers at every data point, not just the line itself.** Turning on markers (Format Data Series > Marker) makes each period's exact rank scannable at a glance, and makes it easier to spot the specific month a crossover happened instead of just the general direction.

**7. Reach for this over a stacked bar or a plain line chart specifically when the audience's real question is competitive position, not absolute size.** A bump chart deliberately throws away the magnitude of the gap between 1st and 2nd place — if "how much better" matters as much as "who's ahead," a regular line chart with the raw values is the more honest choice.

The result reads almost like a race-standings chart: flat stretches where the order holds, and diagonal crossings exactly where two lines swap places — which is usually the moment in the data a stakeholder actually wants to talk about.
