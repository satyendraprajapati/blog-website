---
title: "Adding an Auto-Generated Table of Contents to Long Blog Posts in React"
date: "2026-07-26"
tags: ["web-development", "react", "beginner"]
excerpt: "How to build a jump-to-section table of contents from Markdown headings automatically, instead of hand-maintaining a list of links per post."
---

Once a post has more than a handful of headings, a reader scrolling to find one specific section is a worse experience than just showing them a list of jump links up front. Hand-writing that list per post is easy to forget and easy to let go stale the moment you edit a heading. It's simpler to generate it from the same Markdown you're already rendering.

**1. Extract headings while parsing, not by re-scanning the DOM.** If you're already parsing Markdown with something like `react-markdown`, walk the same content for `##` and `###` lines rather than querying the rendered page after the fact — it keeps the table of contents in sync with content changes with zero extra maintenance, since it's built from the same source of truth as the post itself.

```jsx
function extractHeadings(markdown) {
  const lines = markdown.split("\n");
  return lines
    .filter((line) => /^#{2,3}\s/.test(line))
    .map((line) => {
      const depth = line.match(/^#+/)[0].length;
      const text = line.replace(/^#+\s/, "").trim();
      const slug = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      return { depth, text, slug };
    });
}
```

**2. Give every heading a matching `id` at render time.** The table of contents is only useful if its links actually land somewhere — pass the same `slug` function into your Markdown renderer's heading component so `<h2>` and `<h3>` elements get the matching `id` attribute, keeping extraction and rendering from drifting apart.

**3. Skip it entirely on short posts.** A table of contents on a 400-word post adds clutter without adding navigation value. Gate it on heading count — `if (headings.length < 3) return null` — so it only appears where it's actually earning its space.

**4. Indent nested headings to show structure.** A flat list of links loses the difference between a top-level section and a sub-point under it. Use the `depth` from extraction to apply a left-margin or smaller font size to `###` entries, so the table of contents reads as an outline, not just a list.

**5. Highlight the current section on scroll.** An `IntersectionObserver` watching each heading's `id` and toggling an "active" class on the matching table-of-contents link turns a static list into a reading-progress indicator, which is a small touch but makes long technical posts noticeably easier to navigate.

**6. Make the links actually scroll smoothly.** Set `scroll-behavior: smooth` on the container (or on `html` globally, scoped with a media query for `prefers-reduced-motion: no-preference`) so a click doesn't jump the page instantly and disorient the reader — respecting `prefers-reduced-motion` matters here since instant jumps are the accessible default for people who've asked for less motion.

None of this needs a new dependency — it's the same Markdown source you're already parsing, just walked once more to build a navigation aid instead of thrown away after rendering.
