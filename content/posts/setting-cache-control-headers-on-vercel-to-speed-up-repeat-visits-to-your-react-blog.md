---
title: "Setting Cache-Control Headers on Vercel to Speed Up Repeat Visits to Your React Blog"
date: "2026-11-11"
tags: ["web-development", "vercel", "performance"]
excerpt: "A few lines in vercel.json tell browsers and Vercel's CDN how long to cache your blog's static assets, cutting repeat-visit load times without touching your build."
---

A returning reader's browser re-downloads your entire JS bundle, CSS, and images on every visit unless something tells it not to. Vercel serves sensible defaults out of the box, but a short `headers` block in `vercel.json` makes the caching explicit and squeezes out a chunk of load time on every visit after the first.

**1. Understand what Vite already gives you for free.** A production build hashes every JS and CSS filename based on its contents — `index-4f8a1c2.js`, not `index.js`. That hash is the whole trick: once a browser caches a hashed filename, it never needs to re-check it, because a new deploy produces a new hash and a new URL. `index.html`, by contrast, keeps the same filename forever and has to be re-fetched every time to pick up the latest hashes.

**2. Cache hashed assets aggressively and forever.** Because the filename changes whenever the content does, there's no risk in telling the browser to cache it as long as possible. Add this to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```
`max-age=31536000` is one year, and `immutable` tells the browser not to even bother re-validating it before that — it's safe here specifically because the filename is content-hashed.

**3. Never apply that same rule to `index.html`.** It's the one file that must always be fetched fresh, since it's what points the browser at the current hashed bundle. Give it a second, much shorter rule in the same array:
```json
{
  "source": "/index.html",
  "headers": [
    { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
  ]
}
```
Mixing these two up — long-caching `index.html` or short-caching the hashed assets — is the most common way this setup backfires, usually as "I pushed an update and it's not showing up for anyone."

**4. Handle unhashed files in `public/` separately.** Anything in Vite's `public/` folder, like `public/images/headshot.jpg` or `favicon.ico`, keeps its exact filename across every deploy, so it can't safely get the same one-year treatment as hashed assets. A shorter `max-age` (an hour or a day) on `/images/(.*)` is a reasonable middle ground that still cuts repeat requests without risking a stale image sticking around for a year after you swap it.

**5. Separate browser caching from CDN caching with `s-maxage` if you want finer control.** `max-age` governs the visitor's own browser, while `s-maxage` governs how long Vercel's edge network holds onto a response before checking the origin again. For a static blog these usually line up, but setting both explicitly avoids relying on Vercel's defaults silently filling in the gap.

**6. Verify it actually took effect.** After deploying, open DevTools' Network tab, reload the site, and check the Response Headers on a request to a hashed asset — you should see your `Cache-Control` value, and on the next reload that request should show `(disk cache)` or `(memory cache)` instead of a network round trip.

None of this changes what gets built — it's purely instructions to the browser and CDN about how long they're allowed to skip asking you again, which is exactly the kind of win that costs nothing on every visit after the first.
