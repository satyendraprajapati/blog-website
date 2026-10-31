---
title: "Turning a Python Data Analysis Into an Interactive Web Demo with Gradio"
date: "2026-10-31"
tags: ["web-development", "python", "data-analysis"]
excerpt: "How to wrap a pandas function or trained model in a shareable web interface with Gradio in under 20 lines of code."
---

A chart in a notebook only reaches people willing to run your notebook. Gradio closes that gap: it turns a single Python function — one that cleans a dataset, scores a model, or filters a dataframe — into a web page with inputs and outputs, without writing any HTML, CSS, or JavaScript.

**1. The core idea is one function and one interface.** You write a normal Python function that takes some inputs and returns an output, and Gradio builds the form and display around it automatically based on the types you specify.

```python
import gradio as gr
import pandas as pd

def filter_sales(region, min_revenue):
    df = pd.read_csv("sales.csv")
    result = df[(df["region"] == region) & (df["revenue"] >= min_revenue)]
    return result

demo = gr.Interface(
    fn=filter_sales,
    inputs=[gr.Dropdown(["East", "West", "North", "South"]), gr.Number(label="Min revenue")],
    outputs=gr.Dataframe(),
)

demo.launch()
```

Running this starts a local web server and opens a page with a dropdown, a number box, and a live table that updates when you click submit.

**2. It's a faster path to a demo than a dashboard framework, because it isn't trying to be a dashboard.** Streamlit and Plotly Dash are built for multi-widget, multi-chart layouts you design page by page. Gradio is built around a single function's inputs and outputs — which makes it the right choice specifically when the thing you're sharing is "run this function and show me the result," like a trained classifier, a text-cleaning routine, or a what-if calculator, rather than a full report with several linked views.

**3. Component types map directly onto the kind of data you're working with.** `gr.Dataframe` renders a pandas DataFrame as a table, `gr.Plot` accepts a Matplotlib or Plotly figure, `gr.Image` handles chart exports or uploaded images, and `gr.Slider` or `gr.Dropdown` cover numeric and categorical inputs. Picking the matching component type is most of the design work — there's no CSS to fight with.

```python
import matplotlib.pyplot as plt

def plot_trend(window):
    df = pd.read_csv("sales.csv")
    fig, ax = plt.subplots()
    df["revenue"].rolling(window).mean().plot(ax=ax)
    return fig

gr.Interface(fn=plot_trend, inputs=gr.Slider(1, 12, value=3), outputs=gr.Plot()).launch()
```

**4. `share=True` gives you a public link without deploying anything.** Calling `demo.launch(share=True)` opens a temporary public URL (valid for 72 hours) that tunnels to your local machine — useful for sending a quick demo to a teammate or client without setting up hosting. For anything longer-lived, Hugging Face Spaces offers free hosting built specifically for Gradio apps: push the same code to a Space and it runs continuously with a permanent URL.

**5. Multiple inputs and outputs just mean longer lists, not more code structure.** A function that takes three parameters and returns two things — say, a filtered table and a summary chart — just needs matching lists passed to `inputs` and `outputs`. Gradio lays them out automatically, which is the tradeoff you're making: less control over layout in exchange for not having to think about layout at all.

For a one-off demo — showing a stakeholder how a model's prediction changes as an input varies, or letting a colleague self-serve a filtered slice of data — Gradio gets you from a working Python function to something clickable in a browser faster than any of the full dashboard frameworks will.
