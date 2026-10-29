---
title: "Power BI Live Connection: Building Thin Reports on a Shared Dataset Without Importing Data"
date: "2026-10-29"
tags: ["power-bi", "data-modeling", "beginner"]
excerpt: "How Live Connection lets you build a new Power BI report on top of someone else's published semantic model, and what you give up compared to Import or DirectQuery."
---

Import and DirectQuery both pull data into *your* file, one way or another. Live Connection is the third storage mode, and it does something different: it points your report at a dataset (now called a semantic model) that's already published to the Power BI Service, and builds entirely on top of it — no copy of the data, and no connection to the original source system at all.

**1. Connect from *Get Data → Power BI semantic models* instead of a data source.** You pick a published, shared model from a workspace you have access to, not a database or file. Power BI opens a blank report canvas wired directly to that model's tables, fields, and existing measures — there's no Power Query step, because there's no data to transform. You're building a report, not a dataset.

**2. Understand that you get the model's measures but not its data.** Every visual you drag onto the canvas pulls live from the source model at query time, so numbers are always current as of the model's last refresh — you never trigger or control that refresh yourself from a thin report. You can use any existing measure the model's author built, but you can't edit the model's tables, relationships, or calculated columns from here; that stays owned by whoever manages the underlying semantic model.

**3. Add your own logic with report-level measures instead of asking the model owner for changes.** Power BI lets a Live Connection report define new measures that live only in that report, layered on top of the shared model's existing fields — useful when you need a calculation specific to your audience without filing a change request against a model other teams also depend on.
```dax
Variance % (Report Measure) = 
DIVIDE([Actual] - [Budget], [Budget])
```

**4. Expect report-level measures to be more limited than real model measures.** A report-level measure can reference existing measures and columns from the connected model, but it can't be reused by other reports connecting to the same model, and some advanced DAX patterns behave differently without direct access to the model's relationships. Treat it as a presentation-layer convenience, not a substitute for getting a genuinely reusable measure added to the model itself.

**5. Pick Live Connection over Import when freshness and governance matter more than report-building flexibility.** A certified, centrally-maintained semantic model with Live Connection reports on top of it means every report built that way shows the same numbers, refreshed on the same schedule, with one place to fix a definition instead of five. The trade-off is that you're building reports on someone else's data model and timeline, not your own.

**6. Check whether the model actually needs to be published to the Service first.** Live Connection only works against a model that's already in a Power BI workspace — you can't live-connect to a .pbix file that's only sitting on your laptop. If the model you want to build on top of is still local to someone else's machine, the actual first step is getting it published, not opening Get Data.

**7. Don't confuse this with Analyze in Excel.** Analyze in Excel also connects live to a published model, but it builds a PivotTable in Excel, not a Power BI report with visuals, bookmarks, and drill-through. Both skip the "copy the data" step; they just land in different tools depending on what the person building the report is more comfortable in.

Live Connection is the right call whenever the honest answer to "where should this data live" is "it already does, somewhere else, and that's fine" — you're not short-circuiting governance, you're building exactly the report you need on top of it.
