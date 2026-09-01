---
title: "DAX EARLIER: The Row-Context Trick for Calculated Columns (and Why a Measure Is Usually Better Today)"
date: "2026-09-01"
tags: ["power-bi", "dax", "data-modeling"]
excerpt: "EARLIER lets a calculated column compare each row to the rest of its table without a self-join — how it works, and why most new models solve the same problem with a measure instead."
---

Most Power BI tutorials for ranking a row against its category, or comparing it to a group average, point straight at a measure using `RANKX` or `CALCULATE`. `EARLIER` solved the same class of problem before that idiom was common, inside a calculated column instead of a measure. It still shows up in older models, in Excel Power Pivot workbooks, and in interview questions — worth understanding even if you'd write it differently today.

**1. A calculated column evaluates one row at a time.** That's row context: inside a calculated column formula, `Products[Price]` means "the price on this row." No filtering involved, just the current row.

**2. Wrapping that row in `FILTER` creates a second, inner row context — and it shadows the first.** If you try to compare the current row's category to the table's own category column inside a nested `FILTER`, `Products[Category]` inside the filter refers to the row `FILTER` is currently scanning, not the row the whole calculated column is evaluating. You've lost the outer row.

**3. `EARLIER` reaches back to that outer row context by name.** It's the function that resolves the ambiguity from #2 by explicitly asking for the value from the row context one level up. A classic use: ranking each product's price within its category without `RANKX`.

```dax
RankInCategory =
COUNTROWS(
    FILTER(
        Products,
        Products[Category] = EARLIER(Products[Category]) &&
        Products[Price] > EARLIER(Products[Price])
    )
) + 1
```

Read it as: "count how many other rows in this same category have a higher price, then add one." `EARLIER(Products[Category])` and `EARLIER(Products[Price])` both refer to the row the calculated column is currently computing, not the row `FILTER` is scanning.

**4. `EARLIER(column, 2)` reaches back two levels if you've nested three row contexts — but treat needing that as a signal to restructure.** A formula with two or three nested `EARLIER` calls is hard to read six months later, and that difficulty is a bigger reason it fell out of favor than any performance concern.

**5. A measure solves the same ranking problem without a calculated column at all.**

```dax
Rank in Category =
RANKX(
    FILTER(ALL(Products), Products[Category] = SELECTEDVALUE(Products[Category])),
    [Total Price]
)
```

No nested row context to manage, and — the real difference — it responds live to whatever slicer or filter is currently applied. A calculated column is computed once at refresh and stored on disk; it can't do that.

**6. Default to a measure whenever the result should change with the report's filters, and save calculated columns for values that genuinely belong to the row itself** — a flag, a category bucket, something true regardless of what's selected on the page. Ranking, running totals, and period comparisons are filter-dependent by nature, which is exactly why `RANKX` and friends replaced `EARLIER` for them rather than the two functions doing the same job.

`EARLIER` isn't deprecated, and you'll still run into it reading someone else's model. It's just solving a row-context problem that a measure usually shouldn't have in the first place.
