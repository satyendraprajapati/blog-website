---
title: "Testing Your React Blog's Components with Vitest and React Testing Library"
date: "2026-09-28"
tags: ["web-development", "testing", "react-testing-library"]
excerpt: "Unit-testing the parsing logic behind a Markdown blog catches bad data, but it won't catch a component that renders the wrong thing — here's how to test components directly with React Testing Library."
---

Testing the functions that parse frontmatter and compute reading time catches bad data before it ships, but it doesn't catch a different class of bug: a component that renders the wrong thing even when the data it's given is perfectly valid. A `PostCard` that silently drops the tag list when a post has only one tag, or a theme toggle button that doesn't update its accessible label after a click, won't show up in a `posts.js` unit test — you have to render the component and check what actually comes out.

**1. Add React Testing Library on top of Vitest rather than reaching for a browser-automation tool.** It renders components into a lightweight in-memory DOM (via `jsdom`) and lets you query them the way a user would — by visible text or role — which is enough for most blog components and far faster than spinning up a real browser.

```bash
npm install -D @testing-library/react @testing-library/jest-dom jsdom
```

Point Vitest at the `jsdom` environment in `vite.config.js`:

```js
export default defineConfig({
  // ...existing config
  test: {
    environment: 'jsdom',
  },
})
```

**2. Query by what a user would see, not by implementation details like class names.** `getByRole` and `getByText` fail when the visible output changes, which is what you want; a query tied to a specific `className` fails just as often when someone reorganizes the Tailwind classes for no functional reason.

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PostCard from '../src/components/PostCard'

const post = {
  title: 'Understanding Correlation vs Causation',
  slug: 'correlation-vs-causation-for-data-analysts',
  date: '2026-01-10',
  tags: ['data-analysis', 'statistics'],
  excerpt: 'Why a strong correlation is not evidence of a cause.',
}

describe('PostCard', () => {
  it('renders the post title as a link to its slug', () => {
    render(<PostCard post={post} />)
    const link = screen.getByRole('link', { name: post.title })
    expect(link).toHaveAttribute('href', `/blog/${post.slug}`)
  })
})
```

**3. Test the interactive components, not just the ones that render static content.** `ThemeToggle` is the highest-value target in a typical blog — it has state, a click handler, and a visible effect, which is exactly the combination a rendering-only test can't cover. `fireEvent` (or `userEvent` for more realistic input) simulates the click and lets you assert the result.

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from '../src/components/ThemeToggle'

it('switches the accessible label after a click', () => {
  render(<ThemeToggle />)
  const button = screen.getByRole('button')
  const before = button.getAttribute('aria-label')
  fireEvent.click(button)
  expect(button.getAttribute('aria-label')).not.toBe(before)
})
```

**4. Test the edge case in the data, not just the typical post.** A `PostCard` for a post with one tag, zero tags, or a very long title is where layout code actually breaks — feed the component that data directly instead of hoping a real post eventually exercises it.

**5. Wrap components that use `<Link>` in a router, or the test fails on an error that has nothing to do with your component.** React Router's `Link` throws outside a router context, so tests for anything containing one need a `MemoryRouter` wrapper:

```jsx
import { MemoryRouter } from 'react-router-dom'

render(
  <MemoryRouter>
    <PostCard post={post} />
  </MemoryRouter>
)
```

**6. Keep these tests separate from the `posts.js` unit tests in your head, even if they live in the same `npm run test` command.** Parsing tests catch bad data; component tests catch a component misrendering data that was never bad to begin with. Skipping one because the other is green leaves an entire category of bug — the UI bug — uncaught.

Component tests are slower to write than the pure-function tests in `posts.js`, so they're worth reserving for the handful of components with actual logic — a toggle, a filter, a card with conditional rendering — rather than snapshotting every presentational component in the app.
