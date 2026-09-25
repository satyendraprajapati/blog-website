---
title: "Formatting Numbers Consistently in Your React Data Portfolio with Intl.NumberFormat"
date: "2026-09-25"
tags: ["web-development", "react", "javascript"]
excerpt: "Stop hand-rolling toFixed and string concatenation for every stat card — the browser's built-in Intl.NumberFormat handles currency, percentages, and compact notation with no library."
---

A project page with a few stat tiles — revenue, growth rate, total users — almost always starts with something like `` `$${value.toFixed(2)}` ``. It works until the number needs a thousands separator, a different currency symbol, or a compact "1.2M" instead of "1200000," and every tile ends up formatted slightly differently because each one grew its own ad hoc string logic. `Intl.NumberFormat` is built into every browser, needs no dependency, and solves all of it in one API.

**1. Stop concatenating strings for currency.** `toFixed(2)` gets the decimals right but does nothing about commas, currency symbols, or negative-number formatting. `Intl.NumberFormat` handles all three from a single config object:

```js
const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

currency.format(1234567.8); // "$1,234,567.80"
```

**2. Use `style: 'percent'` instead of multiplying by 100 and appending a `%` by hand.** It also rounds correctly, which manual string-building tends to get wrong at the edges:

```js
const percent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
});

percent.format(0.1234); // "12.3%"
```

**3. Use compact notation for stat tiles that need to stay short.** A KPI card showing "$1,284,392" is harder to scan at a glance than "$1.3M" — `notation: 'compact'` does that conversion automatically, including the right suffix (K, M, B) for the magnitude:

```js
const compactCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

compactCurrency.format(1284392); // "$1.3M"
```

**4. Create each formatter once, not on every render.** `new Intl.NumberFormat(...)` does real work parsing its options, and calling it inside a component body means every render pays that cost again. Define the formatters once at module scope (or inside `useMemo` if the locale or currency is dynamic) and just call `.format()` on the cached instance:

```js
// formatters.js
export const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const compactUsd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

export const pct = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
});
```

**5. Import the shared formatters everywhere a number gets displayed.** A `StatCard` component, a sortable table's numeric column, and a chart tooltip all end up calling `usd.format(value)` or `pct.format(value)` from the same file, which is what actually guarantees every number on the site looks consistent — instead of each component owning its own rounding and symbol logic.

```jsx
import { compactUsd, pct } from '../lib/formatters';

function StatCard({ label, revenue, growth }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{compactUsd.format(revenue)}</p>
      <p className="text-sm text-green-600">{pct.format(growth)}</p>
    </div>
  );
}
```

**6. Reach for `toLocaleString()` only for one-off cases.** Every number also has a `.toLocaleString('en-US', options)` method that takes the same options object — fine for a single quick format inside a script, but a shared `formatters.js` module still wins for a real site, since it's the one place that decides how a dollar amount or percentage looks anywhere on the page.

It's a small change, but it's the difference between a portfolio where every number looks like it came from the same report and one where each stat tile was formatted by hand on a different day.
