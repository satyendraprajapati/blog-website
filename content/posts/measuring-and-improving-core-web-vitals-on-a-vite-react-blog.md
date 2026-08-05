---
title: "Measuring and Improving Core Web Vitals on a Vite React Blog"
date: "2026-08-05"
tags: ["web-development", "performance", "beginner"]
excerpt: "How to measure LCP, CLS, and INP on a static React blog with Lighthouse, and the specific fixes that move each metric on a Markdown-driven site."
---

A static Vite/React blog feels fast in local dev, but "feels fast on my machine" isn't the same as passing Google's Core Web Vitals — the three metrics that also factor into search ranking. Here's how to measure them and the fixes that actually move the needle on a Markdown-based site like this one.

**1. Measure a baseline before changing anything.** Run a production build (`npm run build && npm run preview`) rather than the dev server — dev mode skips minification and bundling, so its numbers don't reflect what visitors actually load. Open the built site in Chrome DevTools' Lighthouse panel, or run PageSpeed Insights against the deployed Vercel URL for a real-world score including network conditions. Note the three scores before touching code: **LCP** (Largest Contentful Paint — how long the biggest visible element takes to render), **CLS** (Cumulative Layout Shift — how much content jumps around as things load), and **INP** (Interaction to Next Paint — how responsive the page feels when clicked or tapped).

**2. Fix LCP by not blocking it on JavaScript.** On a blog post page, the largest element is usually the hero image or the first paragraph of text. If a cover image loads from an unoptimized source or waits behind a JS bundle to render, LCP suffers. Serve images at the size they're actually displayed at, and lazy-load everything *except* the one likely to be the LCP element (lazy-loading it too tells the browser to deprioritize the very thing you're timing):

```jsx
<img src={post.coverImage} alt={post.title} width={1200} height={630} loading="eager" />
```

For images further down the page — inside post bodies, on the blog listing grid — lazy-load them instead so they don't compete for bandwidth with what's above the fold:

```jsx
<img src={src} alt={alt} loading="lazy" decoding="async" />
```

**3. Fix CLS by reserving space before content loads.** Layout shift on a blog usually comes from images or ads rendering without a known size, pushing text down after the reader has already started reading it. Always set explicit `width` and `height` (or an `aspect-ratio` in CSS) on post images so the browser reserves the space immediately, even before the image file arrives:

```css
img { aspect-ratio: attr(width) / attr(height); }
```

Web fonts are the other common culprit — a swap from a fallback system font to your custom font after load can reflow the whole page. Add `font-display: swap` to your `@font-face` rule (or use `font-display: optional` if a slight flash of fallback text is preferable to any shift at all).

**4. Fix INP by code-splitting routes.** React Router apps often ship the whole site — Home, Blog, Post, Tag, About, Contact — as one JS bundle, which means a visitor's first click has to wait on parsing and running code for pages they haven't even navigated to yet. Split each route with `React.lazy` so only the code for the current page loads up front:

```jsx
const Blog = React.lazy(() => import('./pages/Blog'));
const Post = React.lazy(() => import('./pages/Post'));

<Suspense fallback={<PageSkeleton />}>
  <Routes>
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:slug" element={<Post />} />
  </Routes>
</Suspense>
```

**5. Re-run Lighthouse after each fix, not just at the end.** The three metrics interact — an aggressive lazy-loading change can occasionally hurt CLS if it's applied to the wrong image. Measuring after each change instead of batching them all together makes it obvious which fix actually helped and which one didn't.

None of this requires abandoning the static-site approach — it's the same Markdown-and-React stack, just with the loading order and bundle size made deliberate instead of accidental.
