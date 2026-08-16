---
title: "Combining Multiple Excel Files into One Table with Power Query's Combine Files Feature"
date: "2026-08-16"
tags: ["excel", "power-query", "data-cleaning"]
excerpt: "How to fold a folder of identically-structured monthly or regional Excel files into one clean table with Power Query, instead of copy-pasting each one in by hand."
---

If you've ever received twelve monthly sales workbooks or a folder of regional exports and copy-pasted each one under the last, you already know how error-prone that gets — a missed sheet, a pasted-over header row, a column that shifted one file to the next. Power Query's **Combine Files** feature does this automatically, and re-runs itself every time you add a new file to the folder.

**1. Point Power Query at the folder, not the files.** Go to `Data > Get Data > From File > From Folder`, and select the folder containing all the workbooks you want to combine. Power Query lists every file in it as a row, with columns for name, path, and date modified — nothing is combined yet at this stage.

**2. Filter down to the files you actually want.** If the folder has other file types or a "template" file mixed in, filter the `Name` or `Extension` column before combining, the same way you'd filter any other query step. This filter re-applies automatically on future refreshes, so new files matching the pattern get picked up and stray ones get excluded.

**3. Click Combine & Transform, not just Combine.** The `Combine & Transform Files` button opens a sample file, lets you pick which sheet or table to pull from each workbook, and builds a reusable "sample query" that Power Query applies to every file in the folder. Picking `Combine` alone works too, but skips the preview step where you can catch a structural mismatch early.

**4. Add a source file column before you drop it.** Power Query automatically adds a `Source.Name` column showing which file each row came from. Keep this column (renamed to something like `Report Month` or `Region`) instead of deleting it — it's often the only thing that tells you which file a given row originated from once everything is stacked into one table.

**5. Fix column mismatches in the sample query, not per file.** If one file in the folder has an extra column or a renamed header, don't try to fix that file — fix it in the underlying data if you can, or add a step in the sample query (like `Table.SelectColumns`) that normalizes the shape before combining. Whatever transform you apply to the sample gets applied to every file automatically.

```
= Table.Combine(
    Table.SelectColumns(
        each _,
        {"Date", "Region", "Revenue", "Units"}
    )
)
```

**6. Refresh the query instead of repeating the process.** Once it's set up, dropping a new month's file into the source folder and hitting `Refresh` on the query pulls it in, reapplies every transform step, and appends it to the combined table — no manual copy-paste, and no risk of a header row ending up in the middle of your data.

The upfront setup takes a few minutes longer than pasting the first couple of files by hand, but it pays for itself the moment a third or fourth file shows up and you don't have to touch the process at all.
