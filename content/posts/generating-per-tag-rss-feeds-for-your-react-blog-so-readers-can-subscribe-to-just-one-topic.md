---
title: "Generating Per-Tag RSS Feeds for Your React Blog So Readers Can Subscribe to Just One Topic"
date: "2026-10-21"
tags: ["web-development", "seo", "automation"]
excerpt: "Extending a Markdown blog's feed-generation script to output one RSS feed per tag, so a reader who only cares about Power BI isn't subscribed to your PowerPoint posts too."
---

A single site-wide `rss.xml` works fine when a blog covers one topic, but once a blog spans Excel, Power BI, PowerPoint, and web development the way this one does, a reader who only wants Power BI updates has to subscribe to everything and filter manually in their reader. Generating one additional feed per tag fixes that, using the same frontmatter the site-wide feed already reads.

**1. Reuse the existing post-loading logic instead of duplicating it.** The site's feed script already reads every file in `content/posts/`, parses its frontmatter with `gray-matter`, and builds a sorted list of `{ slug, title, date, excerpt, tags }` objects. Per-tag feeds don't need a new way of reading posts — they need that same list grouped by tag before writing output.
```js
const postsByTag = {}
for (const post of posts) {
  for (const tag of post.tags || []) {
    if (!postsByTag[tag]) postsByTag[tag] = []
    postsByTag[tag].push(post)
  }
}
```

**2. Write one feed file per tag, named predictably.** Loop over the grouped object and reuse the same XML-building logic the site-wide feed uses, just pointed at a smaller post list and a different output path — `public/feeds/power-bi.xml`, `public/feeds/excel.xml`, and so on — so the URL pattern is guessable without a lookup table.
```js
for (const [tag, tagPosts] of Object.entries(postsByTag)) {
  const xml = buildRssXml(tagPosts, `${SITE_NAME} — ${tag}`)
  fs.writeFileSync(path.resolve(`public/feeds/${tag}.xml`), xml)
}
```

**3. Link each tag page to its own feed.** On the Tag archive page component, add a `<link rel="alternate" type="application/rss+xml">` pointing at `/feeds/<tag>.xml`, and most feed readers (and browsers with an RSS extension) will auto-detect it the same way they detect the site-wide feed from the `<head>`. A small RSS icon next to the tag's heading makes it discoverable for readers who don't rely on auto-detection.

**4. Keep the site-wide feed too.** Per-tag feeds are additive, not a replacement — some readers genuinely want everything you publish, and the existing `rss.xml` already serves that. Generating both from the same post list costs nothing extra at build time since you're just grouping the same data two different ways.

**5. Regenerate feeds automatically on every build.** Since this already runs as part of `npm run generate-feeds` wired into `npm run build`, no extra CI step or manual action is needed — publish a new Power BI post, push to `master`, and `power-bi.xml` picks it up the same way `rss.xml` already does.

For a blog this broad, one feed covering four unrelated topics asks more of a reader's attention than it should. Splitting feeds by tag costs a loop and a few file writes, and it's the difference between "subscribe to everything or nothing" and letting someone follow exactly the topic they came for.
