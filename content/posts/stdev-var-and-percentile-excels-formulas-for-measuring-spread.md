---
title: "STDEV, VAR, and PERCENTILE: Excel's Formulas for Measuring Spread"
date: "2026-08-29"
tags: ["excel", "statistics", "formulas"]
excerpt: "How to quantify variability and position within a distribution using STDEV.S, VAR.S, and PERCENTILE, and use them to flag outliers with a formula instead of eyeballing a chart."
---

An average tells you the center of a dataset, but it says nothing about how spread out the values are. Two regions can both average $50,000 in monthly sales while one bounces between $20,000 and $80,000 and the other stays within a few thousand dollars every month — a very different story for anyone planning around that number. These three functions cover most of what you need to measure and use that spread.

**1. `STDEV.S`** — the standard deviation of a *sample*, which is the version you almost always want for real analysis work (use `STDEV.P` only when your data genuinely is the entire population, not a sample of it). It measures the typical distance of a value from the mean, in the same units as the data.
```excel
=STDEV.S(Sales[MonthlyRevenue])
```

**2. `VAR.S`** — the variance, which is standard deviation before the square root is taken. You'll rarely report variance directly since it's in squared units and hard to interpret, but it's worth knowing it's the same calculation underneath — some downstream statistical work (like ANOVA-style comparisons) is built on variance rather than standard deviation.
```excel
=VAR.S(Sales[MonthlyRevenue])
```

**3. `PERCENTILE.INC`** — returns the value below which a given percentage of the data falls. `PERCENTILE.INC(range, 0.9)` finds the value at the 90th percentile — useful for answering "what does a top-10% month actually look like?" rather than just "what's the average."
```excel
=PERCENTILE.INC(Sales[MonthlyRevenue], 0.9)
```

**4. `QUARTILE.INC`** — a shortcut for the common percentiles: `QUARTILE.INC(range, 1)` is the same as the 25th percentile, `QUARTILE.INC(range, 3)` is the 75th. The gap between those two (the interquartile range, or IQR) is a sturdier measure of spread than standard deviation when your data has a few extreme outliers dragging the mean around.
```excel
=QUARTILE.INC(Sales[MonthlyRevenue], 3) - QUARTILE.INC(Sales[MonthlyRevenue], 1)
```

**5. Combine them into a formula-driven outlier flag.** A common analyst pattern is flagging any value more than 1.5 IQRs beyond the quartiles — the same rule a box-and-whisker chart uses to decide which points to draw as separate dots. Instead of just glancing at a chart, you can build the flag as a column so it can feed a filter, a conditional format, or a downstream report:
```excel
=IF(
    OR(
        B2 > QUARTILE.INC($B$2:$B$100, 3) + 1.5 * (QUARTILE.INC($B$2:$B$100, 3) - QUARTILE.INC($B$2:$B$100, 1)),
        B2 < QUARTILE.INC($B$2:$B$100, 1) - 1.5 * (QUARTILE.INC($B$2:$B$100, 3) - QUARTILE.INC($B$2:$B$100, 1))
    ),
    "Outlier",
    "Normal"
)
```

**6. Use standard deviation to build a z-score when you need to compare across different scales.** A value's z-score — `(value - mean) / STDEV.S(range)` — tells you how many standard deviations it sits from the average, which lets you compare, say, a sales rep's performance against a target metric on a completely different scale without converting units by hand.

None of this replaces a chart — a histogram or box plot is still the fastest way to *see* a distribution. But when you need that spread to drive a filter, a flag, or a threshold in a formula rather than just a picture, these functions are what make it possible.
