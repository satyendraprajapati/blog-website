---
title: "Keeping Vercel Preview Deployments Out of Google's Index"
date: "2026-09-01"
tags: ["web-development", "seo", "vercel"]
excerpt: "Every branch push gets its own public Vercel URL — how to stop Google, and readers who stumble on the link, from treating a draft deployment as the live site."
---

Push a branch to a Vercel-connected repo and it gets a real, public URL within about a minute — that's what makes previewing a change before it hits `master` so easy. The tradeoff is that URL is just as crawlable as production unless you tell search engines otherwise, which means an unfinished post or a half-styled page can end up indexed under a `*-git-*.vercel.app` domain, sitting alongside — or even duplicating — the real thing in search results.

**1. Nothing stops a preview URL from being crawled by default.** It's not linked from anywhere on your production site, but "not linked" isn't the same as "not discoverable" — a bot that finds it through a shared Slack link, a linked pull request, or simple URL guessing will index it exactly like any other page unless a `robots` directive says not to.

**2. Vercel sets `VERCEL_ENV` on every build, with no dashboard configuration needed.** It's `"production"`, `"preview"`, or `"development"` depending on how the build was triggered. Vite doesn't expose plain `process.env` values to client code by default, so pass the one value you need through explicitly in `vite.config.js`:

```js
// vite.config.js
export default defineConfig({
  define: {
    __IS_PREVIEW__: JSON.stringify(process.env.VERCEL_ENV !== 'production'),
  },
})
```

**3. Render a `noindex` meta tag when that flag is set.** Wherever your app sets per-page `<head>` tags — an SEO component used across routes, or a single spot if you're doing it globally — add the tag conditionally instead of hardcoding it:

```jsx
{__IS_PREVIEW__ && <meta name="robots" content="noindex, nofollow" />}
```

A production build never sets `__IS_PREVIEW__` to `true`, so the tag simply never renders there — nothing environment-specific to remember to flip at deploy time.

**4. Know that this only protects a site that gets JS-rendered before Google indexes it.** Google generally does execute client-side JavaScript before deciding what to index, so a meta tag injected by React after mount is usually enough — but it means a raw `curl` or `view-source` of a preview URL still won't show the tag; check the rendered DOM in DevTools instead of the page source when verifying it worked.

**5. Treat `robots.txt` as a weaker, best-effort backstop, not the primary defense.** It's a single static file bundled at build time, so you can't easily make its contents vary between your production and preview deployments without a small serverless function — and a `Disallow` rule there only asks crawlers not to visit a URL, it doesn't stop one from being indexed if it's already been linked elsewhere. The per-page meta tag from step 3 is doing the real work.

**6. On paid Vercel plans, Deployment Protection is a stronger option than any of this.** It password-gates or SSO-gates preview URLs entirely, so the indexing question never comes up because nothing can reach the page unauthenticated in the first place. Worth switching to if preview content is ever genuinely sensitive rather than just unfinished.

The failure mode here is quiet — nobody notices a stray preview URL ranking for your own post title until a reader lands on last week's unfinished draft instead of the live version. A few lines in `vite.config.js` is cheap insurance against it.
