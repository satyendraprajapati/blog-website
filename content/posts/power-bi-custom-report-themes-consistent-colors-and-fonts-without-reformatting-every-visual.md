---
title: "Power BI Custom Report Themes: Consistent Colors and Fonts Without Reformatting Every Visual"
date: "2026-08-11"
tags: ["power-bi", "theming", "beginner"]
excerpt: "How to define a report's colors, fonts, and visual defaults once in a JSON theme file, instead of manually restyling every chart, card, and table you add to a Power BI report."
---

Formatting each visual by hand — picking a color for every chart, resetting the font on every card — doesn't scale past a couple of pages, and it's the first thing that falls out of sync when someone else edits the report later. A custom theme fixes both problems: define the look once in a JSON file, apply it, and every new visual you add inherits it automatically.

**1. Start from a theme you can edit, not a blank one.** In Power BI Desktop, go to View → Themes → Browse for themes to apply an existing `.json` theme file, or use Customize current theme to open a dialog and export what it generates as a starting point. Editing a real exported theme is far less error-prone than writing one from scratch, since the schema has more optional properties than the dialog exposes.

**2. Set your brand colors as the default data color sequence.** The `dataColors` array controls the order colors are assigned to categories in charts — the first color goes to the first series, and so on. Keeping this list short and deliberate (5–8 colors) also nudges you away from charts with more categories than a viewer can actually track.
```json
{
  "name": "Company Report Theme",
  "dataColors": ["#2E5EAA", "#F2A007", "#6E9887", "#C4553D", "#8A6BBE"],
  "background": "#FFFFFF",
  "foreground": "#252423",
  "tableAccent": "#2E5EAA"
}
```

**3. Set a base font once instead of per-visual.** The `textClasses` section lets you define font family and size for titles, labels, and callout values across the whole report, so a rebrand or a font-size adjustment for accessibility is a one-line change instead of visiting every visual's Format pane individually.
```json
"textClasses": {
  "label": { "fontFace": "Segoe UI", "fontSize": 10 },
  "title": { "fontFace": "Segoe UI Semibold", "fontSize": 14 },
  "callout": { "fontFace": "Segoe UI Semibold", "fontSize": 28 }
}
```

**4. Style specific visual types beyond just colors.** The `visualStyles` section can target a visual type — like `card` or `slicer` — and set defaults such as border visibility, background, or padding, so every card you drop onto the canvas already matches your layout instead of needing the same three format tweaks applied by hand each time.

**5. Apply the theme to the whole report, not one page.** Once imported through View → Themes, the theme applies report-wide and persists in the `.pbix`/`.pbip` file — a colleague opening the same file sees the same styling without needing the JSON file separately, though keeping it in source control alongside the report is worth doing if multiple people maintain it.

**6. Reuse the same theme file across reports for a consistent portfolio.** If you're building several reports for the same team or client, importing the identical theme JSON into each one keeps them visually consistent without redoing the color and font decisions per file — the same principle as a PowerPoint slide master, applied to Power BI.

**7. Validate with Power BI's theme JSON schema before importing.** A malformed theme file fails to import with a vague error rather than a line number. Power BI publishes the official theme schema you can validate against in any JSON editor that supports schema checking, which turns a trial-and-error import loop into catching the typo before you even open Power BI.

Once a theme is in place, formatting a new visual becomes mostly about layout and interactivity rather than color — the visual already looks like it belongs in the report the moment you drop it on the canvas.
