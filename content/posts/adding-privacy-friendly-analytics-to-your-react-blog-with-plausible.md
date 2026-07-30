---
title: "Adding Privacy-Friendly Analytics to Your React Blog with Plausible"
date: "2026-07-30"
tags: ["web-development", "analytics", "react"]
excerpt: "How to see which posts people actually read on a static React blog using Plausible, without cookies, a consent banner, or shipping visitor data to Google."
---

Once a blog has more than a couple of posts, "which of these is anyone actually reading" stops being a rhetorical question. Google Analytics answers it, but it also means a cookie-consent banner, a chunky tracking script, and handing visitor-level data to Google. Plausible is a lighter alternative built for exactly this case: a single small script, no cookies, and a dashboard that just shows page views and referrers.

**1. Understand why no banner is needed.** GDPR and similar laws require consent banners specifically for tracking that identifies individuals across sites — typically via cookies. Plausible doesn't set cookies and doesn't fingerprint visitors; it counts aggregate page views per day. That's the whole reason it can skip the consent flow that a Google Analytics setup legally requires.

**2. Add the script tag to `index.html`, not a component.** Analytics scripts need to load on every route, including the very first paint, so they belong in the static HTML shell rather than a React component that mounts after the app renders:
```html
<script defer data-domain="yourblog.com" src="https://plausible.io/js/script.js"></script>
```
Because this is a single `<script>` tag with no cookie and no personal data collected, it also doesn't need to route through your `react-helmet`-managed per-page `<head>` tags — one copy in `index.html` covers the whole site.

**3. Handle client-side route changes yourself.** Plausible's default script tracks the initial page load automatically, but a React Router app changes routes without a full page reload, so navigating from Home to a blog post won't fire a second pageview on its own. Swap in the `script.pageview-props.js` variant or call `plausible('pageview')` manually inside a small effect that runs on route change:
```jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Analytics() {
  const location = useLocation();
  useEffect(() => {
    if (window.plausible) window.plausible("pageview");
  }, [location.pathname]);
  return null;
}
```
Mount `<Analytics />` once near the top of `App.jsx`, inside the Router, and every route change registers as its own pageview.

**4. Check the dashboard, not your instincts, before you write the next post.** After a few days of traffic, Plausible's dashboard will show top pages, referrer sources, and country breakdowns. It's common for the post you were proudest of to barely register, and for an offhand tutorial to quietly pull the most search traffic — worth knowing before you decide what to write next.

**5. Keep it out of local development.** The `data-domain` script fires on any page it's loaded from, including `localhost` during `npm run dev`, which pollutes your real stats with your own testing. Gate it behind a build-time check so it only loads in production:
```html
<script>
  if (window.location.hostname === "yourblog.com") {
    document.write('<script defer data-domain="yourblog.com" src="https://plausible.io/js/script.js"><\/script>');
  }
</script>
```

The whole setup is a handful of lines because that's the point — a static blog doesn't need a consent management platform or a data-processing agreement to find out which posts people are actually reading.
