---
title: "Excel's Data from Picture: Turning a Photo of a Printed Table into Real Data"
date: "2026-09-15"
tags: ["excel", "data-cleaning", "productivity"]
excerpt: "Excel can read a table straight out of a photo or screenshot and drop it in as real cells — here's how to use Data from Picture without ending up with garbled numbers."
---

A printed report, a whiteboard tally, or a PDF you can't select text from all have the same problem: the numbers exist, but not as data you can work with. Retyping a table by hand is slow and invites transcription errors. **Data from Picture** skips that step by reading a table directly out of an image and inserting it as an editable Excel range.

**1. Find it under Data → From Picture.** On Windows, choose *Picture from File* to pick a photo or screenshot from disk, or *Picture from Clipboard* if you've already copied one — a phone photo of a printed table works, so does a screenshot of a chart's data table from a PDF you can't otherwise copy from. Excel runs OCR over the image and shows you a preview with the rows and columns it detected.

**2. Check the preview before inserting anything.** The preview screen highlights any cell Excel wasn't confident about with a small flag, letting you click in and correct it against the source image right there — fixing a misread character in the preview is much faster than finding it buried in a sheet afterward. Don't accept the insert until you've scrolled the whole preview, not just the first few rows.

**3. Expect the usual OCR mistakes and check for them specifically.** A capital `O` read as a zero, a comma read as a decimal point, or a negative sign dropped entirely are the most common failures — and they're the kind of error that doesn't look wrong at a glance, just quietly wrong in a downstream total. Spot-check totals or subtotals from the image against `SUM()` on the inserted range as a sanity check.

**4. Clean up what comes in as text, not numbers.** OCR sometimes inserts a numeric-looking value as text, which breaks `SUM` and other math silently instead of throwing an error. Wrap the imported column in `VALUE` and `TRIM` to force it back to a real number and strip stray whitespace the OCR pass left behind:
```excel
=VALUE(TRIM(SUBSTITUTE(A2,",","")))
```
Paste the result as values over the original column once you've confirmed it converts cleanly, so you're not carrying a formula layer through the rest of the workbook.

**5. Use it for structure, not for anything sensitive or high-stakes.** Data from Picture is genuinely useful for getting a rough table into Excel fast — a competitor's published price list, a scanned expense report, a stat table from a slide deck. It's the wrong tool for anything where a single misread digit matters, like a legal figure or a financial statement you're about to report on; for those, re-key the specific cells you can't visually confirm against the source rather than trusting the OCR pass end to end.

**6. Keep the source image until you've verified the import.** It's tempting to close the photo or screenshot the moment the table lands in your sheet, but you'll want it again the first time a number looks off two steps later in your analysis. Keep it in the same folder as the workbook, or paste it onto a hidden sheet, until the imported data has been used in at least one calculation that would flag an obvious error.

For a one-off table buried in a document you can't otherwise get data out of, Data from Picture turns a ten-minute retyping job into a thirty-second import with a quick review — as long as you treat the review step as mandatory, not optional.
