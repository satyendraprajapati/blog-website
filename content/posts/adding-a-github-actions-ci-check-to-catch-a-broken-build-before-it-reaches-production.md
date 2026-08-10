---
title: "Adding a GitHub Actions CI Check to Catch a Broken Build Before It Reaches Production"
date: "2026-08-10"
tags: ["web-development", "ci-cd", "github-actions"]
excerpt: "How to add a GitHub Actions workflow that runs your build on every push, so a typo in a Markdown post or a broken import fails a check instead of breaking the live site."
---

Pushing straight to `master` with Vercel auto-deploying on every commit is simple, but it means the first place a broken build shows up is production — a blank white page where your portfolio used to be, discovered whenever you or a visitor next loads the site. A GitHub Actions workflow that runs `npm run build` on every push closes that gap: it fails loudly on GitHub before Vercel ever gets a broken commit to deploy.

**1. Add a workflow file under `.github/workflows/`.** GitHub Actions looks for YAML files in this folder automatically — no separate setup step or account connection needed beyond having the repo on GitHub. Create `.github/workflows/build-check.yml`:
```yaml
name: Build Check

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - run: npm ci
      - run: npm run build
```

**2. Use `npm ci`, not `npm install`, in the workflow.** `npm ci` installs exactly what's locked in `package-lock.json` and fails outright if the lockfile is out of sync with `package.json`, instead of silently resolving new versions the way `npm install` can. That's the behavior you want in CI — a build that passes here should mean the same dependency versions Vercel installs when it deploys.

**3. Let it run on pull requests too, not just pushes to master.** The `pull_request` trigger means that if you ever branch instead of committing straight to `master`, the check runs and reports pass/fail directly on the PR before you merge — catching the broken build a step earlier than a push-only workflow would.

**4. Check the Actions tab after your next push to confirm it's running.** GitHub shows a small status icon (a yellow dot while running, a green check or red X once done) next to each commit, and the full log is under the repo's *Actions* tab. Push a trivial change first to confirm the workflow triggers and completes, rather than discovering a YAML typo the same day you actually break the build.

**5. Treat a red X as a stop sign, since Vercel will still try to deploy anyway.** This workflow doesn't block Vercel's own deploy — the two systems run independently unless you separately configure branch protection to require the check before merging. On a solo repo pushing directly to `master`, that means the value is the fast, loud signal on GitHub, not an automatic block; check the Actions tab (or watch for GitHub's email on workflow failure) before assuming a push went out clean.

**6. Extend the same job with a lint step once the build check is solid.** Once `npm run build` is reliably green, add `npm run lint` as another step in the same job if the project has ESLint configured — same pattern, same workflow file, one more line. Resist adding a full test suite step until there are tests worth running; an empty test command that always exits 0 doesn't catch anything and just adds a misleading green checkmark.

Five lines of YAML turns "did I break the build?" from a question you answer by refreshing the live site into one GitHub answers for you on every push.
