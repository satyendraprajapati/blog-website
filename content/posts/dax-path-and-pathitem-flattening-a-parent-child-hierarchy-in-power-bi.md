---
title: "DAX PATH and PATHITEM: Flattening a Parent-Child Hierarchy in Power BI"
date: "2026-09-27"
tags: ["power-bi", "dax", "data-modeling"]
excerpt: "How to use PATH and PATHITEM to turn a self-referencing parent-child table — like an org chart or a chart of accounts — into flat, filterable level columns."
---

Some source tables don't arrive as a clean star-schema hierarchy — they arrive as a single table where each row points to its own parent: an employee table with a `ManagerID` column, or a chart of accounts where every account has a `ParentAccountID`. A matrix visual can't drill through that shape directly, and there's no fixed number of levels to build regular columns for. `PATH` and `PATHITEM` solve this without restructuring the source data.

**1. Understand what `PATH` actually returns.** Given an ID column and a parent-ID column, `PATH` walks up the chain from each row to the root and returns the whole trail as one delimited text string — for example `"1|4|9"` for an employee whose manager is 4, whose manager is 1.

```dax
EmployeePath = PATH(Employees[EmployeeID], Employees[ManagerID])
```

**2. Add it as a calculated column, not a measure.** `PATH` needs row context to know which row's ancestry to trace, so it belongs on the table itself, calculated once, rather than recalculated per visual interaction.

**3. Pull out a specific level with `PATHITEM`.** Once you have the path string, `PATHITEM` extracts the ID at a given depth — depth 1 is the root, depth 2 is one level down, and so on. Wrap it in `PATHITEMREVERSE` if you want to count from the employee upward instead of from the root down.

```dax
Level1ManagerID = PATHITEM([EmployeePath], 1, INTEGER)
Level2ManagerID = PATHITEM([EmployeePath], 2, INTEGER)
```

**4. Turn each level's ID into a readable name with `LOOKUPVALUE`.** A level column full of IDs isn't useful in a matrix on its own — join it back to the same table to get the name at that level.

```dax
Level1ManagerName =
LOOKUPVALUE(
    Employees[EmployeeName],
    Employees[EmployeeID],
    [Level1ManagerID]
)
```

**5. Find out how many levels you actually need with `PATHLENGTH`.** Rather than guessing how deep the hierarchy goes and building too many or too few level columns, calculate `PATHLENGTH(EmployeePath)` first and check its maximum across the table — that tells you exactly how many `Level*` column pairs to add.

**6. Build the levels into a Power BI hierarchy for drill-down.** Once you have `Level1ManagerName` through `LevelNManagerName` as regular columns, select them all, right-click, and choose "Create Hierarchy" — now a matrix or bar chart supports drill-down and drill-up through the org structure exactly like it would with a natural date or geography hierarchy.

**7. Use `PATHCONTAINS` for "is this person in that manager's whole reporting line" checks.** This is the piece that a flat `ManagerID` filter can't do on its own — a regional VP wants to see everyone underneath them, not just their direct reports.

```dax
IsInReportingLine =
PATHCONTAINS(Employees[EmployeePath], SELECTEDVALUE(Employees[EmployeeID]))
```

The whole approach only works cleanly if IDs are unique across the table and there are no circular references (an employee who is, a few levels up, their own manager) — `PATH` will silently produce a broken chain if that happens, so it's worth validating the source data before building on top of it.

None of this requires touching the source system or restructuring the table into separate level columns upstream — the parent-child shape stays exactly as it arrived, and DAX does the flattening at query time.
