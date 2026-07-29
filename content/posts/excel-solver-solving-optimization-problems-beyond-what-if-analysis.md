---
title: "Excel Solver: Solving Optimization Problems Beyond What-If Analysis"
date: "2026-07-29"
tags: ["excel", "solver", "optimization"]
excerpt: "How to use Excel's Solver add-in to find the best combination of inputs under constraints, instead of hand-testing scenarios one at a time."
---

Goal Seek answers "what single input hits this one target?" But a lot of real analyst questions are messier than that — "what mix of spend across five channels maximizes revenue, given a total budget cap and a minimum spend per channel?" That's an optimization problem with multiple variables and constraints, and it's what the Solver add-in is built for.

**1. Enable Solver before you can use it.** It ships with Excel but isn't on by default. Go to *File → Options → Add-ins*, select **Excel Add-ins** in the Manage dropdown, click **Go**, and check **Solver Add-in**. It then appears under the *Data* tab.

**2. Build the model before opening Solver.** Solver doesn't create formulas for you — it adjusts inputs you've already wired into a working model. Set up one cell for each decision variable (e.g., ad spend per channel), a formula cell that calculates the outcome you care about (total revenue), and any formula cells needed to check your constraints (total spend, per-channel minimums).

**3. Set the objective, variable cells, and constraints in the Solver dialog.** Open *Data → Solver*, then:

```excel
' Set Objective: TotalRevenue cell → Max
' By Changing Variable Cells: the 5 channel-spend cells
' Subject to the Constraints:
'   SUM(channel spends) <= 50000        (budget cap)
'   each channel spend  >= 2000         (minimum spend)
'   each channel spend  >= 0            (no negative spend)
```

Add each constraint with the **Add** button, pointing at the relevant cells and choosing `<=`, `>=`, or `=`.

**4. Pick a solving method that matches your model.** Solver offers three engines: **Simplex LP** for models where every relationship is linear (spend and revenue scale proportionally — fastest and most reliable when it applies), **GRG Nonlinear** for smooth but non-linear relationships (diminishing returns curves are common in marketing-mix models), and **Evolutionary** for messy, discontinuous models where the other two struggle to converge. Start with Simplex LP if your formulas are just sums and products; switch to GRG Nonlinear if it fails to find a solution.

**5. Read the Solver Results dialog before accepting.** After clicking **Solve**, Excel reports whether it found an optimal solution, a feasible-but-not-provably-optimal one, or nothing at all. If it can't converge, the usual culprits are conflicting constraints (a minimum spend per channel that already exceeds the total budget) or a non-linear model solved with the linear engine.

**6. Use Answer and Sensitivity Reports to explain the result.** Before clicking **OK**, the dialog lets you generate an Answer Report (which constraints were binding — i.e., which limits actually shaped the outcome) and a Sensitivity Report (how much the objective would change if a constraint loosened by one unit). These are usually more useful to a stakeholder than the raw output, since "we're budget-constrained, not channel-constrained" is the actual insight behind the numbers.

**7. Save different constraint setups as Solver models if you'll rerun this often.** Click **Load/Save** in the dialog to store the current variable cells, constraints, and objective against a named range, so you can switch between "conservative" and "aggressive" constraint sets without rebuilding the dialog each time.

Solver won't replace a dedicated optimization tool for genuinely large or complex problems, but for the budget-allocation and resource-planning questions that come up in everyday analyst work, it turns a spreadsheet of manual trial-and-error into a few minutes of setup.
