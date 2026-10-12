---
title: "Repairing Broken Links to Excel Data in PowerPoint with Edit Links to Files"
date: "2026-10-12"
tags: ["powerpoint", "excel", "troubleshooting"]
excerpt: "When a linked chart or table goes stale or shows an error after a file move, Edit Links to Files is where you re-point it without rebuilding the slide."
---

Linking a chart or table to its source Excel file keeps a deck current without manual re-pasting, but the link is just a saved file path — rename the workbook, move it to a different folder, or send the deck to a colleague without the spreadsheet, and the slide stops updating or shows an outdated snapshot with no obvious explanation. PowerPoint has a dedicated dialog for exactly this situation, and most people never find it because it isn't on the Home tab.

**1. Open it from File, not from the slide.** Go to **File → Info**, and if the presentation has any linked objects you'll see an **Edit Links to Files** option (older versions: **File → Info → Related Documents**). This is the one place that lists every external link in the entire deck, not just the one on the current slide.

**2. Read the status column before touching anything.** Each linked file shows its current path and an update mode (Automatic or Manual). A broken link typically still lists its last-known path — that path is your clue to what moved and where.

**3. Use Change Source to re-point a moved or renamed file.** Select the link, click **Change Source…**, and browse to wherever the workbook actually lives now. This updates the stored path without touching the chart or table's formatting on the slide — you don't lose any sizing, color, or layout work by fixing the link.

**4. Use Break Link deliberately when you're about to share the deck externally.** If you're sending the presentation to a client or stakeholder who doesn't have — and shouldn't have — the source workbook, **Break Link** converts the linked object into a static embedded copy. Do this as a last step before sending, since a broken-but-not-severed link is what produces the confusing "this slide looks old, why won't it update" support request later.

**5. Set Manual update mode for decks that travel between machines.** Automatic links try to refresh every time the file opens, which means a deck opened on a laptop without the workbook mapped to the same drive letter or OneDrive path throws an error dialog on launch. Switching a link's update mode to Manual in this same dialog stops that prompt — you refresh explicitly with **Update Now** when you're actually at your desk with the source file available.

**6. Keep source workbooks and the deck in the same synced folder going forward.** The single biggest cause of broken links is a workbook living in one person's Downloads folder while the deck lives in a shared Teams or SharePoint folder. Relative paths survive a folder move together; they don't survive the workbook and the deck ending up on different drives.

Edit Links to Files won't prevent every broken link, but it turns "the chart on slide 12 looks wrong and I don't know why" into a two-click fix — find the stale path, point it at the file's new location, and the slide is current again without rebuilding anything.
