---
title: "Compressing Images and Reducing File Size in a Data-Heavy PowerPoint Deck"
date: "2026-08-06"
tags: ["powerpoint", "performance", "beginner"]
excerpt: "Why a 40-slide analysis deck balloons to 200MB, and the settings that bring it back down without visibly degrading the charts and screenshots inside it."
---

A data deck full of dashboard screenshots, pasted charts, and full-resolution exports adds up fast — it's common for an analysis deck to balloon past 100MB before anyone notices, which then makes it slow to email, slow to open, and slow to co-author over a shared drive. Almost all of that weight is images, and almost all of it is avoidable.

**1. Check where the size is actually going before guessing.** Right-click the PowerPoint file in File Explorer or Finder → Properties, or just watch the save time — a deck that takes several seconds to save on every edit is usually carrying uncompressed images. If you're not sure which slides are the problem, the ones with pasted screenshots (rather than native PowerPoint charts) are almost always the heaviest, since a screenshot embeds a full bitmap where a native chart embeds just the underlying data.

**2. Use Compress Pictures instead of manually resizing each image.** Select any picture → *Picture Format → Compress Pictures*. This one dialog rescales every image in the deck to match its *displayed* size rather than its original resolution — a 4000px-wide dashboard screenshot shown at postage-stamp size on a slide gets compressed down to what's actually needed, not left at full resolution behind a scaled-down frame.

**3. Pick "Email" quality for internal review decks, "Print" for anything presented on a big screen.** The Compress Pictures dialog offers a few target resolutions — Email (96 ppi) shrinks the file the most and is fine for a deck that's mainly read on a laptop or forwarded around; Print (220 ppi) keeps enough detail that a chart's axis labels and small text don't blur when projected or printed. Don't default to the highest setting out of caution — a chart doesn't need more resolution than the screen displaying it.

**4. Turn on "Delete cropped areas of pictures."** If you've ever cropped a screenshot inside PowerPoint, the cropped-out pixels are still stored in the file by default, in case you want to undo the crop later. Checking this option in the same dialog permanently discards them — worth doing once you're confident the crop is final, since it's often a meaningful chunk of the file for anyone who trims screenshots rather than re-exporting them at the right size.

**5. Apply the compression to all pictures, not just the selected one.** The dialog defaults to "Apply only to this picture" — leave that unchecked to compress every image in the deck in one pass, rather than repeating the process slide by slide.

**6. Fix the source habit, not just the symptom.** If you're regularly pasting full-screen screenshots of a dashboard, crop to just the chart before pasting, or export a properly-sized image from the source tool instead of a screen-grab. Compressing after the fact works, but a deck built from appropriately-sized images in the first place never needs the fix.

**7. Re-check the file size after compressing, and re-save.** Compress Pictures changes the images in memory — the size reduction only lands on disk once you save the file. If the file size barely moved after compressing, double check "All pictures in this file" was actually selected rather than just the one you had clicked on.

None of this changes how the deck looks on screen — a screenshot compressed to its display size is visually identical to the audience, it's just no longer carrying resolution nobody was going to see.
