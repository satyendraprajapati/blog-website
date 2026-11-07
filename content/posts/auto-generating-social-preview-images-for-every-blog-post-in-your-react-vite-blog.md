---
title: "Auto-Generating Social Preview Images for Every Blog Post in Your React/Vite Blog"
date: "2026-11-07"
tags: ["web-development", "react", "seo"]
excerpt: "Without a dedicated og:image, a shared link falls back to a generic screenshot or nothing at all -- generating a branded preview image per post at build time fixes that without hand-designing one in Figma for every article."
---

You've probably already added Open Graph meta tags so a shared post gets a title and description on Slack or Twitter, but the image slot usually falls back to a logo or nothing, because hand-designing a unique preview image for every post doesn't scale. The fix is to generate one automatically at build time from the post's own frontmatter -- no design tool involved.

**Understand what you're actually producing: a static PNG per post, referenced by a meta tag.** Social platforms don't render your React components when unfurling a link -- they fetch `og:image` as a plain image URL and display it. So the generation step has to happen before deploy, producing a real `.png` file in `public/og/<slug>.png` that your `<Post>` page then points to:

```html
<meta property="og:image" content="https://yoursite.com/og/5-excel-formulas-every-data-analyst-should-know.png" />
```

**Generate the images with a headless browser during your build, not a design API.** The simplest approach for a Vite blog that already parses Markdown with `gray-matter` is to render a small HTML template per post (title, tags, your site name) and screenshot it with Playwright, since it's already a common dev dependency. A short Node script run from `package.json`'s `generate-feeds`-style hook works well:

```js
import { chromium } from "playwright";
import { getAllPosts } from "../src/lib/posts.js";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

for (const post of getAllPosts()) {
  const html = `<html><body style="margin:0;width:1200px;height:630px;
    display:flex;align-items:center;justify-content:center;
    background:#0f172a;color:#f8fafc;font-family:sans-serif;padding:80px;">
    <h1 style="font-size:56px;">${post.title}</h1></body></html>`;
  await page.setContent(html);
  await page.screenshot({ path: `public/og/${post.slug}.png` });
}
await browser.close();
```

**Keep the template dead simple and legible at thumbnail size.** Most people see this image as a tiny 1200×630 thumbnail in a feed, not full-size, so a plain background color, your site name, and a large, high-contrast title is more effective than a busy design with a chart screenshot crammed in. Stick to one accent color and one font size for the title; anything smaller than about 40px tends to disappear once a platform compresses it.

**Wire the script into your existing build pipeline so it never goes stale.** Since `CLAUDE.md` already wires `generate-feeds` into `npm run build` for the sitemap and RSS feed, add the OG image step as a sibling script and chain it the same way, so every new post automatically gets an image the first time it's built -- you never have to remember to run it manually:

```json
"scripts": {
  "generate-og-images": "node scripts/generate-og-images.js",
  "build": "npm run generate-feeds && npm run generate-og-images && vite build"
}
```

**Commit the generated images or regenerate them in CI -- don't rely on a local-only output folder.** If you deploy on Vercel from a build step, the images need to exist at build time on Vercel's machine, so either check them into `public/og/` like your other static assets, or confirm the build step genuinely runs the generation script as part of the deploy (Vercel does, since it runs your `build` command). Test it by pasting a post URL into a service like Twitter's or LinkedIn's post inspector after deploying, since local previews don't always match what the platform actually fetches.
