---
title: "Building a Keyboard Command Palette for Fast Navigation on Your React Blog"
date: "2026-09-15"
tags: ["web-development", "react", "ux"]
excerpt: "A Cmd+K palette that jumps straight to any page or post beats clicking through the header nav, and you can build a working version in plain React with no extra dependency."
---

A search box helps once someone knows what they're looking for, but most navigation on a small site is simpler than that — jumping to the About page, opening the latest post, or getting to Contact without a mouse. A command palette, the `Cmd+K` (or `Ctrl+K`) overlay popularized by tools like Linear and Notion, covers that faster than clicking through a header. You don't need a library to add one — a keydown listener, a filtered list, and a portal-style overlay get you most of the way there.

**1. Listen for the shortcut globally, not on a specific page.** Attach the keydown listener once, in `App.jsx` or a small provider component, so the palette opens from any route rather than only where you remembered to wire it up.
```jsx
useEffect(() => {
  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setOpen((prev) => !prev)
    }
    if (e.key === 'Escape') setOpen(false)
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])
```
`preventDefault` matters here — without it, `Cmd+K` triggers the browser's own address bar shortcut in most browsers instead of opening yours.

**2. Build the command list from routes you already have, not a new data source.** Your `App.jsx` already defines every page as a `<Route>` — reuse that as a flat array of `{ label, path }` objects for static pages, and append your post frontmatter (title and slug) for blog posts, the same data your `PostCard` components already render from.

**3. Filter on keystroke, and keep the matching simple.** A basic case-insensitive substring match against title is enough for a personal site's scale — you don't need fuzzy matching or a search library for a few hundred entries at most.
```jsx
const results = query
  ? items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    )
  : items.slice(0, 8) // show recent/common links when the query is empty
```

**4. Navigate with `useNavigate`, then close and reset.** Selecting a result should feel instant — route, close the overlay, and clear the query in one handler, so reopening the palette next time doesn't show stale results from the last search.
```jsx
const navigate = useNavigate()
function selectItem(item) {
  navigate(item.path)
  setOpen(false)
  setQuery('')
}
```

**5. Make it fully keyboard-operable, not just keyboard-openable.** Track a `selectedIndex`, move it with `ArrowUp`/`ArrowDown`, and trigger `selectItem` on `Enter` for whichever row is highlighted. A palette you can open with the keyboard but only click through afterward defeats half the point.

**6. Trap focus and block page scroll while it's open.** Put the input's `autoFocus` on mount, and set `document.body.style.overflow = 'hidden'` for as long as the overlay is open so the page underneath doesn't scroll behind a modal that looks like it's on top of it. Clear both when the palette closes.

**7. Add a visible hint so people discover it.** A shortcut nobody knows exists doesn't get used — a small `⌘K` badge in the header's search icon or nav bar, styled to match your existing dark/light theme, is usually enough to teach returning visitors the habit within a couple of sessions.

The whole thing is a single component and a couple hundred lines at most — no bundle-size cost from a command-palette library, and full control over which content it indexes and how it looks in both themes.
