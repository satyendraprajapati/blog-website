---
title: "Building a Year-and-Month Archive Page for Your React Blog"
date: "2026-10-14"
tags: ["react", "vite", "web-development"]
excerpt: "How to group every post by year and month into a browsable archive page, for readers who want to skim your blog's history instead of scrolling the main feed."
---

Tag pages answer "what has this blog written about X." An archive page answers a different question — "what did this blog look like in a given month" — which matters once you've got more than a couple dozen posts and the main Blog listing turns into endless scrolling.

**1. Reuse your existing posts data, don't build a second source of truth.** If you're already loading frontmatter with `import.meta.glob` (as described in this blog's own posts-loading setup), the archive page pulls from that exact same array — it's a different *view* of the same posts, not new content to parse.

**2. Group posts by year and month in one reduce.** Parse each post's `date` field and bucket it:

```js
function groupByYearMonth(posts) {
  return posts.reduce((acc, post) => {
    const d = new Date(post.date);
    const year = d.getFullYear();
    const month = d.toLocaleString("default", { month: "long" });
    acc[year] ??= {};
    acc[year][month] ??= [];
    acc[year][month].push(post);
    return acc;
  }, {});
}
```

**3. Sort years and months newest-first.** `Object.keys` on the grouped object doesn't guarantee order, and numeric-looking string keys get sorted ascending by JavaScript regardless of insertion order. Sort explicitly when you render:

```js
const years = Object.keys(grouped).sort((a, b) => b - a);
```

For months within a year, sort by each month's first post's actual date rather than alphabetically — "April" and "August" aren't in chronological order as strings.

**4. Render it as nested, collapsible sections.** A flat list of every post ever written is just as overwhelming as the main blog feed. Render each year as a heading, each month underneath it as a subheading, and the posts as a short list of titles linking to `/blog/:slug`. Tailwind's `<details>`/`<summary>` styling (or a simple `useState` toggle per year) lets a reader collapse years they don't care about instead of scrolling past them.

**5. Add the route and link to it from the footer.** Create `src/pages/Archive.jsx`, add a `/archive` route in `App.jsx` alongside your other routes, and add a quiet link to it from the Footer component — this is a page people seek out deliberately, not one that needs prime navigation real estate.

**6. Show a post count per year as a cheap sanity check.** `posts.length` next to each year heading (`2026 (41 posts)`) costs one line of code and immediately tells a returning reader — or you, debugging the grouping logic — whether a year's bucket actually picked up every post it should have.

**7. Keep it out of the sitemap generator's way, or add it deliberately.** The archive page doesn't carry unique content worth indexing on its own (it's just links to pages that are already in your sitemap), so there's no need to add it to `generate-feeds` — but if you'd rather have it crawlable, a single extra `<url>` entry pointing at `/archive` is harmless either way.

An archive page is a small build, mostly because the hard part — loading and sorting posts — is already done elsewhere in the app. The value is entirely in giving a different lens onto content that already exists, which is cheap to add and easy for readers to stumble into and actually use.
