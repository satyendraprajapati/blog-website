---
title: "Custom Views in Excel: Saving Your Own Filter and Print Setup Without Disrupting a Shared Workbook"
date: "2026-11-05"
tags: ["excel", "productivity", "beginner"]
excerpt: "Excel's Custom Views feature saves your own filters, hidden columns, and print setup on a shared workbook without changing what anyone else sees when they open it."
---

A shared tracker workbook has one annoying property: everyone wants it set up differently. You want three columns hidden and the list filtered to your region; your manager wants it filtered to the whole team and ready to print on one page; someone else wants every column visible for an audit. Whoever opens the file last and saves it "wins," and the next person inherits a setup that isn't theirs. Custom Views fixes this without touching permissions, extra sheets, or a single formula.

**1. Set the workbook up exactly the way you want it, then save it as a view.** Apply your filter, hide the columns you don't need, and set your print area and orientation — then go to *View → Custom Views → Add*, name it something like "My Region," and click OK. Excel snapshots the current filter state, hidden rows/columns, selected cell, window size, and print settings under that name.

**2. Save a second view for whatever the "default" or shared state should look like.** Before you start customizing, add a view called "Full Data" or "Team Default" with nothing filtered and nothing hidden. This matters more than your personal view does — it's the one other people can return to with one click instead of manually unhiding everything you hid.

**3. Switch views instead of re-applying filters by hand.** Once two or more views exist, *View → Custom Views* lists them by name — double-click one and Excel restores that exact filter, hidden-column, and print setup in a second. This is the whole point: the setup you'd otherwise rebuild every time you reopen the file is one click away, for you and for anyone else who knows the view exists.

**4. Keep totals accurate regardless of which view is active, using `SUBTOTAL`.** Because different views hide different rows, a plain `SUM` can quietly include rows a given view is hiding. `SUBTOTAL` with function code `109` sums only the rows currently visible, so a totals row stays correct no matter which Custom View — or manual filter — is active:
```excel
=SUBTOTAL(109, SalesData[Amount])
```

**5. Know the two things Custom Views can't survive: Tables and shared/co-authored files.** Custom Views don't save if the workbook contains an Excel Table (a plain range works fine, so this is one case for sticking with ranges plus `SUBTOTAL` over converting everything to a Table) and the *Add* option is grayed out entirely in a file that's being co-authored in real time. Switch to exclusive edit mode first if you need to add a view to a file that's normally shared.

**6. Name views so a teammate can guess what they do without opening them.** "View 1" and "View 2" save nothing if nobody remembers which is which six weeks later. A naming pattern like "Filtered – West Region" or "Print – One Page Landscape" means the right view is obvious from the dropdown alone, which is what makes this worth setting up on a workbook more than one person touches.

Custom Views is one of the few Excel features that costs nothing to set up and pays off every single time the workbook is reopened — it's worth adding to any tracker or report file more than one person works from regularly.
