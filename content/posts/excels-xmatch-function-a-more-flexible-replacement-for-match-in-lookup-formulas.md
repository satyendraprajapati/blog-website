---
title: "Excel's XMATCH Function: A More Flexible Replacement for MATCH in Lookup Formulas"
date: "2026-10-15"
tags: ["excel", "formulas", "lookup"]
excerpt: "XMATCH modernizes MATCH with search-direction, wildcard, and binary-search options that make INDEX/XMATCH formulas more flexible than classic INDEX/MATCH."
---

`MATCH` has quietly powered `INDEX/MATCH` lookups for decades, but it only ever gave you an exact or approximate match with a confusing `1`/`0`/`-1` argument. `XMATCH` replaces it with clearer, more capable options — and it's worth knowing even if you've never had a reason to touch plain `MATCH`.

**1. XMATCH returns a position, not a value — same job as MATCH, paired with INDEX.** It finds where something sits in a range so `INDEX` can pull the value at that position. The difference shows up in everything after this first step.
```excel
=INDEX(Sales[Revenue], XMATCH("West", Sales[Region]))
```

**2. The `match_mode` argument replaces MATCH's cryptic 1/0/-1 with named behavior.** `0` is exact (the default), `-1` is exact-or-next-smaller, `1` is exact-or-next-larger, and `2` turns on wildcard matching with `*` and `?` — no separate wildcard setup required.
```excel
=XMATCH("Reg*", Sales[Region], 2)
```

**3. The `search_mode` argument lets you search from the bottom up.** Passing `-1` searches last-to-first, which is the easiest way to find the most recent matching row in a log or transaction list without sorting the data first.
```excel
=XMATCH("Closed", Tickets[Status], 0, -1)
```

**4. Two XMATCH calls inside one INDEX give you a two-way, row-and-column lookup.** This is the matrix equivalent of what `XLOOKUP` does in one dimension — useful for a grid where you need to match a row label and a column header at the same time.
```excel
=INDEX(DataGrid, XMATCH(RowLabel, RowHeaders), XMATCH(ColLabel, ColHeaders))
```

**5. Binary search modes (`2` and `-2`) speed up lookups on large, sorted ranges.** If a table is already sorted ascending or descending on the lookup column, these search modes skip the linear scan `MATCH` always did, which is noticeable on tables with tens of thousands of rows.
```excel
=XMATCH(12500, SortedAmounts, 0, 2)
```

**6. Wrap it in IFNA, not IFERROR, so a genuine formula mistake doesn't get silently swallowed.** A missing match returns `#N/A`, which is the one error `XMATCH` is expected to produce — `IFNA` catches exactly that case and lets any other error (a bad range reference, for example) still surface and get noticed.
```excel
=IFNA(INDEX(Sales[Revenue], XMATCH("West", Sales[Region])), "No match")
```

If you already have `INDEX/MATCH` formulas working fine, there's no urgency to rewrite them. But for new lookups — especially ones involving a wildcard search, a "most recent match," or a two-way grid — `XMATCH` does in one function call what used to take a nested workaround or an extra helper column.
