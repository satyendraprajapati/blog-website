---
title: "Excel's Comments vs. Notes: Which to Use for Reviewing a Data Report"
date: "2026-11-15"
tags: ["excel", "collaboration", "beginner"]
excerpt: "Excel has two different sticky-note features that look similar but behave completely differently during a review cycle -- picking the wrong one loses the conversation."
---

Right-click a cell in Excel and you'll see two options that sound almost identical: *New Comment* and *New Note*. They used to be the same feature under one name, and a lot of analysts still use whichever one the menu happens to show first. They're built for different jobs, and mixing them up during a review cycle is how feedback gets lost.

**1. Notes are static annotations — the old "Comments" from before 2019.** A Note is a yellow sticky square pinned to a cell, meant for a reminder to yourself or a one-line explanation of where a number came from. It has no reply thread, no author tagging beyond whoever typed it, and no resolved state — it just sits there until someone deletes it. Reach for a Note when you want to document something ("this figure excludes returns") rather than start a back-and-forth.

**2. Comments are threaded and built for conversation.** A Comment shows the author's name and timestamp, supports replies underneath the original, and can be marked *Resolved* once the issue is handled. If a reviewer needs to ask "why does this total not match last month's?" and you need to answer back in the same place, a Comment keeps that exchange attached to the cell instead of scattered across email or Slack.

**3. Use `@mentions` in Comments to pull a specific person into the review.** Typing `@` followed by a name inside a Comment (when the file is stored on OneDrive or SharePoint) sends that person a notification email with a direct link to the cell — far faster than telling someone "check cell F12 on the Q3 tab" over chat and hoping they open the right file.

**4. Resolve Comments instead of deleting them.** Deleting a Comment erases the whole exchange, which is a problem if someone later asks "didn't we already discuss this discrepancy?" Clicking *Resolve* collapses the thread and grays it out, but keeps the full history available if you click it open again — a much better audit trail for a report that goes through several review rounds.

**5. Check the Reviewing pane to see every open item on a large workbook.** On a report spread across a dozen tabs, scrolling to find every yellow or purple flag wastes time. `Review → Show Comments` opens a pane listing every open Comment with a jump-to link, so you can work through a review in order instead of hunting tab by tab.

**6. Convert old Notes to Comments when a static file turns into a live review.** If a workbook was built with legacy Notes and now needs a proper back-and-forth with stakeholders, right-click any Note and choose *Convert to Comment* — this moves the existing text into the new threaded format instead of forcing you to retype everything from scratch.

**7. Default to Notes for your own working file, Comments for anything shared.** A personal working copy full of little "double-check this" reminders doesn't need the overhead of threads and resolution states. The moment the file goes out for review, that's the signal to switch to Comments, since that's the only one of the two built to survive more than one round of feedback.

Both features look the same at a glance — a small marker in the corner of a cell — but only one of them is built to hold a conversation. Picking the right one up front saves a review cycle's worth of "wait, where did that feedback go?"
