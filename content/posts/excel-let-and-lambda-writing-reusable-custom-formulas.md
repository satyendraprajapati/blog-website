---
title: "Excel LET and LAMBDA: Writing Reusable Custom Formulas"
date: "2026-07-22"
tags: ["excel", "formulas", "beginner"]
excerpt: "How LET and LAMBDA let you name intermediate steps and build your own reusable Excel functions, instead of repeating the same logic across a sheet."
---

Most Excel formulas get harder to read as they grow, because the same sub-expression ends up repeated three or four times inside one cell. `LET` and `LAMBDA` fix that in two different ways — one names values inside a single formula, the other lets you package a formula up and reuse it like a built-in function.

**1. `LET` names a value so you stop repeating yourself.** A formula that computes a discounted price might reference the same "base price" expression twice — once to calculate the discount, once to subtract it. `LET` lets you compute it once, give it a name, and reference that name for the rest of the formula.
```excel
=LET(base, XLOOKUP(A2, Products[SKU], Products[Price]),
     discount, base * 0.1,
     base - discount)
```
Beyond avoiding repetition, this makes a long formula genuinely easier to read — `base` and `discount` explain what each piece is doing in a way that nested formula references never do.

**2. `LET` also makes a formula faster.** Every time you repeat an expression like a full `XLOOKUP` inside one formula, Excel recalculates it separately. Naming it once with `LET` means it's evaluated a single time and reused, which matters on a large sheet with formulas that reference big tables.

**3. `LAMBDA` turns a formula into a function you can call by name.** `LAMBDA` takes one or more parameters and an expression, and returns a reusable custom function — the same idea as writing a function in any programming language, but inside a cell.
```excel
=LAMBDA(price, tax_rate, price * (1 + tax_rate))
```
On its own this just returns a function definition, not a value — you'd wrap it in parentheses and call it with arguments to test it: `=LAMBDA(price, tax_rate, price * (1 + tax_rate))(100, 0.08)`.

**4. Name it once with Name Manager to use it like a real formula everywhere.** Go to *Formulas → Name Manager → New*, give it a name like `PriceWithTax`, and paste the `LAMBDA` into the "Refers to" box. From then on, any cell in the workbook can call `=PriceWithTax(A2, 0.08)` exactly like a built-in function such as `SUMIFS`.

**5. Combine `LET` and `LAMBDA` for a readable custom function.** A named `LAMBDA` can use `LET` internally to name its own intermediate steps, which keeps even a fairly involved calculation — like a weighted average that needs to guard against a zero-weight total — readable instead of a single dense line.
```excel
=LAMBDA(values, weights,
    LET(total_weight, SUM(weights),
        IF(total_weight = 0, 0, SUMPRODUCT(values, weights) / total_weight)
    )
)
```

**6. Use this when a helper column feels like overkill but the formula is getting unreadable.** Not every calculation needs a named `LAMBDA` — a one-off formula used in a single cell is often fine as-is. Reach for it when you catch yourself copy-pasting the same multi-step formula logic across several sheets or workbooks; at that point a named function is easier to maintain than keeping every copy in sync by hand.

The mental shift is the same one `XLOOKUP` and `FILTER` represent: instead of building a calculation once and copying it wherever you need it again, you define it once and call it by name — so a fix or an improvement only has to happen in one place.
