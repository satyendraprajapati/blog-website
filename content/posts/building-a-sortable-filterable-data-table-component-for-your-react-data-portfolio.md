---
title: "Building a Sortable, Filterable Data Table Component for Your React Data Portfolio"
date: "2026-09-12"
tags: ["web-development", "react", "data-visualization"]
excerpt: "A chart shows the trend, but letting a visitor sort and search the actual rows behind a case study gives them something a screenshot of a PivotTable never could — plain React state, no table library."
---

A dashboard screenshot on a project page proves the analysis happened, but it's a dead end for a visitor who wants to check one specific row. A small, sortable, filterable table component turns the same dataset into something they can actually explore, and it doesn't need a grid library — a plain JavaScript array and a bit of React state cover the whole feature.

**1. Start from data you're already loading.** If a project page already imports a JSON or CSV export for a chart, reuse that same array for the table instead of maintaining a second copy of the numbers. Keeping one source of truth means the chart and the table can never silently disagree.

**2. Track sort column and direction in state, not in the data itself.** Don't mutate or re-order the original array — derive a sorted copy on render instead, so the underlying dataset stays intact if you add another view of it later.
```jsx
const [sortKey, setSortKey] = useState('revenue')
const [sortDir, setSortDir] = useState('desc')

const sortedRows = [...rows].sort((a, b) => {
  const diff = a[sortKey] > b[sortKey] ? 1 : -1
  return sortDir === 'asc' ? diff : -diff
})
```

**3. Make header clicks toggle direction on the same column.** Clicking a column that's already sorted should flip ascending/descending instead of doing nothing — it's the behavior every spreadsheet trains people to expect.
```jsx
function handleSort(key) {
  if (key === sortKey) {
    setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
  } else {
    setSortKey(key)
    setSortDir('asc')
  }
}
```

**4. Add a single text filter that checks every visible column.** A per-column filter UI is overkill for a case study table with a few dozen rows — one search box that matches against a joined string of each row's values covers almost every real use case a visitor has.
```jsx
const [query, setQuery] = useState('')

const visibleRows = sortedRows.filter((row) =>
  Object.values(row).join(' ').toLowerCase().includes(query.toLowerCase())
)
```

**5. Cap the initial render with a "show more" control instead of paginating.** A dataset with a few hundred rows will visibly slow down scrolling if you render all of it at once. Rendering the first 25–50 rows and revealing more on click is simpler to build than pagination and fits better on a single scrolling project page.

**6. Format numbers and dates for a reader, not for the source data.** A raw `1234567.891` or an ISO date string reads fine in a spreadsheet and poorly on a web page — run each column through `toLocaleString()` or a small formatter function at render time, keeping the underlying value untouched for sorting.

**7. Give the table a caption and column headers a `scope="col"`.** These two small additions cost nothing and mean a screen reader announces the table's purpose and column meaning correctly — worth doing on a portfolio site where a hiring manager's tooling matters as much as the content.

The result isn't a spreadsheet in the browser, and it doesn't need to be — a hundred lines of plain React covers sort, filter, and a "show more" button, and it's usually a more convincing demonstration of your data skills than a static screenshot ever was.
