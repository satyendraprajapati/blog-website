---
title: "Adding Canonical URLs to Your React Blog to Avoid Duplicate-Content Issues from Pagination and Tag Pages"
date: "2026-09-05"
tags: ["web-development", "seo", "react"]
excerpt: "A post that's reachable from /blog?page=2, from three different tag pages, and from its own permalink looks to Google like several separate pages competing for the same ranking — a canonical tag tells it which one actually counts."
---

Adding pagination and tag filtering (both worth having) creates a side effect: the same post content is now reachable through multiple URLs — `/blog?page=2`, `/tag/excel`, `/tag/data-analysis`, and the post's own `/blog/:slug` permalink. Google doesn't automatically know these all represent one canonical piece of content; without a signal telling it otherwise, it can split ranking signals across the duplicates or pick the "wrong" URL — like a tag listing page — to show in search results instead of the post itself.

**1. Understand what a canonical tag actually promises.** A `<link rel="canonical">` tag doesn't redirect anyone or change what a visitor sees — it's a hint in the page's `<head>` telling crawlers "if you're going to index one URL for this content, index this one." It's advisory, not enforced, but Google generally respects it when there's no stronger signal (like actual differing content) pointing the other way.

**2. Set it per-page with the same head-manager you're already using.** If you've added Open Graph or JSON-LD tags with `react-helmet-async`, canonical tags slot into the same component:
```jsx
import { Helmet } from "react-helmet-async";

function Post({ post }) {
  const canonicalUrl = `https://blog-website-navy-one.vercel.app/blog/${post.slug}`;

  return (
    <>
      <Helmet>
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      {/* post content */}
    </>
  );
}
```

**3. Point every route that can render a post's content at the same canonical URL.** A post reachable via `/tag/excel` (as one card in a list) doesn't need its own canonical tag — that's a listing page, not a duplicate of the post. But if your Tag or Blog page ever renders full post content rather than a card/excerpt, its canonical should point back to the post's own permalink, not to itself.

**4. Give the Tag and paginated Blog pages self-referencing canonicals, not blank ones.** A tag archive page (`/tag/power-bi`) and each pagination page (`/blog?page=2`) are legitimate, distinct pages in their own right — they should each canonicalize to themselves, not to `/blog` page one. Canonicalizing every paginated page back to page one would tell Google to stop indexing pages 2 and beyond entirely, which isn't what you want if those pages surface older posts.

**5. Always use the absolute URL, never a relative path.** Just like `og:image`, a canonical tag needs the full `https://` URL to mean anything to a crawler — `href="/blog/xlookup-why-it-replaces-vlookup"` without the domain is not a valid canonical reference and crawlers will typically ignore it.

**6. Check for it with view-source, not DevTools.** Since this is a client-rendered React app, confirm the tag actually lands in the initial HTML response a crawler would see — use `curl` or your browser's "View Page Source" (the raw HTML, not the DOM inspector) rather than trusting what DevTools' Elements panel shows after React has mounted and `react-helmet-async` has run.

**7. Re-check after any slug rename.** If you're already using redirects for renamed post URLs, make sure the canonical tag on the renamed post points at its *new* slug, not the old one it now redirects from — a canonical pointing at a URL that itself 301-redirects elsewhere sends Google a contradictory signal.

None of this changes what a human visitor experiences — it's purely a cleanup signal for search engines, and a cheap one, given how much duplicate-URL confusion a growing tag-and-pagination system can otherwise create without anyone noticing.
