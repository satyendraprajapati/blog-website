---
title: "TAKE, DROP, CHOOSEROWS, CHOOSECOLS, and EXPAND: Excel's Array-Reshaping Functions"
date: "2026-09-20"
tags: ["excel", "dynamic-arrays", "beginner"]
excerpt: "Five newer dynamic array functions for slicing rows and columns out of a range without a single helper column."
---

`FILTER`, `SORT`, and `SORTBY` get most of the attention when people talk about dynamic arrays, but a second batch of functions handles a different job: reshaping an array by picking out or dropping specific rows and columns. They replace a lot of `INDEX` gymnastics and manual copy-pasting.

**1. `TAKE` for grabbing the first or last N rows or columns.** A positive number takes from the start, a negative number takes from the end — one function covers both "top 5 rows" and "last 3 columns" without separate formulas.
```excel
=TAKE(Sales[#All], 5)
=TAKE(Sales[#All], -5)
```
That second version is a clean way to preview the most recently added rows in a table that's sorted oldest-to-newest, without scrolling to the bottom.

**2. `DROP` for removing rows or columns instead of keeping them.** Useful when a source range has a total row or a helper column you never want included in a calculation.
```excel
=DROP(Sales[#All], -1)
```
This drops the last row of the array — handy when a linked export always tacks a "Grand Total" row onto the bottom and you need the raw rows without it.

**3. `CHOOSEROWS` for pulling specific, non-adjacent rows by position.** Instead of `TAKE`'s "first N" or "last N," `CHOOSEROWS` lets you name exact row numbers, in any order.
```excel
=CHOOSEROWS(Sales[#All], 1, 3, 5)
```
That returns rows 1, 3, and 5 as a new array — a quick way to build a small comparison table from specific records without three separate `INDEX` formulas.

**4. `CHOOSECOLS` for the same trick across columns.** Reorder or select a subset of columns from a wide table without touching the source.
```excel
=CHOOSECOLS(Sales[#All], 1, 4, 2)
```
This is the fix for "I need Name, then Revenue, then Region" when the source table has them in a different order and you don't want to physically rearrange columns other formulas depend on.

**5. `EXPAND` for padding a smaller array out to a fixed size.** When you're feeding a spilled array into something that expects a consistent shape — a chart range, or a formula that assumes a fixed number of rows — `EXPAND` pads the result with a fill value instead of erroring or shifting.
```excel
=EXPAND(FILTER(Sales[#All], Sales[Region]="West"), 10, , "")
```
If the filter only matches 6 rows, this pads the result out to 10 rows with blanks, so anything referencing a fixed 10-row block below it doesn't get overwritten or thrown off by a shrinking spill range.

**Stack them for one-line reshaping.** Because each of these takes an array and returns an array, they nest cleanly — pull the last 12 rows, then drop the first column, in a single formula.
```excel
=DROP(TAKE(Sales[#All], -12), 0, 1)
```

None of these replace `FILTER` or `SORT` — they solve a narrower problem: getting a specific shape and size out of an array once you already have it. Together, the two groups cover most of what used to require a helper column or a manual paste-special just to get data into the layout a chart or a downstream formula expected.
