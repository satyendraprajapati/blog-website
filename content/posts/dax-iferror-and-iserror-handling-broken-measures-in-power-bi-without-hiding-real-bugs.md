---
title: "DAX IFERROR and ISERROR: Handling Broken Measures in Power BI Without Hiding Real Bugs"
date: "2026-11-18"
tags: ["power-bi", "dax", "beginner"]
excerpt: "When IFERROR and ISERROR are the right tool for a DAX measure, and when they just paper over a modeling mistake you should fix instead."
---

`DIVIDE()` handles division-by-zero cleanly, but plenty of other DAX errors have nothing to do with division — a `VALUE()` conversion on a text column with a stray space, a `RELATED()` call across a relationship that doesn't exist for every row, a `SEARCH()` that doesn't find its substring. `IFERROR` and `ISERROR` are the general-purpose tools for those, and they're worth understanding precisely because it's just as easy to misuse them as to use them well.

**1. `IFERROR` wraps an expression and substitutes a result** — it evaluates the expression, and only if that evaluation errors does it return the fallback instead:

```dax
Parsed Order Value =
IFERROR ( VALUE ( Orders[OrderValueText] ), BLANK () )
```

Rows where `OrderValueText` is clean text like `"1,204.50"` parse fine; rows with something unexpected (a currency symbol, a typo) fall back to blank instead of breaking the whole visual.

**2. `ISERROR` checks without consuming the result, which lets you branch** — use it inside `IF` when you want different behavior depending on whether something errored, rather than a single substitute value:

```dax
Flag Bad Rows =
IF (
    ISERROR ( VALUE ( Orders[OrderValueText] ) ),
    "Needs Cleanup",
    "OK"
)
```

That's the pattern for a data-quality column that surfaces the problem instead of quietly hiding it.

**3. Don't use either one to mask a relationship problem** — if `RELATED()` is erroring because a relationship is missing or inactive, `IFERROR` will make the measure stop crashing, but every row that should have matched will now silently show the fallback value forever. That's a modeling bug, not an error-handling situation — fix the relationship (or use `USERELATIONSHIP` if it's inactive on purpose) rather than wrapping the call.

**4. Prefer `DIVIDE` over `IFERROR` for actual division** — `IFERROR ( [Profit] / [Revenue], 0 )` evaluates the division first and catches the error after the fact, which is both slower and less precise than `DIVIDE ( [Profit], [Revenue], 0 )`, which checks the denominator before dividing. Reach for `IFERROR` when the risky operation isn't a division at all.

**5. Narrow what you wrap, not the whole measure** — wrapping one risky sub-expression in `IFERROR` is far easier to debug than wrapping an entire ten-line measure, where any one of several operations could be the actual source of the error:

```dax
Safe Growth % =
VAR Current = [Total Revenue]
VAR Prior = [Prior Period Revenue]
VAR Growth = IFERROR ( DIVIDE ( Current - Prior, Prior ), BLANK () )
RETURN
    Growth
```

Here only the growth calculation is guarded, so if some other part of the measure later breaks, the error still surfaces instead of getting absorbed by a catch-all wrapper two lines away.

**6. Use it during development, then reconsider before shipping** — `IFERROR` is genuinely useful while you're still building a model and don't want one bad row to block testing everything else. Before a report goes to stakeholders, it's worth revisiting each `IFERROR` and asking whether the underlying data issue it's catching should actually be fixed upstream in Power Query, rather than quietly absorbed every time the report refreshes.

Treat `IFERROR`/`ISERROR` as a scalpel for genuinely unpredictable inputs — malformed text, inconsistent source data — not as a general-purpose bandage for measures that error because the model underneath them has a gap.
