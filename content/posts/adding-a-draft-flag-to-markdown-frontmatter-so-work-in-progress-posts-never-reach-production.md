---
title: "Adding a draft Flag to Markdown Frontmatter So Work-in-Progress Posts Never Reach Production"
date: "2026-10-08"
tags: ["web-development", "react", "content"]
excerpt: "A half-finished post saved into content/posts/ is picked up by Vite's import.meta.glob the moment you commit it -- a draft flag in frontmatter keeps it local until it's actually ready."
---

Because every `.md` file in `content/posts/` is loaded automatically with `import.meta.glob`, there's no separate publish step between saving a file and it showing up in the blog listing, the sitemap, and the RSS feed. That's great for a finished post, and a problem for one you're still drafting across two sittings -- commit it to save your progress, and it's live. A `draft: true` field in frontmatter, checked in one place, fixes that without needing a CMS or a staging branch.

**1. Add the field to frontmatter on any post that isn't ready.** It's just another key alongside `title` and `tags`, so starting a new post in progress is no different from finishing one -- you only flip the flag off when it's done:
```markdown
---
title: "Untitled Draft: Power Query Error Handling"
date: "2026-10-08"
tags: ["excel", "power-query"]
excerpt: "Still writing this one."
draft: true
---
```

**2. Filter drafts out in `src/lib/posts.js`, gated by environment.** The loader already maps over every file it globs -- the fix is one filter, kept so drafts still render while you're working locally but disappear the moment `npm run build` runs for production:
```js
const posts = Object.entries(postFiles)
  .map(([path, raw]) => {
    const { data, content } = matter(raw)
    const slug = path.split('/').pop().replace(/\.md$/, '')

    return {
      slug,
      title: data.title,
      date: data.date,
      tags: data.tags || [],
      excerpt: data.excerpt || '',
      draft: Boolean(data.draft),
      content,
      readingTime: getReadingTime(content),
    }
  })
  .filter((post) => !post.draft || import.meta.env.DEV)
  .sort((a, b) => new Date(b.date) - new Date(a.date))
```
`import.meta.env.DEV` is `true` under `npm run dev` and `false` in a production build, so a draft stays visible on your own machine and vanishes from what actually gets deployed -- no separate flag to remember to flip before pushing.

**3. Exclude drafts from the sitemap and RSS generation too.** Those are built by a separate script, not by `posts.js`, so the filter has to be applied there as well -- otherwise a draft post can't be read from the site, but Google and RSS readers still find a dead link pointing at it:
```js
const publishedPosts = allPosts.filter((post) => !post.draft)
```
Run that filtered list through whatever already builds `sitemap.xml` and `rss.xml` in your `generate-feeds` script, in place of the full post list.

**4. Let a small banner double-check it for you.** Even with the filter in place, it's worth rendering a visible "Draft -- not published" badge on the post page itself when `import.meta.env.DEV` is true, so a half-written post never looks finished while you're reviewing it locally, and so the flag's presence is obvious at a glance instead of buried in frontmatter you have to open the file to see.

**5. Don't forget to flip it before you actually want the post live.** The flag does nothing for you on publish day except get out of the way -- removing `draft: true` (or setting it to `false`) is still a manual step, and a post stuck at `draft: true` forever is just as much a bug as one published too early.

The whole mechanism is a boolean, one filter, and a second filter in the feed script -- small enough to add in a few minutes, and worth doing before the next time you want to save a post mid-draft without worrying about who sees it first.
