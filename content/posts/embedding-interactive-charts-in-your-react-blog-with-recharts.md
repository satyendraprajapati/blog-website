---
title: "Embedding Interactive Charts in Your React Blog with Recharts"
date: "2026-07-21"
tags: ["web-development", "react", "data-visualization"]
excerpt: "How to drop a live, interactive chart into a Markdown-based React blog post instead of a static screenshot."
---

A screenshot of a Power BI dashboard tells a visitor what you built, but it can't be hovered, filtered, or resized — which is a strange limitation for a data-analysis blog to accept. If your posts are already Markdown rendered through `react-markdown`, you can swap a static chart image for a real, interactive one with very little extra setup.

**1. Install a charting library.** Recharts is a solid default for a React blog — it's built on top of D3, but the API is plain React components, so it doesn't fight with the rest of your codebase.
```bash
npm install recharts
```

**2. Build the chart as a normal component.** Keep it separate from your post-rendering logic, and feed it a small array of data rather than reaching for a live API call — for a blog post, a fixed dataset that illustrates the point is usually all you need.
```jsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 4650 },
  { month: "Mar", revenue: 5100 },
];

export default function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

**3. Give `react-markdown` a way to render it.** `react-markdown` renders Markdown to plain elements by default, so it has no idea `RevenueChart` exists. The cleanest option for a Vite blog is to skip Markdown syntax for the chart entirely and mount the chart component directly in your `Post.jsx` page, positioned by a marker in the post's frontmatter or body (for example a `<!-- chart:revenue -->` comment you match against a small lookup of chart components per slug).

**4. Keep the fallback in mind.** Anyone reading through an RSS reader or a scraper won't execute React, so the interactive chart is a progressive enhancement, not a replacement for the surrounding explanation — describe what the chart shows in the surrounding text so the post still makes sense without it rendering.

**5. Watch your bundle size.** A charting library adds real weight to a Vite build. If only one or two posts use charts, import the chart component with `React.lazy` and a dynamic `import()` so the code only loads on those specific post pages instead of shipping to every visitor.

The payoff is that a reader can hover a data point and see the exact value, or resize their window and watch the chart adapt — small things, but they're exactly the kind of detail that signals a data-analysis portfolio was actually built by someone who works with data, not just someone who writes about it.
