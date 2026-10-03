---
title: "Building a RAG (Red/Amber/Green) Status Table for Project and KPI Reporting in PowerPoint"
date: "2026-10-03"
tags: ["powerpoint", "data-storytelling", "beginner"]
excerpt: "A status report isn't really about the numbers, it's about which ones need attention right now — a RAG table answers that at a glance, before anyone reads a single figure."
---

A heatmap-style table shades cells along a continuous color gradient to show relative magnitude. A RAG table does something different on purpose: it sorts each row into exactly three buckets — on track, at risk, off track — because a status report isn't asking "how big is this number," it's asking "does someone need to act on this." Collapsing a KPI down to one of three colors is the feature, not a simplification you're settling for.

**1. Build the table first with plain text status labels, not colors.** Insert a table with one row per project or KPI and a dedicated "Status" column holding the word Green, Amber, or Red. Getting the labeling decision right — and agreeing with stakeholders on what counts as "Amber" versus "Red" ahead of time — matters more than the visual, and it's much easier to review and correct as text than as a column of ambiguous colored dots.

**2. Convert the status column to shapes, not cell fill.** Shading an entire cell red reads as "this row is bad" at a scan; a small colored circle or square sitting inside the cell reads as "this is a status marker" and leaves room for the rest of the row's formatting — bold text for Red rows, for instance — without the whole row turning into a solid color block. Insert a small circle shape, fill it with your Red/Amber/Green color, remove its outline, and resize it to sit inside the row height.

**3. Build one shape per color, then copy-paste instead of reformatting each one.** Make your Green circle once, set its exact fill color, then duplicate it for every Green row with Ctrl+D or copy-paste. This keeps every "Green" marker pixel-identical instead of three slightly different shades of green because you eyeballed the fill picker three separate times.

**4. Use a colorblind-safe palette, not literal stoplight red/green.** Roughly 1 in 12 men can't reliably distinguish red from green, which is exactly the two colors this format depends on most. Swap in a blue/orange/red-adjacent palette, or add a shape difference on top of color — a circle for on-track, a triangle for at-risk, a square for off-track — so the status still reads correctly without relying on color perception alone.

**5. Add a one-line "why" next to every Amber or Red status, never just the color.** A red dot tells a stakeholder something needs attention; it doesn't tell them what. A short "Delayed — vendor contract pending" note next to the marker is what turns the slide from a status check into something actionable in the meeting it's presented in.

**6. Keep the bucket boundaries consistent across every report you send**, not just within one slide. If "Amber" means "within 5% of budget" this month and "within 10%" next month, the same project can flip color between two reports with no real change underneath it — which is the fastest way for a RAG table to lose a stakeholder's trust. Write the thresholds down once, outside the deck, and reuse them every time.

The table looks simple because it's meant to be read in five seconds from across a conference room — the actual work is agreeing on what separates Green from Amber from Red before a single shape gets colored in.
