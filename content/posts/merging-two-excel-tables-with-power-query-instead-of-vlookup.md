---
title: "Merging Two Excel Tables with Power Query Instead of VLOOKUP"
date: "2026-08-17"
tags: ["excel", "power-query", "data-analysis"]
excerpt: "How Power Query's Merge Queries feature handles multi-column table joins that VLOOKUP and XLOOKUP weren't built for."
---

`XLOOKUP` is great for pulling one column from a lookup table, but it starts to strain the moment you need five or six columns from a second table, or the join has to survive a refresh next month. Power Query's Merge Queries does what a database join does — match two tables on a key and combine them — without a formula per column.

**1. Load both tables as queries first.** Select each range or table and go to `Data > Get & Transform > From Table/Range`. You need two separate queries — the one you're merging into, and the one you're pulling columns from — before Merge Queries has anything to work with.

**2. Use `Home > Merge Queries`, not a helper column of `XLOOKUP`s.** Pick your primary table, the second table, and the matching column(s) in each. Power Query joins the whole row set at once instead of evaluating a lookup formula per cell, which is both faster and easier to audit later.

**3. Pick the join kind deliberately — don't leave it on the default without checking.** "Left Outer" (keep all rows from the first table) is the default and usually right for enriching a transaction table with lookup data. But "Inner" (only matching rows) is what you want when you're deliberately filtering to records that exist in both tables, and "Left Anti" is the fastest way to find rows in table one that have *no* match in table two — a quick orphan-record check.

**4. Match on more than one column when a single key isn't unique.** Ctrl-click multiple columns in both tables during the merge step to match on, say, `CustomerID` and `OrderDate` together, instead of getting silent duplicate matches from a key that isn't actually unique on its own.

**5. Expand only the columns you actually need.** After merging, the new column shows up as a table of nested rows. Click the expand icon and untick anything you don't need — pulling in every column from the second table "just in case" makes the query slower and the output harder to scan.

**6. Check the row count before and after.** If your merge is Left Outer and the row count grew, you have duplicate keys on the matching side creating a one-to-many match. That's not always wrong, but it should be a decision you made, not something you discover in a downstream pivot table.

```m
let
    Orders = Excel.CurrentWorkbook(){[Name="Orders"]}[Content],
    Products = Excel.CurrentWorkbook(){[Name="Products"]}[Content],
    Merged = Table.NestedJoin(Orders, {"SKU"}, Products, {"SKU"}, "ProductInfo", JoinKind.LeftOuter),
    Expanded = Table.ExpandTableColumn(Merged, "ProductInfo", {"ProductName", "Category", "UnitCost"})
in
    Expanded
```

**7. Let it refresh instead of redoing the lookup by hand.** Once the merge is set up, `Data > Refresh All` re-runs the join against updated source data — no re-dragging formulas down a new set of rows, and no risk of a stray cell still pointing at last month's lookup table.

The mental shift is small but useful: stop thinking of a multi-column lookup as "one formula per column" and start thinking of it as "one join, then pick the columns you want." Once a second or third lookup table enters the picture, Merge Queries scales in a way that a wall of `XLOOKUP`s never quite does.
