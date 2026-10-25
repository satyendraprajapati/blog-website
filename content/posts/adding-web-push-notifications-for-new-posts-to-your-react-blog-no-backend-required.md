---
title: "Adding Web Push Notifications for New Posts to Your React Blog (No Backend Required)"
date: "2026-10-25"
tags: ["web-development", "react", "automation"]
excerpt: "Letting readers opt in to a browser notification whenever you publish, using a free push service instead of standing up your own server to manage subscriptions."
---

An RSS feed and an email newsletter both require a reader to go check something. Web push notifications are the one channel that can reach someone's device the moment a new post goes live, without them opening a tab — but the raw browser Push API expects you to run a server that stores subscriptions and signs every outgoing message, which is more backend than a static Vite blog wants to take on. A free push service handles that layer for you.

**1. The browser side still needs a service worker, even with a hosted push service.** If you've already added one for offline reading, it's the same file — push notifications are delivered to the service worker in the background, which is what lets a notification show up even if your site isn't open in a tab:
```javascript
self.addEventListener('push', (event) => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
    })
  );
});
```

**2. A hosted push service (OneSignal, or a similar free-tier provider) manages the subscription list and the delivery infrastructure.** Instead of generating VAPID keys and running a server that remembers every visitor's push subscription, you drop in the provider's small client script, which registers the service worker and handles the permission prompt for you:
```jsx
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js';
  script.async = true;
  document.body.appendChild(script);
}, []);
```

**3. Ask for permission with context, not on page load.** Browsers show the native "allow notifications?" prompt the moment you call the subscribe method, and firing that on first visit gets reflexively denied by almost everyone. Gate it behind a visible button — "Get notified about new posts" — so the prompt only appears after someone has already shown intent.

**4. Sending a notification becomes one API call per published post, not a cron job you maintain.** Most hosted providers expose a REST endpoint you can call with the post's title and URL right when you publish — which, on this site, is the same moment `npm run generate-feeds` already regenerates the RSS feed, making it a natural second step in the same publishing routine rather than a separate system to keep running.

**5. It only reaches people on a browser and OS that support it — treat it as an add-on channel, not a replacement.** Safari on iOS only gained web push support relatively recently and still requires the site to be added to the home screen first, so a meaningful share of mobile readers won't see these notifications at all. Keep RSS and the newsletter signup as the primary channels, and treat push as a bonus for engaged desktop and Android readers.

**6. Respect an unsubscribe, and don't over-send.** The same client script that requests permission can also report whether someone is still subscribed — check that before every send, and only use the channel for actual new posts, not every minor edit, or readers will mute the site at the OS level the first time it feels noisy.

This isn't a feature a static blog strictly needs, but it's a good demonstration of modern browser APIs for a data-analyst portfolio, and unlike most push notification setups, it never requires provisioning a server of your own.
