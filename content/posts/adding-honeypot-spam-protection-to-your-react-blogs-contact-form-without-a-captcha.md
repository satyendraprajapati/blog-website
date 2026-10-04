---
title: "Adding Honeypot Spam Protection to Your React Blog's Contact Form Without a CAPTCHA"
date: "2026-10-04"
tags: ["web-development", "react", "security"]
excerpt: "A contact form that works without a backend is still an open target for spam bots -- a honeypot field blocks most of them without making a real visitor solve a puzzle."
---

A static Contact page wired up to a service like Formspree is reachable by anything that can send a POST request, not just people filling out the visible form. Bots that crawl the web for `<form>` tags find it the same way a person does, and within a few weeks of going live, a public form starts collecting spam submissions. A CAPTCHA fixes that but makes every real visitor click through a puzzle first — a honeypot field blocks most of the same bots without a visitor ever noticing it's there.

**1. The idea: add a field a human can't see, but a bot fills in anyway.** Bots that scrape forms generally fill in every input they find, since they can't tell a decoy field from a real one. A field hidden with CSS — not `type="hidden"`, which some bots skip on purpose — catches that behavior.

**2. Add the field and hide it off-screen, not with `display: none`.** Some spam bots specifically skip inputs with `display: none` or `visibility: hidden` because that pattern is a well-known honeypot signal. Positioning the field off-screen instead is harder for a bot to detect as a trap:
```jsx
<input
  type="text"
  name="company"
  tabIndex={-1}
  autoComplete="off"
  style={{
    position: 'absolute',
    left: '-9999px',
    opacity: 0,
  }}
  value={honeypot}
  onChange={(e) => setHoneypot(e.target.value)}
/>
```
Give it a plausible name like `company` or `website` — bots are more likely to fill in a field that looks like a real one.

**3. Reject the submission client-side if the honeypot has anything in it.** A real visitor tabbing or clicking through the form will never reach a field that's positioned off-screen, so any value in it is a strong signal the submission came from a bot:
```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  if (honeypot.trim() !== '') {
    return; // silently drop it -- don't tell the bot it was caught
  }
  // proceed with the real submission (e.g. fetch to Formspree)
};
```
Returning silently instead of showing an error keeps a bot from learning it tripped a trap and adjusting its next attempt.

**4. Pair it with a minimum time-to-submit check for the bots that skip JavaScript.** Record a timestamp when the form mounts, and reject anything submitted in under a couple of seconds — no human reads a contact form and fills it out that fast:
```jsx
const mountedAt = useRef(Date.now());
// inside handleSubmit:
if (Date.now() - mountedAt.current < 2000) return;
```

**5. Keep the real validation and submission logic exactly as it was.** A honeypot doesn't replace checking that the actual email and message fields are filled in — it just runs as an extra, invisible gate before that logic executes.

None of this is bulletproof against a bot built specifically to target your form, but it filters out the generic scripted spam that makes up the vast majority of what a public contact form actually receives, and it costs a real visitor nothing.
