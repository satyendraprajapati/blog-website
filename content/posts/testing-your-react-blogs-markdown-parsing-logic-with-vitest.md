---
title: "Testing Your React Blog's Markdown-Parsing Logic with Vitest"
date: "2026-08-13"
tags: ["web-development", "testing", "vitest"]
excerpt: "How to write fast unit tests for the frontmatter-parsing and reading-time functions that power a Markdown-based React blog, so a broken post doesn't ship silently."
---

`src/lib/posts.js` is the quiet engine of a Markdown-based blog — it parses frontmatter, computes reading time, and builds the slug and sort order every page relies on. None of that runs through a UI you'd notice breaking; a bad date format or a missing excerpt just produces a wrong-looking post card, not an error. Vitest gives you a fast way to catch that before it reaches production.

**1. Install Vitest and let it share your existing Vite config, instead of setting up a separate test runner with its own aliases and environment.** Vitest is built by the Vite team specifically to reuse `vite.config.js`, so there's no second config to keep in sync.

```bash
npm install -D vitest
```

Add a script to `package.json`:

```json
"scripts": {
  "test": "vitest run"
}
```

**2. Test the pure parsing functions directly rather than rendering components — a function that takes raw Markdown and returns a post object is the cheapest, highest-value thing to test.** No DOM, no rendering, just input in and object out.

```js
import { describe, it, expect } from 'vitest'
import { parsePost } from '../src/lib/posts'

describe('parsePost', () => {
  it('extracts frontmatter into a post object', () => {
    const raw = `---
title: "Test Post"
date: "2026-01-01"
tags: ["excel"]
excerpt: "A test post."
---
Body content here.`

    const post = parsePost(raw, 'test-post.md')

    expect(post.title).toBe('Test Post')
    expect(post.slug).toBe('test-post')
    expect(post.tags).toContain('excel')
  })
})
```

**3. Write a case for every field that's ever gone wrong in a real post, not just the happy path.** A missing `excerpt`, a `tags` value that isn't an array, or a `date` string that doesn't zero-pad the day are the actual bugs that make it past a quick visual check when you're focused on the post content, not the frontmatter.

**4. Test the reading-time calculation against a string with a known word count, instead of eyeballing whether the label on a real post "looks about right."** Feed it a string built from a fixed number of repeated words and assert the exact minute value it returns — that's the only way to catch an off-by-one in the words-per-minute math.

**5. Test that posts sort by date correctly, including the case that breaks it silently: two posts published on the same day.** Date-only sorting with no tiebreaker can reorder same-day posts unpredictably between builds, which is easy to miss by reading the list once and hard to notice once there are a hundred posts.

**6. Wire `npm run test` into the same CI check that already runs `npm run build`, so a broken parsing function fails the pipeline instead of shipping a wrong date or a blank excerpt to the live site.** If you've already set up a GitHub Actions build check, adding a test step there is a one-line addition, not a new pipeline.

None of this needs to cover the whole codebase. The value is concentrated almost entirely in `posts.js`, because it's the one place a subtle bug produces a wrong-looking page instead of a build failure — exactly the kind of mistake a fast, targeted unit test catches for free.
