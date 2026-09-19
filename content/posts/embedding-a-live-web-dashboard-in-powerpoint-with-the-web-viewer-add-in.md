---
title: "Embedding a Live Web Dashboard in PowerPoint with the Web Viewer Add-In"
date: "2026-09-19"
tags: ["powerpoint", "add-ins", "dashboard"]
excerpt: "Not every dashboard a stakeholder needs on a slide lives in Power BI — the Web Viewer add-in embeds any public dashboard URL as a live, scrollable web page right inside the deck."
---

Power BI has its own embed add-in, but plenty of data analysts also work with dashboards in Tableau Public, Looker Studio, a published Google Sheet, or an internal web app — tools with no dedicated PowerPoint integration of their own. The Web Viewer add-in fills that gap: it embeds any URL as a live, interactive web page inside a slide, no matter what built it.

**1. Install Web Viewer from `Insert > Add-ins > More Add-ins` and search the Office Add-ins Store.** It's a free, Microsoft-listed add-in — install it once and it's available in every deck you open afterward, listed under `Insert > My Add-ins` from then on.

**2. Paste in a public or shareable URL, not a login-gated one.** The add-in renders the page inside an embedded browser frame with no way to authenticate through it, so it works cleanly with a Tableau Public view, a Looker Studio report set to "Anyone with the link," or a published (not shared-with-specific-people) Google Sheet — but it will just show a login wall if you point it at something that needs credentials the viewer doesn't have.

**3. It renders live, which cuts both ways.** Unlike a linked picture or an exported chart, the embedded page reflects the dashboard's current state every time the slide is viewed — genuinely useful for a KPI page that updates hourly. The tradeoff is the same one: it also needs an active internet connection during the presentation, and a slow or flaky connection in a live meeting room is a worse failure mode than a static picture would ever have.

**4. Resize the web view to hide chrome you don't want on the slide.** A dashboard built for a full browser window usually carries its own header, nav bar, and page furniture that looks cluttered cropped into a 16:9 slide. Where the source tool supports it, use its own embed or presentation-mode URL parameter (Looker Studio and Tableau both offer one) rather than the plain page URL, so what loads inside the add-in is already a clean, chrome-free view.

**5. Treat it as a live view, not a leave-behind.** Anyone who reopens the .pptx file without a live connection sees a blank or broken frame where the dashboard was, which makes this the wrong tool for a deck that will be emailed around and opened later. For that audience, export a static screenshot or picture of the dashboard onto a duplicate slide as a fallback, and keep the live Web Viewer version for when you're actually presenting from a connected machine.

**6. Test the actual presenting network beforehand, not just your desk Wi-Fi.** A conference room's guest network or a client site's locked-down firewall can block the page the add-in is trying to load even though it renders fine at your desk — load the slide once on the real presenting setup ahead of time rather than discovering a blank frame mid-meeting.

For the specific case of a Power BI report, the dedicated Power BI add-in is still the better choice — it handles authentication and report navigation Web Viewer can't. But for every other dashboard tool without its own PowerPoint integration, Web Viewer is the difference between a live, current view on the slide and a screenshot that was already stale by the time you presented it.
