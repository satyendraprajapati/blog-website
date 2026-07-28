---
title: "Power BI Field Parameters: Let Report Users Switch What a Chart Shows"
date: "2026-07-28"
tags: ["power-bi", "field-parameters", "interactivity"]
excerpt: "How to use Field Parameters to let a report viewer swap the measure or dimension on a chart with a slicer, instead of you building a separate visual for every combination."
---

A common Power BI request is "can this chart show revenue, but also let me switch it to show units or margin?" The old answer was building three near-identical charts and hiding two of them behind bookmarks. Field Parameters solve this properly, with a single visual and a slicer.

**1. What a Field Parameter actually is.** It's a special calculated table where each row represents a field (a measure or a column) the user can pick from, rather than a table of data values. Power BI generates a small DAX table like this when you create one from Modeling → New Parameter → Fields:
```dax
Measure Selector = {
    ("Revenue", NAMEOF('Sales'[Total Revenue]), 0),
    ("Units Sold", NAMEOF('Sales'[Total Units]), 1),
    ("Margin %", NAMEOF('Sales'[Margin %]), 2)
}
```
Each row pairs a display name with the actual field it points to, plus a sort order.

**2. Bind it to a chart like any other field.** Drag the Field Parameter's "Value" column onto a chart's Values well and its "Selector" or display column onto a slicer. Selecting an entry in the slicer swaps what the chart plots — no bookmarks, no duplicated visuals, no page-level logic to maintain.

**3. Use it for dimensions too, not just measures.** A second common use is letting the user pick what a chart is broken down *by* — Region vs. Product Category vs. Sales Rep — instead of only which number is being measured. Build a separate Field Parameter for columns the same way, and put it on the axis well instead of Values. Combine an axis parameter with a measure parameter on the same chart and you effectively get a small self-serve exploration tool from one visual.

**4. Add a title that updates with the selection.** A chart that silently swaps its metric without labeling itself is confusing the moment someone screenshots it. Use a measure like the one below in a dynamic title so the chart always states what it's currently showing:
```dax
Selected Measure Title = SELECTEDVALUE('Measure Selector'[Measure Selector], "Multiple Measures")
```
Bind that measure to the visual's title field under Format → Title → Title text → fx, and the chart labels itself correctly no matter what the viewer has selected.

**5. Know the limitation before you rely on it.** A Field Parameter changes *which* field is plotted, but every option in the list still needs to share compatible formatting and a sensible axis scale — mixing "Revenue" (in thousands) with "Margin %" (a percentage) on the same value axis will make one of them unreadable. If the fields you want to toggle between have wildly different scales, consider a second axis or accept that the parameter works best for genuinely comparable fields.

Field Parameters won't replace every custom interactive layout, but for the routine "let people pick what they're looking at" request, they cut a three-visual, bookmark-driven workaround down to one chart and one slicer — less to maintain, and one less thing to break when the model changes.
