---
title: "Excel's STOCKHISTORY Function: Pulling Historical Stock and Currency Data Without an API"
date: "2026-10-09"
tags: ["excel", "formulas", "finance"]
excerpt: "STOCKHISTORY pulls a date range of historical prices for a stock, index, or currency pair directly into a spreadsheet, spilling a real table with no API key or Power Query setup."
---

If an analysis needs historical prices — a stock's close for every trading day last quarter, or a currency pair's rate over the last year — the usual move is downloading a CSV from a finance site and cleaning it up. `STOCKHISTORY` skips that step entirely: it's a native Excel function that returns a dynamic array of dates and prices straight from Microsoft's linked data feed.

**1. The basic syntax takes a ticker, a start date, and an end date.** It spills a two-column array (date and close price) starting from the cell you enter it in — no array formula shortcut needed, it just spills.
```excel
=STOCKHISTORY("MSFT", "2026-01-01", "2026-06-30")
```
The ticker can be typed as plain text the first time; Excel converts it to a Linked Data Type stock card in the background, the same one you'd get from typing a ticker into a cell directly.

**2. The optional arguments control interval and which columns come back.** The fourth argument sets interval (0 = daily, 1 = weekly, 2 = monthly), the fifth controls whether headers are included, and everything after that picks which fields to return and in what order — Date, Close, Open, High, Low, Volume map to 0 through 5.
```excel
=STOCKHISTORY("MSFT", "2026-01-01", "2026-06-30", 1, 1, 0, 1)
```
That example returns weekly rows with headers, showing Date and Open instead of the default Date and Close.

**3. Currency pairs use the same function with a different ticker format.** Prefix the pair with `CURRENCY/` to pull an exchange rate history instead of a stock.
```excel
=STOCKHISTORY("CURRENCY/USDEUR", "2026-01-01", "2026-03-31")
```
This is the fastest way to get a real historical FX series into a model without a separate currency API or a manual lookup table.

**4. Point the date arguments at cells instead of hardcoding them.** A report that always needs "last 90 days" or "year to date" shouldn't have a typed-in start date that goes stale. Reference a formula result instead:
```excel
=STOCKHISTORY(B1, TODAY()-90, TODAY())
```
Because the array spills and recalculates automatically, the whole table shifts forward every time the workbook opens — no manual re-download.

**5. Build a PivotTable or chart directly on top of the spill range.** `STOCKHISTORY` output behaves like any other array of cells, so it's a normal source for a PivotTable, a line chart, or a `SUMIFS` — just reference the spill using the `#` operator so the range grows and shrinks with it.
```excel
=SUM(B2#)
```

**6. Watch for the ticker-not-recognized error.** `STOCKHISTORY` relies on Excel being able to resolve the ticker to a known security first — an ambiguous or delisted ticker returns `#FIELD!` instead of a price. If that happens, type the ticker alone into a cell first and confirm Excel turns it into a stock data card before wrapping it in the formula; if it won't resolve there, the function won't resolve it either.

**7. It needs an internet connection and a Microsoft 365 subscription — there's no offline fallback.** Unlike a formula that only touches cells already in the workbook, this one calls out to Microsoft's data service every time it recalculates, so a file built with `STOCKHISTORY` breaks silently for anyone opening it offline or on an older perpetual-license version of Excel. Keep that in mind before baking it into a report you're handing off to someone outside your organization.

For quick financial analysis — a correlation check between a stock and an index, a currency-adjusted revenue comparison, a backtest on a handful of tickers — `STOCKHISTORY` gets you from a blank sheet to a clean, analysis-ready table faster than downloading and reshaping an export ever would.
