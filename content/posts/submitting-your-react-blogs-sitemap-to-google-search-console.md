---
title: "Submitting Your React Blog's Sitemap to Google Search Console (and What to Check Afterward)"
date: "2026-08-07"
tags: ["web-development", "seo", "beginner"]
excerpt: "Generating sitemap.xml and JSON-LD gets your blog ready to be indexed — Search Console is how you actually confirm Google sees it and fix what it doesn't."
---

Generating a sitemap and adding structured data makes a blog *indexable* — it doesn't make Google actually index it. That happens through Search Console, and skipping it means the only way to know whether a new post is showing up in search is to guess based on traffic that may never arrive.

**1. Verify ownership of the deployed site, not localhost.** Go to [search.google.com/search-console](https://search.google.com/search-console), add a property using your production URL (the Vercel domain or custom domain, not `localhost:5173`), and verify it. The simplest method for a static site is the HTML tag option — Google gives you a meta tag to drop in `index.html`'s `<head>`, which you deploy once and never touch again.

```html
<meta name="google-site-verification" content="the-token-google-gives-you" />
```

Domain-level verification via DNS TXT record is the other option, and it's worth it if you're already managing DNS for a custom domain — it verifies every subdomain at once instead of one property per URL.

**2. Submit the sitemap you're already generating.** Under *Sitemaps* in the left nav, submit the path to the file your `generate-feeds` script already produces — `sitemap.xml` at your domain root. This is what tells Google *which* URLs exist, as opposed to hoping its crawler stumbles onto every post on its own by following links.

**3. Use URL Inspection to check a specific post, not just the sitemap as a whole.** Paste a post's full URL into the inspection bar at the top of Search Console. It tells you whether that exact page is indexed, and if not, why — common answers for a new blog are "Discovered, currently not indexed" (Google knows about it but hasn't crawled it yet) or "Crawled, currently not indexed" (crawled but judged not worth indexing, often because there isn't enough unique content yet).

**4. Request indexing manually for a post you want found sooner.** The same URL Inspection tool has a "Request Indexing" button once a URL loads. This doesn't guarantee same-day indexing, but it does push a new post into the crawl queue faster than waiting for the sitemap's next scheduled crawl — worth doing right after you publish something you expect people to search for.

**5. Check Coverage for pages Google decided to skip.** The *Pages* report under *Indexing* breaks out every URL Google has seen into indexed versus excluded, with a reason for each exclusion. On a React Router site, watch for "Duplicate without user-selected canonical" — a sign your canonical tag isn't set correctly per route — or "Soft 404," which shows up if your `NotFound.jsx` returns real content but Google can't tell it's a 404 from a client-rendered page alone.

**6. Confirm structured data is actually parsing, not just present.** *Enhancements → Rich results* (or the standalone Rich Results Test tool) validates the JSON-LD you're already embedding per post. It's the difference between "I added structured data" and "Google can actually read it" — a single misplaced comma in the JSON-LD block fails silently in the browser but shows up here as a parsing error.

**7. Revisit this monthly, not just once at launch.** New posts need their own indexing check, and Search Console's Performance report shows which queries are actually driving impressions and clicks — often the searches people find your posts through aren't the keywords you expected, which is useful signal for what to title and tag future posts.

Sitemap generation and JSON-LD get the blog *ready* to be found; Search Console is the feedback loop that confirms it's happening and tells you exactly what to fix when it isn't.
