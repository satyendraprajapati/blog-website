---
title: "Power BI's Analyze in Excel: Building a Live PivotTable on a Power BI Dataset"
date: "2026-08-18"
tags: ["power-bi", "excel", "reporting"]
excerpt: "How to connect a plain Excel PivotTable directly to a published Power BI dataset, so stakeholders who live in Excel get a live, filterable view without you exporting a static extract every week."
---

Not every stakeholder wants to open a Power BI report. Plenty would rather drop the numbers into a PivotTable they already know how to drive — sort, filter, add a calculated field, paste into their own workbook. The usual answer is exporting a static CSV from the report, which is stale the moment it's downloaded. Analyze in Excel skips that: it connects an actual Excel PivotTable directly to your published Power BI dataset, live.

**1. It comes from the dataset, not the report.** In the Power BI Service, go to the workspace, find the semantic model (dataset) behind your report, and choose **Analyze in Excel** from its context menu — not from the report itself. That distinction matters because a dataset can back several reports, and this connects to the model, not any one visual layout.

**2. It downloads a connection file, not data.** Power BI hands you a small `.odc` (Office Data Connection) file. Opening it launches Excel with an empty PivotTable field list already wired up to your dataset over the internet — the actual rows and measures are queried live, not baked into the file.
```
File downloaded: SalesModel.odc
Opens: Excel > blank workbook > PivotTable Fields pane populated with your model's tables and measures
```

**3. Your DAX measures show up as PivotTable values.** Any measure you've written in the Power BI model — a YoY growth calc, a running total, a custom ratio — appears in the field list exactly like a regular column, and drops into the Values area the same way. You get your DAX logic in Excel without rewriting a single formula.

**4. Filtering behaves like a report, not a static export.** Drag a field into the PivotTable's filter area, or use slicers on the sheet, and Excel sends the filter back to the Power BI dataset as a live query — the same way a slicer on a report page would. Nothing is pre-computed and dumped; every view is queried fresh.

**5. Refresh works exactly like a normal Excel data connection.** Right-click the PivotTable and choose Refresh (or set the connection to auto-refresh on open) to pull current numbers. If the underlying Power BI dataset itself is on a scheduled refresh, the Excel file always reflects whatever the dataset last refreshed to — you're one hop downstream of it, not a frozen copy.

**6. Permissions carry over — nothing is bypassed.** Analyze in Excel respects whatever access the connecting user already has to the dataset, including Row-Level Security. Two people opening the same `.odc` file can see different rows if RLS is configured to scope them differently, exactly as it would inside the Power BI report itself.

**7. This needs the Power BI desktop client or web integration installed locally**, since the live connection is powered by the same Analysis Services connector Excel uses for other OLAP data sources — on a machine without Power BI installed, the `.odc` file won't have anything to connect through.

The net effect: stakeholders keep working in the tool they're fastest in, you keep one source of truth in the Power BI model, and nobody's circulating a `sales_export_final_v3.csv` that was accurate three Tuesdays ago.
