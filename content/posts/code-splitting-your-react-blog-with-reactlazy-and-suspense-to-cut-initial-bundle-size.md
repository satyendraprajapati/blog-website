---
title: "Code-Splitting Your React Blog with React.lazy and Suspense to Cut Initial Bundle Size"
date: "2026-08-21"
tags: ["web-development", "react", "performance"]
excerpt: "A Vite build bundles every page's JavaScript into one download by default — code-splitting by route means a visitor reading a post doesn't also pay for the Contact form's code."
---

By default, `vite build` bundles your entire app — every page, every component — into one JavaScript file the browser has to download and parse before anything renders. That's fine for a five-page site early on, but as a blog grows to add a contact form, a Power BI embed, interactive Recharts visualizations, and a search index, the bundle a first-time visitor downloads just to read one blog post keeps growing with pages they may never open. Code-splitting fixes this by breaking the bundle apart so each route loads its own JavaScript on demand.

**1. `React.lazy` turns a static import into one that loads on demand.** Instead of importing a page component directly, you wrap the import in `React.lazy`, which returns a component that Vite builds as a separate chunk and only fetches when it's actually rendered.

```jsx
import { lazy } from 'react'

const Contact = lazy(() => import('./pages/Contact'))
const Post = lazy(() => import('./pages/Post'))
const Blog = lazy(() => import('./pages/Blog'))
```

**2. `Suspense` provides the fallback UI while a lazy chunk is downloading.** A lazy component can't render synchronously the first time it's needed — there's a network request in between — so React needs a `Suspense` boundary above it in the tree with a `fallback` to show in the meantime. Wrap your routes once, near the top of `App.jsx`, rather than around each individual route.

```jsx
import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

<Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:slug" element={<Post />} />
    <Route path="/contact" element={<Contact />} />
  </Routes>
</Suspense>
```

**3. Split by route, not by component, for the best effort-to-payoff ratio.** You can lazy-load individual components too, but the win that actually matters on a blog is at the page level — a visitor landing on `/blog/:slug` shouldn't download the Contact page's Formspree integration or the Portfolio page's project gallery code. Small shared components like `Header` and `Footer` should stay as regular imports since every page needs them anyway; splitting those apart just adds more round trips for no benefit.

**4. Check the actual effect with a production build, not the dev server.** Vite's dev server already serves modules on demand, so code-splitting is invisible there — you won't see a difference until you run `npm run build` and look at the output. The build log lists each generated chunk with its size; you're looking for your route components to show up as separate files instead of one large `index-[hash].js` containing everything.

```bash
npm run build
```

**5. Keep the fallback lightweight and layout-stable.** A blank white flash or a fallback that doesn't match the page's eventual layout creates a visible jump the moment the real content loads in. A simple centered loading message, or a skeleton that roughly matches the page shape, avoids that jolt — and on a fast connection most visitors won't see it at all, since the chunk for a typical blog page is small enough to load in well under a second.

**6. Don't split what's already small.** A five-page blog with a lightweight Contact form isn't going to see a dramatic before/after on Lighthouse from this alone — the bigger wins usually come from image handling and font loading, which is its own topic. Code-splitting matters more as the app grows: once you've added a client-side search index, an embedded dashboard, and a handful of interactive chart components, route-level splitting is what keeps a visitor reading one post from downloading code for features they'll never touch.

The pattern costs about ten lines of changes to `App.jsx` and pays for itself the moment your site has more than a couple of pages with meaningfully different dependencies.
