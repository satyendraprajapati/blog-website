---
title: "Setting Up Uptime Monitoring and Downtime Alerts for Your React Data Portfolio Site"
date: "2026-11-28"
tags: ["web-development", "deployment", "beginner"]
excerpt: "Why a personal portfolio site needs its own uptime check, and how to set up a free monitor that emails you the moment it goes down."
---

Vercel's free tier is reliable, but "reliable" isn't the same as "guaranteed." Deploys fail, DNS changes break silently, and a bad environment variable can take a site down without a single error in your own logs — because you're not the one looking at it, a recruiter or client checking out your portfolio link is. An uptime monitor exists to notice before they do.

**1. Pick a free monitor.** Services like UptimeRobot, Better Stack, and Freshping all offer free tiers that cover a personal site comfortably — typically checks every few minutes against as many as 50 URLs, which is far more than one portfolio site needs. Sign up and add your site's URL (e.g. `https://your-portfolio.vercel.app`) as an HTTP(S) monitor.

**2. Check the right thing.** A basic monitor just confirms the homepage returns a `200` status, which catches full outages and DNS failures. If your site has a blog, also monitor a specific post URL — this catches a narrower but real failure mode: a build that "succeeds" but ships a broken route, where the homepage loads fine but every `/blog/:slug` page 404s.

**3. Set a sane check interval.** Free tiers usually offer checks as frequent as every 5 minutes. For a personal site, 5–15 minutes is plenty — there's no benefit to checking every 30 seconds, and it just uses up your account's free quota faster.

**4. Wire up the alert.** Point the monitor's alert contact at an email address you actually check, not a throwaway one. Most services also support Slack or Discord webhooks if you'd rather get a ping there. The alert should fire on the *first* failed check after a run of successes, and ideally again once the site recovers, so you know both when it broke and when it's back.

**5. Add a dedicated health-check route if you want more signal.** A plain `200` on your homepage only proves the static shell loaded — it won't catch a markdown post that fails to parse at build time if the build itself still succeeded on stale content. A tiny serverless function gives you a cheaper, more specific thing to monitor:

```js
// api/health.js — a minimal Vercel serverless function
export default function handler(req, res) {
  res.status(200).json({ status: "ok", timestamp: Date.now() });
}
```

Point a second monitor at `/api/health` so you can tell a full site outage apart from a frontend-only issue.

**6. Don't over-build this.** It's tempting to wire up a full status page, historical uptime graphs, and incident reports for a personal site — skip it. The entire point is a free email alert that tells you something's wrong before someone else notices and quietly leaves. One monitor on the homepage, optionally a second on a health-check endpoint, is enough.

Five minutes of setup, and you go from "hoping it's up" to actually knowing — which matters more for a portfolio site than for almost anything else you'll deploy, since the whole purpose of the site is for strangers to find it working on the first try.
