---
title: "MEDIAN, MODE, and TRIMMEAN: Excel's Other Measures of Central Tendency (Beyond AVERAGE)"
date: "2026-10-07"
tags: ["excel", "statistics", "data-analysis"]
excerpt: "AVERAGE isn't always the right summary number — when to reach for MEDIAN, MODE, or TRIMMEAN instead, and what each one protects you from."
---

`AVERAGE` is almost always the first formula an analyst reaches for when summarizing a column of numbers, and most of the time it's fine. But a single outlier — one enormous invoice, one data-entry typo with an extra zero — can drag an average far enough from "typical" that it quietly misleads whoever reads the report. Excel has three other functions built for exactly that problem, and knowing when to swap in each one is a small change that makes a summary number actually trustworthy.

**1. `MEDIAN`** — the middle value once everything is sorted, completely unmoved by how extreme the outliers on either side are. If nine employees earn around $60k and one executive earns $900k, the average salary looks wildly misleading while the median stays close to what a "typical" employee actually earns.
```excel
=MEDIAN(Salaries[Annual])
```

**2. `MODE.SNGL`** — the single most frequently occurring value, useful when you care about the most common outcome rather than a mathematical center. "What's the most common order size?" or "what shoe size sells the most?" are MODE questions, not AVERAGE or MEDIAN ones — a bimodal product line (lots of size 8s and size 11s, few in between) would give you an average in the middle that nobody actually buys.
```excel
=MODE.SNGL(Orders[Quantity])
```

**3. `MODE.MULT`** — returns every value tied for most frequent, as a dynamic array, for the cases where `MODE.SNGL` only shows you one of several equally common values and you'd otherwise miss the rest.
```excel
=MODE.MULT(Orders[Quantity])
```

**4. `TRIMMEAN`** — an average calculated after excluding a percentage of the highest and lowest values, which gives you outlier protection without going all the way to a median. It's the right call when a few genuine extreme values should be excluded from the summary, but you still want an average-style number rather than a middle value — judging scores, delivery times, or survey ratings where a couple of bad-faith or erroneous entries shouldn't swing the whole metric.
```excel
=TRIMMEAN(Scores[Rating], 0.2)
```
The second argument is the total fraction trimmed, split evenly between both ends — `0.2` here removes the top 10% and bottom 10% before averaging what's left.

**5. Check `MEDIAN` vs. `AVERAGE` side by side before reporting either one alone.** A quick habit that catches a lot of misleading reports: put both formulas next to each other on a dataset before deciding what to present. If they're close, the data is roughly symmetric and `AVERAGE` is fine. If they're far apart, that gap itself is worth mentioning — it's telling you the distribution is skewed, which is often as important a finding as the number itself.
```excel
=AVERAGE(Sales[DealSize])
=MEDIAN(Sales[DealSize])
```

**6. Don't reach for `TRIMMEAN` as a default — use it deliberately.** Trimming data before averaging is a judgment call about what counts as noise versus a signal worth keeping, and it should be a conscious choice stated in the report ("averages exclude the top/bottom 10% of entries"), not a silent adjustment buried in a formula nobody else sees.

None of these replace `AVERAGE` outright — they're there for the specific moment a dataset has a shape `AVERAGE` isn't built to describe. Glancing at `MEDIAN` next to `AVERAGE` before you ship a number is the cheapest way to catch that moment.
