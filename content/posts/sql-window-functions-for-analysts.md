---
title: "SQL Window Functions Every Data Analyst Should Know"
date: "2026-07-22"
tags: ["sql", "window-functions", "data-analysis"]
excerpt: "ROW_NUMBER, RANK, and running totals — the window functions that replace clunky self-joins and subqueries."
---

Before window functions, answering "what's each customer's most recent order?" meant a self-join or a correlated subquery. Window functions do it in one pass, without collapsing your rows into a `GROUP BY`.

**`ROW_NUMBER()`** — assigns a unique, sequential number within a group. This is the go-to for "give me just the latest row per customer" problems.

```sql
SELECT *
FROM (
  SELECT *,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn
  FROM orders
) t
WHERE rn = 1;
```

`PARTITION BY` is doing the same job `GROUP BY` would, except the rest of the row stays intact instead of collapsing into an aggregate.

**`RANK()` and `DENSE_RANK()`** — like `ROW_NUMBER()`, but ties get the same rank. `RANK()` leaves gaps after a tie (1, 1, 3); `DENSE_RANK()` doesn't (1, 1, 2). Use these for leaderboards or "top N per category" reports where ties are meaningful.

**Running totals and moving averages** — `SUM()` and `AVG()` work as window functions too, once you add `OVER`:

```sql
SELECT order_date, revenue,
  SUM(revenue) OVER (ORDER BY order_date) AS running_total
FROM daily_revenue;
```

No self-join, no subquery — just the same aggregate functions you already know, applied across a "window" of rows instead of collapsing them. This is usually the single biggest speed and readability upgrade an analyst gets from learning a few extra lines of SQL.
