---
title: "Webhooks Explained: Getting Your Data Pipeline Notified the Moment Something Changes"
date: "2026-11-08"
tags: ["web-development", "apis", "beginner"]
excerpt: "The difference between pulling data on a schedule and having a service push it to you the instant something happens — and a minimal endpoint that receives one."
---

Most data pulls work the same way: you call an API, it answers, you move on, and you repeat that on a schedule to catch anything new. A webhook flips the direction — instead of you asking "did anything change yet," the service tells you the moment it does, by sending an HTTP request to a URL you give it.

**1. A webhook is just a regular HTTP POST request, sent by someone else's server instead of yours.** There's no special protocol — when an event happens (a form is submitted, a payment clears, a file is uploaded), the service makes an outbound request to a URL you registered, with a JSON body describing what happened. Your job is to have something listening at that URL, ready to receive it.

**2. This beats polling for anything time-sensitive, and it's lighter on both sides.** Polling an API every minute to check for new orders means 1,440 requests a day, almost all of which return "nothing new." A webhook means zero requests until there's actually something to report, and you find out within seconds instead of up to a minute (or an hour, if that's your poll interval) after it happened. The trade-off is you need a publicly reachable endpoint running at all times, where polling just needs a script that runs on a schedule.

**3. A minimal receiving endpoint is just a route that reads the body and responds quickly.** Here's the whole shape of it in a few lines of Node with Express:
```js
app.post('/webhooks/orders', (req, res) => {
  const event = req.body;
  console.log('New order:', event.order_id, event.amount);
  // queue it for processing, then respond fast
  res.status(200).send('ok');
});
```
The important part is that last line: respond quickly, before doing any slow work. If your endpoint takes too long, the sending service assumes it failed and retries — so expensive processing (writing to a database, recalculating a report) should happen after you've already returned a 200, not before.

**4. Signature verification is what stops anyone on the internet from faking events.** Because your endpoint is a public URL, anyone who finds it can POST a fake payload unless you check for one. Most providers sign each request with a secret you both share, sent as a header, and you recompute the signature yourself to confirm it matches before trusting the payload:
```js
const crypto = require('crypto');
const expected = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(rawBody)
  .digest('hex');
if (expected !== req.headers['x-signature']) {
  return res.status(401).send('invalid signature');
}
```
Skipping this check means your pipeline will process whatever anyone sends it, which is a bigger risk than it sounds for anything that triggers a database write.

**5. Expect duplicates, and design the receiving end to tolerate them.** Network hiccups mean a sender will sometimes retry an event you already received, so the same `order_id` can arrive twice. Keying your processing off an event ID — checking "have I already handled this one" before acting — avoids double-counting revenue or sending a duplicate alert because the same event landed twice.

**6. You don't need a server running 24/7 on your own machine to try this.** A local development server isn't reachable from the public internet, so during testing a tunneling tool (like ngrok) gives your `localhost` endpoint a temporary public URL you can register with the sending service — useful for seeing real payloads before you deploy the endpoint anywhere permanent.

The pull-based API call and the webhook aren't competitors so much as different tools for different timing needs — use an API call when you're the one deciding when to ask, and a webhook when you need to know the instant something else decides to tell you.
