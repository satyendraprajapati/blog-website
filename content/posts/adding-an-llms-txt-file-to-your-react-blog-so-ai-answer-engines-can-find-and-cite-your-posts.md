---
title: "Adding an llms.txt File to Your React Blog So AI Answer Engines Can Find and Cite Your Posts"
date: "2026-09-11"
tags: ["web-development", "seo", "react"]
excerpt: "A plain-text index at your site root that gives AI answer engines a clean list of your posts to read, instead of leaving them to guess at a client-rendered page."
---

Search engines have crawled sitemap.xml and robots.txt for decades. A newer, still-emerging convention called `llms.txt` does something similar for AI answer engines and assistants: a single plain-text file at your site's root that lists what's on the site and links straight to the content worth reading, in a format built for a language model to parse quickly rather than for a browser to render.

**1. It matters more for a client-rendered site than a server-rendered one.** This blog is a plain Vite + React app — as the project's own README notes, that's client-side rendered with no built-in server rendering. A crawler that only fetches the raw HTML sees an near-empty `<div id="root">` before React mounts and fills it in. `llms.txt` sidesteps that entirely: it's static, plain text, and lists your real content directly, so a fetch-only crawler doesn't need to execute JavaScript to find anything.

**2. Keep the format dead simple.** The emerging convention is Markdown: an H1 with your site's name, a one-line blurb, then H2 sections grouping links with a short description each.

```markdown
# Your Name — Data Analysis Blog

> Practical, beginner-friendly tutorials on Excel, Power BI, SQL,
> and building a data analyst portfolio site.

## Posts

- [5 Excel Formulas Every Data Analyst Should Know](https://yourblog.com/blog/5-excel-formulas): XLOOKUP, SUMIFS, TEXTJOIN, IFERROR, and UNIQUE explained with examples.
- [DAX Basics: Understanding CALCULATE](https://yourblog.com/blog/dax-basics-calculate): why CALCULATE is the function that makes filter context click.

## Pages

- [About](https://yourblog.com/about): background and what this blog covers.
```

**3. Generate it from the same frontmatter you already write.** You don't maintain this list by hand — write a small Node script that reads every file in `content/posts/`, pulls `title` and `excerpt` from the frontmatter with `gray-matter` (the same package already parsing posts for the site), and writes out the Markdown links. It's the same pattern as the existing `generate-feeds` script that builds `sitemap.xml` and `rss.xml` — this is just a third output from the same source data.

**4. Wire it into the build, not a one-off script you forget to rerun.** Add the generator to the same `npm run generate-feeds` step that already runs before `npm run build`, so `public/llms.txt` regenerates automatically every time a new post ships instead of silently drifting out of date after the third post you forget to add manually.

**5. Consider an `llms-full.txt` only if it stays a reasonable size.** Some sites also publish a second file with the full Markdown content of every page concatenated together, for answer engines that want the actual text rather than just links to fetch. For a blog with a couple hundred posts, that file can get large fast — if you add one, keep it to a curated subset (your best or most-referenced posts) rather than dumping the entire archive into a single multi-megabyte file.

**6. Verify it like you'd verify a sitemap.** After deploying, load `https://yourblog.com/llms.txt` directly and check that the links resolve and the descriptions match your current posts — the same basic sanity check you'd already run against `/sitemap.xml`.

`llms.txt` isn't a standard any search engine or AI vendor has formally committed to the way `robots.txt` is, and that may never fully solidify. But it costs one small build step to generate, it reuses data your blog already has, and it's cheap insurance for exactly the client-rendering gap this stack already has to live with.
