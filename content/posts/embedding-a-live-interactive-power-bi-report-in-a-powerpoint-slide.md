---
title: "Embedding a Live, Interactive Power BI Report in a PowerPoint Slide"
date: "2026-08-27"
tags: ["powerpoint", "power-bi", "dashboard"]
excerpt: "Exporting Power BI to static slides works for stakeholders who don't have access — for those who do, the Power BI add-in embeds the actual report so it stays live and clickable inside the deck."
---

Pasting exported Power BI slides into a deck is the right call for an audience with no Power BI access, but it freezes the data at export time and loses every slicer, tooltip, and drill-through the report had. If your audience already has access to the workspace, the Power BI PowerPoint add-in embeds the live report itself, so the same slide shows current data every time it's opened and stays interactive during the meeting.

**1. Install the add-in from Insert → Add-ins → Power BI.** It's a Microsoft-published add-in available to anyone with a Microsoft 365 account — search "Power BI" in *Insert → Get Add-ins* and add it once; after that it's available in every presentation without reinstalling.

**2. Paste the report's link into the add-in pane, not an embed code.** Open the report in the Power BI Service, copy its URL from the address bar, and paste that link into the add-in's field on the slide. It renders the report canvas directly inside PowerPoint, matching what the viewer would see in a browser.

**3. Viewers need their own Power BI access to see live data.** The add-in doesn't bundle a static snapshot — it authenticates the person viewing the presentation against the same workspace permissions as the web report. Present it to someone without access and the tile shows a sign-in prompt instead of data, which is the one thing worth checking before you're in front of an audience.

**4. Slicers and filters work exactly as they do in the browser.** A viewer with edit or view permissions can click a slicer, hover a tooltip, or drill through on the embedded tile mid-presentation, the same as opening the report directly — useful for an "let's check that by region" moment without alt-tabbing out of the deck.

**5. Lock the view to a bookmark for a controlled presentation.** If you don't want the audience nudging filters mid-readout, set the report to a specific page and bookmark state before embedding, and consider using a Power BI viewer role rather than edit access so a stray click doesn't change what everyone else sees on a shared session.

**6. It needs an internet connection at presentation time.** Unlike an exported image or a linked Excel chart, the tile pulls live from the Power BI Service when the slide loads — worth a dry run on the actual meeting network beforehand, since a venue with restricted Wi-Fi will show a blank tile instead of a stale-but-visible one.

The static-export route still wins for a leave-behind PDF or an audience outside your tenant — this is the option for the internal readout where "can we filter to last quarter right now" is a question you'd rather answer live than promise to follow up on.
