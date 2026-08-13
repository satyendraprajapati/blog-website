---
title: "Building a Live Composite Summary Slide in PowerPoint by Linking Multiple Excel Ranges as Pictures"
date: "2026-08-13"
tags: ["powerpoint", "excel", "dashboard"]
excerpt: "How to combine a KPI cell, a small table, and a chart from different Excel sheets onto one PowerPoint slide that all update together on refresh — without rebuilding the layout every week."
---

Linking a single Excel chart into PowerPoint solves one problem: that one chart updates itself. But a real summary slide usually needs more than a chart — a KPI cell, a small table, and a trend line, often pulled from three different sheets or even different workbooks. Paste Special's "Paste Link" option handles that composite case: it turns any copied range into a live linked picture, and you can drop as many of them onto one slide as the layout needs.

**1. Copy a range in Excel, then in PowerPoint use Home → Paste → Paste Special → Paste Link, choosing "Microsoft Excel Worksheet Object" or "Picture (Enhanced Metafile)."** The worksheet object stays editable (double-click to open the source range in place); the picture format is lighter and faster to render, which matters once a slide has several of these stacked together.

**2. Unlike linking a single chart, you can link several separate, non-adjacent ranges onto one slide, and each one refreshes independently.** A KPI cell from a summary sheet, a small table from a raw-data sheet, and a chart from a third sheet can all sit on the same slide, each pointing back to its own source range — the slide becomes a composite view assembled from pieces that were never adjacent in the workbook.

**3. Resize a linked picture by dragging a corner handle only, never a side handle.** Stretching a linked object from an edge distorts its proportions permanently, and that distortion reappears every time the link refreshes — the fix isn't a one-time drag, it's redoing the link from scratch.

**4. Use File → Info → Edit Links to Files (or right-click a linked object → Update Link) to refresh everything at once, or to check which objects are still pointing at a valid file.** This is also how you catch a broken link before presenting — a renamed or moved source workbook doesn't throw an error on the slide itself, it just silently stops updating.

**5. Keep the source workbook in a fixed, shared location — a shared drive or SharePoint folder, not a laptop desktop.** Linked objects store an absolute file path to the source, so moving, renaming, or emailing a copy of the workbook breaks every slide referencing it, and the deck gives no visible warning that it's now showing stale numbers.

**6. Reach for this over a static screenshot only for a recurring, internally-facing deck that pulls from a model you control and update on a schedule.** For a client-facing deck, a linked object lets a curious viewer trace numbers back into your working file if they ever get a copy of it, which is rarely what you want — paste plain images there instead, and reserve live links for status decks and internal reviews where the update cycle is the whole point.

The payoff is a weekly status slide that updates itself the moment the source workbook is refreshed and saved — no manual re-copying of a KPI number, a table, and a chart into PowerPoint one at a time, just a five-second link refresh before the meeting starts.
