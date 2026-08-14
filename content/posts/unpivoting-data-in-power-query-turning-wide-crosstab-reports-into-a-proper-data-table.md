---
title: "Unpivoting Data in Power Query: Turning Wide Crosstab Reports into a Proper Data Table"
date: "2026-08-14"
tags: ["excel", "power-query", "data-cleaning"]
excerpt: "How to use Power Query's Unpivot Columns tool to turn a wide monthly report into a long, analysis-ready table."
---

A lot of exports land in your inbox looking like a crosstab report — one row per product, one column per month. It reads fine as a summary, but it's nearly unusable for analysis: you can't easily filter by month, build a PivotTable trend, or feed it into a chart without first restructuring it. That restructuring has a name — unpivoting — and Power Query does it in a few clicks instead of a manual copy-paste-transpose exercise.

**1. Recognize the shape you're dealing with.** A wide/crosstab table has a category column (Product) followed by repeated value columns that are really the same measure split across a dimension (Jan, Feb, Mar...). The moment you see column headers that are actually values — months, regions, years — that's a sign the table needs unpivoting before it's analysis-ready.

**2. Load the data into Power Query first.** Select your range or table, then `Data > Get & Transform > From Table/Range`. Don't try to fix this with formulas — Power Query keeps the transformation as a repeatable step, so next month's export goes through the same click sequence instead of a fresh manual rebuild.

**3. Select the columns that should stay put, then unpivot the rest.** Click your identifier column (e.g. `Product`), then go to `Transform > Unpivot Columns > Unpivot Other Columns`. This takes every other column — Jan, Feb, Mar, etc. — and stacks them into two new columns: `Attribute` (the old header, now a value) and `Value` (the number that used to live under it).

**4. Rename the generated columns immediately.** Power Query calls them `Attribute` and `Value` by default, which is meaningless six months from now. Rename them to something real — `Month` and `Revenue` — right in the applied steps so the query reads clearly if you or a teammate revisits it later.

**5. Use "Unpivot Other Columns," not "Unpivot Columns," when the source structure might change.** If you select specific columns and choose `Unpivot Columns`, adding a new month column to next quarter's export won't get picked up automatically — it'll just sit there unpivoted. `Unpivot Other Columns` treats your identifier columns as the fixed part and unpivots everything else dynamically, which is what you want for a report that refreshes on a schedule.

**6. Watch for a "Changed Type" step that breaks on refresh.** Power Query often auto-detects a data type for the new `Value` column based on the first load. If a later month's export includes a blank or a text placeholder like "N/A" where earlier months had numbers, the refresh will error out on that type-conversion step. Handle it explicitly with `Table.TransformColumnTypes` or replace error values before the type change, rather than discovering it the next time you refresh.

**7. Know the reverse move exists too.** If you ever need to go back — say, to build one of those wide summary tables for a stakeholder who wants months across the top — `Transform > Pivot Column` does the opposite, turning a long table back into a crosstab. Keep the long, unpivoted version as your working data and pivot only for the final presentation layer.

```m
let
    Source = Excel.CurrentWorkbook(){[Name="SalesWide"]}[Content],
    Unpivoted = Table.UnpivotOtherColumns(Source, {"Product"}, "Attribute", "Value"),
    Renamed = Table.RenameColumns(Unpivoted, {{"Attribute", "Month"}, {"Value", "Revenue"}})
in
    Renamed
```

Once the data is long instead of wide, everything downstream gets easier — PivotTables can group by month properly, `SUMIFS` can filter on a single `Month` column instead of picking a different column per formula, and the same query keeps working as new months get added to the source.
