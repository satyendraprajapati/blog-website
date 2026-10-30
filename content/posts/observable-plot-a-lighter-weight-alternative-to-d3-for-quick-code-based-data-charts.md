---
title: "Observable Plot: A Lighter-Weight Alternative to D3 for Quick, Code-Based Data Charts"
date: "2026-10-30"
tags: ["web-development", "javascript", "data-visualization"]
excerpt: "A grammar-of-graphics JavaScript library that gets you from a raw array of data to a labeled chart in a few lines, without D3's low-level setup."
---

D3 is powerful but it makes you build everything — scales, axes, shapes — by hand. If you just want a bar chart or scatter plot out of an array of objects, that's a lot of ceremony for a result Excel or Power BI could give you in two clicks. Observable Plot, built by the same team behind D3, closes that gap for code-based charting without giving up the flexibility that made you reach for D3 in the first place.

**1. Install it like any other npm package.** In a Vite + React project:

```bash
npm install @observablehq/plot d3
```

Plot uses D3 internally for scales and shapes, but you never touch D3's API directly — you describe the chart, and Plot handles the rendering.

**2. Think in "marks," not in SVG elements.** A chart is a list of marks — `Plot.barY`, `Plot.line`, `Plot.dot` — each one told which fields of your data to map to which visual channel:

```js
import * as Plot from '@observablehq/plot'

const chart = Plot.plot({
  marks: [
    Plot.barY(sales, { x: 'month', y: 'revenue', fill: 'region' }),
  ],
  y: { grid: true, label: 'Revenue ($)' },
})

document.querySelector('#chart-container').append(chart)
```

That's a grouped, gridlined, labeled bar chart from one function call — no manual scale creation, no axis-drawing code.

**3. Mounting it in React takes a `useEffect` and a ref, since Plot renders a DOM node directly rather than JSX.**

```jsx
function RevenueChart({ data }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const chart = Plot.plot({
      marks: [Plot.barY(data, { x: 'month', y: 'revenue' })],
    })
    containerRef.current.append(chart)
    return () => chart.remove()
  }, [data])

  return <div ref={containerRef} />
}
```

The cleanup function matters — without it, every re-render leaves a stale chart appended alongside the new one.

**4. Faceting replaces a lot of "small multiples" boilerplate.** Where a hand-rolled D3 chart needs a loop and manual positioning to show one chart per category, Plot's `fx`/`fy` channels do it declaratively:

```js
Plot.plot({
  marks: [Plot.line(sales, { x: 'month', y: 'revenue', fx: 'region' })],
})
```

That single config produces one small line chart per region, laid out in a grid, with consistent axes across all of them.

**5. It still composes down to raw SVG when you need to go further.** `Plot.plot()` returns a real SVG (or HTML) element, so anything Plot doesn't expose a shorthand for — a custom annotation, a specific transform — can be added by reaching into the returned node or dropping to D3 for that one piece, rather than rewriting the whole chart in D3 from scratch.

**6. It's a better fit than D3 for most analyst-built dashboards, and a better fit than Chart.js or Recharts when your data needs a transform Plot has a name for** — binning, stacking, grouping, faceting — since those are first-class options on a mark rather than something you compute manually before handing data to the chart.

Reach for Observable Plot when a canned chart library's chart types don't quite fit your data's shape, but full D3 feels like more setup than the chart deserves — it covers a wide middle ground between the two with noticeably less code than either extreme.
