---
title: "Embedding a Screen-Recorded Dashboard Walkthrough in PowerPoint with Insert > Screen Recording"
date: "2026-09-02"
tags: ["powerpoint", "data-storytelling", "recording"]
excerpt: "How to capture a short screen recording of a live dashboard and drop it directly into a slide as a playable video, for audiences who can't access the tool themselves."
---

Linking a live Power BI report or an editable Excel worksheet into a slide is great when your audience can actually interact with it. It falls apart the moment someone opens the deck without a Power BI license, on a laptop with no connection to your data source, or long after the underlying dataset has moved on. A screen-recorded walkthrough sidesteps all of that: it's a fixed video clip of you actually using the dashboard, embedded directly in the slide, that plays back identically for anyone.

**1. Use Insert > Screen Recording, not a separate app.** PowerPoint has a built-in recorder under the **Insert** tab. Click it, drag the selection box around the region of your screen you want captured — usually just the dashboard window, not your whole desktop — and hit record.

**2. Record the specific interaction, not the whole session.** A 15-second clip of clicking a slicer to filter a chart, or drilling from a summary visual into detail, makes the point far better than a long unscripted click-through. Plan the two or three clicks you want to demonstrate before you hit record.

**3. Decide whether you need audio narration in the clip itself.** The recorder can capture your microphone alongside the screen. If the slide will be presented live, skip narration and talk over it yourself. If the deck is meant to be watched async, record a short explanation directly into the clip so it stands on its own.

**4. The recording drops in as a normal video object.** Once you stop recording, it's inserted on the current slide like any other video — you can resize it, reposition it, trim the start and end under **Playback > Trim Video**, and set a poster frame so the slide doesn't show a black rectangle before playback starts.

**5. Set it to play automatically if the slide's whole point is the demo.** Under **Playback > Start**, choose **Automatically** so the clip begins the moment you advance to that slide, rather than requiring a click during a live presentation.

**6. Compress the video before sending the deck around.** A screen recording of a full dashboard can add tens of megabytes to a file that otherwise weighs almost nothing. Use **File > Compress Media** to bring it down to a size that's still sharp enough to read chart labels, without ballooning the deck the way an uncompressed capture would.

**7. Keep the original recording if you'll need to re-cut it.** PowerPoint embeds the video into the slide, but if you want a slightly different clip later — a different filter selection, a corrected number — it's easier to re-record than to trim an already-embedded video down to a completely different moment.

The result behaves nothing like a live embed: nobody watching it can click anything, and it goes stale the moment the underlying numbers change. But for an audience that will never open the actual tool, or a deck that has to work exactly the same way in six months as it does today, a short recorded clip is often the more reliable choice than a live connection that assumes access nobody in the room actually has.
