---
title: "Power BI Copilot: Generating DAX Measures and Summaries from a Plain-English Prompt"
date: "2026-09-03"
tags: ["power-bi", "copilot", "dax"]
excerpt: "Using Power BI's Copilot chat pane to draft DAX measures, report pages, and narrative summaries, and where to double-check its output."
---

Power BI's Copilot is a chat pane, not a visual — it sits alongside your report and turns a written request into a first draft of a measure, a page of visuals, or a plain-English summary of what's on screen. It's a different tool from Q&A (which answers questions about your existing data) and Smart Narrative (which auto-summarizes a fixed set of visuals): Copilot generates new report content and DAX from a prompt you write yourself.

**1. Describe a report page instead of building it visual by visual.** A prompt like "create a page summarizing sales by region and product category, with a trend over time" produces a starting layout with visuals already bound to your fields. It rarely matches what you'd have designed, but reworking a rough draft is often faster than starting from a blank canvas.

**2. Ask for a measure in plain English and get real DAX back.** Typing something like "create a measure for year-over-year sales growth percent" into the Copilot pane returns a formula you can inspect before accepting:

```dax
Sales YoY % =
DIVIDE(
    [Total Sales] - CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Date'[Date])),
    CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Date'[Date]))
)
```

It's a genuine time-saver for measures you'd otherwise look up a pattern for, especially time-intelligence formulas that are easy to get subtly wrong.

**3. Get a narrative summary of a visual for a stakeholder who won't open the report.** Right-click a chart and choose the Copilot summarize option to get a written paragraph describing what it shows — useful for pasting into an email or a Teams update without re-explaining the chart yourself.

**4. Treat every generated measure as a draft that needs verification, not a finished answer.** Check it against a manual total you already trust, and pay attention to filter context — a Copilot-written measure can look syntactically correct while quietly using the wrong table relationship or the wrong `CALCULATE` filter direction for your model. Reviewing generated DAX is a normal part of using it, not a sign it failed.

**5. It has to be turned on before it shows up.** Copilot in Power BI requires a Fabric capacity (or Premium capacity, depending on your tenant) and needs to be enabled by a tenant admin in the Fabric admin portal. If the chat icon isn't in your ribbon, that's almost always an admin setting rather than a licensing problem on your account alone.

Copilot is best thought of as a fast way to get a reasonable starting point — a page layout, a measure skeleton, a plain-language summary — that you still read and adjust with the same scrutiny you'd apply to a measure copied from a forum post.
