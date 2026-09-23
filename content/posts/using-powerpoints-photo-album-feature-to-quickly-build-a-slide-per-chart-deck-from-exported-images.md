---
title: "Using PowerPoint's Photo Album Feature to Quickly Build a Slide-Per-Chart Deck from Exported Images"
date: "2026-09-23"
tags: ["powerpoint", "productivity", "beginner"]
excerpt: "A folder of exported chart images turns into a full one-chart-per-slide deck in a couple of clicks with a feature most data analysts never open."
---

Exporting twenty charts out of Power BI or Excel and pasting each one onto its own slide by hand is the kind of task that eats an afternoon for no good reason. PowerPoint has had a tool built exactly for "turn a folder of images into a deck, one per slide" since long before data decks were its main use case — it's just filed under a name that doesn't sound like it applies.

**1. Find it under Insert → Photo Album → New Photo Album.** It's easy to skip past because the name suggests vacation pictures, not chart exports, but it works on any image files — PNG or JPG exports of charts, dashboard screenshots, anything you'd otherwise paste in one at a time.

**2. Use File/Disk to bulk-import an entire folder of exports at once.** In the dialog, click **File/Disk**, select every image in your export folder, and they're added in the order you select them — or in filename order if you select-all. Name your export files with a leading number (`01-revenue.png`, `02-churn.png`, …) beforehand so the slide order comes out right without manual reordering afterward.

**3. Pick a picture layout that fits how much space each chart needs.** The **Picture Layout** dropdown controls how many images land per slide and whether a title placeholder is included — **1 picture** gives each chart the full slide, which is usually right for a data chart that needs room to be read; **Fit to slide** removes the white frame around the image entirely.

**4. Turn on captions if your filenames are already descriptive.** The **Captions below ALL pictures** checkbox pulls each slide's caption from its image filename — another reason to rename files to something readable (`Revenue by Region.png`) before importing rather than leaving them as `chart_export_04.png`.

**5. Insert blank text slides between charts for commentary.** The **New Text Box** button adds a blank slide into the album sequence at the point you specify, giving you a spot to write the "why this matters" framing between one chart slide and the next, without breaking out of the album workflow to insert it manually later.

**6. Edit the album later without rebuilding it from scratch.** Once the album exists, going back to **Insert → Photo Album → Edit Photo Album** reopens the same dialog with the current set of images, where you can add new exports, remove outdated ones, or reorder them — reordering images this way is the one thing the album remembers how to do that dragging slides in the normal slide sorter won't, since the album treats the sequence as a single linked set.

It's not a substitute for a designed data deck where each slide needs custom framing, but for the "I need this backup of every chart from this month's refresh, one per slide, right now" version of a deck, it turns a tedious paste-and-resize afternoon into a two-minute dialog.
