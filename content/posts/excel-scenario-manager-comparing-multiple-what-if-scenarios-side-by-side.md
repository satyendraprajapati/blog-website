---
title: "Excel Scenario Manager: Comparing Multiple What-If Scenarios Side by Side"
date: "2026-08-08"
tags: ["excel", "what-if-analysis", "beginner"]
excerpt: "How to save several sets of input assumptions in one workbook and flip between them — or view them all in one summary table — without duplicating your model."
---

Goal Seek answers "what input gets me this output?" and Data Tables answer "what happens across a range of one or two inputs?" Scenario Manager answers a different question: "what if several inputs change together, and I want to save that combination to come back to later?" It's the tool for best-case/base-case/worst-case models, or any analysis where a stakeholder asks "can you show me that again with different assumptions?"

**1. Set up your model with named input cells.** Scenario Manager works on individual cells, so before opening it, make sure your assumptions — growth rate, price, headcount, whatever varies — live in their own labeled cells that your formulas reference. If you're changing a hardcoded number inside a formula, Scenario Manager has nothing to grab onto.

**2. Open Data → What-If Analysis → Scenario Manager.** Click **Add**, give the scenario a name like "Base Case," and select the changing cells (hold Ctrl to pick several non-adjacent cells). On the next screen, type in the values for that scenario.

**3. Add as many scenarios as you need against the same changing cells.** Click **Add** again for "Best Case," change the values, then again for "Worst Case." Every scenario references the *same* set of changing cells — that's what makes them comparable — just with different values plugged in.

**4. Use Show to flip your whole model live.** Select any scenario in the list and click **Show**, and Excel plugs those values into the changing cells so every formula downstream recalculates instantly. This is the fast way to present three versions of a forecast in one meeting without three separate files.

**5. Generate a Scenario Summary to see them all at once.** Click **Summary**, choose the result cells you care about (your final revenue, margin, or headcount total), and Excel builds a new sheet listing every scenario's inputs and outputs side by side:
```excel
Scenario Summary
                    Base Case   Best Case   Worst Case
Growth Rate         5%          12%         -3%
Price               $49         $55         $42
Result: Revenue     $612,000    $780,000    $498,000
```
That table is what you actually hand to a stakeholder — it's static (a snapshot, not linked formulas), so it won't shift if someone changes an input cell later.

**6. Know when to reach for something else instead.** Scenario Manager tops out around 32 changing cells per scenario and gets unwieldy past four or five scenarios — at that point a simple input table with a dropdown-driven `CHOOSE` or `SWITCH` formula is easier to maintain and audit. Scenario Manager is best for a handful of clearly named, discrete "versions" of a model you'll revisit repeatedly, not for continuously varying assumptions — that's what Data Tables are for.

The habit worth building is naming scenarios the way you'd want to see them in a meeting — "Base Case," not "Scenario 3" — since that label is exactly what shows up in the summary table and the Show dropdown later.
