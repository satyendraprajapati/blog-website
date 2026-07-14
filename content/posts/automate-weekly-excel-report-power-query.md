---
title: "How to Automate a Weekly Excel Report with Power Query"
date: "2026-07-19"
tags: ["excel", "power-query", "automation"]
excerpt: "Turn a repetitive weekly Excel report into a one-click refresh with Power Query."
---

If you're rebuilding the same report every week — pasting in a new export, re-applying the same filters, re-sorting the same columns — that entire process can usually collapse into a single *Refresh* click.

**1. Point Power Query at a folder, not a file.** Instead of importing this week's export directly, use *Get Data → From Folder* pointed at the folder where your weekly exports land. Power Query will combine every file in that folder into one table automatically, as long as each file has the same column structure.

**2. Build your cleanup steps once.** Do all your usual work in the Power Query Editor — renaming columns, fixing data types, filtering out test rows, removing duplicates — against this combined table. Each step gets recorded in the *Applied Steps* pane.

**3. Load it and build your report on top.** Once the query loads into your workbook (or Power BI), build your charts, pivot tables, or dashboard referencing this query's output — not the raw files.

**4. Next week, just refresh.** Drop the new week's export into the same folder, open the workbook, and hit *Refresh All*. Every cleanup step you built runs automatically against the new data, and your charts update without you touching a single cell manually.

The upfront cost is real — the first version of this setup takes longer to build than just doing the report manually once. The payoff shows up from the second week onward, when "build the report" turns into "refresh and check it looks right," which is a five-minute task instead of a half-hour one.
