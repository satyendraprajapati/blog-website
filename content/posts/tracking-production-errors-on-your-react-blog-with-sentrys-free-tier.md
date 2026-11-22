---
title: "Tracking Production Errors on Your React Blog with Sentry's Free Tier"
date: "2026-11-22"
tags: ["web-development", "react", "monitoring"]
excerpt: "An error boundary stops a crash from taking down your whole site, but you still won't know it happened unless something reports it — Sentry's free tier fills that gap."
---

An error boundary is the right fix for a render crash, but it solves exactly half the problem: the visitor sees a fallback instead of a blank page, and you find out about none of it. A bad frontmatter field, a Markdown edit that breaks `react-markdown`, a chart fed unexpected data — all of it fails silently in production unless something reports it back to you. Sentry's free tier (5,000 errors/month, no credit card) is enough for a personal blog's traffic and takes about ten minutes to wire up.

**1. Create a project and grab the DSN.** Sign up at sentry.io, create a new project, and pick React as the platform. Sentry gives you a DSN — a URL that tells the SDK where to send error reports. Treat it like a public key, not a secret: it's meant to live in client-side code, but don't commit it directly if you'd rather keep it out of the repo's history.
```bash
npm install @sentry/react
```

**2. Initialize it once, before your app renders.** In `src/main.jsx`, call `Sentry.init` ahead of `ReactDOM.createRoot`, and guard it so local development doesn't spam your Sentry dashboard with every error you're actively debugging:
```jsx
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    tracesSampleRate: 0.1,
  });
}
```
`tracesSampleRate` controls what fraction of page loads also send performance data — keep it low (or omit it) on a personal site, since error reports matter far more than performance traces and both count against the free tier's monthly event quota.

**3. Store the DSN as a Vite environment variable, not a hardcoded string.** Add `VITE_SENTRY_DSN=https://...@sentry.io/...` to `.env.local` for development and to your Vercel project's environment variables for production, so the value isn't duplicated across environments or buried in a commit.

**4. Connect it to the error boundary you already have.** Rather than building a second error-catching mechanism, report from inside the existing boundary's `componentDidCatch`:
```jsx
componentDidCatch(error, info) {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, { extra: info });
  }
}
```
The fallback UI still shows immediately for the visitor — this just adds a line that tells Sentry what broke and lets it keep its own stack trace and component info alongside it.

**5. Verify it actually works before trusting it.** Temporarily throw an error somewhere reachable (`throw new Error("sentry test")` in a click handler), deploy, trigger it, and check that the event shows up in Sentry's dashboard within a minute or two. It's much better to find a misconfigured DSN now than to discover it the day a real post actually breaks.

**6. Filter out noise so your quota lasts the month.** Browser extensions, ad blockers, and flaky mobile connections generate errors that have nothing to do with your code — a `ResizeObserver loop limit exceeded` warning or a network error from a blocked script are common offenders. Sentry's `ignoreErrors` option in `Sentry.init` lets you filter these by message pattern so they don't eat into your 5,000-event monthly allowance.

Once this is in place, a broken post or a bad deploy shows up as a notification instead of something a reader has to mention to you first — which, for a one-person blog, is usually the only monitoring you actually need.
