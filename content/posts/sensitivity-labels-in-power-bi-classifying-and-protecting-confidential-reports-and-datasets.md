---
title: "Sensitivity Labels in Power BI: Classifying and Protecting Confidential Reports and Datasets"
date: "2026-10-23"
tags: ["power-bi", "security", "data-integrity"]
excerpt: "Sensitivity labels classify a report as confidential and can travel with the data when it's exported, which row-level security alone doesn't do."
---

Row-level security controls who sees which rows inside a report, but it doesn't stop someone who's allowed to see the report from exporting the whole thing to Excel and emailing it outside the company. Sensitivity labels solve a different problem: they classify a report or dataset as confidential and, depending on how your organization has them configured, keep that protection attached even after the data leaves Power BI.

**1. Understand that a label classifies the asset, not a set of rows.** Where RLS filters data by who's viewing it, a sensitivity label (Home → Sensitivity, in the Power BI Service or Desktop) marks the whole report, dashboard, or dataset with a classification like "Confidential — Internal Only." It's a different axis of control, and most governed reports need both: RLS for who sees what, a label for what happens to the file once someone has it.

**2. Labels require Microsoft Purview Information Protection to be set up by an admin.** If the Sensitivity button isn't visible, or applying a label does nothing, that's a tenant configuration gap — not something wrong with your report. Check with whoever administers Microsoft 365 in your organization before assuming the feature doesn't exist.

**3. A label on a dataset propagates downstream — use that instead of relabeling every report.** When a label is applied at the dataset level, every report built on that dataset inherits it automatically, including reports built later by other analysts. Labeling the shared dataset once is more reliable than remembering to label each report that gets built on top of it.

**4. Exporting to Excel or PowerPoint carries the label with it, if your tenant has encryption configured.** This is the actual point of the feature: a properly configured label can keep a file encrypted and access-restricted even after someone exports a visual's underlying data to Excel — protection that RLS has no way to provide once the data has left the report.

**5. Check what a label actually restricts before relying on it.** Depending on how your Purview administrator configured it, a given label might only mark the file visually (a "Confidential" watermark or banner) without encrypting anything, or it might fully restrict who can open, forward, or print the file. Don't assume a label named "Confidential" is doing more than it's configured to do — ask, or test it with a dummy report before you depend on it for something sensitive.

**6. A label can be mandatory at the workspace level.** An admin can configure a workspace so that nothing can be published without a sensitivity label applied — useful for a workspace that's known to hold regulated or client-confidential data, since it removes the step where an analyst forgets to classify a report before publishing it.

**7. Remember a label doesn't fix a report that shouldn't have been built from that data in the first place.** Classification and encryption protect a file in transit; they don't substitute for deciding, upstream, whether a given dataset should be as widely accessible as it currently is. Use labels alongside workspace access controls and RLS, not as a replacement for either.

RLS answers "who sees which rows while they're inside Power BI." Sensitivity labels answer the question that matters once someone exports, forwards, or downloads the thing — and for a report with real confidential figures, that second question is usually the one that actually causes incidents.
