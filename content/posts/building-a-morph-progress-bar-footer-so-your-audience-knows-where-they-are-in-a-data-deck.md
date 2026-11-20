---
title: "Building a Morph Progress Bar Footer So Your Audience Knows Where They Are in a Data Deck"
date: "2026-11-20"
tags: ["powerpoint", "data-storytelling", "beginner"]
excerpt: "Using the Morph transition on a thin footer bar so it visibly grows slide by slide, giving a long data deck a built-in sense of how much is left."
---

A 25-slide data readout with no visible sense of progress leaves the audience guessing whether they're on slide 5 or slide 20, which makes a long deck feel longer than it is. A thin bar across the bottom of every slide that visibly grows as you advance gives people a constant, low-key answer — and Morph is what makes it animate smoothly instead of just jumping.

**1. Start with one thin rectangle on your Slide Master.** Insert a narrow rectangle along the bottom edge of the slide on the Slide Master (not on an individual slide), sized to represent "slide 1 of N" — for a 20-slide deck, that's 5% of the slide width. Putting it on the Master means every slide inherits the same starting bar without you placing it by hand twenty times.

**2. Give the bar a consistent name so Morph can track it.** Open the *Selection Pane* and rename the shape to something explicit like `ProgressBar` on every slide. Morph matches objects between consecutive slides primarily by name — an unnamed shape renamed inconsistently from slide to slide will cut instead of animate smoothly.

**3. Widen the bar by one increment on each slide after the first.** On slide 2, select the `ProgressBar` shape and drag its right edge out to roughly 10% of the slide width; on slide 3, to 15%; and so on, until the final slide's bar spans the full width. This is manual, but for most decks it's a few seconds per slide, and you're only ever touching one shape's width.

**4. Apply Morph as the transition on every slide, not just one.** Select all slides (Ctrl+A in the slide thumbnail pane), go to *Transitions*, and apply *Morph* across the whole deck. Because the bar is the one shape whose size changes consistently between every consecutive pair, Morph animates it growing smoothly as you click forward — everything else on the slide that didn't change just stays put.

**5. Keep the bar's color deliberately low-contrast.** A bright, saturated progress bar competes with your actual chart for attention. A thin line in a muted gray or your theme's secondary color reads as "ambient progress indicator" rather than "a design element I'm supposed to be looking at" — the goal is something the audience absorbs peripherally, not something you'd ever point to.

**6. Test it by presenting from the start, not by clicking through in Normal view.** Morph only shows its animation during Slide Show, not while you're editing — jumping between slides in the editor just shows two static states. Run *Slide Show → From Beginning* and click through a few transitions to confirm the bar actually grows smoothly rather than snapping, which usually means a naming or sizing mismatch between two consecutive slides.

**7. Skip it on decks under ten slides.** The whole point is giving a sense of "how much is left" in a deck long enough that the audience could plausibly lose track. On a short deck, a growing bar is one more moving element for no real benefit — reserve this for the readouts genuinely long enough that people are wondering when it'll end.

It's a small piece of polish, but a deck that visibly tells its audience how far along it is tends to get fewer "how much longer" sidebar questions during a long data review.
