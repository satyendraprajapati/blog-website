---
title: "Adding a Print Stylesheet to Your React Blog So Posts Print Cleanly"
date: "2026-08-19"
tags: ["web-development", "css", "beginner"]
excerpt: "How to add a dedicated print stylesheet so a reader who hits Ctrl+P on an Excel or DAX tutorial gets a clean page instead of a dark navbar and a cut-off code block."
---

A reader who wants to print a tutorial — or save it as a PDF to follow along offline while they're actually in Excel — usually just hits `Ctrl`/`Cmd` + `P`. Without a print stylesheet, that produces whatever the screen looks like: a dark-mode background burning through a print cartridge, a sticky header repeating on every page, and code blocks that get clipped at the page edge. A few CSS rules scoped to print fix all of it without touching the on-screen design.

**1. Add a `@media print` block instead of a separate stylesheet.** You don't need a second CSS file or a build step — a `@media print` block in your existing global stylesheet only applies when the browser is printing or generating a PDF, and everything else stays exactly as it is on screen.
```css
@media print {
  body {
    background: #fff;
    color: #000;
  }

  header, footer, nav, .theme-toggle, .share-buttons,
  .related-posts, .newsletter-signup, .reading-progress-bar {
    display: none;
  }

  a {
    color: #000;
    text-decoration: underline;
  }

  a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
  }

  pre, code {
    white-space: pre-wrap;
    word-break: break-word;
    background: #f4f4f4;
    border: 1px solid #ddd;
  }

  img {
    max-width: 100% !important;
  }
}
```

**2. Force light mode regardless of the reader's theme.** If your theme toggle sets a `dark` class on `<html>` or `<body>`, override its dark-mode colors inside the `@media print` block rather than relying on the class — printers ignore `prefers-color-scheme`, so anything still keyed off it will print however the light-mode fallback happens to render.

**3. Strip anything that only makes sense on screen.** Navigation, the theme toggle, share buttons, and a newsletter signup box all take up page space in print without doing anything useful once the content is on paper — `display: none` inside the print block removes them from the printed output while leaving them untouched on screen.

**4. Wrap long code blocks instead of letting them clip.** Syntax-highlighted code blocks that scroll horizontally on screen just get cut off at the page margin when printed. Setting `white-space: pre-wrap` and `word-break: break-word` inside the print block lets a long DAX measure or Excel formula wrap onto a second line instead of disappearing off the edge.

**5. Print the actual link URL next to the link text.** A blue underlined link is meaningless on paper — the `a[href^="http"]::after` rule above appends the URL in parentheses after external links, so a printed post stays usable as a reference even without click access.

**6. Test with an actual print preview, not just a resized browser window.** Print CSS behaves differently enough — page breaks inside a table, images ignoring `max-width`, background colors needing "background graphics" enabled — that a browser's own Print Preview (or Print to PDF) is the only reliable way to check it, rather than guessing from the regular viewport.

None of this changes anything a visitor sees while browsing normally — it only kicks in the moment someone tries to take a post with them, which is worth handling deliberately on a blog whose whole point is being followed along with, formula by formula.
