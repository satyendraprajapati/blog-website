---
title: "PowerPoint's Custom Shows: One Slide Deck, Multiple Audiences, Without Duplicating Files"
date: "2026-11-23"
tags: ["powerpoint", "data-storytelling", "workflow"]
excerpt: "How to maintain a single master deck of analysis slides and present a different subset and order of it to execs, stakeholders, and your own team using Custom Shows."
---

The usual way this goes: you build one deck for the executive readout, then copy it to build a longer version for the working team, then copy that to build a backup-slides version for anticipated questions. Three files, one analysis, and the moment a number changes, you're updating it in three places and hoping you didn't miss one. PowerPoint's **Custom Shows** feature exists to stop this — it lets one file hold every slide you've built, with named subsets that play in whatever order each audience needs.

**1. Build every slide you might need into one master deck first.** Executive summary, detailed breakdowns, methodology notes, backup slides for likely questions — all of it lives in a single file, in whatever order is convenient for building and maintaining it. Custom Shows don't require you to pre-sort slides into any particular arrangement; they reference slides by their existing slide number regardless of where they sit in the deck.

**2. Open Slide Show → Custom Slide Show → Custom Shows.** This opens a dialog listing any shows already defined, with buttons to add, edit, remove, or copy one. Click **New** to start building your first subset.

**3. Name the show and pick its slides, in the order you want them presented.** The **Define Custom Show** dialog lists every slide in the deck on the left; check the ones you want and click **Add** to move them to the list on the right, where you can reorder them with the up/down arrows independent of their position in the master deck. A slide numbered 14 can play before slide 3 in this version with no change to the underlying file.

**4. Build one show per audience, reusing slides across shows freely.** Create `Exec Summary` with just the five headline slides, `Full Walkthrough` with those five plus every supporting slide, and `Backup — Methodology Questions` with the technical slides you only want on hand if asked. The same slide can appear in all three; it's one object in the file, referenced by multiple shows, so editing it once updates it everywhere it's used.

**5. Present a specific show without exposing the rest of the deck.** From Slide Show → Custom Slide Show, select the show by name and it runs as if the deck contained only those slides, in that order — Next and Previous move through the custom sequence, not the master deck's full slide order, and slides not in the show never appear.

**6. Link directly to a custom show for self-navigated decks.** Insert → Links → Action lets you attach a "Run custom show" action to a button or piece of text, which is how you'd build a menu slide offering "View Detailed Analysis" or "View Executive Summary" as clickable options inside a single self-serve file, each jumping into a different custom show.

**7. A custom show is a view, not a copy — know what that means for sharing.** Emailing the file sends the entire master deck, backup slides included, even if you only intend the recipient to see the `Exec Summary` show; Custom Shows control what plays during a live presentation, not what's accessible if someone opens the file and clicks through manually. If backup or methodology slides are genuinely confidential, export that specific show to a separate file (File → Export → Create a Video or print selection) rather than relying on the show definition to hide them.

Once the habit sticks, the master-deck-plus-custom-shows structure means every number gets fixed exactly once, and the version you hand to the exec team is never quietly out of sync with the one your own team is working from.
