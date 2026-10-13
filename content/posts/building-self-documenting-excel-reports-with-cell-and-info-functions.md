---
title: "Building Self-Documenting Excel Reports With CELL and INFO Functions"
date: "2026-10-13"
tags: ["excel", "formulas", "reporting"]
excerpt: "A footer formula that stamps a workbook with its own file path and last-calculated time, so a handed-off report never gets separated from the context it needs."
---

A report file gets renamed, copied to a shared drive, emailed as an attachment, and six months later nobody opening it can say for certain which version it is or when the numbers were last refreshed. The fix isn't a naming convention everyone forgets to follow — it's a formula that answers those questions automatically, every time the file opens.

**1. `CELL("filename")`** — returns the full path, workbook name, and active sheet of the file it's typed in. Put it in a footer cell and the report always knows where it lives, even after someone copies it somewhere else.
```excel
=CELL("filename")
```
That returns something like `C:\Reports\[Q3-Revenue.xlsx]Summary`. It's not pretty, so most people wrap it to pull out just the piece they want:
```excel
=MID(CELL("filename"), FIND("[", CELL("filename")) + 1, FIND("]", CELL("filename")) - FIND("[", CELL("filename")) - 1)
```
That returns just `Q3-Revenue.xlsx` — useful as a visible stamp on a printed or PDF'd report, where the file name itself isn't shown anywhere on the page.

**2. `INFO("directory")`** — returns the current working directory, which combined with the filename above tells you exactly where a file was saved from, not just what it's called. Handy when the same report name exists in three different folders and you need to confirm which copy is live.
```excel
=INFO("directory")
```

**3. A "last calculated" stamp with `TEXT` and `NOW`** — because `NOW()` alone recalculates every time the file opens and is useless as a record of when the *data* was last refreshed, pair it with a manual refresh step instead of a live formula. Paste this as a value (not a live formula) right after you update the source data, typically via Paste Special → Values, or a tiny macro button if you refresh often:
```excel
="Data last refreshed: " & TEXT(TODAY(), "mmmm d, yyyy")
```
A live `NOW()` formula would just show today's date every time anyone opens the file — the opposite of what you want on a handoff report.

**4. `INFO("osversion")` and `CELL("format")` for format QA** — less about telling a story to the reader and more about debugging your own file before it ships. `CELL("format")` on a given cell tells you the number format actually applied there, which is the fastest way to confirm a column of dates isn't secretly stored as text when a `SUMIFS` on it keeps returning zero.
```excel
=CELL("format", A2)
```

**5. Put it all in one footer row, not scattered across the sheet.** The point of self-documenting metadata is that someone skimming the report sees it without hunting. A single row at the bottom — file name, directory, last-refreshed date — styled in a muted gray font so it doesn't compete with the actual data, does the job. Resist the urge to add a dozen diagnostic cells; three or four lines answer the questions people actually ask ("is this the latest version?", "where did this come from?") without turning the report into a debugging console.

None of this replaces proper version control, but for a workbook that's going to get emailed around and copied into folders you'll never see, a footer that answers "what file is this and when was it last touched" saves the follow-up email asking exactly that.
