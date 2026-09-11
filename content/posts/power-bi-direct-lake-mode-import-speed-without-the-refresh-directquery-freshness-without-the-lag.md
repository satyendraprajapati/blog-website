---
title: "Power BI Direct Lake Mode: Import Speed Without the Refresh, DirectQuery Freshness Without the Lag"
date: "2026-09-11"
tags: ["power-bi", "performance", "data-modeling"]
excerpt: "A third storage mode alongside Import and DirectQuery that reads Delta tables straight from OneLake, sidestepping the refresh-vs-freshness tradeoff of the other two."
---

Import and DirectQuery force a tradeoff: Import is fast because it copies data into memory, but that copy goes stale until the next refresh; DirectQuery stays live by querying the source on every interaction, but every visual pays a network round trip for it. Direct Lake, built for Microsoft Fabric, is a third storage mode that avoids both costs for a specific kind of source.

**1. It reads Delta Parquet files directly, without a copy step.** A Direct Lake semantic model doesn't import rows into its own in-memory format the way Import mode does — it reads the columns it needs straight out of the Delta tables sitting in a Fabric Lakehouse or Warehouse, backed by OneLake. There's no separate load transferring data into the model, which is what makes it fast to query without the model ever going through a traditional refresh.

**2. "Refresh" becomes "reframe."** Instead of re-importing every row, Direct Lake periodically reframes — it just picks up the latest version of the underlying Delta tables. Reframing is far lighter than a full Import refresh because it isn't recopying data, only re-pointing the model at current files, so a Direct Lake model can reflect new data in the lakehouse on a much tighter cycle than a traditionally scheduled Import refresh.

**3. It only works on Delta tables in a Fabric Lakehouse or Warehouse.** This is the real constraint: your source has to already be Delta-format tables living in OneLake. A live SQL Server, a REST API, or a plain SharePoint list can't be a Direct Lake source — those still need Import or DirectQuery. Direct Lake is specifically for teams already landing data in a Fabric Lakehouse, not a drop-in replacement for every existing DirectQuery connection.

**4. There's no Power Query step on top of it.** Import and DirectQuery both let you reshape data with Power Query transformations as part of the semantic model. Direct Lake tables are used close to as-is — any cleaning, joining, or reshaping needs to happen upstream, in a Lakehouse notebook or a dataflow that writes back to Delta tables, not in the semantic model's own query editor.

**5. It can silently fall back to DirectQuery.** If a query needs something Direct Lake can't serve directly — memory pressure on the capacity, or a feature the engine doesn't yet support for this mode — Power BI falls back to querying the underlying warehouse on the fly instead of failing outright. That's good for reliability but bad for performance predictability if you don't know it's happening, so check **Performance Analyzer** on a slow visual and look at whether the query actually executed as Direct Lake or fell back to DirectQuery before assuming the model itself is the bottleneck.

**6. Check the current storage mode before assuming which one you have.** In Power BI Desktop, a table's storage mode shows in the **Table properties** in Model view, so it's worth confirming — a model connected to a Fabric Lakehouse doesn't automatically mean every table in it is using Direct Lake rather than Import or DirectQuery.

Direct Lake isn't a strict upgrade over the other two modes — a small dataset is often still simplest as a plain Import model, and a source outside OneLake still needs DirectQuery. But for a team already centralizing data in Fabric, it closes the gap between "fast" and "current" that Import and DirectQuery have always forced analysts to choose between.
