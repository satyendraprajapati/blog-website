---
title: "Using PowerPoint's Accessibility Checker to Add Alt Text to Data Charts"
date: "2026-07-30"
tags: ["powerpoint", "accessibility", "data-visualization"]
excerpt: "A colorblind-friendly palette doesn't help a screen reader user — here's how to run PowerPoint's Accessibility Checker and write alt text that actually describes what a chart shows."
---

Choosing readable colors and legible fonts helps most viewers, but it does nothing for someone using a screen reader — to them, a chart with no alt text is just "image, unlabeled." PowerPoint has a built-in Accessibility Checker that flags exactly this, and fixing it on a data deck takes a few minutes per slide.

**1. Run the checker before you consider a deck finished.** Go to Review → Check Accessibility (or File → Info → Check for Issues → Check Accessibility). It scans every slide and sorts findings into Errors, Warnings, and Tips — missing alt text on charts and images shows up as an Error, since it makes content completely unavailable to a screen reader rather than just awkward.

**2. Write alt text that states the finding, not the chart type.** The instinct is to describe the object — "bar chart of quarterly revenue" — but that's what a sighted viewer already sees at a glance and tells a screen reader user nothing they couldn't infer from the slide title. Write what the chart shows instead:
- Weak: "Column chart showing revenue by quarter."
- Better: "Revenue grew each quarter, from $1.2M in Q1 to $2.1M in Q4, with the sharpest jump between Q2 and Q3."

This mirrors the same BLUF instinct as a good slide title — lead with the insight, not the object — just applied to the text a screen reader actually announces.

**3. Mark purely decorative images as decorative, don't leave them blank.** A background texture or a logo repeated on every slide has no informational content, and an empty alt text field reads to screen readers as "possibly missing, needs checking" rather than "intentionally skipped." Right-click the image → Edit Alt Text → check "Mark as decorative" so it's explicitly skipped instead of flagged as an unresolved error every time the deck is checked.

**4. Fix reading order on slides with layered objects.** A chart with a callout box and a text label stacked on top of each other reads to a screen reader in the order they were added to the slide, not their visual position. Use the Selection Pane (Home → Select → Selection Pane) to see and reorder the underlying list so the title, then the chart, then the callout are announced in the sequence a sighted viewer would naturally look at them.

**5. Re-run the checker after edits, and check title-less slides too.** The Accessibility Checker will also flag any slide without a proper title placeholder — easy to introduce when you duplicate a section-divider slide and just retype the visible text over a text box. Every slide needs a real title placeholder for screen readers to announce slide-to-slide navigation correctly, even if that title is visually hidden or minimized in your design.

None of this changes how the deck looks to the room you're presenting to live — it only matters once the file is shared, emailed, or posted afterward. For a deck that's going to outlive the meeting it was built for, that's most of its actual audience.
