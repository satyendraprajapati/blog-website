---
title: "Environment Variables in Vite: Keeping API Keys Out of Your React Blog's Source Code"
date: "2026-08-08"
tags: ["web-development", "vite", "security"]
excerpt: "If you've wired up Formspree, Buttondown, or a Power BI embed link by pasting the key straight into a component, here's how to move it into an environment variable instead — and why a public key still isn't a secret."
---

Once a blog has a contact form, a newsletter signup, or an embedded dashboard, it usually has at least one key or endpoint URL wired into the code. Pasting it directly into a component works, but it means the value is committed to Git history forever, and changing it between your local setup and production means editing source code. Vite has a built-in environment variable system that solves both problems.

**1. Create a `.env` file at the project root.** Vite reads `.env`, `.env.local`, `.env.production`, and similar files automatically — no extra package needed. For values used across environments, `.env.local` is the right choice since Vite's default `.gitignore` (from `npm create vite`) already excludes `*.local` files from Git.

**2. Prefix every variable you want exposed to the browser with `VITE_`.** This is the one rule that trips people up: Vite only exposes variables prefixed `VITE_` to your client-side code, deliberately, so you don't accidentally ship a real secret to every visitor's browser.
```
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/abc123
VITE_PLAUSIBLE_DOMAIN=yourblog.com
```

**3. Read them with `import.meta.env` instead of `process.env`.** Vite doesn't use Node's `process.env` at runtime — it replaces `import.meta.env.VITE_*` references at build time.
```jsx
const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;

fetch(endpoint, {
  method: "POST",
  body: formData,
});
```

**4. Confirm your `.gitignore` actually excludes the file.** Run `git status` after adding `.env.local` — if it shows up as an untracked file ready to add, stop and check your `.gitignore` before committing anything. A key that's already been pushed to a public GitHub repo should be treated as compromised and rotated, not just deleted from a later commit.

**5. Set the same variables in your Vercel project settings for production.** A local `.env.local` file never gets deployed — Vercel builds from your Git repo, so it won't see it. Add each `VITE_`-prefixed variable under Project → Settings → Environment Variables in the Vercel dashboard, then redeploy so the build picks them up.

**6. Understand what this does and doesn't protect.** Because your blog is a static, client-side site, anything with a `VITE_` prefix ends up in the built JavaScript bundle and is visible to anyone who opens dev tools — this isn't hiding a secret, it's keeping a value out of source control and easy to change per environment. Formspree endpoints and Plausible domains are fine to expose this way since they're meant to be public. A real secret — a private API token that can write or delete data — has no business in a client-side app at all; that belongs behind a serverless function (like a Vercel API route) that keeps the token server-side and only ever returns the result to the browser.

The practical win isn't secrecy, it's not having to hunt through components to change a Formspree ID or swap a Plausible domain when you fork the project or move to a new environment.
