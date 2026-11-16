---
title: "Excel File Formats for Large Datasets: XLSX vs. XLSB vs. CSV"
date: "2026-11-16"
tags: ["excel", "performance", "beginner"]
excerpt: "Why a workbook that opens and saves painfully slow often has nothing to do with your formulas, and everything to do with the file format it's saved in."
---

Most Excel advice focuses on formulas and formatting, but once a workbook crosses a few hundred thousand rows or picks up a handful of pivot tables, the file format you save it in matters just as much. Here's what actually changes between the three formats you'll run into most.

**1. `.xlsx` is the default, and it's a zip file in disguise.** Every `.xlsx` workbook is actually a folder of XML files compressed into one archive — that's why it opens in any unzip tool if you rename the extension to `.zip`. XML is verbose, so on a large, formula-heavy workbook this format is the slowest to open and save of the three, even though it's the safest default for day-to-day sharing because almost every tool can read it.

**2. `.xlsb` keeps everything else but stores it in binary instead of XML.** Same sheets, same formulas, same pivot tables and charts — just packed in a binary format instead of text-based XML. For a workbook with 200,000+ rows or several large pivot caches, switching to `.xlsb` can cut file size by half and noticeably speed up opening and saving, with zero changes to how the workbook behaves. The only real cost is that a few very old third-party tools expect `.xlsx` specifically, so check before you standardize a shared report on it.

**3. `.csv` is the fastest to write and read, but it remembers nothing structural.** A CSV is plain text — no formulas, no formatting, no multiple sheets, no pivot tables. That makes it the smallest and quickest option for moving raw data between systems (exporting from a database, handing data to a Python script, loading into Power Query), but it's the wrong choice for anything you want to open and keep working in, since reopening it loses column widths, number formats, and anything beyond the raw values.

**4. The switch costs nothing but File > Save As.** You don't need to rebuild anything — open the workbook, use `File > Save As`, and pick "Excel Binary Workbook (*.xlsb)" instead of the default. Everything inside stays exactly as it was; only the container format changes.

**5. Match the format to the job, not the habit.** A rule of thumb that covers most analyst workflows:

- Actively editing a large, pivot-heavy workbook day to day → `.xlsb` for speed.
- Sharing a finished report with someone outside your team → `.xlsx` for compatibility.
- Moving raw rows into another tool or system → `.csv` for size and universality.

None of this changes a single formula or chart — it's a five-second decision at save time that can turn a workbook that takes twenty seconds to open into one that takes five.
