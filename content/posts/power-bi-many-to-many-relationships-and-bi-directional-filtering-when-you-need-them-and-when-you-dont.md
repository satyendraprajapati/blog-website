---
title: "Power BI Many-to-Many Relationships and Bi-Directional Filtering: When You Need Them and When You Don't"
date: "2026-08-21"
tags: ["power-bi", "data-modeling", "dax"]
excerpt: "A many-to-many relationship or a bi-directional filter can fix a model that a strict star schema can't — and can just as easily quietly duplicate your numbers if you reach for it by default."
---

Star schema basics get you a fact table with one clean many-to-one relationship to each dimension, and most models can stop there. But some real data doesn't fit that shape — a single sale can involve multiple sales reps splitting commission, or a promotion can apply to many products across many campaigns at once. Power BI lets you build a relationship between two tables that both have repeating keys, but it changes how filtering behaves in ways that are easy to get wrong.

**1. A many-to-many relationship connects two tables where neither side has a unique key.** The textbook case is a bridge table: a `Products` table and a `Promotions` table where one promotion covers many products and one product can be in many promotions at once. Neither table has a one-to-one match, so a standard many-to-one relationship can't be built directly — Power BI lets you relate them as many-to-many, but it does so through a shared column that has duplicates on both sides.

```dax
Promo Sales =
CALCULATE(
    [Total Sales],
    Promotions[Active] = TRUE
)
```

**2. Filtering across a many-to-many relationship works, but it can inflate totals if you're not careful.** Because neither side is unique, a filter from the `Promotions` table can match multiple rows in `Products`, and vice versa — so a measure that should add up to your total sales can double-count rows that appear under more than one promotion. Before shipping a report built on a many-to-many relationship, check a control total against the ungrouped source data, not just against what looks reasonable on the visual.

**3. Cross filter direction determines whether a filter on one table reaches the other — "Both" is the setting that actually enables many-to-many.** By default, Power BI relationships filter in a single direction: from the "one" side to the "many" side. A bi-directional (Both) relationship lets a filter travel the other way too, which is what makes a many-to-many bridge actually work — filtering `Promotions` needs to reach `Products`, not just the other way around. You set this in the relationship's Edit dialog, not by writing DAX.

**4. Bi-directional filtering on a normal one-to-many relationship is a different problem, and it's the more common mistake.** Turning "Both" on for a standard fact-to-dimension relationship — say, `Sales` to `Customers` — lets a filter on `Sales` reach back and filter `Customers`, which can create ambiguous filter paths once a model has more than a couple of related tables. Power BI will sometimes refuse to activate a relationship at all if it creates a circular path; if it doesn't refuse, the ambiguity still exists, it just resolves silently and can produce numbers you didn't expect.

**5. Prefer `CROSSFILTER` inside a specific measure over setting the relationship to Both at the model level.** If you only need bi-directional filtering for one particular calculation, wrapping it in `CROSSFILTER` scopes the behavior to that measure instead of changing how every visual in the report filters through that relationship.

```dax
Products in Active Promo =
CALCULATE(
    DISTINCTCOUNT(Products[ProductID]),
    CROSSFILTER(Products[PromoID], Promotions[PromoID], BOTH)
)
```

**6. Model around many-to-many with a proper bridge table when you can, rather than relating the two repeating tables directly.** A dedicated bridge table — one row per product-promotion pair, with a single-column key to each side — keeps both of the main relationships as clean one-to-many connections and avoids the ambiguous-path problems that come with a direct many-to-many join. It's more setup up front, but it's the version of this pattern that scales as the model grows and stays predictable when someone else has to read it later.

Many-to-many and bi-directional filtering exist to solve a real class of problem a plain star schema can't — just don't reach for either as a default fix when a relationship "won't connect." Nine times out of ten that means the tables need a bridge, not a setting flipped to Both.
