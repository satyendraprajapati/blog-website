---
title: "Power BI Aggregations: Speeding Up DirectQuery with a Cached Summary Table"
date: "2026-09-05"
tags: ["power-bi", "performance", "directquery"]
excerpt: "Most report visuals only need a summary number, not a row-level query against a billion-row DirectQuery table — Aggregations let Power BI answer those from a small cached table instead."
---

A DirectQuery model over a billion-row fact table is often fast enough for a detail page that genuinely needs row-level filtering, but painfully slow for the summary card at the top of the report that just shows total revenue by month. Aggregations fix this mismatch: you build a small, imported summary table alongside the DirectQuery source, and Power BI automatically routes any visual it *can* answer from that table there instead, falling back to the slow DirectQuery path only when a visual needs detail the summary doesn't have.

**1. Build the aggregation table at the grain your dashboards actually use.** In Power Query, add a query that groups your fact table by the dimensions most visuals slice by — typically date, region, and product category — summing the measures you report on most. This table should be dramatically smaller than the underlying fact table; if it isn't, you've picked too fine a grain for it to help.

**2. Set the aggregation table's storage mode to Import.** Unlike the DirectQuery fact table it summarizes, the aggregation table needs to live in memory for Power BI to check it quickly. In Power BI Desktop, right-click the table in the Fields pane, choose **Manage aggregations**, and this is where the mapping between the two tables gets defined.

**3. Map each aggregated column to its source column and function.** For every summary column, tell Power BI which DirectQuery column it aggregates and how — GroupBy for dimensions, Sum/Count/Min/Max for measures. This mapping is what lets Power BI recognize "this visual's request can be fully answered here" instead of treating the two tables as unrelated.

**4. Set the DirectQuery table's storage mode to Dual, not pure DirectQuery.** A **Dual** table can be queried either as Import or DirectQuery depending on what the query needs — this is what allows a visual mixing a dimension table (set to Dual) with your new aggregation table to resolve entirely against cached data, without an unnecessary DirectQuery round trip just to fetch dimension attributes.

**5. Verify the hit rate with Performance Analyzer.** After publishing, run **Performance Analyzer** while interacting with the report and check the query details for each visual — a visual hitting the aggregation should show a fast, in-memory query; one that still needs DirectQuery will show the underlying SQL sent to the source. If a visual you expected to hit the aggregation isn't, the most common cause is a dimension or measure on it that isn't mapped in the aggregation.

**6. Let detail visuals fall through on purpose.** Not every visual should hit the aggregation — a table listing individual transactions genuinely needs DirectQuery, since that detail was never summarized. Aggregations aren't meant to replace DirectQuery everywhere, just to intercept the small set of high-traffic summary visuals that would otherwise re-run an expensive query every time someone opens the report.

**7. Refresh the aggregation table on its own schedule.** Since it's an imported table, it goes stale between scheduled refreshes just like any other imported table — for a metric that needs to be current to the minute, keep it DirectQuery-only rather than aggregating it, or shorten the refresh cadence specifically for that table.

The payoff shows up first on the report's landing page — the handful of KPI cards and top-level trend charts everyone looks at before drilling into anything — which is exactly where slow DirectQuery performance is most visible and most damaging to whether people trust opening the report at all.
