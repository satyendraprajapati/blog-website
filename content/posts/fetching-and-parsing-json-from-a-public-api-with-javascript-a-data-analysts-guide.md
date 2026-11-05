---
title: "Fetching and Parsing JSON From a Public API With JavaScript: A Data Analyst's Guide"
date: "2026-11-05"
tags: ["web-development", "javascript", "beginner"]
excerpt: "A practical walkthrough of fetch(), async/await, and turning a nested JSON response into a flat array you can actually chart or table."
---

If you're coming from Excel or Python, pulling data from a web API in plain JavaScript looks unfamiliar mainly because of two things: `fetch` returns a promise instead of data, and API responses are usually nested in a shape that doesn't match the flat rows you want. Neither is complicated once you've seen the pattern once.

**1. `fetch` gives you a response, not the data — you have to unwrap it twice.** The first `await` gets you an HTTP response object; calling `.json()` on it and awaiting *that* is what actually parses the body into a usable JavaScript object:
```js
async function getSales() {
  const response = await fetch("https://api.example.com/sales");
  const data = await response.json();
  return data;
}
```
Skipping the second step and trying to read fields off `response` directly is the single most common mistake here — `response` is metadata (status code, headers), not your data.

**2. Check `response.ok` before you trust anything in the body.** `fetch` only rejects its promise on a network failure — a 404 or 500 still resolves successfully, with an error page or empty body as the "data." Guard against that explicitly:
```js
const response = await fetch("https://api.example.com/sales");
if (!response.ok) {
  throw new Error(`Request failed: ${response.status}`);
}
const data = await response.json();
```

**3. Expect the real data to be nested a few levels deep, not sitting at the top.** A typical API response wraps your rows inside metadata — pagination info, a status field, a request ID:
```json
{
  "status": "ok",
  "page": 1,
  "results": {
    "sales": [
      { "region": "West", "amount": 4200 },
      { "region": "East", "amount": 3100 }
    ]
  }
}
```
That means `data.results.sales` is the array you actually want, not `data` itself — the first debugging step for "my code says undefined" is almost always `console.log(data)` to see the real shape before writing a single line that reads from it.

**4. Reshape the array with `.map()` instead of writing a loop.** Once you have the array, `.map()` turns each raw object into exactly the fields you need, in the order you want them — the JavaScript equivalent of selecting and renaming columns:
```js
const rows = data.results.sales.map(row => ({
  Region: row.region,
  Amount: row.amount,
}));
```

**5. Filter and sum with `.filter()` and `.reduce()` the way you'd use `SUMIFS` in Excel.** These read almost directly as the Excel equivalent once you know the names:
```js
const westTotal = rows
  .filter(r => r.Region === "West")
  .reduce((sum, r) => sum + r.Amount, 0);
```

**6. Wrap the whole thing in `try`/`catch` so one bad response doesn't crash the page.** A network hiccup or an API outage shouldn't take down a chart that depends on this data — catch the error and fall back to something visible instead of a blank screen:
```js
try {
  const rows = await getSales();
  renderChart(rows);
} catch (err) {
  console.error(err);
  showErrorMessage("Couldn't load sales data right now.");
}
```

Once `fetch` → `.json()` → reshape with `.map()`/`.filter()`/`.reduce()` clicks as one repeatable pattern, pulling live data into a page stops being a JavaScript problem and becomes the same data-wrangling you already do — just with different function names than Excel or pandas.
