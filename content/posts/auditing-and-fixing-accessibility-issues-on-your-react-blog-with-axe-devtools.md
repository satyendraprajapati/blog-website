---
title: "Auditing and Fixing Accessibility Issues on Your React Blog with axe DevTools"
date: "2026-08-20"
tags: ["web-development", "accessibility", "react"]
excerpt: "How to run a free browser-based accessibility audit on a Markdown-driven React blog and fix the handful of issues that actually show up in practice."
---

A blog that renders cleanly and looks good in both themes can still be genuinely hard to use for someone on a screen reader or navigating by keyboard. Unlike a broken build, accessibility problems don't throw an error — nothing fails, nothing looks wrong on screen, and they quietly sit there until someone who relies on assistive tech hits them. A free browser extension can surface most of the common ones in a couple of minutes.

**1. Install axe DevTools and run it on a real page, not a blank one.** The axe DevTools extension (Chrome and Firefox) adds a panel to your browser's dev tools. Open a live blog post — one with a code block, an image, and a few headings — and click "Scan All of My Page." It reports issues by severity, with a plain-English description and the exact element that failed.

**2. Fix missing alt text on chart images first.** This is the single most common finding on a data-analysis blog: a pasted Excel or Power BI screenshot with no `alt` attribute, or worse, a generic one like `alt="image"` that tells a screen reader nothing useful. Write alt text that describes what the chart actually shows, not that it's a chart:
```jsx
<img
  src="/images/regional-revenue-chart.png"
  alt="Bar chart showing West region revenue up 12% quarter over quarter, ahead of all other regions"
/>
```

**3. Check your color contrast in both themes, not just one.** axe flags text/background combinations that fall below WCAG's minimum contrast ratio — a common trap for a custom dark-mode palette where a muted gray body text reads fine to sighted eyes but fails the actual ratio check. Run the scan once in light mode and once in dark mode; a theme toggle means you effectively ship two designs; both need to pass.

**4. Add a skip-to-content link for keyboard users.** Without one, a visitor tabbing through the page has to cycle through the entire header and nav before reaching the actual post — tedious on every single page load. A skip link, visually hidden until it receives focus, fixes this with a few lines in your layout component:
```jsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2"
>
  Skip to content
</a>
<main id="main-content">{children}</main>
```

**5. Fix heading levels that skip for visual reasons.** A table of contents or a "related posts" component styled to look smaller might get bumped to an `h4` purely for its font size, jumping straight past `h2` and `h3`. Screen reader users navigate by heading level to jump around a page, and a skipped level breaks that navigation even though it looks completely normal visually. Style headings with CSS classes, not by picking a different heading tag for the size you want.

**6. Give form inputs real labels.** The contact form and newsletter signup are common offenders — a placeholder like "Your email" is not a substitute for an associated `<label>`, and disappears the moment the user starts typing, taking the only cue of what the field is with it.

None of this requires a redesign. Most of what axe turns up on a small blog is missing alt text, an unlabeled input, or a contrast ratio that's close but not quite there — a focused pass fixes the majority of findings in under an hour, and re-running the scan after each fix confirms it actually resolved rather than just looking fixed.
