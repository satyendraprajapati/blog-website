---
title: "Adding Pagination to Your React Blog's Post List"
date: "2026-07-29"
tags: ["web-development", "react", "beginner"]
excerpt: "How to split a growing Markdown-based post list into pages instead of rendering every post on one endless scroll."
---

A blog listing that renders every post in one pass works fine at ten posts and gets unwieldy at fifty — the page takes longer to load, and a reader looking for something recent has to scroll past everything else first. Pagination fixes both without needing a backend, since the post list is already loaded client-side from Markdown.

**1. Slice the sorted post array instead of filtering it.** Your posts are likely already sorted by date from `getAllPosts()`. Pagination just means taking a fixed-size window out of that array based on the current page number.

```jsx
const POSTS_PER_PAGE = 6;

function getPageOfPosts(posts, page) {
  const start = (page - 1) * POSTS_PER_PAGE;
  return posts.slice(start, start + POSTS_PER_PAGE);
}
```

**2. Drive the current page from the URL, not local state alone.** If page number only lives in `useState`, a reader who shares a link or hits back loses their place. Read it from React Router's `useSearchParams` instead, so `/blog?page=2` is a real, bookmarkable, shareable URL.

```jsx
import { useSearchParams } from "react-router-dom";

function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const postsOnPage = getPageOfPosts(allPosts, page);

  const goToPage = (n) => setSearchParams({ page: String(n) });

  // render postsOnPage, plus Prev/Next buttons calling goToPage
}
```

**3. Clamp out-of-range page numbers instead of rendering an empty list.** Someone editing `?page=99` in the address bar shouldn't see a blank page — clamp `page` between `1` and `totalPages` (as in step 2's `Math.max`), or redirect back to page 1 if it's past the last valid page.

**4. Reset to page 1 whenever a filter changes.** If your Blog page also supports tag filtering, changing the tag while sitting on page 3 of the old filtered list will silently show an empty or wrong page. Reset the `page` search param to `1` in the same handler that updates the active tag.

**5. Scroll to the top of the list on page change.** Clicking "Next" while scrolled halfway down a long list leaves the reader staring at the middle of new content with no idea what page they're on. A `window.scrollTo({ top: 0, behavior: "smooth" })` call in `goToPage` (respecting `prefers-reduced-motion`) fixes the disorientation.

**6. Skip pagination controls entirely when there's only one page.** `if (totalPages <= 1) return null` on the Prev/Next component avoids showing a useless single "Page 1 of 1" control on a blog that's still small.

**7. Keep it out of the sitemap generator's way.** Your `sitemap.xml` generation script should still point at `/blog/:slug` post URLs and the base `/blog` listing page — there's no need to enumerate every `/blog?page=N` URL individually, since they're all the same content just windowed differently.

None of this needs a pagination library — with the whole post list already sitting in memory from `getAllPosts()`, slicing an array and syncing a page number to the URL covers the actual requirement.
