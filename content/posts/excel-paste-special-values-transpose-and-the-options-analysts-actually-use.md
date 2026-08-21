---
title: "Excel Paste Special: Values, Transpose, and the Options Analysts Actually Use"
date: "2026-08-21"
tags: ["excel", "productivity", "beginner"]
excerpt: "A regular paste carries formulas, formatting, and links along with it — Paste Special lets you choose exactly what comes with the data and what gets left behind."
---

A plain `Ctrl+V` copies everything about a cell: its formula, its formatting, its links to other sheets, all of it. Most of the time that's fine. But the moment you're pasting a formula result into a report that shouldn't recalculate, or pasting a table that needs to face the other direction, a regular paste actively works against you. Paste Special (`Ctrl+Alt+V`) is the dialog that lets you pick apart what actually gets copied.

**1. Paste Values Only when you need a snapshot, not a live formula.** If you've built a model with `VLOOKUP`s or `SUMIFS` pulling from a source range, and you want to hand off a static copy — an archived month-end report, a value that shouldn't shift if the source data changes later — pasting the formula just moves the dependency, not the number. `Ctrl+Alt+V` → **Values** strips the formula and leaves the calculated result behind, so the pasted cell is a plain number that can't break if the original range moves or gets deleted.

**2. Transpose turns a row into a column, or a column into a row, without retyping anything.** A common case: someone hands you monthly figures running left to right across a row, and your model expects them stacked in a column. Copy the range, `Ctrl+Alt+V` → check **Transpose**, and the orientation flips on paste. It works on formulas too, though the references inside them stay relative unless you paste values first — transpose a range of live formulas and check the results before trusting them.

**3. Paste Formats Only lets you copy just the look of a cell, not its content.** Useful for applying a conditional-formatting-free style — borders, fill color, number format — from one summary table to a new one without dragging over the original's data or formulas. It's a cleaner alternative to the Format Painter when you're applying the same style to a range that isn't right next to the source.

**4. The Operation options (Add, Subtract, Multiply, Divide) do bulk arithmetic without a helper column.** Copy a single cell containing a percentage, select a range of numbers, then `Ctrl+Alt+V` → **Multiply**. Every cell in the selection gets multiplied by that value in place. This is the fastest way to apply an across-the-board adjustment — a currency conversion rate, a unit conversion, an inflation factor — to a block of numbers someone handed you as static values, without writing `=A1*$B$1` down an entire column first.

**5. Paste Special respects "Skip Blanks" when you're merging an update into an existing table.** If a source range has some blank cells mixed in with updated values, a normal paste overwrites the destination cells with those blanks too — wiping out data that didn't actually change. Checking **Skip Blanks** in the dialog makes the paste leave the destination cell untouched wherever the source is empty, which is exactly what you want when merging a partial update (say, this week's corrections) into a table that already has the rest of its values filled in.

**6. Combine options in one paste — Values plus Transpose, or Values plus an Operation — instead of doing them as separate steps.** The dialog lets you check more than one box at a time, so a single `Ctrl+Alt+V` can both strip the formulas and flip the orientation, saving a pass through an intermediate paste that most people don't realize is unnecessary.

None of these show up if you only ever hit `Ctrl+V`, but they cover a real chunk of the manual cleanup work analysts do by hand — retyping transposed data, rebuilding a static copy formula by formula, or nudging a hundred cells by the same percentage one at a time. Learning where each option lives in the dialog turns a few of those into a single keystroke.
