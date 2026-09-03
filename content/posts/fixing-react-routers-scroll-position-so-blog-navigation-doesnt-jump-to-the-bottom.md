---
title: "Fixing React Router's Scroll Position So Blog Navigation Doesn't Jump to the Bottom"
date: "2026-09-03"
tags: ["web-development", "react", "react-router"]
excerpt: "React Router doesn't reset scroll position on its own, so clicking a post link from the bottom of a long list leaves the next page scrolled to the same spot."
---

A traditional multi-page site scrolls to the top on every navigation for free — the browser loads a new document. A single-page app built with React Router doesn't get that automatically: it swaps components in place, and the scroll position from the page you were on carries over to the page you land on. Click a post title from the bottom of a long blog listing and you can land on the new post already scrolled halfway down it, which reads like a bug even though nothing actually broke.

**1. Add a `ScrollToTop` component that watches the route.** It renders nothing — its only job is to run a side effect whenever the path changes.

```jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
```

**2. Mount it once at the top of your router, not inside individual pages.** Drop `<ScrollToTop />` next to `<Routes>` in `App.jsx`. Adding the same `useEffect` separately to every page component works too, but it's easy to forget on a new page you add six months from now — one component covers every route by construction.

**3. Don't reset scroll on the browser's back button the same way.** Resetting to the top on every path change also fires when a reader hits back, which throws away the scroll position they were at on the listing page. If that bothers you, store the scroll offset per `location.key` in `sessionStorage` on the way out, and restore it — instead of scrolling to zero — when you detect a `POP` navigation from `useNavigationType()`.

**4. Respect in-page anchor links.** If your posts use heading anchors (a table of contents linking to `#some-heading`), a blanket scroll-to-top will override the jump to that heading. Check for a hash before resetting:

```jsx
useEffect(() => {
  if (hash) {
    document.getElementById(hash.slice(1))?.scrollIntoView();
  } else {
    window.scrollTo(0, 0);
  }
}, [pathname, hash]);
```

**5. Verify the fix in a production build, not just the dev server.** Hot module replacement during development sometimes preserves or resets scroll position in ways that don't match what a real page load does, which can hide the bug entirely while you're working on it. Run `npm run build && npm run preview` and click through a few posts before trusting the fix.

It's a small piece of code, but it's one of those things every React Router site eventually needs and few tutorials mention until a reader complains that "the blog feels broken."
