---
title: "Goal Seek and Data Tables: What-If Analysis in Excel"
date: "2026-07-24"
tags: ["excel", "what-if-analysis", "beginner"]
excerpt: "Two built-in Excel tools for answering 'what would it take?' and 'what happens if?' questions without building a second copy of your model."
---

A lot of analyst work isn't "what happened" but "what would need to be true." What growth rate hits our target? What happens to margin if costs rise 8%? Excel has two built-in tools under the *Data → What-If Analysis* menu built exactly for this, and both are underused compared to how often the questions come up.

**1. Use Goal Seek when you know the answer and need the input.** Say a pricing model in `B10` calculates net profit from a price in `B2`, and you want to know what price yields exactly $50,000 profit. Instead of manually nudging `B2` and recalculating, open *Data → What-If Analysis → Goal Seek*, set `B10` to `50000` by changing `B2`, and Excel solves it by iteration. It's a single-variable, single-target tool — it can't optimize multiple inputs at once, but for "what price/quantity/rate gets me here" questions it's faster than trial and error.

**2. Use a One-Variable Data Table to test a range of inputs at once.** Where Goal Seek answers one question, a Data Table answers many in a grid. Lay out a column of candidate values (say, growth rates from 2% to 10%) next to a formula cell that references your model, then select the range and go to *Data → What-If Analysis → Data Table*, pointing the "Column input cell" at the growth rate cell your formula depends on. Excel recalculates the formula for every value in the column and fills in the results — no copy-pasting the model five times.

```excel
' Layout for a one-variable data table
' A1: =NetProfit (formula referencing GrowthRate cell, e.g. C1)
' A2:A10: candidate growth rates (2%, 3%, 4%, ... 10%)
' Select A1:B10, Data > What-If Analysis > Data Table
' Column input cell: C1
```

**3. Use a Two-Variable Data Table when two inputs move together.** The same feature extends to two variables — say growth rate across the columns and cost inflation down the rows — producing a full sensitivity grid instead of a single line. This is the fastest way to build the "sensitivity table" stakeholders often ask for in a board deck, and it updates automatically if the underlying model changes.

**4. Know when to reach for Scenario Manager instead.** If you need to flip between a small number of named, multi-input combinations — "Best Case," "Base Case," "Worst Case" — rather than scan a continuous range, *Data → What-If Analysis → Scenario Manager* stores each full set of inputs and lets you switch between them with a dropdown, which reads better in a live walkthrough than a data table grid.

**5. Remember Data Tables recalculate the whole workbook by default.** On a large model, dozens of data table cells can make Excel noticeably slower, because each one is a full what-if recalculation under the hood. If that's a problem, switch calculation mode to *Automatic Except for Data Tables* under *Formulas → Calculation Options*, and press F9 to refresh them manually when you actually need updated numbers.

None of this requires Power Query or a single line of DAX — it's native Excel, and it turns "let me rebuild this with different numbers" into a couple of clicks.
