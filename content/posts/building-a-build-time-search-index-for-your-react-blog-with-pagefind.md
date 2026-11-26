---
title: "Building a Build-Time Search Index for Your React Blog with Pagefind (No Client-Side Indexing Library)"
date: "2026-11-26"
tags: ["web-development", "react", "performance"]
excerpt: "How to add fast, static search to a Vite + React blog with Pagefind, which indexes your built HTML instead of shipping an indexing library to the browser."
---

Client-side search libraries work by shipping the entire search index — or the logic to build one — down to the browser. That's fine for a few dozen posts, but it means every visitor downloads megabytes of index data just in case they use the search box. Pagefind takes the opposite approach: it crawls your already-built static site after `vite build` runs and writes a small, chunked index to disk, so nothing is indexed in the browser at all.

**1. Install Pagefind as a dev dependency.** It's a Rust binary distributed through npm, so there's nothing extra to set up.
```bash
npm install --save-dev pagefind
```

**2. Run it against your build output after `vite build` finishes.** Pagefind needs real, rendered HTML to crawl — it reads your `dist` folder, not your React source.
```json
"scripts": {
  "build": "vite build && pagefind --site dist"
}
```

**3. Mark the content Pagefind should and shouldn't index.** By default it indexes everything inside `<body>`, which means your header, footer, and sidebar links show up as noise in every result. Wrap your post content in a `data-pagefind-body` attribute so only that region gets indexed.
```jsx
<article data-pagefind-body>
  <ReactMarkdown>{post.content}</ReactMarkdown>
</article>
```

**4. Load the generated search UI (or your own) at runtime.** Pagefind writes a small JS/CSS bundle into `dist/pagefind/`. Mount its default UI inside a React component with a ref, after the index files exist:
```jsx
useEffect(() => {
  import(/* @vite-ignore */ "/pagefind/pagefind-ui.js").then(() => {
    new window.PagefindUI({ element: "#search" });
  });
}, []);
```
Because this only runs in the built site — Pagefind has nothing to serve in `vite dev` — test search against `vite preview`, not the dev server.

**5. Filter results by tag using Pagefind's metadata attributes.** Tag each post's content with `data-pagefind-filter="tag"` so the search UI can offer tag filters without you writing any filtering logic yourself.
```jsx
<article data-pagefind-body data-pagefind-filter="tag:${post.tags[0]}">
```

**6. Confirm the index is actually being generated, not silently skipped.** A common failure mode is running Pagefind against a `dist` folder that doesn't exist yet because the build script ordering is wrong — it logs how many pages and words it indexed on a successful run, so check that output rather than assuming the search box works.

The tradeoff is the opposite of FlexSearch: Pagefind adds a build step instead of a bundle, which is the right call once a blog has enough posts that shipping the whole index to every visitor stops being free.
