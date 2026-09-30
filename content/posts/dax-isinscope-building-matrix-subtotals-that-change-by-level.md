---
title: "DAX ISINSCOPE: Building Matrix Subtotals That Change by Level"
date: "2026-09-30"
tags: ["power-bi", "dax", "data-analysis"]
excerpt: "How ISINSCOPE lets a single measure show different logic at the region subtotal, category subtotal, and grand total rows of the same matrix visual."
---

Drop a hierarchy like Region → Category → Product into a matrix visual and every row — leaf, subtotal, and grand total — runs through the exact same measure. Most of the time that's fine. But sometimes you want the region subtotal to show a share-of-total percentage while the product-level rows show a plain dollar figure, and a single `SUM` or `CALCULATE` measure has no way to tell those rows apart. `ISINSCOPE` is the function that gives a measure that awareness.

**1. Know what "scope" means in a matrix.** At any given row, DAX is evaluating in the context of whichever hierarchy levels are currently filtering that row. A leaf-level product row has `Region`, `Category`, and `Product` all in scope. A region subtotal row only has `Region` in scope — `Category` and `Product` have been rolled up and are no longer active filters for that row.

**2. Test a single column with ISINSCOPE.** `ISINSCOPE(<column>)` returns `TRUE` when that specific column is currently part of the active grouping for the row being evaluated, and `FALSE` once it's been summarized away.
```dax
Region Scope Flag =
IF(ISINSCOPE('Product'[Category]), "Category level or deeper", "Rolled up")
```
Drop that measure into the same matrix and watch it flip from row to row as you expand and collapse the hierarchy — it's the fastest way to actually see what "scope" means instead of just reading about it.

**3. Use it to branch measure logic by level.** The common case is showing a percentage at a subtotal row and a raw value everywhere else, or the reverse.
```dax
Revenue Display =
IF(
    ISINSCOPE('Product'[Product]),
    [Total Revenue],
    [Total Revenue] & " (subtotal)"
)
```
More usefully, combine it with `ALL` to compute a true percent-of-parent at each subtotal level, rather than a flat percent-of-grand-total:
```dax
Percent of Region =
IF(
    ISINSCOPE('Product'[Category]) && NOT ISINSCOPE('Product'[Product]),
    DIVIDE([Total Revenue], CALCULATE([Total Revenue], ALL('Product'[Category]))),
    BLANK()
)
```
That measure only produces a value on category-subtotal rows — everywhere else it stays blank, which keeps the matrix from showing a confusing percentage next to a grand total or a single product.

**4. Chain multiple ISINSCOPE checks for a multi-level hierarchy.** Since scope collapses one level at a time as you roll up, check the deepest level first and fall through.
```dax
Level Aware Total =
SWITCH(
    TRUE(),
    ISINSCOPE('Product'[Product]), [Total Revenue],
    ISINSCOPE('Product'[Category]), [Total Revenue] * 1, -- category subtotal logic here
    ISINSCOPE('Product'[Region]), [Total Revenue] * 1, -- region subtotal logic here
    [Total Revenue] -- grand total
)
```
The `SWITCH(TRUE(), ...)` pattern reads top-to-bottom, so ordering checks from most-specific to least-specific matters — reversing the order would make the region check win even on a product-level row that also happens to be in a region's scope.

**5. Don't reach for it on a flat table.** `ISINSCOPE` only does something useful when there's an actual hierarchy of grouping levels to be "in" or "out of" — on a table visual with one row per product and no subtotals, every row is always at the same scope, so the function always returns the same result and adds nothing but noise.

**6. Prefer HASONEVALUE when the question is about selection, not hierarchy level.** It's easy to reach for `ISINSCOPE` when what you actually want is "has the user filtered this down to one value" (a slicer selection, for instance) — that's a different question, and `HASONEVALUE` answers it more directly without needing a matrix hierarchy at all.

Used well, `ISINSCOPE` turns one measure into something that reads correctly at every level of a drill-down matrix, instead of forcing you to either build three separate measures or accept a number that's technically correct but contextually meaningless at the subtotal rows.
