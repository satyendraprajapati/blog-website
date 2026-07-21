---
title: "Power BI What-If Parameters for Scenario Analysis"
date: "2026-07-21"
tags: ["power-bi", "dax", "what-if-analysis"]
excerpt: "How to add a What-If parameter to a Power BI report so stakeholders can test scenarios like a price change or growth rate without touching the underlying data."
---

Stakeholders don't usually want just "what happened" — they want "what would happen if." What if we raised prices 5%? What if churn dropped by two points? A What-If parameter lets a report answer that live, with a slider, instead of you rebuilding the model every time someone asks a hypothetical.

**1. Create the parameter.** In Power BI Desktop, go to *Modeling → New Parameter → Numeric Range*. Give it a name like `Price Increase %`, set a min, max, and increment (for example 0% to 20% in steps of 1%), and Power BI generates a small disconnected table plus a measure that returns the currently selected value.

**2. Understand what got created.** Behind the scenes, this adds a single-column table with one row per step, and a measure using `SELECTEDVALUE`:
```dax
Price Increase % Value = SELECTEDVALUE('Price Increase %'[Price Increase %], 0)
```
That table has no relationship to your data model — it's purely a UI input. The measure just reads whichever value the slider is currently set to.

**3. Wire the parameter into a real calculation.** The parameter is only useful once another measure reacts to it. To simulate revenue under a price increase:
```dax
Simulated Revenue =
VAR IncreasePct = [Price Increase % Value]
VAR BaseRevenue = SUM(Sales[Revenue])
RETURN
    BaseRevenue * (1 + IncreasePct)
```
Drop `Simulated Revenue` next to your actual `Revenue` measure on a card or chart, add the parameter's slicer to the page, and moving the slider updates the simulated number instantly.

**4. Give it a visible home.** Add the auto-generated slicer for the parameter table near the top of the page, not buried at the bottom — a What-If input that's easy to miss is a feature nobody uses. A short label like "Adjust to test a price increase" next to the slider removes any guesswork about what it does.

**5. Chain multiple parameters for richer scenarios.** You're not limited to one — a second parameter for, say, expected churn rate can feed the same measure, letting stakeholders stress-test two levers at once. Just keep the resulting DAX readable with `VAR`/`RETURN` rather than nesting the parameter references directly inside one long expression.

The core idea is that What-If parameters turn a static report into a lightweight simulator, and they cost nothing in model complexity — the parameter table is tiny and the logic lives entirely in a measure you can edit or remove at any time.
