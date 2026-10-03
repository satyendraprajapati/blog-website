---
title: "Power BI Personal Bookmarks: Letting Report Viewers Save and Return to Their Own Filtered View"
date: "2026-10-03"
tags: ["power-bi", "self-service-bi", "beginner"]
excerpt: "A regional manager who re-applies the same three slicer selections every Monday doesn't need edit access to your report — Personal Bookmarks let them save that exact view for themselves."
---

Author-built Bookmarks are a report-design tool: you set up the slicer states and button navigation, and everyone who opens the report gets the same guided experience. That's the right tool when you're building the report. It's the wrong tool for the person who just wants to stop re-selecting "West Region, Last Quarter, Excluding Returns" every single time they open it. Personal Bookmarks solve that second problem, and they don't need you to do anything at all.

**1. It's a viewer feature, not an author feature.** Anyone with at least Viewer access to a published report in the Power BI Service can create one — no Edit permission, no workspace role beyond being able to open the report. That's the whole point: it moves "remember my filters" out of your backlog and onto the person who actually wants it remembered.

**2. Filter, slice, and drill however you like, then save it.** On the report page, apply whatever slicer selections, visual-level filters, or drill-down state you want to keep, open the Bookmarks pane, and choose "Add personal bookmark." Give it a name you'll recognize later — "My Q3 West Review" beats "Bookmark 3."

**3. It's private by default.** A personal bookmark only shows up for the person who created it. Your "West Region, Last Quarter" bookmark doesn't appear in anyone else's pane, and theirs don't appear in yours. This is the detail that makes it safe to roll out without a conversation: nobody's personal view can clutter or override the report's shared state for anyone else.

**4. It survives a scheduled data refresh.** The bookmark stores filter and slicer *selections* — "Region = West," "Quarter = Q3" — not a snapshot of the numbers themselves. When the underlying dataset refreshes, reopening the bookmark reapplies those same selections to the current data, so the manager sees this week's numbers through last week's saved lens instead of a frozen screenshot.

**5. It doesn't survive a structural change to the report.** If you (the author) delete the slicer it depended on, rename the page, or remove the field it filtered on, the personal bookmark can break or silently stop applying that filter. Worth a heads-up to frequent report viewers before a redesign, the same courtesy you'd extend before changing a URL that people have bookmarked in a browser.

**6. It's not a substitute for Row-Level Security.** A personal bookmark only changes what's *selected* in filters the viewer already has access to use — it can't unlock data that RLS or a report/visual-level filter already hides from that person. Someone can save a personal bookmark of everything they're allowed to see; they can't use one to see past a security boundary you've set up.

The fastest way to get adoption isn't an announcement — it's pointing out, the next time someone complains about re-filtering the same report every week, that the "Add personal bookmark" option has been sitting in the Bookmarks pane the whole time.
