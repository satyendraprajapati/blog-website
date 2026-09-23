---
title: "Power BI Drill Down and Drill Up: Navigating Hierarchies in a Visual"
date: "2026-09-23"
tags: ["power-bi", "interactivity", "beginner"]
excerpt: "The drill icons in a Power BI visual's header let report viewers move between Year, Quarter, and Month (or Country, State, and City) without a single extra measure."
---

A bar chart of sales by Year is useful until someone asks "what about by quarter?" — and rebuilding the visual, or adding a second one next to it, is more work than the question deserves. If the fields are set up as a hierarchy, Power BI already has the navigation built in; it just isn't obvious until you know where to look.

**1. Build the hierarchy by dragging fields into the same axis well, in order from broadest to narrowest.** Drop `Year` onto a bar chart's Axis field, then drag `Quarter` and `Month` on top of it — Power BI automatically nests them into a hierarchy (visible as `Date Hierarchy` in the Fields pane, or create your own by right-clicking a field and choosing **Create Hierarchy**). The order you drop them in becomes the drill order.

**2. Turn on the drill icons in the visual's header.** Hover over the visual and a small set of arrows appears in the top-left corner: a down-caret (expand), a single down-arrow (drill down), and an up-arrow (drill up), plus a double-down-arrow (show next level). If you don't see them, click the visual once first — they only appear on the active visual.

**3. Know the difference between "Drill Down" and "Expand to next level."** The single down-arrow *replaces* the current level with the next one — a chart showing four years becomes a chart showing that same four years' worth of quarters, sixteen bars in place of four. The double-down-arrow icon instead *expands* every existing category to show its children alongside it, keeping the outer grouping visible. Which one you want depends on whether the audience needs the parent category still labeled on the chart.

**4. Drill into a single category by clicking it first.** Selecting one bar (say, the 2025 bar) and then clicking the drill-down arrow drills into just that category's children instead of exploding every category on the chart at once — useful when a stakeholder asks "what drove *this* quarter" without wanting every other quarter broken out too.

**5. Right-click a data point for a one-step jump to any level, not just the next one.** Right-click → **Drill Down** on a bar takes you one level deeper on that value alone, without touching the drill state of the rest of the chart — the fastest way to go from a summary chart straight to detail on one item a viewer asked about mid-meeting.

**6. Remember that drill state doesn't persist for report viewers and doesn't sync across visuals by default.** Reopening the report resets every visual back to its top level, and drilling into one chart doesn't drill any other chart on the page unless you've explicitly set that up. If a specific drilled-in view is one you want to return to or share, save it as a bookmark instead of relying on someone re-clicking through the same levels.

Drilling costs nothing to set up beyond stacking fields in the right order, and it turns one static chart into the equivalent of three or four — without a single extra visual cluttering the page.
