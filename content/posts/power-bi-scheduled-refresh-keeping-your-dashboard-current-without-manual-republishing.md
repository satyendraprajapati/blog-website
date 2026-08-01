---
title: "Power BI Scheduled Refresh: Keeping Your Dashboard Current Without Manual Republishing"
date: "2026-08-01"
tags: ["power-bi", "refresh", "automation"]
excerpt: "How to set up scheduled refresh (and a gateway, if your data isn't in the cloud) so a published Power BI report stays current without you re-publishing it by hand."
---

A Power BI report you publish once and never refresh is just a snapshot with extra steps. If your data source updates daily or weekly, the report should update itself — here's how scheduled refresh actually works, and where people get stuck setting it up.

**1. Understand what scheduled refresh does and doesn't do.** It re-runs your Power Query steps and reloads the data model on a schedule you set, inside the Power BI Service — it does not touch your report's visuals, layout, or bookmarks, and it doesn't help at all if your model is set to DirectQuery, since DirectQuery already queries live on every interaction. Scheduled refresh only matters for Import-mode models.

**2. Publish the report, then set the schedule from the dataset settings, not the report.** In the Power BI Service, refresh is configured against the *dataset*, not the report itself — several reports can share one dataset, and they all pick up the same refreshed data. Go to the dataset's Settings page, expand *Scheduled refresh*, turn it on, and pick up to 8 refresh times a day on the Pro tier (48 on Premium).

**3. Add a gateway if your source isn't cloud-hosted.** If your data lives in a source the Power BI Service can already reach directly — like a cloud database or an Excel file in OneDrive/SharePoint — no gateway is needed. But if it's a file on a local network drive, an on-prem SQL Server, or anything else the internet can't see, you need an *On-premises Data Gateway* installed on a machine that's always on and can reach that source. Without it, the dataset settings page will show the refresh as failing with a connection error, not a helpful one.

**4. Set up failure notifications instead of checking manually.** Under the same dataset settings, there's an option to email the dataset owner on refresh failure. Turn this on — the alternative is discovering a stale dashboard because a stakeholder mentions the numbers "look off," which is a worse way to find out a source file got renamed or a password expired.

**5. Watch for the 1-hour timeout on shared capacity.** On Power BI Pro (shared capacity), a scheduled refresh that takes longer than about 2 hours gets killed automatically. If your refresh is creeping toward that limit as your data grows, look at trimming the query in Power Query (filtering rows before load, disabling unused query steps) before assuming you need Premium capacity.

**6. Remember scheduled refresh doesn't retroactively fix a broken query.** If a source column got renamed or a file got moved, refresh will just fail on schedule instead of failing when you happen to open the file — which is strictly better, but only if you're actually looking at the failure notifications from step 4 rather than assuming "scheduled" means "solved forever."

Once this is set up correctly, the only manual step left is republishing the report itself after a design change — the data underneath takes care of itself.
