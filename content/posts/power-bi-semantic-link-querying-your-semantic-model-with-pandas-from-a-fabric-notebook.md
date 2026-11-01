---
title: "Power BI Semantic Link: Querying Your Semantic Model with Pandas from a Fabric Notebook"
date: "2026-11-01"
tags: ["power-bi", "python", "fabric"]
excerpt: "How Semantic Link pulls a Power BI semantic model straight into a pandas DataFrame from a Microsoft Fabric notebook, without DAX or an export button."
---

"Export data" gets you the numbers behind one visual, as a CSV. That's fine for a one-off check, but it's not a workflow — there's no way to script it, schedule it, or join it against something that only exists in a notebook. Semantic Link, a Microsoft Fabric feature built on a Python library called `sempy`, closes that gap: it lets a notebook read a whole Power BI semantic model directly into pandas, live, no export step involved.

**1. It runs inside a Fabric notebook, with nothing to install.** `sempy` ships preloaded in Fabric notebooks, so there's no pip install or token wrangling to get started — just import it and point it at a model by name.
```python
import sempy.fabric as fabric

df = fabric.read_table("Sales Model", "Sales")
df.head()
```
`read_table` pulls a table out of the model exactly as it's stored, into an ordinary DataFrame you can filter, reshape, or merge with anything else in the notebook.

**2. You can evaluate an existing measure instead of reimplementing its logic.** If "Total Revenue" already has the right business logic baked into its DAX — the time intelligence, the filters, the edge cases someone already debugged — there's no reason to rebuild that in pandas. Ask the model for the computed result instead.
```python
fabric.evaluate_measure(
    "Sales Model",
    "Total Revenue",
    groupby_columns=["Region"]
)
```
This returns the measure's value broken out by region, calculated by the model's own engine — the same number you'd see on a report visual, just handed to you as a DataFrame.

**3. Drop to raw DAX when the helper functions aren't enough.** For anything `read_table` and `evaluate_measure` don't cover — a specific `SUMMARIZECOLUMNS` shape, several measures at once, a particular filter context — `evaluate_dax` runs any query you write.
```python
fabric.evaluate_dax("Sales Model", """
EVALUATE
SUMMARIZECOLUMNS(
    Region[Region],
    "Revenue", [Total Revenue],
    "Orders", [Order Count]
)
""")
```
Same engine, same result you'd get pasting that query into DAX Query View — just returned as a DataFrame you can keep working with.

**4. Audit the model's shape without opening Model view.** `list_relationships()` and `list_measures()` return the model's relationships and measure definitions as DataFrames, which turns a quick structural check — is this table even related to that one, what does this measure's formula actually say — into something you can run and filter from code instead of clicking through the diagram.
```python
fabric.list_relationships("Sales Model")
```

**5. Know the two catches before you build around it.** First, it's a snapshot at query time, not a live link — re-run the cell to refresh it, the same as any other query against the model. Second, it's a Fabric capability, not a plain Power BI Desktop one: it needs a workspace on Fabric capacity, so it's not available on every license tier a smaller team might be running.

For anything that's really "give me this model's data in Python so I can do real analysis on it," Semantic Link is a meaningfully different tool than exporting visual-by-visual — it treats the semantic model as a data source a notebook can query on demand, rather than a dead end you have to work around.
