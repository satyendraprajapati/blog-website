---
title: "Power BI Hybrid Tables: Import Speed for History, DirectQuery Freshness for Today"
date: "2026-11-20"
tags: ["power-bi", "data-modeling", "performance"]
excerpt: "How a hybrid table lets one fact table import everything older than today while querying today's rows live, so a report is both fast and current."
---

Most reports have to pick one storage mode and live with its trade-off: Import is fast but only as current as the last scheduled refresh, DirectQuery is live but slower on every single click. A hybrid table is Power BI's way of not making you choose — it splits *one* table into historical partitions that are imported and a current partition that queries the source live.

**1. A hybrid table is a single table with mixed partition modes, not a mix of separate tables.** This is different from a Composite Model, which mixes Import and DirectQuery *across different tables* in the same report. A hybrid table keeps one fact table — say, `Sales` — but makes its older rows Import and its newest rows DirectQuery, so the table behaves as one logical object with two different refresh behaviors underneath.

**2. It's built on top of Incremental Refresh.** You still set up Incremental Refresh policies (defining historical range and refresh period) in Power BI Desktop. The hybrid piece is one extra option: when you configure the policy, you can mark the *last* period as DirectQuery instead of Import, which is what makes that final slice live instead of cached.

**3. Historical partitions refresh on a schedule, like any Import table.** Everything older than the current period gets imported and refreshed on whatever cadence you set — nightly, weekly — exactly as a normal Import table would. That's most of your data, and it's fast because it's sitting in memory, not re-querying the source on every interaction.

**4. The current partition queries the source every time a visual touches it.** Anything landing in "today" (or whatever period you mark as DirectQuery) runs a live query against the source system on each interaction with that data — so a dashboard showing "orders so far today" is always accurate to the second, at the cost of that one partition being as slow as any DirectQuery query.

**5. This solves a specific complaint: "my dashboard is a day behind."** A fully Import dataset refreshed nightly means this morning's activity is invisible until tonight's refresh. A hybrid table keeps yesterday-and-earlier fast and cached while letting today's numbers reflect what's actually happening right now — without paying the DirectQuery performance cost on the 99% of rows that never change once the day is over.

**6. It needs a source that can handle the live queries, same as DirectQuery does.** The DirectQuery partition still sends real queries to your source database every time someone looks at today's numbers. If the source is slow or the table lacks useful indexes, that partition will be slow too — a hybrid table doesn't eliminate DirectQuery's dependency on the source being queryable fast, it just limits that dependency to a small slice of the data.

**7. Check it's actually splitting where you expect with the partition view.** In Tabular Editor or the XMLA endpoint, you can inspect a table's partitions directly and confirm which ones are Import and which are DirectQuery — useful for verifying the split lines up with your incremental refresh range after you've configured it, rather than assuming it worked.

For a fact table that grows every day but is only *interesting* in real time for the most recent slice, a hybrid table gets you both properties at once instead of trading one for the other.
