---
title: "Setting Up Slide Numbers, Footers, and Date Stamps Across a PowerPoint Data Deck"
date: "2026-10-22"
tags: ["powerpoint", "productivity", "beginner"]
excerpt: "The Header & Footer dialog handles slide numbers, dates, and a footer label across a whole deck in one pass -- here's how to set it up without typing any of it by hand."
---

A data deck that gets forwarded, printed, or cited in a meeting needs a slide number and a date on it somewhere — "can you check slide 14" only works if slide 14 actually has a number on it. The usual mistake is adding a text box to one slide, copying it to the next, and ending up with numbers that drift out of sync the first time a slide gets deleted. PowerPoint already has a dedicated dialog for this that updates every slide at once.

**1. Open `Insert > Header & Footer` instead of typing a text box.** This single dialog controls three things across the whole deck at once: a slide number placeholder, a date (fixed or automatically updating), and a short footer line of your own text — all positioned consistently by the theme rather than wherever you happened to drop a text box.

**2. Choose "Update automatically" only for a date that should mean "when this was opened."** The automatic option shows today's date every time the file is opened, which is right for an internal working deck but wrong for a deck reporting on a specific data cutoff — a report that says "as of [today]" every time someone reopens it next quarter is actively misleading. For anything citing a specific pull date, pick "Fixed" and type the actual date the data was pulled.

**3. Use the footer field for something more useful than a generic label.** The footer text box is free-form, so instead of leaving it as the file name or your company name on every slide, put the thing a viewer actually needs to find later — a data source, a report version, or a confidentiality marker:
```
Internal — Q3 Sales Review — Draft v3
```
It shows up in the same bottom-row position as the date and slide number on every slide that uses it, so it reads as one consistent strip rather than a separate note.

**4. Check "Don't show on title slide" almost every time.** A title slide with a slide number reading "1" and a small footer underneath it looks cluttered and rarely adds anything — the checkbox in the same dialog suppresses all three elements (number, date, footer) on the title slide specifically while keeping them everywhere else.

**5. Apply to all, unless you deliberately want a mixed deck.** The dialog defaults to a single "Apply to All" button; there's also an "Apply" button that affects only the currently selected slide, which is easy to click by mistake and ends up with one slide formatted differently from the rest for no visible reason. If you genuinely need a hidden appendix section without page numbers, apply to all first, then adjust the handful of exception slides individually afterward — not the other way around.

**6. Fix the starting number if the deck doesn't actually start at slide 1 of 1.** Under `Design > Slide Size > Custom Slide Size`, the "Number slides from" field lets a deck that's really part 3 of a longer series start its numbering at, say, 41 instead of 1 — useful when a monthly report deck gets split by quarter but the slide numbers need to stay continuous across the whole year for citation purposes.

**7. Move it to the Slide Master if you're setting up a template, not a one-off deck.** Everything above edits the current file's slides directly. If this is a layout you'll reuse for every future report, the footer, date, and number placeholders belong on the Slide Master itself (position and formatting, not the deck-specific text), saved as a `.potx` template — so the next deck starts with the right setup already in place instead of running through this dialog again from scratch.

It's a two-minute setup that most decks skip until someone in a meeting can't tell which slide a comment refers to — doing it once, correctly, through the dialog built for it is faster than fixing scattered text boxes later.
