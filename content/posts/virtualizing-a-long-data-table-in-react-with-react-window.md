---
title: "Virtualizing a Long Data Table in React with react-window So Large Datasets Don't Lag the Page"
date: "2026-11-06"
tags: ["web-development", "react", "portfolio"]
excerpt: "Rendering only the visible rows of a large dataset in React keeps scrolling smooth where mapping the full array doesn't."
---

Rendering a table by mapping an array into `<tr>` elements works fine for a few hundred rows. Once a dataset grows into the thousands, the browser is building and keeping thousands of DOM nodes alive even though only 20 or 30 are ever visible at once — scrolling gets janky and the initial render stalls. Virtualization fixes this by rendering only the rows currently in view.

**1. Install the library.** `react-window` is a small, maintained successor in the same family as the older `react-virtualized`, and it's a good default for a simple fixed-height table:
```bash
npm install react-window
```

**2. Swap the full-list render for a `FixedSizeList`.** Instead of mapping every row, you hand the list a total row count and a row height, and it renders only what fits in the viewport plus a small buffer:
```jsx
import { FixedSizeList } from "react-window";

function DataRow({ index, style }) {
  const row = data[index];
  return (
    <div style={style} className="grid grid-cols-4 border-b px-3 py-1">
      <span>{row.name}</span>
      <span>{row.category}</span>
      <span>{row.value}</span>
      <span>{row.date}</span>
    </div>
  );
}

<FixedSizeList height={480} width="100%" itemCount={data.length} itemSize={36}>
  {DataRow}
</FixedSizeList>
```
The `style` prop passed into each row is what actually positions it — `react-window` absolutely-positions rows based on their index rather than relying on normal document flow, so it has to be spread onto the row's outer element.

**3. Keep row height constant, or budget for the variable-size variant.** `FixedSizeList` assumes every row is the same height, which is true for most tabular data. If some rows wrap onto two lines, `VariableSizeList` takes a function that returns height per index instead of a single number — it's more setup, so only reach for it if rows genuinely vary.

**4. Filtering and sorting still happen on the full array, before virtualization.** Virtualization only changes what gets rendered, not what gets computed — filter and sort `data` as you normally would, then pass the resulting array's length and lookup into the list. Nothing about this trick changes how you manage state.

**5. Don't virtualize a table that's already short.** The overhead of absolute positioning and the loss of plain scrollable markup (harder to `Ctrl+F`, no native row selection by click-drag) isn't worth it under a thousand or so rows. Reach for it specifically when a dataset is large enough that mapping the full array is the actual bottleneck — profile first if you're not sure.

For a data portfolio showing a raw dataset alongside a chart, this is usually the difference between a table that scrolls instantly and one that visibly stutters the moment someone drops in a CSV with real row counts.
