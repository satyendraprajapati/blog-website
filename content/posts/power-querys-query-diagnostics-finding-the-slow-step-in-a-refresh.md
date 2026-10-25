---
title: "Power Query's Query Diagnostics: Finding the Slow Step in a Refresh"
date: "2026-10-25"
tags: ["power-bi", "power-query", "performance"]
excerpt: "A built-in recording tool that times every Power Query step individually, instead of leaving you to guess which transformation is actually slowing down a refresh."
---

Performance Analyzer tells you which *visual* on a report page is slow to render. Query Folding explains, conceptually, why some transformations push down to the source and others don't. Neither one tells you which specific step in a long Power Query chain is actually eating the refresh time — that's what Query Diagnostics is for, and it's built into Power BI Desktop without any add-in.

**1. It lives under the Power Query Editor's Tools tab, not the main Power BI ribbon.** Open Power Query Editor (Home → Transform Data), then go to Tools → "Start Diagnostics." It records everything that happens from that point until you click "Stop Diagnostics," so the usual workflow is: start it, refresh the query (or the whole preview) you're investigating, then stop it immediately after.

**2. Diagnostics produces two tables, and the one you want first is "Diagnostics."** Stopping the recording adds a new query group to the Queries pane with raw diagnostic data. The `Diagnostics` table has one row per internal operation with a `Start Time`, `End Time`, and duration — sorting it by duration descending surfaces the slowest individual operations immediately, instead of you eyeballing a long M script guessing which line is the problem.

**3. "Aggregate by Step" is the more readable view for day-to-day use.** Right after stopping diagnostics, Power BI offers a button to generate an aggregated table grouped by query step name rather than raw internal operation — this is usually the one worth looking at first, since it maps directly back to the step names you see in the Query Settings pane:
```
Step              Total Duration (s)
Expand Table       0.4
Merge Queries      11.2
Filtered Rows       0.1
```
A result like that points straight at the merge as the bottleneck, rather than at the filter or the expand step sitting right next to it.

**4. A slow step after a merge or a custom column is a strong signal that folding broke.** If query folding was working up to a certain point, the steps before it should show near-zero duration (the work hasn't actually happened yet — it's deferred to the source), and the duration should jump at whichever step forces Power Query to start pulling and processing rows locally. Diagnostics turns "I think folding stopped somewhere in here" into a specific step name with a specific number next to it.

**5. Run it on a representative refresh, not a tiny cached preview.** Diagnostics times whatever actually happens during the recording, so running it against a 50-row preview sample will make every step look instantly fast and tell you nothing about the real refresh. Use "Start Diagnostics" from the main window (not just the preview pane) and trigger a full refresh for results that reflect production.

**6. Clean up the diagnostic queries when you're done.** They're ordinary queries sitting in your file, which means they take up space and can themselves slow down future refreshes if left in place — delete the diagnostics query group once you've found and fixed the bottleneck, rather than leaving it in the model as dead weight.

It won't fix a slow query on its own, but knowing *which* step cost 11 seconds out of a 12-second refresh turns an open-ended performance investigation into a one-line fix — usually restructuring a merge, or moving a filter earlier in the chain so there's less data left by the time the slow step runs.
