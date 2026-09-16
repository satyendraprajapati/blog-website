---
title: "Reshaping Data with Excel's VSTACK, HSTACK, TOCOL, and TOROW Functions"
date: "2026-09-16"
tags: ["excel", "data-analysis", "formulas"]
excerpt: "Four dynamic-array functions that stack, combine, and reshape ranges without copy-pasting or Power Query."
---

Analysts spend a surprising amount of time just getting data into the right shape before any real analysis starts — stacking monthly tabs into one list, turning a wide table into a single column, or combining two ranges side by side. Power Query can do all of this, but for a quick in-sheet reshape, four newer array functions handle it with a single formula.

**1. `VSTACK`** — stacks ranges or arrays vertically, one on top of the other, even if they live on different sheets. This is the fastest way to combine several months' worth of identically-shaped tables into one range without a single copy-paste.
```excel
=VSTACK(Jan!A2:D50, Feb!A2:D50, Mar!A2:D50)
```

**2. `HSTACK`** — the horizontal counterpart, joining ranges side by side by column. Useful for lining up a lookup result next to a source table without adding a helper column with a formula in every row.
```excel
=HSTACK(Sales[Region], XLOOKUP(Sales[Region], RegionTable[Region], RegionTable[Manager]))
```

**3. `TOCOL`** — flattens a 2D range into a single column, reading row by row (or column by column, if you set the by-column argument). It also has built-in options to ignore blanks and errors, which makes it good for pulling a clean list out of a messy cross-tab report.
```excel
=TOCOL(SalesGrid[#Data], 3)
```
The `3` here tells `TOCOL` to skip both blanks and errors while flattening — no separate `FILTER` or `IFERROR` wrapper needed.

**4. `TOROW`** — the mirror image of `TOCOL`, flattening a range into a single horizontal row. It's less common in day-to-day analysis but comes in handy when you need a compact one-row summary to feed into another formula, like building a single delimited string of category names for a chart title or report header.
```excel
=TEXTJOIN(", ", TRUE, TOROW(UNIQUE(Sales[Category])))
```

**A quick way to see the difference.** If you're not sure which shape you need, remember that `VSTACK`/`HSTACK` combine multiple ranges into one bigger range, while `TOCOL`/`TOROW` take one range and squeeze it down into a single line. The first pair is about combining; the second is about flattening.

**Where these save the most time.** The clearest win is consolidating identically structured tables — say, twelve monthly extracts with the same columns — into one range you can then feed into a `PIVOTBY`, `UNIQUE`, or chart, all with formulas that recalculate automatically if the source ranges change. Before these functions existed, that meant either a manual copy-paste routine repeated every month or a Power Query step that felt like overkill for a quick, one-off combine.

**One limitation worth knowing.** All four are dynamic array functions, so they spill their results into neighboring cells. If there isn't enough empty space below or to the right, you'll get a `#SPILL!` error instead of a truncated result — clear the area first, or wrap the formula in `LET` if you need to reference the spilled range elsewhere in the same calculation.

None of these replace Power Query for genuinely large or recurring ETL work, but for a quick reshape inside a workbook you're already in, they cut out a lot of copy-paste and helper columns.
