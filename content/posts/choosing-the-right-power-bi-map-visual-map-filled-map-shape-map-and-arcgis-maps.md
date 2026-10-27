---
title: "Choosing the Right Power BI Map Visual: Map, Filled Map, Shape Map, and ArcGIS Maps"
date: "2026-10-27"
tags: ["power-bi", "data-visualization", "geospatial"]
excerpt: "Power BI ships four different map visuals, and picking the wrong one is the fastest way to turn a simple geography question into a confusing report page."
---

Power BI doesn't have one map visual — it has four, and they answer different questions. Reaching for whichever one sits at the top of the visualizations pane is how you end up with bubbles sized by population instead of by the metric that actually matters.

**1. Use the basic Map visual for point locations and simple magnitude.** It plots a bubble per location — city, store, warehouse — and sizes the bubble by a measure. It's the right default for "where are our stores and which ones are busiest," but it gets cluttered fast once you're past a few dozen points, and bubble size is a weak visual encoder for precise comparison.

**2. Use Filled Map when the region itself is the unit of analysis, not a point inside it.** Filled Map shades whole geographic areas — countries, states, postal codes — by a measure, which is the right choice for "which regions are over quota" rather than "where are our individual locations." It needs Power BI to correctly geocode your region names, so a column literally named "State" or "Country" resolves far more reliably than a generic "Region" column with inconsistent values.

**3. Use Shape Map when your boundaries aren't standard geography, or you want sharper performance.** Shape Map uses a TopoJSON file you supply instead of Bing's geocoding, which matters for custom territories — sales regions, voting districts, delivery zones — that don't match any real administrative boundary. It also renders faster than Filled Map on large datasets since there's no live geocoding lookup involved.

**4. Use ArcGIS Maps for Power BI when you need real GIS layers, not just colored regions.** Drive time rings, demographic overlays, heat maps, or multiple reference layers on one map are ArcGIS territory — it's a genuinely different tool embedded in Power BI, with its own learning curve, and it's overkill for a report that just needs "sales by state."

**5. Build the size or color measure before you touch the visual.** Whatever map type you pick, it's only as useful as the measure driving it. A measure that returns a rate instead of a raw count usually tells the real story — ten complaints in a small region can matter more than fifty in a huge one:
```dax
Complaint Rate =
DIVIDE(
    COUNTROWS('Complaints'),
    [Total Orders]
)
```

**6. Add a tooltip page instead of cramming detail into the default hover.** A map's default tooltip is one or two lines — enough for the headline number, not enough for context. A custom tooltip page with a small trend chart gives a viewer the "why" behind a region's color without adding another visual to the main canvas.

None of these four are strictly better than the others — the right one depends on whether you're plotting points, shading regions, matching custom boundaries, or genuinely need GIS analysis, and picking based on that question instead of habit is what keeps the map from being the least trustworthy visual on the page.
