---
title: "Writing Custom Columns in Power Query with the M Formula Language"
date: "2026-09-04"
tags: ["excel", "power-query", "data-cleaning"]
excerpt: "Go beyond the point-and-click Power Query UI by writing your own M expressions in the formula bar."
---

Power Query's "Add Column" ribbon covers a lot of ground, but every so often the transformation you need — combining logic across columns, running conditional text, or calling a function the UI doesn't expose a button for — is faster to just write. That's what the M formula bar is for.

**1. Open the formula bar first.** In the Power Query Editor, go to **View → Formula Bar** if it's not already showing. Selecting any applied step shows you its M code there, which is the quickest way to learn the language: click through the UI once, then read what it generated.

**2. Add a Custom Column instead of a UI transformation.** Go to **Add Column → Custom Column**, name it, and write an expression that references other columns by name in square brackets.

```m
[UnitPrice] * [Quantity] * (1 - [DiscountPct])
```

This one line replaces what would otherwise be three chained "Add Column" steps, and it's easier to audit later since the whole calculation lives in one place.

**3. Use `if/then/else` for conditional columns instead of Conditional Column dialogs.** The dialog is fine for one or two simple conditions, but nested logic gets unreadable fast through the UI. Written as M, the same bucketing logic is easier to scan and edit:

```m
if [Revenue] > 100000 then "Large"
else if [Revenue] > 20000 then "Mid"
else "Small"
```

**4. Reach for `Table.AddColumn` when you need a column the dialogs can't produce.** Every UI action is really just calling this function behind the scenes — writing it directly lets you add a column that depends on the whole table, not just the current row, such as a running count.

```m
Table.AddColumn(#"Changed Type", "RowNumber", each Table.RowCount(#"Changed Type"))
```

**5. Learn `Text.`, `Number.`, and `Date.` prefixes rather than memorizing individual functions.** M groups its library by data type, so once you know `Text.Upper`, `Text.Contains`, and `Text.Middle` exist, guessing the name of the function you need for a similar text task gets much easier — the same pattern holds for `Number.Round` or `Date.AddDays`.

```m
Text.Upper(Text.Trim([CustomerName]))
```

**6. Keep custom steps named and commented.** Right-click any step in the Applied Steps pane to rename it, and you can prefix a comment inside the M code with `//`. Six months from now, "Custom Column" tells you nothing — "FlagLargeOrders" does.

The UI is still the right tool for 90% of Power Query work — it's discoverable and self-documenting. But once you're comfortable reading the M it generates, writing a short custom expression is often quicker than hunting for the right sequence of dialog boxes, and it keeps your query steps shorter and easier to follow.
