---
title: "Using the ResizeObserver API to Keep Dashboard Charts Sized to Their Container"
date: "2026-11-21"
tags: ["web-development", "react", "data-visualization"]
excerpt: "Why listening for window resize events isn't enough to keep a chart correctly sized inside a flexible dashboard layout, and how ResizeObserver fixes it."
---

A chart that looks perfect on page load can end up squashed or overflowing the moment a sidebar collapses, a panel gets dragged wider, or a browser's dev tools open and shrink the viewport without the window itself resizing. Most charting libraries size themselves once, on mount, based on their container's dimensions at that instant — and never check again unless something tells them to. `ResizeObserver` is the browser API built specifically to tell them.

**1. The naive fix — listening to `window.resize` — misses most real layout changes.** A dashboard's chart container rarely changes size because the browser window changed size; it changes because a sibling element did (a filter panel opened, a table grew taller, a CSS grid track reflowed). None of those fire a `resize` event on `window`, so a chart wired up that way stays stale until the user happens to also resize the browser.

**2. `ResizeObserver` watches an element directly, not the window.** You give it a callback and tell it which element to watch; it fires whenever that element's content box actually changes size, regardless of why.
```js
const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect;
    chart.resize(width, height);
  }
});

observer.observe(chartContainerRef.current);
```
This fires on a sidebar collapsing, a flex/grid reflow, a CSS transition finishing, a font loading and changing text height — any of the layout-shifting events a `window.resize` listener would silently miss.

**3. In React, pair it with a ref and clean it up in an effect.** The observer needs a real DOM node to watch, so it has to be set up after the container has mounted, and torn down when the component unmounts or the dependency changes:
```jsx
function ResponsiveChart({ data }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(containerRef.current);
    chartRef.current = chart;

    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      chart.dispose();
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(buildOption(data));
  }, [data]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
```
Most major charting libraries (ECharts, Chart.js, Plotly) expose a `resize()` method for exactly this — the observer's job is just to call it at the right moments, not to resize the canvas itself.

**4. It solves the "chart inside a resizable panel" problem cleanly.** A split-pane dashboard layout where a user drags a divider to make one panel wider doesn't change the window size at all — only the panel's CSS width, which cascades down to the chart container. `ResizeObserver` catches that cascade directly at the element that actually changed, without needing the drag handler itself to know every chart exists.

**5. Debounce the callback if the chart redraw is expensive.** `ResizeObserver` can fire several times in rapid succession during a smooth drag-resize or a CSS transition, and a heavy chart re-render on every single one of those ticks can visibly lag. Wrapping the resize call in a short debounce keeps the chart responsive without redrawing dozens of times per second:
```js
const observer = new ResizeObserver(debounce(() => chart.resize(), 100));
```

**6. Watch out for infinite loops when the observed element's own size depends on its content.** If resizing the chart changes the size of the element `ResizeObserver` is watching — easy to do accidentally with certain auto-sizing layouts — you can trigger the callback again indefinitely. Observe a stable wrapper `div` with an explicit size from CSS, and let the chart canvas fill that wrapper, rather than observing an element whose dimensions the chart itself influences.

**7. Browser support is no longer a concern.** `ResizeObserver` has been supported in every major browser for several years now, so unlike some newer observer-style APIs, there's no need for a polyfill or feature-detection fallback in a typical dashboard project — it's safe to reach for directly.

A chart that only sizes itself once is a chart that's correct exactly at the moment it loads and increasingly wrong after that. `ResizeObserver` keeps it honest for the lifetime of the page, which matters a lot more on a dashboard — full of panels, sidebars, and user-resizable layouts — than it does on a static blog post.
