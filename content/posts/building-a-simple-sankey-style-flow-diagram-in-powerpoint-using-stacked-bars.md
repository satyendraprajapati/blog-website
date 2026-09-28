---
title: "Building a Simple Sankey-Style Flow Diagram in PowerPoint Using Stacked Bars"
date: "2026-09-28"
tags: ["powerpoint", "data-visualization", "beginner"]
excerpt: "PowerPoint has no native Sankey chart, but a stacked bar chart and a few reshaped connector shapes get close enough to show where a quantity splits and where it flows to."
---

A Sankey diagram — the classic chart where a flow splits into bands of proportional width, like traffic entering a funnel and branching into outcomes — is a natural fit for showing things like "of 10,000 site visitors, how many became leads, then customers, by channel." PowerPoint's native chart types cover waterfall, funnel, treemap, and sunburst, but not Sankey. For a genuinely complex multi-stage flow, building the real thing in Excel or a charting library and dropping in a picture is the right call — but for a simple two- or three-stage split, a stacked bar chart with a few shapes gets you a readable equivalent without leaving PowerPoint.

**1. Start with a 100% stacked bar chart as the skeleton, not a regular stacked bar.** Two stacked columns — one for the "before" state, one for "after" — each summing to the same total, give you two proportional stacks to visually connect. Insert a Stacked Column chart, put your "before" categories in one column of data and "after" categories in the next, and set both to the same total so the bar heights match.

**2. Reorder the stack segments so a flow from one column to the other lines up vertically.** PowerPoint stacks series in the order they appear in the data, top to bottom — if "Email leads" in the before-column and "Email customers" in the after-column aren't in matching stack positions, the visual connection between them won't make sense. Sort both columns' categories the same way before charting.

**3. Draw the connecting bands with the Freeform (or Curve) shape tool, not a straight line.** Select the Freeform: Shape tool under Insert → Shapes, click the four corners of a band — top-left and bottom-left at the right edge of the "before" segment, top-right and bottom-right at the left edge of the matching "after" segment — and close the shape. This gives you a quadrilateral that visually joins the two bars.

**4. Curve the band's edges after drawing it, so it reads as a flow rather than a hard-edged parallelogram.** Right-click the shape → Edit Points, then drag the midpoint of each side outward slightly to bow it. A gentle S-curve between the two bars is what makes the eye read it as "flowing" rather than "two disconnected rectangles with a wedge between them."

**5. Set each band's fill to match its origin category, then lower the opacity to 40–50%.** Coloring the band by where it started (not where it ends) makes it easy to trace "where did this segment's volume go" with your eye. Dropping the opacity keeps overlapping bands from turning into a solid, unreadable block where several flows cross.

**6. Send every band shape behind the two bar charts, in one step.** Select all the band shapes, right-click → Send to Back, and check that both charts are set to a solid (non-transparent) background fill — otherwise a band drawn behind the bars will show through the bar chart's own background instead of stopping cleanly at its edge.

**7. Label totals on the bars themselves, and stop there.** A real Sankey tool prints a value on every band; recreating that by hand in PowerPoint gets crowded fast once you're editing bands as freeform shapes. Two or three clearly labeled stacks with color-coded flows between them communicate the same "where did it go" story without turning the slide into a shape-editing exercise.

This only scales to two or three stages before the freeform shapes become more work than the picture is worth — past that point, generating the diagram in Excel, Python, or a dedicated charting tool and pasting it in as an image is the faster and more accurate path.
