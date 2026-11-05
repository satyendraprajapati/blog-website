---
title: "Power BI Push Datasets: Streaming Live Data to a Dashboard Tile Without Waiting on a Scheduled Refresh"
date: "2026-11-05"
tags: ["power-bi", "api", "automation"]
excerpt: "Push datasets skip Power Query and refresh schedules entirely — you POST rows straight into a Power BI dataset's memory, and a dashboard tile updates within seconds."
---

Scheduled Refresh and the REST API's refresh-trigger endpoint both do the same basic thing: pull from a source on a clock, or on demand, and reload a dataset. Neither gets you below a few minutes of latency, because both still go through the import-and-load cycle. A **push dataset** skips that cycle entirely — there's no Power Query, no source connection, and no refresh at all. You send rows directly into the dataset's memory over the REST API, and any dashboard tile built on it updates within seconds, which is the right tool for a live op-floor counter, a ticketing queue depth, or a sensor reading, not a daily sales table.

**1. Understand that a push dataset isn't a report dataset — it only feeds dashboard tiles.** Push datasets live in the Power BI Service with no underlying file, no Power Query, and no model relationships. You can pin a tile built on one to a dashboard, but you can't build a full interactive report on it the way you would on an imported or DirectQuery dataset — this is a narrow tool for a live number or a streaming line chart, not a replacement for your regular reporting.

**2. Create the dataset through the API by defining its schema up front.** There's no UI for this — you POST a table definition (columns and types) to the Power BI REST API, and the Service creates an empty dataset ready to receive rows:
```json
POST https://api.powerbi.com/v1.0/myorg/datasets
{
  "name": "QueueDepth",
  "defaultMode": "pushStreaming",
  "tables": [{
    "name": "Readings",
    "columns": [
      { "name": "Timestamp", "dataType": "DateTime" },
      { "name": "QueueName", "dataType": "String" },
      { "name": "Depth", "dataType": "Int64" }
    ]
  }]
}
```

**3. Push rows with a second call, any time new data exists.** Once the dataset exists, add rows to its table with a simple POST — each call appends, it doesn't replace:
```bash
curl -X POST \
  "https://api.powerbi.com/v1.0/myorg/datasets/<dataset-id>/tables/Readings/rows" \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{"rows": [{"Timestamp": "2026-11-05T14:32:00Z", "QueueName": "Support", "Depth": 17}]}'
```
A script polling a queue, a database trigger, or an IoT device can fire this call every few seconds — there's no batching requirement and no refresh to wait on.

**4. Pick `pushStreaming` mode if you also want a live streaming tile, not just a historical table.** `defaultMode` controls behavior: `"push"` stores every row permanently for later reporting, `"streaming"` keeps only a rolling window in memory and never persists it, and `"pushStreaming"` does both — stores the history *and* lets you build a real-time streaming tile that redraws as data arrives, which is usually what you actually want.

**5. Cap growth, because a pure push dataset has no retention policy of its own.** A `"push"` or `"pushStreaming"` table keeps every row you've ever sent unless you delete some — there's a one-million-row ceiling per table, and `DELETE` calls against the `/rows` endpoint are the only way to trim it. For a sensor feed pushing every few seconds, that limit arrives faster than it sounds, so plan to prune old rows from the same script that's adding new ones.

**6. Build the dashboard tile from the Service, not from Power BI Desktop.** Push datasets only show up as pinnable tiles in the Power BI Service's dashboard view — there's no `.pbix` involved, since Desktop has no concept of a dataset that was never imported from anywhere.

The tradeoff is real: you give up modeling, relationships, and most of the report canvas in exchange for genuinely live numbers. For the handful of metrics on a dashboard that actually need to move while someone's watching, that trade is worth making — for everything else, a scheduled or DirectQuery dataset is still the better fit.
