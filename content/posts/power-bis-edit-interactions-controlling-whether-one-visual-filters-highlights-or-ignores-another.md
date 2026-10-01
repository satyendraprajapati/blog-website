---
title: "Power BI's Edit Interactions: Controlling Whether One Visual Filters, Highlights, or Ignores Another"
date: "2026-10-01"
tags: ["power-bi", "interactivity", "beginner"]
excerpt: "Every visual on a Power BI page cross-filters every other one by default — Edit Interactions is the per-visual switch that decides whether that's filter, highlight, or nothing at all."
---

Click a bar in one chart on a Power BI report page, and by default every other visual on that page reacts — a table filters down, a card recalculates, a map re-centers. That's useful most of the time, but not always, and the default is easy to leave unexamined until a stakeholder clicks something and a slide's layout visibly breaks.

**1. Turn on Edit Interactions before you touch anything.** Select a visual, go to the ribbon's Format tab (it's under the visual-contextual ribbon group, not the Format pane), and click Edit Interactions. Small filter/highlight/none icons appear in the top corner of every other visual on the page — these control how that other visual responds when you click the one you've selected.

**2. Filter removes rows outright; Highlight keeps them visible but dimmed.** A bar chart set to Filter will shrink down to only the matching category. Set to Highlight, it keeps every bar on screen but shades the non-matching portion gray, so a viewer can still compare the selection against the whole. Highlight is usually the better default for a comparison chart; Filter is better when the other visual is detail-level and an unrelated row would just be noise.

**3. None stops the ripple entirely.** A KPI card showing a company-wide total, or a legend-style visual meant to stay stable as a navigation aid, should usually be set to None for every other visual's clicks — otherwise a single click on an unrelated chart quietly changes a number that's supposed to read as the fixed baseline.

**4. Interactions are set per pair of visuals, not globally.** Selecting Chart A and setting Chart B to Highlight doesn't affect what happens when you click Chart B instead — you have to select each visual in turn and set its outgoing interactions separately. On a busy page with six or seven visuals, it's worth sketching out on paper which visual should drive which before clicking through all of them.

**5. Interactions respect bookmarks.** If you've built click-through navigation with bookmarks, each bookmark can capture a different interaction state along with everything else it saves (filters, visibility, sort order) — useful for a report that starts in an "explore everything cross-filters" mode and switches to a locked-down presentation mode on a different bookmark.

The setting is easy to miss because the report works without ever touching it — every visual just cross-filters everything else, which looks fine until a demo where clicking a product in one chart unexpectedly zeroes out a total three visuals away. A few minutes in Edit Interactions, set once per report, is cheaper than explaining that behavior live.
