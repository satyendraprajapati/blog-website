---
title: "Running a Monte Carlo Simulation in Excel With RAND and a Data Table"
date: "2026-11-21"
tags: ["excel", "statistics", "data-analysis"]
excerpt: "How to turn a single-point forecast into a range of likely outcomes using RAND, RANDBETWEEN, and a one-variable Data Table, with no add-in required."
---

A forecast built from single "best guess" numbers — this month's sales will be $50,000, this project will take 20 days — hides how much uncertainty is actually baked into those inputs. A Monte Carlo simulation replaces each guess with a distribution, runs the calculation thousands of times with randomly varying inputs, and shows you the spread of outcomes instead of one misleadingly precise number. You don't need Python or an add-in to do a useful version of this — `RAND`, `RANDBETWEEN`, and a Data Table are enough.

**1. Model your uncertain input as a formula, not a fixed cell.** Say a project's duration depends on a task that normally takes 15–25 days. Instead of typing 20, generate a random value in that range every time the sheet recalculates:
```excel
=RANDBETWEEN(15, 25)
```
For something that isn't evenly likely across a range — most real-world quantities cluster around an average — use `RAND` to build a rough normal-ish distribution instead:
```excel
=NORM.INV(RAND(), 20, 3)
```
This returns a value centered on 20 with a standard deviation of 3, so results near 20 come up far more often than results near the edges — a much closer match to how task durations or sales figures actually behave.

**2. Build the calculation that depends on that random input.** This can be as simple as a total project duration summing several random task-length cells, or a profit formula referencing a randomized sales-volume cell. The key is that one output cell — call it `Result` — recalculates differently every time Excel refreshes.

**3. Use a one-variable Data Table to run the simulation hundreds of times at once, without copying formulas down manually.** Data Tables are usually taught for what-if analysis on a single changing input, but they have a side effect that's perfect here: every row forces a full recalculation, which re-rolls every `RAND`/`RANDBETWEEN` cell in the sheet. Set up a blank column input cell (any unused cell, it won't actually be used meaningfully), list 1 through 500 down a column as trial numbers, put `=Result` in the cell just above and to the right of that list, select the whole range, and go to Data → What-If Analysis → Data Table, leaving the column input cell set to that blank cell. Excel fills in 500 independent recalculated outcomes.

**4. Summarize the trials instead of eyeballing 500 numbers.** Once the Data Table column is full of simulated results, wrap it in standard statistical functions:
```excel
=AVERAGE(trial_results)
=PERCENTILE.INC(trial_results, 0.1)
=PERCENTILE.INC(trial_results, 0.9)
```
That gives you an expected value plus an 80% range — "most likely around $52,000, but anywhere from $44,000 to $61,000 is plausible" — which is a far more honest answer than a single forecasted figure, and takes the same five minutes to read.

**5. Chart the distribution, not just the summary stats.** A histogram of the trial results (Insert → Chart → Histogram, pointed at the Data Table column) shows the shape of your risk at a glance — a tight cluster around the average versus a long tail toward a bad outcome tell very different stories even when the average is identical.

**6. Press F9 to re-run the whole simulation on demand.** Every manual recalculation re-rolls all the random inputs and refreshes the entire Data Table, so you can watch the summary numbers settle as you add more trial rows, and get a feel for how many trials you actually need before the average stops moving much.

**7. Know the limits before you lean on this for something high-stakes.** Excel's `RAND` is fine for business forecasting but isn't a cryptographic-grade generator, a Data Table of a few thousand rows recalculates noticeably slower than a normal sheet, and this whole approach assumes your inputs are independent of each other — if two random inputs are actually correlated, this simple setup will understate the real risk. For anything beyond directional business forecasting, that's where a dedicated simulation tool or add-in earns its keep.

The output isn't a more precise number — it's an honest one. Swapping a single-point estimate for a distribution doesn't make the uncertainty go away, but it puts it in front of whoever's making the decision instead of burying it inside a formula that looks more confident than it should.
