---
title: "Automating Repetitive PowerPoint Formatting with VBA Macros for Data Decks"
date: "2026-11-16"
tags: ["powerpoint", "vba", "automation", "beginner"]
excerpt: "The same font-fixing, logo-placing, chart-reformatting clicks you repeat on every data slide can be recorded once as a VBA macro and replayed in seconds."
---

If you build weekly data decks, you've probably done the same fifteen clicks on every chart slide: fix the font, resize the title box, nudge the logo into the corner, reapply the same color to every data label. Excel analysts reach for a macro for this kind of repetition almost automatically — PowerPoint has the same tool, it just gets used far less.

**1. PowerPoint's macro recorder doesn't exist, but the VBA editor does.** Unlike Excel, PowerPoint has no built-in "Record Macro" button, so every macro here is written directly in the VBA editor rather than recorded from clicks. Open it with **Alt+F11**, then **Insert > Module** to get a blank place to write code. It sounds like a bigger step than Excel's recorder, but most formatting macros are short enough that writing them directly is just as fast.

**2. A macro that reformats every chart title on the current slide:**

```vba
Sub FixChartTitles()
    Dim shp As Shape
    For Each shp In ActiveWindow.View.Slide.Shapes
        If shp.HasChart Then
            With shp.Chart.ChartTitle.Font
                .Name = "Segoe UI"
                .Size = 14
                .Bold = True
            End With
        End If
    Next shp
End Sub
```

Run it with **F5** while that slide is open, or assign it to a button on the Quick Access Toolbar so it's one click away on every deck you build.

**3. Looping across every slide, not just the active one, takes one more layer:**

```vba
Sub FixAllTitlesInDeck()
    Dim sld As Slide
    Dim shp As Shape
    For Each sld In ActivePresentation.Slides
        For Each shp In sld.Shapes
            If shp.HasTextFrame Then
                If shp.Name Like "Title*" Then
                    shp.TextFrame.TextRange.Font.Name = "Segoe UI"
                End If
            End If
        Next shp
    Next sld
End Sub
```

This is the version worth keeping — it fixes a font inconsistency across a 40-slide deck in under a second instead of clicking through every title box by hand.

**4. Save macros where every deck can use them, not just the current file.** A macro saved inside a regular `.pptx` only exists in that file. To reuse it across every deck you build, save your macros in PowerPoint's macro-enabled template (`.potm`) or keep a small `.pptm` "macro toolbox" presentation open in the background — Alt+F8 lets you run a macro from any open presentation, including one borrowed from a different open file.

**5. Treat macros as a formatting tool, not a build-the-whole-deck tool.** The sweet spot is the repetitive, mechanical cleanup pass — fonts, colors, logo placement, alt text, removing speaker notes before sharing externally — not generating charts or writing narrative content, which still need a human making judgment calls about the story. For deck generation from scratch, tools like `python-pptx` or Power Automate are a better fit; VBA macros are for fixing the same ten things, fast, on a deck that already exists.

Once you have two or three of these saved, the actual time cost of "formatting the deck" on a recurring report starts approaching zero.
