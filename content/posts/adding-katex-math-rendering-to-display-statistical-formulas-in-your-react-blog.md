---
title: "Adding KaTeX Math Rendering to Display Statistical Formulas in Your React Blog"
date: "2026-08-31"
tags: ["react", "markdown", "data-analysis"]
excerpt: "How to render proper statistical notation like standard deviation and correlation formulas in markdown posts using KaTeX instead of screenshots or plain text."
---

A data-analysis blog eventually needs to show an actual formula — standard deviation, a correlation coefficient, a regression equation — and typing it out as plain text (`sum((x-mean)^2)/n`) is hard to read next to the real notation a reader already recognizes. Pasting in a screenshot works but doesn't scale with your site's font size or theme, and looks blurry on a retina screen. KaTeX renders LaTeX-style math as real, theme-aware text and SVG, and it plugs into a `react-markdown` pipeline with two small plugins.

**1. Install the remark and rehype math plugins alongside KaTeX itself.**
```bash
npm install katex remark-math rehype-katex
```
`remark-math` recognizes `$...$` and `$$...$$` delimiters in your markdown source; `rehype-katex` turns what it finds into rendered HTML.

**2. Wire both plugins into your existing `ReactMarkdown` component**, next to whatever you're already using for syntax highlighting:
```jsx
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

<ReactMarkdown
  remarkPlugins={[remarkMath]}
  rehypePlugins={[rehypeKatex]}
>
  {post.content}
</ReactMarkdown>
```
The plugin order matters less here than making sure `rehypeKatex` runs alongside (not instead of) any existing rehype plugins you have for code blocks — pass all of them in the same array.

**3. Write formulas inline or as their own block directly in the markdown file.** A single `$` pair keeps a formula inline with a sentence; double `$$` centers it as its own display block:
```
The sample standard deviation is $s = \sqrt{\frac{\sum (x_i - \bar{x})^2}{n-1}}$.

$$
r = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum (x_i - \bar{x})^2 \sum (y_i - \bar{y})^2}}
$$
```
No custom React component is needed per formula — it's plain markdown syntax, the same as writing a code fence.

**4. Override KaTeX's default color so it follows dark mode.** KaTeX's stylesheet hardcodes black text, which disappears against a dark background. Add a small override after the KaTeX import in your global CSS:
```css
.dark .katex { color: inherit; }
```

**5. Keep the formula source readable, since it's still markdown.** A dense formula in raw LaTeX is harder to scan in your `.md` file than the rendered output is for a reader — a short comment above a genuinely gnarly expression (a multi-line matrix, say) saves you from having to mentally parse your own LaTeX six months later.

**6. Check bundle size before shipping it site-wide.** KaTeX's CSS pulls in a font subset; it's small compared to a font library, but if only one or two posts on your whole site use math, consider lazy-loading the `ReactMarkdown` config with the math plugins only on the `Post` route rather than the whole app, so pages without any formulas don't pay for a feature they don't use.

Once it's wired in, dropping real notation into a post is no more work than writing a sentence — which means you'll actually do it instead of reaching for a screenshot or a paragraph of words trying to describe a formula out loud.
