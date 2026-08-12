---
title: "Adding a Reading Progress Bar to Blog Posts in React"
date: "2026-08-12"
tags: ["web-development", "react", "beginner"]
excerpt: "How to add a thin bar at the top of the page that fills as a reader scrolls through a post, using a scroll listener and a bit of math instead of a library."
---

A reading time estimate tells a visitor how long a post will take before they start. A progress bar tells them how far they've gotten while they're in it — a small cue that makes a long technical post feel less like an unknown-length scroll and more like something with a visible end.

**1. Build the math first, separately from the component.** The bar's fill percentage is just how far the page has scrolled divided by how far it *can* scroll:
```jsx
function getScrollPercent() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  return docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
}
```
The `docHeight > 0` check matters more than it looks — on a short post that fits entirely on screen, `scrollHeight` and `innerHeight` are equal, `docHeight` is zero, and without the guard you'd divide by zero and get `NaN` instead of a bar that's simply always full.

**2. Track that percentage in state, updated on scroll.** A small component that lives at the top of your `Post` page layout:
```jsx
import { useState, useEffect } from 'react'

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function handleScroll() {
      setProgress(getScrollPercent())
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 h-1 bg-purple-600 dark:bg-purple-400 z-50 transition-[width]"
      style={{ width: `${progress}%` }}
    />
  )
}
```
The `{ passive: true }` option matters for scroll performance — it tells the browser this listener will never call `preventDefault()`, so it doesn't have to wait for your handler to finish before scrolling the page.

**3. Render it only on the post page, not globally.** Drop `<ReadingProgressBar />` at the top of `Post.jsx`, above the `<article>` wrapper. Mounting it inside the post component means it mounts and unmounts with the page automatically — no extra logic needed to hide it on the Home or Blog listing pages, where "reading progress" doesn't mean anything.

**4. Skip a debounce or throttle — this doesn't need one.** A common instinct is to throttle scroll handlers because they can fire dozens of times a second, but this handler does one cheap arithmetic calculation and one state update, both of which React and the browser handle comfortably at that frequency. Adding a debounce here would only make the bar visibly lag behind the actual scroll position, which defeats the point of a progress indicator.

**5. Test it against your shortest and longest posts.** Open your shortest post and confirm the bar doesn't flicker or throw a console warning (this is the `docHeight > 0` check earning its keep), then open your longest one and scroll to the very bottom to confirm the bar actually reaches 100% instead of stalling a few pixels short — a common bug when `scrollHeight` includes padding or a footer margin you didn't account for.

The whole feature is about 20 lines and one `useEffect` — no charting or animation library needed, just `scrollY` and a `div` with a `width` that changes.
