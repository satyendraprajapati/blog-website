---
title: "Object-Level Security (OLS) in Power BI: Hiding Sensitive Columns and Tables by Role"
date: "2026-11-13"
tags: ["power-bi", "security", "data-modeling", "beginner"]
excerpt: "Row-Level Security hides rows a user shouldn't see — Object-Level Security hides entire columns, measures, or tables instead, for data that's sensitive regardless of which row it's in."
---

Row-Level Security answers "which rows can this person see." It doesn't help when the problem isn't rows at all — a `Salary` column, a `Cost` measure, or a whole `HR` table that some viewers shouldn't be able to see no matter which region or department they're looking at. That's what Object-Level Security (OLS) is for.

**1. OLS hides objects, not rows.** Where RLS filters a table down to a subset of rows for a given role, OLS removes entire columns, measures, or tables from the model for that role — the object simply isn't there, rather than being there with restricted data.

**2. It's set up in an external tool, not Power BI Desktop's UI.** Unlike RLS, which has a dedicated "Manage Roles" dialog, OLS isn't exposed in Desktop directly. The standard way to configure it is **Tabular Editor** (the free, open-source version works fine), connected live to your Desktop model.

**3. The workflow starts with the roles you likely already have from RLS.** Open the model in Tabular Editor, and under each existing role (or a new one created just for this), there's an Object Level Security section where you can select specific tables, columns, or measures and set their permission to **None** for that role.

**4. A column hidden by OLS disappears from everything for that role — reports, Q&A, and Analyze in Excel.** This is the part that makes it more thorough than, say, just hiding a field in the report's Fields pane. A visual-level hide only stops that field from being dragged onto a new visual in the Power BI Service; a determined viewer can still reach it through Q&A, through "Analyze in Excel," or by building their own report on the same dataset. OLS removes the column from the model itself for that role, so none of those paths work either.

**5. A measure referencing a hidden column breaks for that role too — plan for it.** If `[Profit Margin]` is built from a `Cost` column that OLS hides from the "External Partner" role, that measure returns an error for anyone in that role, not a blank. Either hide the dependent measure alongside the column, or keep sensitive inputs out of measures that broader audiences also need.

**6. Combine it with RLS when you need both dimensions locked down.** A common real pattern: RLS restricts a Regional Manager to their own region's rows, while OLS additionally hides a `Headcount Cost` table from everyone except Finance, regardless of region. The two features are independent and stack cleanly — a role can have both a row filter and a list of hidden objects at the same time.

**7. Test with "Model BPA" or a dedicated test account, since Desktop's "View as Role" doesn't fully reflect OLS.** Desktop's role-preview feature was built around RLS and doesn't reliably simulate missing objects the way it does filtered rows. After publishing, confirm the hidden fields are actually gone by checking the report as a real user assigned to that role, not just by eyeballing the Fields pane in Desktop.

OLS is a smaller, more surgical tool than RLS — most models never need it, because most sensitivity is about who sees which rows, not which columns. But the moment a single sensitive field has to disappear entirely for part of your audience, it's the feature built for exactly that, instead of trying to recreate it with a maze of separate reports or visual-level hacks.
