---
title: "Invoice Processing Automation (Excel/VBA)"
tools: ["Excel", "VBA", "Power Query"]
result: "Cut weekly invoice reconciliation from ~6 hours of manual work to under 30 minutes"
excerpt: "An automated Excel workflow for a small logistics company that used to reconcile invoices by hand every week."
date: "2026-05-10"
---

## Problem

A small logistics company was reconciling supplier invoices against delivery records by hand
every week: copying numbers between spreadsheets, cross-checking line by line, and manually
flagging mismatches. It took whoever was on invoice duty roughly six hours a week, and it was
easy for a mismatched line to slip through unnoticed.

## Approach

- Built a Power Query pipeline that pulls in the weekly invoice and delivery-record exports and
  cleans/standardizes them automatically, removing the manual copy-paste step entirely.
- Wrote VBA macros to cross-check invoice lines against delivery records, flag mismatches, and
  generate a formatted summary sheet ready for review.
- Packaged everything into a single workbook with a one-click "Run reconciliation" button, so
  anyone on the team could run it — not just the person who built it.
- Added simple error-highlighting (color-coded flags) so mismatches were obvious at a glance
  instead of needing a line-by-line read-through.

## Result

Weekly reconciliation dropped from about six hours of manual work to under 30 minutes, freeing
up most of a workday every week. The automated mismatch flags also caught a handful of billing
discrepancies that had previously been going unnoticed under the manual process.

*This is a sample case study illustrating the type of work available — replace with a real
project write-up in `content/projects/` once you have one ready to share.*
