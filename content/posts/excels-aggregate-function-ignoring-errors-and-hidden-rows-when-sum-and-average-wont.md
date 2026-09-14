---
title: "Excel's AGGREGATE Function: Ignoring Errors and Hidden Rows When SUM and AVERAGE Won't"
date: "2026-09-14"
tags: ["excel", "formulas", "data-cleaning"]
excerpt: "AGGREGATE bundles 19 common functions with built-in options to skip errors, hidden rows, and filtered-out data, so you stop nesting IFERROR inside SUBTOTAL just to get a clean total."
---

A raw data column with a few `#DIV/0!` or `#N/A` errors scattered through it breaks a plain `SUM` or `AVERAGE` outright. The usual fix is wrapping every source formula in `IFERROR` first, or reaching for `SUBTOTAL` if the problem is hidden or filtered rows instead. `AGGREGATE` handles both cases — and several others — from a single formula, without touching the underlying data.

**1. Know that the first two arguments do all the work.** `AGGREGATE` takes a function number, then an "ignore" option number, then the range. The function number picks what you're calculating — `9` is `SUM`, `1` is `AVERAGE`, `4` is `MAX` — and the option number picks what to skip.

```excel
=AGGREGATE(9, 6, C2:C50)
```

Here `9` sums the range, and `6` tells it to ignore error values while doing so — no helper column, no `IFERROR` wrapper needed.

**2. Pick the ignore option that matches your actual mess.** The second argument runs from `0` to `7`: `0`/`1` ignore nested `SUBTOTAL`/`AGGREGATE` results, `2` ignores errors, `3` ignores hidden rows and errors together, `6` ignores errors only, and `7` ignores hidden rows only. If a column has both manually hidden rows and stray errors, `6` or `3` is usually the one you want — check the option list in Excel's formula tooltip if you're not sure which number does which, since they're easy to mix up.

**3. Use it in place of `SUBTOTAL` the moment errors enter the picture.** `SUBTOTAL` already skips hidden and filtered rows, but it has no concept of ignoring errors — one `#N/A` in a filtered range still breaks it. `AGGREGATE` covers the same hidden-row behavior and adds error-tolerance on top, which makes it the safer default once a report's source data isn't guaranteed clean.

**4. Reach for the ranking functions when the data has errors in it.** `LARGE` and `SMALL` fail entirely if any cell in the range is an error, even one you don't care about. `AGGREGATE`'s versions of them don't:

```excel
=AGGREGATE(14, 6, D2:D50, 1)
```

`14` is `LARGE`, `6` ignores errors, and `1` asks for the top value — the same call as `=LARGE(D2:D50, 1)`, except it won't choke on a bad row elsewhere in the range.

**5. Know its limits before reaching for it everywhere.** `AGGREGATE` only covers 19 specific functions (`SUM`, `AVERAGE`, `COUNT`, `MAX`, `MIN`, `STDEV`, `VAR`, `MEDIAN`, `PERCENTILE`, `LARGE`, `SMALL`, and a few others) — it's not a general substitute for `SUMIFS` or `COUNTIFS`, and it doesn't take criteria or wildcards. It also can't ignore errors and hidden rows selectively for a function that isn't on its list. For everything within that list, though, it replaces a lot of nested `IFERROR(SUBTOTAL(...))` gymnastics with one flat formula.

None of this changes what the data actually is — `AGGREGATE` just lets a summary formula survive contact with real-world data that has a few bad or hidden rows in it, which is most real-world data.
