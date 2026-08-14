---
title: "Setting Up ESLint and Prettier in Your Vite + React Blog for Consistent, Error-Free Code"
date: "2026-08-14"
tags: ["react", "vite", "tooling"]
excerpt: "How to add linting and auto-formatting to a Vite + React blog so style nitpicks and common bugs get caught before you commit."
---

Once a personal blog project grows past a handful of components, small inconsistencies start piling up — a missing `key` prop here, mixed quote styles there, an unused import nobody noticed. None of that needs a human to catch it. ESLint catches actual mistakes, Prettier handles formatting, and together they mean every file looks like it was written in one sitting even if it was written over six months.

**1. Understand the split between the two tools.** ESLint checks your code for *problems* — an unused variable, a missing dependency in a `useEffect`, a component that isn't returning valid JSX. Prettier only handles *formatting* — quote style, indentation, line length. Running both is normal; running only one leaves a gap, since ESLint mostly won't fight you about formatting and Prettier has no idea what a React hook rule is.

**2. Install both, plus the glue packages.** Vite's React template already ships a basic ESLint config, so you're mostly adding Prettier and the packages that stop the two from disagreeing with each other:
```bash
npm install -D prettier eslint-config-prettier
```
`eslint-config-prettier` turns off any ESLint formatting rules that would otherwise conflict with Prettier's opinions — without it, you'll get contradictory warnings on the same line.

**3. Add a Prettier config instead of relying on defaults.** A `.prettierrc` file, even a short one, keeps formatting decisions explicit and versioned instead of silently depending on whatever defaults ship with whatever Prettier version happens to be installed:
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

**4. Extend your ESLint config with the Prettier override, last.** In `eslint.config.js` (the flat config format Vite's template uses), add `eslint-config-prettier` at the end of your config array so it overrides earlier formatting-related rules rather than the other way around:
```javascript
import prettier from 'eslint-config-prettier'

export default [
  // ...your existing config blocks
  prettier,
]
```

**5. Add `.eslintignore`-equivalent excludes for generated output.** A blog project has folders — `dist/`, `public/rss.xml`, `public/sitemap.xml` — that don't need linting or formatting and will only produce noisy, meaningless errors if scanned. In flat config, add an `ignores` entry rather than a separate ignore file:
```javascript
export default [
  { ignores: ['dist/**', 'public/sitemap.xml', 'public/rss.xml'] },
  // ...rest of config
]
```

**6. Wire up npm scripts so both tools are one command away.** Checking manually every time is how linting habits die. Add these to `package.json`:
```json
{
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

**7. Run format before lint in your workflow, not after.** Prettier fixes whitespace and quote issues instantly; running it first means ESLint's report only shows the problems that actually need a decision, instead of being cluttered with formatting complaints Prettier would have resolved anyway.

**8. Let your CI check catch what you forget locally.** If you already have a GitHub Actions build check, add `npm run lint` as a step alongside the build — a red check on a pull request is a much cheaper place to catch a stray unused import than noticing it in production three weeks later.

None of this makes the blog faster or prettier for readers — it's entirely for future-you, who'll thank present-you the next time a six-month-old component needs a quick edit and doesn't require a five-minute detour to remember what style the rest of the file uses.
