---
title: "Finding What Changed Between Two Versions of an Excel Workbook with Spreadsheet Compare"
date: "2026-10-30"
tags: ["excel", "data-cleaning", "intermediate"]
excerpt: "A faster, more reliable way to find what actually changed between two versions of a workbook than scrolling two windows side by side."
---

Someone sends you "Q3_Budget_v2.xlsx" and you need to know exactly what changed from v1 — which cells, which formulas, which formatting. Scrolling two windows side by side works for a 20-row sheet. It falls apart on a 2,000-row workbook with a dozen tabs.

**1. Use Spreadsheet Compare instead of eyeballing it.** If you have Excel on Windows (Professional Plus or Microsoft 365 Apps for Enterprise), Spreadsheet Compare ships as a separate app — search for it in the Start menu, not inside Excel itself. Open it, pick the two files under Compare Files, and run it. It produces a line-by-line diff: cell values that changed, formulas that changed, formatting-only changes, and inserted or deleted rows and columns, each in its own color-coded category.

**2. Narrow the comparison before you run it.** The Compare Files dialog has an Options section where you can turn off categories you don't care about — formatting, macros, cell comments — so a report meant to show "what numbers moved" isn't buried in noise about a cell's fill color changing. For a budget or forecast file, turning off everything except Formulas and Values usually gets you straight to the substance.

**3. Read the results grid, not just the colored cells.** The bottom pane lists every detected difference as a row: sheet name, cell address, old value, new value, and the type of change. That list is sortable and filterable, which matters once a comparison turns up 400 differences and you need to filter down to just the ones on the "Assumptions" tab.

**4. Export the diff instead of re-running it for every stakeholder.** Spreadsheet Compare can export its results to a new workbook via File > Export Results, which turns the diff into something you can hand to someone who doesn't have the tool installed, or paste into a change-log email.

**5. No Spreadsheet Compare? Build a quick formula-based diff.** Not every Excel install includes it (Mac Excel and most Home/Business licenses don't). A workable substitute on a single sheet is a helper column comparing the two workbooks cell by cell with `EXACT`, which is case-sensitive and avoids the false matches a plain `=` comparison can produce on text:

```excel
=IF(EXACT('[Budget_v1.xlsx]Sheet1'!A2, '[Budget_v2.xlsx]Sheet1'!A2), "same", "changed")
```

Drag that down a key column (or across a whole grid with a 2D array version), then filter for "changed" to get a short list of exactly which cells moved — without a hidden add-in and without trusting your eyes to catch a single digit flip in a sea of numbers.

**6. For anything you'll do more than once, save the comparison settings.** Spreadsheet Compare remembers your last-used file pair and options when you reopen it, which is enough to turn a recurring "did finance change anything in this month's actuals file" check into a two-click habit instead of a fresh manual review every time.

The underlying point is the same whether you use the dedicated tool or the formula trick: never assume a "final" file matches the one you reviewed last unless you've actually diffed it. A compare pass takes a couple of minutes and catches the kind of silent, single-cell change that a visual scan reliably misses.
