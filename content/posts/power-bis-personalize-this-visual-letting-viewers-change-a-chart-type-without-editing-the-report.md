---
title: "Power BI's Personalize This Visual: Letting Viewers Change a Chart Type Without Editing the Report"
date: "2026-09-15"
tags: ["power-bi", "reports", "self-service-bi"]
excerpt: "Personalize This Visual lets a report viewer swap a chart type or measure on the fly, without edit access or touching the underlying report anyone else sees."
---

Every viewer of a report wants something slightly different from the same chart — one person wants it as a bar instead of a line, another wants to see the values as a percent instead of a raw count. Building a separate page for each preference doesn't scale. **Personalize This Visual** solves this by letting a viewer temporarily reshape a visual for themselves, in the browser or mobile app, with zero effect on what anyone else sees.

**1. Turn it on in Power BI Desktop before publishing.** It's off by default. Go to *File → Options and settings → Options → Report settings*, and enable *Personalize visuals* under Current File. This has to be set before you publish — enabling it later means republishing the report for the option to appear for viewers.

**2. Viewers find it from the visual's own menu, not a report-wide setting.** In the published report, a viewer hovers a visual and clicks the "..." menu, then chooses **Personalize this visual**. A panel opens letting them swap the chart type (bar to line, for instance), change which measure or field is plotted, or adjust how values are summarized — all without any editing permissions on the report itself.

**3. Understand what it can and can't change.** A viewer can restyle and re-plot using fields already on the report's underlying dataset, but they can't add a field that isn't already exposed, build a new measure, or touch filters, page layout, or any other visual. It's reshaping one visual with existing ingredients, not report editing with training wheels.

**4. Changes are personal and don't persist by default.** What a viewer picks in Personalize This Visual applies only to their own session — refresh the page or reopen the report later and it resets to the report author's original version, unless they explicitly save it as a personal bookmark. Nobody else viewing the same report, including the author, ever sees another viewer's personalization.

**5. It's a relief valve for "can you also add a version that shows X," not a replacement for good defaults.** If half your audience keeps requesting the same alternate view of a chart, that's a signal to build it into the report properly — as a second visual, a bookmark, or a field parameter — rather than leaving everyone to rediscover the same personalization independently. Reserve this feature for the long tail of individual preferences that don't justify a permanent addition to the report.

**6. Turn it off for reports where a specific view is the point.** A financial statement or a compliance report meant to be read exactly as designed is the wrong candidate for this setting — letting a viewer casually change a KPI's chart type invites confusion about what's the "real" number, especially if a screenshot of a personalized view gets shared without that context. Leave it enabled for exploratory or self-service dashboards, and off for anything where consistency of the message matters more than viewer flexibility.

Personalize This Visual costs nothing to turn on and quietly removes a whole category of "can you tweak this just for me" requests — the trade-off is making sure the report's real number is never ambiguous about which version someone is actually looking at.
