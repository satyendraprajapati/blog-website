---
title: "Getting Started with Excel Macros: Recording Your First One"
date: "2026-07-27"
tags: ["excel", "vba", "automation"]
excerpt: "How to use Excel's Macro Recorder to turn a repetitive formatting or cleanup task into a one-click button, without writing VBA from scratch."
---

Power Query is the right tool for repeatable data transformations, but plenty of repetitive Excel work isn't a data transformation at all — it's formatting, resizing columns, hiding rows, or applying the same set of filters every time a report lands in your inbox. For that kind of task, the Macro Recorder is the fastest way in, and you don't need to know VBA to use it.

**1. Turn on the Developer tab first.** It's hidden by default. Go to `File > Options > Customize Ribbon`, check the "Developer" box in the right-hand list, and you'll get a new ribbon tab with `Record Macro`, `Stop Recording`, and `Macros` buttons.

**2. Record a macro exactly like you'd do the task manually.** Click `Record Macro`, give it a name with no spaces (e.g. `FormatWeeklyReport`), and click OK. Now do the steps for real — bold the header row, apply a number format, freeze the top row, auto-fit the columns. Every click is captured. Click `Stop Recording` when you're done.

**3. Look at the generated code once, even if you never touch it again.** Open `Alt+F11` to see the VBA editor, find your macro under `Modules`, and skim it. You'll see it's mostly `Range("A1").Select` followed by a property change — recorded macros are verbose and inefficient, but they're a legible record of exactly what you did, which makes them a useful debugging tool even before you write a line of VBA by hand.

```vba
Sub FormatWeeklyReport()
    Rows("1:1").Font.Bold = True
    Range("D:D").NumberFormat = "#,##0"
    ActiveWindow.FreezePanes = False
    Range("A2").Select
    ActiveWindow.FreezePanes = True
    Cells.EntireColumn.AutoFit
End Sub
```

**4. Assign it to a button so you never open the VBA editor again.** Insert a shape or use `Insert > Button (Form Control)` from the Developer tab, draw it on the sheet, and assign your macro to it in the dialog that pops up. Now the whole formatting pass is one click for you or anyone else who opens the file.

**5. Save as a macro-enabled workbook.** Excel won't let you keep macros in a normal `.xlsx` file — you need `.xlsm` (`File > Save As`, choose "Excel Macro-Enabled Workbook"). If you skip this, Excel silently strips the macro on save and you'll find the button does nothing next time you open the file.

**6. Know where the ceiling is.** The recorder is great for fixed, click-by-click sequences, but it can't take a parameter (like "this month" vs "last month"), can't loop over a variable number of rows cleanly, and can't make decisions based on cell values. Once a task needs any of that, you're better off hand-editing the recorded code or writing a small VBA routine directly — but recording one first still gives you a working skeleton and the exact object names (`Range`, `Rows`, `NumberFormat`) to build from, instead of starting from a blank module and a syntax reference.

A recorded macro won't replace Power Query for pulling and reshaping data, but for the click-heavy formatting pass that happens after the data's already right, it's the lowest-effort way to stop doing the same ten clicks every single week.
