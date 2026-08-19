---
title: "Power BI Dynamic Format Strings: Changing How a Measure Displays Based on Context"
date: "2026-08-19"
tags: ["power-bi", "dax", "formatting"]
excerpt: "How to make one Power BI measure switch between currency, percent, and plain-number formatting automatically depending on what's being viewed."
---

A single measure's number format in Power BI is normally fixed — set it to currency in the Formatting pane and every visual that uses that measure shows currency, even in a row where a percentage or a plain count would make more sense. Dynamic format strings remove that restriction by letting the format itself be a DAX expression, evaluated per cell instead of set once for the whole measure.

**1. Where to find it.** In Power BI Desktop, select a measure, then in the Measure tools ribbon look for "Dynamic format string" next to the regular Format field (or use the `fx` button beside format in the Formatting pane on newer builds). Turning it on replaces the static format dropdown with a DAX formula box.

**2. The core pattern: format based on a selected field.** A common use case is a matrix where rows can be either "Revenue" or "Margin %" via a Field Parameter, and you want currency formatting for one and percent formatting for the other, from the same measure.
```dax
Sales Measure =
VAR SelectedMetric = SELECTEDVALUE('Metric Parameter'[Metric])
RETURN
    SWITCH(
        SelectedMetric,
        "Revenue", [Total Revenue],
        "Margin %", [Gross Margin %],
        BLANK()
    )
```
```dax
// Dynamic format string for the measure above
SWITCH(
    SELECTEDVALUE('Metric Parameter'[Metric]),
    "Revenue", "$#,##0",
    "Margin %", "0.0%",
    "#,##0"
)
```
The format string box takes DAX, not a static format code — it's evaluated in the same filter context as the value it's formatting, so `SELECTEDVALUE` sees whatever row or slicer selection produced that particular number.

**3. Formatting negative variances differently from positive ones.** A single "vs. Last Year" measure can show a plain number for growth and wrap negative values in parentheses or a different color cue without a second measure:
```dax
IF([Revenue vs LY] < 0, "(#,##0);;0", "#,##0;-#,##0")
```

**4. It works per visual, not just per row.** Because the format string re-evaluates in context, the same measure can render as a whole number in a card, a percentage in a matrix broken out by category, and a compact "1.2M" style in a chart axis — as long as the format expression accounts for each context it might be evaluated in. Test it in every visual you plan to use it in, not just the one you built it against.

**5. Keep a fallback branch.** Always end a `SWITCH` used for formatting with a default value rather than `BLANK()` alone — an unhandled context returning a blank format string can make Power BI fall back to raw, unformatted numbers, which is a confusing thing to debug days later when a new value gets added upstream.

**6. Know when not to bother.** If a measure only ever needs one format, a static format string is simpler to read and maintain — reach for dynamic format strings specifically when a Field Parameter, a "switch measure," or a KPI-with-mixed-units pattern means the same visual genuinely needs to display different units depending on what's selected.

Dynamic format strings don't change what a measure calculates — they just stop you from needing a separate near-duplicate measure for every formatting variant of the same number.
