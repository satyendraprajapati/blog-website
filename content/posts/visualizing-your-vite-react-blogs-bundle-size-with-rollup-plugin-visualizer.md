---
title: "Visualizing Your Vite + React Blog's Bundle Size with rollup-plugin-visualizer"
date: "2026-11-03"
tags: ["web-development", "vite", "performance"]
excerpt: "Using rollup-plugin-visualizer to see exactly which dependencies are inflating your production bundle before you decide what to cut or lazy-load."
---

Core Web Vitals tell you a page is slow; they don't tell you *why* your JavaScript bundle is as big as it is. Before reaching for code-splitting or swapping out a library, it helps to actually see what's inside the bundle Vite ships to production. `rollup-plugin-visualizer` renders that as an interactive treemap you can open right in the browser.

**Install it as a dev dependency.** It hooks into Rollup, which Vite uses under the hood for production builds, so no separate build tool is needed.

```bash
npm install --save-dev rollup-plugin-visualizer
```

**Add it to `vite.config.js` as a plugin, scoped to the build.** You only want this running for production builds, not every time the dev server starts:

```js
import { visualizer } from 'rollup-plugin-visualizer'

export default {
  plugins: [
    // ...your existing plugins
    visualizer({
      filename: 'stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
}
```

**Run your normal build command.** `npm run build` now also writes a `stats.html` file and opens it automatically, showing every module in the bundle as a rectangle sized by its contribution to the final output.

**Look for the biggest rectangles first.** On a Markdown-based blog, the usual surprises are a charting library (Recharts, D3) pulled in for a single post, a date library imported in full instead of the specific functions used, or a syntax-highlighting theme bundling languages you never reference.

**Check gzip and brotli size, not just raw size.** A library can look large in raw bytes but compress well, or the reverse. The toggle in the visualizer's legend switches between the two, and gzip/brotli size is the number that actually matches what a visitor downloads over the network.

**Act on what you find, don't just admire it.** If one post's chart library dominates the main bundle, that's a sign to move it behind `React.lazy` so it only loads on pages that use it. If a utility library is imported wholesale for one function, switching to a named import (or a lighter alternative) often shrinks it more than any build-config tweak would.

**Re-run after each change to confirm it worked.** The visualizer is cheap enough to run after every meaningful dependency change — it's the fastest way to confirm that a lazy-load or a swapped-out library actually moved the needle instead of just moving the code to a different chunk.

This isn't a replacement for measuring real-world load performance — it only shows what's shipped, not how it's used at runtime. But it turns "the bundle feels big" into a concrete list of what to fix first.
