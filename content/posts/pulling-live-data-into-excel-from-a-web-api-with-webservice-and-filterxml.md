---
title: "Pulling Live Data into Excel from a Web API with WEBSERVICE and FILTERXML"
date: "2026-09-13"
tags: ["excel", "formulas", "data-analysis"]
excerpt: "Two native Excel functions can call a public API and parse the response in-cell, for the small, one-off lookups where opening Power Query feels like overkill."
---

Power Query is the right tool for any real data pipeline — scheduled refreshes, joins, multiple sources. But sometimes you just want one live number, like today's exchange rate or a single stock quote, dropped into a cell without building a query. For that, two older, less-visited functions do the whole job: `WEBSERVICE` and `FILTERXML`.

**1. `WEBSERVICE` fetches a URL and returns the raw response as text.** Point it at any public API endpoint and Excel does an HTTP GET behind the scenes, dumping whatever comes back — JSON, XML, plain text — into a single cell as a string.

```excel
=WEBSERVICE("https://api.exchangerate-api.com/v4/latest/USD")
```

That cell now holds the entire response body. It's not usable on its own — you need something to pull one value out of it.

**2. `FILTERXML` extracts one piece of an XML document using an XPath expression.** This is the half of the pair that actually makes the result useful, but it only works on XML, not JSON — which is the main limitation to know going in.

```excel
=FILTERXML(A1, "//rate")
```

If your API returns JSON instead of XML, you're stuck reformatting the string manually with `TEXTBEFORE`/`TEXTAFTER` or `MID`, which gets fragile fast. Check for an XML response format option before committing to this approach — many older public APIs and most government/weather data feeds still offer one.

**3. Combine them into a single formula rather than splitting across two cells.** Nesting `WEBSERVICE` inside `FILTERXML` keeps the fetch-and-parse logic in one place, which matters once you're copying the pattern down a column for multiple lookups.

```excel
=FILTERXML(WEBSERVICE("https://example.com/rates.xml?base=USD"), "//rates/rate[@currency='EUR']")
```

**4. Wrap it in `IFERROR`, because both functions fail silently in unhelpful ways.** A timeout, a malformed XPath, or an API that's changed its response shape all return `#VALUE!` with no further explanation. A fallback at least keeps a broken lookup from cascading into every formula that references it.

```excel
=IFERROR(FILTERXML(WEBSERVICE(A1), "//rate"), "Unavailable")
```

**5. Know that these calls happen on every recalculation, not on a schedule you control.** Unlike a Power Query refresh, `WEBSERVICE` fires whenever the workbook recalculates — opening the file, pressing F9, or changing an unrelated cell if automatic calculation is on. For a workbook with more than a handful of these formulas, that can mean dozens of outbound requests you didn't explicitly ask for, which is worth knowing before you scale the pattern up or share the file with someone else.

**6. Treat this as a bridge, not a destination.** The moment you need more than one or two live values, want error handling that doesn't fail silently, or need the data to persist after the API is unreachable, that's the signal to move the same logic into Power Query's `Web.Contents` and `Json.Document` — which handle JSON natively, refresh on a schedule, and don't recalculate on every keystroke.

`WEBSERVICE` and `FILTERXML` also require the workbook to have internet access and won't work in Excel Online in all contexts, so confirm the environment before building something a colleague can't refresh on their own machine.
