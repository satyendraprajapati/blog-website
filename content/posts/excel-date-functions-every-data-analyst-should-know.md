---
title: "Excel Date Functions Every Data Analyst Should Know"
date: "2026-07-21"
tags: ["excel", "dates", "beginner"]
excerpt: "EOMONTH, NETWORKDAYS, DATEDIF, and other date functions that make building weekly and monthly reports far less painful."
---

Dates show up in almost every dataset an analyst touches, but the built-in date functions rarely get the same attention as `XLOOKUP` or `SUMIFS`. That's a mistake — a lot of the manual fiddling that goes into weekly and monthly reports (finding month-end, counting business days, bucketing by week) has a one-formula fix.

**1. `EOMONTH`** — returns the last day of a month, a fixed number of months from a starting date. It's the fastest way to normalize a date to "month" for grouping, or to calculate a report's period-end.
```excel
=EOMONTH(A2, 0)
```
Using `-1` instead of `0` gives you last month's end; `1` gives you next month's.

**2. `EDATE`** — shifts a date forward or backward by a number of months, without the "last day of month" behavior of `EOMONTH`. Useful for things like "contract renewal date" or "one year from signup."
```excel
=EDATE(A2, 12)
```

**3. `NETWORKDAYS`** — counts working days between two dates, excluding weekends and, optionally, a holiday list. This is the function behind most "how many business days until deadline" or SLA calculations.
```excel
=NETWORKDAYS(A2, B2, HolidayList)
```

**4. `DATEDIF`** — calculates the difference between two dates in years, months, or days. It's an undocumented function (it won't show up in Excel's formula autocomplete), but it's still fully supported and it's the cleanest way to compute someone's tenure or a customer's account age.
```excel
=DATEDIF(A2, TODAY(), "y") & " years, " & DATEDIF(A2, TODAY(), "ym") & " months"
```

**5. `WEEKNUM`** — returns which week of the year a date falls in, which makes it easy to group daily data into weekly buckets for a pivot table or chart without adding a helper column full of manual week labels.
```excel
=WEEKNUM(A2, 2)
```
The second argument controls which day the week starts on — `2` sets it to Monday, which matches how most business reporting weeks are defined.

A pattern worth internalizing: none of these replace `TODAY()` or `NOW()`, they build on top of them. A report header like `="Report as of " & TEXT(TODAY(), "mmmm d, yyyy")` combined with `EOMONTH` for period boundaries covers most of what a recurring report needs without touching a single hardcoded date.
