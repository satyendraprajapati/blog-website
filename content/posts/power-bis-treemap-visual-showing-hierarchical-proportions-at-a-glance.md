---
title: "Power BI's Treemap Visual: Showing Hierarchical Proportions at a Glance"
date: "2026-11-08"
tags: ["power-bi", "data-visualization", "beginner"]
excerpt: "When a treemap's nested rectangles communicate share-of-total faster than a bar chart, how Power BI builds one from a hierarchy, and the cases where it quietly misleads."
---

A bar chart ranks categories well, but once you want to show both "which category is biggest" and "how the categories nest within a parent group" at the same time, a treemap does it in one glance instead of two charts. Power BI ships it as a built-in visual, no custom import required.

**1. A treemap encodes value as rectangle area, not height or position.** Each category gets a rectangle sized proportionally to its measure — bigger value, bigger rectangle — tiled together to fill the available space with no gaps. That's the whole trick: you're reading relative size, not reading an axis, which is why it works well for "what share of total revenue does each product category have" questions where the exact number matters less than the proportion.

**2. Drop a single category field into Group and a measure into Values for the simplest version.** With one field in the Group well, Power BI draws one rectangle per category, sized by the measure and colored by default per category. This alone beats a pie chart once you're past four or five slices, since area differences are easier to compare than angle differences.

**3. A second field in Group nests sub-categories inside each parent's rectangle.** Add `Sub-Category` under `Category` in the Group well and the treemap draws an outer rectangle per category, subdivided into inner rectangles per sub-category — so you can see both "Electronics is our biggest category" and "within Electronics, Phones dominate" in the same visual, without drilling through to a second page.

**4. Drilling still works the same way it does on any Power BI visual.** With a hierarchy in Group, the drill arrows in the visual header let you step down one level at a time instead of showing every level nested at once, which keeps the treemap readable when a hierarchy has three or more levels — nesting all of them inside one rectangle layout gets cluttered fast.

**5. A treemap is the wrong tool once you need to compare values precisely, or the category count gets large.** Area is hard to judge accurately — a rectangle that's 20% bigger than another doesn't visually read as "20% bigger" the way a bar chart's length does. And with more than a dozen or so categories, the smallest rectangles shrink into unreadable slivers with no visible label. If a report user needs to read off close values rather than just spot the biggest one, a sorted bar chart does that job better.

**6. Use conditional formatting on the measure, not the visual's default category colors, when a treemap needs to flag status rather than just size.** By default, a treemap colors each rectangle a different shade per category, which tells you nothing about performance. Binding the Values field's conditional formatting to a measure — say, red through green based on variance to target — turns the same layout into a status map: size shows how much a category matters, color shows whether it's on track.

A treemap is a narrow-purpose visual — it earns its place on a page when "which few things make up most of the total, and how are they grouped" is the actual question, not as a default replacement for a bar chart.
