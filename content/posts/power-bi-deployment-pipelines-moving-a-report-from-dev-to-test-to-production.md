---
title: "Power BI Deployment Pipelines: Moving a Report from Dev to Test to Production"
date: "2026-08-16"
tags: ["power-bi", "deployment-pipelines", "workspaces"]
excerpt: "How to use Power BI Deployment Pipelines to move a report through Dev, Test, and Production workspaces instead of manually republishing and re-pointing data sources by hand."
---

Publishing straight to the workspace stakeholders use means every change — a new measure, a fixed visual, a tweaked DAX formula — goes live the moment you hit publish. There's no staging step, and no easy way to test against a smaller dataset before the real one sees it. **Deployment Pipelines** solve this by giving a report its own Dev, Test, and Production workspaces, with a controlled way to push changes between them.

**1. A pipeline is three linked workspaces, not three copies you maintain by hand.** From the Power BI Service, go to `Deployment pipelines > Create pipeline`, then assign an existing workspace to the Development stage (or create a new one). Test and Production start empty — you don't build them separately, you deploy into them from the stage before.

**2. Deploy pushes reports and datasets forward, it doesn't touch data sources automatically.** Clicking `Deploy to next stage` copies the report and dataset definitions from Dev into Test. What it does *not* do by default is repoint the dataset's data source — without configuration, your Test-stage report will try to read from the same source as Dev, which usually isn't what you want.

**3. Set deployment rules so each stage points at its own data.** In the Test or Production stage, click the dataset and add a **deployment rule** — a parameter or connection string override that applies every time something is deployed into that stage. This is what lets Dev point at a small sample extract while Production points at the real warehouse, without you manually editing connection settings after every push.

**4. Compare stages before you deploy, not after.** The pipeline view shows Dev, Test, and Production side by side with a "Changes" indicator between them, plus a last-deployed timestamp. Check this before pushing forward — it's the one place that tells you whether Test is actually behind Dev or whether someone already deployed the latest version.

**5. Use Test as the place stakeholders can safely poke at, not review by email.** Because Test has its own workspace, you can grant a handful of reviewers access to it without touching Production. Feedback happens against a report that behaves like the real thing (same visuals, same data shape) instead of a static export or a set of screenshots.

**6. Production is a deploy target, not a workspace you edit directly.** Once a pipeline exists, resist the urge to open the Production-stage report in the browser and tweak a visual — that change isn't reflected back in Dev, and the next deployment from Test can silently overwrite it. Every change should originate in Dev and flow forward through the pipeline, so there's one source of truth for what the report actually contains.

Deployment Pipelines need a Power BI Premium (or Premium Per User / Fabric) capacity behind the workspace — it's not available on a plain Pro license — but for a report more than one person depends on, having a real staging step is worth checking whether your workspace already qualifies.
