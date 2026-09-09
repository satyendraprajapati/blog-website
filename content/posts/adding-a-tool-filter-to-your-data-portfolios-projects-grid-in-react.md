---
title: "Adding a Tool Filter to Your Data Portfolio's Projects Grid in React"
date: "2026-09-09"
tags: ["web-development", "react", "portfolio"]
excerpt: "Let a visitor narrow your portfolio grid down to just the Power BI or SQL case studies with a row of filter chips, using nothing but React state and the frontmatter you already write."
---

A blog gets a tag archive page almost for free once posts have frontmatter tags — a portfolio grid usually doesn't, even though a recruiter skimming for "anything with Power BI" has exactly the same need. A small client-side filter on the projects grid solves it without a second router or a backend query.

**1. Add a `tools` field to each project's frontmatter.** If your project case studies already live as Markdown files with frontmatter (mirroring how posts work), add a simple array alongside title and excerpt — this is the only new data the feature needs.
```yaml
---
title: "Regional Sales Dashboard"
tools: ["Power BI", "DAX", "Power Query"]
excerpt: "A drill-down sales dashboard built for a five-region retail chain."
---
```

**2. Derive the full list of filter chips from the data, not a hardcoded array.** Hardcoding `["Excel", "Power BI", "SQL"]` in the component means it silently goes stale the next time you add a project using a new tool. Compute it instead.
```javascript
const allTools = [...new Set(projects.flatMap((p) => p.tools))].sort();
```

**3. Keep the active filter in simple component state.** This doesn't need a router param or global state — a single array of selected tools in `useState`, defaulting to empty (meaning "show everything"), is enough for a page this size.
```javascript
const [activeTools, setActiveTools] = useState([]);

function toggleTool(tool) {
  setActiveTools((prev) =>
    prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
  );
}
```

**4. Filter with AND logic when multiple chips are selected.** Requiring a project to match every selected tool, not just one of them, is what makes stacking filters ("Power BI" + "DAX") actually narrow the results instead of just widening them.
```javascript
const visibleProjects = activeTools.length === 0
  ? projects
  : projects.filter((p) => activeTools.every((tool) => p.tools.includes(tool)));
```

**5. Make the active state visually obvious on the chip itself.** A filter a visitor can't tell is active is worse than no filter — toggle a solid background and border color on the selected chips with a Tailwind conditional class, rather than relying on a subtle outline someone might miss on a quick scan.

**6. Show a real empty state instead of a blank grid.** Selecting "Excel" and "Recharts" together might match nothing, and a silently empty grid reads as a broken page. A one-line message — "No projects match that combination — try removing a filter" — with a visible "Clear filters" button costs almost nothing and avoids the dead-end.

**7. Sync the selection to the URL only if you want it shareable.** For most personal portfolios, in-memory state that resets on refresh is perfectly fine. If you want a link like `/portfolio?tools=power-bi` to be shareable in a LinkedIn message, mirror `activeTools` into a `useSearchParams` query string instead — but treat that as an optional upgrade, not a requirement for the feature to work.

The whole thing is under fifty lines on top of a grid you've already built — the payoff is that a hiring manager scanning specifically for SQL work can filter straight to it instead of reading every case study title.
