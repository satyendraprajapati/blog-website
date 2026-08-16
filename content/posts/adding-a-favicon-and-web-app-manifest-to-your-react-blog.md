---
title: "Adding a Favicon and Web App Manifest to Your React Blog"
date: "2026-08-16"
tags: ["web-development", "seo", "beginner"]
excerpt: "A Vite starter ships with a placeholder favicon and no manifest — here's how to replace both so your blog looks finished in a browser tab, a bookmark bar, and a phone home screen."
---

A fresh Vite + React project ships with the default Vite logo as your favicon, which is easy to forget about once the rest of the site is built. It's a small detail, but it's also one of the first things a visitor sees — in the browser tab, in their bookmarks bar, and in the search results preview on some browsers. A proper web app manifest goes a step further, letting someone add your blog to their phone's home screen with your own icon instead of a generic globe.

**1. Generate the actual icon files first.** You need more than one size: at minimum a 32×32 and 16×16 `.ico` (or `.png`) for the browser tab, and 192×192 / 512×512 PNGs for the manifest. A tool like RealFaviconGenerator takes one source image and exports the full set, including the platform-specific variants for iOS and Android home screens.

**2. Drop the generated files into `public/`.** Anything in Vite's `public/` folder is copied to the site root as-is and referenced with an absolute path, so `public/favicon.ico` becomes `/favicon.ico` in production — no import statement needed.

**3. Replace the default favicon link in `index.html`.** Vite's starter `index.html` has a `<link rel="icon" ...>` pointing at `/vite.svg`. Swap it for your own files:
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
```

**4. Write a minimal `site.webmanifest`.** This is a small JSON file, also placed in `public/`, that describes your site as an installable app — its name, icons, background color, and how it should launch if added to a home screen:
```json
{
  "name": "Your Blog Name",
  "short_name": "Blog",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#0f172a",
  "background_color": "#0f172a",
  "display": "standalone"
}
```

**5. Match `theme_color` to your actual header background.** This value colors the browser's address bar on Android and the status bar area if someone adds the site to their home screen — set it to whatever your header or dark-mode background already is so it doesn't look like a mismatched accent color slapped on top.

**6. Confirm it with a hard refresh, not a normal reload.** Browsers cache favicons aggressively. After swapping the files, do a hard refresh (or open the site in a private window) before concluding the new icon didn't take — nine times out of ten, it's the cache, not your markup.

None of this affects functionality, but it's the difference between a site that reads as "someone's project" and one that reads as finished — and it costs about ten minutes once you have a source image ready.
