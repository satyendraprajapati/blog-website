---
title: "Showing a 'Last Updated' Date on Blog Posts Using Git History"
date: "2026-09-29"
tags: ["web-development", "git", "react"]
excerpt: "A frontmatter `date` field only ever shows when a post was first published -- pulling the real last-modified date from git log tells a reader whether a technical post has been touched since a function changed."
---

An Excel or DAX tutorial published a year ago might still be exactly correct, or it might have been quietly touched up last month after a function's behavior changed in a newer version. The `date` field in a post's frontmatter can't tell a reader which one it is — it only ever records when the file was first created. The actual answer already exists, for free, in your git history.

**1. Get the last-commit date for a file from git itself, not frontmatter.** Adding a second frontmatter field like `updated: "2026-09-29"` works, but it means remembering to bump it by hand on every edit — and beginner blogs are exactly where that discipline slips. Git already tracks this automatically:
```
git log -1 --format=%cs content/posts/xlookup-why-it-replaces-vlookup.md
```
That prints the commit date of the most recent change to that single file — the real answer, with zero manual bookkeeping.

**2. Generate a lookup file at build time, not per request.** A static Vite/React blog has no server to shell out to git on each page view, so run the git log command for every post during your build (alongside the existing `generate-feeds` script) and write the results to a small JSON file:
```js
// scripts/generate-last-updated.js
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const postsDir = "content/posts";
const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));

const lastUpdated = {};
for (const file of files) {
  const filePath = path.join(postsDir, file);
  const date = execSync(`git log -1 --format=%cs -- "${filePath}"`)
    .toString()
    .trim();
  lastUpdated[file] = date;
}

fs.writeFileSync(
  "src/lastUpdated.json",
  JSON.stringify(lastUpdated, null, 2)
);
```

**3. Wire the script into `npm run build`.** The same way `generate-feeds` runs before the Vite build to produce `sitemap.xml` and `rss.xml`, add this script as its own step in `package.json`:
```json
"scripts": {
  "generate-last-updated": "node scripts/generate-last-updated.js",
  "build": "npm run generate-feeds && npm run generate-last-updated && vite build"
}
```

**4. Import the JSON in your Post page and compare it to the publish date.** Only show a "Last updated" line when it's meaningfully different from the original publish date — otherwise every post ends up with two identical-looking dates cluttering the header:
```jsx
import lastUpdated from "../lastUpdated.json";

const updatedDate = lastUpdated[`${slug}.md`];
const showUpdated =
  updatedDate && updatedDate !== post.frontmatter.date;

{showUpdated && (
  <p className="text-sm text-gray-500">
    Last updated {new Date(updatedDate).toLocaleDateString()}
  </p>
)}
```

**5. Know the one gotcha: shallow clones.** Most CI and deploy platforms, Vercel included, do a shallow git clone by default, which can truncate history and report the wrong last-modified commit for older files. If your build environment does this, either configure a full clone (`fetch-depth: 0` on GitHub Actions, or the equivalent Vercel setting) or fall back to the file's on-disk `mtime` as a rougher approximation when full git history isn't available.

It's a small addition, but on a technical blog where the underlying tools genuinely change over time, it answers a question a reader is often silently asking anyway: is this still accurate, or did I land on someone's old notes?
