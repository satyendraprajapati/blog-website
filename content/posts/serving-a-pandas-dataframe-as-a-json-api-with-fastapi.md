---
title: "Serving a Pandas DataFrame as a JSON API with FastAPI"
date: "2026-10-28"
tags: ["web-development", "python", "api"]
excerpt: "How to turn a pandas analysis into a small, filterable JSON endpoint other tools can call, using FastAPI instead of emailing around a CSV."
---

A lot of analysis work ends the same way: a finished pandas DataFrame that someone else needs to consume. The usual answer is exporting a CSV and emailing it, which works until the data changes weekly and everyone's working from a slightly different copy. A lightweight JSON API fixes that — and FastAPI gets you one without writing much code you wouldn't already recognize.

**1. Start with the DataFrame you already have.** No new tooling needed here — this is the same pandas code from any other analysis.
```python
import pandas as pd

df = pd.read_csv("sales.csv")
```

**2. Wrap it in a FastAPI app with one endpoint.** `FastAPI` is a Python web framework built specifically for returning JSON quickly, and it needs very little boilerplate to do that.
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/sales")
def get_sales():
    return df.to_dict(orient="records")
```
`to_dict(orient="records")` turns the DataFrame into a list of plain dictionaries — one per row — which FastAPI automatically serializes to JSON. Run it locally with `uvicorn main:app --reload` and visiting `http://localhost:8000/sales` in a browser returns the whole table as JSON.

**3. Add query parameters so callers can filter without downloading everything.** This is the real advantage over a static CSV export — the data gets filtered server-side, not after someone's already pulled the whole file.
```python
@app.get("/sales")
def get_sales(region: str | None = None, min_revenue: float = 0):
    result = df
    if region:
        result = result[result["region"] == region]
    result = result[result["revenue"] >= min_revenue]
    return result.to_dict(orient="records")
```
Now `/sales?region=West&min_revenue=1000` returns just the rows that match, and FastAPI validates the parameter types for you automatically.

**4. Get interactive API documentation for free.** Visiting `/docs` on a running FastAPI app shows a Swagger UI page listing every endpoint, its parameters, and a "Try it out" button — generated automatically from your function signatures, with no separate documentation to maintain or let go stale.

**5. Know when this is overkill.** If one person needs the data once, a CSV export is still faster than standing up an API. This approach earns its keep when the data refreshes regularly and more than one consumer — a dashboard, a teammate's script, a scheduled job — needs to pull a current, filtered slice of it on demand, rather than everyone working from whatever copy they happened to download last.

**6. Reload the data instead of hardcoding it at import time, if it changes often.** Loading the CSV once at the top of the file means the API keeps serving stale data until you restart it. For data that updates daily, read it inside the endpoint function (or on a schedule) instead of at module load, so each request reflects the latest file on disk.

The mental shift from "export a file" to "expose an endpoint" is the real benefit here — once the data is reachable by URL, it can plug into a dashboard, another script, or a teammate's own analysis without anyone forwarding a spreadsheet again.
