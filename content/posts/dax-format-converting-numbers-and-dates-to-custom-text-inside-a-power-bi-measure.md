---
title: "DAX FORMAT: Converting Numbers and Dates to Custom Text Inside a Power BI Measure"
date: "2026-11-02"
tags: ["power-bi", "dax", "formatting"]
excerpt: "FORMAT turns a number or date into a text string inside a measure, which is what you actually need when you're building a label rather than just displaying a value in a card."
---

A card visual's built-in format string is fine for showing a number on its own, but it falls apart the moment you need that number inside a sentence — a tooltip that reads "Updated through March 2026" or a dynamic chart title like "Revenue: $1.2M". `FORMAT` is the function that bridges that gap, by converting a number or date into formatted text you can concatenate like any other string.

**1. `FORMAT` always returns text, never a number.** That's the core thing to internalize — it isn't a display setting on a measure, it's a conversion function. Once a value goes through `FORMAT`, you can glue it to other text with `&`, but you can no longer sum it or use it in another numeric calculation.
```dax
Revenue Label = 
"Revenue: " & FORMAT(SUM(Sales[Revenue]), "$#,##0,,.0,,M")
```
That format string divides by a million twice (each trailing comma divides by 1,000) and appends "M", so 1,234,567 renders as "$1.2M" inside the label.

**2. Dates use the same function with different format codes.** This is the pattern behind a dynamic "data as of" label on a report page, built from the actual max date in the model rather than typed in by hand and left to go stale.
```dax
Data As Of = 
"Data as of " & FORMAT(MAX(Sales[Date]), "MMMM d, yyyy")
```

**3. It's the right tool for a dynamic chart or page title, where a plain measure can't help.** Chart titles and some text boxes in Power BI can be bound to a measure, but only if that measure returns text — a measure returning a number won't work there even if the underlying value is correct. Wrapping the calculation in `FORMAT` (or `CONCATENATE`/`&`) is what makes a title like "West Region — Q3 2026" possible at all.
```dax
Dynamic Title = 
SELECTEDVALUE(Region[Region], "All Regions") & 
" — " & FORMAT(MAX('Date'[Date]), "\QQ yyyy")
```

**4. Don't reach for it on a measure that just needs a display format.** If a card visual only needs to show a number as currency or a percentage, set the format in the measure's Formatting pane or with a dynamic format string instead — that keeps the measure numeric, which matters if anything downstream (a visual calculation, a KPI comparison, conditional formatting) needs to treat it as a number rather than text. `FORMAT` is for when you specifically need text to build a sentence, not a substitute for ordinary number formatting.

**5. Watch performance on large tables — format codes aren't free.** `FORMAT` is a row-by-row text operation, so using it inside a calculated column on a multi-million-row fact table is noticeably slower than formatting once inside a measure that operates on an already-aggregated value. Keep it at the measure level, applied to a single aggregated result, rather than wrapping it around a column reference that evaluates per row.

Once a report needs to say something in a sentence rather than just show a number, `FORMAT` is usually the missing piece — it's a small function, but it's what makes a title, tooltip, or label feel like it was actually written for the data in front of it instead of hardcoded.
