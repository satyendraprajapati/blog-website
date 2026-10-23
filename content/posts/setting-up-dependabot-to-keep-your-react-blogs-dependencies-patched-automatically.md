---
title: "Setting Up Dependabot to Keep Your React Blog's Dependencies Patched Automatically"
date: "2026-10-23"
tags: ["web-development", "ci-cd", "security"]
excerpt: "A GitHub-native config that opens a pull request whenever one of your blog's npm dependencies has a security fix or version bump, so you're not the one who has to remember to check."
---

A personal blog repo is the kind of project you touch in bursts — a new post, a small feature, then weeks of nothing. In that gap, a dependency can pick up a security advisory and just sit there, because nothing prompts you to go check `npm outdated` on a project you're not actively working in. Dependabot is a GitHub-native bot that checks for you on a schedule and opens a pull request when there's something to update, patch included.

**1. Add a config file, not an app install.** Dependabot works off a YAML file in the repo — no separate account or integration to connect. Create `.github/dependabot.yml`:
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
```
Commit and push it, and GitHub picks it up on its next scan — no further setup needed for a public repo.

**2. Separate security updates from routine version bumps mentally, even though one file handles both.** Dependabot opens PRs for two different reasons: a package has a known vulnerability (these show up with a security advisory link in the PR description), or a package just has a newer version available. Treat the first kind as something to review promptly; the second kind can wait for a convenient moment, since a minor version bump on a blog with no users depending on API stability is low-stakes.

**3. Let your existing build-check workflow do the reviewing for you.** If the repo already has a GitHub Actions workflow that runs `npm ci && npm run build` on every PR, every Dependabot PR gets that same check for free — a version bump that breaks the build shows up as a red X on the PR itself, before you've even opened it, instead of after you've merged and Vercel has already tried to deploy it.

**4. Scope `open-pull-requests-limit` down for a small repo.** The default without this setting can open a surprising number of PRs the first time it runs against a project that hasn't been updated in a while. Five is plenty for a blog's dependency tree — enough to work through steadily without burying the PR list.

**5. Merge the build-passing ones and don't let the rest pile up.** A Dependabot PR that passes CI and only bumps a patch or minor version is almost always safe to merge without reading the changelog line by line. Where this actually pays off is the PR you'd otherwise never have gotten: a security patch for a dependency you haven't thought about since you installed it, delivered to you instead of waiting for you to remember to ask.

**6. Narrow `directory` if the blog isn't at the repo root.** A monorepo-style setup, or a project nested under a subfolder, needs that path instead of `/` — otherwise Dependabot scans the wrong `package.json` and never finds anything to update.

The point isn't that a blog's dependencies are high-risk — it's that nobody checks a project that only gets touched once a month, and a five-line config file is cheaper than being the reason a known vulnerability sat unpatched for six months because no one happened to look.
