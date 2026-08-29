---
title: "DAX RELATED and RELATEDTABLE: Pulling Fields Across Relationships Without a Merge"
date: "2026-08-29"
tags: ["power-bi", "dax", "data-modeling"]
excerpt: "How RELATED and RELATEDTABLE let a calculated column or measure reach across an existing model relationship to fetch a value or a related table, instead of merging queries in Power Query."
---

If your model already has a relationship between two tables, you don't need to merge them in Power Query just to pull a field from one into a calculation on the other — that's exactly what `RELATED` and `RELATEDTABLE` are for. They walk a relationship that already exists, at query time, instead of duplicating columns into a wider table.

**1. `RELATED` pulls a single value from the "one" side of a relationship.** If `Sales` has a many-to-one relationship to `Products` on `ProductID`, a calculated column on `Sales` can reach across that relationship to grab a field from `Products` directly, without a lookup formula or a query merge.
```dax
Category = RELATED(Products[Category])
```
This only works in the direction from the "many" side to the "one" side — from an individual sales row, there's exactly one matching product, so DAX knows which value to return. It has no `RELATEDTABLE` counterpart in that direction because a single value is all there is to fetch.

**2. `RELATEDTABLE` goes the other way — from "one" to "many."** From a single row in `Products`, there could be dozens of matching `Sales` rows, so instead of one value, `RELATEDTABLE` returns a table. It's most useful inside an aggregation function, not on its own.
```dax
Order Count = COUNTROWS(RELATEDTABLE(Sales))
```
Placed as a calculated column on `Products`, this returns how many sales rows relate to each product — the reverse-lookup direction that `RELATED` can't do.

**3. Both only work along a relationship that already exists in the model.** If there's no active relationship between the two tables — or the one you need is marked inactive — `RELATED` returns blank and `RELATEDTABLE` returns an empty table, silently, with no error to warn you. That's the giveaway that you're either missing a relationship or need `USERELATIONSHIP` to activate a different one for that specific calculation.

**4. Prefer `RELATED` over a Power Query merge when the only reason for the merge is a calculated column.** Merging queries physically duplicates the related column into every row of the bigger table, which grows your model's memory footprint and adds a maintenance step every time the source data refreshes. `RELATED` computes the same result on the fly from the existing relationship, so the model stays smaller and the star schema stays intact — one fact table, one dimension table, one relationship, not a flattened hybrid of both.

**5. Know where these belong: calculated columns, not measures.** Both functions rely on row context — a specific current row to walk the relationship from — which calculated columns have naturally and measures don't (until something like `CALCULATE` or an iterator like `SUMX` creates one). You'll see `RELATED` far more often than `RELATEDTABLE` in practice, since pulling one attribute across a relationship is a much more common need than counting or aggregating a whole related table from a calculated column.

The mental model that makes both click: your relationships aren't just there for filtering visuals and slicers — they're also a path a calculated column can walk to borrow a field or a table from the other side, which is usually a cleaner fix than reshaping your tables to avoid the walk in the first place.
