---
title: "Linking a Live Excel Number Into Your PowerPoint Slide Text So a Stat Updates Itself"
date: "2026-10-04"
tags: ["powerpoint", "excel", "beginner"]
excerpt: "A linked chart or table updates on refresh, but a number typed directly into a slide's bullet text doesn't -- here's how to link a single Excel cell into a sentence so it does too."
---

Linking an Excel chart or table into PowerPoint keeps the visual current, but the number everyone actually reads is often sitting in a sentence on the same slide — "Revenue grew 12% in Q3" — typed in by hand. The moment the underlying figure changes, that sentence is wrong until someone remembers to go back and edit it. Pasting the source cell in as a link instead of typing the number fixes that, and it works on a single cell the same way it works on a whole range.

**1. Copy just the one cell from Excel, not the whole row.** Click the cell containing the number — the growth percentage, the total, whatever the sentence is built around — and copy it with `Ctrl+C` as you normally would.

**2. In PowerPoint, use Paste Special, not a plain paste.** Go to **Home → Paste → Paste Special**, and in the dialog choose **Paste link**, then pick **Formatted Text (RTF)**. A plain paste or a plain "Paste link with Keep Source Formatting" brings the cell in as a tiny floating object instead of inline text — RTF is the option that lands as actual text you can drop into the middle of a sentence.

**3. Drag the pasted number into place and finish the sentence around it.** It arrives as its own text box at first; cut the linked number out of it and paste it directly into your bullet or title text box, in the exact spot the figure belongs. Once it's inline, it reads like ordinary text — nothing on the slide visually marks it as a link.

**4. Update it the same way you'd update a linked chart.** When the Excel file changes, open **File → Info → Edit Links to Files** in PowerPoint and click **Update Now**, or just answer "Yes" to the update prompt that appears when you reopen the deck with the source file reachable. The sentence's number updates in place without you touching the slide.

**5. Know the two ways this breaks, so you catch it instead of trusting a stale number.** If the source workbook gets renamed or moved, the link breaks the same way any linked Excel object does — check **Edit Links to Files** for its status. And if the deck gets emailed to someone without access to that Excel file, the number freezes at whatever it last showed and silently stops updating; for a deck that needs to travel, break the link first so at least everyone knows it's a fixed snapshot, not a live figure.

**6. Reserve this for the one or two numbers that matter, not every figure on the slide.** A deck where half the words in every sentence are quietly linked objects becomes fragile and hard to edit by hand later. Use it for the headline stat a slide is actually built around — the kind of number a BLUF-style title would lead with — and leave supporting figures as plain typed text.

It's a small trick, but it closes a real gap: a linked chart proves the picture is current, while the sentence next to it is often the one thing in the room nobody double-checks before presenting.
