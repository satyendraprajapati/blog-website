---
title: "Compressing and Converting Blog Images to WebP with vite-imagemin"
date: "2026-08-26"
tags: ["web-development", "performance", "vite"]
excerpt: "Instead of manually running cwebp on every dashboard screenshot before committing it, a Vite plugin can convert and compress every image in the build automatically."
---

Running a screenshot through `cwebp` by hand before every commit works, but it's a step that's easy to forget on a Friday when you just want the post published — and it does nothing for the dozens of images already sitting in `public/images/` from before you started remembering. Doing the conversion as part of the Vite build instead means every image gets compressed the same way, every time, without anyone having to think about it per post.

**1. Install a Vite image optimization plugin.** `vite-plugin-imagemin` (or its actively maintained fork, depending on what's current when you set this up) hooks into the build pipeline and runs every image that passes through it against a set of compressors.
```bash
npm install --save-dev vite-plugin-imagemin
```

**2. Register it in `vite.config.js` with WebP conversion turned on.** The plugin can compress PNGs and JPEGs in place, but the bigger win for a screenshot-heavy blog is generating a `.webp` version alongside the original, since WebP routinely comes in 25–35% smaller than an equivalent-quality PNG.
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    react(),
    viteImagemin({
      webp: { quality: 80 },
      pngquant: { quality: [0.7, 0.85] },
      mozjpeg: { quality: 80 },
    }),
  ],
})
```

**3. Understand what this does and doesn't cover.** The plugin optimizes assets that Vite processes as part of the build graph — images imported directly in your components. Files sitting in `public/images/` are copied verbatim without transformation, since Vite treats that folder as static passthrough content. If your Markdown posts reference images from `public/images/` by path (the common setup for a content-as-Markdown blog), you'll need a small pre-build script that walks that folder and runs the same conversion, rather than relying on the plugin alone.
```json
{
  "scripts": {
    "optimize-images": "node scripts/optimize-images.js",
    "build": "npm run optimize-images && npm run generate-feeds && vite build"
  }
}
```

**4. Serve WebP with a PNG fallback, not a hard replacement.** WebP support is effectively universal in current browsers, but "effectively universal" isn't "guaranteed" — wrapping the image in a `<picture>` element lets the browser pick WebP when it can and fall back to the original format when it can't, at no cost to a browser that supports WebP.
```jsx
<picture>
  <source srcSet="/images/dashboard-screenshot.webp" type="image/webp" />
  <img src="/images/dashboard-screenshot.png" alt="Power BI dashboard showing quarterly revenue by region" loading="lazy" />
</picture>
```

**5. Check the numbers before and after, not just the file sizes.** A smaller file doesn't automatically mean a faster page if the images were already being lazy-loaded correctly — re-run Lighthouse after wiring this up and look specifically at the "Serve images in next-gen formats" and total transferred-bytes figures to confirm the change is actually moving the metrics that matter, not just shrinking files on disk.

**6. Don't over-compress a screenshot with small text in it.** A dashboard or Excel screenshot often has fine text and thin gridlines that degrade visibly below about quality 80 — push the compression too hard chasing file size and you'll end up with a smaller image nobody can actually read. Spot-check a few converted screenshots at full size before committing to a quality setting for the whole build.

The build takes a few seconds longer with the plugin running, which is a trivial cost against a repo full of screenshots that used to ship at full, uncompressed PNG size to every visitor by default.
