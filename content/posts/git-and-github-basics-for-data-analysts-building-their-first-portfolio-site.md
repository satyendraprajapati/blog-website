---
title: "Git and GitHub Basics for Data Analysts Building Their First Portfolio Site"
date: "2026-11-24"
tags: ["web-development", "git", "beginner"]
excerpt: "The small handful of git commands and GitHub concepts a data analyst actually needs to safely build, update, and deploy a personal portfolio site."
---

If you've built a data portfolio site but you're still saving versions by renaming files `portfolio-v2-final.jsx`, git is the tool that replaces that habit — and you need far less of it than a full engineering course implies. This is the minimum set of concepts and commands that covers "make a change, don't lose work, publish it," which is nearly everything a solo portfolio project actually needs.

**1. A git repository is just a tracked history of your project folder.** Running `git init` once in your project turns the folder into a repository, and from then on git can see exactly what changed, line by line, every time you save a snapshot. GitHub is a separate thing — it's a website that hosts a copy of that repository online, so other people (and services like Vercel) can see it too.

**2. Three commands cover almost every normal day of work.**
```
git add .
git commit -m "Add dark mode toggle to header"
git push
```
`git add .` stages every changed file, telling git "these are part of the next snapshot." `git commit` actually takes that snapshot, with a short message describing what changed — write it like a changelog entry, not a diary entry. `git push` sends your committed snapshots up to GitHub, which is also what triggers an auto-deploy on Vercel if your site is connected to the repo.

**3. `git status` is your safety check before and after every change.** Run it before `git add` to see exactly which files you're about to stage, and after a commit to confirm your working folder is "clean" (nothing left uncommitted). Getting in the habit of checking status catches the moment you accidentally almost commit a `.env` file full of API keys, before it ever reaches GitHub.

**4. A `.gitignore` file keeps noise and secrets out of your history.** Create a file named `.gitignore` in your project root listing folders and files git should never track — `node_modules/`, `.env`, `dist/` — one pattern per line. Vite's starter template ships with a sensible default already, but it's worth opening it once to understand what it's excluding and why: `node_modules` is huge and regenerable, and `.env` can contain secrets that should never be pushed to a public repo.

**5. `git log --oneline` shows your history as a readable list, not a wall of text.** When you want to find when you added a feature, or just confirm a push actually went through, `git log --oneline` gives you one line per commit — hash, message, and nothing else — which is far easier to scan than the full default log output.

**6. A branch lets you try something risky without touching your live site.** `git checkout -b redesign-hero-section` creates and switches to a new branch; any commits you make there don't affect your `main` branch (the one Vercel deploys from) until you explicitly merge them back with `git checkout main` followed by `git merge redesign-hero-section`. For a solo portfolio project this is optional rather than essential, but it's the right tool the first time you want to experiment with a layout change you're not sure about.

**7. If you mess up a commit message or want to undo the very last commit, `git commit --amend` and `git reset` exist — but learn them only when you need them.** They're easy to misuse (especially after you've already pushed), and a solo portfolio project rarely needs either. The four commands in point 2 and 3, plus `.gitignore`, get you through the vast majority of real sessions.

None of this requires understanding git's internal object model or memorizing flags — it requires knowing that "stage, commit, push" is the normal loop, `git status` is how you check your work before you commit to it, and `.gitignore` is what keeps your secrets and junk files out of a public GitHub repo in the first place.
