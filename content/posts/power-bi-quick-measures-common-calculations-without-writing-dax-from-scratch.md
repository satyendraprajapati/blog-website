---
title: "Power BI Quick Measures: Common Calculations Without Writing DAX From Scratch"
date: "2026-08-02"
tags: ["power-bi", "dax", "beginner"]
excerpt: "How to build common calculations like running totals and percent-of-total in Power BI by filling in a dialog, then use the generated DAX as a starting point for learning the language."
---

Writing DAX from a blank measure box is intimidating when you're new to Power BI — you know what number you want, but not which function combination produces it. Quick Measures close that gap: you pick a calculation type from a list, point it at your fields, and Power BI writes the DAX for you.

**1. Where to find them.** Right-click a table in the Fields pane (or click "New quick measure" on the Home ribbon), and you get a dialog with a dropdown of calculation categories — Aggregate per category, Filters, Time intelligence, Totals, Mathematical operations, and more. Pick one, drag in the base field, and Power BI builds the measure.

**2. Running total** is one of the most useful. Choose "Running total" under Totals, point it at a numeric field like Revenue and a date field, and it generates a `CALCULATE` with a filter that accumulates every date up to and including the current one — the same pattern you'd otherwise have to learn `ALL` and comparison operators to write by hand.

**3. Percent of grand total** answers "what share of the whole does this row represent" — a constant request in exec dashboards. Under Filters, "Percent of grand total" divides the current filtered value by the same measure evaluated with all filters removed, which is exactly the `CALCULATE(..., ALL(...))` pattern analysts eventually learn to write manually.

**4. Year-over-year change** under Time intelligence generates a measure that compares the current period to the same period last year, without you needing to know `SAMEPERIODLASTYEAR` or `DATEADD` yet.

**5. Read the generated DAX, don't just use it.** After a quick measure is created, click it in the Fields pane and look at the formula bar — this is the best way to learn real DAX syntax, because you already know what the measure is supposed to do and can match the logic to the result. A generated measure might read like this:

```dax
Revenue YoY % Change =
VAR __PREV_YEAR_VALUE =
    CALCULATE(SUM(Sales[Revenue]), SAMEPERIODLASTYEAR('Date'[Date]))
RETURN
    DIVIDE(SUM(Sales[Revenue]) - __PREV_YEAR_VALUE, __PREV_YEAR_VALUE)
```

Tracing through that — what `SAMEPERIODLASTYEAR` shifts, why `DIVIDE` is used instead of `/` — is a faster way into real DAX than starting from a textbook.

**6. Know their limits.** Quick measures cover common, generic patterns. They won't handle business-specific logic like "revenue from repeat customers only" or a ranking that ignores a particular category — for that you still write the measure yourself. Treat quick measures as a way to get unstuck on the common 80%, and a live study aid for the DAX behind it, not a replacement for learning the language.

Once you're comfortable reading what a quick measure generates, editing one directly in the formula bar is usually faster than reopening the dialog — at that point you've effectively learned the DAX pattern it was teaching you.
