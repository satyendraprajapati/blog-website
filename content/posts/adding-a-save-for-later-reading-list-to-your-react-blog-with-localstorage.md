---
title: "Adding a 'Save for Later' Reading List to Your React Blog with localStorage"
date: "2026-09-26"
tags: ["web-development", "react", "beginner"]
excerpt: "Let a visitor bookmark a long DAX or Power Query post to come back to, stored entirely in their own browser -- no account, database, or backend required."
---

A visitor skimming a long Excel or Power BI tutorial doesn't always have time to read it in full. Without a way to save it, they either bookmark the URL in their browser (easy to lose in a pile of tabs) or just leave and hope they remember to search for it again later. A small "Save for Later" button, backed by nothing more than the browser's own storage, fixes that without needing a login system or a database.

**1. Store saved slugs as a plain array in `localStorage`.** No backend means no per-user accounts, so the "reading list" is really just a list of post slugs living in the visitor's own browser. A tiny hook keeps the read/write logic in one place instead of scattered across components:
```jsx
import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'saved-posts'

export function useSavedPosts() {
  const [savedSlugs, setSavedSlugs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSlugs))
    } catch {
      // storage full or blocked (private browsing) -- fail silently
    }
  }, [savedSlugs])

  const toggleSaved = useCallback((slug) => {
    setSavedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }, [])

  return { savedSlugs, toggleSaved, isSaved: (slug) => savedSlugs.includes(slug) }
}
```
Both the read and the write are wrapped in `try/catch` — a visitor in private browsing mode, or with storage disabled entirely, shouldn't see a crashed page just because a save button couldn't persist anything.

**2. Add a toggle button to `Post.jsx`.** The button just needs the current post's slug and the hook above — no prop drilling required since each post page already knows its own slug from the route:
```jsx
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useSavedPosts } from '../lib/useSavedPosts'

function SaveButton({ slug }) {
  const { isSaved, toggleSaved } = useSavedPosts()
  const saved = isSaved(slug)

  return (
    <button
      onClick={() => toggleSaved(slug)}
      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 dark:hover:text-purple-400"
    >
      {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
      {saved ? 'Saved' : 'Save for later'}
    </button>
  )
}
```

**3. Build a `/saved` page that reads the list back and reuses `PostCard`.** Since the hook already exposes `savedSlugs`, the page just filters your existing posts array against it and renders the same `PostCard` component your Blog listing already uses — no new card design to build:
```jsx
import { getAllPosts } from '../lib/posts'
import { useSavedPosts } from '../lib/useSavedPosts'
import PostCard from '../components/PostCard'

export default function SavedPosts() {
  const { savedSlugs } = useSavedPosts()
  const posts = getAllPosts().filter((post) => savedSlugs.includes(post.slug))

  if (posts.length === 0) {
    return <p className="text-center text-gray-500 py-12">No saved posts yet — click "Save for later" on any post.</p>
  }

  return <div className="max-w-3xl mx-auto px-4 py-8">{posts.map((post) => <PostCard key={post.slug} {...post} />)}</div>
}
```

**4. Be upfront that the list is per-browser, not per-person.** Because there's no account behind it, the same visitor won't see their saved posts if they switch devices, use a different browser, or clear site data — worth a short line of copy on the `/saved` page itself so nobody assumes it synced somewhere it didn't.

**5. Skip a "saved count" badge in the header until you've confirmed it's worth the re-renders.** It's tempting to also show a live count next to a nav link, but that means every component in the tree that shows it re-renders on every save/unsave — fine at this scale, but not something to add speculatively before a visitor has asked for it.

The whole feature is one hook, one button, and one page that reuses a component you've already built — the kind of thing that's easy to skip because it "isn't essential," right up until a reader wishes it existed.
