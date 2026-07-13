---
title: "Sales Performance Dashboard (Power BI)"
tools: ["Power BI", "DAX", "Power Query", "SQL Server"]
result: "Cut the monthly reporting cycle from ~3 days of manual work to a same-day, self-serve dashboard"
excerpt: "An interactive Power BI dashboard for a multi-store retail client, replacing manual spreadsheet reporting with live, drill-down reporting."
date: "2026-06-01"
---

## Problem

A retail client with 12 stores was compiling monthly sales reports by hand: each store manager
sent in a spreadsheet, and someone at head office spent 2-3 days copying, cleaning, and merging
them into a single leadership report. There was no easy way to compare stores, spot a slowing
category early, or drill into a single store's numbers without asking for a custom export.

## Approach

- Connected directly to the client's point-of-sale exports and built a Power Query pipeline to
  clean and load the data automatically instead of hand-merging spreadsheets.
- Modeled the data with a proper star schema (Sales, Stores, Products, Calendar) and wrote DAX
  measures for month-over-month, category-level, and year-to-date comparisons.
- Designed a Power BI dashboard with an executive summary page plus drill-through pages so each
  store manager could explore their own store's numbers without requesting a new report.
- Set up a scheduled refresh so the dashboard updates automatically every morning.

## Result

The monthly reporting cycle went from roughly three days of manual work to a dashboard that's
ready the same day, refreshed automatically overnight. Store managers now self-serve their own
numbers instead of emailing head office for a custom breakdown, and a slowing product category
was flagged two weeks earlier than it would have been caught in the old monthly report.

*This is a sample case study illustrating the type of work available — replace with a real
project write-up in `content/projects/` once you have one ready to share.*
