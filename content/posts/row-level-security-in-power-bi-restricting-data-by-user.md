---
title: "Row-Level Security in Power BI: Restricting Data by User"
date: "2026-07-23"
tags: ["power-bi", "security", "data-modeling"]
excerpt: "How to set up Row-Level Security so the same Power BI report shows each viewer only the rows they're allowed to see, instead of publishing a separate file per region or team."
---

A common request once a report gets shared beyond one team: "the regional managers should only see their own region." Row-Level Security (RLS) solves this with one report and one dataset, instead of maintaining a separate copy per audience.

**1. RLS filters rows, not visuals.** It works by applying a DAX filter expression to a table every time a given user opens the report — so a manager assigned to "West" sees every visual, page, and total already scoped to West rows, without any visual-level filter being configured. That matters because it can't be bypassed by clicking into a different page or removing a slicer.

**2. Roles are defined in Power BI Desktop, under Modeling → Manage Roles.** A role is just a name plus a DAX expression that evaluates to `TRUE` or `FALSE` for each row. A static role hardcodes a value:
```dax
[Region] = "West"
```
That's useful for testing, but doesn't scale — you'd need a new role for every region.

**3. Dynamic RLS ties the filter to the logged-in user instead.** Rather than one role per region, a single dynamic role compares a column to the viewer's identity, usually via `USERPRINCIPALNAME()`, which returns the email of whoever is viewing the report in the Power BI Service.
```dax
[RegionManagerEmail] = USERPRINCIPALNAME()
```
This requires a table in your model mapping each region (or department, or account) to the email of the person allowed to see it — a small dimension table works well for this.

**4. Test roles before publishing with "View as Role."** Power BI Desktop lets you preview the report as if you were logged in under a given role, without actually publishing or logging in as another user. This is the step to catch a typo in an email address or a region name before a stakeholder discovers it themselves.

**5. RLS has to be assigned to real users after publishing.** Defining roles in Desktop only creates the rule — in the Power BI Service, an admin still has to go to the dataset's Security settings and add specific users or Azure AD security groups to each role. Skipping this step is the most common reason RLS "isn't working": the roles exist, but nobody has been assigned to them yet.

**6. It protects the model, not just one report.** Because RLS is applied at the dataset level, any report built on top of that same dataset inherits the same restrictions automatically — including reports that get built later by someone else, which is what makes RLS worth setting up once rather than trying to recreate the same filtering with page-level access controls on every new report.

The upfront cost is a mapping table and a bit of testing; the payoff is one dataset that safely serves every audience instead of a growing pile of near-duplicate reports that all need updating every time the underlying data changes.
