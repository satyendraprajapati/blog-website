---
title: "Excel Pivot Table 'Show Values As': Percent of Total, Running Totals, and Rank"
date: "2026-08-09"
tags: ["excel", "pivot-tables", "beginner"]
excerpt: "A pivot table field menu you've probably scrolled past turns raw sums into percent-of-total, running totals, and rank — without a single extra formula."
---

A pivot table's default aggregation is a plain sum or count, which answers "how much" but not "how much compared to what." Most analysts reach for a helper column of formulas to get percent-of-total or a running total next to a pivot — but Excel already builds both into the pivot table itself, under a menu most people never open: **Show Values As**.

**1. Find the setting on the value field, not the pivot table.** Right-click any number inside the pivot's Values area and choose *Show Values As*. This is a per-field setting, so you can display the same "Sum of Revenue" field as a plain total in one column and as a percentage in another by dragging the field into Values twice and setting each copy differently.

**2. Use "% of Grand Total" instead of writing a SUM(...) divisor formula.** Picking this option recalculates every cell as its share of the overall total automatically — and because it lives inside the pivot, it updates correctly the moment you filter, slice, or refresh the data, which a formula referencing a fixed total range won't do without a rewrite.

**3. Use "% of Parent Row Total" for a breakdown within a category, not the whole sheet.** If your pivot is grouped by Region then Product, "% of Grand Total" tells you each product's share of every sale in the workbook. "% of Parent Row Total" instead shows each product's share within its own region — the more useful number when the question is "how does this product perform inside this region," not "across the whole company."

**4. Build a running total with one click, grouped correctly.** Set "Show Values As" to *Running Total In*, then pick the field to run the total along — typically a date field. Excel automatically resets or continues the running total per group depending on how your pivot is laid out, which is the exact behavior a manual `SUM($B$2:B2)` formula gets wrong the first time a filter changes the visible row order:

```excel
=SUM($B$2:B2)
```

That formula is the manual equivalent for a plain (non-pivot) table, included here only to show what "Running Total In" is replacing — you don't need it inside the pivot itself.

**5. Rank rows without a helper column using "Rank Largest to Smallest."** This option turns the value field into a 1, 2, 3… ranking instead of the raw number, recalculated live as the underlying data changes. It's the pivot-table equivalent of a `RANK` formula, but it re-ranks automatically when you filter down to a subset instead of leaving stale rank numbers from the full dataset.

**6. Use "Difference From" to compare against a specific reference point, not just the prior row.** Rather than a straight running total, "Difference From" lets you pick a base item — say, comparing every month's revenue against January specifically, not just the month before it — which is the calculation most "how are we doing vs. baseline" summary tables actually need.

**7. Remember the base value still needs to be a sum or count Excel can compute row by row.** "Show Values As" transforms an existing aggregation; it doesn't replace the need to pick the right aggregation type first. If the underlying field is set to Average instead of Sum, percent-of-total and running-total options will compute against averages, which rarely means what you expect — check the base aggregation before troubleshooting a percentage that looks wrong.

Once you know to look for it, "Show Values As" replaces a surprising number of helper-column formulas analysts write out of habit — and because the calculation lives inside the pivot, it stays correct through every refresh and filter change without you touching it again.
