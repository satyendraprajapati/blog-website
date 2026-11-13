---
title: "Excel's WORKDAY and WORKDAY.INTL: Calculating Deadlines and Custom Weekend Schedules"
date: "2026-11-13"
tags: ["excel", "formulas", "dates", "beginner"]
excerpt: "NETWORKDAYS counts the business days between two dates — WORKDAY does the opposite, projecting a deadline forward or backward from a start date while skipping weekends and holidays."
---

A lot of date work in Excel boils down to one of two questions: "how many working days are between these two dates?" or "what date lands exactly N working days from now?" The first is `NETWORKDAYS`. The second — the one that actually sets a deadline — is `WORKDAY`, and it's worth knowing on its own.

**1. `WORKDAY` adds (or subtracts) working days to a start date.** Give it a start date and a number of days, and it returns the resulting date, automatically skipping Saturdays and Sundays.
```excel
=WORKDAY(A2, 10)
```
If `A2` is a Thursday, this doesn't land 10 calendar days later — it counts forward 10 weekdays, quietly stepping over both weekends in between. That makes it the right function for "10 business days from the order date" style SLAs, where a naive `A2 + 10` would overstate how much runway you actually have.

**2. A negative number counts backward instead.** This is the half of `WORKDAY` people forget about — it's just as useful for "what's the latest we could have started this to hit today's deadline" as it is for projecting forward.
```excel
=WORKDAY(A2, -5)
```

**3. Feed it a holiday list and it skips those too.** The third, optional argument takes a range of dates to exclude in addition to weekends — a small table of company holidays sitting elsewhere in the workbook.
```excel
=WORKDAY(A2, 10, HolidayList)
```
Without this argument, `WORKDAY` only knows about Saturday and Sunday — a deadline calculation that ignores a public holiday will quietly be off by a day, which is the most common reason this formula "doesn't match" someone's calendar.

**4. `WORKDAY.INTL` handles weekends that aren't Saturday/Sunday.** Plenty of regions and industries run on a different week — retail analysts dealing with a Friday/Saturday weekend, or a team that works a six-day week with only Sunday off. `WORKDAY.INTL` takes a weekend code as its third argument instead of assuming the standard one.
```excel
=WORKDAY.INTL(A2, 10, 7, HolidayList)
```
Here, `7` means "Friday and Saturday are the weekend" — Excel has a fixed list of codes for common weekend patterns (1 through 7 for standard combinations), or you can pass a seven-character string of 1s and 0s to mark any custom pattern of working/non-working days.

**5. Pair it with `NETWORKDAYS.INTL` so both directions use the same weekend definition.** If a deadline calculation uses `WORKDAY.INTL` with weekend code `7`, any related "how many working days have passed" measure elsewhere in the same report should use `NETWORKDAYS.INTL` with the matching code — otherwise the two numbers quietly disagree about which days count as working days in the first place.

**6. Building a due-date column is usually a one-line fix once you know this exists.** A common pattern in a project tracker is a `Start Date` column and an `SLA (Business Days)` column, with a `Due Date` column that most people build with plain addition and then manually nudge whenever it lands on a weekend:
```excel
=WORKDAY(StartDate, SLADays, HolidayList)
```
Replacing the manual nudging with this one formula means the due date is correct the moment the start date or SLA changes, with no follow-up adjustment required.

Once you've set up a holiday table once, `WORKDAY` and `WORKDAY.INTL` turn "what's the deadline" from a mental calendar exercise into a formula that's correct by construction — including the weekends and holidays everyone forgets to account for when they do it by hand.
