---
title: "Power BI Composite Models: Mixing Import and DirectQuery in the Same Report"
date: "2026-09-02"
tags: ["power-bi", "data-modeling", "directquery"]
excerpt: "How to combine an imported dimension table with a DirectQuery fact table in one Power BI model, and the storage-mode setting that makes the mix actually perform well."
---

Choosing between Import and DirectQuery is usually framed as an either/or decision for the whole model. It doesn't have to be. A composite model lets different tables in the same Power BI file use different storage modes — so a huge fact table can stay live in DirectQuery while the small dimension tables that slice it are imported for speed.

**1. Storage mode is set per table, not per model.** In Model view, right-click a table and look at **Properties > Storage mode**: Import, DirectQuery, or Dual. Once any table in the model is DirectQuery, the model itself becomes a composite model automatically.

**2. The classic pattern: DirectQuery fact, imported dimensions.** A billion-row transactions table stays in DirectQuery so it's never fully loaded into memory, while `Date`, `Product`, and `Customer` dimension tables are imported. Slicers and filters on the imported dimensions still hit the live source through the relationship, but the small tables themselves render instantly.

**3. Dual mode is the setting that makes this actually fast.** A table set to Dual behaves as Import when a visual only needs data from imported tables, and as DirectQuery when a visual also touches a DirectQuery table in the same query. Setting your dimension tables to Dual instead of plain Import avoids an otherwise costly join between an in-memory table and a live DirectQuery source for every visual that mixes both.

**4. Relationships across storage modes get a "limited relationship" warning — read it.** Power BI flags relationships that cross a DirectQuery and an Import/Dual table as limited, meaning some cross-filtering behaviors (like bi-directional filtering in certain combinations) aren't fully supported the way they are within a single storage mode. Test filter behavior on both sides of the relationship before relying on it in production.

**5. Every measure that touches a DirectQuery table runs at query time, every time.** A measure looks identical whether it's evaluated over an imported or a DirectQuery table, but the performance characteristics aren't:

```dax
Total Revenue = SUM(Sales[Revenue])
```

Over an imported table this is near-instant. Over a DirectQuery fact table, it becomes a query sent to the source database on every visual interaction — so keep DirectQuery-side measures simple and let Performance Analyzer (covered in an earlier post) tell you which visuals are triggering the expensive ones.

**6. Consider it a bridge, not just a big-data workaround.** Composite models are also the standard way to extend a shared, centrally published dataset: you can connect live to someone else's published Power BI semantic model (itself effectively DirectQuery) and add your own imported tables alongside it, without needing write access to the original model.

The tradeoff is real: DirectQuery tables cap out what DAX functions and time-intelligence patterns work well against them, and query performance depends entirely on the source database being fast under load. But for a fact table too large to import comfortably, a composite model is usually a better answer than forcing the whole report into DirectQuery just because one table needs it.
