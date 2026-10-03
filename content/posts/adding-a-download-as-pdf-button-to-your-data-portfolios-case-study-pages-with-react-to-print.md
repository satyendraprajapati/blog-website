---
title: "Adding a 'Download as PDF' Button to Your Data Portfolio's Case Study Pages with react-to-print"
date: "2026-10-03"
tags: ["web-development", "react", "portfolio"]
excerpt: "A recruiter who found one project page through a job application link shouldn't have to bookmark your whole site to revisit it later — a one-click PDF export gives them something they can actually save and forward."
---

A print stylesheet makes a page look right when someone hits Ctrl+P, but it still relies on the visitor finding the browser's print dialog on their own. For a portfolio's case study pages specifically, it's worth making that path explicit: a single "Download as PDF" button on the ProjectDetail page, powered by `react-to-print`, which triggers the browser's native print-to-PDF flow against just that component instead of the whole page chrome.

**1. Install the library and give the content you want printed a ref.** `react-to-print` doesn't generate a PDF itself — it opens the browser's print dialog scoped to a specific DOM node, which the visitor then saves as PDF the same way they would any print job.

```bash
npm install react-to-print
```

```jsx
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

function ProjectDetail({ project }) {
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef });

  return (
    <div>
      <button onClick={handlePrint}>Download as PDF</button>
      <div ref={contentRef}>
        <h1>{project.title}</h1>
        <p>{project.excerpt}</p>
        {/* charts, screenshots, write-up */}
      </div>
    </div>
  );
}
```

**2. Scope the ref to the case study content only, not the whole page.** Wrap just the title, write-up, and chart screenshots in the ref — not your site header, footer, or navigation. Anything outside the ref never reaches the print dialog, so you don't need separate CSS to hide it.

**3. Add a dedicated print stylesheet for this component, not your whole blog's print styles.** If you already added a print stylesheet for blog posts, this is a different layout: a case study page likely has a hero image, a tools-used badge row, and project screenshots that need explicit page-break control so a chart doesn't get sliced across two pages.

```css
@media print {
  .project-detail img {
    max-width: 100%;
    break-inside: avoid;
  }
  .project-detail .tools-badges {
    break-after: avoid;
  }
}
```

**4. Set a sensible default title for the saved file.** Most browsers pre-fill the save-as filename from the page's `<title>`, which is also why per-post meta tags matter here — a project page titled "Regional Sales Dashboard | Your Name" produces a far more useful default filename than a generic "ProjectDetail."

**5. Don't rely on this for anything that needs to look pixel-identical across browsers.** `react-to-print` hands off to each browser's own print engine, so spacing and page breaks can render slightly differently in Chrome versus Firefox versus Safari. That's an acceptable tradeoff for a portfolio leave-behind; it's not the right tool if you need a byte-for-byte identical PDF, which is a job for a server-side renderer instead.

**6. Test it with a real multi-page case study before shipping it**, not just a short one. A one-screen project page prints fine by accident; the page breaks only reveal themselves once a write-up runs two or three pages, which is exactly the case a recruiter skimming it later will actually hit.

The payoff is small but real: a link that works perfectly in a browser session is still a dead end once someone closes the tab. A PDF is the one artifact that survives being forwarded in an email or saved to a desktop.
