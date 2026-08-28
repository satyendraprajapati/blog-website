---
title: "Adding Previous/Next Post Navigation to Your React Blog"
date: "2026-08-28"
tags: ["web-development", "react", "beginner"]
excerpt: "How to let a reader move chronologically through your posts with a pair of links at the bottom of each article, instead of bouncing back to the blog listing between every one."
---

A "Related Posts" section surfaces other articles on the same topic, but it doesn't answer the simplest next question a reader has after finishing a tutorial: what did you write right before or after this one? Previous/Next navigation answers that directly, using the same post list your site already loads.

**1. Reuse the sorted list `getAllPosts` already returns instead of building a second sort.** `src/lib/posts.js` sorts every post by date, newest first, once at load time. Finding a post's neighbors is just finding its index in that array and reading the entries on either side:
```jsx
export function getAdjacentPosts(slug) {
  const posts = getAllPosts()
  const index = posts.findIndex((post) => post.slug === slug)
  if (index === -1) return { newer: null, older: null }

  return {
    newer: index > 0 ? posts[index - 1] : null,
    older: index < posts.length - 1 ? posts[index + 1] : null,
  }
}
```

**2. Be deliberate about "newer" vs. "older," not "previous" vs. "next."** Because the array is sorted newest-first, the post at `index - 1` was published later and the post at `index + 1` was published earlier. Naming the two results `newer` and `older` instead of `prev`/`next` avoids the off-by-one bug of wiring the arrows backwards, which is easy to do once and then not notice until someone reports that "Next Post" goes back in time.

**3. Handle both ends of the list explicitly.** The oldest post has no `older` entry and the newest post has no `newer` one — `getAdjacentPosts` above already returns `null` for those rather than wrapping around to the opposite end of the array, which would silently loop a reader from your very first post back to your latest one with no indication anything jumped.

**4. Render the pair as a two-column bar under the post body, and hide a side that's `null`.** Drop this into `Post.jsx` right after the article content and before the Related Posts section:
```jsx
{(older || newer) && (
  <nav className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between gap-4">
    {older ? (
      <Link to={`/blog/${older.slug}`} className="flex flex-col text-left">
        <span className="text-xs text-gray-500">← Older</span>
        <span className="text-sm font-medium">{older.title}</span>
      </Link>
    ) : <span />}
    {newer ? (
      <Link to={`/blog/${newer.slug}`} className="flex flex-col text-right ml-auto">
        <span className="text-xs text-gray-500">Newer →</span>
        <span className="text-sm font-medium">{newer.title}</span>
      </Link>
    ) : <span />}
  </nav>
)}
```
The empty `<span />` placeholders keep the flexbox `justify-between` layout from collapsing to one side when a post only has a neighbor on one end.

**5. Show the title, not just "Previous" and "Next."** A bare "Next Post" label gives a reader no reason to click before they've already committed. Showing the actual title — the same text used everywhere else on the site — lets them decide whether the next post in the timeline is actually the one they want to read next.

**6. Keep this separate from Related Posts rather than merging the two.** Related Posts answers "what else covers this topic," ranked by shared tags; Previous/Next answers "what's chronologically next," with no relevance filtering at all. Stacking both — chronological nav first, then a tag-based Related Posts grid — gives a reader two different, non-competing ways to keep going instead of one confused hybrid.

This costs one small helper function and a bit of layout, but it turns every post's dead end into two more places for a reader to click, using data the site was already computing for the listing page.
