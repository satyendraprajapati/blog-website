---
title: "Using Vercel Preview Deployments to Review Blog Changes Before They Go Live"
date: "2026-08-18"
tags: ["web-development", "deployment", "git"]
excerpt: "Every git branch and pull request you push gets its own live, shareable URL on Vercel automatically — here's how to use that to proofread a new post or check a layout change before it hits master."
---

Pushing straight to `master` and watching the production URL is fine for a typo fix. It's a worse habit once you're adding a longer post with an embedded chart, or changing something in `Header.jsx` that touches every page. You want to see the real, deployed result before it's the thing visitors see — and Vercel already builds that for you on every push, whether you've been using it or not.

**1. Every branch gets a Preview Deployment automatically.** Push a branch other than the one connected to production (`master`, per this repo's setup) and Vercel builds and deploys it to its own unique URL — no extra configuration, no separate "staging" environment to maintain.
```bash
git checkout -b post/power-bi-copilot
# ...write the post, commit...
git push -u origin post/power-bi-copilot
```
Within a minute or two, Vercel deploys that branch to something like `blog-website-git-post-power-bi-copilot-yourname.vercel.app`.

**2. Open a pull request and the preview URL shows up right on it.** If the repo has the Vercel GitHub integration connected (which auto-deploy on push already implies), opening a PR from that branch gets a bot comment with the live preview link and the build status — pass or fail — without you leaving GitHub.

**3. The preview is a full, working deployment, not a mockup.** It runs the actual production build (`npm run build`), including `generate-feeds`, so a broken frontmatter field or a Markdown parsing error that would fail the real build fails here too — before it's anywhere near `master`.

**4. Use it to catch what a local `npm run dev` won't.** The Vite dev server is forgiving in ways the production build isn't — different code-splitting, different asset paths, different handling of anything environment-variable-gated. A post that renders fine locally can still reveal a broken image path or a missing meta tag only once it's built and deployed the way production actually will be.

**5. Share the preview link before merging.** Because it's a real URL and not `localhost`, you can send it to anyone — for a personal blog, that might just be pasting it into a note-taking app to proofread on your phone, but the same link works for getting a second pair of eyes on a post before it's public.

**6. Every push to that branch updates the same preview URL.** You don't accumulate a new link per commit — Vercel keeps redeploying the branch's existing preview, so you can refresh the same tab after each fix instead of hunting for the newest deployment.

**7. Clean up by merging or deleting the branch.** Preview deployments for merged or deleted branches eventually get pruned by Vercel on its own, but there's nothing to manually tear down — no separate staging environment holding old post drafts that need remembering.

The workflow this replaces is "push to master, check the live site, fix in a follow-up commit if something's off" — which works, but means every mistake is briefly live. A five-minute branch-and-preview habit costs almost nothing and keeps master, and the real site, always representing a version you've actually looked at.
