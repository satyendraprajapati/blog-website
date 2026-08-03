---
title: "Power BI Custom Tooltip Pages: Rich Hover Detail Without Cluttering the Report"
date: "2026-08-03"
tags: ["power-bi", "interactivity", "data-visualization"]
excerpt: "How to swap Power BI's default one-line hover tooltip for a small report page, so a viewer gets real context without you adding another visual to the canvas."
---

The default Power BI tooltip — category, value, done — is often not enough context for a viewer to actually trust the number they're looking at. The instinct is to add more visuals to the page so that context is always on screen, but that just trades one problem (not enough detail) for another (a cluttered report). A custom tooltip page solves both: the extra detail exists, but only appears on hover.

**1. Build the tooltip as its own report page.** Add a new page, then in the *Format* pane under *Page information* set **Allow use as tooltip** to On, and set the page size to *Tooltip* (a small ~320×240px canvas). Anything placed on this page — a small chart, a KPI card, a mini table — becomes available as a tooltip elsewhere in the report.

**2. Keep it to one focused visual, not a shrunk-down dashboard.** Because the canvas is small and only visible for the second or two someone hovers, a tooltip page works best with a single trend line, a small breakdown table, or one supporting stat — not a copy of your main report squeezed into a tiny frame.

**3. Wire it up on the visual that needs the context.** Select the visual that should trigger the tooltip, go to the *Format* pane → *Tooltips*, switch the type from *Default* to *Report page*, and choose your new tooltip page. Now hovering over a bar or point on that visual shows the tooltip page instead of the default value box.

**4. Make the tooltip page respect the field being hovered, not just the report's filters.** A tooltip page inherits the filter context of whatever data point triggered it — category, date, or whatever field is on the visual's axis — as long as that field also exists somewhere on the tooltip page (even hidden). A measure like this, dropped on a card on the tooltip page, will automatically recalculate per hovered point:
```dax
Tooltip Detail =
CALCULATE(
    [Total Revenue],
    ALLSELECTED('Date')
)
```
Without a field on the tooltip page matching the hovered dimension, Power BI has nothing to filter by and the tooltip shows the same value everywhere.

**5. Use it to answer the "why" behind a number, not repeat the number itself.** The strongest use of a tooltip page isn't restating the value already on the chart — it's showing something adjacent that explains it: a trend line for that category over the last 12 months, or a breakdown by sub-category. That's context worth a second of hovering that wouldn't be worth permanent screen space.

**6. Turn off report navigation on the tooltip page itself.** Since a tooltip page is never meant to be visited directly, hide it from the page navigation (right-click the page tab → *Hide page*) so it only ever appears as a hover, never as something a viewer can click into by accident.

The net effect is a report that looks simpler on first glance but gets noticeably richer the moment someone starts exploring — which is usually the better trade for a dashboard meant to be looked at daily, not just presented once.
