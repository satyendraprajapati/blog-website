---
title: "Power BI Projects (.pbip): Version-Controlling Your Reports with Git"
date: "2026-10-20"
tags: ["power-bi", "pbip", "version-control"]
excerpt: "How enabling Power BI Project files turns a binary .pbix into readable, diffable text so you can actually track changes to a report in Git."
---

A .pbix file is a zipped binary blob. Put it in Git and every commit message says "updated report" because that's all you can say — there's no diff, no blame, no way to see which measure changed between two versions. Power BI Projects (.pbip) fix that by saving a report as a folder of plain-text files instead of one opaque archive.

**1. Turn it on before you save anything.** In Power BI Desktop, go to File > Options and settings > Options > Preview features, and enable "Power BI Project (.pbip) save option." It's still listed under Preview, but it's stable enough for day-to-day modeling work. Once it's on, "Save As" offers .pbip alongside the usual .pbix.

**2. What you actually get on disk.** Saving as .pbip produces a `.Report` folder and a `.SemanticModel` folder sitting next to a small `.pbip` pointer file. Inside the semantic model folder, every table, relationship, and measure lives in its own TMDL (Tabular Model Definition Language) text file instead of one binary blob.
```dax
measure 'Net Margin' =
    DIVIDE([Total Revenue] - [Total Cost], [Total Revenue])

    formatString: 0.0%
```
That's a real file you can open in a text editor, search with grep, or read in a pull request — not a screenshot of the DAX pane.

**3. Diffs become reviewable.** Change a measure's formula, rename a column, or add a new table, and `git diff` shows exactly which lines moved — the same review experience you'd expect from reviewing application code, applied to a semantic model for the first time.

**4. Know what still doesn't diff cleanly.** The report layout (`report.json` and friends) and some visual-level settings still serialize as dense JSON that's technically text but not pleasant to read in a diff — rearranging a visual by a few pixels can touch a surprising number of lines. Treat the `.SemanticModel` folder as the part worth reviewing closely, and the `.Report` folder as "commit it, but don't expect a human-readable diff."

**5. A workflow that actually uses this.** Branch per report change the same way you would for code: pull the latest, open the .pbip, make the DAX or model change, commit, and open a pull request where a teammate reviews the TMDL diff before it merges to the branch your deployment pipeline publishes from. Keep the underlying data source connection strings and credentials out of the repo — .pbip stores the model and report definitions, not your data or your gateway credentials, so there's nothing sensitive to leak by committing it.

Analysts who've never used version control on a BI project tend to assume Git is for application code and spreadsheets or dashboards live outside that discipline. .pbip is the piece that actually makes "Power BI report" and "code" the same kind of artifact — reviewable, diffable, and revertible one commit at a time instead of one full-file overwrite at a time.
