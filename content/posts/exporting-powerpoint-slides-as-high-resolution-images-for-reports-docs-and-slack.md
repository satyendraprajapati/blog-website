---
title: "Exporting PowerPoint Slides as High-Resolution Images for Reports, Docs, and Slack"
date: "2026-08-15"
tags: ["powerpoint", "export", "beginner"]
excerpt: "Screenshotting a slide for a Slack message or a Word report loses resolution and picks up whatever's behind your cursor — PowerPoint's built-in export handles both better, once you know the setting that controls image quality."
---

Dropping a finished chart slide into a Slack update or a Word status report shouldn't mean alt-tabbing to PowerPoint and hitting Print Screen. PowerPoint can export any slide as a clean, standalone image file directly, and the difference in sharpness comes down to one setting most people never touch.

**1. Use Save As, not Export, for a single slide.** File → Save As → choose PNG or JPEG as the file type. PowerPoint asks whether to export "Just This One" slide or "Every Slide" — for a single chart you want to share, "Just This One" saves you from deleting a folder full of slides you didn't need afterward.

**2. Export the whole deck as images when you need one per slide.** File → Export → Change File Type → PNG/JPEG, or "Every Slide" from the Save As dialog, creates a numbered folder of images — one per slide — which is the fastest way to drop an entire deck into a Word appendix or a documentation page without re-exporting slide by slide.

**3. Fix the export resolution before you export anything, not after.** PowerPoint's default PNG export is tuned for on-screen viewing, not print or zoom — an image built from it looks soft when pasted at full width in a report. Raising the default resolution takes one registry or plist change and applies to every future export:
- **Windows:** add a registry key at `HKEY_CURRENT_USER\Software\Microsoft\Office\16.0\PowerPoint\Options`, name `ExportBitmapResolution` (DWORD), value in pixels-per-inch — 300 is a reasonable print-quality target.
- **Mac:** run `defaults write com.microsoft.Powerpoint ExportBitmapResolution -int 300` in Terminal.
Either way, this is a one-time setting change, not something you configure per export.

**4. Pick PNG over JPEG for anything with text or sharp chart lines.** JPEG's compression introduces visible fuzzing around text and hard chart edges — fine for a photo, bad for a bar chart's data labels or an axis title. PNG is lossless and only meaningfully larger for slides that are mostly text and vector shapes anyway, which describes almost every data slide.

**5. Copy a single chart as a picture instead of exporting the whole slide.** If you only need the chart itself — not the slide's title or surrounding whitespace — right-click the chart and choose "Save as Picture," or select it and Copy → Paste Special → Picture into another document. This skips the export-then-crop step entirely when the deliverable is the chart, not the slide it lives on.

**6. Match the destination before you paste.** An image pasted at native resolution into a Slack message displays fine at Slack's own preview size, but the same image dropped into a Word report at full page width can look blurry if the source resolution was too low for that scale — this is exactly what step 3 fixes, so it's worth doing once rather than re-exporting at higher resolution every time a chart needs to go somewhere larger than a chat window.

Once the resolution default is set, exporting a slide as a shareable image is a two-click habit instead of a screenshot-and-crop workaround — and the result actually looks like it came from the deck, not a screen capture of it.
