---
title: "Sharing a PowerPoint Data Deck via OneDrive or SharePoint Links: View-Only, Expiration Dates, and Password Protection"
date: "2026-11-26"
tags: ["powerpoint", "productivity", "beginner"]
excerpt: "How to control exactly who can open, edit, or keep forwarding a shared PowerPoint data deck using OneDrive and SharePoint link settings."
---

Emailing a `.pptx` attachment means you've lost control of it the moment it leaves your outbox — anyone it gets forwarded to can open it, copy the numbers out, and forward it again. Sharing a link instead, through OneDrive or SharePoint, keeps the file in one place and lets you set exactly what the recipient can do with it.

**1. Share from inside PowerPoint, not just from OneDrive's file browser.** Click **Share** in the top-right corner of the deck itself. This opens the same link-sharing options as OneDrive, but keeps you in context — you can confirm the deck looks right before generating a link for it.

**2. Choose "People with existing access" or specific people over "Anyone with the link" by default.** The broad "anyone" option is convenient for a quick share but means the link itself becomes the only security boundary — if it leaks into a forwarded email thread or a chat log, anyone who finds it gets in. Naming specific people ties access to their actual sign-in.

**3. Set the link to "Can view" for a data readout, not "Can edit."** This is the single most common misconfiguration: decks shared for review get sent with edit access by default, which means a stakeholder's accidental keystroke can change a number on a chart before the next person opens it. View-only doesn't prevent downloading unless you also restrict that explicitly in step 5.

**4. Add an expiration date for anything time-sensitive or external.** Under the link settings, **Set expiration date** lets you specify exactly when the link stops working — useful for a quarterly deck that shouldn't still be circulating with stale numbers a year later, or an external link shared with a client for a single review window.

**5. Require a password for anything leaving your organization.** Combined with an expiration date, a password closes the main gap in link-based sharing: even if the link is forwarded somewhere you didn't intend, the recipient still needs a password you control and can change.

**6. Block downloading if the deck should only ever be viewed, not kept.** The **"Block download"** toggle (available on view-only links) renders the deck in the browser without letting the recipient save a local copy — appropriate for genuinely sensitive numbers, though be aware it doesn't stop a screenshot, so it's a deterrent rather than a guarantee.

**7. Check who currently has access before re-sharing an old deck.** Over **File → Info → Manage Access** (or the "Manage access" option in the Share panel), you can see every person and every link with access to that file, and revoke individual links without regenerating a new one for everyone else. This is the step people skip, and it's how a deck ends up still reachable by someone who left the project months ago.

These settings live on the file in OneDrive or SharePoint, not in the `.pptx` itself, so they keep working even after the deck has been updated — the same link always points to the current version, with the same access rules attached.
