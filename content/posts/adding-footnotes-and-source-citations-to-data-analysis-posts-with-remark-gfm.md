---
title: "Adding Footnotes and Source Citations to Data-Analysis Posts with remark-gfm"
date: "2026-10-12"
tags: ["web-development", "react", "markdown"]
excerpt: "A data-analysis blog lives or dies on citing its sources, and remark-gfm's footnote syntax handles that in plain Markdown with no custom components."
---

A post that claims "unemployment fell 0.4 points" or "this is based on the 2024 census extract" needs a citation, and a raw link dropped mid-sentence clutters the prose and doesn't scale past two or three sources. GitHub-flavored Markdown's footnote syntax solves this with plain text in the `.md` file, and `remark-gfm` — which most React Markdown setups already use for tables and strikethrough — supports it with no extra plugin.

**1. Confirm `remark-gfm` is already wired into your renderer.** If your Post page looks like this, footnotes work with zero additional setup:

```jsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
```

If you don't have `remark-gfm` yet, `npm install remark-gfm` and add it to `remarkPlugins`.

**2. Write the citation inline, and the source at the bottom of the post.** The reference marker is `[^label]` wherever you need it in the text, and the definition is `[^label]: text` anywhere else in the same file — conventionally at the end:

```markdown
Average order value rose 12% year over year[^1], driven mostly by the premium tier.

[^1]: Internal sales extract, Jan–Dec 2026, pulled via the `orders` and `order_items` tables.
```

**3. Let remark-gfm generate the numbering and the back-link.** It renders `[^1]` as a superscript link to a "Footnotes" section it builds automatically at the bottom of the output, complete with a return arrow back to where the citation appeared — all from that one definition line, no manual numbering to keep in sync as you add or remove sources.

**4. Style the footnotes section so it doesn't look like an afterthought.** `remark-gfm` outputs a `<section data-footnotes>` with an `<ol>` inside it — target it directly in your post stylesheet rather than fighting generic `ol`/`li` rules:

```css
section[data-footnotes] {
  margin-top: 2.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.875rem;
  color: var(--text-secondary);
}
```

**5. Use labels, not just numbers, for long posts you'll keep editing.** `[^1]` works, but `[^census-2024]` and `[^internal-sql]` are easier to keep straight six months later when you're inserting a new citation in the middle of a long technical post — remark-gfm renders the visible number either way, so the label is only for you.

**6. Keep a short style rule for yourself: cite the dataset, not just a vague claim.** "Source: company CRM export" is less useful to a reader checking your work than "Source: CRM export, deals closed Q1–Q3 2026, excluding renewals." The footnote is free real estate for exactly that detail, since it doesn't interrupt the sentence it's attached to.

This is the same mechanism Wikipedia-style citations use, just running through Markdown you're already writing — no custom `Callout` component, no manual anchor links, and no risk of a footnote number drifting out of order as the post evolves.
