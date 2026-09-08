---
title: "Understanding Spill Ranges in Excel and Fixing #SPILL! Errors"
date: "2026-09-08"
tags: ["excel", "dynamic-arrays", "troubleshooting"]
excerpt: "What a spill range actually is, why #SPILL! errors happen, and how to reference spilled results without breaking them."
---

Any formula that returns more than one value — `UNIQUE`, `FILTER`, `SORT`, `SEQUENCE`, or even a plain range like `=A1:A5` — "spills" its results into the neighboring empty cells automatically. Excel outlines the whole spill range with a blue border when you select the top-left cell, but only that top-left cell actually holds the formula; everything else is a ghost value you can't edit directly. Once that one rule clicks, most of the confusion around dynamic arrays and `#SPILL!` errors goes away.

**1. A `#SPILL!` error almost always means something is in the way.** If any cell in the space a formula needs to spill into already has a value — even a stray space character — Excel refuses to spill and shows `#SPILL!` instead of the result. Click the error, choose "Select Obstructing Cells," and clear whatever's there.
```excel
=UNIQUE(A2:A100)
```
If a single cell below the formula has so much as a leftover space, this throws `#SPILL!` instead of listing the unique values.

**2. Reference the whole spill range with a trailing `#`.** Once a formula spills, you can refer to its entire output — not just the anchor cell — by adding `#` after the cell reference. This keeps a downstream formula in sync automatically as the spill grows or shrinks.
```excel
=SUM(D2#)
```

**3. Use `@` (implicit intersection) when you want just one value, not the array.** If you reference a spilled range in a context expecting a single value, Excel inserts `@` for you and returns only the corresponding row instead of the whole array. Recognizing this symbol saves a lot of head-scratching when a formula copied down suddenly behaves differently than expected.

**4. Edit or delete a spill formula from its anchor cell only.** You can't delete or edit an individual cell inside a spill range — try it and Excel blocks the edit with "You can't change part of a spill range." Always select the top-left (anchor) cell; the rest of the range updates or clears with it.

**5. Leave breathing room below and to the right of dynamic array formulas.** Because spill ranges grow and shrink with the source data, it's safer to leave open space beneath a formula like `=SORT(FILTER(A2:A100,B2:B100="West"))` rather than placing another table directly underneath it — otherwise a single new row of source data can turn a working report into a wall of `#SPILL!` errors the next time it refreshes.

**6. A `#SPILL!` warning can also mean the array is too big for the sheet.** If a dynamic array would need to spill past the last row or column of the worksheet, Excel throws `#SPILL!` rather than truncating the result silently. This is rare, but worth checking before assuming the problem is an obstructing cell.

Spill ranges are one of the more genuinely useful upgrades in modern Excel — they replace a lot of the array-formula gymnastics (`Ctrl+Shift+Enter` and all) required in older versions. They only feel natural once you stop thinking of a dynamic array as many separate formulas and start thinking of it as one formula that happens to render across many cells.
