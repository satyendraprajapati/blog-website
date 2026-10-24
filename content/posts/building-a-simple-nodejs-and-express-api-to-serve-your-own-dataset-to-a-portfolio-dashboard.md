---
title: "Building a Simple Node.js and Express API to Serve Your Own Dataset to a Portfolio Dashboard"
date: "2026-10-24"
tags: ["web-development", "node", "beginner"]
excerpt: "A minimal Express server that turns a local CSV into a real JSON API, so a portfolio dashboard fetches data instead of importing a static file."
---

Every dashboard example on this blog so far has fetched data from a static file bundled with the site or called someone else's public API. At some point it's worth knowing how to serve your *own* data instead — not because a static React blog needs a backend, but because "I built a small API" is a real, demonstrable skill for a data analyst's portfolio, and it opens the door to filtering, pagination, and computed fields a static JSON file can't do on its own.

**1. Start from the smallest possible server.** A new folder, `npm init -y`, then `npm install express`, and a single file is enough:
```javascript
const express = require('express');
const app = express();

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(3001, () => console.log('API running on port 3001'));
```
Run it with `node server.js` and hit `http://localhost:3001/api/health` in a browser — that round trip is the entire mental model for everything that follows.

**2. Load your dataset once at startup, not on every request.** For a CSV of a few thousand rows, there's no need for a database — read and parse it when the server starts, and keep it in memory:
```javascript
const fs = require('fs');
const { parse } = require('csv-parse/sync');

const records = parse(fs.readFileSync('./sales.csv'), {
  columns: true,
  cast: true,
});
```
Re-parsing the file on every request would work for a demo, but it's wasted work your API doesn't need to repeat for every single visitor.

**3. Add query parameters instead of hardcoding one response shape.** This is the actual value an API has over a static file — a client can ask for a slice of the data instead of downloading all of it and filtering in the browser:
```javascript
app.get('/api/sales', (req, res) => {
  const { region, limit } = req.query;
  let result = records;
  if (region) result = result.filter(r => r.region === region);
  if (limit) result = result.slice(0, Number(limit));
  res.json(result);
});
```
Now `/api/sales?region=West&limit=50` is a real, filterable endpoint instead of a fixed download.

**4. Enable CORS before your deployed dashboard tries to call it.** A React app running on a different origin — `localhost:5173` in dev, your Vercel domain in production — gets blocked by the browser unless the API explicitly allows it:
```javascript
const cors = require('cors');
app.use(cors());
```
This is almost always the first error a beginner hits ("Failed to fetch" with no other detail in the console), and it's worth knowing the fix is one line on the server, not something broken in the fetch call itself.

**5. Deploy it somewhere that stays running, not on Vercel's static hosting.** The static site itself can live on Vercel as usual, but this little Express server needs a host that keeps a Node process alive — Render and Railway both have free tiers well suited to a small portfolio API. Point your dashboard's `fetch()` calls at that server's URL, and keep the URL in an environment variable rather than hardcoded, so switching hosts later doesn't mean hunting through the codebase.

**6. Add a simple in-memory cache if the dataset is read far more than it changes.** For data that only updates on a schedule — a nightly refresh, say — recomputing the same filtered response for every visitor is unnecessary work:
```javascript
const cache = new Map();
app.get('/api/summary', (req, res) => {
  if (!cache.has('summary')) {
    cache.set('summary', computeSummary(records));
  }
  res.json(cache.get('summary'));
});
```

This isn't a production-grade backend — there's no database, no auth, and no real error handling yet — but it's a genuine API doing genuine filtering, which is more than most "fetch a static JSON file" dashboard demos can say, and it's a natural next step once a portfolio site's data outgrows a file that ships with the frontend.
