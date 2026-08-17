---
title: "Power BI Query Folding: Why Some Power Query Steps Are Fast and Others Aren't"
date: "2026-08-17"
tags: ["power-bi", "power-query", "performance"]
excerpt: "How query folding pushes Power Query transformations back to the source database, and which steps quietly break it."
---

Two Power BI reports can have nearly identical Power Query steps and refresh at wildly different speeds. The usual reason isn't the data volume — it's whether those steps are "folding." Query folding is Power Query translating your applied steps into a single query the source system runs itself, instead of pulling everything raw and doing the work locally in the Power Query engine.

**1. Understand what folding actually means.** When you filter, sort, group, or rename a column in Power Query against a folding-capable source (SQL Server, most relational databases, OData, and some other connectors), Power Query doesn't fetch the whole table and then filter it — it rewrites your steps into SQL and asks the database to do the filtering, which is almost always faster and lighter on both machines.

**2. Check fold status with right-click "View Native Query."** Right-click any step in the Applied Steps pane. If "View Native Query" is available (not greyed out), that step is still folding. The moment it's greyed out on a step that used to have it, everything from that point forward runs locally instead of at the source.

**3. Put filtering and column removal early, before anything exotic.** Filter rows and remove unneeded columns as your first steps. Folding-friendly operations chain cleanly when they're consecutive — every step you can push earlier is a step the source database gets to do instead of your refresh engine.

**4. Know the common fold-breakers.** Custom M functions, merging two queries from *different* source types (e.g. a SQL table merged with an Excel file), `Table.Buffer`, adding an index column, and many custom column formulas with row-by-row logic all break folding at that step. That doesn't mean never use them — it means know you're accepting a performance cost when you do.

**5. Reorder steps so the break happens as late as possible.** If a report needs one fold-breaking transformation, folding still applies to every step *before* it. Do the filtering, joining, and renaming first, then add the custom column or unavoidable local step last, so the database still does the heavy lifting on row reduction before your machine takes over for the rest.

**6. Watch DirectQuery differently from Import.** In DirectQuery mode, folding isn't optional — every visual's query has to fold back to the source at render time, or it fails outright. In Import mode, a broken fold just means a slower refresh, not a broken report, which is why it's easy to not notice until the dataset grows.

**7. Test on a representative row count, not a tiny sample.** A query that folds might feel identical to one that doesn't when you're working against 500 test rows. The gap only shows up at production scale, so validate fold status with `View Native Query`, not just a stopwatch on a small file.

Query folding isn't something you turn on — it's a property of the steps you write and the order you write them in. Getting the filter-first, fold-breaker-last habit right is usually worth more to refresh time than any hardware upgrade.
