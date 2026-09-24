---
title: "Excel's Linked Data Types: Turning Plain Text Into Live Stock, Currency, and Geography Data"
date: "2026-09-24"
tags: ["excel", "data-types", "beginner"]
excerpt: "A built-in Excel feature turns a plain text column of tickers, currency codes, or place names into a connected data source you can pull dozens of live fields from."
---

Type a list of company names, currency codes, or country names into a column and most analysts reach straight for a lookup formula or a manual research pass to fill in the details next to them. Excel has a built-in way to skip both: Linked Data Types, under the Data tab, convert plain text into a connected record you can pull fields from directly.

**1. Turn a column into Stocks or Geography data.** Type a list of tickers or company names, select the range, and click Data → Stocks (or Data → Geography for places). Excel matches each entry against Bing's data service and swaps the plain text for a small icon indicating a successful match — click the icon to see a card of everything it found, from market cap to founding date, or population to time zone.

**2. Pull specific fields out with the field-extraction formula**, rather than manually inserting a column for every stat. Once a cell holds a linked data type, reference it with dot notation to extract exactly one field:

```excel
=A2.Price
=A2.Market Cap
=B2.Population
```

**3. Or use `FIELDVALUE` when the field name comes from a cell** instead of being typed directly into the formula, which matters if you want one formula you can copy down while a neighboring column drives which stat it pulls:

```excel
=FIELDVALUE(A2, C$1)
```

Here `C$1` might hold "Price" in one column and "52 Week High" in another, letting the same formula power a whole comparison table just by changing the header.

**4. Refresh it like any other external data.** Linked Data Types aren't static — a stock's price or a country's exchange rate updates when the workbook recalculates, and you can force it with Data → Refresh All. That makes this a genuinely live source, not a one-time lookup, which matters for anything you reopen the next morning expecting current numbers.

**5. Use Currencies for quick, self-updating conversion tables.** Type currency pairs like "USD/EUR" into a column, apply the Currencies data type, and pull `.Exchange rate` for each row. For a report that compares regional revenue in a common currency, this beats hardcoding a rate you'll forget to update next quarter.

**6. Know where it breaks down before you rely on it for anything critical.** The data comes from a third-party service Microsoft doesn't guarantee for accuracy or uptime, matches can silently fail on ambiguous names (a city that shares its name with several others, a ticker that's been delisted), and it requires an internet connection — a workbook opened offline shows whatever was last cached, not an error. For anything going into a financial statement, treat it as a fast first pass to verify, not a source of record.

The appeal here isn't any single field — it's that a plain list of names becomes a queryable dataset without a VLOOKUP against a reference table you'd otherwise have to build and maintain yourself.
