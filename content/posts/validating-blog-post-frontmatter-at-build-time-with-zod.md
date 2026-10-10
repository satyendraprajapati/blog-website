---
title: "Validating Blog Post Frontmatter at Build Time with Zod"
date: "2026-10-10"
tags: ["web-development", "react", "vite"]
excerpt: "Using a Zod schema in a build-time script to catch a missing title, bad date, or malformed tags array before a broken post ever reaches production."
---

`import.meta.glob` loads every Markdown file in `content/posts/` automatically, which is great right up until one of them has a typo'd frontmatter key, a `date` written as `10/10/2026` instead of `2026-10-10`, or `tags` left as a bare string instead of an array. None of that throws an error — it just produces a post card with `undefined` where the date should be, or a tag filter that silently breaks on one specific post. A Zod schema checked at build time turns that into a loud failure instead of a quiet one.

**1. Install Zod as a dev dependency.** It only runs in your build script, never shipped to the browser, so it doesn't add anything to your bundle size:
```bash
npm install -D zod
```

**2. Define the shape every post's frontmatter is supposed to match.** This is the same fields your `lib/posts.js` already assumes exist — writing them down as a schema just makes that assumption explicit and enforced:
```js
import { z } from "zod";

const postFrontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  tags: z.array(z.string()).min(1),
  excerpt: z.string().min(1),
  draft: z.boolean().optional(),
});
```

**3. Run the schema against every post in a standalone script, not inside a component.** A React component that throws mid-render on bad data crashes the page a visitor is looking at; a script that runs before the build fails the build instead, which is a far better place for this particular error to surface:
```js
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content/posts");
const errors = [];

for (const file of fs.readdirSync(postsDir)) {
  const { data } = matter.read(path.join(postsDir, file));
  const result = postFrontmatterSchema.safeParse(data);
  if (!result.success) {
    errors.push(`${file}: ${result.error.issues.map((i) => i.message).join(", ")}`);
  }
}

if (errors.length) {
  console.error("Invalid post frontmatter:\n" + errors.join("\n"));
  process.exit(1);
}
```

**4. Wire it into `npm run build` ahead of the actual build step.** Add it as its own script and chain it with `&&` so a validation failure stops the build before Vite even starts bundling:
```json
"scripts": {
  "validate-posts": "node scripts/validate-posts.js",
  "build": "npm run validate-posts && npm run generate-feeds && vite build"
}
```

**5. Let the error message name the file and the exact field, not just "something's wrong."** Zod's `safeParse` gives you a structured list of issues with the field path included — surface that instead of a generic failure, so the fix is "open this one file and fix this one field" rather than a guessing game across three hundred posts.

**6. Treat a strict schema as a design decision, not a default.** Making `tags` required with at least one entry, or rejecting a `date` that doesn't match `YYYY-MM-DD`, are both choices about what counts as a valid post on your site — adjust the schema to match what your own pages actually require, rather than copying constraints that don't apply to your content.

The failure mode this replaces — a bad post shipping silently and showing up broken days later — is exactly the kind of thing a thirty-line script run on every build is built to catch for free.
