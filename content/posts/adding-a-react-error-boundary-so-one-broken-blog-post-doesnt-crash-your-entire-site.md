---
title: "Adding a React Error Boundary So One Broken Blog Post Doesn't Crash Your Entire Site"
date: "2026-08-27"
tags: ["web-development", "react", "beginner"]
excerpt: "A single malformed frontmatter field or a bad Markdown edit can throw during render and take down the whole page — an error boundary contains the damage to just that post."
---

Without one, a render error anywhere in your component tree — a post with frontmatter `tags` that isn't an array, a date field `react-markdown` can't parse, a chart component fed unexpected data — unmounts the entire React app and leaves the visitor staring at a blank white page, with no indication anything went wrong. An error boundary catches that and shows a fallback instead, scoped to just the part that broke.

**1. Error boundaries have to be class components.** React still doesn't offer a hook equivalent for catching render errors, so this is one of the few places a class component is the right tool even in an otherwise all-hooks codebase.
```jsx
// src/components/ErrorBoundary.jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Post render failed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <p>Something went wrong loading this content.</p>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```

**2. Wrap the Post page, not the whole app.** Putting it around `<App />` in `main.jsx` means one bad post still takes down the header, footer, and navigation along with it. Wrap it around just the post content inside `Post.jsx` so a broken article fails on its own and the rest of the site — including the link back to the blog list — stays usable.
```jsx
<ErrorBoundary fallback={<p>This post couldn't be displayed. Try the <Link to="/blog">blog index</Link>.</p>}>
  <PostContent post={post} />
</ErrorBoundary>
```

**3. It only catches render, lifecycle, and constructor errors.** An error boundary won't catch a rejected promise in an event handler or a failed `fetch` — those need a regular `try`/`catch`. What it's for is the render-time crash from bad data reaching a component that assumed it would be well-formed.

**4. Reset it when the route changes.** Without a reset, navigating from a broken post to a working one via client-side routing can leave the boundary stuck showing the old fallback, since the component instance persists. Passing `key={slug}` on the boundary (or on `PostContent`) forces React to remount it fresh on every new post.

**5. Log enough to actually find the bad post later.** `componentDidCatch` is where you'd send the error and the current slug to whatever you're already using for visibility — even a `console.error` with the post slug included saves you from reproducing the crash blind when a reader reports "the page is blank."

A boundary doesn't fix the malformed post — it stops one bad file from becoming a site-wide outage while you go fix it.
