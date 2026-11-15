---
title: "Adding a JSON Feed to Your React Blog So Modern Feed Readers Can Subscribe"
date: "2026-11-15"
tags: ["web-development", "react", "seo"]
excerpt: "RSS isn't the only feed format worth generating -- a feed.json file is a few lines of JavaScript and gives modern readers an easier format to parse."
---

If your blog already generates `rss.xml`, you've done most of the hard part: pulling every post's title, date, slug, and excerpt into one place at build time. JSON Feed (the spec lives at jsonfeed.org) reuses exactly that same data, just shaped as JSON instead of XML — and some feed readers and automation tools prefer it because there's no XML parser involved.

**1. JSON Feed is a plain object, not a dialect of RSS.** It's a small, versioned JSON spec with a fixed top-level shape — `version`, `title`, `home_page_url`, `feed_url`, and an `items` array. There's no XML namespace quirks, no CDATA escaping, and no ambiguity between RSS 2.0 and Atom — you write an object and `JSON.stringify` it.

**2. Reuse the same post metadata your RSS generator already collects.** If you already have a build script that loops over `content/posts/*.md`, parses frontmatter with `gray-matter`, and writes `rss.xml`, add a second output from the same loop instead of writing a new data pipeline:

```js
import fs from "fs";
import matter from "gray-matter";

function buildJsonFeed(posts, siteUrl) {
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "Your Data Analysis Blog",
    home_page_url: siteUrl,
    feed_url: `${siteUrl}/feed.json`,
    items: posts.map((post) => ({
      id: `${siteUrl}/blog/${post.slug}`,
      url: `${siteUrl}/blog/${post.slug}`,
      title: post.data.title,
      summary: post.data.excerpt,
      date_published: new Date(post.data.date).toISOString(),
      tags: post.data.tags,
    })),
  };

  fs.writeFileSync("public/feed.json", JSON.stringify(feed, null, 2));
}
```

**3. Write it to `public/` alongside `rss.xml` and `sitemap.xml`.** Since it's a static file generated at build time, it belongs in the same `generate-feeds` script that already runs before `npm run build` — no separate route, no server, and no extra dependency beyond what you're already using to build the RSS feed.

**4. Point to it from your HTML `<head>` the same way you link RSS.** Feed readers and browser extensions look for a `<link rel="alternate">` tag to auto-discover a feed, and JSON Feed has its own MIME type:

```html
<link rel="alternate" type="application/feed+json" title="RSS" href="/feed.json" />
```

Keep the existing `application/rss+xml` link in place too — this is additive, not a replacement, and costs you nothing since it's generated from data you already have.

**5. Validate it before you ship it.** JSON Feed's own validator (jsonfeed.org/validate) will catch a missing required field or a malformed date instantly, which is faster than debugging why a particular reader app silently refuses to load your feed.

**6. Don't bother if nothing of yours consumes it yet.** This is a nice-to-have for interoperability, not something that moves SEO or traffic on its own — add it when you're already touching the feed-generation script for another reason, not as a dedicated task on its own.

The appeal isn't that JSON Feed replaces RSS — most readers still expect `rss.xml` — it's that once you have the post data in memory at build time, writing a second, friendlier format next to it is close to free.
