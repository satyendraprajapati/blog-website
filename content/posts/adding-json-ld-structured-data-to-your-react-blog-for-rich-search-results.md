---
title: "Adding JSON-LD Structured Data to Your React Blog for Rich Search Results"
date: "2026-07-28"
tags: ["web-development", "seo", "react"]
excerpt: "How to embed JSON-LD structured data in your React blog posts so Google can show the author, publish date, and headline directly in search results."
---

Open Graph tags control how a link looks when it's shared on Slack or Twitter. They do nothing for how it looks in Google search results. That's a separate job, handled by structured data — a block of JSON that tells search engines exactly what kind of content is on the page, instead of making them guess by parsing your HTML.

**1. Understand what JSON-LD actually is.** It's a `<script type="application/ld+json">` tag containing a JSON object that follows the schema.org vocabulary. Search engines read it directly rather than inferring structure from your headings and paragraphs, which is why it's more reliable than hoping your `<h1>` and `<time>` tags get interpreted correctly.

**2. Build the data object from your existing post frontmatter.** If you're already parsing `title`, `date`, and `excerpt` with `gray-matter` for the page itself, you have everything you need — no new data source required:
```jsx
function buildArticleSchema(post, url) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Your Name",
    },
    url,
  };
}
```

**3. Inject it into the page with `dangerouslySetInnerHTML`.** This is one of the few legitimate uses of that prop — you're not rendering user-supplied HTML, you're injecting JSON you built yourself, and the script tag requires raw content rather than an escaped string:
```jsx
function ArticleSchema({ post, url }) {
  const schema = buildArticleSchema(post, url);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```
Render `<ArticleSchema post={post} url={canonicalUrl} />` inside your `Post.jsx` component alongside the meta tags you're already setting.

**4. Keep every field truthful.** Google's structured data guidelines are explicit that the markup must describe content actually visible on the page — don't put a different headline in the JSON-LD than the one in your `<h1>`, and don't backdate `datePublished` to make a post look fresher or older than it is. Mismatches between visible content and structured data are a common reason rich results get suppressed or the page gets flagged during a manual review.

**5. Validate before you trust it.** Paste a live post URL into Google's Rich Results Test to confirm the markup parses and which rich-result types it's eligible for. Do this after every change to your schema-building code — a typo in a field name (`headline` vs `title`) fails silently; the script tag renders fine, but the structured data it contains is simply wrong.

**6. Add a second schema type for the blog's home page.** A `BlogPosting` schema belongs on individual post pages; on your homepage or blog listing page, a `WebSite` schema with a `name` and `url` gives search engines a cleaner entity to associate with your brand, which matters if you ever want your site name to appear as a clickable link above search results.

None of this changes what a human visitor sees — the payoff is entirely in how your posts get represented in search results and by tools that crawl the web looking for structured content, which is worth the twenty minutes it takes to wire up.
