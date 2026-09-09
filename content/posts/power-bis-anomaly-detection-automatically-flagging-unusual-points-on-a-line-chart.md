---
title: "Power BI's Anomaly Detection: Automatically Flagging Unusual Points on a Line Chart"
date: "2026-09-09"
tags: ["power-bi", "data-visualization", "beginner"]
excerpt: "A built-in analytics feature scans a line chart's history and circles the points a statistical model says don't fit the pattern, before a stakeholder has to ask why."
---

A line chart shows you what happened, but it doesn't tell you which of those bumps and dips actually matter. Power BI's Anomaly Detection feature runs a statistical model against the series itself and flags the points that fall outside its expected range — no separate dataset, DAX measure, or manual review of every wiggle required.

**1. Turn it on from the Analytics pane, not the Format pane.** With a line chart selected, open the Analytics pane (the magnifying-glass icon), expand **Find anomalies**, and switch it on. It only works on a single-series line chart with a continuous date or numeric axis — it won't appear as an option on a bar chart or a multi-line chart with several categories plotted at once.

**2. Understand what "anomaly" means here.** Power BI fits an expected range around your historical values using a standard time-series decomposition, then flags any point that falls outside it. It's a general-purpose statistical detector, not a business-rule check — it doesn't know that a spike is "expected" because of a known holiday promotion unless the model has seen enough similar spikes before to treat that pattern as normal.

**3. Adjust sensitivity instead of accepting the default.** The default settings flag anomalies fairly conservatively. Widen or narrow the sensitivity slider in the Analytics pane depending on whether you're seeing too much noise (everything gets flagged) or missing real outliers (nothing does) — there's no universally correct setting, only what matches how noisy your specific metric normally is.

**4. Click a flagged point to see why it was flagged.** Selecting a highlighted anomaly opens an explanation panel showing the expected range at that point and, if you've added other fields to the visual's tooltip or explanatory fields, which of those correlate with the deviation — a useful starting point before you go digging manually.

**5. Don't confuse this with a Key Influencers visual or a Data Alert.** A Key Influencers visual explains what's driving a metric across categories you choose; a Data Alert fires when a value crosses a threshold you set. Anomaly Detection does neither — it has no business threshold and no assigned drivers, it's purely "does this point look statistically unusual given the series' own recent history."

**6. Treat a flag as a starting question, not a finding.** An anomaly is a prompt to ask why, not evidence of a real business event on its own. A single unusual point can be a genuine spike, a data quality issue upstream, or a reporting lag that resolves itself next refresh — check the underlying rows before including a flagged point in a stakeholder narrative.

**7. Keep it on series where "normal" is stable enough to define.** The feature works best on operational metrics with a fairly consistent baseline — daily transactions, server response times, page views. On a metric that's inherently volatile or still ramping (a brand-new product's first month of sales, for instance), the model hasn't seen enough history to know what counts as unusual yet, and the flags become noise rather than signal.

It won't replace a proper root-cause investigation, but as a first pass over a dashboard full of line charts, it catches the "wait, is that supposed to look like that?" moments a viewer would otherwise have to notice on their own.
