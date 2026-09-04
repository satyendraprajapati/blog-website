---
title: "Adding Deep-Linkable Anchor Links to Blog Post Headings in React"
date: "2026-09-04"
tags: ["web-development", "react", "content"]
excerpt: "Give every heading in a Markdown post a stable ID and a hover-to-copy link so readers can share a link straight to one section."
---

Long posts get shared section by section — someone wants to point a coworker at just the DAX example, not the whole article. Without heading IDs, the best you can offer is "scroll down to the part about SELECTEDVALUE." With them, you can give out a real URL.

**1. Generate an ID for every heading as you render Markdown.** If you're using `react-markdown`, override the `h2`/`h3` components and slugify the heading text into an `id` attribute:

```jsx
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

const components = {
  h2: ({ children, ...props }) => {
    const id = slugify(String(children));
    return <h2 id={id} {...props}>{children}</h2>;
  },
};
```

Apply the same pattern to `h3` (and `h4` if your posts go that deep) so every subsection gets its own anchor too.

**2. Add a visible "copy link" affordance on hover.** Wrap the heading text in a flex container and show a small link icon only when the user hovers, so the page doesn't look cluttered by default:

```jsx
h2: ({ children, ...props }) => {
  const id = slugify(String(children));
  return (
    <h2 id={id} className="group scroll-mt-24" {...props}>
      <a
        href={`#${id}`}
        className="opacity-0 group-hover:opacity-100 mr-2 text-gray-400"
        aria-label="Link to this section"
      >
        #
      </a>
      {children}
    </h2>
  );
},
```

`scroll-mt-24` (a Tailwind utility) is worth adding to every heading — without it, a sticky header will cover the top of the section when the browser jumps to the anchor.

**3. Make clicking the anchor actually copy the full URL.** A plain `<a href="#id">` updates the address bar, but readers often want to paste a link into Slack without checking what the bar shows. Intercept the click and copy the full URL to the clipboard as a small usability bonus:

```jsx
const handleAnchorClick = (id) => (e) => {
  e.preventDefault();
  const url = `${window.location.origin}${window.location.pathname}#${id}`;
  navigator.clipboard.writeText(url);
  window.location.hash = id;
};
```

**4. Scroll to the right heading when a post loads with a hash already in the URL.** React Router doesn't do this for you automatically on client-side navigation — add an effect in your `Post` page that checks `location.hash` after the post content has rendered:

```jsx
useEffect(() => {
  if (location.hash) {
    const el = document.getElementById(location.hash.slice(1));
    el?.scrollIntoView({ behavior: "smooth" });
  }
}, [location.hash, post]);
```

The dependency on `post` matters — without it, the effect can fire before the Markdown has rendered and find nothing to scroll to.

**5. Keep slugs stable across edits.** If you rename a heading later, its generated ID changes and any link someone shared now points to the top of the post instead of the right section. Treat heading text as effectively part of your post's public API once it's published, or slugify from a stable `id` you set explicitly in the Markdown source rather than the rendered text.

It's a small feature, but it turns every post from one link into dozens — and for a technical blog, being able to link straight to the relevant tip is exactly the kind of thing that gets a post shared instead of just read once.
