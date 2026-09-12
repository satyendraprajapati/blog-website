---
title: "Fixing Screen Reader Reading Order on Complex Data Slides in PowerPoint"
date: "2026-09-12"
tags: ["powerpoint", "accessibility", "beginner"]
excerpt: "Alt text tells a screen reader what a chart is, but a separate, easy-to-miss setting decides what order it announces everything on the slide in — and PowerPoint's default is just the order objects were added."
---

A data slide with a title, a KPI card row, a chart, and a source-note text box usually looks fine visually — the layout tells a sighted reader what to look at first. A screen reader doesn't see layout. By default it reads objects back in the order they were added to the slide, which on a slide that's been edited and rearranged a dozen times can mean the source note gets announced before the chart it's footnoting, or a stat card reads out before the title that gives it context.

**1. Open the Reading Order pane, not the Selection Pane.** They look similar and both list every object on the slide, but they do different jobs. The Selection Pane (Home > Arrange > Selection Pane) controls stacking order and lets you hide or lock objects. The Reading Order pane (Home > Accessibility > Check Accessibility > Reading Order, or the Reading Order button on the Accessibility ribbon) controls the sequence a screen reader narrates them in — the two orders can be, and often are, completely different on the same slide.

**2. Run Check Accessibility first to find slides that need it.** The Accessibility Checker flags objects with a nonstandard reading order alongside its more familiar alt-text and contrast warnings. Treat it as a checklist to work through slide by slide rather than guessing which slides are affected.

**3. Reorder top to bottom, drag by drag.** The Reading Order pane lists every object on the current slide; drag entries up or down until the list matches the order a sighted reader's eye actually travels — typically title, then key takeaway or stat cards, then chart, then supporting labels, then source note last.

**4. Give every object a name that means something before you reorder it.** A pane full of "Rectangle 14" and "TextBox 22" is unreadable when you're trying to drag the right thing into place. Rename shapes in the Selection Pane first (double-click the name to edit it) so the Reading Order pane shows "KPI Card - Revenue" instead of a generic label.

**5. Group related objects before setting their order.** A stat card built from a rectangle, an icon, and two text boxes should usually be read as one unit, not four separate stops. Select the pieces and group them (Ctrl+G) so the Reading Order pane treats the card as a single entry in the right position, rather than scattering its parts across the sequence.

**6. Mark purely decorative shapes to be skipped.** A background rectangle or a divider line with no informational content doesn't need to be announced at all. Right-click it, choose Edit Alt Text, and check "Mark as decorative" — screen readers skip it entirely instead of reading a blank or unhelpful description.

**7. Test with the built-in Narrator, not just visual review.** Windows Narrator (Ctrl+Win+Enter to toggle) will actually read the slide back to you in the order you've set. Listening to one real data slide end to end catches ordering mistakes that scanning a list of object names in a pane won't.

Reading order is easy to skip because a wrong sequence is invisible to anyone not using a screen reader — the slide looks identical either way. For a deck you know will be shared as a file rather than only presented live, it's worth the few extra minutes per slide it takes to get right.
