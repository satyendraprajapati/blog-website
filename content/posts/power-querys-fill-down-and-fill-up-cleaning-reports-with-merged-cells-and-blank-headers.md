---
title: "Power Query's Fill Down and Fill Up: Cleaning Reports With Merged Cells and Blank Headers"
date: "2026-11-22"
tags: ["excel", "power-query", "data-cleaning"]
excerpt: "How Power Query's Fill Down and Fill Up commands turn a merged-cell export into a proper flat table without writing a single formula."
---

Export a report from an ERP or accounting system and you'll often get something designed to look good printed, not to be analyzed: a region name sits once at the top of ten rows, a "Q1 Total" label appears only on the last row of a group, and everything in between is blank. Unmerge those cells in Excel and the blanks become real empty cells — which is exactly the shape Power Query needs to fix the problem for good.

**1. See the pattern before you fix it.** Load the report into Power Query (Data → From Table/Range or From File) and look at the column that only has a value every few rows — a `Region` or `Department` column where the label appears once per group and then goes blank until the next group starts. That blank isn't missing data; it means "same as above."

**2. Fill Down carries the last value forward.** Right-click the column header → **Fill → Down**, or use the Transform tab's Fill button. Every blank cell below a value now repeats that value until the next non-blank cell resets it.
```powerquery-m
Table.FillDown(#"Previous Step", {"Region"})
```
A `Region` column that read `West, (blank), (blank), East, (blank)` becomes `West, West, West, East, East` — now every row can be grouped, filtered, or summed by region correctly.

**3. Fill Up handles labels that trail instead of lead.** Some exports put the category label on the *last* row of a group instead of the first — a subtotal row reading "Widgets" sitting below five blank-labeled detail rows. **Fill → Up** copies that trailing value backward through the blanks above it, the mirror image of Fill Down.
```powerquery-m
Table.FillUp(#"Previous Step", {"Product Category"})
```

**4. Fill Down only works on actual nulls, not empty-looking text.** If the source cells contain `""` or a space instead of a true blank, Fill Down will skip right past them — it has nothing to detect. Run a Replace Values step first (replace `""` with `null`) so Power Query recognizes the gaps as genuinely empty before you fill them.

**5. Fill before you remove blank rows, not after.** A common mistake is deleting rows where a key column looks blank, assuming they're junk — but those are often the detail rows you actually want, just missing their label because of the merge. Always fill first; removing blanks is a separate, later decision once every row actually has the data it needs.

**6. Watch for fills that cross a boundary they shouldn't.** If your export stacks multiple unrelated tables in one sheet (a second report starting a few rows below the first), Fill Down will happily carry a label from the first table into the second. Add a step that filters out header/blank-separator rows before filling, or fill in two passes split around a known marker row, so a label doesn't leak across a boundary that should have stopped it.

Fill Down and Fill Up look like a two-click convenience, but they solve a structural problem that plenty of analysts work around with manual retyping or a fragile `IF(A2="",A1,A2)` formula dragged down a column. Doing it as a Power Query step instead means the next refresh of the same messy export gets cleaned up automatically, with no manual re-filling required.
