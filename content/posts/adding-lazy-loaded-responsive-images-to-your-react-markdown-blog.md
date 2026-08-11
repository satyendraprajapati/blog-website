---
title: "Adding Lazy-Loaded, Responsive Images to Your React Markdown Blog"
date: "2026-08-11"
tags: ["web-development", "react", "performance"]
excerpt: "How to stop every screenshot and chart image in a Markdown post from loading up front, using native lazy loading and explicit dimensions to keep the layout stable while it does."
---

A data blog tends to be image-heavy — dashboard screenshots, chart exports, before/after comparisons — and by default every one of those images loads the moment the page renders, whether or not the reader ever scrolls that far. On a long post that means downloading megabytes of images the visitor may never see, which drags down the load time metrics a Core Web Vitals pass would otherwise report as healthy.

**1. Turn on native lazy loading first — it's nearly free.** Every modern browser supports the `loading="lazy"` attribute on `<img>` tags, which defers loading an image until it's about to enter the viewport. If you're rendering Markdown images through `react-markdown`, override the `img` component to add it automatically instead of relying on writers to remember it per post:
```jsx
<ReactMarkdown
  components={{
    img: ({ node, ...props }) => (
      <img {...props} loading="lazy" decoding="async" />
    ),
  }}
>
  {postContent}
</ReactMarkdown>
```

**2. Never lazy-load the first image on the page.** The image at the top of a post — often a hero screenshot — is usually what determines Largest Contentful Paint. Lazy-loading it means the browser doesn't even start fetching it until layout has happened, which makes LCP worse, not better. Exclude the first image, or explicitly mark it `loading="eager"` and add `fetchpriority="high"`.

**3. Always set width and height, even for responsive images.** Without explicit dimensions, the browser doesn't know how much vertical space an image needs until it finishes downloading, so the rest of the page jumps down once it arrives — a layout shift that directly hurts Cumulative Layout Shift. Setting the real pixel dimensions (not a fixed CSS size) lets the browser reserve the correct space immediately, even though Tailwind classes still control the rendered size:
```jsx
<img
  src="/images/dashboard-screenshot.png"
  width={1600}
  height={900}
  className="w-full h-auto rounded-lg"
  loading="lazy"
  alt="Power BI dashboard showing quarterly revenue by region"
/>
```

**4. Serve a smaller image to smaller screens with `srcset`.** A 1600px-wide dashboard screenshot doesn't need to ship at full resolution to a phone. If you're pre-generating a couple of sizes when you add an image to `public/images/`, `srcset` lets the browser pick the smallest one that still looks sharp for the viewport it's rendering in:
```jsx
<img
  src="/images/chart-800.png"
  srcSet="/images/chart-800.png 800w, /images/chart-1600.png 1600w"
  sizes="(max-width: 768px) 100vw, 800px"
  loading="lazy"
  alt="Excel pivot table with percent-of-total column"
/>
```

**5. Convert screenshots to WebP before committing them.** PNG is the default when you save a screenshot, but it's usually 2–4x larger than the same image saved as WebP with no visible quality loss — most screenshot tools and even a quick `cwebp` command-line pass handle the conversion. Since these images live in `public/images/` and get committed to the repo, smaller files also mean a smaller repo and faster deploys.

**6. Re-check with Lighthouse after the change.** Lazy loading and sizing attributes are exactly the kind of fix Lighthouse flags under "Properly size images" and "Defer offscreen images" — running it before and after on a long, image-heavy post is the easiest way to confirm the change actually moved the numbers instead of just looking correct in the browser.

None of this requires an image CDN or a build plugin — it's four HTML attributes and a file format choice, applied consistently across the `img` renderer so every post benefits without the writer having to think about it per screenshot.
