---
title: "Fuzzy Matching in Power Query: Merging Tables When the Keys Don't Match Exactly"
date: "2026-09-21"
tags: ["excel", "power-query", "data-cleaning"]
excerpt: "An exact Merge Queries join fails the moment two systems spell the same customer or product differently — Power Query's Fuzzy Matching option joins on similarity instead of an identical string."
---

A normal Power Query merge needs both tables to agree on the join key character for character. That works fine when both sides come from the same system, but the moment you're merging a CRM export against an accounting export, "Acme Corp." and "ACME Corporation" are the same customer to a human and two unrelated rows to an exact-match join. Fuzzy Matching is the Merge Queries option built for exactly that gap.

**1. Turn it on in the Merge dialog, not after the fact.** Run `Home > Merge Queries` as usual, pick your two tables and the columns to match on, then tick "Use fuzzy matching to perform the merge" at the bottom of the dialog before you click OK. It isn't a separate step you bolt on afterward — it changes how the join itself evaluates a match.

**2. Set the similarity threshold instead of trusting the 0.80 default.** Expand "Fuzzy matching options" and adjust the similarity threshold between 0 (match almost anything) and 1 (exact match only). For short strings like product codes, push it closer to 0.9 so you don't start pairing unrelated rows; for messier free-text fields like company names, 0.7–0.8 usually catches real variants without over-matching.

**3. Cap the number of matches per row.** "Maximum number of matches" defaults to unlimited, which can silently fan one row on the left into several rows on the right when a name is generic. Setting it to 1 forces Power Query to keep only its single best match per row, which is almost always what you want for a lookup-style merge.

**4. Add a Transformation Table to fix known aliases directly.** If you already know "IBM" and "International Business Machines" should always match, build a small two-column reference query (`From`, `To`) and point "Transformation Table" at it in the fuzzy matching options. Power Query applies those substitutions before scoring similarity, which is more reliable than hoping the similarity algorithm figures out an abbreviation on its own.

```m
let
    Source = Excel.CurrentWorkbook(){[Name="CRMCustomers"]}[Content],
    Accounting = Excel.CurrentWorkbook(){[Name="AccountingCustomers"]}[Content],
    FuzzyMerged = Table.FuzzyNestedJoin(
        Source, {"CustomerName"},
        Accounting, {"CustomerName"},
        "Matched", JoinKind.LeftOuter,
        [IgnoreCase = true, Threshold = 0.75, MaxNumberOfMatches = 1]
    )
in
    FuzzyMerged
```

**5. Always add a similarity score column before trusting the results.** Fuzzy matches aren't guaranteed correct, so review them before they feed a report. Expand the matched table and keep the generated similarity score alongside the joined columns, at least while you're validating — it's the fastest way to spot the one match at 0.71 that's actually wrong, versus the twenty at 0.95 that clearly aren't.

**6. Sort by score and skim the low end, not the whole table.** You don't need to eyeball every row — sort ascending by the similarity score and check the bottom 10–20% first. That's where false matches cluster; the high-scoring rows near 1.0 are rarely worth a manual review.

**7. Once it's tuned, let it refresh like any other query.** A fuzzy merge is still a query step, so `Data > Refresh All` re-runs it against next month's export with the same threshold and transformation table applied — no re-eyeballing a new batch of near-duplicate names by hand.

Fuzzy matching won't replace a real customer master or a proper deduplication process, but for the one-off "these two exports need to talk to each other and neither side owns a shared ID" problem, it turns a manual reconciliation into a tunable, refreshable step.
