---
title: "Adding a Reading Time Estimate to Your React Blog Posts"
date: "2026-07-25"
tags: ["web-development", "react", "beginner"]
excerpt: "How to calculate a '5 min read' label from raw Markdown content instead of hand-guessing it per post."
---

A "5 min read" label next to a post title is a small thing, but it's one of the cheapest ways to set expectations before someone clicks in — and it's simple enough to compute from content you're already parsing, with no extra package needed.

**1. Word count is the whole calculation.** There's no need for a reading-time library — split the post body on whitespace, filter out empty strings from repeated line breaks, and count what's left.
```js
function getReadingTime(content) {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE))
}
```

**2. Pick a words-per-minute constant and keep it in one place.** 200–250 wpm is the commonly cited range for adult silent reading; 200 is a reasonable default for technical content with code blocks, which reads slower than prose. Define it once (`const WORDS_PER_MINUTE = 200`) rather than inlining the number wherever you calculate time, so adjusting the estimate later is a one-line change.

**3. Floor the result at one minute.** A short post at, say, 40 words divided by 200 rounds to zero, which reads as broken rather than fast. `Math.max(1, …)` guarantees the label never shows "0 min read."

**4. Compute it where you already parse frontmatter, not in the component.** If you're using `gray-matter` to pull `title`, `date`, and `tags` out of each Markdown file, add `readingTime` to that same object. Every page that lists or renders a post — a card on the blog index, the post header itself — then gets the number for free instead of recomputing it from raw content in multiple places.

**5. Exclude frontmatter from the count.** Run the calculation against `content` (the body `gray-matter` returns after stripping the YAML block), not the raw file text — otherwise every post's estimate is inflated by the same fixed handful of frontmatter words, which matters more for short posts than long ones.

**6. Display it next to the date, not as its own separate element.** Pairing it with the publish date (`July 25, 2026 · 4 min read`) keeps both pieces of metadata in the same visual weight, and matches the pattern readers already recognize from other blogs.

It's a small feature, but it's a good example of metadata you can derive instead of maintain — nobody has to remember to update a reading-time field when they edit a post, because it's recalculated from the content itself every time the site builds.
