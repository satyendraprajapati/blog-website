---
title: "Automating PowerPoint Reports with Python and python-pptx"
date: "2026-07-21"
tags: ["powerpoint", "python", "automation"]
excerpt: "How to generate a slide deck straight from your data with python-pptx, instead of manually copy-pasting charts into PowerPoint every week."
---

If a weekly or monthly report means opening last week's deck, deleting the old charts, and pasting in new ones, that process is a script waiting to happen. `python-pptx` builds `.pptx` files programmatically from a template, which means the deck can be regenerated from fresh data in seconds instead of a recurring twenty-minute chore.

**1. Install the library.**
```bash
pip install python-pptx
```

**2. Start from your existing template, not a blank deck.** Open the `.pptx` file you already use for reports — the one with your fonts, colors, and layout — and load it directly instead of building slides from scratch. This keeps every generated deck visually consistent with your manual ones.
```python
from pptx import Presentation

prs = Presentation("report_template.pptx")
```

**3. Find the layout you want and add a slide.** Templates expose named or indexed layouts; a "Title and Content" layout is usually index 1.
```python
slide_layout = prs.slide_layouts[1]
slide = prs.slides.add_slide(slide_layout)
slide.shapes.title.text = "Weekly Revenue Summary"
```

**4. Drop in a table straight from your data.** Rather than manually re-typing numbers, populate a table shape directly from a pandas DataFrame or a list of rows.
```python
rows, cols = df.shape[0] + 1, df.shape[1]
table_shape = slide.shapes.add_table(rows, cols, left, top, width, height)
table = table_shape.table

for col_idx, col_name in enumerate(df.columns):
    table.cell(0, col_idx).text = str(col_name)

for row_idx, row in enumerate(df.itertuples(index=False), start=1):
    for col_idx, value in enumerate(row):
        table.cell(row_idx, col_idx).text = str(value)
```

**5. Add a chart image generated separately.** `python-pptx` doesn't build charts from raw numbers the way Excel does — the more reliable path is to render the chart with matplotlib or your usual plotting library, save it as a PNG, and place it on the slide.
```python
slide.shapes.add_picture("revenue_chart.png", left, top, width=Inches(6))
```

**6. Save and you're done.**
```python
prs.save("Weekly Revenue Summary.pptx")
```

**7. Wrap it in a script you can rerun.** Once the pipeline works for one week's data, the whole thing — pull data, build the chart image, populate the template, save the deck — becomes a single script you run each reporting cycle instead of a manual rebuild. Pair it with a scheduled task (cron, Task Scheduler, or a GitHub Action) and the deck can be waiting in a shared folder before anyone asks for it.

The tradeoff is upfront setup time: a hand-built deck for one report is faster than writing and debugging a script. But the moment the same report recurs more than a few times, the automated version pays for itself, and it removes an entire category of "I forgot to update slide 4" mistakes.
