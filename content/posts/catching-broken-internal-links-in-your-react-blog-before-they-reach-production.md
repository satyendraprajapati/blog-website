---
title: "Catching Broken Internal Links in Your React Blog Before They Reach Production"
date: "2026-08-23"
tags: ["web-development", "react", "automation"]
excerpt: "A small Node script that scans every Markdown post for internal links and flags any that point to a slug that no longer exists, run before every build."
---

Rename a post's slug, delete an old one, or fix a typo in a link years later, and nothing in a typical Vite + React blog tells you when another post still links to the old path — the build succeeds, the link just quietly 404s for whoever clicks it. A short Node script that checks every internal link against your actual set of slugs catches this before it ships, not after a reader reports it.

**1. Collect every valid slug first — that's your source of truth.** The slug list already exists as the set of filenames in `content/posts/`, so building it is just reading a directory:

```js
import { readdirSync } from "node:fs"

const validSlugs = new Set(
  readdirSync("content/posts")
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
)
```

**2. Extract internal links from each post's Markdown body with a regex, not a full parser.** You don't need to understand the whole document — just find every `/blog/some-slug` style link and pull out the slug:

```js
import { readFileSync } from "node:fs"

const linkPattern = /\/blog\/([a-z0-9-]+)/g

function findInternalLinks(markdown) {
  return [...markdown.matchAll(linkPattern)].map((m) => m[1])
}
```

**3. Compare each found link against the valid slug set, and collect failures instead of stopping at the first one.** A single broken link shouldn't hide a second one further down the file — report everything in one pass so you fix them all together instead of one run per link:

```js
const broken = []

for (const file of readdirSync("content/posts")) {
  if (!file.endsWith(".md")) continue
  const body = readFileSync(`content/posts/${file}`, "utf-8")
  for (const slug of findInternalLinks(body)) {
    if (!validSlugs.has(slug)) broken.push({ file, slug })
  }
}

if (broken.length > 0) {
  broken.forEach((b) => console.error(`${b.file}: links to missing post "${b.slug}"`))
  process.exit(1)
}
console.log("All internal links resolve.")
```

**4. Exit with a non-zero code on failure — that's what makes it useful in automation, not just a manual check.** `process.exit(1)` is the whole trick: a script that only prints a warning gets ignored, but one that fails the command it's part of gets noticed. Save it as `scripts/check-links.js`.

**5. Wire it into `npm run build`, not just CI.** Add it as a `pre` step so it's impossible to build without it running:

```json
"scripts": {
  "prebuild": "node scripts/check-links.js",
  "build": "vite build"
}
```

npm runs `prebuild` automatically before `build`, so this also protects your local build and the existing GitHub Actions build check without any extra workflow config.

**6. Keep the regex intentionally narrow.** Matching only `/blog/slug`-shaped paths means the script ignores external links, anchor links, and image paths — all of which have their own failure modes that a slug checker isn't the right tool for. Trying to validate every kind of link in one script makes the false-positive rate climb and the whole check less trustworthy.

It's about 20 lines, no dependencies beyond Node's built-in `fs` module, and it turns "did I break a link somewhere in 150 posts" from a manual grep into something that fails the build for you.
