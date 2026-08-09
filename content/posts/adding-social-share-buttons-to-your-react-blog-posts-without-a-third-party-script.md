---
title: "Adding Social Share Buttons to Your React Blog Posts Without a Third-Party Script"
date: "2026-08-09"
tags: ["web-development", "react", "beginner"]
excerpt: "How to add working 'Share on X' and 'Share on LinkedIn' buttons to a static Vite/React blog using plain intent URLs, instead of pulling in a third-party share-button library and its tracking scripts."
---

Most "add social sharing" tutorials point you toward a share-button npm package, which usually means shipping an extra dependency, an iframe, or a tracking script just to render two links. A share button is really just a link to a pre-filled compose screen on another site — you can build the real thing with a plain anchor tag and a URL you construct yourself.

**1. Build the share URL from the platform's own intent format.** X (formerly Twitter) and LinkedIn both expose a plain URL that opens a pre-filled share dialog — no API key, auth, or SDK required. You only need the post's URL and title, both of which you already have on a post page:

```jsx
function getShareLinks(url, title) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  return {
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };
}
```

**2. Always encode the URL and title, even though it looks unnecessary in dev.** A post title with an ampersand, quote mark, or `#` character will silently truncate or corrupt the share text if you interpolate it into the URL directly instead of running it through `encodeURIComponent`. This is easy to miss locally with a simple test title and only shows up once a real post title has punctuation in it.

**3. Open share links in a new tab with `rel="noopener noreferrer"`, not a full navigation.** Since these are plain anchor tags, set `target="_blank"` so clicking "Share" doesn't navigate the reader away from your post entirely, and add `rel="noopener noreferrer"` so the opened tab can't reach back into your page via `window.opener` — a real security consideration, not just a lint rule, when the destination is an external site you don't control:

```jsx
<div className="flex gap-3 mt-8">
  <a
    href={shareLinks.x}
    target="_blank"
    rel="noopener noreferrer"
    className="text-sm underline"
  >
    Share on X
  </a>
  <a
    href={shareLinks.linkedin}
    target="_blank"
    rel="noopener noreferrer"
    className="text-sm underline"
  >
    Share on LinkedIn
  </a>
</div>
```

**4. Build the canonical URL from the route, not `window.location.href` alone.** On a Vite/React Router site, `window.location.href` is usually correct, but it will also pick up any trailing query string a reader arrived with (a UTM tag, for example), which then gets baked into everyone's shared link. Construct the URL instead from your site's known base plus the post's slug, so every share link points at the same clean canonical address regardless of how the reader got there.

**5. Skip a Facebook button unless you actually need one.** Facebook's share dialog requires an Open Graph `og:url` and `og:title` on the page to populate correctly, which you likely already added if you've set up Open Graph tags — but Facebook also aggressively caches those tags per URL, so a changed title won't reflect in shares until you manually re-scrape the URL through their Sharing Debugger. For a personal data-analysis blog, X and LinkedIn cover the audience that actually shares this kind of content, and skipping Facebook avoids that caching headache entirely.

**6. Place the buttons after the article body, not above it.** A reader deciding whether to share a post makes that decision after finishing it, not before — put the share links directly under the post content (the same spot a "Related Posts" section would go) so they're available at the moment someone's actually ready to use them, rather than competing with the title and metadata for attention at the top.

The whole feature is two URL templates and a couple of anchor tags — no script tag, no consent-banner implications, and nothing that phones home to a third party just to render a link your reader might not even click.
