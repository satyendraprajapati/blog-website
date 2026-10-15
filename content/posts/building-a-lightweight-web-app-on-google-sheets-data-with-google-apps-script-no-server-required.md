---
title: "Building a Lightweight Web App on Google Sheets Data with Google Apps Script (No Server Required)"
date: "2026-10-15"
tags: ["web-development", "google-apps-script", "automation"]
excerpt: "How to turn a Google Sheet into a small web app's backend with Apps Script, so stakeholders get a simple page instead of raw spreadsheet access."
---

Not every internal tool needs a database and a hosting bill. If the data already lives in a Google Sheet, Apps Script can serve it as a small web page or JSON endpoint directly from Google's servers — no server to provision, no deploy pipeline, and nothing to pay for on the free tier.

**1. Open Apps Script from the sheet itself and write a `doGet` function.** `Extensions > Apps Script` opens a code editor bound to that spreadsheet. A function named `doGet` runs whenever someone visits the app's URL, and it can read the sheet directly.
```javascript
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");
  const rows = sheet.getDataRange().getValues();
  return ContentService
    .createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}
```

**2. Deploy it as a Web App to get a real, shareable URL.** `Deploy > New deployment`, choose type "Web app," set "Execute as" to yourself so it reads with your permissions, and set "Who has access" to whoever should be able to open it. Saving gives you an `https://script.google.com/...` URL that returns live data from the sheet every time it's loaded.

**3. Return HTML instead of JSON when the audience is a person, not a script.** Swap `ContentService` for `HtmlService` and point it at an HTML file in the same Apps Script project to render an actual page — a simple form, a search box, or a formatted table — instead of a wall of raw JSON.
```javascript
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}
```

**4. Build the one thing a spreadsheet is bad at: a focused, single-purpose view.** A full Sheet is intimidating to a non-analyst and easy to edit by accident. A tiny web app that only exposes a search box over order status, or a read-only summary of this week's numbers, gives stakeholders exactly what they need without handing them edit access to your source data.

**5. Every page load reads the sheet fresh — there's no separate database to keep in sync.** Update a cell in the spreadsheet and the next person to load the page sees the new value. That one-way simplicity is the entire appeal of this approach: the spreadsheet stays the single source of truth, and the web app is just a nicer window onto it.

**6. Know the limits before you rely on it for anything critical.** Apps Script enforces a roughly six-minute execution limit per request and daily quotas on things like URL fetches and email sends, and authentication is tied to Google accounts rather than a proper login system. It's a great fit for an internal tool used by a handful of colleagues — not for anything public-facing or high-traffic.

This isn't a replacement for a real web framework once a tool outgrows a spreadsheet, but for a lightweight internal page built on data you're already maintaining in Sheets, it's often the fastest path from "I wish people could just look this up" to a working link you can paste in Slack.
