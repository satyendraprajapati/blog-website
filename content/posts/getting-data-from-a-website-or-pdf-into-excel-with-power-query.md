---
title: "Getting Data From a Website or PDF Into Excel With Power Query"
date: "2026-08-31"
tags: ["excel", "power-query", "data-cleaning"]
excerpt: "How to pull a table straight out of a web page or a PDF report with Power Query instead of copy-pasting and reformatting it by hand."
---

A recurring analyst chore is turning a table that lives somewhere else — a public web page, a vendor's PDF report — into something you can actually filter and pivot. Copy-pasting usually drags in merged cells, stray line breaks, or a table that refuses to paste as columns at all. Power Query has a connector for both sources, and it keeps the extraction as a refreshable step instead of a one-time manual fix.

**1. Use `Data → Get Data → From Web` for anything with a URL.** Paste the page address and Power Query loads the page and scans it for tables. In the navigator that appears, each detected table shows a preview — pick the one that matches what you're after. For pages that build their tables with JavaScript after the initial load, switch the connector from "Basic" to "Web page" mode so it renders the page first before scanning.

**2. Expect to land in the Power Query Editor, not straight in a sheet.** This is the useful part, not an extra step — the editor is where you strip out ad banners, merge stray header rows, or drop columns you don't need, all as recorded steps you can rerun later.

**3. Use `Data → Get Data → From File → From PDF` for report-style documents.** Power Query treats each page and each detected table inside the PDF as a separate navigable item, similar to sheets in a workbook. If a report spans 20 pages with the same table layout repeated, you can select several page-tables at once and Power Query gives you the option to combine them into one appended table.

**4. Fix column types immediately, before anything else.** Numbers pulled from a web page or PDF often land as text — a dollar sign or a trailing footnote character is enough to break `SUM` silently. Right-click the column header and set the correct type right after the source step, so every transformation downstream works with real numbers and dates instead of text that merely looks like them.

**5. Set the query to refresh instead of re-pulling by hand next month.** Once the steps are recorded, `Data → Queries & Connections → Refresh` re-runs the whole extraction against the live page or a replacement PDF with the same layout. This is the actual payoff over copy-paste: a report that updates weekly doesn't need you to redo the cleanup every time, only to re-run it.

```excel
= Table.TransformColumnTypes(
    Source,
    {{"Revenue", Currency.Type}, {"Report Date", type date}}
  )
```

**6. Watch for layout drift.** A vendor redesigning their web page or shifting a PDF's column order will break the query at the step that assumed the old shape — usually a "Column not found" error. That's a feature, not a bug: it tells you exactly where the source changed instead of silently importing wrong data into your report.

The web and PDF connectors won't handle every source — a login-gated dashboard or a scanned (image-only) PDF need a different approach — but for the common case of "there's a table on a page or in a report I need in Excel," they replace an error-prone manual copy with a repeatable, auditable query.
