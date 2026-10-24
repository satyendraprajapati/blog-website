---
title: "Power BI Report Server: Publishing Interactive Reports On-Premises When You Can't Use the Power BI Service"
date: "2026-10-24"
tags: ["power-bi", "deployment", "data-analysis"]
excerpt: "A separate, on-premises product for organizations that can't put reports in the cloud at all -- not just a gateway back to a cloud service."
---

Most Power BI content lives in the cloud-hosted Power BI Service, with an On-Premises Data Gateway bridging it to local data sources when needed. But some organizations — government agencies, healthcare providers, anyone under a data-residency requirement — can't put report *content* in the cloud at all, gateway or not. Power BI Report Server exists for exactly that case.

**1. It's a separate, licensed product you install yourself, not a feature flag.** Report Server runs on your own Windows Server, alongside or instead of SQL Server Reporting Services (it's built on the same engine). You get it either through Power BI Premium licensing or, more commonly for a standalone analyst team, by buying SQL Server Enterprise with Software Assurance — there's no "on-premises mode" toggle inside the regular Power BI Service.

**2. Reports are published from a special version of Power BI Desktop, not the one you already have.** Microsoft ships a separate "Power BI Desktop for Power BI Report Server" build, matched to your server's release. A report built in the regular, auto-updating Desktop app can use newer visuals and features that an older Report Server instance doesn't support yet, so publishing fails until you build it in the matching version — check the portal's "about" page for the server's build number before you start.

**3. You get a web portal that looks and behaves like a stripped-down Power BI Service.** Browsing to your server's URL shows a familiar folder-based list of reports, each opening in an interactive, filterable view in the browser — slicers, drill-down, and cross-filtering all work. What's missing is the cloud-only layer on top: no Power BI Copilot, no automatic cloud-based scheduled refresh (refresh is scheduled against your own on-premises data instead), and no sharing via Teams or Microsoft 365 groups.

**4. It also hosts paginated reports and classic Reporting Services content side by side.** Because it's the same engine as SSRS, a single portal can serve a mix of interactive Power BI (.pbix) reports and pixel-perfect paginated (.rdl) reports — useful if your organization already has a library of SSRS reports and doesn't want two separate places for people to look.

**5. Row-level security still works, but through Windows authentication, not Microsoft Entra ID.** RLS roles you define in the data model still restrict what each viewer sees, but the server maps viewers to roles using on-premises Active Directory accounts rather than cloud identities — worth confirming with IT before promising a client-facing report will filter correctly by viewer.

**6. Mobile apps and alerts behave differently than the cloud service's.** The Power BI mobile apps can connect to a Report Server instance, but features tied to the cloud backend — data-driven alerts on a tile crossing a threshold, for instance — aren't available, since there's no cloud service generating them.

Report Server is a real trade-off, not a downgrade across the board: you give up Copilot, deployment pipelines, and some newer visuals, in exchange for keeping every report and every row of data inside your own network boundary. For an analyst asked to "put the dashboard somewhere IT has already approved," it's worth knowing this option exists before assuming the answer is a spreadsheet emailed around instead.
