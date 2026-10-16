---
title: "Using CSS Container Queries to Make Blog Post Cards Responsive to Their Container, Not the Viewport"
date: "2026-10-16"
tags: ["web-development", "css", "react"]
excerpt: "A PostCard that looks right in a 3-column grid often breaks when you reuse it in a narrow sidebar -- container queries let the card respond to its own width instead of the browser window's."
---

A `PostCard` component styled with a media query looks fine in the main blog grid, then breaks the moment you reuse it somewhere narrower — a "related posts" sidebar, a smaller widget on the homepage. The media query checks the browser window's width, but the card's actual problem is its *container's* width, and those two numbers are often different. Container queries fix this by letting a component respond to the space it's actually been given.

**1. Mark the card's parent as a query container.** Any ancestor element can opt in with `container-type`, which tells the browser to track that element's size for queries inside it.
```css
.post-grid {
  container-type: inline-size;
  container-name: post-grid;
}
```
`inline-size` tracks just the width, which is enough for almost every card layout and avoids the performance cost of tracking height too.

**2. Query the container's width instead of the viewport's.** `@container` works like `@media`, but measures the named container rather than the window.
```css
@container post-grid (min-width: 480px) {
  .post-card {
    display: grid;
    grid-template-columns: 160px 1fr;
  }
}

@container post-grid (max-width: 479px) {
  .post-card {
    display: block;
  }
}
```
Drop that same `PostCard` into a 1200px-wide main grid and a 300px-wide sidebar, and each instance gets the layout that fits its actual column — a `@media` query checking the window would give both the same answer, since the window is one width regardless of where the card sits inside it.

**3. Use container query units for text that should scale with the card, not the page.** `cqw` (container query width) is a percentage of the container's width, letting a headline size itself relative to the card instead of the viewport.
```css
.post-card__title {
  font-size: clamp(1rem, 4cqw, 1.5rem);
}
```

**4. Name your containers once you have more than one nested.** `container-name` matters once a card sits inside both a grid and, say, a modal preview — naming lets `@container post-grid (...)` target the grid specifically instead of whichever container happens to be closest, which avoids silently matching the wrong ancestor as your layout grows.

**5. Check support before relying on it as your only breakpoint strategy.** Container queries have landed in every major browser shipped in the last couple of years, but if your blog still needs to support an older browser, keep a `@media`-based fallback layout as the default and treat the `@container` rules as a progressive enhancement rather than the only styling path.

**6. Reach for this specifically when a component gets reused in more than one layout.** A one-off, page-level section that will only ever be full-width doesn't need this — plain media queries are simpler there. Container queries earn their complexity for exactly the case React encourages: the same component instantiated in several differently-sized places.

The win isn't a new visual effect — it's that the component's responsive behavior lives with the component, instead of depending on which page happens to be rendering it.
