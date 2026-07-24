---
title: "Adding Open Graph and Twitter Card Meta Tags to Your React Blog"
date: "2026-07-24"
tags: ["web-development", "seo", "react"]
excerpt: "Why a technically-live blog post can still show up as a bare link with no preview when shared, and how to fix it with Open Graph and Twitter Card tags."
---

Share a link to your own blog post in Slack or on X and you'll often get a plain gray box with no image, no title, and no description — even though the page itself looks fine in a browser. That's because link previews aren't generated from what a visitor sees; they're generated from Open Graph and Twitter Card meta tags in the page's `<head>`, and a client-side React app doesn't have those by default beyond a generic title.

**1. Understand why this is harder in a client-rendered React app.** Crawlers for Slack, Discord, X, and LinkedIn generally don't execute JavaScript — they fetch the raw HTML and read `<meta>` tags directly. In a Vite React SPA, the initial HTML is nearly empty until React mounts and renders the route, so any tags set with plain JavaScript after the page loads are often too late for these crawlers to see. The practical fix is to set the meta tags as early and as statically as possible for each route.

**2. Set the tags per-page with a small head-manager component.** `react-helmet-async` lets each page component declare its own tags, which get injected into the document head as soon as that component renders:

```jsx
import { Helmet } from "react-helmet-async";

function Post({ post }) {
  return (
    <>
      <Helmet>
        <title>{post.title}</title>
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {/* post content */}
    </>
  );
}
```

**3. Know the minimum tag set that actually matters.** Most platforms only need four: `og:title`, `og:description`, `og:image`, and `og:url`. Adding `twitter:card` set to `summary_large_image` is what gets you the big image preview on X instead of a small thumbnail — without it, X falls back to a much less prominent layout even if the Open Graph image is present.

**4. Use a real, absolute image URL for `og:image`.** A relative path like `/images/cover.png` works fine in a browser but breaks in a crawler request, since the crawler has no base URL to resolve it against. Always build the full URL (`https://yourdomain.com/images/cover.png`) from your site's known domain when setting this tag.

**5. Verify with a debugger, not by eyeballing your own feed.** Your own client (browser, or an app you're already logged into) may cache an old preview or render things differently than a bare crawler would. Facebook's Sharing Debugger and Twitter's Card Validator both fetch the URL fresh and show you exactly what tags they found — use one of those to confirm before assuming it's fixed.

**6. Remember this is orthogonal to the sitemap/RSS work.** Sitemap and RSS generation help search engines and feed readers discover your posts; Open Graph and Twitter Card tags control what a shared link looks like to a human. A post can be perfectly indexed and still post as a bare link if these tags are missing — they're solving different problems and both are worth having.

The payoff is disproportionate to the effort: a five-minute change is often the difference between a link nobody clicks and one with a title, description, and image that makes someone stop scrolling.
