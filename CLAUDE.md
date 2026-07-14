# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

Scaffolded and deployed. Live at https://blog-website-navy-one.vercel.app (Vercel, connected to
this GitHub repo for auto-deploys on push to `master`).

Implemented: Home, Blog, Post, Tag, Services, Portfolio/ProjectDetail, About, Contact, 404;
dark/light theme toggle; SEO meta tags; sitemap.xml/rss.xml/robots.txt generation (`npm run
generate-feeds`, wired into `npm run build`); code syntax highlighting; reading time; a
`/newpost` slash command for adding blog posts.

Portfolio case studies in `content/projects/` are placeholder/illustrative — replace with real
project write-ups before using the site with actual clients.

## Goal

A personal blogging website (data-analysis focused), built beginner-friendly.

## Tech Stack

| Part | Choice | Why |
|---|---|---|
| Framework | React (Vite) | Fastest/simplest React setup, minimal config, beginner-friendly |
| Routing | React Router | Navigate between Home, Blog, Post, About, etc. |
| Styling | Tailwind CSS | Class-based styling, no separate CSS files to manage |
| Content | Markdown files + `gray-matter` (frontmatter parsing) + `react-markdown` (rendering) | Each blog post is a `.md` file — no database/CMS needed |
| Hosting | Vercel / Netlify (free tier) | Push to GitHub → auto-deploy |

**Known trade-off:** Plain React (Vite) is client-side rendered — no built-in SEO/server-rendering like Next.js. Fine for personal/portfolio use; if Google search traffic matters later, consider migrating to Next.js or Astro.

## Pages

1. Home — intro + latest posts
2. Blog listing — all posts, tag filter
3. Single Post page (`/blog/:slug`)
4. Tag/Category archive page
5. About
6. Contact
7. 404 page

## Features

**V1 (launch):**
- Markdown-based posts
- Responsive design
- SEO basics — meta tags, sitemap.xml, robots.txt
- Code syntax highlighting
- Reading time estimate
- Dark/light mode toggle
- RSS feed

**V2 (later):**
- Comments (Giscus — GitHub Discussions based, free, no backend)
- Newsletter signup (e.g. Buttondown free tier)
- Search (client-side, e.g. FlexSearch)
- Analytics (Plausible or Google Analytics)
- Related posts suggestion

## Folder Structure (React + Vite)

```
blog-website/
├── public/
│   └── images/
├── content/
│   └── posts/
│       ├── my-first-post.md
│       └── another-post.md
├── src/
│   ├── main.jsx
│   ├── App.jsx                → Routes setup (React Router)
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Blog.jsx           → listing page
│   │   ├── Post.jsx           → single post (dynamic route /blog/:slug)
│   │   ├── Tag.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── NotFound.jsx
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── PostCard.jsx
│   │   └── ThemeToggle.jsx
│   ├── lib/
│   │   └── posts.js           → markdown read/parse helper
│   └── index.css              → Tailwind imports
├── tailwind.config.js
├── vite.config.js
├── package.json
└── CLAUDE.md
```
