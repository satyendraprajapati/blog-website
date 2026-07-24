---
title: "Excel Dynamic Arrays: FILTER, SORT, and SORTBY Explained"
date: "2026-07-20"
tags: ["excel", "dynamic-arrays", "beginner"]
excerpt: "How FILTER, SORT, and SORTBY spill live, self-updating results across a range instead of locking you into a static copy-paste."
---

Modern Excel introduced a category of functions that "spill" — a single formula in one cell can return many rows and columns, automatically resizing as the source data changes. Three of them cover most of what you'd otherwise reach for a helper column or a manual filter to do.

**1. `FILTER` for pulling rows that meet a condition.** Instead of applying a filter dropdown that hides rows (and has to be reapplied every time data refreshes), `FILTER` returns a live, separate list of just the rows you want.
```excel
=FILTER(Sales[#All], Sales[Region]="West")
```
Change the source data and the filtered list updates on its own — no reclicking a dropdown, no risk of someone forgetting a filter is still active.

**2. `SORT` for ordering results without touching the source.** `SORT` takes an array and an optional column index and sort order, and returns a sorted copy — the underlying table stays untouched, which matters when other formulas or a Power Query step depend on the original row order.
```excel
=SORT(Sales[#All], 3, -1)
```
That sorts by the third column, descending, without ever selecting the data and clicking Sort in the ribbon.

**3. `SORTBY` for sorting by a column that isn't in the output.** `SORT` sorts by a column position in the array you're returning; `SORTBY` lets you sort by any range, including one you're not displaying — useful when you want to rank products by units sold but only show name and revenue.
```excel
=SORTBY(Sales[Product], Sales[Revenue], -1)
```

**4. Combine them for a self-updating top-N list.** Nesting `FILTER` inside `SORT` gives you a ranked, filtered list that stays correct as the source table grows — the pattern behind most "top 10 by region" mini-reports.
```excel
=SORT(FILTER(Sales[#All], Sales[Region]="West"), 3, -1)
```

**5. Reference the spill range with a trailing `#` when other formulas need it.** Once a formula spills, `A2#` refers to the whole spilled block, not just the first cell — handy for a `SUM` or a chart source that needs to track a `FILTER` result that changes size.
```excel
=SUM(A2#)
```

The mental shift from older Excel habits is the important part: instead of filtering and sorting as one-time actions performed *on* your data, these functions treat filtering and sorting as formulas that produce *new* data — which means they never go stale, and they're safe to build other formulas, charts, or dashboards on top of.
