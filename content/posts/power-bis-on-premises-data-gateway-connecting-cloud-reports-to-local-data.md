---
title: "Power BI's On-Premises Data Gateway: Connecting Cloud Reports to Local Data"
date: "2026-10-16"
tags: ["power-bi", "data-modeling", "automation"]
excerpt: "When a dataset's source is a local SQL Server or a network file share, a published Power BI report can't reach it directly -- the On-Premises Data Gateway is the piece that bridges the two."
---

A report built on an Excel file in OneDrive refreshes in the Power BI Service without any extra setup, because the Service can already reach that file over the internet. A report built on a SQL Server sitting on an office network, or a folder on a local drive, can't — and the fix isn't a setting inside Power BI Desktop, it's a separate piece of software called the On-Premises Data Gateway.

**1. The gateway is a small Windows service, not a Power BI feature.** You install it (from *powerbi.microsoft.com/gateway*) on a machine that's always on and can reach your local data source — often a server, not someone's laptop that goes to sleep overnight. It runs quietly in the background, maintaining an outbound connection to the Power BI Service so refreshes can happen without opening any inbound firewall ports.

**2. Two modes exist, and they solve different problems.** A *Standard* gateway is shared across a team or organization and supports scheduled refresh for multiple datasets and multiple data sources. A *Personal* gateway is simpler to set up but only works for the person who installed it, doesn't support DirectQuery, and can't be shared — fine for a one-person refresh, not for a team's production dashboard.

**3. Each data source behind the gateway needs its own connection registered.** After installing the gateway, you (or an admin) add data sources to it in the Power BI Service — the server name, database, and credentials for each SQL Server, file share, or other on-prem source your reports pull from. A dataset's refresh only succeeds once its specific source is mapped to the gateway, not just once the gateway itself is running.

**4. Without it, the symptom is a refresh failure with a connection error, not a helpful message.** If a dataset's source isn't cloud-reachable and no gateway is configured, *Settings → Scheduled refresh* in the Service shows the refresh failing, often with wording about being unable to connect to the data source — which looks identical to a credentials problem unless you already know to check for a missing gateway.

**5. One gateway can serve many reports and many people.** A Standard gateway installed once by IT can back every report in the organization that needs the same on-prem SQL Server, which is why the setup step usually belongs to whoever administers the Power BI tenant rather than being repeated by each report author.

**6. Check gateway status before troubleshooting anything else.** In the Service, under *Manage gateways*, a gateway shows as online or offline in real time. If scheduled refreshes have started failing across several reports at once, a gateway machine that's been restarted, patched, or taken offline is the first thing worth ruling out — before touching credentials or the dataset itself.

The gateway is invisible when a report's data already lives in the cloud, which is exactly why it's easy to forget it exists — until the first report built on a local database needs to refresh on a schedule instead of a manual export.
