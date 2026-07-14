---
title: "Build a Data Portfolio Website with React, Vite, and Tailwind CSS"
date: "2026-07-14"
tags: ["web-development", "react", "portfolio", "beginner"]
excerpt: "A beginner-friendly stack for putting your data analysis projects online without needing a backend."
---

A GitHub repo full of notebooks is a great start, but a simple website makes your work skimmable — someone can see what you built and why in thirty seconds instead of cloning a repo and reading code. You don't need a backend or a CMS to do this well.

**1. Scaffold with Vite, not Create React App.** `npm create vite@latest my-portfolio -- --template react` gives you a working React app in seconds, with a dev server that reloads instantly as you edit — far snappier than older tooling.

**2. Style with Tailwind CSS instead of separate stylesheets.** Utility classes like `flex`, `gap-4`, and `text-lg` live directly on your components, so you're not context-switching between a `.jsx` file and a `.css` file for every small style change — a real advantage when you're still learning both.

**3. Store content as Markdown, not in a database.** Each project write-up or blog post is just a `.md` file with frontmatter (title, date, tags) parsed at build time with a library like `gray-matter`. No database to set up, and every post is reviewable in a normal git diff.

**4. Route pages with React Router.** A handful of routes — `/`, `/projects`, `/projects/:slug`, `/about` — covers most portfolio sites. Dynamic routes like `/projects/:slug` let one `ProjectDetail` component render every case study from its Markdown file.

**5. Deploy for free with Vercel or Netlify.** Connect the GitHub repo, and every push to your main branch triggers a new deploy automatically — no server to manage, no manual upload step.

The whole stack is intentionally boring: React, Tailwind, Markdown, and a free host. That's the point — the tooling should stay out of the way of actually publishing your analysis work.
