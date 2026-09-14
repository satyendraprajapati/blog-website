---
title: "Organizing Power BI Measures with Display Folders and a Dedicated Measure Table"
date: "2026-09-14"
tags: ["power-bi", "data-modeling", "dax"]
excerpt: "Once a model has fifty measures scattered across every fact table, Display Folders and a home table are what keep the Fields pane usable for you and for whoever builds reports after you."
---

Measures usually get created wherever felt convenient at the time — attached to whichever fact table was open, with no plan for where a related measure would end up. Six months in, the Fields pane is a flat, unsorted wall of names, and finding "Revenue YoY %" means scrolling past forty other measures first. Two habits fix this, and both are free.

**1. Give every measure one home table that isn't a data table.** Create a table that holds no data at all — in Power Query, use "Enter Data" to make a table with a single throwaway column, load it, then hide that column in Model view. This becomes the home for every measure in the model, regardless of which table's columns the DAX actually references:

```dax
Total Revenue = SUM(Sales[Revenue])
```

Even though this measure sums a column from `Sales`, it lives on `_Measures` instead. In Model view, select the measure and change its "Home Table" property to move it — nothing about the calculation changes, only where it's filed.

**2. Group related measures with Display Folders.** Every measure has a Display Folder property in Model view. Set it once per measure and the Fields pane collapses matching measures into an expandable group automatically — no manual folder creation step required.

```
Revenue
Revenue\YoY
Time Intelligence
```

The backslash nests a subfolder inside a parent one, so `Revenue\YoY` puts a measure inside a "YoY" folder under "Revenue." Report builders see a short list of collapsed folders instead of a hundred flat names.

**3. Name measures for how they'll sort inside a folder, not just for what they compute.** Within a folder, measures list alphabetically. `Revenue`, `Revenue YoY %`, and `Revenue YoY vs. Budget` sort together and read as a family; `YoY Revenue Change` and `Total Revenue` in the same folder don't. A few seconds of consistent naming up front saves everyone downstream from hunting.

**4. Add a Description to anything a report builder wouldn't guess from the name alone.** The Description property (also in Model view) shows as a tooltip when someone hovers the measure in the Fields pane. It's the cheapest documentation available — a line like "Excludes returns; matches Finance's definition" heads off a Slack message asking whether it does.

**5. Retrofit an existing messy model in bulk rather than one measure at a time.** Moving fifty measures to a home table and setting folders individually in Power BI Desktop is slow. Tabular Editor (the external tool covered in an earlier post) lets you multi-select measures and set Home Table and Display Folder on all of them in one action via its script/C# expression window — worth reaching for once a model has already gotten past the point where doing it by hand is reasonable.

None of this changes a single number a report shows — it's entirely about whether the next person who opens the model (including future you) can find the measure they need without reading every one of them first.
