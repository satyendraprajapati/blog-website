---
title: "Generating a Unique Open Graph Preview Image for Each Post at Build Time"
date: "2026-09-18"
tags: ["web-development", "seo", "react", "vite", "beginner"]
excerpt: "Instead of pointing every post's og:image at the same site logo, generate a distinct preview card per post at build time from its title and tags."
---

Once your posts have working Open Graph tags, every link you share gets a preview card — but if `og:image` points at the same site logo for every post, a link to "5 Excel Formulas" and a link to "Power BI Time Intelligence" look identical in a Slack unfurl or a tweet. A reader scrolling their feed can't tell which post is which without clicking. The fix is generating a distinct image per post at build time, the same way the site already generates a sitemap and RSS feed.

**1. Treat it as a build step, not a runtime one.** A client-rendered Vite app has no server to draw an image on request, and you don't want one — these images barely ever change, so drawing them once at build time and serving the resulting PNGs as static files is both simpler and faster than generating anything live.

**2. Use `satori` to lay out the card as JSX, then `@resvg/resvg-js` to rasterize it.** `satori` takes a React-like element tree and font data and produces an SVG using a subset of Flexbox — no headless browser required. Piping that SVG through `resvg` gives you a PNG:

```js
// scripts/generate-og-images.js
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
import { getAllPosts } from "../src/lib/posts.js";

const font = fs.readFileSync("./scripts/assets/Inter-Bold.ttf");

for (const post of getAllPosts()) {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: { display: "flex", flexDirection: "column", width: 1200, height: 630, padding: 80, background: "#0f172a", color: "#fff" },
        children: [
          { type: "div", props: { style: { fontSize: 56, fontWeight: 700 }, children: post.title } },
          { type: "div", props: { style: { fontSize: 28, marginTop: 24, opacity: 0.7 }, children: post.tags.join(" · ") } },
        ],
      },
    },
    { width: 1200, height: 630, fonts: [{ name: "Inter", data: font, weight: 700 }] }
  );

  const png = new Resvg(svg).render().asPng();
  fs.writeFileSync(`./public/og/${post.slug}.png`, png);
}
```

**3. Wire it into the existing feed-generation step, not a separate manual command.** The project already runs `generate-sitemap` and `generate-rss` before `vite build` — add this script to the same `generate-feeds` chain in `package.json` so a forgotten step can't ship a post with a stale or missing preview image:

```json
"generate-feeds": "npm run generate-sitemap && npm run generate-rss && node scripts/generate-og-images.js"
```

**4. Point each post's `og:image` at its generated file, with an absolute URL.** Open Graph crawlers don't resolve relative paths against your site the way a browser does — the tag needs the full URL:

```jsx
<Helmet>
  <meta property="og:image" content={`https://yourdomain.com/og/${slug}.png`} />
</Helmet>
```

**5. Keep the design legible at thumbnail size, not just full size.** Most platforms shrink the 1200×630 image down to a few hundred pixels wide in a feed. Stick to one bold headline, a short line of metadata, and high contrast — a preview card crowded with a byline, a date, a logo, and a decorative background pattern turns into an unreadable smear once it's shrunk.

**6. Cache-bust only when the content that changed the image is what changed.** These files are keyed by slug and rebuilt every deploy, so a stale cached image from a previous version can linger on platforms that cache OG images aggressively (LinkedIn and Slack in particular). If you edit a post's title after it's already been shared once, expect to need each platform's own cache-debugging tool (LinkedIn Post Inspector, Facebook Sharing Debugger) to force a refresh — the file on your server will already be correct.

**7. Fall back to the static site logo for pages that aren't posts.** Home, About, Tag archive pages, and the 404 page don't need a generated card — reuse one static image for those and only run the per-post generation over the actual blog post list, so the build step stays fast and you're not generating images for routes that don't need one.

The result is that every link to the blog carries its own headline into whatever feed it lands in, instead of relying on a click to find out what the post is actually about.
