---
title: "Building a Smarter 404 Page for Your React Blog That Suggests Posts from Your Search Index"
date: "2026-09-14"
tags: ["web-development", "react", "seo"]
excerpt: "A generic 'Page Not Found' loses a visitor who mistyped a slug or followed a dead link — reusing the FlexSearch index you already built for site search keeps them on the site instead."
---

A default 404 page is a dead end: someone follows a link to a post that got renamed, or fat-fingers a URL, and lands on a page whose only option is "go back to the homepage." If your blog already has a client-side search index for its search bar, that same index can turn a dead link into a useful suggestion instead of a bounce.

**1. Pull a guess out of the broken URL itself.** `react-router`'s `useLocation` gives you the path the visitor actually tried. A slug like `/blog/excel-pivot-tabels-guide` is almost certainly a typo of a real post — strip the `/blog/` prefix and swap hyphens for spaces to get a rough search query.

```jsx
import { useLocation } from 'react-router-dom'
import { search } from '../lib/searchIndex'

function NotFound() {
  const { pathname } = useLocation()
  const guess = pathname.replace('/blog/', '').replace(/-/g, ' ')
  const suggestions = search(guess).slice(0, 3)

  return (
    <div>
      <h1>Page not found</h1>
      {suggestions.length > 0 ? (
        <>
          <p>Did you mean:</p>
          <ul>
            {suggestions.map((post) => (
              <li key={post.slug}>
                <a href={`/blog/${post.slug}`}>{post.title}</a>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Try the latest posts instead.</p>
      )}
    </div>
  )
}
```

**2. Reuse the exact same index the search bar already builds.** There's no second index to maintain — import the same `search()` function your FlexSearch-powered search box calls, and run the mangled slug through it as if it were a user's typed query.

**3. Fall back to recent posts when the guess comes up empty.** Not every broken link resembles a real slug — a post that was deleted outright, or a URL from an entirely different site, won't match anything. When `suggestions` is empty, render your three most recent posts instead of leaving the page bare, so there's always somewhere to go next.

**4. Keep the page out of search results.** A client-side router can't make a static host return a real HTTP 404 status for every unmatched path, so search engines can still crawl and index this page's content unless you tell them not to. Add a `noindex` meta tag specifically on the `NotFound` route — the same `<Helmet>`-style meta tag setup used for canonical URLs and Open Graph tags elsewhere on the site — so a broken-link page never competes with your real posts for a ranking.

**5. Log the miss instead of guessing which links are actually broken.** A one-line custom event to Plausible (or whatever analytics you've already got wired in) on this page — `plausible('404', { props: { path: pathname } })` — turns "some links are probably broken somewhere" into an actual list you can check periodically and fix with redirects.

The visitor still landed somewhere they didn't intend to, but now they have a next click instead of a wall — and you get a record of exactly which link sent them there.
