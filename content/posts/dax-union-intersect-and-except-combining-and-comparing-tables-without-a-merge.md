---
title: "DAX UNION, INTERSECT, and EXCEPT: Combining and Comparing Tables Without a Merge"
date: "2026-10-12"
tags: ["power-bi", "dax", "data-modeling"]
excerpt: "Three table functions let you stack, intersect, or diff tables inside a DAX measure instead of reaching for Power Query."
---

Power Query is the usual place to combine tables with Append or Merge, but reshaping the model itself isn't always the right move — sometimes you just need a one-off comparison inside a measure or a calculated table, without touching the data model's structure. DAX's three set operators do that: `UNION`, `INTERSECT`, and `EXCEPT`, all of which work on tables with the same number of columns rather than on matching key fields.

**1. `UNION` stacks tables on top of each other.** It appends rows from two or more tables with identical column counts and compatible data types — matching by column position, not column name. It's useful for building a calculated table that combines two differently-filtered views of the same data, like "this year's top 5" and "last year's top 5" into one ranked list:

```dax
Combined Top5 =
UNION(
    TOPN(5, 'Sales', 'Sales'[Revenue], DESC),
    TOPN(5, CALCULATETABLE('Sales', SAMEPERIODLASTYEAR('Date'[Date])), 'Sales'[Revenue], DESC)
)
```

**2. `INTERSECT` keeps only rows that exist in both tables.** It's the DAX equivalent of an inner-join-on-everything, and it's commonly used to answer "which customers are in both segments" style questions:

```dax
Customers In Both =
INTERSECT(
    SELECTCOLUMNS(FILTER('Sales', 'Sales'[Channel] = "Online"), "CustomerID", 'Sales'[CustomerID]),
    SELECTCOLUMNS(FILTER('Sales', 'Sales'[Channel] = "Retail"), "CustomerID", 'Sales'[CustomerID])
)
```

**3. `EXCEPT` returns rows in the first table that aren't in the second.** This is the one analysts reach for most — finding records that dropped out of a list, like customers who bought last period but not this one:

```dax
Lapsed Customers =
EXCEPT(
    SELECTCOLUMNS(CALCULATETABLE(VALUES('Sales'[CustomerID]), SAMEPERIODLASTYEAR('Date'[Date])), "CustomerID", 'Sales'[CustomerID]),
    SELECTCOLUMNS('Sales', "CustomerID", 'Sales'[CustomerID])
)
```

**4. Wrap the result in `COUNTROWS` to turn it into a measure.** Calculated tables are useful for drill-through pages, but most report cards just need a number — `COUNTROWS(EXCEPT(...))` gives you "Lapsed Customers: 42" directly on a card visual without materializing a visible table anywhere.

**5. Watch the column matching rule — it's position, not name.** If your two `SELECTCOLUMNS` calls don't return columns in the same order, `UNION`, `INTERSECT`, and `EXCEPT` will silently compare the wrong fields against each other. Keep the column lists identical in structure and order, and give both sides the same alias to make the DAX easier to audit later.

**6. Prefer these over a bi-directional relationship for a one-off comparison.** It's tempting to solve "who's in both lists" by building a relationship and a cross-filtering measure, but that changes how every other visual on the report filters. A set-operator calculated table or measure is scoped to exactly the comparison you're asking for, and it disappears cleanly if the question goes away.

These three functions won't replace Power Query for genuine data preparation, but for a quick comparison that only needs to exist inside a measure or a single calculated table, they're faster to write and easier to reason about than restructuring the model to get the same answer.
