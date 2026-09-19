---
title: "Adding the Web Share API to Your React Blog for a Native Mobile Share Sheet"
date: "2026-09-19"
tags: ["web-development", "react", "javascript"]
excerpt: "A single browser API opens the phone's actual share sheet — Messages, Mail, WhatsApp, whatever's installed — instead of limiting a reader to the one or two networks your share buttons happened to hardcode."
---

Hardcoded "Share on X" and "Share on LinkedIn" buttons cover two networks and miss everything else a reader might actually want — texting the link to a coworker, dropping it in Slack, saving it to Notes. On a phone, the browser already has a native share sheet that does all of that; the Web Share API is the one-function call that opens it.

**1. `navigator.share()` is the entire API.** Call it with a title, text, and URL, and the OS-native share sheet opens with every installed app that accepts a shared link — no library, no popup window, no per-network URL formatting to maintain.
```javascript
async function sharePost(post) {
  try {
    await navigator.share({
      title: post.title,
      text: post.excerpt,
      url: `${window.location.origin}/blog/${post.slug}`,
    });
  } catch (err) {
    if (err.name !== "AbortError") console.error(err);
  }
}
```
The `AbortError` check matters — that's the error `navigator.share()` throws when someone opens the share sheet and then just closes it, which is normal behavior, not a failure worth logging.

**2. Feature-detect before you render the button at all.** The API doesn't exist in every browser, notably most desktop browsers as of this writing, so check for it up front and render your existing share buttons as the fallback instead of a button that silently does nothing when clicked.
```javascript
const canShare = typeof navigator !== "undefined" && "share" in navigator;
```

**3. Render one button, not two competing rows.** The clean pattern is: if `canShare` is true, show a single "Share" button wired to `navigator.share()`; if it's false, fall back to whatever link-based share buttons you already built for X and LinkedIn. A reader on a phone gets the full share sheet; a reader on desktop Chrome gets the two links they'd have gotten anyway — nobody sees both at once.

**4. It requires a secure context and a real user gesture.** `navigator.share()` only works over HTTPS (which a Vercel deployment already gives you) and only when called directly from a click handler — you can't fire it from a `useEffect` on page load or a timer, which is a good restriction anyway since an unprompted share sheet would be a jarring thing for a site to trigger on its own.

**5. `canShare()` lets you check a payload before committing to it.** If you later want to share an image alongside the link — a post's social preview card, say — `navigator.canShare()` tells you whether the current browser supports sharing files at all, so you can build a text-only payload as the fallback instead of assuming every browser that supports `share()` also supports file attachments.
```javascript
if (navigator.canShare && navigator.canShare({ files: [file] })) {
  await navigator.share({ files: [file], title: post.title });
}
```

**6. Don't remove your existing share buttons — this is additive.** The Web Share API is a progressive enhancement on top of link-based sharing, not a replacement for it: desktop readers, older mobile browsers, and anyone with a locked-down enterprise browser still need the plain "Share on X" link to work exactly as before.

The whole implementation is a five-line function and a feature check, and the payoff is real: a reader who wants to share your DAX or Excel post to their team chat gets to do it in whatever app they actually use, instead of being funneled into the one or two platforms you happened to build a button for.
