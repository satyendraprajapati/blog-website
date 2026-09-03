---
title: "Python in Excel: Running Pandas Analysis Inside a Cell with =PY"
date: "2026-09-03"
tags: ["excel", "python", "data-analysis"]
excerpt: "How Excel's native =PY formula lets you run pandas code directly in a cell, and where it fits next to regular formulas."
---

Excel now ships with a built-in Python formula. Instead of exporting to a `.csv` and opening a notebook, you can write pandas code straight into a cell and reference your worksheet data from it — no separate install required.

**1. Turn a cell into Python with `Ctrl+Alt+Shift+P`.** Typing that shortcut (or picking `=PY` from the Formulas tab) switches the cell into a Python editor. The formula bar still shows `=PY(...)`, but the cell itself becomes a multi-line code box.

**2. Pull worksheet data in with `xl()`.** The `xl()` function is how Python code sees your spreadsheet — pass it a range, table, or table column and it comes back as a pandas DataFrame or Series.

```python
df = xl("SalesTable[#All]", headers=True)
df.groupby("Region")["Revenue"].sum().sort_values(ascending=False)
```

That single cell now holds a full group-and-sort operation that would otherwise take a pivot table or several helper columns to reproduce with formulas.

**3. A DataFrame result is a "card," not a spill, until you say otherwise.** By default the cell shows a small Python object icon rather than the values themselves. Click it and choose "Display as Excel Values" if you want the DataFrame to spill into neighboring cells like a dynamic array would.

**4. Reach for it when a formula would get ugly, not as a default habit.** Things like a quick `describe()` for outlier-checking, a correlation matrix, or a matplotlib/seaborn chart embedded in a cell are genuinely faster in Python than in native Excel. For a single conditional sum, `SUMIFS` is still simpler and doesn't carry any of the caveats below — don't reach for `=PY` out of novelty when a normal formula does the job in one line.

**5. Know where the code actually runs.** Python in Excel executes in a secure container in Microsoft's cloud, not on your machine, which is how it avoids requiring a local Python install. That also means it needs an internet connection, comes with the compute limits of your Microsoft 365 plan, and is off the table for workbooks containing data your organization won't allow to leave the local network — check with IT before using it on anything regulated.

**6. Mixing Python cells with regular formulas is normal.** A common pattern is doing the cleanup and shaping in a few `=PY` cells — deduplicating, reshaping, computing a statistical test — then feeding the tidied output back into ordinary Excel formulas and PivotTables for the rest of the report. You don't have to pick one approach for the whole workbook.

The feature is still rolling out by Microsoft 365 channel, so if you don't see the Python button on the Formulas tab, check `File > Account` for your update channel before assuming something's misconfigured. For analysts who already think in pandas, it closes a real gap; for everyone else, it's worth knowing it exists even if `SUMIFS` and `XLOOKUP` still cover 90% of daily work.
