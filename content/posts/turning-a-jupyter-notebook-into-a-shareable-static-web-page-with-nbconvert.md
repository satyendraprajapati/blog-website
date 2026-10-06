---
title: "Turning a Jupyter Notebook Into a Shareable Static Web Page With nbconvert"
date: "2026-10-06"
tags: ["web-development", "python", "beginner"]
excerpt: "How to export a Jupyter notebook to a clean, standalone HTML page with nbconvert so a non-technical stakeholder can see your analysis without opening Jupyter or GitHub."
---

A finished analysis notebook is awkward to hand off. Sending the `.ipynb` file itself only works if the recipient has Jupyter installed and knows how to open it; a GitHub link renders the notebook but still looks like source code, not a report. `nbconvert`, which ships with Jupyter, solves this by exporting the notebook straight to a self-contained HTML page anyone can open in a browser — no server, no login, no Python required to view it.

**1. Run the export from the command line, pointing at the notebook file.** From a terminal in the notebook's folder, the basic command produces an `.html` file with the same name, sitting right next to the original.
```bash
jupyter nbconvert --to html analysis.ipynb
```
That single file bundles the rendered markdown, code cells, and any charts you generated inline (matplotlib, plotly, etc.) into one page with no external dependencies to break later.

**2. Hide the code cells if the audience only cares about the results.** A stakeholder reading a revenue analysis doesn't need to scroll past twenty lines of pandas to get to the chart. The `--no-input` flag strips code cells from the output while keeping markdown text, tables, and visuals exactly as they rendered.
```bash
jupyter nbconvert --to html --no-input analysis.ipynb
```
Keep a second copy with code included for anyone who wants to check your work — don't overwrite the version colleagues might want to audit.

**3. Use `--to webpdf` instead when someone wants a file they can print or attach to an email.** HTML is the right format for sharing a link, but not everyone wants to open a browser just to read a one-page summary. `webpdf` renders the same notebook through a headless browser and saves a PDF with charts intact, which plain `--to pdf` (LaTeX-based) often struggles with for plotly or interactive-heavy notebooks.
```bash
jupyter nbconvert --to webpdf --no-input analysis.ipynb
```

**4. Host the exported HTML for free instead of emailing a file around.** A static HTML export is just a web page — drop it in a GitHub repo and enable GitHub Pages, or drag it into a Netlify "deploy manually" upload, and it gets a real URL you can share in Slack or an email instead of a file attachment that different people will open differently depending on their browser's download settings.

**5. Re-run the whole notebook before exporting, not just the cells you touched last.** `nbconvert` exports whatever output is currently saved in the notebook's cells — if you edited a cell near the top after already running everything below it, the exported page can show numbers that don't match the code underneath them. Clearing all outputs and running the notebook top to bottom right before export (`Kernel → Restart & Run All` in Jupyter, or `jupyter nbconvert --execute` from the command line) guarantees what gets shared is what the current code actually produces.
```bash
jupyter nbconvert --to html --no-input --execute analysis.ipynb
```

The result reads like a lightweight, purpose-built report instead of a spreadsheet of code — which is usually exactly what a stakeholder wanted from the analysis in the first place.
