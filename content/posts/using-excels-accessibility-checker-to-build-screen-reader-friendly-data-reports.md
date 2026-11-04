---
title: "Using Excel's Accessibility Checker to Build Screen-Reader-Friendly Data Reports"
date: "2026-11-04"
tags: ["excel", "accessibility", "data-analysis"]
excerpt: "How to use Excel's built-in Accessibility Checker to catch the table and chart issues that make a report unusable with a screen reader before you send it out."
---

A report that looks perfectly clean on screen can still be unreadable for a colleague using a screen reader — merged header cells, unlabeled charts, and "see the table below" phrasing all break down the moment the content isn't being read visually. Excel has a built-in Accessibility Checker for exactly this, and most analysts never open it.

**1. Run the checker before you send anything out.** Go to **Review > Check Accessibility**. It opens a pane on the right that groups issues into Errors, Warnings, and Tips, and clicking any issue jumps you straight to the offending cell, chart, or object — you don't have to hunt for what it's complaining about.

**2. Fix merged cells in your header rows first.** Merged cells are the single most common error the checker flags, and they're everywhere in hand-built reports — a title spanning several columns, a merged "Q1 Totals" banner above three sub-columns. A screen reader can't associate a merged cell with the data underneath it the way a sighted reader visually can. Unmerge and use **Center Across Selection** (Format Cells > Alignment > Horizontal) instead — it gives you the same visual centering without breaking the cell-to-data relationship.

**3. Give every chart and shape real alt text, not a filename.** The checker flags any picture, chart, or SmartArt without alternative text. Right-click the object, choose **Edit Alt Text**, and write a sentence that states the takeaway, not just the chart type — "Bar chart showing West region revenue up 18% year over year" is useful; "Chart1" is not. For a chart built from a table, you can draft that sentence with a formula instead of writing it by hand each time you refresh the report:

```excel
=CONCAT("Revenue by region, ", TEXT(MIN(Sales[Date]),"mmm yyyy"), " to ", TEXT(MAX(Sales[Date]),"mmm yyyy"), ". Highest: ", TEXT(MAXIFS(Sales[Revenue], Sales[Revenue], MAX(Sales[Revenue])), "$#,##0"))
```

Paste the result of that cell into the chart's alt text field, and it updates itself every time the underlying data changes — no more alt text that silently goes stale after the next refresh.

**4. Use real table headers, not a bold top row.** Converting a range to an Excel Table (**Insert > Table**, or `Ctrl+T`) does more than add filter buttons — it tags the header row as an actual header in the file's structure, which is what lets a screen reader announce "Region, column 1" instead of just reading cell text with no context. A manually bolded row looks identical on screen but carries none of that information.

**5. Avoid conveying meaning through color alone.** The checker's Tips section will flag heavy reliance on conditional-formatting color alone (e.g., red/green status cells with no label). Add a text or icon alongside the fill color — a small "OK" / "Risk" column, or a status icon set — so the same information survives for colorblind readers and screen reader users alike, who get no benefit from a cell's fill color at all.

**6. Set a logical reading order for sheets with multiple report sections.** If a sheet has several tables and charts side by side, a screen reader walks them in the order they were added to the sheet, not necessarily their visual left-to-right position. The Accessibility Checker's "reading order" tips call out sheets where this mismatch is likely — worth a check on any dashboard-style sheet with more than one block of content.

None of this takes long once it's part of your pre-send checklist, and running the checker costs nothing — it's already in the ribbon, it just rarely gets opened until someone asks why a report didn't work for them.
