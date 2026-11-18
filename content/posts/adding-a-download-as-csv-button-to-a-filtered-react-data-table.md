---
title: "Adding a Download-as-CSV Button to a Filtered React Data Table"
date: "2026-11-18"
tags: ["web-development", "react", "beginner"]
excerpt: "How to let visitors export whatever rows are currently showing in a React data table to a CSV file, entirely client-side, with no backend."
---

A data portfolio site often shows a filterable table — a dataset explorer, a project list, a dashboard-style grid. The natural next request from a visitor is "can I get this in a spreadsheet?" You don't need a server endpoint for that: the browser can turn an array of objects into a downloadable file on its own.

**1. Export the filtered rows, not the full dataset** — the whole point is that the CSV should match what's on screen. If your table state looks like `filteredRows` (the output after search and column filters are applied), that's the array to convert — not the original, unfiltered data the component loaded.

**2. Write a small, dependency-free CSV serializer** — you don't need a library for this. A basic version just needs to handle commas and quotes inside values:

```js
function toCSV(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value) => {
    const str = String(value ?? "");
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ];
  return lines.join("\n");
}
```

**3. Turn the string into a downloadable file with a Blob** — the browser's `Blob` and `URL.createObjectURL` handle the rest without any network request:

```js
function downloadCSV(rows, filename = "export.csv") {
  const csv = toCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```

Creating and clicking a throwaway `<a download>` element is still the most reliable cross-browser way to trigger a save dialog for in-memory content — there's no native "save this blob" API that skips the anchor tag.

**4. Wire it to a button next to the filter controls** — keep it visually attached to the filters so it's obvious the export respects them:

```jsx
<button onClick={() => downloadCSV(filteredRows, "projects.csv")}>
  Download CSV ({filteredRows.length} rows)
</button>
```

Showing the row count in the label is a small touch that reassures someone that "48 rows" really means the filtered set, not everything.

**5. Add a BOM if the file needs to open cleanly in Excel** — plain UTF-8 CSVs with non-ASCII characters (accented names, currency symbols) can show up garbled in Excel on Windows unless you prepend a byte-order mark:

```js
const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
```

It's a one-line change, but it's the difference between a file that opens perfectly in Google Sheets and garbles the first cell in Excel.

**6. Disable the button on an empty result set** — if filtering can produce zero rows, guard against exporting a header-only file that looks like a bug: `disabled={filteredRows.length === 0}` is enough, paired with a short explanation in the button's title attribute.

The whole feature is under 30 lines of plain JavaScript, works offline, and needs no API route, no serverless function, and no third-party export service — which is exactly the kind of small, self-contained addition a static React site is good at.
