---
title: "COUNTIFS and SUMPRODUCT: Multi-Criteria Counting and Calculations in Excel"
date: "2026-08-01"
tags: ["excel", "formulas", "beginner"]
excerpt: "How to count and calculate against multiple conditions in Excel, including the OR-logic and weighted cases SUMIFS and COUNTIFS can't handle on their own."
---

`COUNTIFS` gets you most of the way through "how many rows match these conditions" questions, but it quietly breaks down the moment your logic gets more interesting than a plain AND. Here's how to handle both the common case and the cases that trip people up.

**1. Start with `COUNTIFS` for straightforward AND conditions.** If you need a count where every condition must be true at once — region is "West" *and* status is "Closed" — `COUNTIFS` is the right tool and reads cleanly left to right.
```excel
=COUNTIFS(Sales[Region], "West", Sales[Status], "Closed")
```

**2. Use an array constant inside `COUNTIFS` for OR logic on one field.** A common mistake is trying to write `COUNTIFS` twice and add the results, which double-counts rows that match both. To count "West" *or* "East" correctly, wrap the criteria in curly braces and sum the result with `SUM`.
```excel
=SUM(COUNTIFS(Sales[Region], {"West","East"}, Sales[Status], "Closed"))
```
Without the outer `SUM`, this returns an array of two counts instead of one number — easy to spot because the cell shows only the first value until you wrap it.

**3. Reach for `SUMPRODUCT` when the condition isn't a simple field match.** `COUNTIFS` and `SUMIFS` compare a range to a fixed value or a wildcard — they can't evaluate an expression like "quantity times price where quantity is above average." `SUMPRODUCT` multiplies arrays together element by element, which makes it the tool for conditional math that isn't just a straight sum.
```excel
=SUMPRODUCT((Sales[Region]="West") * (Sales[Qty] > 10) * Sales[Revenue])
```
Each comparison in parentheses produces an array of `TRUE`/`FALSE` values, which Excel treats as 1s and 0s when multiplied — so a row only contributes its revenue if both conditions hold.

**4. Use `SUMPRODUCT` for a weighted average, not a plain average of ratios.** Averaging a column of percentages (like conversion rate per rep) usually gives a misleading number, because it treats a rep with 5 leads the same as one with 500. A weighted average fixes that by weighting each rate by its underlying volume.
```excel
=SUMPRODUCT(Reps[Conversions], Reps[Leads]) / SUM(Reps[Leads])
```

**5. Know when to stop and use Power Query instead.** `SUMPRODUCT` formulas get unreadable fast once you're nesting three or four conditions, and every added row re-evaluates the whole array. If you find yourself writing a `SUMPRODUCT` formula you can't explain to someone else in one sentence, that's usually a sign the calculation belongs in a Power Query step or a pivot table instead of a cell formula.

None of this replaces `COUNTIFS` and `SUMIFS` for the 90% of cases where a plain AND condition is all you need — the point is knowing which tool to switch to once "and" turns into "or," or once you're calculating something rather than just counting or summing a column as-is.
