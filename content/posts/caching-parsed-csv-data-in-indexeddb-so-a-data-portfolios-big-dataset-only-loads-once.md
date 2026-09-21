---
title: "Caching Parsed CSV Data in IndexedDB So a Data Portfolio's Big Dataset Only Loads Once"
date: "2026-09-21"
tags: ["web-development", "react", "performance"]
excerpt: "A sortable table or chart backed by a large CSV re-fetches and re-parses the whole file on every visit — IndexedDB lets a React portfolio page store the parsed rows and skip both steps after the first load."
---

A project page that fetches a 5MB CSV, parses it, and renders a sortable table already does the parsing off the main thread if you followed the Web Worker approach — but it still re-downloads and re-parses that same file from scratch every single visit. IndexedDB is the browser's own database, and it's the right tool for keeping the *parsed* result around between visits instead of just the raw file.

**1. Reach for IndexedDB, not localStorage, once the dataset is more than trivial.** localStorage is synchronous, string-only, and capped at roughly 5–10MB — parsing a CSV into an array of objects and calling `JSON.stringify` on it to store there will jank the main thread and can silently fail past the size limit. IndexedDB is asynchronous, stores structured data natively, and comfortably handles tens of megabytes.

**2. Wrap the raw API in a tiny helper instead of hand-rolling IndexedDB's callback-based API everywhere.** The `idb` package (a small wrapper by the same author as Workbox) turns IndexedDB's event-based interface into promises you can `await`.

```js
import { openDB } from 'idb';

async function getDB() {
  return openDB('portfolio-datasets', 1, {
    upgrade(db) {
      db.createObjectStore('csv-cache');
    },
  });
}
```

**3. Key the cache entry on the file's URL and a version or last-modified marker, not just its name.** Store the parsed rows under a key like `sales-2026.csv::v3` rather than `sales-2026.csv`, so replacing the source file with an updated export invalidates the old cached copy instead of silently serving stale rows forever.

**4. Check the cache before fetching, and only parse on a miss.**

```js
async function loadDataset(url, version) {
  const db = await getDB();
  const key = `${url}::${version}`;
  const cached = await db.get('csv-cache', key);
  if (cached) return cached;

  const text = await fetch(url).then(r => r.text());
  const rows = parseCsv(text); // e.g. via PapaParse, ideally in a Web Worker
  await db.put('csv-cache', rows, key);
  return rows;
}
```

**5. Pair it with a loading state that only shows up on a real cache miss.** Track whether the data came from `db.get` or from a fresh parse, and skip the skeleton/spinner UI on a cache hit — the whole point is that a returning visitor's table or chart should render on the next tick instead of waiting through a fetch-and-parse cycle they've already paid for once.

**6. Give the cache a size ceiling and a simple eviction rule.** If a portfolio has several large-dataset project pages, don't let the cache grow unbounded — on write, check the object store's key count and delete the oldest entry (or track a `cachedAt` timestamp per row and prune anything older than, say, 30 days) before adding a new one.

**7. Let a hard refresh or explicit "reload data" control bypass it entirely.** Add a small "refresh data" button on the project page that deletes that entry's key and re-runs step 4 — useful for you as the site owner when you've updated the source file, and reassuring for a visitor who wants to confirm they're not looking at a stale cache.

The combination — Web Worker to keep parsing off the main thread, IndexedDB to skip parsing altogether on repeat visits — is what makes a data-heavy case study page feel instant the second time someone opens it, without needing a backend or an API to serve pre-processed data.
