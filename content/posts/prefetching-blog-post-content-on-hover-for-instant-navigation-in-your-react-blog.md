---
title: "Prefetching Blog Post Content on Hover for Instant Navigation in Your React Blog"
date: "2026-09-16"
tags: ["web-development", "react", "performance"]
excerpt: "Load a post's markdown as soon as a visitor hovers its link, so the click itself feels instant."
---

Even on a fast connection, clicking a post link and waiting for the markdown to fetch and parse creates a small but noticeable delay. Most of that delay is avoidable — by the time someone clicks a link, they've usually already hovered over it for a couple hundred milliseconds, which is enough time to start loading the content before the click even happens.

**1. Start with what triggers the load.** If your posts are loaded lazily via `import.meta.glob` with the `{ eager: false }` option (or a dynamic `import()` per slug), each post is already its own lazily-loaded chunk. The only change needed is calling that same import function earlier — on hover instead of on click.
```jsx
const postLoaders = import.meta.glob("../content/posts/*.md");

function prefetchPost(slug) {
  const loader = postLoaders[`../content/posts/${slug}.md`];
  loader?.();
}
```
Calling `loader()` triggers the dynamic import and caches the resulting module in the browser and in Vite's module graph, so when the route actually renders, the import resolves instantly instead of kicking off a fresh network request.

**2. Wire it up on the link itself.** A small wrapper around your post links keeps the prefetch logic in one place instead of repeating it in every list.
```jsx
function PostLink({ slug, children }) {
  return (
    <Link
      to={`/blog/${slug}`}
      onMouseEnter={() => prefetchPost(slug)}
      onFocus={() => prefetchPost(slug)}
    >
      {children}
    </Link>
  );
}
```
Including `onFocus` alongside `onMouseEnter` matters more than it looks — it's what makes the same prefetch fire for keyboard users tabbing through the post list, not just mouse users hovering.

**3. Guard against wasted requests on touch devices.** Touch screens don't have a hover state the way a mouse does, so `onMouseEnter` either doesn't fire or fires right before the tap anyway, giving you little benefit and, in some browsers, a redundant load. It's harmless to leave as-is, but if you want to be deliberate about it, check `window.matchMedia("(hover: hover)").matches` before prefetching so you're not doing extra work on devices where it won't pay off.

**4. Avoid prefetching everything at once.** It's tempting to prefetch every post the moment the blog list mounts, but that defeats the purpose — you'd be front-loading the same network cost you were trying to avoid, just moved earlier. Hover-triggered (or focus-triggered) prefetching only loads what the visitor is actually about to click, which keeps the technique cheap instead of turning into an eager download of your whole content directory.

**5. Debounce quick mouse passes if your post list is long.** If someone drags their cursor across a dense grid of post cards, you don't want to fire off a dozen imports in half a second. A short delay before triggering the load — cancelled if the mouse leaves before it fires — keeps prefetching limited to links the visitor actually paused on.
```jsx
function usePrefetchOnHover(slug, delay = 100) {
  const timer = useRef(null);
  return {
    onMouseEnter: () => {
      timer.current = setTimeout(() => prefetchPost(slug), delay);
    },
    onMouseLeave: () => clearTimeout(timer.current),
  };
}
```

The effect is subtle but real: because the markdown is already sitting in memory by the time the click registers, the post page renders as soon as the route changes instead of after it. It's one of the few performance changes that costs almost nothing to add and is felt on essentially every click.
