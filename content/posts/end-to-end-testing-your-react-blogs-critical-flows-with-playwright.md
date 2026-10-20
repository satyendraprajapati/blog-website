---
title: "End-to-End Testing Your React Blog's Critical Flows with Playwright"
date: "2026-10-20"
tags: ["web-development", "testing", "playwright"]
excerpt: "How to add Playwright end-to-end tests that click through your React blog's real user flows instead of only unit-testing components in isolation."
---

Unit tests for your frontmatter parser catch a bad date field. Component tests with React Testing Library catch a PostCard that renders the wrong title. Neither one tells you whether a real visitor can actually land on your homepage, click into a post, and toggle dark mode without the page breaking — that's what end-to-end (E2E) testing with Playwright covers, by driving a real browser against your built site.

**1. Install Playwright and let it set itself up.** From your project root:
```bash
npm init playwright@latest
```
This adds `@playwright/test`, a `playwright.config.ts`, and an example test. Point the config's `webServer` option at your Vite preview command so Playwright builds and serves the site itself before running tests:
```javascript
// playwright.config.ts
export default defineConfig({
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: 'http://localhost:4173' },
});
```

**2. Test the flow a reader actually takes, not the component in isolation.** A good first E2E test clicks from the homepage into a post and checks the right content loaded:
```javascript
import { test, expect } from '@playwright/test';

test('homepage links into a post', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /5 excel formulas/i }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Excel Formulas');
});
```
This catches the kind of bug a unit test structurally can't: a routing misconfiguration, a build step that drops a post, or a link whose `href` doesn't match the slug React Router expects.

**3. Cover the stateful stuff — theme toggle, search, saved posts.** These are the features most likely to break silently because they depend on browser APIs (`localStorage`, `matchMedia`) that unit tests often mock away entirely.
```javascript
test('theme toggle persists after reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /toggle theme/i }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
```

**4. Run it against the production build, not the dev server.** Testing `npm run dev` hides bugs that only show up after Vite's build step — a lazy-loaded chunk that 404s, an asset path that's wrong in production, a prerendered route that doesn't match the client-rendered one. Pointing `webServer` at `build` + `preview`, as above, is what makes the test meaningful.

**5. Wire it into CI alongside your existing checks.** If you already have a GitHub Actions workflow running your build, add a step that runs `npx playwright test` after it. Playwright's own GitHub Action handles installing browser binaries in CI, so you don't need to manage that separately from your existing lint and unit-test steps.

E2E tests are slower than unit tests and shouldn't replace them — keep testing the markdown parser and individual components the way you already do. Playwright's job is narrower and complementary: proving the handful of flows a real visitor depends on actually survive a production build, end to end, before you find out from a broken link in production instead.
