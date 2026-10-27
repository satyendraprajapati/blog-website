---
title: "Adding a Scroll-to-Top Button That Appears After Scrolling, in React"
date: "2026-10-27"
tags: ["web-development", "react", "ux"]
excerpt: "A small floating button that only shows up once a visitor has scrolled past a threshold, so it helps on long blog posts without cluttering short ones."
---

Long posts — a deep-dive on DAX functions or a 700-word walkthrough with six code blocks — benefit from a quick way back to the top. A button that's always visible is clutter on short pages, so the trick is showing it only once there's actually somewhere to scroll back from.

**1. Track scroll position with a single `scroll` listener, not one per component.** If several pages need the button, put the listener in one reusable component rather than duplicating it, and always clean it up on unmount to avoid a leaked listener piling up as a visitor navigates between posts.
```jsx
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 rounded-full bg-gray-800 p-3 text-white shadow-lg transition hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900"
    >
      ↑
    </button>
  );
}
```

**2. Pick the 400px threshold by feel, not by a formula.** The right number depends on your header height and how tall your post cards are — too low and the button pops in almost immediately, which defeats the point; too high and a visitor on a medium-length post never sees it at all. Scroll your own longest and shortest posts and adjust until it feels right on both.

**3. Mark it `aria-label`, not just an arrow glyph.** A screen reader has nothing useful to announce for "↑" on its own, so the `aria-label` is what makes the button make sense to someone who can't see the icon.

**4. Use `{ passive: true }` on the listener.** Scroll listeners can block the browser's scrolling optimizations unless you tell it upfront that the handler won't call `preventDefault()` — passive listeners keep scrolling smooth even on longer pages with a lot of embedded charts or images.

**5. Respect `prefers-reduced-motion` for the scroll itself.** `behavior: "smooth"` is a nice touch, but for a visitor who's told their OS they prefer reduced motion, an instant jump is more comfortable than an animated scroll:
```jsx
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

window.scrollTo({
  top: 0,
  behavior: prefersReducedMotion ? "auto" : "smooth",
});
```

**6. Mount it once near the root layout, not inside every page.** Dropping `<ScrollToTopButton />` into a shared layout component means it works consistently across the blog, the project pages, and anywhere else long content lives, without remembering to add it to each page individually.

It's a small feature, but on a blog where several posts run long with code blocks and screenshots, it's the kind of thing a reader notices by its absence more than by its presence.
