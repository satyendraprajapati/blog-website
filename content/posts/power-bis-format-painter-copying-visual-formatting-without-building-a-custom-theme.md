---
title: "Power BI's Format Painter: Copying Visual Formatting Without Building a Custom Theme"
date: "2026-09-29"
tags: ["power-bi", "productivity", "beginner"]
excerpt: "A custom report theme is the right fix for a new report, but for one visual that already looks correct, Format Painter copies its exact formatting onto every other visual in a couple of clicks."
---

Setting up a custom JSON theme is the correct move when you're starting a report from scratch. But if you already have a report with fifteen visuals and one of them — say, a bar chart with the right font, colors, and border radius — looks exactly how you want the rest to look, rebuilding a theme file around it is a lot of ceremony for a problem Power BI already has a one-click fix for: **Format Painter**.

**1. Find it on the visual you want to copy from.** Select the visual whose formatting you like, then look in the ribbon's Home tab for the Format Painter icon (a paintbrush). It's the same metaphor as Word and Excel's version, just scoped to a single visual's format pane settings instead of cell or text formatting.

**2. Click it, then click the target visual.** Your cursor turns into a paintbrush. Click any other visual on the canvas and Power BI copies over data colors, fonts, borders, background, and title styling from the source visual — everything under that visual's Format pane, translated as closely as the target visual type allows.

**3. Hold it down for multiple targets.** A single click applies the format once and releases the paintbrush. Double-click the Format Painter icon instead, and it stays active so you can click through several visuals in a row — useful when you've just built five KPI cards and want all of them to match the first one you formatted by hand.

**4. Expect some settings not to carry over between different visual types.** Painting from a bar chart onto a card or a matrix copies what actually applies — background, font family, title — but a bar chart's axis settings have nowhere to land on a card, so they're simply skipped rather than causing an error. It's closest to a perfect copy between two visuals of the same type.

**5. Use it to catch drift after a mid-project style change.** If a stakeholder asks for a different accent color three-quarters of the way through building a report, reformat one visual to the new standard, then Format Painter it onto the rest instead of manually reopening the Format pane on every single one.

**6. Still switch to a real theme once the report is done.** Format Painter is fast for iterating on a small number of visuals, but it doesn't persist anywhere — a brand-new visual you add next week starts from Power BI's defaults again, and it does nothing for other reports in the same workspace. Once the formatting has settled, capture it in a custom theme JSON file so every future report and every new visual in this one inherits it automatically, instead of continuing to paint formatting by hand one visual at a time.

Think of Format Painter as the fast, local fix and a custom theme as the durable one — reach for the paintbrush mid-build, and graduate to a theme file once you know what "done" looks like.
