---
title: "Building a Data Dictionary Tab in Excel So Handoffs Don't Need a Meeting"
date: "2026-11-09"
tags: ["excel", "documentation", "beginner"]
excerpt: "A simple in-workbook tab that defines every column, its source, and its business rule — so the next person to open the file doesn't have to ask you what a column means."
---

Every shared workbook eventually gets a column nobody remembers the rule for — is "Active Customer" based on a purchase in the last 90 days or the last 12 months? The fix isn't a separate README that drifts out of date and gets lost; it's a tab inside the workbook itself that travels with the data.

**1. Give the dictionary its own tab, placed first.** Name it something obvious like `README` or `Data Dictionary`, and put it as the leftmost sheet so it's the first thing anyone sees when they open the file — not buried after ten data tabs where nobody scrolls to find it.

**2. Use a consistent set of columns for every entry.** A dictionary is only useful if it answers the same questions every time: `Column Name`, `Definition`, `Source`, `Data Type`, `Business Rule`, and `Last Verified`. Turn this range into an Excel Table so new rows inherit the formatting automatically as the workbook grows.

**3. Write the business rule in plain language, not just the formula.** "Active Customer = placed an order in the trailing 90 days" tells a reader what the column *means*; the formula behind it tells them how it's calculated. Include both — the rule explains intent even after the formula changes.

**4. Flag columns that exist in the data but aren't documented yet.** A dictionary that silently falls behind is worse than no dictionary, because people trust it. A quick formula on the dictionary tab can compare your data table's headers against the dictionary's `Column Name` list and call out anything missing:

```excel
=IF(COUNTIF(DataDictionary[Column Name], Sales[#Headers]) = 0, "⚠ Undocumented", "OK")
```

Drop that next to each header (or in a small summary area) and any new column added to the data tab shows up as undocumented until someone fills in its row.

**5. Record who owns the definition, not just who wrote the workbook.** On a shared report, the person who built the file and the person who can answer "what counts as a return?" are often different people. A `Business Rule` column that also names an owner saves the next analyst from guessing or pinging the wrong person.

**6. Keep it inside the workbook, not in a wiki page that isn't open when someone's debugging a number.** Documentation that requires leaving the file gets skipped under deadline pressure. A tab that's already open when you're staring at a confusing total gets read.

None of this takes more than a few extra minutes per workbook, and it pays for itself the first time someone other than you has to pick the file up — including you, six months from now, having forgotten your own rule.
