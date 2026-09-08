---
title: "Building a Single-File HTML Dashboard with Chart.js (No Framework, No Build Step)"
date: "2026-09-08"
tags: ["web-development", "data-visualization", "beginner"]
excerpt: "How to turn a handful of numbers from a spreadsheet into a shareable interactive chart using nothing but one HTML file and a CDN script tag."
---

Not every chart needs a full web app behind it. If you just want to turn a handful of numbers from a spreadsheet into something interactive that a stakeholder can open, zoom into, and hover over, you don't need React, Vite, npm, or a deployment pipeline — you need one HTML file and a single script tag pointing at a charting library.

**1. Pull in Chart.js from a CDN instead of installing anything.** A CDN link loads the library straight from the browser, with zero setup on your machine.
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

**2. Put a `<canvas>` element where you want the chart, and give it an id.** Chart.js draws onto a canvas element, so the rest of your page is just plain HTML wrapped around it.
```html
<canvas id="revenueChart" width="600" height="300"></canvas>
```

**3. Paste your data in directly as arrays — no database or API needed.** For a one-off report, hardcoding the numbers you copied out of Excel is faster and more transparent than wiring up a data source.
```html
<script>
  new Chart(document.getElementById('revenueChart'), {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr'],
      datasets: [{ label: 'Revenue ($k)', data: [42, 51, 47, 63] }]
    }
  });
</script>
```

**4. Save the file and just double-click it — no server required.** Because everything (markup, styling, data, and the chart script) lives in one `.html` file, opening it directly in a browser works fine for sharing over email or a shared drive. If you want it reachable by a URL instead, drag the same file into any static host with no build configuration at all.

**5. Know when to graduate to a real framework.** This approach is great for a single chart or a small dashboard that changes rarely. Once you're pulling live data, need multiple pages, or want to reuse components across many reports, that's the point to move to something like React — not before. Reaching for a framework on day one is a common way to turn a ten-minute task into a multi-day setup problem.

**6. Watch out for the `file://` restriction if you try to `fetch()` a separate CSV.** Opening an HTML file directly, rather than through a web server, blocks JavaScript's `fetch()` from reading local files in most browsers. If you want to load an external CSV instead of hardcoding numbers, serve the folder with something as simple as `npx serve` rather than double-clicking the file.

The instinct to reach for a full framework and a build toolchain for a "just show me the chart" request is understandable, but it's usually overkill. A single HTML file gets a stakeholder-ready, interactive chart in front of someone in minutes, and it's a genuinely useful skill on its own — separate from whatever bigger portfolio site or blog you might build later.
