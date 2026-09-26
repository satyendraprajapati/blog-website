---
title: "ROUND, ROUNDUP, ROUNDDOWN, and MROUND: Getting Rounding Right in Excel Reports"
date: "2026-09-26"
tags: ["excel", "formulas", "beginner"]
excerpt: "Formatting a cell to show fewer decimals only changes how a number looks, not what it equals -- these functions change the actual value, which is what a rounding-sensitive report needs."
---

A finance stakeholder asks why a report's line items add up to $100.02 when the total cell shows $100.00. The answer is almost always the same: someone formatted cells to show two decimal places instead of actually rounding the values, so Excel is quietly summing the full, unrounded numbers underneath a display that only *looks* rounded.

**1. `ROUND` changes the value, not just the display.** Formatting a cell (Ctrl+1 → Number) hides digits without touching them — the cell still holds `12.4467` even if it shows `12.45`. `ROUND` actually produces `12.45` as the stored value, so a `SUM` below it matches what a reader would calculate by hand from the visible numbers.
```excel
=ROUND(A2, 2)
```
The second argument is how many digits to keep — 0 rounds to a whole number, 2 rounds to cents, and a negative number rounds to the left of the decimal: `=ROUND(A2, -3)` rounds 48,600 to the nearest thousand.

**2. `ROUNDUP` and `ROUNDDOWN` ignore the normal 0.5 cutoff and always go one direction.** `ROUND` follows standard rounding rules — 12.4 rounds down, 12.5 rounds up. `ROUNDUP` and `ROUNDDOWN` round away from or toward zero no matter how close the number is to the next value, which matters whenever "close enough" isn't good enough.
```excel
=ROUNDUP(A2, 0)
=ROUNDDOWN(A2, 0)
```
A shipment of 4.1 pallets still needs 5 actual pallets — `ROUNDUP` gets that right where `ROUND` would quietly ship 4. A remaining budget of $1,299.90 should probably be reported as $1,299, not rounded up to $1,300 you don't actually have — that's `ROUNDDOWN`.

**3. `MROUND` rounds to the nearest multiple of a number you choose, not the nearest decimal place.** This is the one most analysts don't know exists, and it solves a different problem than the first three: rounding to the nearest nickel, the nearest 50 units, or the nearest quarter-hour.
```excel
=MROUND(A2, 0.05)
=MROUND(A2, 50)
```
`MROUND(0.42, 0.05)` returns `0.40`. Note that `MROUND` requires the number and the multiple to have the same sign, or it errors out — a common gotcha when the source number can go negative (a variance or delta column, for example).

**4. `CEILING` and `FLOOR` do what `MROUND` does but always in one direction.** Where `MROUND` rounds to the *nearest* multiple, `CEILING` always rounds up to the next multiple and `FLOOR` always rounds down — the multiple-based equivalents of `ROUNDUP`/`ROUNDDOWN`.
```excel
=CEILING(A2, 15)
```
Rounding a meeting's logged time up to the next 15-minute increment, or a price down to the nearest $0.99, both fit this pattern better than plain rounding does.

**5. Round at the step your numbers actually need to reconcile at, not just at the final display.** The $100.02-vs-$100.00 mismatch usually comes from rounding a total after summing full-precision line items, when the source system rounded each line first. If a downstream report or a finance team expects line-level rounding, apply `ROUND` (or the source system's own rounding function) to each line before it feeds into a `SUM`, not after — matching *where* you round matters as much as picking the right function.

None of these functions are exotic, but mixing them up — reaching for `ROUND` when the job calls for `ROUNDUP`, or formatting when the job calls for any of them — is a quiet, recurring source of numbers that don't add up the way a reader expects.
