---
title: "Adding Syntax Highlighting to Code Blocks in Your React Markdown Blog"
date: "2026-07-27"
tags: ["web-development", "react", "markdown"]
excerpt: "How to turn plain gray code blocks into properly colored, language-aware snippets using react-markdown and rehype-highlight."
---

A Markdown-based blog with `react-markdown` renders fenced code blocks as plain text by default — no color, no keyword highlighting, just a monospace font on a gray background. For a data-analysis blog where posts routinely include Excel formulas, DAX, SQL, and Python, that's a real readability cost. The fix is a small `rehype` plugin, not a hand-rolled parser.

**1. Install `rehype-highlight` alongside `react-markdown`.** It plugs into `react-markdown`'s existing plugin pipeline, so there's no separate rendering path to maintain — it just post-processes the HTML `react-markdown` already produces.

```bash
npm install rehype-highlight
```

**2. Wire it in as a `rehypePlugins` entry.** `react-markdown` accepts a `rehypePlugins` array; `rehype-highlight` walks the rendered output and wraps recognized code with the `hljs` classes that highlight.js's CSS themes target.

```jsx
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

function PostBody({ content }) {
  return (
    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
      {content}
    </ReactMarkdown>
  );
}
```

**3. Import a highlight.js theme stylesheet.** `rehype-highlight` adds the classes but not the colors — those come from a CSS theme shipped with `highlight.js` itself. Pick one that's readable on both your light and dark backgrounds, or swap the import based on the active theme.

```jsx
import "highlight.js/styles/github-dark.css";
```

**4. Tell it which languages actually matter for your posts.** By default `rehype-highlight` bundles detection for a huge number of languages, which bloats your JS bundle for a blog that only ever fences `excel`, `dax`, `sql`, `python`, `jsx`, and `bash`. Passing a curated language list keeps the bundle small and avoids mis-detection on ambiguous snippets.

```jsx
import { common, createLowlight } from "lowlight";
import excel from "highlight.js/lib/languages/excel";

const lowlight = createLowlight(common);
lowlight.register("excel", excel);
```

**5. Handle the fence languages that highlight.js doesn't know natively.** `excel` and `dax` aren't standard highlight.js grammars — Excel formulas highlight reasonably well aliased to a generic language, but if the coloring looks wrong, falling back to no highlighting for that block (plain monospace) is better than misleading syntax colors that highlight the wrong tokens.

**6. Check contrast in both themes before shipping.** The most common regression here is a highlight theme that looks great in dark mode and washes out completely in light mode (or vice versa) — worth a manual check of a post with a code block right after wiring up the theme toggle, not just a glance at the rendered dark version.

Once it's wired up, every existing post with a fenced code block gets highlighted automatically — there's nothing to go back and edit post by post, since the highlighting happens at render time from the same Markdown that was already there.
