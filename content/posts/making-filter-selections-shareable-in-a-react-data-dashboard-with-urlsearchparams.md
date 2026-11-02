---
title: "Making Filter Selections Shareable in a React Data Dashboard with URLSearchParams"
date: "2026-11-02"
tags: ["web-development", "react", "portfolio"]
excerpt: "Component state loses a visitor's filter choices on refresh and can't be linked to — mirroring it into the URL with React Router's useSearchParams fixes both for almost no extra code."
---

A filter built with plain `useState` works fine while someone's actively using it, but refresh the page or send someone the link and the selection is gone — they land back on the unfiltered view. For a data table or dashboard on a portfolio site, that means you can't link a recruiter straight to "just the Power BI projects" or bookmark your own filtered view of a dataset. Moving the filter state into the URL's query string fixes both problems at once.

**1. Swap `useState` for `useSearchParams` from React Router.** If the site already uses React Router for navigation, this is almost a drop-in replacement — it behaves like `useState`, but the "state" lives in the URL instead of component memory.
```javascript
import { useSearchParams } from "react-router-dom";

const [searchParams, setSearchParams] = useSearchParams();
const region = searchParams.get("region") ?? "all";
```

**2. Update the URL the same way you'd update state — don't hand-build query strings.** Calling `setSearchParams` with a plain object replaces the query string for you and triggers a re-render, exactly like `setState` would.
```javascript
function handleRegionChange(newRegion) {
  setSearchParams({ region: newRegion });
}
```

**3. Preserve the other filters when one of them changes.** `setSearchParams` replaces the whole query string by default, so changing just the region filter will silently wipe out a date-range filter sitting alongside it unless you spread the existing params first.
```javascript
function handleRegionChange(newRegion) {
  setSearchParams((prev) => {
    const next = new URLSearchParams(prev);
    next.set("region", newRegion);
    return next;
  });
}
```

**4. Read the params to derive the filtered list, the same as you would from state.** Nothing about the filtering logic itself changes — only where the current selection comes from.
```javascript
const visibleProjects = region === "all"
  ? projects
  : projects.filter((p) => p.region === region);
```

**5. Give every filter a sensible default when its param is missing.** The very first time someone opens the page, there's no `region` param at all — `searchParams.get("region")` returns `null`, not `"all"`. Falling back explicitly (as in tip 1, with `?? "all"`) avoids a blank filter state that doesn't match any of your actual filter options.

**6. Multi-select filters need a delimiter, since a URL param is just one string.** For something like the tool-tag filter chips on a projects grid, join the selected values with a comma when writing to the URL, and split on it when reading back.
```javascript
setSearchParams({ tools: selectedTools.join(",") });
const tools = (searchParams.get("tools") ?? "").split(",").filter(Boolean);
```

**7. Keep it out of anything that changes on every keystroke.** A free-text search box updating the URL on every character makes the browser's back button step through individual letters instead of meaningful states. Debounce the URL update, or only sync it on blur/submit, while still updating the input's own local state instantly for a responsive feel.

The upside is proportional to how much anyone besides you uses the filtered view — a personal scratch dashboard might not need it, but a portfolio grid, a public dataset explorer, or anything you'd want to drop into a message as a specific filtered link benefits from state that survives a refresh and travels in the URL itself.
