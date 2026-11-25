---
title: "localStorage vs sessionStorage vs Cookies: Choosing the Right Browser Storage for a Data Portfolio Site"
date: "2026-11-25"
tags: ["web-development", "javascript", "beginner"]
excerpt: "Three ways a browser can remember something between page loads, and which one actually fits a saved filter, a draft, or a login token."
---

A React portfolio or blog ends up needing to "remember" something sooner or later — a saved chart filter, a theme choice, a visitor's consent answer. The browser gives you three different places to put that data, and picking the wrong one causes bugs that are easy to misdiagnose, like a setting that vanishes on refresh or one that mysteriously persists across unrelated tabs.

**1. `localStorage`** — persists with no expiration until the user or the site clears it, and is scoped to the origin (same domain and protocol), shared across every tab and window open to that site. It's the right choice for a theme toggle, a saved filter preset, or a "read later" list — anything that should survive closing the browser entirely.
```javascript
localStorage.setItem('theme', 'dark')
const theme = localStorage.getItem('theme') ?? 'light'
```
It only stores strings, so an object needs `JSON.stringify`/`JSON.parse` on the way in and out, and it's capped around 5–10MB depending on the browser — plenty for settings, not for caching a large dataset.

**2. `sessionStorage`** — same API as `localStorage`, but scoped to a single tab and cleared the moment that tab closes. Reopening the site in a new tab starts fresh, even if it's the same browser and the same site. This is the right fit for something like a multi-step form's in-progress answers, or a "scroll position to restore" value you don't want bleeding into a second tab open to the same page.
```javascript
sessionStorage.setItem('draftComment', text)
```
The most common bug with `sessionStorage` is expecting it to behave like `localStorage` — a user opens a link in a new tab and is confused that their "saved" state isn't there, because it never leaves the tab it was set in.

**3. Cookies** — the odd one out, because unlike the other two, cookies are automatically sent to the server with every matching HTTP request. That makes them the right (and really only) choice for anything the server needs to read on each page load, like a session ID or an auth token, but the wrong choice for pure front-end state like a UI filter, since you'd be paying request overhead for data the server never looks at.
```javascript
document.cookie = 'consent=accepted; max-age=31536000; path=/'
```
Cookies also carry real size and count limits per domain (roughly 4KB each, a few dozen total), and need explicit `expires`/`max-age` handling — without one, a cookie defaults to a session cookie that disappears when the browser fully closes.

**4. The practical rule for a static site.** If your portfolio or blog has no backend reading the value, reach for `localStorage` by default and drop to `sessionStorage` only when you specifically want the data to *not* survive a new tab or a browser restart. Reserve cookies for the one case a static React site usually does need them: a third-party consent flag or an embedded analytics script that sets its own.

**5. All three fail silently in some conditions.** Private/incognito windows, blocked third-party storage, and a user with site data disabled can all make reads and writes throw or silently no-op. Wrap storage calls in `try/catch` and have a sensible in-memory fallback so a blocked `localStorage` write doesn't crash the page it was meant to make better.

Treat the three as answering different questions — "does this need to survive a restart," "should this be tab-local," and "does the server need to see this" — and the right one is usually obvious.
