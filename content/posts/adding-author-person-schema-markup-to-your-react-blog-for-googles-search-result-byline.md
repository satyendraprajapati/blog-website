---
title: "Adding Author (Person) Schema Markup to Your React Blog for Google's Search Result Byline"
date: "2026-11-14"
tags: ["web-development", "seo", "react", "beginner"]
excerpt: "Article structured data tells Google what a post is about, but a separate Person schema block is what lets search results show who actually wrote it."
---

Article-level JSON-LD tells search engines a page is a blog post with a headline and a publish date, but it doesn't say much about who wrote it. Adding a `Person` schema block for the author is a small, separate step that can surface your name and credentials directly in the search result instead of leaving the byline as plain, unstructured text.

**1. It's a nested object inside your existing Article schema, not a separate script tag.** If you're already injecting `Article` JSON-LD per post, the author doesn't need its own `<script>` block — it slots into the `author` property of the same object, as a `Person` type with its own fields.

```jsx
const authorSchema = {
  "@type": "Person",
  "name": "Your Name",
  "url": "https://yourblog.com/about",
  "sameAs": [
    "https://github.com/yourhandle",
    "https://www.linkedin.com/in/yourhandle"
  ]
};
```

**2. `sameAs` is what actually connects the dots for Google.** A bare name is just a string — the `sameAs` array of links to your GitHub, LinkedIn, or other verified profiles is what gives Google a way to confirm it's a real, consistent identity across the web, not a one-off label typed into a page.

**3. Build it once as a constant, not per-post.** Unlike the Article schema's title and date, which change for every post, the author details are the same across your whole site. Define the `Person` object once in a shared file (alongside your site config) and import it into whatever component builds each post's JSON-LD, so a LinkedIn URL change only needs updating in one place.

**4. Merge it into the Article object before serializing.** The full script tag should end up as one JSON-LD object, with `author` as a key alongside `headline`, `datePublished`, and the rest — not two separate `<script type="application/ld+json">` tags competing for the same page.

```jsx
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "datePublished": post.date,
  "author": authorSchema
};
```

**5. Test it with Google's Rich Results Test before trusting it.** Paste a live post URL in and check that `author` shows up correctly parsed, with the `Person` type recognized. A typo in the nesting — author as a plain string instead of an object, for instance — won't throw a JavaScript error, so a validator is the only way to catch it.

**6. The byline change in search results isn't guaranteed or instant.** Google decides whether and how to show author information based on a mix of structured data, page content, and site authority — adding the markup makes it possible, not automatic. Don't expect a visible change in search results overnight.

**7. Keep the visible on-page byline in sync with the schema.** Structured data that contradicts what's actually shown on the page can be ignored or treated as a quality signal against you. If the schema says "Your Name" but the rendered post shows no author at all, fix the visible byline rather than relying on markup to do work the page itself isn't doing.

It's a few lines added to markup you likely already have, and on its own it won't move rankings — but for a blog where the author's credibility is part of the pitch, it's a cheap way to make that identity legible to the search engines deciding how to present your posts.
