---
title: "Setting Up a Self-Running, Looping Data Deck for an Office Display or Kiosk in PowerPoint"
date: "2026-08-28"
tags: ["powerpoint", "presentation", "automation"]
excerpt: "How to turn a data deck into a slideshow that plays itself on a lobby screen or team monitor, advancing and looping on its own with nobody there to click through it."
---

Most guidance on presenting a data deck assumes someone is standing in front of it, clicking through slides. A deck meant for a break-room TV or a team dashboard screen has to do the opposite: play through on its own, in a loop, indefinitely, with no one touching the keyboard. PowerPoint has a specific set of options for exactly this, separate from the ones built for live presenting.

**1. Set your own timings for every slide with Rehearse Timings before you touch the self-running settings.** Go to *Slide Show → Rehearse Timings* and click through the deck at the pace you want a viewer to read each slide — PowerPoint records how long each one stayed on screen. This matters more for a self-running deck than a presented one: nobody is there to click "next" when a slide has been up long enough, so whatever you record here is the pace the deck runs at forever.

**2. Turn on "Browsed at a kiosk" under Set Up Show.** *Slide Show → Set Up Slide Show*, then choose *Browsed at a kiosk (full screen)*. This single option does three things you'd otherwise have to configure separately: it locks out keyboard and click-to-advance input (so a passerby can't accidentally exit or skip ahead), it forces the deck to use your recorded timings, and it automatically loops back to slide one when it reaches the end without you setting a separate "loop continuously" checkbox.

**3. Double-check "Loop continuously until Esc" is still checked even in kiosk mode.** Kiosk mode implies looping, but the checkbox in the same Set Up Show dialog is worth confirming explicitly — if it's ever unchecked, a deck left running overnight ends on a blank black screen instead of restarting for the first person who walks by the next morning.

**4. Give every slide enough time to be read once, not just glanced at.** A slide built to be talked over during a live readout might carry ten seconds of content that only makes sense with narration. A self-running version of the same slide needs its own on-screen explanation and enough dwell time — 15 to 20 seconds is a reasonable floor for a chart with a real number on it — since there's no presenter filling in the context out loud.

**5. Strip out any slide that needs a click to make sense.** Animations that reveal on a mouse click, custom show branches meant for Q&A, or a slide referencing "click here for detail" all assume an interactive audience. In kiosk mode those clicks never come, so either convert the animation triggers to *After Previous* / *With Previous* timing so they play automatically, or cut the slide from the kiosk version and keep it in your presented version instead.

**6. Save a separate copy for the kiosk instead of toggling the same file back and forth.** Set Up Show settings and rehearsed timings live in the file itself, so flipping a working deck into kiosk mode for the lobby screen and back again for your next live readout is a good way to accidentally present the wrong version to a room. Keep `deck.pptx` for live presenting and `deck-kiosk.pptx` — with its own timings and Set Up Show settings — as the file that actually sits on the display's drive or auto-opens on boot.

**7. Refresh the kiosk file on a schedule, not just when you remember to.** A self-running deck has no presenter to notice the numbers are three weeks stale. If the underlying data updates on a cadence, pair this with linked Excel charts or a scheduled export so the kiosk file gets replaced automatically, rather than quietly showing last month's KPIs to everyone who walks past the screen.

Once it's set up, the deck runs unattended exactly the way a lobby screen or a team status monitor needs to — advancing, looping, and locked against interference — without anyone needing to remember to click "next."
