---
title: "PowerPoint's AutoFit Text Options: Keeping KPI Numbers from Overflowing a Data Slide"
date: "2026-10-27"
tags: ["powerpoint", "data-storytelling", "beginner"]
excerpt: "Three AutoFit behaviors control what happens when text outgrows its placeholder, and the default one is usually the wrong choice for a KPI callout."
---

Drop a big number into a KPI callout box, and the moment the figure changes from "4.2%" to "14.2%" or the label wraps to a second line, PowerPoint has to decide what happens. That decision isn't automatic luck — it's a setting called AutoFit, and most data decks are running on whichever option happened to be the default.

**1. Know the three options, not just that text "sometimes shrinks."** Right-click a text box or placeholder → **Format Shape → Text Options → Text Box**, and under "Autofit" you'll find three choices: **Do Not Autofit** (text overflows the box if it's too long), **Shrink text on overflow** (font size scales down to keep everything inside), and **Resize shape to fit text** (the box grows instead of the text shrinking).

**2. Use "Shrink text on overflow" for KPI numbers that update between reviews.** A callout box showing "Revenue: $4.2M" this month might need to show "$14.2M" next quarter — a wider number. Shrink-on-overflow keeps the box's position and size locked on the slide while quietly scaling the font down a point or two, so the layout never breaks just because the number got longer.

**3. Avoid "Resize shape to fit text" near anything else on the slide.** A growing box pushes or overlaps whatever's next to it — a chart, another callout, a footnote. It's fine for an isolated title placeholder, but on a dense data slide with multiple elements positioned relative to each other, a box that silently resizes itself is how layouts quietly break between one version of the deck and the next.

**4. Set "Do Not Autofit" deliberately for labels that must stay a fixed size.** For a title or axis label where consistent font size matters more than fitting every possible string, turning AutoFit off and instead editing the actual text to fit is the more predictable choice — you catch an overflow by eye while building the slide instead of getting a silently shrunk font that's smaller than everywhere else on the deck.

**5. Check AutoFit on the Slide Master, not just individual boxes.** If every new KPI callout you add inherits "Shrink text on overflow" from a placeholder defined on the Slide Master, you fix the behavior once instead of re-setting it on every slide you build. Open **View → Slide Master**, select the relevant placeholder, and set AutoFit there.

**6. Re-check shrunk text at presentation size, not just in the editor.** A font that auto-shrank to fit in the editing window can look fine at your desk and too small on a conference-room screen. After AutoFit kicks in on a real number, switch to Slide Show view and confirm it's still legible from the back of the room before calling the slide done.

AutoFit is one of those settings nobody opens on purpose, which is exactly why it's worth opening on purpose at least once — a KPI slide that survives next quarter's bigger number without you touching it again is worth the two minutes it takes to set.
