---
title: "GraphQL for Data Analysts: Querying Exactly the Fields You Need"
date: "2026-11-09"
tags: ["web-development", "apis", "beginner"]
excerpt: "How a GraphQL query lets you request only the fields you actually need from a single endpoint, instead of stitching together several REST calls or parsing bloated JSON."
---

A REST API usually hands back whatever fields the server decided to include — sometimes exactly what you need, sometimes a nested object with forty fields when you wanted three. GraphQL flips that: you describe the shape of the response you want, and the server sends back exactly that shape, nothing more.

**1. There's one endpoint, and every request is a POST.** Unlike REST, where each resource gets its own URL (`/users`, `/orders/42`), a GraphQL API exposes a single endpoint — often `/graphql`. What changes between requests isn't the URL, it's the *query* you send in the request body.

**2. The query's shape mirrors the response's shape.** This is the core idea: you write a query that looks like the JSON you want back, minus the values.

```graphql
query {
  orders(status: "SHIPPED", limit: 50) {
    id
    total
    customer {
      name
      country
    }
  }
}
```

Ask only for `id`, `total`, `customer.name`, and `customer.country`, and that's all that comes back — no shipping address, no internal notes field, no third nested object you'd otherwise have to ignore or strip out after the fact.

**3. This solves both over-fetching and under-fetching at once.** A REST endpoint for orders either returns too much (every field on the order, whether you need it or not) or too little (you need the customer's country, so now you're making a second call to `/customers/:id`). One GraphQL query can pull fields from related objects — orders and their customers — in a single round trip.

**4. Variables keep queries reusable, the same way parameters do in SQL.** Instead of string-building a new query for every status or date range, you declare variables once and pass values alongside the query:

```javascript
const query = `
  query OrdersByStatus($status: String!, $limit: Int) {
    orders(status: $status, limit: $limit) { id total }
  }
`;

const res = await fetch("https://api.example.com/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables: { status: "SHIPPED", limit: 50 } }),
});

const { data } = await res.json();
```

**5. You don't need a special library to try one out.** `fetch` with a JSON body is enough to get started, as the example above shows. Tools like Apollo Client or `graphql-request` add caching and convenience for larger apps, but for a one-off data pull into a notebook or a dashboard script, plain `fetch` is usually simpler.

**6. REST is still the better choice for simple, cacheable, public data.** If an API only has a handful of resources and you're grabbing whole objects anyway, REST's URL-based caching (by browsers, CDNs, proxies) is straightforward in a way GraphQL — where every request is a POST to the same URL — generally isn't without extra tooling. Reach for GraphQL when the data you need is spread across related objects and over-fetching would otherwise cost you bandwidth or parsing time.

Most public data APIs you'll run into as an analyst are still REST, but GraphQL shows up often enough — especially behind internal company APIs and some analytics platforms — that being able to read and write a basic query is worth having in your toolkit.
