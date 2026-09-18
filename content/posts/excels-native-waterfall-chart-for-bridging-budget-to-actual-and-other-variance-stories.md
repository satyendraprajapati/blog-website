---
title: "Excel's Native Waterfall Chart: Bridging Budget to Actual and Other Variance Stories"
date: "2026-09-18"
tags: ["excel", "data-visualization", "beginner", "reporting"]
excerpt: "How to use Excel's built-in Waterfall chart type to show how a set of positive and negative changes bridges a starting number to an ending one, without faking it with a stacked bar chart."
---

A stakeholder rarely just wants a final number — they want to know how you got there. "Revenue went from $2.1M to $2.6M" is less useful than seeing that price increases added $300K, a lost customer took away $150K, and new accounts added $350K. That's exactly what a waterfall chart is built to show, and Excel has had a native one since 2016 — no stacked-bar workaround with invisible "base" series required.

**1. Shape your data as a starting value, a series of changes, and an ending value.** Excel's Waterfall chart reads a normal two-column table — category labels and numbers — and figures out the bridge itself. Positive numbers rise, negative numbers fall, and you don't need a helper column calculating running totals:

```excel
Category         Amount
Starting Revenue  2100000
Price Increases     300000
Lost Customer      -150000
New Accounts        350000
Ending Revenue     2600000
```

**2. Insert it from Insert → Charts → Waterfall.** Select the range, then `Insert → Insert Waterfall, Funnel, Stock, Surface, or Radar Chart → Waterfall`. Excel plots each row as a floating bar connected to the next, with green rises and red falls by default — the visual grammar readers already understand without a legend.

**3. Mark your start and end bars as totals, not changes.** By default, every bar floats based on the running sum, including your first and last rows, which makes the "Starting Revenue" and "Ending Revenue" bars look like changes instead of anchors. Right-click each of those bars, choose **Set as Total**, and Excel resets them to start from zero and stay fixed — so the bridge reads as "here's where we started, here's what moved, here's where we landed" instead of one long unbroken climb.

**4. Use it for anything that bridges two numbers through discrete steps.** Budget-to-actual variance, headcount changes across a quarter (hires, attrition, transfers), or a P&L walk from gross revenue to net profit through each deduction are all the same shape of story — a start, a series of additions and subtractions, and an end. If you can describe the change as "and then this happened, and then this happened," it's a waterfall candidate.

**5. Turn off connector lines for a cleaner read at a distance.** The thin lines linking each bar to the next help on-screen but add clutter in a printed report or a small chart embedded in a table. Right-click the chart, `Format Data Series`, and uncheck **Show connector lines** if the deck or handout will be viewed small — the color and position of each bar still carry the story without them.

**6. Don't use it for more than about seven or eight steps.** A waterfall's strength is that a reader can hold the whole bridge in their head at once. Past seven or eight bars, categories start blurring into a row of thin slivers, and the chart stops answering "what moved the number" and starts just looking busy — group smaller line items into an "Other" bucket instead of plotting each one.

**7. Sort by magnitude only if sequence doesn't matter.** For a chronological story (headcount by month, revenue by quarter) keep the natural order even if it means a small bar sits next to a big one. But for a one-time breakdown with no inherent order — say, "reasons for churn this quarter" — sorting the changes largest to smallest makes it immediately clear which lever mattered most, instead of making the reader scan every bar to find it.

The reason a waterfall chart beats a sentence full of numbers is that it shows direction and magnitude at the same time — a reader sees at a glance which changes helped, which hurt, and by how much, without doing the arithmetic themselves.
