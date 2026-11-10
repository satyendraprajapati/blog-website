---
title: "Power BI's Automatic Page Refresh: Keeping a Live Dashboard Current Without a Scheduled Refresh"
date: "2026-11-10"
tags: ["power-bi", "dashboards", "real-time-data"]
excerpt: "How Automatic Page Refresh re-queries a Power BI page on a timer so an operational dashboard stays current between scheduled dataset refreshes."
---

A scheduled refresh updates a dataset a handful of times a day at most — fine for a weekly sales recap, not fine for a floor-operations dashboard someone is watching live. **Automatic Page Refresh** solves the second case by re-querying the page itself on a short timer, independent of the dataset's own refresh schedule.

**1. It refreshes the page, not the dataset.** Scheduled refresh reloads the entire imported dataset on a cadence you set in the service (as often as every 30 minutes, usually much less). Automatic Page Refresh instead re-runs the visuals' queries against the underlying source on a short interval — seconds to minutes — while you're viewing that page. It's a page-level setting, found under the Format pane → Page refresh, not a dataset-level one.

**2. It needs a live source to be worth using.** Against an Import-mode table, "refreshing" just re-runs the same query against data that hasn't changed since the last dataset load — pointless. It earns its place against DirectQuery or Live Connection sources where the underlying data genuinely changes between dataset refreshes, such as a transactional SQL table or a streaming dataset.

**3. Fixed interval vs. change detection.** There are two modes. Fixed interval just reruns every N seconds, full stop. Change detection (Premium/Fabric capacity only) runs a lightweight measure first to check whether anything actually changed, and only re-queries the full visuals if it did — this cuts load on the source dramatically for dashboards that don't change every second.
```dax
Change Detection Measure = MAX('Orders'[LastModified])
```
Pointing change detection at a measure like this means the expensive visual queries only fire when the underlying data's last-modified timestamp has actually moved.

**4. Watch the load you're putting on the source.** A 5-second refresh interval against a production database, multiplied across every viewer with the page open, adds up fast. Power BI enforces a minimum interval based on your capacity (Pro workspaces are capped higher than Premium/Fabric ones), but "allowed" isn't the same as "wise" — size the interval to how fast the number actually needs to be, not how fast it technically could be.

**5. It only runs while someone's looking.** Automatic Page Refresh fires for the duration a viewer has that page open in the service or Power BI mobile app — it's not a background job keeping the dataset warm when nobody's watching. For a dashboard that needs to be current the moment someone opens it, pair it with a reasonable scheduled refresh as a baseline, and let page refresh handle the gap while it's actively on screen.

**6. Test it with the Performance Analyzer open.** Before shipping a short refresh interval to a live floor dashboard, record a session in Power BI Desktop's Performance Analyzer while the page refreshes a few times. If a visual's query consistently takes longer than your refresh interval, you're issuing overlapping requests to the source faster than it can answer them — lengthen the interval or optimize the visual first.

Used against the right source and tuned to a sensible interval, Automatic Page Refresh is what turns a Power BI report from "accurate as of this morning" into something people can actually treat as a live operational screen.
