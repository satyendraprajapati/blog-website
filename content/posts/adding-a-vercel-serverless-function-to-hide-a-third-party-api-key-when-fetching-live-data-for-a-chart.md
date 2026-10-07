---
title: "Adding a Vercel Serverless Function to Hide a Third-Party API Key When Fetching Live Data for a Chart"
date: "2026-10-07"
tags: ["web-development", "vite", "security"]
excerpt: "If a chart on your data portfolio needs a live API key, putting it in a Vite environment variable still ships it to every visitor's browser — here's how a Vercel serverless function keeps it server-side instead."
---

A static React blog is just HTML, CSS, and JavaScript served from a CDN — there's no backend to hide anything in. That's fine for public data and public keys, but it breaks down the moment a chart needs to call an API that requires a real secret: a weather API key, a stock-data provider, anything with a rate limit tied to your account. Put that key in a `VITE_`-prefixed environment variable and it ends up sitting in plain text in the built JavaScript bundle, visible to anyone who opens dev tools. A Vercel serverless function fixes this by putting one small piece of server-side code between your chart and the API.

**1. Understand the actual problem first.** Vite environment variables are a convenience for values that differ between environments, not a secrets store — anything prefixed `VITE_` is baked into the client bundle at build time. A key that can rack up billing charges or get rate-limited by one scraper has no business there. It needs to live somewhere only your server-side code can read it.

**2. Add an `api/` folder at your project root.** Vercel automatically treats any file in `api/` as a serverless function, deployed alongside your static site with no extra configuration. A file at `api/weather.js` becomes a live endpoint at `/api/weather` once deployed.
```js
// api/weather.js
export default async function handler(req, res) {
  const { city } = req.query;
  const response = await fetch(
    `https://api.weatherprovider.com/v1/current?city=${encodeURIComponent(city)}&key=${process.env.WEATHER_API_KEY}`
  );
  const data = await response.json();
  res.status(200).json(data);
}
```

**3. Store the real key as a plain (non-`VITE_`) environment variable.** Add `WEATHER_API_KEY` under Project → Settings → Environment Variables in the Vercel dashboard, without the `VITE_` prefix. Serverless functions run in Node on Vercel's servers, so they can read `process.env` directly — and because the variable isn't prefixed `VITE_`, Vite never bundles it into client-side code in the first place.

**4. Call your own endpoint from the chart, never the third-party API directly.** The browser only ever talks to `/api/weather`, a same-origin path, and never sees the provider's URL or key.
```jsx
useEffect(() => {
  fetch(`/api/weather?city=${city}`)
    .then((res) => res.json())
    .then(setChartData);
}, [city]);
```

**5. Validate and narrow what the function passes through.** A serverless function that blindly forwards query parameters to a paid API is an easy way for someone to rack up charges by hitting your endpoint directly. At minimum, check that expected parameters look sane before forwarding them, and only return the fields your chart actually needs rather than the provider's full response.
```js
if (!city || city.length > 50) {
  return res.status(400).json({ error: "Invalid city parameter" });
}
```

**6. Test it locally with the Vercel CLI, not just after deploying.** Vite's own dev server doesn't know about the `api/` folder — running `npx vercel dev` instead spins up both the static site and the serverless functions together, so you can confirm the fetch works and the key never appears in a browser network tab before pushing.

**7. Add basic rate limiting if the endpoint is reachable by anyone.** Even same-origin, your `/api/weather` path is a public URL once deployed — a lightweight check like capping requests per IP per minute (several small npm packages handle this, or a simple in-memory counter for low-traffic personal sites) keeps one bad actor from exhausting your API quota on their own.

The core idea carries over to almost any live-data feature you'd want on a portfolio or blog: the browser should only ever talk to your own domain, and anything with billing or rate limits attached stays server-side, one serverless function away from the chart that needs it.
