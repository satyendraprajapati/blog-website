---
title: "Adding Smooth Page Transitions to Your React Blog with the View Transitions API"
date: "2026-09-07"
tags: ["web-development", "react", "css"]
excerpt: "Clicking from the blog list into a post normally just snaps to the new page — the browser's View Transitions API adds a smooth crossfade with a few lines of code and no animation library."
---

Navigating from the blog listing to a post, or from a tag page back to the archive, is instant but jarring — the old page disappears and the new one appears with no visual continuity at all. The View Transitions API, now supported in Chromium and Safari browsers, lets you wrap a route change in a native crossfade animation without installing Framer Motion or hand-rolling CSS keyframes for every route.

**1. Check what you're opting into.** The API works per-navigation: you tell the browser "this DOM update is a transition," and it automatically screenshots the before and after states and crossfades between them. Browsers that don't support it (older Firefox, for instance) just skip straight to the new page with no animation and no error — it's a progressive enhancement, not a requirement.

**2. Wrap your route update in `document.startViewTransition`.** In a React Router setup, the cleanest hook point is a small wrapper around `navigate()` that checks for the API before using it:

```jsx
function useTransitionNavigate() {
  const navigate = useNavigate();

  return (to) => {
    if (!document.startViewTransition) {
      navigate(to);
      return;
    }
    document.startViewTransition(() => {
      navigate(to);
      flushSync(() => {}); // ensures the DOM update is committed before the snapshot
    });
  };
}
```

Swap your `<Link>` clicks (or the ones on post cards specifically) for this wrapped navigate function where you want the effect.

**3. Customize the default crossfade with CSS.** Out of the box you get a plain fade, which is already an improvement, but you can target the transition pseudo-elements to make it feel more like a real page turn:

```css
::view-transition-old(root) {
  animation: 200ms ease-out both fade-out;
}
::view-transition-new(root) {
  animation: 250ms ease-in both fade-in;
}

@keyframes fade-out {
  to { opacity: 0; transform: translateY(-8px); }
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
}
```

**4. Give a specific element its own named transition for a more polished effect.** A post's title can visually "morph" from the card on the listing page into the heading on the post page by giving both elements the same `view-transition-name`:

```css
.post-card-title,
.post-page-title {
  view-transition-name: post-title;
}
```

Only one element with a given transition name may be visible on the page at a time, so this only works cleanly if the card version disappears the moment the post page mounts — which a route change naturally does.

**5. Keep transitions short and skip them for reduced-motion users.** Anything past 300–400ms starts to feel like it's slowing down navigation rather than smoothing it. Also respect `prefers-reduced-motion` by disabling the custom keyframes (the API still handles the fallback gracefully, but it's worth being explicit):

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
  }
}
```

**6. Test the fallback path deliberately.** Since unsupported browsers just skip the API entirely, open the site in one that doesn't support it (or temporarily stub out `document.startViewTransition`) and confirm navigation still works normally — the whole point of feature-detecting it is that nothing should break for visitors on an older browser.

It's a small addition on top of routing you already have, but it's the kind of polish that makes a blog feel like a considered piece of software instead of a stack of Markdown files rendered one at a time.
