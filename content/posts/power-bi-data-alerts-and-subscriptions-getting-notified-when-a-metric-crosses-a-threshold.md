---
title: "Power BI Data Alerts and Subscriptions: Getting Notified When a Metric Crosses a Threshold"
date: "2026-08-10"
tags: ["power-bi", "alerts", "automation"]
excerpt: "How to set up Power BI to email you when a KPI crosses a threshold or a report changes, instead of relying on someone remembering to check the dashboard."
---

A dashboard only helps if someone actually opens it. Data Alerts and Subscriptions are Power BI's two built-in ways to push information out to people instead of waiting for them to pull it in — and they solve different problems, which is where people usually pick the wrong one.

**1. Understand the difference before setting either one up.** A **Subscription** emails a snapshot of an entire report or dashboard page on a schedule you choose — daily at 8am, every Monday, whatever fits the reporting cadence. A **Data Alert** is condition-based: it emails you (and can trigger a Power Automate flow) the moment a specific numeric value crosses a threshold you set, regardless of schedule. Use Subscriptions for "keep me in the loop" and Alerts for "tell me the second this becomes a problem."

**2. Set a Data Alert on a card, KPI, or gauge visual.** Alerts only work on visuals that render a single number — Card, KPI, and Gauge. Open the visual's options menu (the "..." in the top-right when hovering) and choose *Manage alerts*, then *Add alert rule*. Define the condition — "above," "below," or "equal to" a value — and how often Power BI should check it (as data refreshes, hourly, or daily). If your dashboard only shows a chart, add a simple Card visual behind the scenes with the measure you actually want to monitor, since Alerts won't attach to a bar or line chart directly.

**3. Point the underlying measure at what you actually want to be told about, not just the raw total.** An alert on "Total Revenue < 50000" is only useful if that threshold means something in context — a daily target, a rolling average, a variance from forecast. Build a dedicated measure for the alert condition rather than reusing a general-purpose one, so the threshold logic lives in one place instead of being reconstructed every time you check the number:
```dax
Revenue vs Daily Target =
VAR ActualRevenue = [Total Revenue]
VAR DailyTarget = [Target Revenue]
RETURN
    DIVIDE(ActualRevenue, DailyTarget) - 1
```

**4. Chain an alert to a Power Automate flow for more than an email.** A default Data Alert sends an email and a Power BI mobile notification. If you want something to actually happen — post to a Teams channel, create a task, log the breach to a SharePoint list — click *Create a flow based on this alert rule*, which pre-wires a Power Automate trigger to that specific alert. This turns a dashboard into something closer to a monitoring system than a static report.

**5. Set up a Subscription for the recurring "did anything change" check.** From a report or dashboard, go to *Subscribe* (or *File → Subscribe to report*), pick the pages to include, and set a schedule. You can also add a data-driven condition here too — "only send if this value has changed since the last email" — so a subscription doesn't become noise on days when nothing moved.

**6. Remember both features need the report published to the Power BI Service, and Alerts need a refreshing dataset.** Neither works from Power BI Desktop — publish first. And an Alert checked "as data refreshes" is only as timely as your scheduled refresh; if refresh runs once a day, don't expect same-hour notification of a threshold breach that happened mid-morning.

Between the two, most dashboards benefit from a handful of Alerts on the two or three numbers that actually require action, plus one Subscription for whoever wants the full picture on a regular cadence — not an Alert on every card just because the option exists.
