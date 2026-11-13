---
title: "Debouncing a Filter Input in a React Data Dashboard So It Doesn't Re-Filter on Every Keystroke"
date: "2026-11-13"
tags: ["web-development", "react", "performance", "beginner"]
excerpt: "A text filter wired straight to onChange re-runs the filter on every single keystroke — debouncing it waits for a short pause in typing before doing the expensive work."
---

A free-text filter above a data table — "search by name," "filter by SKU" — is usually wired up the obvious way: an `onChange` handler updates state, and that state drives the filtered list on every render. For a small array that's invisible. For a few thousand rows, or a filter that also re-renders a chart, it means every keystroke triggers a full re-filter, and a fast typist can visibly make the UI stutter. Debouncing fixes this by waiting for a short pause in typing before doing the expensive work.

**1. The problem is specific: it's not the typing, it's what runs after it.** Updating the input's own value on every keystroke is cheap and should stay instant — the box needs to feel responsive. The cost is in whatever reacts to that value: filtering an array, re-rendering a chart, or firing a request. Debouncing separates the two, so the input updates immediately while the expensive reaction waits.

**2. A debounced value is just state that lags behind the real one.** The simplest version is a custom hook that mirrors a value into its own state, but only after a delay with no further changes:
```javascript
import { useState, useEffect } from "react";

function useDebouncedValue(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
```

**3. The cleanup function is what makes this actually debounce, not just delay.** Every time `value` changes, `useEffect` re-runs — but first it calls the cleanup from the *previous* run, canceling the pending timer. So typing five characters in under 300ms schedules and cancels four timers in a row, and only the fifth one ever actually fires. Skip the `return () => clearTimeout(timer)` line and you get a delay on every keystroke instead of a debounce — the filter would still re-run five times, just 300ms late each time.

**4. Wire it in by filtering on the debounced value, not the raw one.** The input stays bound to the instant state so it never feels laggy; only the filtering logic reads the debounced copy.
```javascript
function ProjectFilter({ projects }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  const visible = projects.filter((p) =>
    p.name.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ProjectList projects={visible} />
    </>
  );
}
```

**5. Pick the delay based on what's downstream, not a default you copied.** 150–300ms is a reasonable starting point for filtering an in-memory array — fast enough that it still feels live, slow enough to skip most intermediate keystrokes. A filter that triggers a network request usually wants something closer to 400–500ms, since the cost of an extra request is higher than the cost of an extra array pass.

**6. Debouncing and throttling solve different problems — don't reach for the wrong one.** Debouncing waits for a pause and then fires once; it's right for "the user finished typing." Throttling fires at a fixed maximum rate regardless of pauses, which fits continuous events like scroll or drag instead. A search box wants a debounce; a scroll-triggered "load more" wants a throttle.

**7. Not every filter needs this.** If the list behind the filter is small — a few dozen portfolio projects, say — filtering on every keystroke costs nothing measurable, and adding a debounce just adds a perceptible lag between typing and seeing results for no real benefit. Reach for this once the list is large enough, or the reaction expensive enough, that the stutter is actually visible.

The whole pattern is one small hook, but it's the difference between a filter that feels instant no matter how fast someone types and one that visibly fights the keyboard on anything beyond a trivial dataset.
