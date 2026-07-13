---
description: Create a new blog post markdown file with frontmatter in content/posts/
---

Create a new blog post file.

1. Ask the user for these three things (if not already given in the invocation):
   - Title
   - Tags (comma-separated list)
   - Excerpt (one-sentence summary)
2. Derive the slug from the title: lowercase, trim, replace spaces/punctuation with hyphens (e.g. "My New Post!" -> "my-new-post").
3. Use today's date in `YYYY-MM-DD` format.
4. Check `content/posts/<slug>.md` doesn't already exist; if it does, ask the user for a different title or confirm overwrite.
5. Create `content/posts/<slug>.md` matching the frontmatter style of `content/posts/my-first-post.md`:

```
---
title: "<title>"
date: "<YYYY-MM-DD>"
tags: ["<tag1>", "<tag2>"]
excerpt: "<excerpt>"
---

<body>
```

   For `<body>`, ask the user whether they want to write the content now or start with a short placeholder paragraph.
6. Report the created file path.
