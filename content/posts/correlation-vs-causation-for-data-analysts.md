---
title: "Correlation vs. Causation: A Practical Guide for Data Analysts"
date: "2026-07-24"
tags: ["statistics", "data-analysis", "beginner"]
excerpt: "Why a strong correlation in your dashboard isn't proof of a cause — and questions to ask before you claim one."
---

"Ice cream sales and drowning deaths are correlated" is the textbook example, but the mistake shows up constantly in real dashboards too — a chart that shows two lines moving together gets read as "one caused the other" far more often than the data actually supports.

**A correlation just says two things move together.** It says nothing about direction, and nothing about whether a third factor is driving both. Ice cream and drownings both rise in summer — heat is the real driver, not ice cream.

**Three questions to ask before claiming causation:**

1. **Could it be reversed?** Does high website traffic cause more support tickets, or do more support tickets (from a launch, say) cause more traffic? Correlation alone can't tell you the arrow's direction.

2. **Is there a hidden third variable?** If "marketing spend" and "revenue" both rise every December, check whether that's marketing working or just seasonal demand doing the work for free.

3. **Would a controlled comparison hold up?** The strongest evidence for causation is a test where you changed one thing and held everything else constant — an A/B test, a phased rollout, a before/after with a control group. A correlation observed in historical data, with no experiment behind it, is a hypothesis, not a conclusion.

**In practice:** it's fine to report a correlation — just report it as one. "Revenue and ad spend moved together this quarter" is an honest, useful sentence. "Ad spend drove revenue growth" is a claim that needs an experiment, not just a chart, to back it up.
