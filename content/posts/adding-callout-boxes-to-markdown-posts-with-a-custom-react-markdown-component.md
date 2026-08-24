---
title: "Adding Callout Boxes to Markdown Posts with a Custom react-markdown Component"
date: "2026-08-24"
tags: ["web-development", "react", "content"]
excerpt: "A way to flag a caveat or warning inside a technical post -- like 'this formula behaves differently in older Excel versions' -- so it visually stands out instead of blending into a wall of paragraphs."
---

A post walking through a DAX measure or an Excel formula often needs to flag something the reader shouldn't skim past — a version caveat, a gotcha, a "don't do this in production" warning. Burying that inside a regular paragraph means it reads with the same visual weight as everything else. A callout box fixes that without pulling in a full MDX setup or a new content format — it's just a markdown convention plus one custom component.

**1. Pick a plain-text convention that survives being written as markdown.** A blockquote with a recognizable prefix works well because it degrades gracefully — even if the custom rendering never kicked in, `> [!TIP]` still reads as a quote in a plain markdown viewer:
```markdown
> [!TIP]
> XLOOKUP defaults to an exact match, so you don't need the 0 argument VLOOKUP requires.

> [!WARNING]
> This DAX pattern re-evaluates per row and gets slow past a few hundred thousand rows.
```

**2. Override react-markdown's `blockquote` renderer, not the whole markdown pipeline.** `react-markdown` accepts a `components` prop that swaps out how specific elements render, so you don't need a remark/rehype plugin just to reformat blockquotes — intercepting the one element you care about is enough:
```jsx
function Blockquote({ children }) {
  const text = getPlainText(children);
  const match = text.match(/^\[!(TIP|WARNING|NOTE)\]/);

  if (!match) return <blockquote>{children}</blockquote>;

  return <Callout type={match[1]} content={stripPrefix(children, match[0])} />;
}
```

**3. Write `getPlainText` to walk React children, not raw markdown.** By the time the `blockquote` renderer runs, `children` is already a tree of React elements (paragraphs, text nodes, inline code), not a markdown string — so detecting the `[!TIP]` prefix means recursively collecting text from that tree rather than regex-matching against source markdown you no longer have direct access to.

**4. Keep the `Callout` component dumb — three variants, one shared layout.** It only needs to map a `type` prop to a border color, background tint, and icon, then render whatever content it's handed:
```jsx
const STYLES = {
  TIP: "border-blue-400 bg-blue-50 dark:bg-blue-950",
  WARNING: "border-amber-400 bg-amber-50 dark:bg-amber-950",
  NOTE: "border-slate-400 bg-slate-50 dark:bg-slate-900",
};

function Callout({ type, content }) {
  return (
    <div className={`border-l-4 rounded-r-md p-4 my-4 ${STYLES[type]}`}>
      {content}
    </div>
  );
}
```

**5. Pass the `components` prop where `Post.jsx` already renders `ReactMarkdown`.** This is a one-line addition to the existing render call, not a new dependency or a change to how posts are loaded — `<ReactMarkdown components={{ blockquote: Blockquote }}>{post.content}</ReactMarkdown>` is enough to wire it in site-wide.

**6. Cover dark mode in the callout's own classes, not by inheriting the page background.** Since the site already ships a dark/light toggle, hardcode both variants directly into `STYLES` with Tailwind's `dark:` prefix rather than relying on a parent element to supply the right contrast — a callout that's readable in light mode but washes out in dark mode defeats the point of making it stand out.

**7. Leave ordinary blockquotes alone.** The regex only matches a blockquote that starts with a bracketed type; anything else — a quoted line from an article, a normal `>` aside — falls through to the default `<blockquote>` render in step 2's early return, so existing posts that already use plain blockquotes don't need to be touched.

The whole feature is one component and one prop, and it means the next post that needs to say "heads up, this breaks in older Excel" can say it in a box the reader actually notices, instead of a sentence they might read past.
