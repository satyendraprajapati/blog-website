---
title: "DAX TOPN: Building a Dynamic Top N Measure With an 'Others' Bucket"
date: "2026-10-06"
tags: ["power-bi", "dax", "ranking"]
excerpt: "How to use TOPN to show only the top performing products or reps in a visual while rolling everyone else into a single 'Others' total, instead of a long tail of small bars."
---

Ranking a measure with `RANKX` tells you *where* each row stands, but it still shows every row — a bar chart of 40 products ranked 1 through 40 is still a chart with 40 bars. Often what the audience actually wants is "the top 5, and everything else combined into one bar," which is a filtering problem, not a ranking problem. That's what `TOPN` is for.

**1. `TOPN` returns a table, not a single value — it filters, it doesn't rank.** Given a number of rows, a table, and an order-by expression, `TOPN` hands back just that many rows, sorted by the measure you give it. Wrapped in `CALCULATE`, it becomes a filter you can apply to any other measure.
```dax
Top 5 Revenue =
CALCULATE(
    [Total Revenue],
    TOPN(5, ALL(Products[Product]), [Total Revenue], DESC)
)
```
The `ALL(Products[Product])` matters: without it, `TOPN` only ever sees whatever products are already in the current filter context, which defeats the point of picking a top 5 from the full list.

**2. Build the "Others" bucket by subtracting, not by filtering the other direction.** It's tempting to write a second measure for "everything outside the top 5," but the cleanest way is to calculate the grand total and the top-N total once each, then take the difference — it guarantees the two numbers always add up to the whole, even as the underlying data changes.
```dax
Others Revenue =
VAR GrandTotal = CALCULATE([Total Revenue], ALL(Products[Product]))
VAR TopNTotal = [Top 5 Revenue]
RETURN
    GrandTotal - TopNTotal
```

**3. Use SELECTEDVALUE and a disconnected table to let users change N.** Hard-coding 5 works until someone asks for a top 10 view. A disconnected "Top N" table with a slicer, read with `SELECTEDVALUE`, turns the hard-coded number into something a report viewer controls without you touching the measure.
```dax
Top N Revenue =
VAR N = SELECTEDVALUE('Top N Selector'[Value], 5)
RETURN
    CALCULATE(
        [Total Revenue],
        TOPN(N, ALL(Products[Product]), [Total Revenue], DESC)
    )
```

**4. Handle ties explicitly, or TOPN will quietly return more rows than you asked for.** If two products tie for 5th place, `TOPN(5, ...)` returns six rows by default rather than arbitrarily dropping one — which is usually the right behavior for a measure total, but can throw off a visual that expects exactly five categories. Add a tiebreaker column as a second ordering argument when exact row counts matter more than fairness.
```dax
TOPN(5, ALL(Products[Product]), [Total Revenue], DESC, Products[Product], ASC)
```

**5. Combine both measures in the same visual with a calculated "Category" column.** To actually get a chart with six bars — top 5 named products plus one "Others" slice — you need a column that labels each product as itself or as "Others" based on whether it's in the top-N table, then group by that column instead of the raw product name. This is usually done with a calculated column that re-runs the same `TOPN` logic row by row, so the labeling stays in sync with whatever `Top N Revenue` is currently showing.

The payoff is a chart that stays readable regardless of how many products are in the underlying table — five meaningful bars and one honest "everyone else," instead of a long tail nobody can read past position ten.
