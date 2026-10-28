---
title: "LEFT, RIGHT, MID, and FIND: Extracting Pieces of Text in Excel"
date: "2026-10-28"
tags: ["excel", "formulas", "beginner"]
excerpt: "The four classic text functions for pulling a specific piece out of a longer string, before you reach for anything fancier."
---

Before `TEXTSPLIT` and Flash Fill existed, analysts pulled pieces out of messy text with four plain functions: `LEFT`, `RIGHT`, `MID`, and `FIND`. They're still the fastest tool for the job when you know exactly where in the string the piece you want sits, and they're worth knowing cold because every other text trick in Excel builds on the same logic.

**1. `LEFT` grabs characters from the start of a string.** If every order ID in your sheet begins with a three-letter region code, you don't need a lookup table to get it out.
```excel
=LEFT(A2, 3)
```
That returns the first three characters of whatever is in `A2` — no more, no less.

**2. `RIGHT` does the same thing from the end.** It's the natural fit for pulling a file extension, a trailing year, or the last four digits of an account number.
```excel
=RIGHT(A2, 4)
```

**3. `MID` grabs characters from the middle, given a starting position and a length.** This is the one that trips people up, because it needs three arguments instead of two: the text, where to start counting, and how many characters to take.
```excel
=MID(A2, 5, 2)
```
If `A2` holds `"INV-2026-07-ACME"` and the month always lands in positions 10-11, `MID(A2, 10, 2)` returns `"07"`. The catch is obvious once you say it out loud — this only works if every value in the column is laid out identically. One inconsistent entry and the formula quietly returns the wrong characters instead of an error.

**4. `FIND` locates the position of a character or substring, so `MID` doesn't have to guess.** This is what turns LEFT/RIGHT/MID from "works on one specific format" into "works on anything with a consistent delimiter." Say you have emails in `A2` and want everything before the `@`:
```excel
=LEFT(A2, FIND("@", A2) - 1)
```
`FIND` returns the position of `@`, and subtracting 1 stops `LEFT` one character short of it. To get the domain after the `@`, combine `FIND` with `MID` and `LEN` (which returns the total length of the string, so you know how far to go):
```excel
=MID(A2, FIND("@", A2) + 1, LEN(A2))
```
Asking for more characters than are actually left is harmless — `MID` just returns what's there, so you don't need to calculate the exact remaining length.

**When to reach for something else.** If the delimiter or position varies row to row in a way that's hard to describe in one formula, Flash Fill (`Ctrl+E`) or `TEXTBEFORE`/`TEXTAFTER` will usually get you there with less fuss — they're built for exactly that irregularity. But for a column with a genuinely fixed layout — a product code, a consistent ID format, a standardized filename — `LEFT`, `RIGHT`, `MID`, and `FIND` are simpler, easier to audit at a glance, and don't require a newer Excel version to open on someone else's machine.

The habit worth building isn't memorizing the syntax — it's pausing before you type any of these to ask "is this position actually fixed for every row, or does it just look that way in the first ten I checked?" That one question avoids more silently-wrong extractions than any formula trick.
