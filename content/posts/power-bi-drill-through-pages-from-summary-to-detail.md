---
title: "Power BI Drill-Through Pages: Letting Users Jump from Summary to Detail"
date: "2026-07-25"
tags: ["power-bi", "interactivity", "dashboard"]
excerpt: "How to build a hidden detail page in Power BI that opens pre-filtered to whatever a viewer right-clicks on a summary visual."
---

A regional summary page can't show every order line without becoming unreadable, but the viewer who spots a dip in the West region still wants to see the underlying orders without you building a separate report for it. Drill-through pages solve this: one hidden detail page that opens already filtered to whatever the viewer clicked.

**1. Build the detail page like any other report page.** Add a new page — call it something like `Order Detail` — and lay out the table or visuals you want a viewer to land on: order-level rows, a customer breakdown, whatever the summary page can't show at its level of aggregation.

**2. Drop the field you'll drill on on this page's *Drill through* well.** Open the Filters pane, and under *Drill through* add the field the summary page will pass in — typically `Region` or `Product Category`. Power BI adds a back arrow to the page automatically once this is set.

**3. Right-click any visual on the summary page to test it.** As soon as a drill-through field is configured, right-clicking a bar, point, or table cell on the summary page shows a *Drill through* option in the context menu. Selecting it opens the detail page filtered to exactly the category that was clicked — no slicer setup required on the viewer's end.

**4. Use "Keep all filters" deliberately, not by default.** In the drill-through field settings, toggling *Keep all filters* on means every other filter active on the summary page (a date range, a slicer selection) carries over to the detail page too, not just the field you clicked. Turn it on when the detail page should stay scoped to the same time window; leave it off when you want the drill-through field to be the only filter applied.

**5. Hide the detail page from report navigation.** Right-click the page tab and choose *Hide page* so it doesn't show up as a regular tab a viewer could stumble into without context (and without a filter applied). It's still reachable via drill-through and the back button — it just isn't part of the normal page flow.

**6. Pass a drill-through filter from a button instead of a right-click.** For viewers who don't discover right-click menus, add a button with its *Action* set to *Page navigation* targeting the detail page, and rely on the page-level filter context already selected (a slicer, a clicked visual) to carry over — this gives you a visible, discoverable path to the same destination.

**7. Add a "Back" button if the automatic one gets hidden by other visuals.** Power BI inserts a back arrow automatically, but it's a small object that's easy to cover accidentally when you're laying out the detail page. Checking that it's visible and unobstructed before publishing saves a viewer from getting stuck on a filtered detail page with no way back.

Drill-through is what keeps a summary page a summary — the moment you're tempted to add "just one more table" to a dashboard so someone can see the underlying rows, that table probably belongs on a drill-through page instead.
