---
title: "Excel's FORMULATEXT Function: Documenting Formulas Next to the Cells That Use Them"
date: "2026-11-20"
tags: ["excel", "data-analysis", "beginner"]
excerpt: "A simple function that displays a cell's formula as readable text, so you can document, audit, and debug a workbook without flipping Show Formulas on and off."
---

A coworker opens your workbook, sees a number, and has no idea how it was calculated without clicking into the cell and reading the formula bar one cell at a time. `FORMULATEXT` fixes that by putting the formula itself, as plain text, right next to the result — so the logic is visible without anyone having to go hunting for it.

**1. The syntax is just one argument: the cell you want to document.** Point it at any cell containing a formula, and it returns that formula as a text string in the cell where you typed `FORMULATEXT`.
```excel
=FORMULATEXT(D2)
```
If `D2` contains `=SUMIFS(Sales[Revenue], Sales[Region], "West")`, the cell with this formula shows that exact text — not the calculated result, the formula itself.

**2. Use it to build a visible "how this was calculated" column.** In a report where several columns use different formulas — one a lookup, one a sum, one a ratio — add a hidden or side panel column that runs `FORMULATEXT` against each, so a reviewer can scan the logic column by column instead of clicking through cells one at a time.
```excel
=FORMULATEXT(C2)
```

**3. It's a cleaner alternative to Show Formulas for partial documentation.** Ctrl+` (Show Formulas) switches the *entire sheet* into formula-view mode, breaking column widths and number formatting while you look. `FORMULATEXT` documents only the cells you choose, in a dedicated column, without disturbing how the rest of the sheet displays.

**4. It catches a formula mismatch a visual scan would miss.** Copy a formula down a column, and sometimes a reference gets fixed or dragged incorrectly partway through, so row 40 is quietly calculating something different from row 4. Running `FORMULATEXT` down an adjacent column turns that into a text column you can scan — or feed into `COUNTIF`/`EXACT` checks — to spot the row where the formula text changes unexpectedly.

**5. It returns an error on a cell that isn't a formula, which is itself useful.** If the referenced cell holds a typed-in value rather than a formula, `FORMULATEXT` returns `#N/A`. Wrapping it in `IFERROR` turns that into a clear flag — "this cell is hardcoded, not calculated" — which matters when you're auditing a workbook for inputs that should have been formulas but got overwritten with a pasted number.
```excel
=IFERROR(FORMULATEXT(E2), "hardcoded value")
```

**6. It updates automatically if the underlying formula changes.** Because it's a live formula pointing at another cell, editing the source formula updates the documentation column the next time the sheet recalculates — no manual re-typing of a comment or note required.

**7. Pair it with a Notes or Comments column for context the formula text can't carry.** `FORMULATEXT` shows *what* the formula does mechanically, not *why* — it won't explain that a `SUMIFS` excludes a region because of a known data issue. Keep the "why" in a cell comment and let `FORMULATEXT` handle the "what," so a handoff doesn't rely on anyone remembering to explain the logic out loud.

For a workbook that's going to outlive the person who built it, a `FORMULATEXT` column costs one extra column and pays for itself the first time someone else has to figure out what a formula is actually doing.
