---
title: "Python Pandas Basics for Analysts Coming from Excel"
date: "2026-07-23"
tags: ["python", "pandas", "beginner"]
excerpt: "A rough mental map from Excel operations to their pandas equivalents."
---

Pandas feels less intimidating once you realize most of it maps directly onto things you already do in Excel — it's just typed out instead of clicked.

**Loading data** — `pd.read_csv("orders.csv")` is your "open the file." The result is a `DataFrame`, which behaves like a worksheet: rows, columns, and a header.

```python
import pandas as pd
df = pd.read_csv("orders.csv")
df.head()   # like scrolling to the top and eyeballing the first rows
```

**Filtering rows** is your AutoFilter or a formula-based helper column:

```python
big_orders = df[df["revenue"] > 1000]
```

**`SUMIFS` becomes `groupby`.** Instead of `=SUMIFS(Revenue, Region, "West")`, you group by the category and aggregate:

```python
df.groupby("region")["revenue"].sum()
```

This one function replaces most of what a Pivot Table does — group by one or more columns, then aggregate with `.sum()`, `.mean()`, `.count()`, or `.agg()` for several at once.

**`XLOOKUP` becomes `merge`.** Instead of pulling a matching value from another table, you join the two DataFrames on a shared key:

```python
df.merge(products, on="product_id", how="left")
```

That `how="left"` is doing exactly what a `LEFT JOIN` does in SQL — keep every row from `df`, and pull in matching columns from `products` where they exist.

The honest pitch for learning pandas isn't that it's better than Excel for everything — small, one-off checks are still faster by hand. It's that once a dataset gets large or a cleanup step needs to run the same way every time, code is easier to trust and rerun than a spreadsheet full of formulas.
