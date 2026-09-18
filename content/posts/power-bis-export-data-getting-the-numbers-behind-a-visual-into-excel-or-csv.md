---
title: "Power BI's Export Data: Getting the Numbers Behind a Visual Into Excel or CSV"
date: "2026-09-18"
tags: ["power-bi", "reporting", "beginner", "productivity"]
excerpt: "How to pull the exact rows behind a Power BI chart or table into Excel or a CSV file, and why the Summarized vs. Underlying data choice matters more than it looks."
---

Sooner or later a stakeholder asks for "just the numbers behind that chart" — not the interactive report, not a screenshot, the actual rows so they can sort them, paste them into an email, or check your math. Power BI doesn't make you rebuild the visual as a table first; every chart, matrix, and table has an **Export data** option built in.

**1. Find it on the visual's own menu, not the ribbon.** Hover over any visual, click the `...` (More options) icon in the top corner, and choose **Export data**. There's no global "export" button in Power BI Desktop or the Service — it's scoped to one visual at a time, which is actually the point: you export exactly the slice the report is currently showing, filters and all.

**2. Choose Summarized data when you want what the chart shows.** This exports the aggregated values exactly as they appear — the same bars, the same totals, the same grouping — as a flat table you can drop straight into a workbook. This is the right choice for "just give me the chart as a table" requests.

**3. Choose Underlying data when you need the rows behind the aggregation.** This pulls the row-level records that fed the visual, before any SUM, AVERAGE, or COUNT was applied — useful when someone wants to audit a total by checking the individual transactions, or when they want to re-slice the data in a way the visual doesn't support. Underlying data isn't available for every visual type (it's off for some custom visuals and anything that doesn't map cleanly back to source rows), so check this option is even present before promising it to someone.

**4. Know that the export respects filters and slicers, but not always the exact visual formatting.** Whatever the visual is currently showing — after slicer selections, cross-filtering from other visuals on the page, and drill-down state — is what gets exported, which is usually exactly what you want. What you don't get is conditional formatting colors or the visual's specific number formatting; those come across as plain values, so expect to reformat after pasting.

**5. Export straight to Excel with a live connection when the report is published.** In the Power BI Service (not Desktop), Export data offers an **Analyze in Excel**-style option that creates a workbook connected back to the dataset instead of a static snapshot — useful when the recipient wants to keep pivoting the data themselves rather than receiving a one-time dump. For a genuinely static handoff, plain `.xlsx` or `.csv` is simpler and avoids confusing them with a file that needs a live connection to refresh.

**6. Watch the row limit.** Power BI caps exports at 30,000 rows for most visual types (150,000 for some, depending on licensing and export path). If a table is truncated, you'll get a message saying so rather than a silently incomplete file — but it's worth checking that message rather than assuming the export is complete, especially for a visual built on a large fact table with little aggregation.

**7. Prefer a matrix or table visual over a chart when the export is the actual goal.** If you already know a request is going to end in "export this," build it as a table or matrix in the first place rather than a bar or line chart — the exported result is identical either way, but a table is easier to sanity-check on screen before you hand it off, since you can see every row and column instead of reading values off bar heights.

Export data is one of those features that doesn't show up in any "learn Power BI" list of headline features, but it's the thing that turns a report from something people only look at into something they can actually take with them.
