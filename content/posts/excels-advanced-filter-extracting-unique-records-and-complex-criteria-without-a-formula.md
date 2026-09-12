---
title: "Excel's Advanced Filter: Extracting Unique Records and Complex Criteria Without a Formula"
date: "2026-09-12"
tags: ["excel", "data-cleaning", "beginner"]
excerpt: "A pre-dynamic-array Excel tool that still does two things the ordinary AutoFilter dropdown can't: OR-across-columns criteria and copying the matching rows out to a separate range."
---

The regular AutoFilter dropdown handles most day-to-day filtering, but it has two real limits: every condition you stack is joined with AND, and filtering only hides rows in place — it doesn't hand you a clean copy of just the matches. Advanced Filter, tucked under Data > Sort & Filter, does both, and it's been sitting there since long before `FILTER()` existed.

**1. Set up a criteria range that mirrors your headers.** Advanced Filter reads conditions from a small range you build yourself, not a dialog. Copy your data's header row somewhere else on the sheet (a few rows above the data works well), then type your conditions underneath it.
```excel
Region      Revenue
West        >50000
East        >50000
```
Conditions on the *same row* are AND'd together; conditions on *separate rows* are OR'd. The layout above returns West OR East, both with revenue over 50,000 — a mix AutoFilter's checkbox list can't express across two different columns at once.

**2. Open Data > Advanced and point it at both ranges.** Fill in the List range (your actual data, headers included) and the Criteria range (the block you just built). Leave "Filter the list, in-place" selected if you just want rows hidden, same as AutoFilter would do.

**3. Switch to "Copy to another location" to extract matches.** This is the feature AutoFilter simply doesn't have. Pick a destination cell, and Excel copies only the matching rows there as a static, independent range — ready to paste into a summary tab, email, or another workbook without disturbing the source data or its filter state.

**4. Check "Unique records only" to deduplicate while you extract.** Combined with "Copy to another location," this pulls a distinct list of matching rows in one pass — no need for `UNIQUE()` or a helper column first. It's the same underlying idea as `UNIQUE()`, but it works in Excel versions or shared templates where dynamic arrays aren't a safe assumption.

**5. Use a formula-based criterion for anything a static value can't express.** A criteria cell can hold a formula instead of a literal value — for example, comparing each row to the sheet's own average:
```excel
Region      Revenue
            =D2>AVERAGE($D$2:$D$100)
```
Leave the header above a formula criterion blank or use a label that doesn't match a real column name, since Excel treats a formula criterion differently from a plain value one. This is how you filter for "above average" or "top of its group" rows without a helper column.

**6. Re-run it after the data changes.** Unlike a `FILTER()` spill formula, Advanced Filter's output doesn't refresh itself — it's a one-time copy. If you rebuild the same extract regularly, record the steps as a macro (Developer > Record Macro) so re-running it after each data refresh is a single click instead of rebuilding the criteria range from scratch.

Advanced Filter feels like a relic next to `FILTER()` and `UNIQUE()`, and if you're on a current Excel build with dynamic arrays available, those functions are usually the better everyday choice — they refresh live and don't need a separate criteria range. But Advanced Filter still earns its place for OR-across-columns logic, one-off extracts into a static range, and workbooks that have to stay compatible with older Excel versions.
