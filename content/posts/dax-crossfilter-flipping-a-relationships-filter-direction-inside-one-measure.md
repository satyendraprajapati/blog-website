---
title: "DAX CROSSFILTER: Flipping a Relationship's Filter Direction Inside One Measure"
date: "2026-11-09"
tags: ["power-bi", "dax", "beginner"]
excerpt: "How CROSSFILTER lets a single measure borrow bi-directional (or one-directional) filtering from a relationship without changing the model's settings for every other visual."
---

Most relationships in a Power BI model filter one way — a Customers table filters a Sales table, not the other way around. That's the right default for performance and for avoiding ambiguous filter paths. But every so often a single measure genuinely needs the filter to flow in both directions, and flipping the relationship itself to bi-directional affects every report page, not just the one visual that needed it. `CROSSFILTER` solves this at the measure level instead.

**1. `CROSSFILTER` changes direction only for the duration of one `CALCULATE`.** It takes the relationship (named by its two columns), a direction (`BOTH`, `ONEWAY`, or `NONE`), and an optional third argument to reset context. The change applies only inside that specific calculation — the model's actual relationship settings, and every other measure and visual, are untouched.

**2. The classic use case is counting "the other side" of a one-directional relationship.** Say `Customers` filters `Sales` normally, but you want a measure that counts customers who placed an order within whatever period is currently filtered — which requires the filter to flow from `Sales` back to `Customers`, just this once:

```dax
Customers With Orders In Period =
CALCULATE(
    DISTINCTCOUNT(Customers[CustomerID]),
    CROSSFILTER(Sales[CustomerID], Customers[CustomerID], BOTH)
)
```

Without the `CROSSFILTER` line, this measure would return the same total customer count regardless of which period, product, or region a visual is sliced by — because the filter has no path back to the customer table.

**3. `NONE` is just as useful as `BOTH`.** Sometimes you want the opposite problem solved: a measure that ignores filtering coming through a specific relationship entirely, without reaching for a broader `ALL` or `REMOVEFILTERS` that would strip out other filters too. `CROSSFILTER(table1[col], table2[col], NONE)` cuts just that one path.

**4. It only works on relationships that already exist in the model.** `CROSSFILTER` redirects an existing relationship's behavior — it doesn't create a virtual one the way `TREATAS` does. If two tables aren't already related, this function won't help; that's a job for `TREATAS` or a proper model relationship instead.

**5. Prefer this over a model-wide bi-directional setting when only one measure needs it.** Setting a relationship to bi-directional in the model view solves the same problem, but globally — which can introduce ambiguous filter paths elsewhere in a model with more than two tables, and has a real performance cost on large fact tables. `CROSSFILTER` gets you the same result scoped to exactly the measure that asked for it.

**6. Watch for ambiguity when a table has multiple relationship paths.** If `CROSSFILTER` creates a situation where two tables are connected through more than one active path at once, DAX will throw an error rather than guess. Test the measure against a few different slicer combinations before trusting it in a published report.

Used sparingly, `CROSSFILTER` is the difference between "flip a model setting and hope nothing else breaks" and "this one measure needed the filter to go backwards, and now it does — without touching anything else."
