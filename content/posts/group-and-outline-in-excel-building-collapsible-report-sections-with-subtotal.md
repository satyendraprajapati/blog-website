---
title: "Group and Outline in Excel: Building Collapsible Report Sections with SUBTOTAL"
date: "2026-09-01"
tags: ["excel", "reporting", "beginner"]
excerpt: "How Excel's Group and Outline feature turns a long report into collapsible sections, and why SUBTOTAL is the function that keeps totals correct once you start hiding rows."
---

A 300-row report is hard to hand to a stakeholder as-is — they either scroll past everything they don't care about, or you build a second, separate summary tab that drifts out of sync with the detail underneath it. Excel's Group and Outline feature (Data tab) solves this in the same sheet: collapsible sections with `[+]`/`[-]` buttons, no second copy of the data to maintain.

**1. Select the rows for one section and group them.** Highlight the detail rows under one region or category — not its subtotal row — and press `Alt+Shift+Right Arrow`, or use `Data → Group`. A collapse bar and `[-]` button appear next to those rows; click it to fold the section down to just its total.

**2. Let Excel build the outline for you if your data already has subtotal rows.** `Data → Group → Auto Outline` scans the sheet for rows that contain formulas referencing the rows above or below them and groups automatically. It works well on a report that already has a subtotal row per section — badly on one that doesn't, since it has nothing to detect.

**3. Use `SUBTOTAL`, not `SUM`, for every total row inside a grouped report.** A plain `SUM` keeps adding hidden rows into its result even after you collapse a section, which quietly breaks the one number the collapsed view is supposed to show. `SUBTOTAL` is aware of which rows are currently hidden by an outline and excludes them automatically.

```excel
=SUBTOTAL(109, C5:C20)
```

The function number matters: `109` behaves like `SUM` but skips rows hidden by outline or filter; `101`–`111` additionally skip rows you've manually right-click-hidden, while `1`–`11` count those. For an outline-only report either range works — reach for `101`–`111` as the safer default so a manually hidden row never sneaks back into the total.

**4. Fix the summary row position before you group anything.** Click the small arrow in the bottom-right of the Outline group on the Data tab to open Outline Settings, and check whether "Summary rows below detail" is ticked. Get this backwards relative to how your subtotal rows are actually laid out, and the `[+]`/`[-]` buttons end up collapsing the wrong rows into the wrong place.

**5. Nest a second level for sub-categories.** Group the region-level rows first, then group again within one region for its individual products or reps — Excel numbers each level (1, 2, 3...) in the small buttons at the top-left of the sheet, so a viewer can click "2" to expand every section to its second level at once instead of clicking each `[+]` by hand.

**6. Clear the outline before sending a version the recipient shouldn't edit.** `Data → Group → Clear Outline` removes every grouping level and button in one step. Do this on a copy meant for a static handoff, and keep the grouped original for your own working file.

None of this replaces a PivotTable for genuinely dynamic summarization — Group and Outline is for a report whose row order and category boundaries are already fixed, and just needs to be navigable without turning into ten separate sheets.
