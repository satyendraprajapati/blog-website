---
title: "Bad Excel Habits That Quietly Corrupt Your Data (and What to Do Instead)"
date: "2026-09-23"
tags: ["excel", "data-cleaning", "beginner"]
excerpt: "Six common spreadsheet habits that look harmless but silently break formulas, sorting, and filtering — and the fix for each."
---

None of these habits throw an error. That's what makes them dangerous — a workbook built on them looks fine for months until a SUM comes up short or a sort scrambles a report, and by then nobody remembers which row caused it.

**1. Merging cells across a data range.** A merged cell looks tidy in a title row, but merge it inside a table and sorting, filtering, and `SUMIFS` on that column start behaving unpredictably — Excel treats the merged block as belonging to only one of the rows it spans. Use **Center Across Selection** (Format Cells → Alignment → Horizontal) instead; it visually centers text across columns without merging the underlying cells.

**2. Storing numbers as text.** A number pasted from a system export, or typed with a leading apostrophe, often lands in the cell as text — it looks identical but won't sum, won't sort numerically, and silently drops out of numeric formulas. Left-aligned numbers in a column that's otherwise right-aligned are the usual tell.
```excel
=ISNUMBER(A2)
```
Run that down a column to flag the offenders, then fix them with **Data → Text to Columns → Finish** (it forces a re-parse) or by multiplying by 1 with Paste Special.

**3. Hardcoding a value that should be a formula.** Typing `4650` into a "Total" cell instead of `=SUM(B2:B10)` saves a second today and costs you the next time the source data changes and the total silently stops matching it. If a number is derived from other cells, it belongs in a formula — even a trivial one — so it updates itself and shows its own logic to the next person who opens the file.

**4. Using cell color as the only signal for status.** A red fill for "overdue" or green for "on track" reads fine until the sheet is filtered, sorted, printed in black and white, or opened by someone who's colorblind — and color alone can't be tested with a formula or aggregated with `COUNTIFS`. Pair any color coding with a plain-text status column (`"Overdue"`, `"On Track"`) that conditional formatting can key off of, so the information survives without the color.

**5. Typing dates as text strings.** `9/23/2026` typed into a cell formatted as General usually becomes a real date, but data pasted from a website or CSV often lands as text that merely looks like a date — it won't sort chronologically and breaks any `SUMIFS` or `FORECAST.LINEAR` built against it. Left-aligned "dates" are the same tell as left-aligned "numbers"; select the column and use **Data → Text to Columns → Finish** with Date selected on the final step to convert it properly.

**6. Leaving a growing dataset as a plain range instead of a Table.** A plain range doesn't expand automatically when you add a row, so formulas, charts, and pivot tables built against it quietly stop covering the new data until someone remembers to extend the reference. Select the range and press **Ctrl+T** once — every formula, chart, and PivotTable source built on it from then on grows with the data instead of falling behind it.

None of these habits are visible in a screenshot of the spreadsheet — you only find them when a formula gives a wrong answer and you go looking for why. Building the fix in from the start costs a few extra clicks; finding it after the fact costs an afternoon of auditing.
