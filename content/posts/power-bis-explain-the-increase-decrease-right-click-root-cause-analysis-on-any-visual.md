---
title: "Power BI's Explain the Increase/Decrease: Right-Click Root-Cause Analysis on Any Visual"
date: "2026-09-21"
tags: ["power-bi", "ai-visuals", "data-analysis"]
excerpt: "Before you build a Key Influencers visual or a Decomposition Tree, right-click a single point on almost any Power BI chart and let Explain the Increase/Decrease suggest what moved it."
---

A stakeholder points at one bar on a line chart and asks "why did this jump?" — and most analysts respond by opening a new page and rebuilding a breakdown by hand. Power BI has a lighter-weight tool for exactly this moment already built into the visual itself: Explain the Increase/Decrease, tucked under the right-click Analyze menu.

**1. Right-click the specific data point that moved, not the whole visual.** On a line or bar chart, right-click the point where a value jumped or dropped compared to the one before it, then choose `Analyze > Explain the increase` (or "Explain the decrease" — the wording follows the direction of the change). It needs a specific point to compare, so this doesn't work from an empty click on the chart background.

**2. Read the "Analyzed by" panel, not just the top suggestion.** Power BI opens a side panel that tests every other field in your model as a candidate explanation, and ranks them by how much of the change each one accounts for. It's worth scanning past the first result — the top-ranked field explains the most variance, but a second or third field close behind it can be the more actionable story for the audience in the room.

**3. Use the visual it generates as a draft, not a final slide.** Each candidate explanation renders as a small chart showing how that field's categories contributed to the change. Treat it as a fast first pass at "where do I even start digging" — it's a real analysis worth verifying against the underlying data before it goes in front of a stakeholder, the same way you'd sanity-check any auto-generated result.

**4. Pin the useful ones straight to a report page.** Found a breakdown that actually explains the jump? The panel has a pin icon that drops that specific chart onto an existing report page or a new one, so you don't have to manually recreate the visual it just built for you.

**5. Know when to reach for Key Influencers or a Decomposition Tree instead.** Explain the Increase/Decrease is built for one specific question — "why did this one point change relative to the last one?" — on a time series or ordered category axis. If you're instead asking "what generally drives high values of this measure" across the whole dataset, that's Key Influencers; if you want to interactively drill through dimensions on demand, that's the Decomposition Tree. All three sit under the same right-click Analyze menu, but they answer different questions.

**6. Expect it to need a reasonably clean model to work well.** Like the other AI-assisted visuals, the quality of the suggestions depends on having enough distinct dimension fields in the model for it to test against. A fact table with only two or three descriptive columns won't give it much to work with, and the suggestions will feel thin no matter how real the underlying cause is.

The value here isn't that it replaces a proper root-cause analysis — it's that it gets you from "someone just asked why" to a ranked list of candidate answers in about ten seconds, before you've even opened a new page.
