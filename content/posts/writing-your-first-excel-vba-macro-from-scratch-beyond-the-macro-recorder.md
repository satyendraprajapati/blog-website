---
title: "Writing Your First Excel VBA Macro From Scratch (Beyond the Macro Recorder)"
date: "2026-09-27"
tags: ["excel", "vba", "automation"]
excerpt: "How to write a small VBA routine by hand — with a variable, a loop, and a decision — once a task outgrows what the Macro Recorder can capture."
---

The Macro Recorder is a great starting point, but it only captures fixed, click-by-click sequences. The moment a task needs to loop over an unknown number of rows, skip rows based on a condition, or accept a parameter like "this month's data," you need to write VBA by hand. It's less intimidating than it looks — most everyday macros are just a variable, a loop, and an `If`.

**1. Open the VBA editor and add a module.** Press `Alt+F11`, right-click your workbook in the Project pane, and choose `Insert > Module`. This is a blank canvas — unlike a recorded macro, nothing gets written here until you type it.

**2. Declare variables instead of hard-coding cell references.** A recorded macro says `Range("A2:A500")`; hand-written VBA says "loop until the data runs out." Use `Cells(row, column)` addressing with a variable `row`, and find the last used row with `End(xlUp)` so the macro still works next month when the row count changes.

```vba
Sub FlagLowMargin()
    Dim lastRow As Long
    Dim r As Long
    Dim margin As Double

    lastRow = Cells(Rows.Count, "C").End(xlUp).Row

    For r = 2 To lastRow
        margin = Cells(r, "C").Value
        If margin < 0.1 Then
            Cells(r, "C").Interior.Color = RGB(255, 199, 206)
        Else
            Cells(r, "C").Interior.ColorIndex = xlNone
        End If
    Next r

    MsgBox "Checked " & (lastRow - 1) & " rows."
End Sub
```

**3. Use `For...Next` for "do this to every row" and `If...Then` for "but only when."** Those two constructs alone cover the majority of real report-cleanup macros — flagging outliers, copying rows that meet a condition to another sheet, or clearing formatting that a prior process left behind.

**4. Turn hard-coded values into arguments so one macro handles many cases.** A recorded macro can't ask "which column?" — it just is that column. A hand-written `Sub` can take parameters, so the same logic runs against any sheet you pass it.

```vba
Sub FlagBelowThreshold(colLetter As String, threshold As Double)
    Dim lastRow As Long, r As Long
    lastRow = Cells(Rows.Count, colLetter).End(xlUp).Row
    For r = 2 To lastRow
        If Cells(r, colLetter).Value < threshold Then
            Cells(r, colLetter).Font.Bold = True
        End If
    Next r
End Sub
```

**5. Turn off screen updating for anything that touches more than a few hundred cells.** `Application.ScreenUpdating = False` at the top of the routine (and `= True` at the end) stops Excel from redrawing after every single cell change, which turns a macro that visibly crawls down the sheet into one that finishes instantly.

**6. Add basic error handling before you hand it to anyone else.** `On Error Resume Next` masks real bugs, so use it sparingly and only around a specific line you expect might fail (like a sheet that may not exist), then check `Err.Number` and reset it with `On Error GoTo 0` right after.

**7. Step through it with F8 before trusting it on real data.** The VBA editor lets you execute one line at a time and watch variables change in the Locals window (`View > Locals Window`). This catches an off-by-one loop bound or a wrong column letter before it silently mangles a live report.

A recorded macro is still the fastest way to discover the right object and property names — record one first, then borrow those names into a hand-written routine that can actually make decisions instead of just replaying clicks.
