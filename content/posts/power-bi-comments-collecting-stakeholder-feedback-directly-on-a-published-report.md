---
title: "Power BI Comments: Collecting Stakeholder Feedback Directly on a Published Report"
date: "2026-11-14"
tags: ["power-bi", "collaboration", "data-analysis", "beginner"]
excerpt: "Power BI's built-in Comments pane lets report viewers leave feedback and @mention you directly on a visual, instead of feedback arriving scattered across email and chat."
---

A published Power BI report usually gets feedback through email threads, Teams messages, or a screenshot with a red circle drawn on it — none of which stay attached to the report itself. The Comments feature puts that feedback on the report, next to the visual it's actually about.

**1. It lives in the Comments pane, opened from the report toolbar.** In the Power BI Service, every report has a speech-bubble icon that opens a side pane. Comments can be added at the report level or pinned to a specific visual, which is the more useful case — "this number looks off" means a lot more attached to the actual chart than floating in an inbox.

**2. Comments on a visual stay anchored to it, filters and all.** When someone adds a comment while a slicer is applied, Power BI records that filter context alongside the comment. Reopening the comment can take you back to the same filtered view the commenter was looking at, so "the Q3 West region number looks wrong" isn't ambiguous about which Q3 or which region.

**3. @Mentioning someone sends them a notification and an email.** Typing `@` and a colleague's name in a comment, the same way you'd mention someone in Teams, notifies them directly — no need to separately message them to say "I left a comment, go check it." This is usually the fastest way to get a specific person's eyes on a specific number.

**4. Replies turn a comment into a thread.** Anyone with access to the report can reply to an existing comment, which keeps a back-and-forth about one issue together instead of spawning a new email chain each time someone has a follow-up question.

**5. Comments require the viewer to have access to the report, not just a link.** Someone viewing through "Publish to Web" or an embedded, unauthenticated view won't see the Comments pane at all — it's a Power BI Service feature tied to a signed-in viewer with proper permissions. If your audience is external and unauthenticated, you'll still need another feedback channel for them.

**6. They don't export with the report and aren't visible in Desktop.** Comments live in the Service against the published report, not in the .pbix file. Exporting to PDF or PowerPoint, or opening the file back in Power BI Desktop, won't show them — so don't rely on comments as permanent documentation inside the file itself; treat them as a feedback inbox, not a spec.

**7. Resolving or deleting old comments keeps the pane useful.** A report that's been live for months can accumulate comments about issues long since fixed. There's no automatic archiving, so periodically clearing resolved feedback keeps new commenters from stumbling on stale complaints and assuming nothing ever got addressed.

Comments won't replace a proper requirements process for a brand-new report, but for the ongoing "is this number right" conversation that happens after a dashboard ships, having that conversation attached to the exact visual it's about beats chasing it down across three different apps.
