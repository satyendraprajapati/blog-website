---
title: "Prerendering Your Vite + React Blog So Search Engines See Content Without Running JavaScript"
date: "2026-09-17"
tags: ["web-development", "react", "seo", "vite", "beginner"]
excerpt: "A plain React SPA ships an empty shell HTML file — how a post-build prerender script renders real content and per-route meta tags into static HTML before it ever reaches a crawler."
---

Earlier posts here fixed Open Graph tags with `react-helmet-async` and structured data with `dangerouslySetInnerHTML` — both good fixes, but both still client-side: the tags only exist after React mounts and runs. A crawler that doesn't execute JavaScript at all (and plenty of link-preview bots and older scrapers don't) still sees the same empty `<div id="root"></div>` this site's raw `index.html` ships by default. A **prerender script** closes that last gap by running after `vite build` and writing real, already-rendered HTML to disk for every route, so there's no JavaScript execution required to see a post's title, tags, and body — or its meta tags.

**1. Understand this isn't a server — it's one more build step.** Nothing runs per-request; there's no Node server in production. After `vite build` produces the JS bundle and its one `index.html` template, a script runs once, generates a fully-formed HTML file for every route, and writes each one to its own path in `dist` (`dist/blog/some-post/index.html`, `dist/about/index.html`, and so on). Vercel then serves each as a static file — the deploy stays 100% static.

**2. Render each post's Markdown to real HTML with `react-dom/server`, reusing the same rendering stack the live site uses.** Because posts are already parsed with `gray-matter` and rendered with `react-markdown` + `rehype-highlight` in the browser, the prerender script can call `renderToStaticMarkup` on the exact same component tree at build time and get identical output — no second Markdown pipeline to keep in sync:
```js
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

function renderMarkdownHtml(markdown) {
  return renderToStaticMarkup(
    createElement(ReactMarkdown, { rehypePlugins: [rehypeHighlight] }, markdown)
  );
}
```

**3. Rewrite the built `index.html` template per route instead of generating markup from scratch.** Read the single `dist/index.html` Vite produced, then for each route swap in that page's `<title>`, `description`, and Open Graph tags with a targeted regex replace, and inject the rendered article HTML into the empty `<div id="root">`:
```js
html = html.replace(/<title>[^<]*<\/title>/, `<title>${safeTitle}</title>`);
html = html.replace(/<div id="root"><\/div>/, `<div id="root">${articleHtml}</div>`);
```
Fail loudly if a pattern doesn't match, rather than silently writing a broken page — if the template's markup ever changes shape, a build-time error is far better than a quietly un-prerendered route shipping to production.

**4. Build the JSON-LD block here too, once, instead of relying on `dangerouslySetInnerHTML` at render time.** The same frontmatter (`title`, `date`, `excerpt`) that feeds the page's meta tags builds the `BlogPosting` schema object, which gets appended before `</head>` as a plain `<script type="application/ld+json">` tag in the static file — already present for a crawler that never runs React at all.

**5. Drive the route list from the same content directories the sitemap and RSS generators already read.** `fs.readdirSync('content/posts')` and `content/projects` give the full set of slugs to prerender, plus a short list of static routes (`/blog`, `/about`, `/contact`, `/services`, `/portfolio`). A new post dropped into `content/posts/` is automatically picked up by the next build — nothing to register separately.

**6. Chain it onto the existing build pipeline, after the JS bundle exists.** `"build": "npm run generate-feeds && vite build && node scripts/prerender.js"` — the prerender step has to run last, since it edits files inside `dist`, which `vite build` would otherwise overwrite if it ran first.

**7. Verify by disabling JavaScript, not by checking Lighthouse.** Open a built post at `dist/blog/<slug>/index.html` (or the deployed URL) with DevTools' JavaScript disabled, or just `curl` the URL and look for the post title and body in the raw response. If it's there without any script running, a crawler that skips JS sees exactly the same thing.

**8. Know what this doesn't do.** It's prerendering, not hydration-aware SSR — React still mounts over the static markup on load and re-renders normally, so nothing about the interactive site changes. Anything genuinely dynamic (a theme toggle's saved state, a reading-progress bar's position) is correctly absent from the static snapshot; that's fine, because a search crawler or a link-preview bot was never going to see that with JavaScript running either.

This is the practical middle ground the project's own notes on client-side rendering point at: not a full migration to Next.js or Astro for real server-side rendering, but a build-time script that gets nearly all of the actual benefit — real, crawlable HTML per route — without giving up a plain static Vite + React deploy.
