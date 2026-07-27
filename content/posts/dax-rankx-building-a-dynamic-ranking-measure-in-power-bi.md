---
title: "DAX RANKX: Building a Dynamic Ranking Measure in Power BI"
date: "2026-07-27"
tags: ["power-bi", "dax", "ranking"]
excerpt: "How to rank products, regions, or reps with RANKX so the ranking updates live with every filter and slicer instead of being frozen at import time."
---

"Top 5 products" and "rank this rep against their peers" are two of the most common asks in a business review, and both come down to one DAX function: `RANKX`. Unlike sorting a column in Excel once and pasting the result in, a `RANKX` measure recalculates every time a slicer, filter, or drill-through changes what's on screen.

**1. Start with the basic pattern.** `RANKX` needs a table to rank over and an expression to rank by. The table argument is almost always `ALL()` around the column you're ranking — without it, the ranking would only ever be computed within whatever's already filtered, which defeats the point.

```dax
Product Rank =
RANKX(
    ALL(Products[ProductName]),
    [Total Sales]
)
```

**2. Understand why `ALL()` matters here.** If you leave it out and just pass `Products`, Power BI ranks within the current filter context — so if a report page already has a category slicer applied, every product would rank #1 out of a filtered pool of one. Wrapping the table in `ALL()` clears that filter for the ranking calculation only, so each product is ranked against every other product regardless of what else is filtered on the page.

**3. Control tie-breaking and direction explicitly.** `RANKX` takes optional third and fourth arguments for order and ties: `RANKX(table, expression, , ASC)` ranks lowest-to-highest instead of the default highest-to-lowest, and adding `DENSE` as the ties argument avoids skipping rank numbers after a tie (so two products tied for #2 are followed by #3, not #4).

```dax
Product Rank (Ascending, Dense) =
RANKX(
    ALL(Products[ProductName]),
    [Total Sales],
    ,
    ASC,
    DENSE
)
```

**4. Rank within a group, not across the whole table.** A common follow-up request is "rank each product within its own category" rather than against the entire catalog. Swap `ALL()` for `ALLEXCEPT()`, which clears every filter except the one you name — so the category filter stays in place and only the product-level filter gets cleared for the ranking.

```dax
Product Rank Within Category =
RANKX(
    ALLEXCEPT(Products, Products[Category]),
    [Total Sales]
)
```

**5. Use the rank measure to filter, not just display it.** Once you have a working rank measure, "Top 5" becomes a visual-level filter condition (`Product Rank <= 5`) instead of a manually curated list — which means the top 5 stays correct automatically as sales figures change, instead of someone needing to remember to update a hardcoded list every month.

**6. Watch performance on very large tables.** `RANKX` re-evaluates the ranking expression for every row in the table argument, for every row currently visible in the visual — on a table with tens of thousands of distinct products this can get slow. If a report starts to lag after adding a rank measure, that's usually the first place to check with Performance Analyzer before assuming the whole model needs a redesign.

Once you're comfortable with the `ALL()` / `ALLEXCEPT()` distinction, `RANKX` covers the vast majority of ranking asks — and because it's a measure, it stays correct no matter how the report gets filtered, which a static Excel-style rank column never does.
