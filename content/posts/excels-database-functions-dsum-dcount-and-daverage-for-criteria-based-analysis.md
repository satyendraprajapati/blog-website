---
title: "Excel's Database Functions: DSUM, DCOUNT, and DAVERAGE for Criteria-Based Analysis"
date: "2026-10-25"
tags: ["excel", "formulas", "data-analysis"]
excerpt: "A little-used family of Excel functions that answers multi-condition questions using a plain criteria range instead of nested logic inside the formula."
---

Most analysts reach for `SUMIFS` or `COUNTIFS` the moment a question has more than one condition, and for most day-to-day work that's the right call. But Excel has an older, less-used family of functions — the "D" functions — that handle the same kind of question differently: the conditions live in a separate table on the sheet instead of being typed into the formula itself. That separation turns out to be genuinely useful for a specific kind of report.

**1. The syntax is the same across the whole family.** `DSUM`, `DCOUNT`, `DAVERAGE`, `DMAX`, `DMIN`, and `DGET` all take the same three arguments: the data range (with headers), the field to operate on, and a criteria range.
```excel
=DSUM(SalesData, "Revenue", Criteria)
```
Swap `DSUM` for `DCOUNT` (counts numeric matches), `DAVERAGE`, `DMAX`, or `DMIN` and the rest of the formula doesn't change — only what it calculates.

**2. The criteria live in cells, not inside the formula.** A criteria range is just a copy of the relevant column headers, with the conditions typed in the row underneath:
```excel
Region   Month
West     March
```
Because `SUMIFS`-style conditions are usually buried inside the formula text, changing one means editing a formula. With a database function, changing the question means editing a cell — which makes this a better fit for a report someone else will reuse without touching formulas.

**3. Putting two criteria on the same row means AND; stacking rows means OR.** This is the part that trips people up at first, but it mirrors Excel's Advanced Filter exactly, since they share the same criteria-range convention:
```excel
Region   Month
West     March
East     March
```
That criteria range reads as "West AND March" OR "East AND March" — two conditions on one row combine with AND, and a second row of criteria adds an OR condition.

**4. `DGET` is the odd one out, and it's the most useful for a lookup-style report.** Instead of aggregating matches, `DGET` returns a single value and throws `#NUM!` if more than one row matches — which makes it a built-in "there should only be one answer here" check that `XLOOKUP` won't give you on its own:
```excel
=DGET(Employees, "Salary", Criteria)
```
If the criteria range is supposed to isolate exactly one employee and it doesn't, `DGET` tells you immediately instead of silently returning the first match.

**5. Wildcards and comparison operators work directly in the criteria cells.** Typing `>1000` or `West*` straight into a criteria cell works without any formula syntax — useful for a criteria range meant to be edited by someone who isn't comfortable writing formulas:
```excel
Revenue
>1000
```

**6. The main cost is that the data range needs real column headers, and most teams don't build reports this way by default.** Database functions only pay off when you already have (or are willing to build) a small, separate criteria block — for a one-off calculation, `SUMIFS` with the condition typed directly into the formula is still faster to write.

These functions aren't a replacement for `SUMIFS`/`COUNTIFS` in everyday use, but when a report needs to let someone change what's being filtered without opening the formula bar, moving the conditions into a visible criteria range is exactly the kind of flexibility this older function family was built for.
