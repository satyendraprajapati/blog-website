---
title: "Splitting and Extracting Text in Excel: Flash Fill, Text to Columns, and TEXTBEFORE/TEXTAFTER"
date: "2026-08-05"
tags: ["excel", "data-cleaning", "beginner"]
excerpt: "Three different ways to pull a first name, area code, or product code out of a messy text column, and how to pick the right one for the job."
---

A raw export rarely gives you data in the shape you need. A "Full Name" column needs to become first and last name, a "SKU-Region" field needs to be split in two, or an email column needs just the domain pulled out. Excel has three genuinely different tools for this, and reaching for the wrong one either wastes time or breaks the next time the data refreshes.

**1. Flash Fill** — the fastest option for a one-off cleanup. Type the result you want for the first row or two next to the source column (e.g. type "John" next to "John Smith"), then press `Ctrl+E`. Excel detects the pattern and fills the rest of the column instantly. It has no formula behind it — the values are static text — which makes it perfect for a quick fix but risky for anything you'll need to redo after the source data changes.

**2. Text to Columns** — better when you're splitting on a consistent delimiter (a comma, space, or hyphen) across an entire column at once. Select the column, go to `Data → Text to Columns`, and choose *Delimited* or *Fixed Width*. It's a wizard, not a formula, so like Flash Fill it produces static values — run it once and the split is done, but it won't update automatically if new rows are appended below.

**3. `TEXTBEFORE` and `TEXTAFTER`** — the formula-based option, and the one to reach for when the source data keeps changing or you're building something that needs to stay live. They extract everything before or after a delimiter, and they recalculate automatically as the source cell updates.

```excel
=TEXTBEFORE(A2, "@")
=TEXTAFTER(A2, "@")
```

For a full name split into first and last, use a space as the delimiter:

```excel
=TEXTBEFORE(A2, " ")
=TEXTAFTER(A2, " ")
```

Both functions accept an optional instance number, which matters for text with more than one delimiter — pulling the region out of `"SKU-1042-WEST"` means you want everything after the *second* hyphen, not the first:

```excel
=TEXTAFTER(A2, "-", 2)
```

**4. Combine `TEXTBEFORE`/`TEXTAFTER` with `IFERROR` for inconsistent data.** Real exports aren't always uniform — some rows might be missing the delimiter entirely. Wrapping the formula avoids `#N/A` spilling into a report:

```excel
=IFERROR(TEXTAFTER(A2, "@"), "No domain found")
```

**How to choose between the three:** if it's a single cleanup you'll do once and never touch again, Flash Fill is fastest. If you're processing a full column with a reliable delimiter and don't need it to stay dynamic, Text to Columns is simple and requires no formula knowledge to maintain. If the sheet is a living report — new rows get added weekly, or the split feeds a pivot table or chart downstream — use `TEXTBEFORE`/`TEXTAFTER` so the split updates itself along with everything built on top of it.
