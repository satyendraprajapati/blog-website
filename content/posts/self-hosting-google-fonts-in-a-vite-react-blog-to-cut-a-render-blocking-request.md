---
title: "Self-Hosting Google Fonts in a Vite + React Blog to Cut a Render-Blocking Request"
date: "2026-09-02"
tags: ["web-development", "performance", "vite"]
excerpt: "Loading a font from fonts.googleapis.com adds an extra DNS lookup and a render-blocking stylesheet — here's how to host the font files yourself instead."
---

The usual way to add a Google Font is a `<link>` tag pointing at `fonts.googleapis.com` and `fonts.gstatic.com`. It works, but it costs the browser a DNS lookup and connection to a third-party domain before it can even start downloading the font's CSS — and that CSS blocks rendering of any text using it. Self-hosting the font files removes that round trip entirely, since everything comes from your own already-connected domain.

**1. Get the actual font files, not the Google-hosted CSS.** The simplest path is the `@fontsource` package, which ships each Google Font as local `.woff2` files plus ready-made CSS:

```bash
npm install @fontsource/inter
```

**2. Import it once, in your entry file.** No `<link>` tag, no external request:

```js
// main.jsx
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
```

Only import the weights you actually use — each weight is a separate file, and importing all nine just because they exist defeats the point of trimming requests.

**3. If you'd rather not add a dependency, self-host manually.** Download the `.woff2` files from Google Fonts' "Download family" option, drop them in `public/fonts/`, and write the `@font-face` rules yourself:

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-400.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

**4. Always set `font-display: swap`.** Without it, a slow font load can leave text invisible until the font arrives (the default "block" behavior). `swap` renders with a fallback font immediately and swaps in the custom font once it's ready, which keeps your Largest Contentful Paint from waiting on a font file.

**5. Preload the weight your layout uses above the fold.** For a blog, that's usually the body text weight rendered on every post:

```html
<link rel="preload" href="/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin>
```

This tells the browser to fetch that specific file early, in parallel with the HTML parse, instead of discovering it late once the CSS referencing it finally loads.

**6. Re-measure instead of assuming it helped.** Run the Lighthouse audit from the Core Web Vitals post you may have already set up — the "Avoid chaining critical requests" and "Ensure text remains visible during webfont load" warnings tied to the Google Fonts `<link>` should disappear, and LCP typically drops by the time that DNS lookup and round trip used to take.

The tradeoff is that you're now responsible for updating the font files yourself if you switch weights or add a new one, instead of Google's CSS handling it automatically. For a blog with a fixed, small set of type weights, that's a small price for removing an external dependency your page rendering doesn't actually need.
