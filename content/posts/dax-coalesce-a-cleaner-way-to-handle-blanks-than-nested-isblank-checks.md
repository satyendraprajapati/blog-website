---
title: "DAX COALESCE: A Cleaner Way to Handle Blanks Than Nested ISBLANK Checks"
date: "2026-10-04"
tags: ["power-bi", "dax", "beginner"]
excerpt: "COALESCE returns the first non-blank value from a list of expressions, replacing a wall of nested IF(ISBLANK()) checks with one readable function."
---

A measure that needs to fall back from one value to another when the first one is blank usually ends up as a nested `IF(ISBLANK(...), ..., ...)` — readable enough with one fallback, unreadable by the third. `COALESCE` does the same job in one line, and it's worth knowing even though it rarely shows up in a Quick Measure.

**1. `COALESCE` returns the first non-blank value from a list, left to right.** Pass it as many expressions as you want; it evaluates them in order and returns the first one that isn't blank, or blank if every argument is.
```dax
Preferred Price = 
COALESCE(
    [Negotiated Price],
    [List Price],
    0
)
```
If a negotiated price exists for a customer, it wins. If not, fall back to the list price. If neither exists, show zero instead of a blank card.

**2. It isn't the same as `IFERROR`.** `IFERROR` catches actual calculation errors like division by zero — `COALESCE` only cares whether a value is blank. A measure can return a perfectly valid blank (no rows matched a filter) without ever throwing an error, and that's exactly the case `COALESCE` is built for.

**3. It reads better than the IF/ISBLANK version once you have more than two fallbacks.** Compare the measure above to its nested equivalent:
```dax
Preferred Price = 
IF(
    NOT ISBLANK([Negotiated Price]),
    [Negotiated Price],
    IF(
        NOT ISBLANK([List Price]),
        [List Price],
        0
    )
)
```
Same result, but every added fallback nests the formula one level deeper. `COALESCE` stays a flat list no matter how many fallbacks you add.

**4. It's useful on report titles and labels, not just numeric measures.** Swap in text expressions and it works the same way — showing a customer's preferred display name, then falling back to their account ID, then to a literal "Unknown":
```dax
Display Name = 
COALESCE(
    SELECTEDVALUE(Customers[Preferred Name]),
    SELECTEDVALUE(Customers[Account ID]),
    "Unknown"
)
```

**5. It still respects filter context like any other measure expression.** Each argument is evaluated in whatever context the measure is called in, so a `COALESCE` inside a measure that uses `CALCULATE` or sits on a filtered visual behaves exactly as you'd expect — there's no special scoping to learn beyond DAX's usual filter context rules.

The function has been in DAX for a while, but it tends to get overlooked because most tutorials jump straight to `IF` and `SWITCH` for conditional logic. For the specific case of "use this value, unless it's blank, then try the next one," `COALESCE` is the more direct tool.
