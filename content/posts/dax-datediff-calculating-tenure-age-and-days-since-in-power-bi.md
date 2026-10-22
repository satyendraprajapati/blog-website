---
title: "DAX DATEDIFF: Calculating Tenure, Age, and Days-Since Metrics in Power BI"
date: "2026-10-22"
tags: ["power-bi", "dax", "data-analysis"]
excerpt: "DATEDIFF turns two date columns into a clean duration measure -- customer tenure, days since last order, time to ship -- without a subtraction and a manual unit conversion."
---

A lot of "how long" questions in a report boil down to two dates and a unit: how long has this customer been active, how many days since their last order, how many hours did a ticket sit open. The instinct is to subtract one date from another and divide by some constant, which works but forces you to remember whether you're dividing by 1, 7, or 365.25. `DATEDIFF` does the unit conversion for you.

**1. The basic shape takes a start date, an end date, and an interval.** The interval argument is an unquoted keyword — `SECOND`, `MINUTE`, `HOUR`, `DAY`, `WEEK`, `MONTH`, or `YEAR` — so the same two dates can answer different questions just by swapping that last argument.
```dax
Customer Tenure (Days) =
DATEDIFF(
    MIN( Customers[SignupDate] ),
    TODAY(),
    DAY
)
```
Swap `DAY` for `MONTH` or `YEAR` and the same measure reports tenure in whichever unit actually makes sense for the visual it's feeding.

**2. It counts calendar boundaries crossed, not full elapsed units — and that trips people up.** `DATEDIFF` between December 31 and January 1 with `YEAR` as the interval returns `1`, even though barely a day has passed, because it counts how many year boundaries were crossed, not how many full 365-day periods elapsed. For most tenure and age calculations this is exactly the behavior you want; it's worth testing against a known pair of dates once so the behavior isn't a surprise later in a measure that matters.

**3. Build a "days since last order" measure per customer.** This is the pattern that shows up most often on a churn or engagement dashboard — a negative-feeling number that gets bigger the longer a customer goes quiet:
```dax
Days Since Last Order =
VAR LastOrderDate =
    CALCULATE( MAX( Orders[OrderDate] ) )
RETURN
    DATEDIFF( LastOrderDate, TODAY(), DAY )
```
Because `LastOrderDate` respects whatever filter context the visual is in, this works correctly whether it's sitting in a single-customer card or a table listing every customer at once.

**4. Bucket the result into a tier instead of showing a raw day count.** A bare number like "247 days" rarely tells a viewer what to do with it; wrapping the same `DATEDIFF` result in `SWITCH` turns it into something a status column or conditional format can key off of:
```dax
Engagement Status =
VAR DaysSince = [Days Since Last Order]
RETURN
    SWITCH(
        TRUE(),
        DaysSince <= 30, "Active",
        DaysSince <= 90, "At Risk",
        "Churned"
    )
```

**5. Use it for operational durations too, not just customer-facing ones.** `DATEDIFF` works equally well on two timestamp columns on the same fact table — order date to ship date, ticket opened to ticket closed — which is a different shape of question than a comparison to `TODAY()`:
```dax
Time To Ship (Days) =
AVERAGEX(
    Orders,
    DATEDIFF( Orders[OrderDate], Orders[ShipDate], DAY )
)
```
Wrapping it in `AVERAGEX` gives you the average fulfillment time across every row in context, rather than a single duration for one order.

**6. Don't reach for it when you need a shifted date, not a difference.** `DATEDIFF` answers "how far apart are these two dates," which is a different question from "what date is 30 days before this one" — that's `DATEADD` or plain date arithmetic instead. Mixing the two up is the most common misuse: `DATEDIFF` returns a number, not a date, so it can't be plugged into a filter that expects an actual date value.

Once it's in the toolbox, `DATEDIFF` quietly replaces a surprising number of "subtract and divide" measures that were technically working but doing the unit math by hand every time.
