---
title: "Adding Comments to Your React Blog with Giscus (GitHub Discussions)"
date: "2026-07-31"
tags: ["web-development", "react", "comments"]
excerpt: "How to add a comment section to a static Markdown blog using Giscus, which stores every comment as a GitHub Discussion instead of needing a database or moderation backend."
---

A static Vite/React blog has no database to store comments in, and standing one up just to let readers leave feedback is a lot of infrastructure for a personal site. Giscus sidesteps that entirely — it stores comments as GitHub Discussions on a repo you already own, and readers sign in with a GitHub account instead of you building an auth system.

**1. Turn on Discussions for the repo backing your comments.** In your GitHub repo, go to *Settings → General → Features* and check *Discussions*. Giscus needs somewhere to create a thread per post, and Discussions is what it uses instead of a custom database.

**2. Install the giscus GitHub App on that repo.** Visit github.com/apps/giscus and install it, scoped to the specific repository you just enabled Discussions on. Without this, Giscus can read public discussion data but can't create new threads or post comments on a reader's behalf.

**3. Generate your config at giscus.app instead of guessing the settings.** The giscus.app site walks you through picking your repo, a mapping strategy for matching pages to discussion threads, and a discussion category, then spits out the exact `data-*` attributes you need. Use `pathname` as the mapping strategy — it creates one discussion thread per URL path automatically, which lines up with one thread per blog post slug.

**4. Wrap the generated script tag in a small React component.** Giscus ships as a `<script>` tag, so drop it into a component that injects it after mount instead of pasting raw HTML into JSX:
```jsx
import { useEffect, useRef } from "react";

export default function Comments() {
  const ref = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", "yourname/blog-website");
    script.setAttribute("data-repo-id", "YOUR_REPO_ID");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "YOUR_CATEGORY_ID");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-theme", "preferred_color_scheme");
    ref.current.appendChild(script);
  }, []);

  return <div ref={ref} />;
}
```

**5. Render `<Comments />` at the bottom of your Post page, not the Blog listing.** It belongs on `src/pages/Post.jsx`, after the rendered Markdown body, so each individual post gets its own thread. Adding it to the listing page would mount one Giscus instance per visible post card, which is both wasteful and not what `pathname` mapping expects.

**6. Match `data-theme` to your existing dark/light toggle.** `"preferred_color_scheme"` follows the visitor's OS setting by default, which will look mismatched the moment they use your site's own theme toggle instead. Pass your app's current theme value into the component and re-set `data-theme` on it when the toggle changes, so the comment widget switches along with the rest of the page.

**7. Moderate through GitHub, not a custom dashboard.** Spam or off-topic comments show up as ordinary GitHub Discussion comments on your repo — delete, lock, or hide them the same way you'd moderate an issue thread. There's no separate moderation panel to learn, which is most of the appeal of storing comments this way in the first place.

The trade-off is real: readers without a GitHub account can't comment, and that's a smaller pool than a fully open comment box would reach. For a data-analysis blog whose readers are mostly other analysts and developers already on GitHub, that trade-off usually pays for itself in zero moderation overhead and zero new infrastructure.
