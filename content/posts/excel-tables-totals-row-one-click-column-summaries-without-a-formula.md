---
title: "Excel Tables' Totals Row: One-Click Column Summaries Without a Formula"
date: "2026-10-16"
tags: ["excel", "tables", "beginner"]
excerpt: "An Excel Table's built-in Totals Row gives you a SUM, AVERAGE, or COUNT per column from a dropdown, without writing a single formula or worrying about it breaking when the table grows."
---

Most analysts summarize a Table by typing a `SUM` or `AVERAGE` formula into the row below it — and then watch that formula quietly stop lining up once the Table grows and the "below it" row isn't below it anymore. Excel Tables have a built-in fix for exactly this, and it's one checkbox away.

**1. Turn it on from the ribbon, not by typing anything.** With a cell inside the Table selected, go to *Table Design → Totals Row* and check the box. Excel adds a new row directly under the Table's last row, pre-filled with a `SUBTOTAL` formula in the rightmost column — no range to select, no formula to type.

**2. Each cell in the Totals Row is its own dropdown.** Click any cell in that row and a small arrow appears letting you choose Sum, Average, Count, Max, Min, and a few others per column — so a Revenue column can show a total while the adjacent Discount % column shows an average, in the same row.
```excel
=SUBTOTAL(109,Sales[Revenue])
```

**3. It's `SUBTOTAL`, which means it ignores filtered-out rows.** Because the Totals Row uses `SUBTOTAL` instead of `SUM`, filtering the Table down to one region updates every total to reflect only the visible rows — the same behavior you'd get from a PivotTable, but sitting directly under your raw data with no separate object to maintain.

**4. It survives the Table growing, because it's not a fixed-range formula.** Add ten new rows of data above the Totals Row and the Table absorbs them, pushing the Totals Row down and keeping its `SUBTOTAL` arguments pointed at the whole column — not the old row count. This is the specific failure mode a manually typed `=SUM(D2:D50)` doesn't survive.

**5. You can still write your own formula in any Totals Row cell.** The dropdown covers the common cases, but clicking into the cell and typing a custom formula — say, a weighted average or a ratio of two other Totals Row cells — works fine too; Excel doesn't force you into the preset list.

**6. Turning it off doesn't delete your data.** Unchecking *Totals Row* just hides the row and its formulas; it reappears with the same settings if you check the box again later, which makes it safe to toggle off before printing a report where a summary row would be distracting.

The Totals Row won't replace a PivotTable for multi-dimensional summaries, but for "what's the total of this column, and does it update when I filter or add rows" — which is most of what a quick summary needs — it's faster to turn on than it is to write the formula it replaces.
