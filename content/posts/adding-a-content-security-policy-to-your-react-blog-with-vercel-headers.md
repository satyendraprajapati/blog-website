---
title: "Adding a Content Security Policy to Your React Blog with Vercel Headers"
date: "2026-09-06"
tags: ["web-development", "security", "vercel"]
excerpt: "A Content Security Policy tells the browser which sources of scripts, styles, and embeds your blog actually trusts — set through vercel.json, no server code required."
---

Environment variables keep secrets out of your source code, but they don't stop a browser from executing a malicious script if one ever gets injected into your site — through a compromised dependency, a pasted comment widget, or a typo in a third-party embed. A Content Security Policy (CSP) is a response header that tells the browser exactly which sources of scripts, styles, images, and frames are allowed, so anything outside that list simply doesn't run, even if it makes it into the page.

**1. Start from what your blog actually loads.** Before writing a policy, list every external source your site uses — Google Fonts, a Giscus comment iframe, a Plausible analytics script, an embedded Power BI report. A static React blog build usually needs only a handful of these, which makes CSP for it much simpler than for a full web app with third-party ad scripts and trackers.

**2. Set the policy as a header in `vercel.json`, not a `<meta>` tag.** A meta-tag CSP works but can't set every directive (`frame-ancestors` is ignored in meta tags), so a real HTTP header is the more complete option:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; frame-src https://giscus.app;"
        }
      ]
    }
  ],
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**3. Expect `style-src 'unsafe-inline'` to be necessary, and don't chase it away at all costs.** Tailwind and most React component libraries inject inline styles at runtime; blocking inline styles entirely tends to break more of the UI than it protects, so allowing `unsafe-inline` for styles while keeping scripts locked down is a reasonable, common middle ground rather than a failure to "do CSP properly."

**4. Add each third-party embed to the policy as you add it to the site, not after something breaks.** A Giscus comment widget needs `frame-src https://giscus.app`, a self-hosted analytics script needs its domain under `script-src`, and an embedded Power BI report needs its domain under `frame-src`. Skip a domain and the browser doesn't show a broken widget with an error message on the page — it just silently refuses to load it, which is confusing to debug if you don't know to check the browser console for CSP violation warnings.

**5. Test in report-only mode before enforcing.** Swapping the header name to `Content-Security-Policy-Report-Only` makes the browser log violations to the console without actually blocking anything — a safe way to catch a missed domain before real visitors hit a broken embed on the live site.

**6. Redeploy and check the Network tab, not just the visual result.** A page can look fine while a background script is silently blocked — open DevTools, reload, and confirm no CSP errors are logged in the console before considering the policy finished.

A CSP header doesn't stop every attack, but it closes off a whole class of them for the cost of one header block in a config file you're probably already committing — cheap insurance for a site that's otherwise just static files with no backend to harden.
