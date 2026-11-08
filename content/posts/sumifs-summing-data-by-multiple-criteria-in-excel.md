---
title: "SUMIFS: Summing Data by Multiple Criteria in Excel"
date: "2026-11-08"
tags: ["excel", "formulas", "beginner"]
excerpt: "How SUMIFS handles multiple conditions, OR logic, date ranges, and wildcards — the one formula behind most 'how much did X generate' questions."
---

`COUNTIFS`, `AVERAGEIFS`, and `MAXIFS`/`MINIFS` get their own moment eventually, but `SUMIFS` is the one you'll reach for most, because "how much revenue/cost/quantity" broken down by a few conditions is the single most common question in a spreadsheet. Here's how to use it well beyond the one-condition basics.

**1. The syntax puts the sum range first, which trips people up coming from `SUMIF`.** `SUMIF` is `range, criteria, sum_range` — criteria comes before the thing you're summing. `SUMIFS` flips the order and repeats the criteria pair for every condition:
```excel
=SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2, ...)
```
```excel
=SUMIFS(Sales[Revenue], Sales[Region], "West", Sales[Month], "March")
```
Every criteria range has to be the same size as the sum range, or you'll get a `#VALUE!` error.

**2. Multiple conditions are always AND logic — there's no built-in OR.** `SUMIFS` only sums rows that match *every* condition at once. To sum rows matching West *or* East, you can't just list both regions in one argument — instead, wrap two `SUMIFS` calls in a plain addition:
```excel
=SUMIFS(Sales[Revenue], Sales[Region], "West") + SUMIFS(Sales[Revenue], Sales[Region], "East")
```
For more than a couple of OR values, it's cleaner to put the list of values in a range and sum an array of `SUMIFS` results with `SUMPRODUCT`, but the two-formula-plus-addition version is easier to read and maintain for small cases.

**3. Comparison operators go in the criteria as text, not as a separate argument.** To sum revenue above a threshold, or within a date range, the operator is part of the quoted criteria string:
```excel
=SUMIFS(Sales[Revenue], Sales[Amount], ">1000")
```
A date range needs two conditions on the same column — one for the lower bound, one for the upper:
```excel
=SUMIFS(Sales[Revenue], Sales[Date], ">="&DATE(2026,1,1), Sales[Date], "<="&DATE(2026,3,31))
```
Note the `&` concatenation — a cell reference or `DATE()` function has to be joined onto the operator string, it can't sit inside the quotes directly.

**4. Wildcards let you match partial text without an exact value.** `*` matches any number of characters and `?` matches exactly one, which is useful when a category column has inconsistent suffixes or you only care about a prefix:
```excel
=SUMIFS(Sales[Revenue], Sales[Product], "Widget*")
```
This sums every row where the product name starts with "Widget", regardless of what size or color comes after it.

**5. Criteria can reference a cell instead of being hardcoded, which is what makes SUMIFS useful in a reusable report.** Pointing a criterion at a cell means someone can change the region or month in one place and every `SUMIFS` formula on the sheet recalculates:
```excel
=SUMIFS(Sales[Revenue], Sales[Region], $G$1, Sales[Month], $G$2)
```
This is the pattern behind most "pick a filter from a dropdown" report templates that don't use a PivotTable — a couple of input cells with data validation dropdowns, and every summary formula reads from them.

**6. SUMIFS ranges don't need to be adjacent to each other or to the sum range.** The conditions can live in entirely different columns, or even a different sheet, as long as every range is the same length. This is what lets you keep a summary sheet of `SUMIFS` formulas pointing back at a separate raw-data sheet, instead of cramming criteria columns next to the data you're summing.

Once `SUMIFS` is second nature, a surprising amount of "I need a quick pivot for this" turns out to be one or two formulas instead — faster to build when the conditions are simple and fixed, and easier to drop into an existing report layout than a PivotTable would be.
