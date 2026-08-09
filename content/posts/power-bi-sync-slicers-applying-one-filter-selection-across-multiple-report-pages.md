---
title: "Power BI Sync Slicers: Applying One Filter Selection Across Multiple Report Pages"
date: "2026-08-09"
tags: ["power-bi", "interactivity", "beginner"]
excerpt: "By default a Power BI slicer only filters the page it's on — Sync Slicers is the setting that makes one region or date selection follow a viewer across the whole report."
---

Add a Region slicer to a Power BI report and it filters that page beautifully — then the viewer clicks over to the next page and it's gone, showing unfiltered data again. This trips up almost everyone building their first multi-page report, and the fix isn't adding a slicer to every page — it's a panel most people never open: **Sync Slicers**.

**1. Open the panel from the View ribbon, not the slicer's own formatting options.** *View → Sync Slicers* opens a panel with two checkbox columns per report page: one for whether the slicer's selection syncs to that page, and a separate one for whether the slicer is visually displayed there. These are independent settings, which is the part that catches people off guard the first time.

**2. Sync the filter without duplicating the visual.** Check "Sync" for every page you want the selection to apply to, but leave "Visible" checked only on the page where the slicer physically lives. This is how you get one Region slicer on your summary page that quietly filters four other detail pages behind the scenes, instead of placing (and manually keeping aligned) a copy of the slicer on every page.

**3. Group pages by what they're meant to share, not sync everything by default.** An Executive Summary page and a raw Data Quality appendix page rarely need the same date range applied. Sync the pages that represent one coherent view of the business — say, all regional performance pages — and deliberately leave out pages meant to show something unfiltered, like a full-history trend page.

**4. Use a single slicer name across pages to avoid confusion, not multiple slicers on the same field.** Sync Slicers only works when you're syncing one slicer's selection, not two separately-placed slicers that happen to filter the same column — those stay independent of each other and can end up showing conflicting states. If a page needs its own visible slicer, sync it to the same underlying selection rather than creating a second, unlinked one.

**5. Reach for a disconnected parameter table instead when the "filter" isn't really a column filter.** Sync Slicers works well for a normal field-based slicer, but a metric switcher — letting a viewer pick "Revenue" vs. "Margin" to change what a chart displays, rather than which rows are included — needs a different mechanism: a small disconnected table and a `SELECTEDVALUE` measure, which naturally works across every page a visual using that measure appears on, with no syncing setup required.

```dax
Selected Metric =
VAR chosen = SELECTEDVALUE(MetricSwitcher[Metric], "Revenue")
RETURN
    SWITCH(
        chosen,
        "Revenue", [Total Revenue],
        "Margin", [Total Margin],
        BLANK()
    )
```

**6. Check sync state after copy-pasting pages.** Duplicating a page to create a similar view is a common way to build out a report quickly, but the duplicate doesn't automatically inherit the same sync group membership as its source — open the Sync Slicers panel and re-check the new page's checkboxes, or a "filtered" page can silently show unfiltered data.

**7. Test by actually switching pages, not by trusting the panel.** The Sync Slicers panel shows configuration, not runtime behavior — the only reliable check is to make a selection, click through to every page it should affect, and confirm the visuals actually changed. This takes thirty seconds and catches the single most common Power BI reporting bug: a viewer assuming a filter applies everywhere when it only ever applied to the page they set it on.

Once it's configured, Sync Slicers is invisible to the end user in the best way — they set a filter once and every page behaves consistently, instead of learning the hard way that Power BI's default is per-page, not report-wide.
