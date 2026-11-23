---
title: "Power BI Drillthrough Pages: Letting Viewers Right-Click Into the Detail Behind a Summary Number"
date: "2026-11-23"
tags: ["power-bi", "report-design", "interactivity"]
excerpt: "How to build a dedicated drillthrough page so a viewer can right-click any summary value and jump straight to the filtered detail behind it, instead of you building that view into the main report."
---

A summary page shows regional revenue by month, and the first question every viewer asks is some version of "what's actually in that number?" You could cram a detail table onto the same page, but it clutters a view that's supposed to stay high-level. Power BI's **drillthrough** feature solves this by letting that detail live on its own page, filtered automatically to whatever the viewer right-clicked.

**1. Build the detail page first, as if it stood alone.** Create a new report page — call it `Region Detail` — with a table or matrix showing transaction-level rows: date, product, salesperson, amount. At this point it's just a normal page with no filters applied; the drillthrough setup is what connects it to the summary page later.

**2. Add the field you'll drill on to the Drillthrough well.** In the Visualizations pane with the detail page selected, find the **Drillthrough** section and drag in the field viewers will right-click from on the summary page — typically `Region` or `Month`. This turns the page into a drillthrough target: Power BI now expects to receive a filter on that exact field from somewhere else.

**3. A "Back" button appears automatically — don't delete it.** As soon as you set a drillthrough field, Power BI adds a back arrow button to the page. It's what lets a viewer return to the summary page with that page's own filters intact, rather than losing their place. You can restyle it, but keep the action wired to **Back**.

**4. Right-click any visual on the summary page to test it.** Go back to the summary page, right-click a specific bar or table cell — say, the "West" bar on a regional revenue chart — and a **Drill through** option appears listing `Region Detail`. Clicking it opens that page pre-filtered to West only, built from the single value you clicked on, not a slicer selection.

**5. Decide whether the drillthrough should carry every filter or just the one field.** By default, Power BI passes along all filters active on the summary page (date range, department slicer, etc.) in addition to the field you clicked. If the detail page should ignore the rest of the report's context and only ever filter by the clicked field, turn on **Keep all filters: Off** in the page's drillthrough settings — otherwise a viewer who drilled through while a "Last Quarter" filter was active gets a detail page silently restricted to that quarter too, which can look like missing data if they don't notice.

**6. Hide the detail page from the report's navigation.** A drillthrough page is meant to be reached only by right-clicking, not browsed to directly from a blank state — right-click its tab at the bottom and choose **Hide page**. It still works as a drillthrough target while hidden; it just disappears from the page tabs viewers scroll through normally.

**7. One drillthrough page can serve multiple summary visuals.** Because the drillthrough field determines what gets passed, the same `Region Detail` page works whether the viewer right-clicked a bar on this month's chart or a cell in a totally different table elsewhere in the report, as long as both expose a `Region` value — you don't need a separate detail page per source visual.

Drillthrough is the difference between a report that answers "what's in this number" with another click, and one that forces the viewer to ask you in a meeting — and it keeps that answer off the summary page until someone actually needs it.
