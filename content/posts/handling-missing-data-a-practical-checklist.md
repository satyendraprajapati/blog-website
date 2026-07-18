---
title: "Handling Missing Data: A Practical Checklist for Analysts"
date: "2026-07-25"
tags: ["data-cleaning", "data-analysis", "beginner"]
excerpt: "A decision checklist for what to do when a dataset has gaps, before you drop or fill anything."
---

The instinct when you spot blank cells is to fill them or delete the rows and move on. Both can quietly distort your analysis if you don't first understand *why* the data is missing.

**1. Figure out the missingness pattern first.** Is it random (a sensor occasionally drops a reading), or systematic (every customer from a certain signup form is missing "phone number" because that field didn't exist yet)? Systematic gaps are the dangerous kind — dropping those rows can bias your whole dataset toward whatever's left.

**2. Don't default to deleting rows.** `df.dropna()` or filtering out blanks in Excel is the fastest fix and often the wrong one, especially if the missing rows aren't random. If 30% of one region's rows are missing "revenue," dropping them will make that region look smaller than it is.

**3. Match the fill strategy to the reason for the gap.**
   - Missing because it's genuinely zero (no sales that day) → fill with `0`.
   - Missing because of a broken join or a bad export → fix the source, don't fill at all.
   - Missing because the value fluctuates and you need a placeholder for modeling → consider the column's mean/median, but flag it — filled values shouldn't be silently indistinguishable from real ones.

**4. Keep a flag column.** When you do fill a value, add a companion boolean column (`revenue_was_missing`) instead of just overwriting silently. This lets anyone downstream — including future you — separate "this is a real zero" from "this is a filled-in guess" without re-deriving it.

**5. Report what you dropped.** If rows got excluded, say how many and why in your summary. "Excluded 4% of rows with missing customer IDs" takes one sentence and saves someone from wondering later why your total doesn't match the source system.
