---
title: "Adding a 'Related Posts' Section to Your React Blog Using Shared Tags"
date: "2026-08-03"
tags: ["web-development", "react", "content"]
excerpt: "How to surface related posts at the bottom of each article using the tags you're already adding to frontmatter, without a recommendation engine or an external service."
---

Once a blog has a few dozen posts, a reader who finishes one article has no obvious next step besides going back to the listing page. A "Related Posts" section fixes that, and since every post already has a `tags` array in its frontmatter, you don't need a recommendation engine or any external service to build one — just a scoring function over data you already have.

**1. Score posts by how many tags they share, not just whether they share any.** A post tagged `["power-bi", "dax", "beginner"]` is a closer match to another `dax` post than to one that only shares `beginner`. Counting overlapping tags gives you a simple relevance ranking for free:
```jsx
function getRelatedPosts(currentPost, allPosts, count = 3) {
  return allPosts
    .filter((p) => p.slug !== currentPost.slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => currentPost.tags.includes(t)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ post }) => post);
}
```

**2. Fall back to recent posts when nothing shares a tag.** A post with a niche tag combination might have zero matches, and an empty "Related Posts" section looks broken rather than intentional. If `getRelatedPosts` returns nothing, fall back to the most recent posts excluding the current one, so the section always has something in it.

**3. Break ties by recency, not array order.** When two candidate posts have the same tag-overlap score, sort by date before slicing — otherwise the "related" list quietly favors whatever order posts happen to load in, rather than showing the reader your most current material on the topic.

**4. Render it with the same `PostCard` component you already use for the blog listing.** There's no need for a separate related-post component — reuse `PostCard.jsx` inside the `Post.jsx` page, right after the article body, so the related section looks and behaves exactly like the rest of the site instead of introducing a new visual pattern:
```jsx
<section className="mt-12">
  <h2 className="text-xl font-semibold mb-4">Related Posts</h2>
  <div className="grid gap-4 sm:grid-cols-3">
    {getRelatedPosts(post, allPosts).map((p) => (
      <PostCard key={p.slug} post={p} />
    ))}
  </div>
</section>
```

**5. Compute it at render time, not as a build step.** Because the whole post list already loads client-side via the existing `lib/posts.js` helper, tag matching is cheap enough to run directly inside `Post.jsx` on each visit — there's no need for a separate generated JSON file or extra build tooling just to precompute relationships.

**6. Exclude the current post explicitly, even though it would naturally score highest.** A post always shares 100% of its own tags with itself, so without the `p.slug !== currentPost.slug` filter in step 1, it would win the ranking and show up recommending itself — an easy bug to miss until you're staring at your own article linking to itself.

The result costs nothing beyond a small utility function, and it does the one thing a Related Posts section is actually for: keeping a reader who liked one post moving to the next one, instead of bouncing back to the homepage.
