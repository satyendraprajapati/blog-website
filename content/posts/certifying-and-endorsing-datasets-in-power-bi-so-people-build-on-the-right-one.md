---
title: "Certifying and Endorsing Datasets in Power BI (So People Build on the Right One)"
date: "2026-09-28"
tags: ["power-bi", "governance", "best-practices"]
excerpt: "Once a few teams start building their own reports on your model, endorsement badges are how you tell them which dataset is the trustworthy, maintained one to connect to."
---

The moment a Power BI dataset gets shared across a workspace or an app, it's common for other analysts to start a new report against it via "Analyze in Excel" or a live connection, rather than rebuilding the model themselves. That's the whole point of a shared model — but once there are five near-identical datasets floating around a tenant with similar names, nobody can tell which one is actually maintained and which one is an abandoned copy from a project that ended last year. Endorsement is Power BI's built-in answer to that.

**1. Understand the two tiers before you use either.** Power BI has "Promoted" and "Certified" endorsement. Promoted is self-service — the dataset owner can mark their own dataset as promoted at any time, signaling "this is worth a look." Certified is a stronger claim — it says the dataset meets your organization's quality and reliability bar, and it's meant to be applied sparingly, to the small number of models everyone should actually be building from.

**2. Certification is gated by an admin setting, on purpose.** In the Power BI admin portal, under tenant settings, "Certification" lists a specific security group allowed to certify content. It's off by default for everyone else, which keeps the certified badge meaningful — if anyone could self-certify, the badge would carry the same weight as an uncertified dataset and the whole feature would be pointless.

**3. Apply it from the dataset's settings, not the report.** Endorsement lives on the dataset (or dataflow, or app) itself, in its settings page in the workspace — under "Endorsement," pick Promoted or Certified and optionally add a short description explaining what the dataset covers. That description shows up wherever the badge does, so use it to say what the dataset is for, not just that it's good.

**4. The badge follows the dataset everywhere it's discoverable.** Certified and Promoted badges appear in the "Get data" hub, in search results, and next to the dataset name when someone is choosing what to connect a new report to — which is exactly the moment endorsement is meant to influence. Someone scanning ten similarly-named datasets for "Sales" will reasonably pick the one with a badge over the nine without one.

**5. Endorse the model that owns time intelligence and RLS, not every derivative report.** Endorsement is a dataset-level signal, so it belongs on the shared semantic model that other reports are built against — the one with your date table, your RLS roles, your reviewed measures — not on every downstream report that consumes it. Certifying a report file doesn't help someone decide which *data source* to trust.

**6. Revisit certified status when ownership changes.** A certified dataset implies someone is actively maintaining it — fixing broken measures, keeping the refresh running, answering questions about it. If the owning team disbands or the model is superseded, pull the certification (or replace it with a note pointing to its successor) rather than leaving a stale badge telling people to trust something nobody is watching anymore.

Endorsement doesn't stop anyone from building on an uncertified dataset — it's a signal, not a permission gate. But in a tenant where duplicate models accumulate naturally, it's the cheapest way to make the right default obvious.
