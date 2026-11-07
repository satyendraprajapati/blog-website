---
title: "Making Your Power BI Reports Accessible: Alt Text, Tab Order, and Color-Blind-Safe Visuals"
date: "2026-11-07"
tags: ["power-bi", "accessibility", "beginner"]
excerpt: "A Power BI report that reads fine to you can be unusable for a colleague on a screen reader or with color blindness -- three built-in settings fix most of the common problems."
---

It's easy to assume a report is fine once it looks good on your own screen, but a report that leans entirely on color, has no reading order for a screen reader, or hides its key numbers inside a chart with no text alternative will shut some of your audience out before they've seen a single insight. Power BI has built-in tools for all three problems -- most analysts just never open them.

**Add alt text to every visual, and write it like a summary, not a label.** Select a visual, open the Format pane, and look under General > Alt Text. You can type a static description or bind it to a measure with a DAX expression, so the alt text updates as the data changes -- useful for a KPI card where the number itself is the point:

```dax
"Total revenue this quarter is " & FORMAT([Total Revenue], "$#,##0") & ", " &
IF([Total Revenue] > [Prior Quarter Revenue], "up", "down") & " from last quarter."
```

A screen reader reads this instead of announcing "chart" or "image," which is what it does for a visual with no alt text at all. Skip generic text like "bar chart of sales" -- it tells a sighted user nothing they can't already see, and it tells a screen reader user even less about what the chart actually shows.

**Set the tab order so keyboard and screen reader users hit visuals in a sensible sequence.** Open the Selection pane (View > Selection), then switch it to "Tab Order" view. By default, Power BI orders visuals by the sequence you added them in, which rarely matches the visual layout -- a title might come last, or a detail table might come before the summary card that explains it. Drag items in the Tab Order list to match the order a sighted reader's eye would naturally follow: title, key metrics, then supporting charts and tables.

**Don't rely on color alone to carry meaning.** A red/green status column or a line chart distinguishing categories only by hue will read as identical shades to a user with red-green color blindness, which is the most common form. Two fixes cover most cases: turn on data labels or icons so the status is also conveyed in text (an icon set or a text field alongside the color), and in the Format pane's color picker, swap a straight red/green palette for one that varies in lightness as well as hue -- Power BI's default theme already separates some colors this way, but a custom red/green pair usually doesn't.

**Run the built-in accessibility checks before you publish, not after someone complains.** Check contrast with the Format pane's color picker, which shows a contrast ratio against the background when you pick a text or fill color -- aim for at least 4.5:1 for normal text. And test the report with just a keyboard: tab through it with no mouse and confirm every slicer, button, and bookmark is reachable and its focus state is visible. If you can't tell where focus is while tabbing, neither can a keyboard-only user.

None of this requires a separate "accessible version" of the report -- alt text, tab order, and a color-blind-safe palette are settings on the same report everyone else sees, and they take a fraction of the time a redesign would.
