---
title: "Comparing Two Lists in Excel: UNIQUE, COUNTIF, and Highlighting the Differences"
date: "2026-08-07"
tags: ["excel", "formulas", "data-cleaning"]
excerpt: "Formulas for finding what's missing, what's new, and what's duplicated between two lists in Excel, instead of eyeballing two columns side by side."
---

"Which customers are in this month's export but not last month's?" comes up constantly in analysis work, and eyeballing two columns side by side doesn't scale past about ten rows. A handful of formulas turn that into a one-cell answer.

**1. `COUNTIF` tells you whether a value exists in another list at all.** Wrapped in an `IF`, it becomes a flag column you can filter or sort on — anything returning 0 didn't show up in the other range.

```excel
=IF(COUNTIF(LastMonth[CustomerID], A2)=0, "New", "Existing")
```

**2. `UNIQUE` with two ranges stacked together finds every value that appears in either list, with duplicates collapsed.** Feed it both ranges at once using array-concatenation syntax, and you get a single deduplicated master list without a Power Query merge.

```excel
=UNIQUE(VSTACK(ListA, ListB))
```

**3. Combine `FILTER` and `COUNTIF` to pull out only the values missing from the other list**, instead of flagging every row and then manually filtering. This is the direct answer to "what's in A but not B."

```excel
=FILTER(ListA, COUNTIF(ListB, ListA)=0)
```

Swap `ListA` and `ListB` to get the reverse — what's in B but not A. Running both gives you the full picture: additions and removals, as two separate spilled arrays instead of one merged column you have to sort through by hand.

**4. Find duplicates within a single list with `COUNTIF` against its own range.** Anything counting higher than 1 appeared more than once — useful before a join or a `SUMIFS`, where a duplicate key silently doubles a total instead of throwing an error.

```excel
=IF(COUNTIF(A$2:A$500, A2)>1, "Duplicate", "Unique")
```

**5. Use Conditional Formatting when you want a visual diff, not a formula column.** Select both ranges, then *Conditional Formatting → New Rule → Use a formula*, with a `COUNTIF` check as the rule. This highlights mismatches directly in place, which is faster to scan than a separate output column when you're comparing two lists that are already side by side on the same sheet.

```excel
=COUNTIF($B$2:$B$500, A2)=0
```

**6. Don't reach for `VLOOKUP` or `XLOOKUP` for this — they answer a different question.** A lookup function finds the *value that goes with* a match; a list comparison only needs to know *whether* a match exists, which is exactly what `COUNTIF` was built for and what a lookup function would force you to wrap in an extra `ISNA` check to get the same answer.

**7. Watch for whitespace and case differences before trusting a "no match."** `COUNTIF` is case-insensitive but not whitespace-tolerant — a trailing space from a CSV export makes `"Acme Corp "` and `"Acme Corp"` count as different values. Wrap both sides in `TRIM` if the lists came from different systems, or run a `TRIM`/`CLEAN` pass over each list first so the comparison isn't quietly wrong from day one.

None of these need a helper sheet or a manual `VLOOKUP` build — once the two lists are in a table, the comparison itself is one formula, and the only real decision is which of the four questions (new, missing, duplicate, or mismatched) you're actually trying to answer.
