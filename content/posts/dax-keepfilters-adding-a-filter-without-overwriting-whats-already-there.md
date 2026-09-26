---
title: "DAX KEEPFILTERS: Adding a Filter Without Overwriting What's Already There"
date: "2026-09-26"
tags: ["power-bi", "dax", "data-modeling"]
excerpt: "CALCULATE's filter arguments replace any existing filter on that column by default -- KEEPFILTERS is the function that makes it intersect with what's already there instead."
---

A measure works fine in isolation, then returns the same number no matter what a viewer selects in a slicer. Nine times out of ten, the cause is the same: a `CALCULATE` filter argument silently overwriting a filter on the same column instead of combining with it.

**1. `CALCULATE`'s filter arguments replace, they don't add.** By default, when `CALCULATE` gets a filter like `Products[Price] > 50`, it doesn't layer that condition on top of whatever filter context already exists on `Products[Price]` — it removes the existing filter on that column entirely and substitutes its own. That's usually what you want. It's not what you want the moment a report also lets someone filter that same column another way, like a slicer or a bucketed "Price Tier" field built from it.

**2. Here's the failure mode in practice.** Say a report has a slicer built on a `Price Tier` column ("$0–50", "$50–100", "$100+") and a measure meant to count products priced above $50:
```dax
Products Above 50 =
CALCULATE(
    COUNTROWS(Products),
    Products[Price] > 50
)
```
Select the "$0–50" tier in the slicer, and this measure should show 0 — nothing in that tier is also above $50. Instead it shows the total count of every product priced above $50 across the whole table, because `CALCULATE`'s own `Price > 50` condition wiped out the tier filter the slicer had just applied to that same underlying column.

**3. `KEEPFILTERS` tells `CALCULATE` to intersect instead of replace.** Wrapping the filter argument in `KEEPFILTERS` keeps the existing filter on the column in place and applies the new condition as an additional restriction (a logical AND), rather than swapping one for the other.
```dax
Products Above 50 (Respect Slicer) =
CALCULATE(
    COUNTROWS(Products),
    KEEPFILTERS(Products[Price] > 50)
)
```
Now selecting "$0–50" correctly returns 0, "$50–100" returns only the handful of edge-case rows right above $50, and "$100+" returns everything in that tier — the measure's condition and the slicer's selection both apply together instead of one silently winning.

**4. It only changes anything when a filter already exists on that column.** If nothing else in the report ever filters `Products[Price]` — no slicer, no visual, no other measure — `KEEPFILTERS` and its absence produce identical results, because there's no existing filter for it to preserve. That makes it safe to reach for defensively on any column-level comparison you write, but it's most worth remembering specifically for measures that filter a column a report also lets users slice by directly.

**5. It solves a different problem than `ALL`, `ALLEXCEPT`, or `ALLSELECTED`.** Those functions *remove* filters from the current context before a calculation runs — that's how you build a "% of total" or "ignore the current selection" measure. `KEEPFILTERS` doesn't remove anything; it changes how a *new* filter argument you're passing into `CALCULATE` combines with filters that are already there. The two categories of function get used together often — for example, `KEEPFILTERS` to preserve a slicer selection while a nested `CALCULATE` also strips a different filter with `ALLEXCEPT` — but neither one substitutes for the other.

The bug `KEEPFILTERS` fixes is quiet by nature: the measure doesn't error, it just returns a number that looks plausible until someone actually tests it against every value in the slicer it's supposed to respect.
