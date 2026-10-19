---
title: "Formatting Dates Consistently in Your React Blog with Intl.DateTimeFormat"
date: "2026-10-19"
tags: ["web-development", "react", "javascript"]
excerpt: "A post date, a case-study timeline, and a chart axis label all end up formatted differently when each component hand-rolls its own date string -- Intl.DateTimeFormat fixes that with no library."
---

A post card showing `new Date(post.date).toLocaleDateString()` and a case-study timeline showing a manually built `"${month}/${day}/${year}"` string will drift apart the moment either one changes, because each component is doing its own ad hoc date logic. `Intl.DateTimeFormat` is built into every browser, needs no dependency like `date-fns` or `dayjs`, and gives every date on the site the same formatting from one shared definition.

**1. Stop building date strings by hand.** Pulling `getMonth()`, `getDate()`, and `getFullYear()` off a `Date` object and concatenating them gets the month off by one (it's zero-indexed) more often than it should, and still needs a lookup table for month names. `Intl.DateTimeFormat` handles both from a single config object:

```js
const postDate = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

postDate.format(new Date('2026-03-14')); // "March 14, 2026"
```

**2. Use a shorter format for places where space is tight.** A post card grid or a table row doesn't need the full month name — the same formatter object, just with different options, covers it:

```js
const shortDate = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

shortDate.format(new Date('2026-03-14')); // "Mar 14, 2026"
```

**3. Add a relative format for "posted 3 days ago" without a library.** `Intl.RelativeTimeFormat` is the lesser-known sibling that covers this directly, rounding to the right unit instead of showing raw day counts past a certain age:

```js
const relative = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });

relative.format(-3, 'day'); // "3 days ago"
relative.format(-1, 'month'); // "last month"
```

**4. Create each formatter once, not on every render.** Like `Intl.NumberFormat`, constructing `new Intl.DateTimeFormat(...)` does real parsing work, and building it fresh inside a component body means every re-render pays that cost again. Define the formatters once in a shared module and just call `.format()` on the cached instance:

```js
// lib/dateFormatters.js
export const longDate = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export const shortDate = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});
```

**5. Import the shared formatters everywhere a date gets displayed.** A `PostCard`, a single post's header, and a case-study timeline all end up calling `longDate.format(new Date(post.date))` from the same file, which is what actually guarantees a post from January and a post from October look consistent next to each other:

```jsx
import { shortDate } from '../lib/dateFormatters';

function PostCard({ title, date }) {
  return (
    <article className="rounded-lg border p-4">
      <h3 className="font-semibold">{title}</h3>
      <time dateTime={date} className="text-sm text-gray-500">
        {shortDate.format(new Date(date))}
      </time>
    </article>
  );
}
```

**6. Watch for timezone surprises with date-only strings.** A frontmatter date like `"2026-03-14"` with no time component is parsed by `new Date()` as UTC midnight, which can render as March 13 for a reader in a negative UTC offset. Appending a time (`new Date("2026-03-14T00:00:00")`) parses it in the browser's local timezone instead, which is almost always what you want for a post date that shouldn't shift depending on where the reader is.

It's a small change, but it's the same payoff as formatting numbers from one shared module: every date on the site ends up looking like it came from the same design decision instead of whichever component happened to write its own `toLocaleDateString()` call first.
