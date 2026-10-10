---
title: "Building a Loan Amortization Schedule in Excel with PMT, IPMT, and PPMT"
date: "2026-10-10"
tags: ["excel", "finance", "formulas"]
excerpt: "How to break a fixed loan payment into its interest and principal components row by row, instead of just knowing the total payment."
---

`PMT` tells you the fixed payment on a loan, but it collapses interest and principal into one number — which is fine for a quick "can we afford this" check, and useless the moment someone asks how much of the balance is actually paid down after 18 months. An amortization schedule answers that by breaking every payment apart, period by period, and Excel has three functions built specifically for it.

**1. Start with the loan's fixed inputs in their own cells.** Rate, number of periods, and loan amount drive every row of the schedule, so they belong in named cells you reference once rather than retyped into every formula:
```excel
Rate:     =5%/12       (B1, monthly rate on a 5% annual loan)
Periods:  =36           (B2, 36 monthly payments)
Amount:   =20000         (B3, principal borrowed)
```

**2. `IPMT` returns the interest portion of a specific payment.** Given the same rate, amount, and period count as `PMT`, it also takes a period number — this is the piece that doesn't show up anywhere in a flat `PMT` calculation:
```excel
=IPMT(B1, 1, B2, -B3)
```
Period 1 of a 36-month loan has the highest interest charge of the whole schedule, since interest is calculated on the full remaining balance.

**3. `PPMT` returns the principal portion of the same payment, and the two always add up to `PMT`.** Same arguments, same period:
```excel
=PPMT(B1, 1, B2, -B3)
```
`IPMT(rate, 1, nper, pv) + PPMT(rate, 1, nper, pv)` equals `PMT(rate, nper, pv)` exactly — a quick way to sanity-check you've entered the arguments consistently before building out 36 rows of them.

**4. Build the schedule as a row-per-period table, not a single formula.** Put period numbers 1 through 36 down a column, then `IPMT` and `PPMT` referencing that row's period number, plus a running balance column that subtracts each row's principal from the previous row's balance:
```excel
=D5-C5   (Balance = previous balance - this row's principal)
```
This is the table a stakeholder actually wants when they ask "how much do we still owe after year one" — not the single payment figure.

**5. Lock the fixed inputs with absolute references when you fill the formula down.** `IPMT($B$1, A6, $B$2, -$B$3)` keeps rate, period count, and amount pinned to their source cells while the period number in column A changes row to row — forgetting the dollar signs here is the single most common reason an amortization table's numbers drift as you drag the formula down.

**6. Check two totals once the table is built.** The sum of the principal column should equal the original loan amount, and the sum of interest plus principal across every row should equal `PMT` times the number of periods. If either total is off, it's almost always a sign the rate or period count isn't matched to the payment frequency — a 5% *annual* rate needs to be divided by 12 before it goes into a *monthly* schedule.

None of this replaces a bank's official amortization statement for a real loan, but for modeling a lease, an equipment purchase, or a "what if we financed this instead of paying cash" question, it turns one flat payment number into the period-by-period breakdown that actually answers the follow-up questions.
