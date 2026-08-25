---
title: "DAX DIVIDE: Handling Division by Zero in Power BI Measures"
date: "2026-08-25"
tags: ["power-bi", "dax", "beginner"]
excerpt: "Why DIVIDE() is the right way to handle division by zero in Power BI measures instead of wrapping a plain / in IFERROR or IF."
---

Any ratio measure — margin percent, conversion rate, growth percent — eventually hits a denominator of zero or blank when a filter context slices down to a category with no data. The plain `/` operator returns an error in that case, and it's tempting to wrap it in `IFERROR`. `DIVIDE()` is the better fix, and it's worth understanding why.

**1. The basic syntax** — `DIVIDE` takes a numerator, a denominator, and an optional alternate result to return when the denominator is zero or blank:

```dax
Gross Margin % =
DIVIDE ( [Gross Profit], [Total Revenue], 0 )
```

If `[Total Revenue]` is 0 or blank for the current filter context, the measure returns `0` instead of an error, with no extra logic needed.

**2. Why not just wrap `/` in `IFERROR`** — `IFERROR ( [Gross Profit] / [Total Revenue], 0 )` looks equivalent but evaluates the division first and only catches the error afterward, which is slower at scale and can mask genuine calculation errors elsewhere in the expression, not just division-by-zero. `DIVIDE` checks the denominator before dividing, so it's both faster and more precise about what it's guarding against.

**3. Choosing the alternate result on purpose** — the third argument isn't just a default, it's a design decision. Use `0` when the measure feeds a chart axis or a running total, so a missing ratio doesn't create a visual gap. Use `BLANK()` (or omit the argument, since that's the default) when the measure feeds a table or card and you'd rather the row disappear than show a misleading `0%`.

```dax
Conversion Rate =
DIVIDE ( [Orders], [Site Visits] )
```

**4. Using it inside a larger measure** — `DIVIDE` composes cleanly with variables, which is where most real ratio measures live:

```dax
YoY Revenue Growth % =
VAR CurrentRevenue = [Total Revenue]
VAR PriorRevenue =
    CALCULATE ( [Total Revenue], SAMEPERIODLASTYEAR ( 'Date'[Date] ) )
RETURN
    DIVIDE ( CurrentRevenue - PriorRevenue, PriorRevenue )
```

Without `DIVIDE`, the first year in a time series (where `PriorRevenue` is blank) would throw an error into every visual that includes it.

**5. It's the pattern the engine expects** — the DAX query engine has an internal optimization path specifically for `DIVIDE`, so beyond being more readable, it's generally faster than an equivalent `IF`/`IFERROR` construction, especially across large models with many rows of context to evaluate.

Once you default to `DIVIDE` for every ratio measure, division-by-zero mostly stops being a bug category you have to think about — it becomes a design choice you make once, in the third argument.
