---
title: "Automatically Emailing an Excel Report Every Morning with Power Automate (No VBA Required)"
date: "2026-10-02"
tags: ["excel", "automation", "power-automate"]
excerpt: "How to use Power Automate to email a live Excel report on a schedule, without writing a macro or opening the file yourself."
---

Refreshing a report automatically is only half the distribution problem — someone still has to open the file and send it. Power Automate closes that last gap: once your Excel workbook lives in OneDrive or SharePoint, you can have it emailed out on a schedule without VBA, an Outlook rule, or you remembering to do it before 9am.

**1. Move the workbook to OneDrive or SharePoint first.** Power Automate's Excel connector only works against cloud-stored files, not anything on a local drive — if your report currently lives in a desktop folder, save a copy to OneDrive and point any Power Query refresh schedule at that copy.

**2. Start from a Scheduled Cloud Flow, not an Excel macro.** In Power Automate, choose *Create > Scheduled cloud flow*, set it to run daily at whatever hour the data is guaranteed to be refreshed (a few minutes after your Power Query scheduled refresh, if you have one), and skip weekends with a simple condition later in the flow rather than fighting with a complicated recurrence pattern.

**3. Pull live values into the flow with "List rows present in a table."** Add this Excel Online (Business) action, pointing it at the workbook and a named Excel Table, so the flow has the actual numbers to work with rather than just a static attachment — this is what lets the email body say something like "Revenue: $482,310" instead of just linking to a file.

**4. Export a clean PDF snapshot with an Office Script instead of attaching the raw workbook.** Recipients who don't have Excel, or who shouldn't be able to edit formulas, are better served by a PDF of just the relevant range. Write a short Office Script that exports a named range to PDF, then call it from the flow with the *Run script* action:

```typescript
function main(workbook: ExcelScript.Workbook) {
  const sheet = workbook.getWorksheet("Report");
  const range = sheet.getRange("A1:F20");
  range.getFormat().autofitColumns();
  // Power Automate's "Run script" action returns this worksheet
  // reference so the flow can convert it to PDF in the next step.
}
```

**5. Add a condition so the flow skips days with nothing to report.** Compare one of the values pulled in step 3 against a threshold — or just check the day of the week — before the *Send an email (V2)* action fires. A report that silently skips a quiet Saturday looks intentional; one that emails an empty table looks broken.

**6. Send through Outlook's connector, not a mailto link.** The *Send an email (V2)* action lets you build the subject and body dynamically from the values you pulled in step 3, attach the PDF from step 4, and add multiple recipients — all without anyone needing to be logged into Excel when the flow runs.

**7. Test with "Run" before trusting the schedule.** Power Automate lets you trigger a scheduled flow manually from its own page, which surfaces connector permission errors or a locked file immediately instead of at 7am when nobody's watching.

The payoff is that the report ships itself. Compared to a VBA macro that only runs if someone's machine is on, or a Power Query refresh that updates the file but still needs a human to hit send, a scheduled flow turns "send the morning numbers" from a task on your to-do list into something that just happens before you've had coffee.
