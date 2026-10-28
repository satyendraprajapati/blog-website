---
title: "Power BI's Rename to 'Semantic Models': What It Actually Changes for Analysts"
date: "2026-10-28"
tags: ["power-bi", "data-modeling", "microsoft-fabric"]
excerpt: "Microsoft renamed the Power BI dataset to a 'semantic model' as part of the Fabric rollout -- here's what's cosmetic and what actually affects how you build reports."
---

If you've opened the Power BI service recently and noticed "Datasets" has quietly become "Semantic models," you're not missing an update you skipped — Microsoft renamed it as part of folding Power BI into Microsoft Fabric. Most of what changed is the label. A few things underneath it are worth actually understanding.

**1. A semantic model is still the same thing you were already building.** Tables, relationships, measures, hierarchies — none of that changed shape. If you had a solid star schema with a proper date table before the rename, you still have one after it. The new name is Microsoft's attempt to describe what the thing actually *is* — a layer of business meaning sitting on top of raw tables — rather than what it technically stores.

**2. The rename signals where Fabric is pointing the whole platform.** In Fabric, a semantic model can sit on top of data living in OneLake — the same copy of data a Power BI report, a Fabric notebook, and a SQL endpoint can all query — instead of each tool pulling its own separate copy. You don't have to touch any of that to keep using Power BI the way you always have, but it explains why "dataset" (which implies one tool's private copy of data) stopped being an accurate name.

**3. Shared and certified semantic models work exactly like shared datasets did.** If your team already had a habit of publishing one certified semantic model and building multiple reports on top of it with **Live Connect**, that workflow is untouched — same permissions model, same "build a new report from an existing dataset" button, just relabeled in the UI and in the admin portal.

**4. Direct Lake is the one genuinely new piece worth knowing about.** It's a storage mode, alongside Import and DirectQuery, available specifically for semantic models built on Fabric lakehouse or warehouse data. It aims to give you Import-like query speed without a scheduled refresh, because it reads the lake data directly in its native format. If your organization isn't on Fabric, this doesn't apply to you yet — but it's the main reason the semantic model layer needed a model that could point at more than one kind of backing storage, which Import/DirectQuery alone couldn't describe.

**5. Nothing about your DAX, your relationships, or your existing .pbix files breaks.** This is a terminology and platform-positioning change, not a breaking one. Reports built against a "dataset" keep working against the same object now called a "semantic model" — Power BI didn't ask you to rebuild anything, and the REST API endpoints for refreshing a dataset still work under their old names for backward compatibility:
```
POST https://api.powerbi.com/v1.0/myorg/datasets/{semanticModelId}/refreshes
```
Note that the endpoint path still says `datasets`, even when you're targeting a semantic model created in a Fabric workspace — the rename happened in the UI and documentation first, and the API is catching up.

The practical takeaway: you can keep working exactly as you did yesterday. But when a Fabric-using colleague mentions a "semantic model," know that they probably mean the same kind of object you've been calling a dataset — just one that's increasingly likely to be sitting on top of shared lake storage rather than its own imported copy.
