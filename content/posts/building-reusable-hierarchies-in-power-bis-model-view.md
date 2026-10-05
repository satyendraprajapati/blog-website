---
title: "Building Reusable Hierarchies in Power BI's Model View"
date: "2026-10-05"
tags: ["power-bi", "data-modeling", "beginner"]
excerpt: "Building a named hierarchy once in Model view, instead of re-stacking the same fields in every new visual, so drill-down behaves consistently across a whole report."
---

Dragging `Category` and then `Subcategory` onto a chart's axis builds a one-off hierarchy for that single visual. It works, but it doesn't travel — the next chart that also needs Category-to-Subcategory drill-down starts from scratch, and a rename or reorder on one visual doesn't touch the others. Building the hierarchy once in Model view instead gives every visual in the report the same field, with the same drill order, for free.

**1. Create the hierarchy from the table itself, not from inside a visual.** Switch to **Model view**, find the table (say, `Product`), right-click the top-level field (`Category`), and choose **Create Hierarchy**. This creates a new hierarchy object sitting alongside the table's regular fields — it doesn't move or duplicate the underlying columns.

**2. Drag the remaining levels into the hierarchy in order.** With the hierarchy created, drag `Subcategory` and then `ProductName` onto it from the Fields pane, dropping each one below the last. The vertical order inside the hierarchy box is the drill order every visual will use — broadest at the top, most granular at the bottom.

**3. Rename levels so report viewers see a label, not a column name.** Right-click any level inside the hierarchy and **Rename** it — a level built from a field called `Cat_ID` can display as `Category` without renaming the underlying column everywhere else it's used. This matters because the original column name might be reused in other measures or relationships where changing it would break something.

**4. Hide the base columns once they're wrapped in the hierarchy, if nothing else needs them standalone.** If `Category` and `Subcategory` are only ever consumed through the hierarchy, right-click each and **Hide in Report View**. This trims the Fields pane for report builders to one hierarchy entry instead of three near-duplicate fields, cutting down on the chance someone drags the wrong one onto a visual by mistake.

**5. Set a sort-by-column on a level that shouldn't sort alphabetically.** A `Month` level sorted as text puts April before January. Select the underlying field, go to **Column tools → Sort by Column**, and point it at a `MonthNumber` column instead. Do this on the field itself before it goes into the hierarchy — the sort order carries through to every visual that drills through that level.

**6. Reuse the same hierarchy across chart types without rebuilding it.** Once it exists in the model, drag the hierarchy field (it shows as one item with an expandable icon) onto a matrix, a bar chart, and a decomposition tree, and all three inherit the same drill order and level names. Fix a typo in a level name once, and it updates everywhere the hierarchy is used — the exact maintenance problem that per-visual hierarchies don't solve.

A model-level hierarchy takes a few extra clicks up front compared to stacking fields directly on a visual, but it pays that back the first time a report has more than one chart that needs to drill through the same levels — which, in practice, is most reports with more than one page.
