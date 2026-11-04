---
title: "Running SQL Queries on a CSV File Directly in the Browser with DuckDB-Wasm"
date: "2026-11-04"
tags: ["web-development", "sql", "data-analysis"]
excerpt: "How DuckDB-Wasm lets you drop a CSV into a web page and run real SQL against it entirely in the browser, with no server and no upload of the data anywhere."
---

If you've ever wanted to let someone explore a CSV with real SQL without spinning up a database, uploading the file to a server, or asking them to install anything, DuckDB-Wasm is worth knowing about. It's the DuckDB analytical database compiled to WebAssembly, running entirely inside the browser tab — the file never leaves the visitor's machine.

**1. Understand why this matters for data work specifically.** A lot of "paste your data into this web tool" products quietly upload the file to a server to process it, which is a non-starter for anything containing real customer or financial data. Because DuckDB-Wasm runs as WebAssembly in the browser's own sandbox, the CSV is read and queried locally — nothing is sent anywhere, which makes it genuinely usable for sensitive data, not just toy demos.

**2. Install the package.** It ships as an npm package with prebuilt WASM bundles, so there's no separate binary to manage:

```bash
npm install @duckdb/duckdb-wasm
```

**3. Spin up an in-browser database instance.** DuckDB-Wasm needs to load its WASM module and a worker script before it can run anything — this setup happens once per page load:

```javascript
import * as duckdb from '@duckdb/duckdb-wasm';

async function initDuckDB() {
  const bundles = duckdb.getJsDelivrBundles();
  const bundle = await duckdb.selectBundle(bundles);
  const worker = await duckdb.createWorker(bundle.mainWorker);
  const db = new duckdb.AsyncDuckDB(new duckdb.ConsoleLogger(), worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  return db;
}
```

**4. Register the CSV a user drops onto the page.** `registerFileBuffer` hands DuckDB the file's raw bytes directly from a browser `File` object (e.g. from a drag-and-drop zone or `<input type="file">`), with no upload step in between:

```javascript
const file = fileInput.files[0];
const buffer = await file.arrayBuffer();
await db.registerFileBuffer('sales.csv', new Uint8Array(buffer));
```

**5. Run real SQL against it.** Once registered, the file is queryable as a table by name — joins, aggregates, window functions, and CTEs all work, because this is the same SQL engine, just running in a different place:

```javascript
const conn = await db.connect();
const result = await conn.query(`
  SELECT region, SUM(revenue) AS total_revenue
  FROM 'sales.csv'
  GROUP BY region
  ORDER BY total_revenue DESC
`);
console.log(result.toArray());
await conn.close();
```

**6. Use it to replace a one-off Python or Excel step, not your whole analytics stack.** The sweet spot is a web page or internal tool where someone needs to filter, join, or aggregate a CSV ad hoc — a client-facing data portfolio, an internal QA tool, or a "drop your export here" utility — without you building a backend to process the upload. For a one-time 50-row file, SQL is overkill; for a multi-megabyte export someone wants to slice a dozen different ways, it beats writing throwaway JavaScript filters by hand.

The tradeoff is bundle size — the WASM module and worker add a meaningful chunk to what the browser downloads, so it's worth lazy-loading this behind a button rather than bundling it into your site's initial page load.
