---
title: "Adding a Service Worker for Offline Reading to Your Vite React Blog"
date: "2026-08-22"
tags: ["web-development", "vite", "performance"]
excerpt: "A web app manifest makes your blog installable, but it's a service worker that actually lets someone reopen a post they've already read with no signal — here's how to add one to a Vite React site."
---

A web app manifest (icons, a name, a theme color) makes a site *installable*, but it doesn't make it work offline. If a reader adds your blog to their home screen and then opens it on a train with no signal, they'll get the browser's offline error page unless something is actually caching pages for reuse. That something is a service worker — a background script the browser runs that can intercept network requests and serve a cached response instead of failing.

**1. Install `vite-plugin-pwa` instead of hand-writing one.** Service workers have a genuinely fiddly lifecycle (install, activate, cache versioning), and getting it wrong silently serves stale content forever. The plugin generates a correct one from a config object instead of you debugging cache invalidation by hand.
```bash
npm install -D vite-plugin-pwa
```

**2. Register the plugin in `vite.config.js`.** `registerType: "autoUpdate"` means a new deploy replaces the cached service worker on the visitor's next visit without them needing to manually clear anything.
```js
import { VitePWA } from "vite-plugin-pwa";

export default {
  plugins: [
    // ...your existing plugins
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
};
```

**3. Decide what should actually be cached.** The build's own JS, CSS, and app shell get precached automatically by the plugin — that's what lets the site *open* offline. Individual blog post content is different: it's fetched from Markdown files at runtime, so it needs a runtime caching rule to be available once a reader has actually visited that post.
```js
workbox: {
  runtimeCaching: [
    {
      urlPattern: /\/content\/posts\/.*\.md$/,
      handler: "StaleWhileRevalidate",
      options: { cacheName: "post-content" },
    },
  ],
},
```
`StaleWhileRevalidate` serves the cached copy instantly and quietly updates it in the background — a reader gets an immediate response, and the next visit picks up any edits you've since pushed.

**4. Only cache pages a visitor has actually opened.** This setup is "read it once, reread it offline," not "download the entire blog for offline use." That's a deliberate and reasonable scope for a personal blog — a full offline-first cache-everything strategy adds real complexity for a benefit almost no visitor needs.

**5. Test it with DevTools, not by guessing.** In Chrome DevTools, the Application tab's Service Workers panel shows whether one is registered and active, and the Network tab's "Offline" checkbox lets you simulate no connection without actually turning off your wifi. Load a post normally first, then check the offline box and reload — if the post still renders, the caching is working.

**6. Don't ship this on `localhost` and assume it works in production.** Service workers require HTTPS everywhere except `localhost`, which Vercel already provides — but the worker only activates after a full page load with the previous version unregistered, so test on an actual preview deployment (per Vercel's preview-deployment flow) rather than trusting a local dev server that behaves more permissively than production does.

It's a small addition on top of the manifest, but it's the piece that actually delivers on what "installable" implies — a post someone has already read staying readable even when their connection isn't.
