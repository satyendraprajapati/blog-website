---
title: "Power BI Import vs. DirectQuery: Choosing the Right Storage Mode"
date: "2026-07-28"
tags: ["power-bi", "data-modeling", "beginner"]
excerpt: "The first decision in any Power BI model that's easy to get wrong: whether to import the data or query it live, and why the two behave nothing alike."
---

Every table you connect in Power BI gets a storage mode, and it's usually set without much thought — you pick a source, click "Load," and move on. But Import and DirectQuery behave differently enough that picking the wrong one for the situation causes real problems later: sluggish reports, stale numbers, or a refresh that silently fails on data too large to fit.

**Import copies the data into the model.** Power BI pulls a snapshot into its own compressed in-memory engine (VertiPaq) at refresh time. Visuals query that local copy, which is why Import reports feel instant — there's no round trip to the source database while someone's clicking around.

**DirectQuery leaves the data where it is.** Instead of copying rows in, Power BI translates every visual into a live query sent to the source (SQL Server, a warehouse, etc.) each time a filter or slicer changes. Nothing is duplicated, and the numbers reflect the source at the moment you look — no refresh schedule to manage.

**Import is the default choice for most analyst work.** It's faster to interact with, every DAX function is available and performs well, and dataset size limits (1 GB on Pro, much larger on Premium) rarely matter for a typical departmental report. Unless you have a specific reason not to, start here.

**Reach for DirectQuery when the data is too big or too fresh to copy.** A source table with hundreds of millions of rows, or a dashboard that genuinely needs to reflect data from the last few minutes (a live operations board, for example), are the two cases where DirectQuery earns its cost.

**That cost is real: query performance and DAX limitations.** Every visual becomes a live query against the source, so report speed depends entirely on how well-indexed and fast that source is — a slow source database means a slow report, full stop. Some DAX functions and time-intelligence patterns also don't push down cleanly to SQL and either fail or run much slower than the Import equivalent.

**Composite models let you mix both in one report.** You can set some tables to Import (small, slow-changing dimension tables like `Product` or `Region`) and others to DirectQuery (a huge, fast-moving fact table), giving you fast filtering on the small tables without copying the whole fact table into memory. It's the middle ground worth knowing about before assuming it's all-or-nothing.

**Check the mode per table in Power Query, not just at connection time.** Table Properties in the Power Query editor (or Model view in Desktop) shows and lets you change a table's storage mode — worth a quick look before you build out an entire report on assumptions about how fresh or fast the data will be.

Default to Import until something concrete — size or freshness — forces the conversation. Picking DirectQuery "just in case" trades away speed and DAX flexibility for a live-data guarantee most reports don't actually need.
