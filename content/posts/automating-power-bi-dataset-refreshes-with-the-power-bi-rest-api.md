---
title: "Automating Power BI Dataset Refreshes with the Power BI REST API"
date: "2026-10-14"
tags: ["power-bi", "automation", "data-analysis"]
excerpt: "How to kick off a Power BI dataset refresh from outside the Power BI Service, using the REST API instead of waiting on the built-in Scheduled Refresh clock."
---

Scheduled Refresh covers the common case: pick a few times a day and Power BI pulls fresh data on that clock. But it doesn't help when refresh needs to happen *because something else just finished* — an upstream ETL job landed new rows, a nightly export completed, or a teammate just fixed a data issue and wants the report current right now. That's what the Power BI REST API's refresh endpoint is for: triggering a refresh programmatically, on your own schedule or event.

**1. Register an app in Microsoft Entra ID to get API access.** The REST API authenticates with an Entra ID (Azure AD) token, not your regular Power BI login. In the Azure portal, register an application, grant it the `Dataset.ReadWrite.All` (or read-only, if you're only ever triggering refreshes a dataset owner already configured) Power BI API permission, and generate a client secret. Your Power BI admin needs to allow service principals in the tenant's admin portal settings for this to work in an organization.

**2. Get an access token.** Using the app registration's client ID, tenant ID, and secret, request a token from Microsoft's identity endpoint:

```bash
curl -X POST "https://login.microsoftonline.com/<tenant-id>/oauth2/v2.0/token" \
  -d "client_id=<client-id>" \
  -d "client_secret=<client-secret>" \
  -d "grant_type=client_credentials" \
  -d "scope=https://analysis.windows.net/powerbi/api/.default"
```

**3. Call the refresh endpoint with that token.** Every dataset has a workspace ID and a dataset ID, both visible in the dataset's URL in the Power BI Service. Pass the token as a bearer header:

```bash
curl -X POST \
  "https://api.powerbi.com/v1.0/myorg/groups/<workspace-id>/datasets/<dataset-id>/refreshes" \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json"
```

A successful call returns `202 Accepted` immediately — the refresh runs asynchronously in the Service, the same as if you'd clicked the Refresh button by hand.

**4. Check refresh status instead of assuming it worked.** A `202` only means the refresh *started*. Poll the refresh history endpoint to see whether it actually completed or failed:

```bash
curl -X GET \
  "https://api.powerbi.com/v1.0/myorg/groups/<workspace-id>/datasets/<dataset-id>/refreshes?$top=1" \
  -H "Authorization: Bearer <access-token>"
```

The response includes a `status` field (`Completed`, `Failed`, `Unknown`) and, on failure, an error code worth logging somewhere you'll actually see it.

**5. Wire the trigger to the thing that should cause it.** The whole point of using the API instead of Scheduled Refresh is calling this from somewhere event-driven: the last step of a Python ETL script, an Azure Data Factory pipeline's final activity, a GitHub Actions job, or a Power Automate flow watching a folder. In Python, the same call is just a `requests.post` with the token in the headers — no SDK required.

**6. Know the limits before you lean on this for everything.** The API refresh still counts against the same daily refresh limit as Scheduled Refresh (8/day on Pro, 48/day on Premium/Fabric capacity), and it refreshes the whole dataset unless you've set up incremental refresh policies — this isn't a way around either constraint, just a way to control *when* a refresh fires instead of only *how often*.

Triggering refreshes this way turns Power BI from "updates on a clock" into "updates when the data actually changed," which matters most for reports that stakeholders check right after a known data event, not on an arbitrary schedule.
