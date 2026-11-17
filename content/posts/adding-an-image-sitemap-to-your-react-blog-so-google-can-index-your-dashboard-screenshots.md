---
title: "Adding an Image Sitemap to Your React Blog So Google Can Index Your Dashboard Screenshots"
date: "2026-11-17"
tags: ["web-development", "seo", "react"]
excerpt: "A standard sitemap.xml tells Google which pages exist, but it says nothing about the dashboard screenshots and charts inside them -- image sitemap tags fix that so your visuals can show up in Google Images too."
---

A data-analysis blog lives or dies on its screenshots — Power BI dashboards, Excel pivot tables, PowerPoint chart mockups. A regular `sitemap.xml` lists the page each screenshot lives on, but it never tells Google an image is there worth indexing on its own. Google Images traffic to a dashboard screenshot is a real, if small, source of visitors who'd never search for your post title directly — and it costs almost nothing to enable.

**1. Know what you're adding to, not building from scratch.** If your blog already generates `sitemap.xml` from Markdown frontmatter at build time (as described in `scripts/generate-sitemap.js`), you don't need a second file — the sitemap protocol lets you nest `<image:image>` tags inside the existing `<url>` entry for a post.

**2. Record each post's images in frontmatter.** The build script can only list what it knows about, so add an `images` array to posts that have screenshots:
```md
---
title: "Building a KPI Dashboard Slide in PowerPoint Without Add-Ins"
images: ["/images/kpi-dashboard-slide.png", "/images/kpi-cards-closeup.png"]
---
```

**3. Extend the sitemap generator to emit image tags.** Add the image namespace to the root element and loop over each post's `images` array when building its `<url>` block.
```js
const urls = [
  ...staticRoutes.map(({ path: routePath, priority }) => `  <url>
    <loc>${SITE_URL}${routePath}</loc>
    <priority>${priority}</priority>
  </url>`),
  ...posts.map(({ slug, date, images }) => `  <url>
    <loc>${SITE_URL}/blog/${slug}</loc>
    <lastmod>${date}</lastmod>
    <priority>0.7</priority>
${(images || []).map((img) => `    <image:image><image:loc>${SITE_URL}${img}</image:loc></image:image>`).join('\n')}
  </url>`),
].join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`
```

**4. Keep the array short and relevant.** Google caps meaningful attention per page at a handful of images — list the two or three screenshots that actually illustrate the post's subject, not every icon or decorative image on the page.

**5. Resubmit the sitemap in Google Search Console.** The image tags live inside the same `sitemap.xml` file you likely already submitted, so there's no new URL to register — Search Console picks up the image entries on its next crawl, and you can confirm indexing under the Images filter in the Pages report a few days later.

This is a small addition on top of infrastructure you probably already have, and it pays off exactly once per post: the first time someone searches Google Images for "Power BI dashboard example" or "Excel pivot table layout" and your screenshot is the one that shows up.
