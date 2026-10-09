---
title: "Adding a Click-to-Zoom Lightbox for Dashboard Screenshots in Your React Blog Posts"
date: "2026-10-09"
tags: ["web-development", "react", "ux"]
excerpt: "A Power BI dashboard or a dense Excel pivot table shrunk to fit a post's content column is often too small to actually read -- a lightbox lets a reader click any screenshot to see it at full size without leaving the page."
---

A data blog's images aren't decorative — a screenshot of a PivotTable or a Power BI matrix is often the whole point of the post, and the labels and numbers in it need to be legible. Constrained to a readable content column width, a wide dashboard screenshot gets scaled down until its axis labels are a blur. A lightbox fixes that with one click: tap the image, see it full-size over a dimmed background, tap again (or hit Escape) to dismiss.

**1. Build the lightbox as a small, self-contained component.** It needs almost no state — just which image (if any) is currently open:
```jsx
import { useState, useEffect } from "react";

export default function Lightbox({ src, alt }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <img
        src={src}
        alt={alt}
        onClick={() => setIsOpen(true)}
        className="cursor-zoom-in rounded-lg"
      />
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 cursor-zoom-out"
        >
          <img src={src} alt={alt} className="max-h-full max-w-full rounded-lg" />
        </div>
      )}
    </>
  );
}
```
Locking `document.body` scroll while the overlay is open stops the page from scrolling underneath it, which is an easy detail to miss and an obvious one to a reader when it's wrong.

**2. Wire it into the Markdown image renderer, not into individual posts.** Posts already render images through a custom `img` component if you've added lazy loading or responsive `srcset` attributes — swap that component for `Lightbox` once, and every post gets click-to-zoom automatically:
```jsx
<ReactMarkdown
  components={{
    img: ({ src, alt }) => <Lightbox src={src} alt={alt} />,
  }}
>
  {postContent}
</ReactMarkdown>
```
No post needs to opt in or remember a prop — the behavior comes from where images are rendered, the same pattern used for syntax highlighting or callout boxes.

**3. Give the full-size image room without cropping it.** `max-h-full max-w-full` combined with the parent's `flex items-center justify-center` keeps the image centered and scaled to fit the viewport in both directions, so a wide dashboard screenshot and a tall mobile screenshot both land correctly without manual aspect-ratio handling per image.

**4. Stop the click from bubbling when a reader is just closing the overlay.** With the current markup, clicking anywhere on the dimmed backdrop closes it — including a click that happened to land on the enlarged image itself, since it's not a separate stacking layer. If you want clicking the image to do nothing and only the backdrop to close, stop propagation on the inner image:
```jsx
<img
  src={src}
  alt={alt}
  onClick={(e) => e.stopPropagation()}
  className="max-h-full max-w-full rounded-lg"
/>
```

**5. Make it keyboard- and screen-reader-friendly.** The Escape key handler above covers keyboard dismissal, but the overlay should also be reachable and announced correctly — add `role="dialog"` and `aria-modal="true"` to the overlay `div`, and move focus to it when it opens so a keyboard user isn't left tabbing through the page underneath:
```jsx
const closeButtonRef = useRef(null);
useEffect(() => {
  if (isOpen) closeButtonRef.current?.focus();
}, [isOpen]);
```
A visible close button in the corner, focused on open, gives both a mouse user and a keyboard user an obvious, discoverable way out.

**6. Skip the dependency unless you need carousel-style navigation between images.** Libraries like `yet-another-react-lightbox` add gestures, zoom-and-pan, and next/previous navigation across a gallery — genuinely useful if a post has a sequence of related screenshots to step through, but more than a single click-to-enlarge interaction needs. For one dashboard screenshot at a time, the component above covers it in under 40 lines with no added bundle weight.

The fix costs almost nothing to build and removes a real point of friction: a reader who has to squint at a shrunk PivotTable, or pinch-zoom a phone screen against a fixed-width image, is a reader who's working harder than the post should ask of them.
