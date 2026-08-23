---
title: "Power BI DAX USERELATIONSHIP: Activating Inactive Relationships for Role-Playing Dimensions"
date: "2026-08-23"
tags: ["power-bi", "dax", "data-modeling"]
excerpt: "How to use USERELATIONSHIP to switch between multiple date relationships on the same fact table, like Order Date and Ship Date, without duplicating the calendar table."
---

A Sales table often needs two dates — Order Date and Ship Date — both relating to the same Date dimension. Power BI only lets one relationship between a pair of tables be active at a time, so the second one sits there grayed out and unused unless a measure explicitly asks for it. `USERELATIONSHIP` is how you ask for it.

**1. Power BI only activates one relationship per table pair automatically.** If `Sales[OrderDate]` and `Sales[ShipDate]` both relate to `Date[Date]`, the model view shows one as a solid line (active) and the other as a dashed line (inactive). Visuals and measures use the active one by default — the inactive one contributes nothing until a measure tells `CALCULATE` to use it.

**2. `USERELATIONSHIP` goes inside `CALCULATE`, alongside your filter arguments.** It doesn't filter anything itself — it tells that one `CALCULATE` call which inactive relationship to treat as active for its evaluation.

```dax
Sales by Ship Date =
CALCULATE(
    SUM(Sales[Amount]),
    USERELATIONSHIP(Sales[ShipDate], Date[Date])
)
```

**3. Build one measure per relationship you need, rather than switching the model's active one back and forth.** Making `ShipDate` the active relationship "fixes" ship-date reporting but breaks every existing measure that assumed `OrderDate` was active — a real risk if other report pages already depend on the default. A dedicated `Sales by Ship Date` measure sits alongside `Total Sales` without touching what already works.

**4. This is the direct alternative to duplicating your Date table.** Before `USERELATIONSHIP`, the common workaround was a second `Date (Ship)` table related only to `ShipDate` — which works, but doubles your calendar table and anything built on it (year/quarter hierarchies, holiday flags, fiscal calendars), and now needs to be maintained twice. One shared Date table with `USERELATIONSHIP` measures keeps a single source of truth for what "March" or "Q2" means.

**5. It only works when both tables already share a real, matching column — unlike `TREATAS`.** `USERELATIONSHIP` activates a relationship that Power BI could have made active on its own; it needs an actual join column on both sides, just like any other relationship. If your two tables don't share a common key at all — a budget table keyed on category text with no shared ID — that's a job for `TREATAS`, not this.

**6. Combine it with time intelligence functions the same way.** `USERELATIONSHIP` composes normally inside `CALCULATE`, so it works alongside functions like `DATESYTD` or `SAMEPERIODLASTYEAR` in the same call — useful for a "Ship Date YTD" measure that needs both the inactive relationship and a year-to-date filter applied together.

```dax
Ship Date YTD =
CALCULATE(
    SUM(Sales[Amount]),
    USERELATIONSHIP(Sales[ShipDate], Date[Date]),
    DATESYTD(Date[Date])
)
```

Once you have more than one plausible date (or any other dimension) a fact table could relate to, `USERELATIONSHIP` is what keeps the model to one shared dimension table instead of a duplicate for every reporting angle.
