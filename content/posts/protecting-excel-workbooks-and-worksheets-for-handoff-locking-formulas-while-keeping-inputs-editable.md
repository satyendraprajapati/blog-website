---
title: "Protecting Excel Workbooks and Worksheets for Handoff: Locking Formulas While Keeping Inputs Editable"
date: "2026-09-06"
tags: ["excel", "data-integrity", "beginner"]
excerpt: "A quick way to stop a handed-off Excel report from breaking the first time someone edits the wrong cell — lock the formulas, leave the inputs open."
---

Freeze panes and print areas make a report look right when you hand it off, but they do nothing to stop the report from breaking the first time someone types over a formula by accident. Every cell in Excel is locked by default, but that setting only takes effect once you turn on sheet protection — until then, "locked" cells are just as editable as everything else.

**1. Unlock the input cells first, before you protect anything.** Select the cells someone should actually be able to change — assumptions, a date filter, a target number — then open **Format Cells → Protection** and uncheck **Locked**. Do this before turning on protection, because every cell starts locked, and protection only enforces whatever locked/unlocked state each cell already has.

**2. Turn on protection from the Review tab.** **Review → Protect Sheet** locks every cell you didn't unlock in step 1. Add an optional password if you want to stop casual edits, but treat it as a guardrail against mistakes, not real security — sheet protection passwords are trivial to remove and shouldn't guard anything sensitive.

**3. Choose what stays allowed under protection.** The Protect Sheet dialog lists checkboxes like "Select unlocked cells," "Sort," "Use AutoFilter," and "Format cells." A report with a filterable table usually needs "Use AutoFilter" and "Sort" checked, or the whole sheet becomes unusable the moment someone tries to filter a column.

**4. Hide the logic you don't want reverse-engineered or nudged out of place.** Combine **Format Cells → Protection → Hidden** with sheet protection to hide a formula's contents from the formula bar entirely — useful for a helper column or a pricing calculation you don't want someone copying into their own version. `Hidden` alone does nothing without protection turned on; the two settings only work together.

**5. Protect the workbook structure separately if sheets shouldn't be added, deleted, or reordered.** **Review → Protect Workbook** is a different setting from sheet protection — it stops someone from inserting a new tab, deleting the "Raw Data" sheet, or dragging your summary tab to the wrong position, but it doesn't lock any cells. A handoff workbook with multiple linked sheets usually needs both protections, not just one.

**6. Test it as the recipient would use it, not as you built it.** Before sending the file, try filtering, sorting, and entering a value in every input cell you unlocked. It's a common mistake to protect a sheet, discover a legitimate action is now blocked, and only find out when the recipient emails back confused — five minutes testing the protected version saves that round trip.

```excel
' Quick VBA macro to protect every sheet in a workbook at once,
' useful when a report has many tabs built the same way
Sub ProtectAllSheets()
    Dim ws As Worksheet
    For Each ws In ThisWorkbook.Worksheets
        ws.Protect Password:="", AllowFiltering:=True, AllowSorting:=True
    Next ws
End Sub
```

None of this replaces version control or a real audit trail — it's a cheap way to stop the most common failure mode of a shared report: someone typing a number over a formula, not noticing, and reporting a wrong total three weeks later.
