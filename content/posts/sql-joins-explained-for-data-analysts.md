---
title: "SQL JOINs Explained for Data Analysts (With Examples)"
date: "2026-07-21"
tags: ["sql", "data-analysis", "beginner"]
excerpt: "INNER, LEFT, and FULL joins explained with the actual questions each one answers."
---

Most SQL confusion isn't about syntax — it's about which join answers the question you're actually asking. Here's how to pick, using an `orders` and `customers` table as the running example.

**`INNER JOIN`** — only rows that match in both tables. Use this when the question requires both sides to exist, like "which customers have placed an order?"

```sql
SELECT c.name, o.order_id
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id;
```

**`LEFT JOIN`** — every row from the left table, plus matches from the right where they exist (otherwise `NULL`). This is the one analysts reach for most, because it answers "who's missing?" questions: "which customers have *never* ordered?"

```sql
SELECT c.name, o.order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
```

**`FULL OUTER JOIN`** — everything from both tables, matched where possible, `NULL` where not. Useful for reconciliation: comparing two systems' records to find what's in one but not the other. Note some databases (MySQL) don't support it directly — you'd emulate it with a `UNION` of a `LEFT` and `RIGHT` join.

**The habit worth building:** before writing the join, write down in plain English what a "missing" row on each side would mean. If you can't answer that, you'll pick the wrong join and quietly undercount or duplicate rows without any error being thrown.
