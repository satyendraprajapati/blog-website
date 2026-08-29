---
title: "Inserting and Refreshing Linked Charts from Google Sheets in PowerPoint (Without Excel)"
date: "2026-08-29"
tags: ["powerpoint", "google-sheets", "reporting"]
excerpt: "PowerPoint's native chart linking only works with Excel files, so here's how analysts whose source data lives in Google Sheets can still get charts into a deck that stay reasonably current."
---

PowerPoint's built-in linked-object paste is genuinely useful — it's what lets a chart on a slide update automatically when the source workbook changes — but it only understands Excel files. If your team runs on Google Sheets instead, that option is greyed out, and the workaround takes a bit more deliberate setup to avoid the deck quietly going stale.

**1. Understand that there's no true live link, only a refresh workflow.** With Excel, PowerPoint maintains an actual OLE link back to the workbook. Google Sheets has no equivalent object type PowerPoint can link to, so every approach below is really "make updating the chart fast," not "make it update itself." Set that expectation up front so nobody on the team assumes the slide is silently live the way an Excel-linked chart would be.

**2. The simplest path: copy the chart from Sheets and paste as a picture, then re-paste on a cadence.** In Google Sheets, right-click the chart and *Copy chart*, then in PowerPoint use *Paste Special → Picture* rather than a default paste, which can bring over an editable-but-disconnected object that's confusing to update later. Re-copying and re-pasting before each report cycle is manual, but it's reliable and requires no setup — the right choice for a chart that updates monthly or less often.

**3. For more frequent updates, publish the chart from Sheets and embed it as a live image.** Google Sheets can publish an individual chart to the web (*File → Share → Publish to web*, then select the specific chart), which gives you a URL that always reflects the current data. PowerPoint can't fetch a live web image directly into a slide, but you can insert that published chart as a linked picture pointing at the published URL, and refresh it manually via *Picture Format → Insert Picture → From a Link* on report day — closer to "current data, one click" than a full re-copy each time.

**4. Watch the sharing settings before you publish anything.** *Publish to web* makes that chart's URL reachable by anyone who has it, without requiring sign-in — fine for a metric you're already presenting externally, but worth a second thought before publishing anything from an internal-only sheet. Unpublish it (same menu, *Stop publishing*) once the deck it fed is no longer in active use.

**5. If the deck needs to be self-contained and offline-safe, export the range as an image instead of linking anything.** For a one-off deck that will be emailed or archived rather than actively maintained, select the chart in Sheets, use *Download → PNG* (from the chart's own menu), and insert it as a normal static picture. No link to manage, nothing that can break when the sheet's sharing permissions change later — the tradeoff is you're back to manual re-exports for every update.

**6. If your team is genuinely mixed Excel-and-Sheets, consider standardizing the reporting workbook on Excel.** None of the above match the one-click *Edit Links to Files → Update Now* refresh that a real Excel link gives you. If a particular report gets rebuilt every week and lives in Sheets only because that's where the raw data happens to be, it's often worth the one-time cost of exporting that specific summary table to Excel and linking from there, rather than re-solving the Sheets refresh problem every cycle.

The core difference to remember: an Excel-linked chart is "always current until you unlink it," while a Sheets-sourced chart is "as current as your last deliberate refresh" — plan the reporting cadence around that instead of assuming PowerPoint is watching the sheet for you.
