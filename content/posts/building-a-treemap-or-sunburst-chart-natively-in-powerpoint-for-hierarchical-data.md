---
title: "Building a Treemap or Sunburst Chart Natively in PowerPoint for Hierarchical Data"
date: "2026-10-13"
tags: ["powerpoint", "data-visualization", "beginner"]
excerpt: "When your data has a region-within-category-within-total structure, a treemap or sunburst shows the hierarchy a stacked bar chart can only hint at."
---

A stacked bar chart can show two levels of a hierarchy at a push — category and sub-category — before it turns into an unreadable wall of color segments. Treemap and sunburst charts are built for exactly this problem: both are native Office chart types, so you don't need an add-in, and both handle three or more nested levels (region → country → product line, say) in a single visual.

**1. Know which one fits your data before picking.** A treemap uses nested rectangles sized by value — bigger rectangle, bigger number — and reads best when you mainly care about relative size at the lowest level. A sunburst uses concentric rings, with each ring representing one level of the hierarchy, and reads best when the *levels themselves* are part of the story (it's visually obvious which ring is "region" versus "product"). If your audience needs to compare magnitudes quickly, default to a treemap; if they need to trace a path from total down through each level, use a sunburst.

**2. Structure your source data as a multi-column hierarchy, not a flat list.** Both chart types expect your data arranged with each hierarchy level in its own column, outermost first, and the value last:
```
Region      Country     Product        Revenue
North       USA         Laptops        42000
North       USA         Monitors       18500
North       Canada      Laptops        15200
South       Mexico      Laptops        9800
```
Leave the `Region` cell blank on repeated rows rather than retyping it — PowerPoint's chart engine groups rows by the hierarchy columns automatically, and the grouping is what builds the nesting.

**3. Insert it from the standard chart gallery.** Go to **Insert → Chart → Hierarchy**, then choose **Treemap** or **Sunburst**. PowerPoint opens an embedded Excel sheet for your data — paste your hierarchy table in exactly as structured above, delete the placeholder rows, and the chart updates live as you edit.

**4. Collapse a treemap to two levels if three makes it unreadable.** A treemap with three nested levels and a dozen categories can produce rectangles too small to label. Right-click the chart → **Format Data Series** → **Banner** options let you choose whether the top-level category labels appear as a banner above each group or inline — switching to banner mode usually recovers enough space to keep bottom-level labels legible without removing a level of detail.

**5. Turn off data labels you don't need rather than shrinking the font to fit.** Both chart types default to showing every level's label inside its shape, which gets cluttered fast at the lowest level. Right-click an individual data label → **Delete** to remove labels selectively (keep region and country, drop product if there are twenty of them), or use **Format Data Labels** to show value only, letting color and size carry the category instead of text.

**6. Color by the top-level category, not the bottom one.** The default palette assigns a shade to every rectangle or wedge independently, which with enough sub-categories just looks noisy. Right-click → **Format Data Series** → set colors to vary by the outermost grouping instead, so all of "North" region's rectangles share one hue family and "South" shares another — the eye can scan for a region instantly instead of reading every label.

Neither chart replaces a simple bar chart for two or three flat categories — reach for one of these specifically when the hierarchy itself, not just the numbers, is what you need the audience to see.
