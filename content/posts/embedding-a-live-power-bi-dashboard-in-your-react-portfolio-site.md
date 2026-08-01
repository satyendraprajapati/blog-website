---
title: "Embedding a Live Power BI Dashboard in Your React Portfolio Site"
date: "2026-08-01"
tags: ["web-development", "react", "power-bi"]
excerpt: "How to drop a real, interactive Power BI report into a project page on your React portfolio using a public embed link, instead of linking away to the Power BI Service."
---

A "view my Power BI dashboard" link that sends visitors away from your portfolio to log into the Power BI Service loses most of them before they see the work. If the report doesn't contain anything sensitive, embedding it directly in a project page keeps a visitor on your site and lets them actually interact with it.

**1. Publish the report and grab a "Publish to web" link.** In the Power BI Service, open the report, go to *File → Embed report → Publish to web (public)*. This generates a public, unauthenticated embed URL — anyone with the link can view and interact with the report, so only use this for portfolio-safe data, never anything with real customer or company information in it.

**2. Build a small wrapper component instead of pasting a raw `<iframe>` in Markdown.** Since posts render through `react-markdown`, embedding third-party HTML inline needs the same escape hatch used for charts — mount the embed directly in your project detail page component rather than through Markdown content.
```jsx
export default function PowerBiEmbed({ src, title }) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
         style={{ aspectRatio: "16 / 9" }}>
      <iframe
        title={title}
        src={src}
        className="absolute inset-0 h-full w-full"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
}
```
Using `aspectRatio` instead of a fixed pixel height keeps the embed proportional on mobile instead of getting cropped or leaving a huge blank gap.

**3. Keep the embed URL out of version control if it's semi-private.** "Publish to web" links are technically unauthenticated, but they're also unlisted rather than truly public — treat them the same as an API key: store the URL in an environment variable (`VITE_POWERBI_EMBED_URL`) rather than hardcoding it into a component that ends up in your public GitHub repo.

**4. Add a loading state.** Power BI embeds are noticeably slower to paint than a static image, and a blank white rectangle for two seconds reads as broken. A simple skeleton or spinner shown until the iframe's `onLoad` fires goes a long way toward not looking like a dead embed.
```jsx
const [loaded, setLoaded] = useState(false);
// ...
<iframe onLoad={() => setLoaded(true)} className={loaded ? "opacity-100" : "opacity-0"} ... />
```

**5. Give it a static fallback for anyone who can't load it.** Some corporate networks block Power BI's embed domain outright, and an iframe that silently fails to load just looks like a broken page. Pair the embed with a screenshot and a direct link ("Open in Power BI") shown below it, so the page still communicates something even when the live version doesn't render.

The result is a portfolio project page a hiring manager can actually click around in — filtering, hovering, and drilling into a real report — instead of a screenshot that asks them to take your word for what it does.
