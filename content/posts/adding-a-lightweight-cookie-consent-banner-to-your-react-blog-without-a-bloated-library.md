---
title: "Adding a Lightweight Cookie Consent Banner to Your React Blog Without a Bloated Library"
date: "2026-10-05"
tags: ["react", "privacy", "vite"]
excerpt: "Gating analytics behind a simple consent banner built with localStorage and a context provider, instead of pulling in a full consent-management library for a personal blog."
---

The moment a blog adds any analytics script — even a privacy-friendly one — visitors in the EU and several other regions are legally entitled to be asked first. Most consent solutions are built for sites running a dozen third-party trackers; a personal data-analysis blog running one analytics snippet doesn't need that machinery, just a banner that blocks the script until someone clicks "accept," and remembers the choice.

**1. Store the decision in `localStorage`, not a cookie.** It's counterintuitive given the name, but the consent choice itself doesn't need to be a cookie — a `localStorage` flag like `cookie-consent: "accepted"` or `"declined"` works just as well and avoids sending that flag back to the server on every request. Wrap reads and writes in a `try/catch` since `localStorage` can throw in private browsing or with blocked storage.

**2. Don't load the analytics script until consent is recorded.** The script tag itself should be conditional, not just hidden behind a banner the user can ignore while the tracker already loaded in the background. Render the analytics `<script>` tag (or call the SDK's init function) only after checking the stored flag — if it's missing, skip loading it entirely until the banner resolves.

**3. Build the banner as a small state machine: unknown, accepted, declined.** A visitor's first visit has no stored flag, so the banner shows. Clicking **Accept** writes `"accepted"` and loads the deferred script; clicking **Decline** writes `"declined"` and the banner never reappears for that choice either — reappearing on every page load after someone already declined is the fastest way to make a consent banner annoying instead of compliant.

**4. Keep the banner itself free of the thing it's gating.** Don't fire any tracking call, pixel, or third-party request before consent is given — including from the banner component itself. The safest version only ever touches `localStorage` and conditionally mounts a script tag; nothing in the consent flow should make a network request on its own.

**5. Give a way to change the decision later, not just on first visit.** A small "Privacy settings" link in the footer that clears the stored flag and re-shows the banner covers the case where someone declined by accident, or a site's analytics provider changes and consent should be asked again. Without this, the only way to revisit the choice is clearing browser storage manually, which almost nobody will do.

**6. Respect a `Do Not Track`-style signal as a sane default, not a replacement for asking.** Checking `navigator.globalPrivacyControl` (the modern successor to the deprecated `DNT` header) and defaulting a banner's initial state to declined when it's set is a reasonable courtesy, but it doesn't substitute for showing the banner — some jurisdictions require an affirmative choice regardless of browser signals, so treat this as a sensible default rather than a shortcut around asking.

For a blog running one analytics script, this whole flow is a context provider, a few lines of `localStorage` logic, and a banner component — no dependency, no configuration file, and nothing to keep updated when a library's consent API changes underneath you.
