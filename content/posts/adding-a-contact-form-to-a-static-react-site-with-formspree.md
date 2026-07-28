---
title: "Adding a Working Contact Form to a Static React Site with Formspree"
date: "2026-07-28"
tags: ["web-development", "react", "forms"]
excerpt: "A static Vite/React site has no backend to receive form submissions — here's how to make the Contact page actually send email without standing up a server."
---

A React + Vite site deployed to Vercel has no server of its own to handle a form `POST` — there's nowhere for `<form action="/submit">` to go. Most beginner tutorials skip this and leave a Contact page that just looks like a form. Formspree fixes that with a free hosted endpoint that emails you the submission, no backend required.

**Sign up and grab a form endpoint.** Create a free Formspree account, add a new form, and you'll get a unique endpoint URL like `https://formspree.io/f/xxxxabcd`. That's the only "backend" you need — Formspree receives the POST and forwards it to your inbox.

**Point your form at it and add `method="POST"`.** No JavaScript required for the basic version:
```jsx
export default function ContactForm() {
  return (
    <form action="https://formspree.io/f/xxxxabcd" method="POST" className="space-y-4">
      <input type="text" name="name" placeholder="Name" required
        className="w-full rounded border px-3 py-2" />
      <input type="email" name="email" placeholder="Email" required
        className="w-full rounded border px-3 py-2" />
      <textarea name="message" placeholder="Message" rows={5} required
        className="w-full rounded border px-3 py-2" />
      <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">
        Send
      </button>
    </form>
  );
}
```
A plain HTML submit works fine — the browser redirects to a Formspree thank-you page after sending.

**Keep the visitor on your site with `fetch` instead.** A redirect to Formspree's domain feels jarring on a portfolio site. Intercept the submit and show your own success state instead:
```jsx
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const res = await fetch(form.action, {
    method: "POST",
    body: new FormData(form),
    headers: { Accept: "application/json" },
  });
  if (res.ok) setSubmitted(true);
}
```
Attach it with `<form onSubmit={handleSubmit} ...>` and swap the form for a "Thanks — I'll get back to you" message once `submitted` is true.

**Add a honeypot field to cut down on spam.** Formspree supports a hidden field convention — add `<input type="text" name="_gotcha" style={{ display: "none" }} />` inside the form. Real visitors never fill it in; bots that auto-fill every input do, and Formspree silently discards those submissions.

**Set a custom "reply-to" so you can just hit reply.** Naming the visitor's email input `_replyto` (or `email` with a Formspree setting) means the notification email you get lands with their address in the reply-to field, so responding is a normal email reply instead of a copy-paste.

**Free tier limits are generous enough for a personal site.** 50 submissions a month on Formspree's free plan is plenty for a portfolio or blog Contact page — this isn't infrastructure you need to pay for until traffic says otherwise.

The whole integration is a form tag and a fetch call — no server, no API route, no environment variables to manage on Vercel. It's a good example of how far a purely static site can go before you actually need a backend.
