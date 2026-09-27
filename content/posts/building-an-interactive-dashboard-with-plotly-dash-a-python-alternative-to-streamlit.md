---
title: "Building an Interactive Dashboard with Plotly Dash: A Python Alternative to Streamlit"
date: "2026-09-27"
tags: ["web-development", "python", "data-analysis"]
excerpt: "How Dash's callback model differs from Streamlit's rerun-the-script approach, and when that difference actually matters for a data dashboard."
---

Streamlit turns a script into an app by rerunning the whole thing top to bottom on every interaction. That's what makes it fast to start with, but it also means every widget click recomputes everything above it unless you reach for caching. Dash takes a different approach from the start: you declare a layout once, then wire specific outputs to specific inputs with callbacks, so only the piece that depends on a changed filter actually recalculates.

**1. Separate layout from logic from the first line.** A Dash app has an explicit `app.layout` — a tree of components — and separate `@app.callback` functions that update pieces of it. There's no implicit top-to-bottom script execution to reason about, which pays off once a dashboard has more than two or three filters.

```python
from dash import Dash, dcc, html, Input, Output
import plotly.express as px
import pandas as pd

df = pd.read_csv("sales.csv")
app = Dash(__name__)

app.layout = html.Div([
    dcc.Dropdown(df["region"].unique(), "West", id="region-filter"),
    dcc.Graph(id="sales-chart"),
])

@app.callback(Output("sales-chart", "figure"), Input("region-filter", "value"))
def update_chart(region):
    filtered = df[df["region"] == region]
    return px.line(filtered, x="month", y="revenue", title=f"Revenue — {region}")

if __name__ == "__main__":
    app.run(debug=True)
```

**2. Think in inputs and outputs, not in reruns.** Each callback declares exactly which component property it reads (`Input`) and which one it writes (`Output`). Dash builds a dependency graph from these declarations, so changing the region dropdown only re-runs `update_chart`, not the whole page — no `st.cache_data` decorator needed to get that behavior.

**3. Chain multiple filters with multiple inputs on one callback.** A callback can take several `Input`s and combine them, which is the natural way to handle "region AND date range" style filtering without nesting conditional logic across reruns.

```python
@app.callback(
    Output("sales-chart", "figure"),
    Input("region-filter", "value"),
    Input("date-range", "start_date"),
    Input("date-range", "end_date"),
)
def update_chart(region, start, end):
    mask = (df["region"] == region) & (df["date"].between(start, end))
    return px.line(df[mask], x="date", y="revenue")
```

**4. Use `dcc.Store` instead of session state for shared values.** Where Streamlit reaches for `st.session_state`, Dash keeps intermediate data in a hidden `dcc.Store` component on the page — one callback writes to it, another reads from it, and it survives between callback runs without recomputing the underlying query each time.

**5. Reach for multi-page apps when one dashboard becomes several.** Dash's `pages/` folder convention (via `dash.register_page`) gives each report its own URL and file, with shared layout (nav, filters) living in the main app file — closer to how a small multi-route web app is organized than to a single growing script.

**6. Know the actual trade-off before picking one.** Streamlit gets a usable prototype in front of a stakeholder faster, with almost no boilerplate. Dash asks for more structure up front (explicit layout, explicit callbacks) but scales better to a dashboard with many interacting filters, because you're not fighting an implicit full-script rerun to keep things fast. For a one-off exploratory tool, default to Streamlit; for something with five or more cross-filtering pieces headed toward daily use by other people, Dash's callback graph pays for its extra setup.

**7. Deploy it the same way you would any small Flask app.** Dash is built on Flask, so `app.run(debug=True)` in development becomes a standard `gunicorn app:server` in production on most free-tier hosts — there's no dashboard-specific hosting step beyond exposing the underlying Flask server object.

Both tools solve the same problem — turning a pandas analysis into something a non-technical stakeholder can click through — the difference is just how much you want to think about *what re-runs when*.
