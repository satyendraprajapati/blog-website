---
title: "Power BI Power Query: Append vs. Merge Queries — Combining Data the Right Way"
date: "2026-09-12"
tags: ["power-bi", "power-query", "data-modeling"]
excerpt: "Append and Merge sound like the same 'combine two tables' operation, but one stacks rows and the other joins columns — mixing them up is the fastest way to quietly duplicate or drop data before a model even loads."
---

Power Query's ribbon puts Append Queries and Merge Queries right next to each other, and both open a dialog asking you to pick another query — which makes it easy to reach for the wrong one under deadline pressure. They solve two completely different problems, and the fix for a model that "looks wrong" often starts with checking which one was used.

**1. Append stacks rows — use it when tables share the same structure.** If January, February, and March sales exports all have the same columns (Date, Region, Product, Revenue) and you want one long table of every transaction, that's an Append. Power Query lines the columns up by name and stacks the rows underneath each other, the same way a UNION works in SQL.

**2. Merge joins columns — use it when you're looking something up across tables.** If you have a Sales table with a `CustomerID` and a separate Customers table with `CustomerID`, `Name`, and `Region`, you don't want more rows — you want the Customers table's columns attached to each Sales row. That's a Merge, and it behaves like a SQL join: you pick a join kind (Inner, Left Outer, Right Outer, Full Outer, Anti) and the matching key column(s) on each side.

**3. Watch row counts immediately after both operations.** An Append should leave you with roughly the sum of both tables' row counts. A Merge with a Left Outer join should leave the *left* table's row count unchanged — if it grew, the "one" side of your relationship actually has duplicate keys, and every match is fanning out into extra rows.

**4. Use "Append Queries as New" instead of overwriting a query in place.** Appending directly into an existing query makes it hard to tell later which rows came from which source file. Creating a new query for the combined result keeps each month's raw query intact underneath it, which is what makes Power BI's Combine Files feature able to add a new month later without you rebuilding the append step by hand.

**5. Expand a Merge's result column deliberately, not by default.** After a Merge, the new column starts as a single field containing nested tables — clicking the expand icon lets you pick exactly which columns to pull in. Expanding every column "just in case" bloats the model with fields nobody queries; only bring across what a measure or a report visual actually needs.

**6. Know that an Anti join is how you find what's missing.** Left Anti returns only rows from the left table with *no* match on the right — the standard way to answer "which orders have no matching customer record" or "which products in the catalog never sold" without writing a NOT EXISTS query yourself.

```m
// Simplified shape of a Merge step in the applied-steps formula bar
= Table.NestedJoin(Sales, {"CustomerID"}, Customers, {"CustomerID"}, "CustomerData", JoinKind.LeftOuter)
```

**7. Push both operations upstream of anything expensive.** Merging or appending before filtering and type conversion forces Power Query to do that expensive work on the combined, larger table. Filter and clean each source first, then combine — it's usually faster and it isolates a bad row to the source query it actually came from, instead of the merged result.

Append and Merge are two of the most-used steps in any real Power BI model, and the failure mode for getting them backwards isn't a Power Query error — it's a report that loads fine and quietly shows the wrong numbers. A quick row-count sanity check after each one catches most of that before it ever reaches a dashboard.
