---
title: "Building In-Cell Bar Charts in Excel with the REPT Function"
date: "2026-11-06"
tags: ["excel", "data-visualization", "beginner"]
excerpt: "A text-formula trick for drawing simple bar charts directly inside a cell, without Sparklines or Data Bars."
---

Sparklines and Data Bars cover most "quick visual inside a cell" needs, but both are chart objects or formatting rules layered on top of a value — they can't easily be copied into an email, combined with other text, or tweaked character-by-character. `REPT` builds the bar out of plain text, which makes it more flexible in a few specific situations.

**1. The basic bar.** `REPT` repeats a character a given number of times. Feed it a scaled value and a block character, and you get a bar made of text:
```excel
=REPT("█", ROUND(B2/MAX($B$2:$B$10)*20, 0))
```
This scales every value against the largest one in the range so the longest bar fills roughly 20 characters, and the rest fall in proportion.

**2. Pick a font that renders the block cleanly.** The `█` character (full block) looks solid in most fonts, but switching the column to a monospaced font like Consolas keeps every bar's character width identical, so lengths compare fairly instead of drifting with kerning.

**3. Combine the bar with the number.** Because it's just text, you can concatenate the bar and the value into one cell — useful for a compact leaderboard where you don't have room for a separate chart column:
```excel
=REPT("█", ROUND(B2/MAX($B$2:$B$10)*20,0)) & "  " & TEXT(B2, "#,##0")
```

**4. Use two characters for a positive/negative bar.** For variance or growth figures that can go either way, test the sign first and repeat a different character (or just flip the color via conditional formatting on the cell):
```excel
=IF(B2>=0, REPT("█", ROUND(B2/$C$1*20,0)), REPT("░", ROUND(-B2/$C$1*20,0)))
```

**5. Know when to stop.** This trick is for dense, scannable lists — a status report, a quick sort-and-eyeball table, something pasted into Teams or an email where an actual chart object won't survive. For anything a stakeholder will interact with, filter, or print at a normal size, a real chart or Sparkline is still the better tool; `REPT` bars don't resize gracefully and can look rough at small font sizes.

The appeal is that it's just a formula — it sorts with the row, survives a paste as values, and shows up in plain text exports where an embedded chart wouldn't. It's a narrow use case, but a good one to have in the back pocket.
