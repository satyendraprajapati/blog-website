---
title: "Loading Markdown Blog Posts Automatically with Vite's import.meta.glob"
date: "2026-09-13"
tags: ["web-development", "react", "vite"]
excerpt: "Instead of importing every markdown file by hand and remembering to update the list, Vite's import.meta.glob reads a whole folder at build time and hands you every file as an object."
---

A markdown-based blog has an unglamorous problem to solve before any of the frontend matters: something has to know which `.md` files exist in `content/posts/` and load their contents. The obvious first approach — importing each file by name — breaks the moment you add a post and forget to add the import. Vite has a built-in answer that removes the step entirely.

**1. `import.meta.glob` takes a pattern and returns every matching file as a module.** Point it at a folder and it hands back an object keyed by file path, with each value being a way to access that file's contents — no manual list to maintain, and a new file in the folder is picked up automatically on the next build.

```js
const postFiles = import.meta.glob('/content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})
```

**2. `query: '?raw'` is what turns a markdown file into a plain string instead of Vite trying to process it as a module.** Without it, Vite doesn't know what to do with a `.md` extension by default. The raw string is exactly what a frontmatter parser like `gray-matter` expects as input, so this pairs naturally with a markdown-based content pipeline.

**3. `eager: true` decides when the import actually happens.** With it, every file loads immediately and `postFiles` is a plain object you can use right away. Leave it off and each value becomes a function returning a promise instead — better for splitting a large site into separate chunks loaded on demand, but unnecessary complexity for a blog where you want the full post list available synchronously to sort and filter it.

**4. The keys are file paths, and the slug usually comes from parsing them.** `Object.entries` gives you each path alongside its content, and a plain string operation turns the path into the slug your router uses.

```js
const slug = path.split('/').pop().replace(/\.md$/, '')
```

**5. Frontmatter parsing happens after the glob, not as part of it.** `import.meta.glob` only cares about getting the file contents into your hands — running `gray-matter` over each raw string to split out the YAML frontmatter from the markdown body is a separate step, typically done in the same `.map()` that builds your post list.

**6. This only works for content that's part of the build, not for files added after deployment.** Because the glob pattern is resolved at build time, adding a new markdown file to `content/posts/` requires a rebuild and redeploy before it shows up — there's no way to add a post to a live site without pushing a new commit. That's a reasonable trade for a personal blog with no backend, but it's worth knowing the boundary if you ever want posts addable without a deploy.

**7. Restrict the glob pattern as tightly as the folder allows.** `*.md` in a dedicated `content/posts/` folder is safe, but a broader pattern like `**/*.md` run against a folder that also holds drafts, templates, or notes will pull all of it into the build. Keep non-published markdown outside the globbed path, or use a naming convention the pattern explicitly excludes.
