---
title: "Generating an RSS Feed and Sitemap for a Static React Blog"
date: "2026-07-23"
tags: ["web-development", "seo", "automation"]
excerpt: "How to script rss.xml and sitemap.xml generation for a Markdown-based React blog so search engines and feed readers stay current without any manual editing."
---

A Vite React blog with no backend has no built-in way to tell Google what pages exist or let a feed reader know a new post went up — those are normally features a CMS or a framework like Next.js hands you for free. The fix is a small Node script that runs at build time and generates both files from the same Markdown posts you already have.

**1. Read every post's frontmatter as the single source of truth.** Since each post is already a `.md` file with `title`, `date`, `tags`, and `excerpt` in its frontmatter, a build script can loop over `content/posts/`, parse each file with `gray-matter`, and use that data to build both the sitemap and the feed — no separate list to maintain by hand.
```js
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content/posts");
const posts = fs.readdirSync(postsDir)
  .filter((file) => file.endsWith(".md"))
  .map((file) => {
    const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
    const { data } = matter(raw);
    const slug = file.replace(/\.md$/, "");
    return { ...data, slug };
  });
```

**2. Build the sitemap as a plain XML string.** A sitemap just needs a `<url>` entry per page, with a `<loc>` and a `<lastmod>` date — search engines use it to discover pages and notice when they've changed, instead of relying on crawling links alone.
```js
const siteUrl = "https://blog-website-navy-one.vercel.app";
const urls = posts.map((p) => `
  <url>
    <loc>${siteUrl}/blog/${p.slug}</loc>
    <lastmod>${p.date}</lastmod>
  </url>`).join("");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

fs.writeFileSync("public/sitemap.xml", sitemap);
```

**3. Build the RSS feed the same way, from the same data.** An RSS feed is also just XML — one `<item>` per post, with `<title>`, `<link>`, `<pubDate>`, and `<description>` pulled straight from frontmatter, so a feed reader (or a service like Buttondown) sees a new post the moment it's published.
```js
const items = posts.map((p) => `
    <item>
      <title>${p.title}</title>
      <link>${siteUrl}/blog/${p.slug}</link>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${p.excerpt}</description>
    </item>`).join("");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>Blog</title>
  <link>${siteUrl}</link>
  <description>Data analysis blog</description>${items}
</channel></rss>`;

fs.writeFileSync("public/rss.xml", rss);
```

**4. Wire the script into the build so it can never go stale.** Adding it as a `prebuild`-style step in `package.json` (for example `"build": "node generate-feeds.js && vite build"`) means every deploy regenerates both files from whatever posts currently exist — there's no separate step to remember and no risk of shipping a sitemap that's missing your latest post.

**5. Escape user-controlled text before writing it into XML.** Titles and excerpts can contain characters like `&` or `<` that are meaningful in XML — write a small escape helper and run every field through it before interpolating, otherwise a post title with an ampersand can produce an invalid feed that some readers refuse to parse.

Once this is in place, adding a new blog post is the only "SEO update" you ever have to do — the sitemap and feed pick it up automatically on the next build.
