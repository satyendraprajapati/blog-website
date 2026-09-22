---
title: "VLOOKUP's Approximate Match: Building Tax and Commission Tier Lookups in Excel"
date: "2026-09-22"
tags: ["excel", "formulas", "beginner"]
excerpt: "VLOOKUP's exact-match mode gets all the attention, but its lesser-known approximate-match mode is the simplest built-in way to assign a tax bracket, commission tier, or grade band from a single sorted table."
---

Most VLOOKUP tutorials stop at exact match — the fourth argument set to `FALSE`. That covers looking up a single record by ID. But VLOOKUP's other mode, approximate match, solves a different and just as common problem: assigning a row to a bracket based on where a number falls in a range, without writing a chain of nested `IF`s.

**1. Build the bracket table sorted ascending, with only the lower bound of each tier.** Approximate match works by scanning down a sorted lookup column and returning the last row whose value is less than or equal to what you're searching for. So a commission table doesn't need a "from" and "to" column — just the tier's starting point.
```excel
Rate     Tier
0        Bronze
50000    Silver
150000   Gold
500000   Platinum
```

**2. Omit the fourth argument, or set it to `TRUE`.** This switches VLOOKUP from exact match to approximate match.
```excel
=VLOOKUP(B2, TierTable, 2, TRUE)
```
A rep with $180,000 in sales matches the "150000" row and returns "Gold," even though 180,000 never appears in the table itself.

**3. Never sort the bracket table by anything other than the lookup column, ascending.** Approximate match doesn't actually search the whole column — it assumes the data is sorted and stops as soon as it finds a value larger than what you're looking for. Sort it any other way, or add a row out of order, and you'll get a wrong answer with no error to flag it. This is the single most common cause of "my VLOOKUP looks fine but the numbers are wrong."

**4. Use it for tax brackets, shipping-cost tiers, age bands, and grading scales — anywhere the rule is "if X is at least this much, apply this."** It's the same shape of problem whether the tiers are dollar amounts, order weights, or exam scores.
```excel
=VLOOKUP(D2, TaxBrackets, 2, TRUE)
```

**5. Prefer XLOOKUP's `match_mode` argument for new workbooks.** `XLOOKUP` can do the same "find the next smaller item" lookup with `match_mode` set to `-1`, and it doesn't require the table to be the leftmost-to-rightmost layout VLOOKUP needs.
```excel
=XLOOKUP(B2, TierTable[Rate], TierTable[Tier], , -1, -1)
```
It's worth knowing the VLOOKUP version anyway — plenty of shared workbooks and older company templates still use it, and being able to read one instead of guessing what it's doing will save you from breaking someone else's bracket logic.

**6. Double-check the edge cases by hand before trusting the column.** Pick one value that sits exactly on a bracket boundary and one that sits just below it, and confirm both land in the tier you expect. A single misplaced row in the bracket table, or a boundary value that should round up instead of down, is easy to miss when you're only scanning the output for values that look plausible.

Approximate match isn't a shortcut around understanding your bracket rules — it's a way to encode them once, in a small sorted table, instead of re-deriving them inside a formula every time a boundary changes.
