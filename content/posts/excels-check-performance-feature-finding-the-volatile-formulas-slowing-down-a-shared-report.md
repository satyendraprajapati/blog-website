---
title: "Excel's Check Performance Feature: Finding the Volatile Formulas Slowing Down a Shared Report"
date: "2026-11-26"
tags: ["excel", "productivity", "data-analysis"]
excerpt: "How to use Excel's built-in performance checker to find the slow, recalculating-on-every-edit formulas that make a shared workbook lag."
---

A workbook that used to open instantly and now takes ten seconds to recalculate after every edit almost always has the same root cause: a handful of **volatile** formulas — ones that recalculate on *every* change anywhere in the workbook, not just when their own inputs change. Excel ships a tool that points at them directly instead of making you guess.

**1. Open Check Performance from the Formulas tab.** In modern Excel, click **Formulas → Check Performance** (on older builds it's buried under Formula Auditing). It scans the open workbook and lists formulas and ranges that are expensive to recalculate, ranked by estimated impact, rather than making you click through sheets hunting for the slow one.

**2. Know which functions are volatile by nature.** `NOW()`, `TODAY()`, `RAND()`, `RANDBETWEEN()`, `OFFSET()`, and `INDIRECT()` all force a full recalculation whenever anything in the workbook changes, even a cell they don't reference. A single `OFFSET()` in a 50,000-row table can be the difference between an instant edit and a multi-second freeze.

**3. Replace `OFFSET` with `INDEX` wherever you can.** `INDEX` returns a reference too, but it isn't volatile — it only recalculates when its own arguments change.
```excel
=SUM(OFFSET(A1,0,0,COUNTA(A:A),1))
=SUM(INDEX(A:A,1):INDEX(A:A,COUNTA(A:A)))
```
Same result, but the second version doesn't recalculate every time you edit an unrelated cell elsewhere in the sheet.

**4. Swap `INDIRECT` for structured references or `CHOOSE` when the ranges are known in advance.** `INDIRECT` is often used to build a dynamic sheet or range reference from text, but it's volatile and also breaks Excel's formula auditing arrows. If the set of possible ranges is fixed, `CHOOSE(MATCH(...), Range1, Range2, Range3)` gets the same dynamic behavior without the recalculation cost.

**5. Set calculation to Manual while auditing, not as a permanent fix.** Check Performance works best when you can trigger a recalculation (F9) and watch what lights up. Flip **Formulas → Calculation Options → Manual** temporarily so you can isolate which edit is triggering the slow chain, then switch back to Automatic once you've found and fixed the offending formulas — leaving a shared workbook on Manual calculation is a common source of "the numbers didn't update" bug reports from teammates.

**6. Re-run the check after each fix.** Check Performance re-scans on demand, so treat it like a diagnostic loop: fix the top offender, re-run, fix the new top offender, repeat. On a genuinely large workbook, two or three rounds usually account for most of the lag — the long tail of minor volatile formulas rarely matters once the worst ones are gone.

None of this requires touching VBA or restructuring the workbook. It's the same formulas, written slightly differently, and the payoff compounds every time the workbook is reopened or edited — not just once at analysis time.
