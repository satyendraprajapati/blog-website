---
title: "Understanding CORS Errors: Why Your Browser Blocks That API Call (A Data Analyst's Guide)"
date: "2026-11-01"
tags: ["web-development", "apis", "beginner"]
excerpt: "What a 'blocked by CORS policy' console error actually means, why it only shows up in the browser, and the realistic ways to work around it."
---

The request works fine in Postman. It works fine running the same URL through Python's `requests` library. Then you drop a `fetch` call into a web page to pull the same data into a chart, and the console turns red:

```
Access to fetch at 'https://api.example.com/sales' from origin
'http://localhost:5173' has been blocked by CORS policy: No
'Access-Control-Allow-Origin' header is present on the requested resource.
```

Nothing about the API changed. What changed is that a browser, not a script, is now the one making the request — and browsers enforce a rule nothing else does.

**1. It's your browser blocking the response, not the server rejecting the request.** Browsers follow the "same-origin policy": by default, JavaScript running on one site (your localhost page) isn't allowed to read responses from a different origin (the API's domain) unless that server explicitly says it's fine. The request often still reaches the server and gets answered — you can sometimes see the response in the Network tab — but the browser throws the data away before your code ever sees it.

**2. The fix lives on the server, in a response header.** A server opts in to cross-origin requests by sending back `Access-Control-Allow-Origin`, naming either your specific origin or `*` for "anyone."
```js
fetch("https://api.example.com/sales")
  .then(res => res.json())
  .then(data => console.log(data));
```
Run that against an API that sends the right header, and it works with zero changes on your end. Run it against one that doesn't, and no amount of rewriting the `fetch` call will fix it — because the problem isn't in the call.

**3. Check the Network tab's response headers before you touch any code.** Open devtools, find the failed request, and look at its response headers. If `Access-Control-Allow-Origin` is missing, or present but naming a different origin than yours, that confirms the server simply hasn't opted in — which tells you to look for a workaround rather than keep debugging your own JavaScript.

**4. `mode: "no-cors"` isn't a fix, it's a trap.** It's tempting to try, and it does make the red error disappear — but it does so by returning an "opaque" response your code can't read the contents of at all. You'll have a request that technically succeeds and a `data` object that's permanently empty. If you need the actual response, this isn't the way out.

**5. Route the request through your own backend instead.** CORS only governs browser-to-server requests; it has no say over server-to-server ones. A small serverless function or backend route can call the API with no CORS restriction at all, then hand the result to your page from your own origin — which the browser trusts by definition, since it's the same origin the page came from. This is the same pattern worth reaching for if you're also hiding an API key from a serverless function, just solving a different problem with the same shape.

**6. Some APIs offer a CORS-friendly alternative on purpose.** A handful of public data APIs publish both a plain REST endpoint and a JSONP or explicitly browser-enabled version for exactly this reason. Before building a proxy, it's worth a quick check of the API's docs for "browser," "client-side," or "CORS" — sometimes the easy path already exists.

The core thing worth remembering: CORS is a browser-only rule, which is exactly why it "worked in Postman" and nowhere in your code was actually wrong. Once that clicks, a CORS error stops being a mystery and becomes a known decision point — ask the API to allow your origin, or put a server of your own between the browser and the API.
