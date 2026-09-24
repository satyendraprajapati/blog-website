---
title: "Adding Pre-Commit Hooks with Husky and lint-staged to Catch Lint Errors Before They're Committed"
date: "2026-09-24"
tags: ["web-development", "tooling", "git"]
excerpt: "ESLint and a GitHub Actions check both catch problems after the fact — a pre-commit hook with Husky and lint-staged stops a lint error from ever reaching a commit in the first place."
---

Running ESLint and Prettier locally only helps if you remember to run them, and a CI check only tells you something's wrong after you've already pushed. A pre-commit hook closes that gap: it runs automatically the moment you type `git commit`, and blocks the commit outright if linting fails. Husky manages the Git hook, and lint-staged makes sure it only checks the files you actually changed instead of the whole repo.

**1. Install both as dev dependencies.** Neither needs to ship to production, so they belong in `devDependencies` alongside ESLint and Prettier:

```bash
npm install --save-dev husky lint-staged
```

**2. Initialize Husky**, which creates a `.husky/` folder and wires Git to run scripts from it:

```bash
npx husky init
```

This generates a `.husky/pre-commit` file with a default `npm test` line — replace that with the lint-staged command, since running your full test suite on every commit is usually more friction than it's worth:

```bash
npx lint-staged
```

**3. Tell lint-staged what to run and on which files** with a `lint-staged` block in `package.json`. This is the piece that keeps the hook fast — it only touches files that are actually staged for the commit, not your entire `content/posts/` folder or `src/` tree:

```json
{
  "lint-staged": {
    "*.{js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md,json}": ["prettier --write"]
  }
}
```

`--fix` and `--write` matter here: instead of just failing and telling you what's wrong, both tools correct what they can automatically and re-stage the fixed version, so a missing semicolon or inconsistent quote style never even becomes a discussion.

**4. Commit as normal and watch the hook run.** The first commit after setup will show ESLint and Prettier output directly in your terminal before the commit completes:

```bash
git add src/components/PostCard.jsx
git commit -m "Fix post card layout"
```

If a real lint error survives `--fix` — an unused variable, a broken hook dependency array — the commit is rejected with the error printed, and nothing lands in history until you fix it.

**5. Commit `.husky/` to the repo so the hook works for anyone else who clones it.** Husky's `init` script also adds a `prepare` script to `package.json` that re-installs the hooks automatically after `npm install`, so a fresh clone gets the same protection without a manual setup step.

**6. Keep the hook narrow on purpose.** It's tempting to add a full `npm run build` or the entire test suite to `pre-commit`, but a slow hook is a hook people start skipping with `--no-verify`. Leave the heavier checks — a full build, a broken-link scan, the GitHub Actions workflow — for CI, and let the pre-commit hook do only what's fast enough to feel invisible: lint and format the handful of files you just touched.

Between this and a CI check on push, a broken lint rule or a formatting inconsistency now has two separate chances to get caught before it's anywhere near production — one that's nearly instant, and one that's a safety net for the rare case someone bypasses the first.
