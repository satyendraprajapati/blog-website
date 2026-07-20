---
title: "How to Deploy a Static Data Portfolio Site for Free with Vercel"
date: "2026-07-20"
tags: ["web-development", "deployment", "beginner"]
excerpt: "Getting a React portfolio site live and auto-deploying from GitHub takes about five minutes on Vercel's free tier — here's the process end to end."
---

Building the site is only half the job — it isn't a portfolio until someone else can open a link and see it. The good news is that for a static React app, going from "working locally" to "live on the internet with a custom domain" is a genuinely short process, and it costs nothing.

**1. Push the project to GitHub first.** Vercel deploys by connecting to a Git repository, not by uploading a folder, so the project needs to live in a GitHub repo before anything else. Commit your work and push it to a repo you own — Vercel will need read access to it in the next step.

**2. Sign up to Vercel with your GitHub account.** Using the "Continue with GitHub" option instead of a separate email/password account saves a step later, since Vercel needs a GitHub connection anyway to detect pushes.

**3. Import the repo and let Vercel auto-detect the framework.** From the Vercel dashboard, *Add New → Project*, then select your repo. For a Vite-based React app, Vercel auto-detects the build command (`npm run build`) and output directory (`dist`) — you shouldn't need to configure anything manually unless your project deviates from the defaults.

**4. Check the build command matches what actually runs locally.** If your `package.json` build script does more than just bundle — for example, this project's `npm run build` also regenerates `sitemap.xml` and `rss.xml` via a `generate-feeds` step — confirm that full script is what's wired into the Vercel build, not just a bare `vite build`. A mismatch here means the live site silently drifts from what you test locally.

**5. Deploy, then verify the live site, not just the build log.** A green checkmark in the Vercel dashboard means the build didn't error — it doesn't guarantee routing works. Click through to the deployed URL and manually test client-side routes (like `/blog/some-post`) by navigating to them *directly*, not just by clicking links within the app, since that's where routing configuration issues actually show up.

**6. Add a rewrite rule if direct URLs to inner routes 404.** React Router handles routing entirely in the browser, but if a user loads `/blog/my-post` directly, Vercel's server doesn't know that route exists — it needs to be told to serve `index.html` for everything and let React Router take over from there. Add a `vercel.json` in your project root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**7. Confirm auto-deploy is wired to your default branch.** Under the project's *Settings → Git*, check that pushes to your main branch trigger a new production deployment automatically. This is Vercel's default behavior, but it's worth confirming once so you're not left wondering why a pushed fix hasn't shown up live.

**8. Add a custom domain once the basics work, not before.** A custom domain is a nice-to-have layered on top of a working deployment — Vercel's free `*.vercel.app` subdomain is a perfectly legitimate permanent URL for a portfolio site, so don't let domain shopping block actually shipping the thing.

From here, every `git push` to your main branch is a new production deployment with zero manual steps — which is the entire point of hosting a static portfolio this way instead of manually uploading files somewhere.
