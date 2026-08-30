---
title: "Adding Breadcrumb Navigation with Schema.org BreadcrumbList Markup to Your React Blog"
date: "2026-08-30"
tags: ["web-development", "seo", "react"]
excerpt: "How to add a visible breadcrumb trail to blog post pages and mark it up with BreadcrumbList JSON-LD so Google can show it directly in search results."
---

A post page that only shows a title gives a visitor arriving from search no sense of where they've landed in the site — and gives Google nothing to show but a bare URL beneath the search snippet. Breadcrumbs fix both problems at once: a small trail like `Home / Blog / Excel / Post Title` orients the visitor, and marking it up correctly lets Google render that same trail in place of the URL in search results.

**1. Build the trail from data you already have.** If posts carry a primary tag or category in frontmatter, the breadcrumb path is just `Home → Blog → {tag} → {post title}`. Compute it once in the `Post` page component rather than hardcoding it per post — the same three-or-four-level structure applies to every post, driven by its own frontmatter.

```jsx
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
  { name: post.tags[0], path: `/tag/${post.tags[0]}` },
  { name: post.title, path: null },
];
```

**2. Render it as a real, crawlable nav element.** Use an ordered list inside a `<nav aria-label="Breadcrumb">`, with each crumb except the last as a link — the last one, the current page, should render as plain text rather than a link to itself:

```jsx
<nav aria-label="Breadcrumb">
  <ol className="flex gap-2 text-sm text-gray-500">
    {crumbs.map((c, i) => (
      <li key={i}>
        {c.path ? <Link to={c.path}>{c.name}</Link> : <span>{c.name}</span>}
        {i < crumbs.length - 1 && <span> / </span>}
      </li>
    ))}
  </ol>
</nav>
```

**3. Add the matching BreadcrumbList JSON-LD.** The visible trail and the structured data need to describe the same path for Google to trust either — build the JSON-LD from the exact same `crumbs` array instead of writing it separately, so the two can never drift apart:

```jsx
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: c.path ? `https://blog-website-navy-one.vercel.app${c.path}` : undefined,
  })),
};
```

Render this as a `<script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>` in the post page's `<head>` alongside any existing Article JSON-LD — a page can carry more than one JSON-LD block, so this doesn't need to replace anything already there.

**4. Skip the `item` property on the last entry.** The current page shouldn't link to itself, and schema.org's spec allows the final `ListItem` to omit `item` entirely since it represents the page the user is already on. Leaving it in isn't wrong, but omitting it is the more accurate signal.

**5. Verify it renders before shipping.** Paste a built post's URL into Google's Rich Results Test to confirm the breadcrumb trail parses cleanly. It won't force Google to display it — that's still Google's call — but a validation error there means it won't be eligible even if Google wants to show it.

The visible trail alone already helps orientation and internal linking; the JSON-LD is a small addition on top that gives you a shot at reclaiming search-result space currently spent on a raw URL.
