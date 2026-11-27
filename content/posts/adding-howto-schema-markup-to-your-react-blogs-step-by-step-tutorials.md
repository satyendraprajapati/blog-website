---
title: "Adding HowTo Schema Markup to Your React Blog's Step-by-Step Tutorials"
date: "2026-11-27"
tags: ["web-development", "seo", "react", "beginner"]
excerpt: "A HowTo JSON-LD block gives Google a machine-readable list of steps, and it can be generated straight from the numbered bold lead-ins most tutorial posts already use."
---

A lot of the tutorial-style posts on a data-analysis blog are already written the same way: a short intro, then a run of numbered steps with a **bold lead-in** phrase — "**1. Lay out the data before you touch the chart.**", "**2. Build the bands as a stacked bar chart first.**" and so on. That's precisely the shape schema.org's `HowTo` type expects. The only piece missing is telling search engines about it explicitly, the way this blog already does for FAQ and breadcrumb content elsewhere.

**1. Recognize that the content already has the structure you need.** Rather than inventing a new frontmatter field and duplicating every step by hand — which is how the FAQ schema on this blog is built — a `HowTo` post can pull its steps directly out of the markdown body that's already written for human readers.

**2. Extract the steps at build time with a small regex pass.** Add this to the markdown-loading helper, run once per post as it's parsed:

```js
function extractHowToSteps(markdownBody) {
  const stepPattern = /\*\*\d+\.\s(.*?)\*\*\s*(?:—|-)\s*([^\n]+)/g;
  const steps = [];
  let match;
  while ((match = stepPattern.exec(markdownBody)) !== null) {
    steps.push({ name: match[1].trim(), text: match[2].trim() });
  }
  return steps;
}
```

A post with no numbered bold lead-ins just returns an empty array, so nothing breaks for opinion pieces or announcement posts that were never meant to be step-by-step.

**3. Only emit the schema when there's a real sequence to show.** Google's structured data guidelines expect `HowTo` content to be a genuine set of instructions, not an arbitrary numbered list. Guard the output so a post with one or two stray numbered sentences — rather than an actual walkthrough — skips the markup entirely instead of publishing something thin:

```js
const steps = extractHowToSteps(post.body);
const hasHowTo = steps.length >= 3;
```

**4. Build the JSON-LD from the extracted steps, not a second copy of them.**

```jsx
function HowToSchema({ title, steps }) {
  if (steps.length < 3) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    step: steps.map((s) => ({
      "@type": "HowToStep",
      name: s.name,
      text: s.text,
    })),
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}
```

**5. Add a dev-only warning for silent regex misses.** If a post has three or more numbered paragraphs but the extractor finds zero steps, the most likely cause is a lead-in that doesn't follow the usual `**N. Phrase.** — explanation` pattern — a missing em dash, say. A one-line console warning in development catches that formatting drift before the post ships with a `HowTo` block that's empty, or worse, half-populated.

Run the published result through Google's Rich Results Test to confirm the steps come through. Because the schema is derived from the same sentences a reader sees, there's no second copy of the tutorial to keep in sync — edit a step once, and both the page and its markup change together.
