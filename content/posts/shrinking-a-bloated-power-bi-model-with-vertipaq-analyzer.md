---
title: "Shrinking a Bloated Power BI Model with VertiPaq Analyzer: Finding Which Columns Are Eating the Most Memory"
date: "2026-11-26"
tags: ["power-bi", "data-modeling", "performance"]
excerpt: "How to use VertiPaq Analyzer to see exactly which tables and columns are inflating your Power BI file size and slow it down."
---

When a Power BI file balloons from 50 MB to 500 MB, Performance Analyzer won't help — it tells you which *visual* is slow, not which *column in the model* is bloating the file. For that, you need to look inside the storage engine itself, and VertiPaq Analyzer is the free tool that does it.

**1. Get VertiPaq Analyzer through Tabular Editor or DAX Studio.** Both tools ship a VertiPaq Analyzer view. DAX Studio is the simpler route: connect it to your open Power BI Desktop file (**External Tools → DAX Studio**), then open the **Advanced → View Metrics** panel. It reads the model's metadata directly — no export, no sample data leaves your machine.

**2. Sort by column size, not row count.** The report breaks down every table and column by its compressed size in the model. A column with a million rows of `TRUE`/`FALSE` values can compress to almost nothing, while a column with a few thousand rows of unique free-text comments can dwarf the rest of the model combined. Size, not row count, is what to chase.

**3. Watch the cardinality column specifically.** VertiPaq compresses a column by building a dictionary of its distinct values and storing references to that dictionary. A column with low cardinality (status flags, categories, yes/no fields) compresses extremely well. A column with high cardinality — transaction IDs, timestamps down to the second, free-text notes — barely compresses at all, because almost every value is unique.

**4. Round or truncate high-cardinality numeric columns before they hit the model.** A timestamp column with millisecond precision might have near-100% unique values; rounding it to the minute or splitting date and time into two separate columns (each with far lower cardinality than the combined datetime) can cut that column's footprint dramatically.
```dax
Date Only = INT([Timestamp])
Time Only = [Timestamp] - INT([Timestamp])
```

**5. Remove columns the report doesn't use, even "just in case" ones.** VertiPaq Analyzer will often surface a wide imported table where only four of thirty columns ever appear in a visual or measure. Every unused column still gets compressed and loaded into memory on every refresh. Deleting unused columns in Power Query, rather than just hiding them in the report, is usually the single biggest win in a first pass.

**6. Re-run the analysis after each change to confirm it actually helped.** Compression behavior isn't always intuitive — splitting a column can sometimes increase total size if it disrupts a sort order the engine was exploiting. Treat each change as a hypothesis and verify it against the metrics view rather than assuming based on theory.

A model audit with VertiPaq Analyzer usually takes less time than one slow refresh cycle, and the columns it flags are often ones nobody remembers adding in the first place.
