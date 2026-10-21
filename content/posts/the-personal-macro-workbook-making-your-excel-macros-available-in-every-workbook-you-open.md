---
title: "The Personal Macro Workbook: Making Your Excel Macros Available in Every Workbook You Open"
date: "2026-10-21"
tags: ["excel", "vba", "automation", "productivity"]
excerpt: "How to store your everyday Excel macros in PERSONAL.XLSB so they run from the Quick Access Toolbar in any workbook, instead of rebuilding them in every new file."
---

A macro recorded or written inside a specific workbook only works in that workbook. If you clean up an export, rename headers, or reformat a report the same way every week across different files, re-recording the same steps per workbook gets old fast. The fix is the Personal Macro Workbook — a hidden workbook, `PERSONAL.XLSB`, that Excel opens automatically in the background every time it starts, so any macro stored there is available no matter which file you're actually working in.

**1. Create it the first time you record a macro.** On the Developer tab, click Record Macro, and in the "Store macro in" dropdown pick "Personal Macro Workbook" instead of "This Workbook." Excel creates `PERSONAL.XLSB` the moment you do this and saves it in your user profile's XLSTART folder, where it loads silently every time Excel opens.

**2. Find it again through the VBA editor, not the file system.** Because it's hidden by default, you won't see it by browsing normally in File Explorer — open the VBA editor (Alt+F11) and look for `VBAProject (PERSONAL.XLSB)` in the Project pane. That's where every macro you've stored there lives, organized into modules just like a regular workbook.

**3. Write general-purpose macros, not file-specific ones.** A macro in PERSONAL.XLSB runs against whatever workbook currently has focus, so hardcoding a sheet name or file path defeats the point. Reference `ActiveWorkbook` and the current selection instead, so the same macro works whether you're cleaning a CSV export today or a different one next week.
```vba
Sub StripDollarSignsAndCommas()
    Dim cell As Range
    For Each cell In Selection
        If cell.HasFormula = False Then
            cell.Value = Val(Replace(Replace(cell.Value, "$", ""), ",", ""))
        End If
    Next cell
End Sub
```

**4. Pin your most-used macros to the Quick Access Toolbar.** Right-click the QAT, choose "Customize Quick Access Toolbar," set the dropdown to "Macros," and add the ones you reach for constantly. Assign a keyboard shortcut through Developer → Macros → Options for the one or two you use dozens of times a day, and a cleanup step that used to take five minutes of manual formatting becomes a single click.

**5. Keep a backup, since one hidden file now holds all your tooling.** Because every macro lives in one `PERSONAL.XLSB` file under your AppData/XLSTART folder, losing that file — a new machine, a wiped profile — loses everything at once. Periodically copy it somewhere backed up, or export each module from the VBA editor (right-click → Export File) into a folder you keep in version control.

Once it's set up, the Personal Macro Workbook turns one-off recorded macros into permanent tools that follow you across every workbook you touch — the same payoff as a personal utility belt, without needing an add-in or installing anything extra.
