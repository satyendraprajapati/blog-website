---
title: "Parsing Large CSV Files in the Browser with a Web Worker So Your React Blog Doesn't Freeze"
date: "2026-08-25"
tags: ["web-development", "react", "performance"]
excerpt: "Move CSV parsing off the main thread with a Web Worker so a data portfolio site stays responsive while handling large datasets."
---

If your portfolio site lets visitors upload or explore a dataset client-side — a common feature on a data-analysis blog — parsing a CSV with a few tens of thousands of rows on the main thread will visibly freeze the page while it runs. JavaScript is single-threaded, so parsing and rendering are competing for the same thread. A Web Worker fixes that by moving the parsing work off it entirely.

**1. Why the freeze happens** — `useState` updates, React re-renders, and your CSV-parsing loop all run on the same thread. A synchronous parse of a large file blocks scroll, input, and any animation until it finishes, even if the parsing logic itself is simple.

**2. Create a worker file for the parsing logic** — a worker is just a separate script that receives messages and posts results back, with no access to the DOM:

```js
// csvWorker.js
self.onmessage = (e) => {
  const rows = e.data
    .trim()
    .split("\n")
    .map((line) => line.split(","));
  self.postMessage(rows);
};
```

**3. Wire it up from a component** — spin up the worker, send it the raw CSV text, and listen for the parsed result. Always terminate the worker on cleanup so you're not leaking threads across re-renders:

```jsx
function useCsvParser(csvText) {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    if (!csvText) return;
    const worker = new Worker(new URL("./csvWorker.js", import.meta.url));
    worker.onmessage = (e) => setRows(e.data);
    worker.postMessage(csvText);
    return () => worker.terminate();
  }, [csvText]);

  return rows;
}
```

Vite handles the `new URL(..., import.meta.url)` worker pattern out of the box, no extra config needed.

**4. Show a loading state instead of a frozen one** — the whole point of the worker is that the UI stays interactive while it runs, so use `rows === null` to render a spinner or skeleton table rather than leaving the page looking stuck.

**5. Know when it's not worth it** — for a few hundred or even a couple thousand rows, `Papa.parse` (or a plain `.split`) on the main thread is simpler and fast enough that a worker just adds complexity. Reach for this pattern once you notice actual jank — dropped scroll frames, input lag — on files in the tens of thousands of rows, not preemptively.

The pattern generalizes past CSV, too: any heavy client-side computation on user-supplied data (JSON transforms, client-side aggregation for a chart) benefits from the same off-main-thread treatment.
