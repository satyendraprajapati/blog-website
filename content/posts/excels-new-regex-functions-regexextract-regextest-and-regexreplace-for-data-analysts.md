---
title: "Excel's New REGEX Functions: REGEXEXTRACT, REGEXTEST, and REGEXREPLACE for Data Analysts"
date: "2026-11-11"
tags: ["excel", "regex", "text-functions", "data-cleaning"]
excerpt: "Excel's three new REGEX functions pull, test, and replace patterns inside text in one formula, where TRIM/SUBSTITUTE/TEXTSPLIT combos used to need several."
---

Messy text columns — order numbers buried in a comments field, inconsistent phone formats, free-text entries that should have been a dropdown — used to mean stacking `TRIM`, `SUBSTITUTE`, `FIND`, and `TEXTSPLIT` into something barely readable. Excel for Microsoft 365 now ships three regular-expression functions that do the pattern matching directly, in one formula.

**1. `REGEXTEST` answers a yes/no question about a pattern.** It returns `TRUE` or `FALSE` depending on whether any part of the text matches, which makes it a clean building block for a validation column or a conditional-formatting rule.
```excel
=REGEXTEST(A2, "^\d{3}-\d{3}-\d{4}$")
```
That formula flags whether a phone number is formatted exactly as `555-123-4567`, without a single `LEN` or `MID` in sight.

**2. `REGEXEXTRACT` pulls the matching substring out of a larger block of text.** This is the one that replaces the worst `MID`/`FIND` chains — give it a pattern for "the thing you actually want," and it ignores everything around it.
```excel
=REGEXEXTRACT(A2, "ORD-\d{5}")
```
Run against a free-text note like `"Customer called re: ORD-48213, requesting refund"`, that returns `ORD-48213` and nothing else.

**3. Add a capture group when you only want part of the match.** Wrapping part of the pattern in parentheses and passing `"captureGroup"` as the third argument returns just that inner piece, not the whole matched string.
```excel
=REGEXEXTRACT(A2, "ORD-(\d{5})", "captureGroup")
```
That version returns `48213` on its own — useful when the order number needs to go into a numeric lookup rather than stay text with a prefix.

**4. Ask for every match, not just the first, with `"all"`.** By default `REGEXEXTRACT` returns the first match it finds. Passing `"all"` instead returns a spilled array of every match in the cell, which is the difference between catching one SKU in a comma-separated list and catching all of them.
```excel
=REGEXEXTRACT(A2, "[A-Z]{2}\d{4}", "all")
```

**5. `REGEXREPLACE` does pattern-based find-and-replace, which `SUBSTITUTE` can't.** `SUBSTITUTE` only matches literal text; `REGEXREPLACE` matches a shape of text, so it can standardize every variant of a messy format in one pass.
```excel
=REGEXREPLACE(A2, "[^0-9]", "")
```
That strips every non-digit character — dashes, spaces, parentheses — out of a phone number column regardless of which inconsistent format each row originally used.

**6. Wrap `REGEXEXTRACT` in `IFERROR`, not `IFNA`.** A pattern with no match doesn't return Excel's usual `#N/A` — it returns `#VALUE!` — so a formula built the same way as an `XLOOKUP` guard needs a different error type caught:
```excel
=IFERROR(REGEXEXTRACT(A2, "ORD-\d{5}"), "No order number found")
```

**7. Check availability before you build a report that depends on it.** All three functions are rolling out to Excel for Microsoft 365 (desktop and web) on a current channel — they're not in Excel 2021/2019 or older perpetual-license installs. If a workbook has to open correctly on a colleague's older Excel, keep a non-regex fallback formula or do the cleanup once in Power Query instead.

For the specific case of "find a pattern buried in unstructured text," these three functions are worth learning even if regex syntax itself still takes some getting used to — a single `REGEXEXTRACT` formula now does what used to take a small paragraph of nested text functions.
