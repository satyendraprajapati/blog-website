---
title: "Lazy-Mounting Heavy Embeds in Your React Blog with Intersection Observer"
date: "2026-09-30"
tags: ["web-development", "react", "performance"]
excerpt: "How to delay mounting a heavy Recharts or embedded Power BI dashboard until it's about to scroll into view, so a post's initial render stays light even with several charts further down the page."
---

A data-analysis blog post with three or four embedded charts loads all of them the moment the page renders, even though a reader scrolling from the top won't see the third chart for several seconds. Each one still parses its dataset, computes scales, and paints an SVG the instant the component mounts — work that's wasted on content nobody has scrolled to yet. The `IntersectionObserver` browser API lets a component defer that work until it's actually about to become visible.

**1. Understand what the observer actually watches.** `IntersectionObserver` takes a callback and a target element, and fires that callback whenever the element crosses a visibility threshold relative to the viewport — no scroll-event listener, no manual `getBoundingClientRect` math on every scroll frame. It's built for exactly this "is this about to be visible" question.

**2. Wrap the pattern in a small reusable hook.** Rather than repeating observer setup in every chart component, write it once.
```javascript
import { useEffect, useRef, useState } from "react";

function useInView(rootMargin = "200px") {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || isVisible) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return [ref, isVisible];
}
```
The `rootMargin` of `"200px"` triggers visibility a bit before the element physically enters the viewport, so a chart is already mounted and rendered by the time a reader actually scrolls to it — not half a second after.

**3. Gate the expensive component behind the flag, not the data fetch.** Render a lightweight placeholder — a fixed-height div matching the chart's eventual size — until `isVisible` flips, then swap in the real component.
```javascript
function LazyChart({ data }) {
  const [ref, isVisible] = useInView();
  return (
    <div ref={ref} style={{ minHeight: 320 }}>
      {isVisible ? <RevenueChart data={data} /> : null}
    </div>
  );
}
```
Reserving the height up front matters as much as the lazy mount itself — without it, the page's layout shifts every time a chart pops in, which is jarring for the reader and actively hurts the Cumulative Layout Shift metric.

**4. Combine it with React.lazy for the biggest wins.** Deferring *mounting* saves the render and computation cost; deferring the *import* also saves bytes from the initial bundle. Pairing `useInView` with `React.lazy` and `Suspense` means a post with an embedded Power BI iframe or a heavy charting library doesn't pull that code into the bundle until the reader is close to needing it at all.
```javascript
const RevenueChart = React.lazy(() => import("./RevenueChart"));
```

**5. Skip it for anything already near the top of the post.** A chart in the first screenful of content should just render immediately — wrapping it in `useInView` only adds a flash of placeholder for something that was going to be visible on load anyway. Reserve the pattern for embeds that sit below the fold on a typical viewport.

**6. Disconnect the observer once it's done its job.** The hook above calls `observer.disconnect()` in its cleanup and also skips re-observing once `isVisible` is already `true` — without that, the observer keeps firing every time the element's intersection ratio changes, which is unnecessary work for an element that only ever needs to trigger once.

The result is a post that feels just as fast to start reading whether it has one chart or six, because the browser is only ever asked to do the expensive work for the chart currently earning its place on screen.
