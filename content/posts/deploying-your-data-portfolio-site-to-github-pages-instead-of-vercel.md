---
title: "Deploying Your Data Portfolio Site to GitHub Pages Instead of Vercel"
date: "2026-08-29"
tags: ["web-development", "deployment", "github-pages"]
excerpt: "How to configure Vite's base path, a GitHub Actions workflow, and a 404.html redirect trick to host a React data portfolio on GitHub Pages for free, as an alternative to Vercel."
---

Vercel is the path of least resistance for a Vite React site, but it isn't the only free option — if you'd rather keep hosting inside GitHub itself, or you're already using GitHub Pages for something else and don't want a second account to manage, it's a genuinely solid alternative. The setup has a couple of GitHub-Pages-specific gotchas that don't come up on Vercel, so it's worth walking through deliberately rather than assuming the same steps apply.

**1. Set the `base` path in `vite.config.js` to match your repo name.** GitHub Pages serves a project site from `username.github.io/repo-name/`, not the domain root, so every asset reference needs that subpath baked in at build time or your CSS and JS will 404 once deployed.
```js
export default defineConfig({
  base: "/blog-website/",
  plugins: [react()],
});
```
Skip this step and the site *looks* fine locally, then loads a blank page with broken asset links the moment it's live — a mismatch that's confusing to debug if you don't already know to check `base`.

**2. Add a GitHub Actions workflow that builds and deploys on push.** GitHub Pages can deploy from a static `/docs` folder, but for a Vite project it's cleaner to let Actions run the real build and publish the output automatically.
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [master]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

**3. Enable Pages with "GitHub Actions" as the source, not a branch.** Under the repo's *Settings → Pages*, set *Source* to *GitHub Actions* rather than *Deploy from a branch*. The branch option expects pre-built static files sitting in the repo; since your build step runs in the workflow, the Actions source is what actually picks up the `dist` output.

**4. Fix client-side routing with the `404.html` redirect trick.** Unlike Vercel, GitHub Pages has no rewrite-rules config — it's a plain static file server, so a direct visit to `/blog/some-post` returns a real 404 instead of handing control to React Router. The standard workaround is to copy your built `index.html` to `404.html` as part of the build; GitHub Pages serves that file for any unknown path, and once it loads, React Router takes over and renders the correct route client-side.
```json
"scripts": {
  "build": "vite build && generate-feeds && cp dist/index.html dist/404.html"
}
```

**5. Double-check any absolute URLs your SEO tags rely on.** Sitemap entries, canonical URLs, and Open Graph tags that were hardcoded against a Vercel domain need to point at `https://username.github.io/repo-name/` instead — easy to miss since the site still renders correctly even when these are wrong, and the breakage only shows up later in search results or link previews.

**6. Confirm the deploy is actually live at the subpath, not just that the Action succeeded.** A green checkmark on the workflow only means the build didn't error — visit the real `username.github.io/repo-name/` URL afterward and click into a few inner routes directly (not just via in-app links) to confirm both the `base` path and the 404 redirect are working together correctly.

Once this is wired up, the workflow is the same convenience Vercel offers — push to your default branch and the live site updates on its own — just running entirely inside GitHub rather than a connected third-party service.
