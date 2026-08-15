---
title: "React Router Redirects: Handling Renamed or Removed Blog Post URLs Without Breaking Old Links"
date: "2026-08-15"
tags: ["web-development", "react", "seo"]
excerpt: "Rename a post's slug or retire an old one and every link to it — search results, bookmarks, social shares — quietly turns into a 404 unless you redirect it on purpose."
---

A Markdown-based blog's URLs are just filenames, which means renaming `content/posts/my-first-post.md` to something clearer instantly 404s every existing link to `/blog/my-first-post` — including whatever Google already indexed. React Router doesn't handle this for you automatically; it needs to be told explicitly.

**1. Never rename a slug without a redirect, once a post has been live.** Before renaming a file, ask whether it's ever been published — check your sitemap or Search Console for the old URL. If it has, plan the rename as an *add a redirect* task, not a *find and replace the filename* task; skip that step and the post effectively disappears from every place that already linked to it.

**2. Keep a small redirect map instead of scattering `<Route>` entries.** A plain object of old slug → new slug is easier to maintain than one-off routes buried in `App.jsx`:
```jsx
// src/lib/redirects.js
export const redirects = {
  'excel-vlookup-guide': 'xlookup-why-it-replaces-vlookup-for-data-analysts-and-when-it-doesnt',
  'power-bi-basics': 'power-bi-data-modeling-star-schema-basics',
}
```

**3. Resolve redirects inside the Post page, before it renders a 404.** `Post.jsx` already looks up a slug from `content/posts/`; check the redirect map first and bail out with a `<Navigate>` before falling through to "not found":
```jsx
import { useParams, Navigate } from 'react-router-dom'
import { redirects } from '../lib/redirects'

function Post() {
  const { slug } = useParams()
  if (redirects[slug]) {
    return <Navigate to={`/blog/${redirects[slug]}`} replace />
  }
  // existing lookup + NotFound fallback below
}
```
The `replace` flag matters here — it swaps the old URL out of browser history instead of stacking a redirect hop the Back button has to walk through.

**4. Use a real HTTP redirect for anything search engines need to see, not just the React one.** A client-side `<Navigate>` only fires after your JavaScript bundle loads and runs, which is invisible to some crawlers and slower for everyone else. On Vercel, add a top-level redirect in `vercel.json` for permanently retired URLs so the server itself returns a 301:
```json
{
  "redirects": [
    { "source": "/blog/excel-vlookup-guide", "destination": "/blog/xlookup-why-it-replaces-vlookup-for-data-analysts-and-when-it-doesnt", "permanent": true }
  ]
}
```
Reserve the in-app redirect map for cases the server config doesn't cover cleanly; use the server-level one for anything you want search engines to re-index under the new URL.

**5. Send retired-with-no-replacement posts to a real page, not a dead end.** If a post is gone for good rather than renamed, redirect its old URL to `/blog` instead of leaving it to hit the catch-all `NotFound` route — a visitor who followed an old link is more likely to browse from there than to guess a new URL themselves.

**6. Regenerate the sitemap after every rename, and check for stale entries.** The project's `npm run generate-feeds` script builds `sitemap.xml` from whatever's currently in `content/posts/` — it has no memory of the old filename, so a rename is invisible to it unless you also remove or update whatever else references the old slug, like an internal link from another post's body.

None of this is needed for a brand-new post — only once a URL has actually been live and something else on the internet might be pointing at it. Get in the habit of checking before a rename, and a growing blog's link history stays intact instead of quietly rotting one 404 at a time.
