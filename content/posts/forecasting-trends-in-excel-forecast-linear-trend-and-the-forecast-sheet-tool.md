---
title: "Forecasting Trends in Excel: FORECAST.LINEAR, TREND, and the Forecast Sheet Tool"
date: "2026-07-28"
tags: ["excel", "forecasting", "data-analysis"]
excerpt: "How to project next month's numbers from historical data using Excel's built-in forecasting functions and the one-click Forecast Sheet tool."
---

"What do we expect next quarter?" comes up in almost every analyst's inbox, and Excel has more than enough built in to answer it without a separate stats tool. Here's how to go from a column of historical numbers to a defensible projection.

**1. `FORECAST.LINEAR`** — fits a straight line through your historical data and extends it to a future point. It's the fastest way to answer "if this trend continues, what's next month's number?"
```excel
=FORECAST.LINEAR(DATE(2026,8,1), Sales[Revenue], Sales[Month])
```
This works well for data with a steady upward or downward trend and no strong seasonal pattern — think signups growing at a roughly constant rate, not retail sales that spike every December.

**2. `TREND`** — does the same linear regression as `FORECAST.LINEAR`, but returns an array of predicted values in one go instead of one point at a time. Useful when you want a whole column of forecasted values sitting next to your actuals for a chart.
```excel
=TREND(Sales[Revenue], Sales[Month], FutureMonths)
```
Drop the result next to your historical series and Excel will happily plot both as one continuous line, with the forecasted portion visually picking up where the actuals leave off.

**3. The Forecast Sheet tool (Data tab → Forecast Sheet)** — if your data has seasonality, don't reach for a straight-line formula at all. Select your date and value columns, click Forecast Sheet, and Excel runs exponential smoothing (`FORECAST.ETS` under the hood) to detect repeating seasonal patterns automatically. It outputs a new sheet with a chart, a confidence interval, and the underlying formulas already filled in — genuinely one of the more underused buttons in Excel.

**4. `FORECAST.ETS.CONFINT`** — pairs with the Forecast Sheet's output to give you an upper and lower bound around each forecasted point, not just a single number. A forecast presented as one confident-looking value invites the question "how sure are you?" — showing the confidence interval alongside it answers that before it's asked.
```excel
=FORECAST.ETS.CONFINT(DATE(2026,8,1), Sales[Revenue], Sales[Month])
```

**5. Sanity-check the seasonality length.** `FORECAST.ETS.SEASONALITY` tells you how many periods Excel detected in your data's repeating cycle — 12 for monthly data with a yearly pattern, 7 for daily data with a weekly pattern. If it returns 1, Excel didn't find a seasonal pattern, and you're better off with `FORECAST.LINEAR` than forcing the seasonal tool onto flat data.
```excel
=FORECAST.ETS.SEASONALITY(Sales[Revenue], Sales[Month])
```

A word of caution that applies to all of these: extrapolating a trend line only holds up as long as the conditions that produced it don't change. A forecast is a statement about "if the recent past continues," not a guarantee — flag that assumption explicitly when you hand a projection to a stakeholder, especially if there's a known upcoming change (a price increase, a new competitor, a policy shift) that the historical data can't see coming.

Start with `FORECAST.LINEAR` for a quick gut-check number, reach for the Forecast Sheet tool when the data has an obvious seasonal rhythm, and always pair the headline number with a confidence range so "what do we expect" doesn't quietly turn into "what will definitely happen."
