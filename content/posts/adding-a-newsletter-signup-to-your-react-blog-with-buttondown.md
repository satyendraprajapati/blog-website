---
title: "Adding a Newsletter Signup to Your React Blog with Buttondown"
date: "2026-08-02"
tags: ["web-development", "react", "newsletter"]
excerpt: "How to add an email signup form to a static Vite/React blog using Buttondown's free tier, without standing up a backend or a mailing-list server."
---

RSS gets you readers who already use a feed reader — most people don't. An email list is the other channel that doesn't depend on an algorithm deciding to show your post to anyone, and Buttondown's free tier handles the sending, unsubscribes, and list management without you running a server.

**1. Create a Buttondown account and grab your form.** Sign up at buttondown.com, and under Settings → Programming you'll find an embeddable HTML subscribe form tied to your username. It's a plain `<form>` that POSTs to Buttondown's API — no API key needed for the public subscribe endpoint, which is what makes it safe to ship in client-side code.

**2. Build it as a component**, not inline JSX in every page, so the same form can go on the blog listing page, the footer, and the end of each post:

```jsx
// src/components/NewsletterSignup.jsx
export default function NewsletterSignup() {
  return (
    <form
      action="https://buttondown.com/api/emails/embed-subscribe/YOUR_USERNAME"
      method="post"
      target="popupwindow"
      onSubmit={() => window.open('https://buttondown.com/YOUR_USERNAME', 'popupwindow')}
      className="flex flex-col sm:flex-row gap-2"
    >
      <input
        type="email"
        name="email"
        required
        placeholder="you@example.com"
        className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Subscribe
      </button>
    </form>
  )
}
```

**3. The `popupwindow` target matters.** Buttondown's subscribe endpoint redirects to a confirmation page after submit. Posting to a named popup instead of the current tab means a visitor reading a post doesn't get yanked away from your site mid-paragraph just to see a "check your inbox" message.

**4. Place it where attention already is.** The bottom of a finished blog post is the highest-intent spot on the whole site — someone just read 800 words about DAX or Power Query and is still thinking about it. Drop `<NewsletterSignup />` at the end of `Post.jsx`, after the post body renders, rather than only in a sidebar nobody scrolls to.

**5. Respect the theme toggle.** Since the form is a plain HTML form styled with Tailwind classes, it inherits `dark:` variants like the rest of the site automatically — test it in both light and dark mode rather than assuming, since a white input on a dark background is an easy thing to miss.

**6. Skip building a "manage subscription" page.** Buttondown hosts unsubscribe links and preference management for you and includes them automatically in every email it sends — there's nothing to build on your end beyond the signup form itself.

That's the whole integration: one component, no environment variables, no backend, and no mailing infrastructure to maintain — the same no-backend approach the Formspree contact form already uses on this site.
