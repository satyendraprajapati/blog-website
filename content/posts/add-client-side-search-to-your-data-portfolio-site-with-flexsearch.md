---
title: "Add Client-Side Search to Your Data Portfolio Site with FlexSearch"
date: "2026-07-20"
tags: ["web-development", "javascript", "search"]
excerpt: "How to add fast, no-backend search across your blog posts using FlexSearch and the same Markdown files you already have."
---

Once a Markdown-based blog has more than a dozen posts, a tag filter stops being enough — visitors want to type "power query" and jump straight to the relevant post. You don't need a database or a hosted search service to do this; a small client-side index is enough for a personal blog's scale.

**1. Understand why client-side search fits this stack.** Your posts are already static Markdown files parsed at build time — there's no server to query. A library like FlexSearch builds a search index entirely in the browser (or ahead of time, at build), so search stays free and works on a static host like Vercel or Netlify with no backend at all.

**2. Build a lightweight search index from your post frontmatter.** At build time, generate a small JSON file containing just what search needs — slug, title, excerpt, and tags — rather than shipping full post bodies to the browser.
```javascript
// scripts/build-search-index.js
import fs from "fs";
import matter from "gray-matter";

const files = fs.readdirSync("content/posts");
const index = files.map((file) => {
  const { data } = matter(fs.readFileSync(`content/posts/${file}`, "utf-8"));
  return {
    slug: file.replace(".md", ""),
    title: data.title,
    excerpt: data.excerpt,
    tags: data.tags,
  };
});

fs.writeFileSync("public/search-index.json", JSON.stringify(index));
```

**3. Load and index it once on the client.** Fetch the JSON file when the search component mounts, and hand it to FlexSearch rather than re-parsing Markdown in the browser.
```javascript
import { Index } from "flexsearch";

const index = new Index({ tokenize: "forward" });

fetch("/search-index.json")
  .then((res) => res.json())
  .then((posts) => {
    posts.forEach((post, i) => index.add(i, `${post.title} ${post.excerpt} ${post.tags.join(" ")}`));
  });
```

**4. Debounce the input before querying.** Searching on every keystroke against even a small index adds up if it's re-running on each character while someone is still typing — wait roughly 150–200ms after the last keystroke before calling `index.search()`.

**5. Keep results scoped and forgiving.** Cap results to the top 5–8 matches so the dropdown doesn't overwhelm a small blog, and use `tokenize: "forward"` (as above) so a partial word like "pivo" still matches "pivot tables" instead of requiring an exact whole-word match.

**6. Wire a result click to your existing router.** Each result just needs to link to `/blog/:slug` using the slug you already generate for routing — no separate search results page is necessary for a site this size.

The whole feature is a few hundred lines of JavaScript and one generated JSON file — no Algolia account, no server, and nothing that breaks your zero-backend deploy story.
