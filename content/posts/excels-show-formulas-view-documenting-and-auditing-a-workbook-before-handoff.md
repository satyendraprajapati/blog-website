---
title: "Excel's Show Formulas View: Documenting and Auditing a Workbook Before Handoff"
date: "2026-11-02"
tags: ["excel", "formulas", "beginner"]
excerpt: "Toggling Show Formulas with Ctrl+` turns every cell into its underlying formula at once, making it a fast way to audit or document a workbook before someone else inherits it."
---

Handing a workbook off to a teammate — or opening one you built six months ago — usually means clicking through cells one at a time to see what's actually driving the numbers. Show Formulas skips that entirely by displaying every formula in the sheet at once, in place of its calculated result.

**1. Toggle it with Ctrl+` (the key above Tab), not a ribbon hunt.** It's also under Formulas > Show Formulas, but the shortcut is worth learning since you'll flip it on and off repeatedly while auditing a sheet. Pressing it again instantly returns every cell to its normal calculated view — nothing is changed or saved, it's purely a display mode.

**2. Column widths usually need widening to read anything.** A formula like the one below is far longer as text than the number it produces, so cells that looked fine with results showing will often display `###` or get visually truncated once formulas appear.
```excel
=SUMIFS(Sales[Revenue], Sales[Region], "West", Sales[Month], A2)
```
Select the whole sheet (Ctrl+A) and double-click a column border to auto-fit everything at once rather than resizing column by column.

**3. It's the fastest way to spot inconsistency across a column that should all use the same logic.** A report built by copying and tweaking formulas row by row often drifts — row 12 might reference the wrong column, or someone pasted a value over a formula without noticing. Scrolling down a column of visible formulas makes a one-off break jump out in a way that scanning matching numbers never will.

**4. Combine it with Ctrl+[ to jump straight to a formula's source cells.** Once you've spotted a formula worth checking, Ctrl+[ selects every cell it references directly — useful for confirming a formula is pulling from the range you think it is before you trust the number it returns.

**5. Print or export it as part of your documentation, not just a one-time check.** If a workbook is going to outlive you on a shared drive, a printed or PDF'd Show Formulas view — alongside the normal results view — gives the next person a reference for what every cell is actually doing, without them needing to click through the sheet themselves. Set a print area first, since a wide sheet of visible formulas tends to need landscape orientation and a narrower font to fit a page.

**6. It only affects the active sheet, and only your view of the file.** Toggling it on one worksheet doesn't change any other tab in the workbook, and if the file is shared, another person opening it still sees calculated results by default — Show Formulas is a personal display setting, not something saved into the shared state of the file for everyone.

None of this replaces a proper audit trail or documentation tab, but for the common case of inheriting someone else's spreadsheet — or revisiting your own after long enough to forget how it works — toggling one shortcut and reading down the sheet is often faster than clicking into twenty individual cells to find out what's wrong.
