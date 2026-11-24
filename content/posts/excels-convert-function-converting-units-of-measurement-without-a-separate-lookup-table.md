---
title: "Excel's CONVERT Function: Converting Units of Measurement Without a Separate Lookup Table"
date: "2026-11-24"
tags: ["excel", "formulas", "data-cleaning"]
excerpt: "How to use Excel's built-in CONVERT function to standardize mixed units of measurement in a dataset without building and maintaining a manual conversion lookup table."
---

Mixed units are one of the quieter ways a dataset goes wrong. A shipping log with weights in both kilograms and pounds, a lab sheet mixing Celsius and Fahrenheit, or a regional sales file where one office reports distance in miles and another in kilometers — any of these will silently corrupt an average or a sum if nobody standardizes them first. Most analysts reach for a manual lookup table of conversion factors, but Excel already has this built in.

**1. `CONVERT` takes a number and two unit codes.** The syntax is `=CONVERT(number, from_unit, to_unit)`, and it covers weight, distance, temperature, volume, area, time, pressure, speed, and more in one function — no VLOOKUP table of multiplication factors required.
```excel
=CONVERT(A2, "kg", "lbm")
```
This converts a value in column A from kilograms to pounds. The unit codes are short, case-sensitive strings — `"kg"` for kilograms, `"lbm"` for pounds mass (not `"lb"`), `"mi"` for miles, `"km"` for kilometers.

**2. Temperature works the same way, despite not being a simple multiplication.** Because Celsius-to-Fahrenheit involves an offset, not just a scaling factor, a plain lookup-table multiplier would get this wrong. `CONVERT` handles the offset internally.
```excel
=CONVERT(A2, "C", "F")
```

**3. Build a standardizing helper column instead of overwriting the source data.** Rather than editing the original mixed-unit column, add a new column that always converts to one target unit, and drive every downstream formula, pivot table, and chart off that column instead. If the source column later gets a value in yet another unit, you fix the formula once rather than re-auditing every report built on top of it.
```excel
=CONVERT(A2, UnitLookup[Code], "kg")
```
Pairing `CONVERT` with a small table of unit codes next to the source data (so you can handle a column that mixes several *different* source units, not just two) keeps the formula itself simple while still being fully general.

**4. Know the unit code, not just the unit name.** The most common mistake is guessing at a unit string — typing `"pounds"` or `"lb"` instead of `"lbm"`, which returns a `#N/A` error. Excel's formula helper will list valid codes as you type the function, and Microsoft's documentation page for `CONVERT` has the full table; it's worth bookmarking rather than memorizing, since there are a few dozen codes across all the measurement categories.

**5. Use `IFERROR` to catch unit mismatches without crashing the sheet.** If a dataset has a stray value with a unit `CONVERT` doesn't recognize, wrap the formula so a bad row shows up as a visible flag instead of a cryptic error propagating into a SUM.
```excel
=IFERROR(CONVERT(A2, "kg", "lbm"), "Check unit")
```

**6. Combine it with `TEXT` when you need the unit label to travel with the number in a report.** A converted number without its unit is easy to misread six months later. Concatenating the unit into the display string (while keeping the raw converted number in its own cell for calculations) avoids ambiguity in a handoff.
```excel
=TEXT(CONVERT(A2, "mi", "km"), "0.0") & " km"
```

The appeal of `CONVERT` over a manual factors table isn't just fewer keystrokes — it's one less thing that can silently go stale. A hardcoded multiplier someone typed in 2019 doesn't know when a unit definition gets refined; Excel's built-in function does. For any dataset where "what unit is this actually in" is a recurring question, standardizing through `CONVERT` once, in one helper column, is cheaper than re-deriving the right factor every time the question comes up again.
