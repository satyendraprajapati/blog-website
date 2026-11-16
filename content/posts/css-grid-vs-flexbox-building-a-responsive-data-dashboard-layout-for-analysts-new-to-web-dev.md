---
title: "CSS Grid vs. Flexbox: Building a Responsive Data Dashboard Layout for Analysts New to Web Dev"
date: "2026-11-16"
tags: ["web-development", "css", "beginner"]
excerpt: "The two CSS layout systems analysts run into first when building a portfolio dashboard, and a simple rule for which one to reach for."
---

If you're coming from Excel or Power BI into building your own portfolio site, the first real wall you hit isn't React — it's getting boxes to line up the way you want with CSS. Two layout tools do almost all of that work: Flexbox and Grid. They overlap enough to be confusing, but a simple rule separates them: Flexbox arranges things in one direction at a time; Grid arranges things in two directions at once.

**1. Flexbox is for a single row or column of items.** Think of a row of KPI cards, a navbar with a logo on the left and links on the right, or a stack of filter buttons. You turn a container into a flex container and its direct children line up along one axis:

```css
.kpi-row {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
```

`justify-content` controls spacing along that one axis, and `align-items` controls alignment across the other — but there's still only one axis you're actually laying items out along.

**2. Grid is for an actual grid — rows and columns together.** A dashboard layout with a sidebar, a header, and a main content area isn't one row of things; it's a 2D arrangement. Grid lets you define that directly:

```css
.dashboard {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: 60px 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
}
```

Named `grid-template-areas` are worth learning early — they let you read a layout's structure straight off the CSS instead of counting column numbers.

**3. The practical rule: start by asking "is this one line, or a layout?"** A set of tags under a blog post, a toolbar, a list of chart legend items — those are Flexbox. A page shell, a card grid of portfolio projects, a responsive table of KPI tiles that should wrap from four columns down to one on mobile — those are Grid.

**4. Grid makes "four columns on desktop, one on mobile" a two-line change.** This is the pattern that matters most for a data portfolio's project grid or chart gallery:

```css
.project-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

@media (max-width: 640px) {
  .project-grid {
    grid-template-columns: 1fr;
  }
}
```

No JavaScript, no breakpoint-counting logic — just a different column definition inside a media query, and every card reflows automatically.

**5. You'll usually use both in the same page, nested.** A typical dashboard page uses Grid for the overall shell (sidebar, header, main), and Flexbox inside individual pieces of that shell (the row of buttons in the header, the stack of stat labels inside a KPI card). Neither tool replaces the other — Grid owns the big structure, Flexbox owns the small arrangements inside it.

Once that split clicks, most "why won't this div line up" moments stop being a CSS mystery and start being a one-line decision between the two.
