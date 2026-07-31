---
title: "Power BI Workspaces and Apps: Sharing Reports Without Sharing the File"
date: "2026-07-31"
tags: ["power-bi", "collaboration", "workspaces"]
excerpt: "Emailing a .pbix file around means everyone has their own out-of-date copy — here's how Power BI Workspaces and Apps let a team view the same live report instead."
---

Sending a colleague your `.pbix` file feels like sharing a report, but it isn't — they get a frozen snapshot, no connection to your data source, and their own copy to lose track of the moment you publish an update. Power BI's Workspaces and Apps exist so a team looks at one live report instead of trading files.

**1. A Workspace is where a report lives, not who can see it.** Create one under *Workspaces → Create a workspace* and publish your report into it from Power BI Desktop (*Home → Publish*). Everyone you add as a Member or Contributor to that Workspace can open the report directly in the Power BI Service — no file changes hands, and everyone is looking at the same published version.

**2. Contributor and Viewer roles decide who can break things.** Workspace roles range from Viewer (can open and interact with reports, can't edit) up through Admin (can delete the workspace). Add most stakeholders as Viewers and reserve Contributor or above for people who actually build reports — a Viewer can still filter, slice, and export, they just can't accidentally overwrite your measures.

**3. Build an App when the audience is bigger than "everyone with a Workspace login."** An App is a read-only, curated bundle of one or more reports from a Workspace, published separately via *Create app*. This is the right layer for wide distribution — executives, other departments — because App viewers never see the Workspace's editing surface, draft reports, or in-progress work, only what you explicitly included.

**4. Set a refresh schedule so "live" actually means live.** A published report only shows current numbers if its dataset refreshes. Under the dataset's settings, *Scheduled refresh* lets you set up to eight refreshes a day on Power BI Pro, tied to your data source credentials. Skip this step and every viewer is quietly looking at whatever data existed the moment you last published from Desktop.

**5. Use Row-Level Security with Workspace sharing, not instead of it.** Sharing access and restricting rows are separate problems — a Viewer role controls who can open the report, while RLS roles control which rows they see once inside. Assign users to RLS roles under the dataset's *Security* settings so one shared report can safely serve a regional manager and someone above them without publishing two separate files.

**6. Check "Allow re-share" before you assume a Viewer can't forward access.** When sharing a specific report link directly (*Share* button on the report, distinct from Workspace or App access), there's a toggle for whether the recipient can re-share it further. Leave it off for anything containing sensitive figures — otherwise a link you sent to one manager can end up forwarded well past who you intended.

**7. Update the App, don't republish the whole Workspace, for routine changes.** After editing a report in the Workspace, viewers of the App won't see the change until you click *Update app*. This is deliberate — it lets you finish a multi-step edit in the Workspace without a half-finished report going live to the wider App audience mid-change.

The underlying mental model is simple even if the settings menu isn't: the Workspace is your workshop, the App is the storefront, and RLS decides what each visitor sees once they're in either one. Once that separation clicks, "who has the current version of this report" stops being a question anyone has to ask.
