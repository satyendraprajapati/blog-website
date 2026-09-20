---
title: "Power BI Goals: Building a Metrics Scorecard to Track KPIs Over Time"
date: "2026-09-20"
tags: ["power-bi", "reporting", "beginner"]
excerpt: "How to use Power BI's Goals (Metrics) feature to track a KPI's progress against a target over time instead of just showing its current value."
---

A report page answers "what is the number right now." A scorecard answers a different question: "is this metric on track, and who owns fixing it if it isn't." Power BI's Goals feature (sometimes labeled Metrics) builds that second view without exporting anything to a separate OKR tool.

**1. Find it in the workspace, not the report canvas.** Goals live at the workspace level, alongside dashboards and reports — open a workspace, click *New*, and choose *Goal*. This is a deliberate separation: a scorecard tracks a metric's trajectory across weeks or quarters, which is a different lifecycle than a report page that gets redesigned every time someone wants a new visual.

**2. Connect a goal's value to a live measure instead of typing numbers in by hand.** When you create or edit a goal, you can set its current value to *Connect data*, then point it at a value from an existing Power BI dataset. This is the difference between a scorecard that updates itself on your normal report refresh schedule and one that quietly goes stale because someone forgot to re-enter last month's number.

**3. Set a target, not just a current value.** Every goal has a target field — a fixed number, or another connected measure for a moving target (last year's number plus 10%, for example). Power BI shows status automatically as on track, at risk, or behind, based on how the current value compares to where the target trend says it should be by now.

**4. Roll individual metrics up into a scorecard.** A single Goal is one KPI; a Scorecard is the page that holds several of them side by side — revenue, churn, active users — each with its own owner, status, and check-in history. This is what makes it a stakeholder-facing artifact rather than a single chart: a VP can scan one page and see which of five metrics needs attention instead of opening five different reports.

**5. Assign an owner and use check-ins for the "why," not just the "what."** Each goal has an owner field and a check-in log where someone can add a short note — "dipped in March due to a pricing change, expected to recover by Q3." That note is what turns "the number went down" into something a reader can act on, and it lives with the metric instead of buried in a chat thread that gets lost.

**6. Nest goals for a rollup metric made of several sub-metrics.** A goal can have child goals underneath it — a top-line "Customer Satisfaction" goal built from separate NPS, support ticket volume, and churn goals. Expanding the parent shows which sub-metric is actually driving a change in the rollup, which is usually the first question a stakeholder asks anyway.

**7. Know when a scorecard is the wrong tool.** Goals are built for a small set of metrics that get checked on a recurring cadence by people who care about trend and ownership, not for open-ended exploration. If someone wants to slice a number by region, product, and time period on the fly, that's still a report with slicers — point them there and keep the scorecard focused on the handful of numbers that actually get reviewed in a weekly or monthly check-in.

The value of a Goals scorecard isn't the visual — it's the fact that "on track / at risk / behind" and "here's why" live in the same place as the number itself, which is usually the part that gets lost when KPIs are tracked in a spreadsheet that only the person who built it knows how to read.
