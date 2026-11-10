---
title: "Running Python and Pandas in the Browser with Pyodide: No Server, No Install"
date: "2026-11-10"
tags: ["web-development", "python", "webassembly"]
excerpt: "How Pyodide runs a real Python interpreter and pandas directly in the browser via WebAssembly, so a data demo needs no backend server and no viewer install at all."
---

Streamlit and Gradio are great for turning a Python script into a shareable app, but they still need a running server somewhere. **Pyodide** takes a different approach: it compiles the actual CPython interpreter to WebAssembly and runs it client-side, in the visitor's browser tab. There's no backend to host, scale, or pay for — the "server" is whoever opened the page.

**1. What's actually happening under the hood.** Pyodide ships a WebAssembly build of Python plus prebuilt wheels for key scientific packages (NumPy, pandas, Matplotlib, scikit-learn, and more) that would otherwise be painful to compile for the browser. When the page loads, the browser downloads this runtime once, and from then on your Python code executes locally — no round trip to any server for each calculation.

**2. The minimal setup.** Load the Pyodide script from a CDN and initialize it before running anything:
```html
<script src="https://cdn.jsdelivr.net/pyodide/v0.26.0/full/pyodide.js"></script>
<script>
  async function main() {
    const pyodide = await loadPyodide();
    await pyodide.loadPackage("pandas");
    const result = await pyodide.runPythonAsync(`
      import pandas as pd
      df = pd.DataFrame({"region": ["West", "East"], "revenue": [120, 95]})
      df["revenue"].sum()
    `);
    console.log(result);
  }
  main();
</script>
```
`loadPyodide()` and `loadPackage()` are both one-time, awaited setup costs; `runPythonAsync` is what you call repeatedly afterward, each time a visitor interacts with your demo.

**3. Passing data between JavaScript and Python.** Pyodide exposes a `pyodide.globals` dictionary and automatic type conversion for common types, so you can hand a visitor-uploaded CSV string into Python and read a result back out in JavaScript without writing any serialization code yourself:
```javascript
pyodide.globals.set("csv_text", await file.text());
const summary = await pyodide.runPythonAsync(`
  import pandas as pd, io
  pd.read_csv(io.StringIO(csv_text)).describe().to_json()
`);
```
That's a full pandas `describe()` on a user's own file, computed entirely on their machine, with nothing uploaded anywhere.

**4. Know the real cost: load time, not execution time.** The first visit downloads the core runtime (a few megabytes) plus any packages you load, which can take several seconds on a slow connection — budget for a loading indicator. Once it's cached, repeat visits and repeat calculations are fast, since there's no network latency per calculation the way a server-backed app has.

**5. Where it fits next to the other browser-data options.** If you've already covered running SQL on a CSV with DuckDB-Wasm, think of Pyodide as the complement for cases where the logic genuinely needs pandas, NumPy, or a scikit-learn model rather than SQL — a quick "paste your data, see a regression line" demo embedded directly in a blog post, with the actual model fit happening in the reader's tab.

**6. It's for demos and teaching, not heavy production workloads.** Running a few thousand rows through pandas operations in-browser is fine; running a million-row join or a slow model-training loop will visibly lock up the tab, since it's single-threaded on the main thread by default (a Web Worker setup fixes that but adds complexity). For an interactive explainer embedded in a data-analysis post, the simple version is usually all you need.

The appeal for a data-analysis blog specifically: readers can run your actual pandas code against their own data, live, with nothing to install and nothing of theirs leaving their browser.
