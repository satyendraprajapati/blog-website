---
title: "Excel's Report Connections: One Slicer Controlling Multiple PivotTables"
date: "2026-10-14"
tags: ["excel", "pivot-tables", "dashboard"]
excerpt: "How to wire a single Slicer to filter several PivotTables at once with Report Connections, instead of clicking a separate filter on every table in a one-page summary."
---

A one-page Excel dashboard usually has more than one PivotTable on it — one for revenue by region, another for headcount, another for a trend. The default behavior is that a Slicer only filters the PivotTable it was inserted from. Click "West" on one, and every other table on the sheet keeps showing everything. Report Connections fixes that with one checkbox.

**1. Build your PivotTables from the same source first.** Report Connections only works across PivotTables that share the same underlying data — either the same range/table, or tables that are all part of the same Data Model. If one PivotTable is built from a different workbook or an unrelated range, it won't show up as an option to connect.

**2. Insert a Slicer from any one of the PivotTables.** Click into that PivotTable, go to **PivotTable Analyze → Insert Slicer**, and pick the field you want to filter by (Region, Department, whatever ties your tables together).

**3. Right-click the Slicer and choose Report Connections.** This opens a list of every PivotTable in the workbook that's eligible to receive this Slicer's filter. Check the boxes next to the ones you want included — not just the PivotTable it was created from, but every other summary table on the dashboard that should move together.

**4. Click OK and test it.** Click a value in the Slicer and watch every connected PivotTable update at once. If one of them doesn't move, it's almost always because its underlying field isn't named identically across the source tables — a Slicer filters by field name, so "Region" in one table and "Area" in another won't link up even if the values match.

**5. Reuse the same trick for Timelines.** A Timeline (the date-based version of a Slicer) has the same right-click → Report Connections option, so a single date range control can drive a revenue table, a headcount table, and a trend chart's underlying PivotTable together.

**6. Watch for PivotCharts riding along for free.** A PivotChart doesn't need its own connection — it already follows whichever PivotTable feeds it. So once that PivotTable is wired into the Slicer's Report Connections, any chart built on top of it updates automatically too, without an extra step.

A common point of confusion: Report Connections lives on the *Slicer*, not on the PivotTable. If you want two different Slicers to control two different subsets of tables on the same sheet — say, one Slicer for the Sales tables and a separate one for the Operations tables — each Slicer gets its own Report Connections list, and you simply leave the Operations tables unchecked on the Sales Slicer's connection list and vice versa.

This is also the fastest way to spot a dashboard that's about to confuse a stakeholder: if someone clicks a Slicer expecting the whole page to react and only half of it does, the fix usually isn't a formula — it's an unchecked box in Report Connections.

None of this requires VBA, Power Pivot, or a Data Model if your tables already share a source range — it's a built-in PivotTable feature most analysts never right-click far enough to find.
