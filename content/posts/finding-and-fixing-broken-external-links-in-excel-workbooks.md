---
title: "Finding and Fixing Broken External Links in Excel Workbooks"
date: "2026-10-04"
tags: ["excel", "troubleshooting", "beginner"]
excerpt: "Why a workbook that pulls numbers from another file quietly breaks when that file moves or gets renamed, and how to find, update, or remove the links causing it."
---

A workbook that references cells in another Excel file looks completely normal right up until that other file gets renamed, moved to a different folder, or deleted — then formulas that used to return a number start returning a `#REF!` error or a stale, frozen value with no obvious explanation. Here's how to find and fix the external links actually causing it.

**1. Spot the warning on open, don't dismiss it.** When a workbook contains links to another file, Excel shows a banner on open asking whether to update the values. Clicking "Don't Update" doesn't remove the link — it just keeps showing you whatever was last pulled in, which is how a report can silently go stale for weeks before anyone notices the numbers haven't moved.

**2. Open Edit Links to see every external reference in one place.** Go to **Data → Queries & Connections → Edit Links** (or **Data → Edit Links** in older versions). It lists every source workbook this file depends on, its current status, and whether Excel can actually find it right now.

**3. Use "Check Status" before assuming a link is broken.** A link that shows as "Unknown" just hasn't been checked yet in this session — click **Check Status** to force Excel to verify it. Only a link that comes back as "Source not found" or "Error" needs fixing.

**4. Fix a broken link by repointing it, not by rebuilding the formula.** In the Edit Links dialog, select the broken source and click **Change Source**, then browse to wherever the file actually lives now. Every formula that referenced it updates automatically — you don't need to touch a single cell.

**5. Search for stray links a dialog box won't show you.** Some external references hide inside named ranges, chart data ranges, or data validation lists instead of an ordinary cell formula, and Edit Links won't always surface those. `Ctrl+F` → **Options** → search within **Workbook** for `.xlsx` or `[` catches most of the ones hiding outside plain formulas.

**6. Break the link on purpose when a report needs to travel.** Once a workbook is finished and about to be emailed or archived, click **Break Link** in the same dialog to convert every linked formula to its last calculated value. This is also the fix when you've inherited a file full of links you don't need and don't want a "Source not found" warning following it around forever.

```excel
='[Q3 Regional Budget.xlsx]Summary'!$B$2
```

That's what an external reference looks like in the formula bar — the file name in brackets, the sheet name, and the cell. Recognizing that shape is most of the battle: the moment you can see a formula is reaching outside the current file, "why did this number change (or stop changing)" has a much shorter list of likely causes.
