---
title: "Power BI's Publish to Web: Sharing a Report Publicly Without a License"
date: "2026-10-31"
tags: ["power-bi", "data-analysis", "sharing"]
excerpt: "How Publish to Web turns a Power BI report into a public, licenseless embed — and why it's the wrong tool for anything containing real data."
---

Most ways of sharing a Power BI report assume the viewer has a Power BI license, or at least a work account in your organization. Publish to Web is the exception: it generates a public embed code that anyone with the link can open in a browser, no sign-in and no license required. That makes it genuinely useful for a portfolio piece or a public dashboard — and genuinely risky for anything else.

**1. It's meant for public, non-sensitive data.** When you use Publish to Web, the report is no longer protected by your organization's permissions, row-level security, or sensitivity labels — none of that applies once the embed is live. Microsoft is explicit about this: treat it as equivalent to posting the report on the open internet, because that's what it does. Good candidates are public datasets, portfolio projects, or anything you'd already be comfortable screenshotting into a blog post. A client's sales figures are not.

**2. Generating the link takes one menu path.** From File → Embed report → Publish to web (public), Power BI gives you two things: a direct link anyone can open, and an `<iframe>` snippet you can drop into a webpage.

```html
<iframe
  title="Public report"
  width="800"
  height="500"
  src="https://app.powerbi.com/view?r=eyJrIjoiXXXX..."
  frameborder="0"
  allowFullScreen="true">
</iframe>
```

**3. Filters and slicers in the report still work for the viewer.** Anyone with the link can interact with the report's visuals, slicers, and drill-throughs exactly as you built them — they just can't edit the report itself or see any data outside what you published. This is what makes it more useful than a static export: a visitor on your portfolio site can actually explore the data, not just look at a picture of it.

**4. It's a live connection, so published changes show up automatically.** Unlike a PDF or exported image, a Publish to Web embed re-renders from the underlying report each time it's viewed (subject to the dataset's refresh schedule). Update the report in the Power BI service and every page with that embed code reflects the change — no need to regenerate or re-share the link.

**5. Admins can disable the feature entirely, and for good reason.** Because Publish to Web bypasses normal access controls, many organizations turn it off tenant-wide in the Power BI admin portal. If the option is greyed out or the embed fails for a work account, that's very likely why — ask a tenant admin rather than assuming it's a bug on your end.

**6. You can revoke access at any time, but existing embeds take a moment to catch up.** From Manage embed codes in the Power BI service, you can delete a Publish to Web link, which breaks the embed wherever it was placed. Treat this as a kill switch for mistakes, not a way to make something temporarily public — once a link has been shared, assume it's been seen and cached by someone, even after you revoke it.

For a personal project — say, embedding a public dataset's dashboard on your own site next to a write-up — Publish to Web is the fastest path from "report in Power BI Desktop" to "something a stranger can open in their browser." Just keep the line clear between what's a portfolio piece and what's actual client work, because the feature doesn't draw that line for you.
