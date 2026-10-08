---
title: "Using Copilot in Excel to Write Formulas, Explain Data, and Summarize a Sheet"
date: "2026-10-08"
tags: ["excel", "ai", "beginner"]
excerpt: "Copilot in Excel can write a formula from a plain-English request, explain one you inherited, and summarize a table in words -- here's where it actually earns its keep."
---

Excel's "Analyze Data" panel suggests insights it thinks are interesting. Copilot is a different feature entirely: a chat pane you ask directly, in your own words, and it answers against the specific table you're looking at. It needs a Microsoft 365 Copilot license and works on data formatted as an Excel Table, but once both of those are true, it's worth knowing the handful of things it's genuinely good at.

**1. Ask it to write a formula instead of looking one up.** Open the Copilot pane (Home tab or the sidebar icon), select your table, and describe the result you want in plain language -- "add a column that flags any order over $500 as High Value." Copilot returns a real formula in a new column, not just a description of one:
```excel
=IF([@Amount]>500,"High Value","Standard")
```
You still get to see and edit the formula it inserts -- it isn't a black box calculating silently off to the side.

**2. Ask it to explain a formula you didn't write.** Paste or point Copilot at a dense formula inherited from a coworker's workbook -- a nested `XLOOKUP` wrapped in three `IF`s -- and ask "what does this formula do?" It walks through the logic in plain English, which is faster than reconstructing the intent yourself by unnesting it one parenthesis at a time.

**3. Ask for a written summary of a table, not just a chart.** "Summarize the trends in this sheet" or "what stands out in this data?" gets you a few sentences describing the shape of the data -- which region grew fastest, which category has the most variance -- dropped into the chat pane or a new cell range if you ask it to put the summary on the sheet. This is a different output than a PivotTable: it's prose for a status update or an email, not a table for further analysis.

**4. Ask it to highlight or filter rows that meet a description.** Rather than writing a conditional formatting rule by hand, you can ask "highlight the rows where margin dropped compared to last month" and Copilot applies the formatting for you. It's worth checking the result against a manual spot-check the first few times -- it's translating an ambiguous English sentence into an exact rule, and "dropped compared to last month" has more than one reasonable interpretation.

**5. Treat every formula and number it produces as a draft, not a finished answer.** Copilot is still a language model guessing at the most likely correct formula or summary, not a calculation engine that's verified its own output. Before a Copilot-generated formula goes into a report someone else will rely on, trace through a couple of rows by hand the same way you would for a formula a colleague handed you -- the time it saves is in not starting from a blank formula bar, not in skipping review entirely.

Copilot in Excel is closer to a fast first draft than an autocomplete for your brain -- it's most useful exactly where you'd otherwise lose ten minutes to syntax you don't use often enough to remember cold.
