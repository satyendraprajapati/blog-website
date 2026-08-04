---
title: "Power BI DAX: ALL, ALLEXCEPT, and ALLSELECTED — Controlling What a Filter Removes"
date: "2026-08-04"
tags: ["power-bi", "dax", "beginner"]
excerpt: "Three filter-removal functions that look interchangeable at first but answer three genuinely different questions — and produce different numbers when you mix them up."
---

Once you're comfortable with `CALCULATE` and filter context, the next stumbling block is usually a trio of functions that all sound like they do the same thing: clear a filter. They don't. `ALL`, `ALLEXCEPT`, and `ALLSELECTED` each clear a *different* set of filters, and picking the wrong one produces a number that looks plausible but is quietly wrong.

**1. `ALL` clears every filter on a table or column, full stop.** It's what you reach for when a calculation needs to ignore everything currently applied — the classic case is "percent of total," where the denominator has to stay fixed at the grand total no matter what a viewer has filtered or sliced.

```dax
% of Total Sales =
DIVIDE(
    [Total Sales],
    CALCULATE([Total Sales], ALL(Sales))
)
```

**2. `ALLEXCEPT` clears every filter except the ones you name.** It's the version to use when "ignore everything" is too aggressive and you actually want to keep one specific filter in place. "Rank each product within its own category" needs the category filter to stay applied while the product-level filter clears — `ALLEXCEPT(Products, Products[Category])` does exactly that in one call, instead of you re-adding every other column filter back with `ALL` plus a list of `KEEPFILTERS`.

```dax
Category Share =
DIVIDE(
    [Total Sales],
    CALCULATE([Total Sales], ALLEXCEPT(Products, Products[Category]))
)
```

**3. `ALLSELECTED` clears filters from inside the visual, but keeps filters from outside it.** This is the one that trips people up, because it behaves differently depending on *where* a filter came from. A page-level or report-level filter (or a slicer) stays respected; a filter that comes from another value in the same visual — like a subtotal row in a table — gets cleared. It's built specifically for subtotals and "percent of visible total" calculations that should react to a slicer but ignore the visual's own row/column breakdown.

```dax
% of Selected Total =
DIVIDE(
    [Total Sales],
    CALCULATE([Total Sales], ALLSELECTED(Sales))
)
```

**4. Test the difference with a slicer, not just a table.** `ALL` and `ALLSELECTED` produce identical results in a plain table with no external filters — which is exactly why the difference is easy to miss until it matters. Add a region slicer and set it to "West": a `% of Total Sales` measure built on `ALL` still divides by every region's sales (the true grand total), while one built on `ALLSELECTED` divides only by West's total — both are legitimate answers, they just answer different questions, and the measure name should make clear which one you built.

**5. Don't reach for `ALLEXCEPT` as a shortcut for `ALLSELECTED`.** They can look interchangeable in a simple report, but `ALLEXCEPT` clears filters based on *table structure* (which columns you named), while `ALLSELECTED` clears filters based on *filter origin* (visual-internal versus external) — swap one in for the other and a report that behaved correctly with one slicer can start giving wrong subtotals the moment a second slicer or a matrix row grouping gets added.

**6. Default to `ALL` unless you have a specific reason not to.** It's the most predictable of the three because it doesn't depend on report layout or slicer state — reach for `ALLEXCEPT` when you need one filter preserved by name, and save `ALLSELECTED` for the specific case of subtotals and visual-relative percentages that genuinely need to track what's on screen.

The underlying question to ask before writing any of these is "which filters, applied by what, should this calculation ignore?" — answering that precisely is what tells you which of the three you actually need, rather than picking whichever one happened to work in the last report.
