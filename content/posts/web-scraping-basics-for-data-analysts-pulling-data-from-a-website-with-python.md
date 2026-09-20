---
title: "Web Scraping Basics for Data Analysts: Pulling Data From a Website With Python"
date: "2026-09-20"
tags: ["python", "web-scraping", "beginner"]
excerpt: "A practical first pass at pulling a table off a public webpage with requests and BeautifulSoup when there's no API or download button available."
---

Sometimes the data you need is sitting in plain sight on a webpage, with no "export to CSV" button and no API to call — a public leaderboard, a regulator's filings page, a table buried in a news article. Web scraping is the fallback for exactly that situation, and the basic version of it is a lot more approachable than it sounds.

**1. Check whether you actually need to scrape first.** Before writing any code, look for a "Download data" link, a documented API, or an RSS feed — all three save you from scraping and are more stable long-term, since a page's HTML can change on a redesign while a proper API rarely does. Also check the site's `robots.txt` and terms of service; scraping is fine for plenty of public data but not universally welcome, and some sites explicitly disallow it.

**2. Fetch the page with `requests`.** This gets you the raw HTML exactly as the server sends it, before any JavaScript runs — enough for a lot of simple, mostly-static pages.
```python
import requests

response = requests.get("https://example.com/leaderboard")
html = response.text
```

**3. Parse it with `BeautifulSoup` instead of regular expressions.** HTML's nesting makes it a poor fit for regex; a proper parser lets you navigate the page structure the way you'd navigate a dictionary.
```python
from bs4 import BeautifulSoup

soup = BeautifulSoup(html, "html.parser")
table = soup.find("table", {"id": "results"})
rows = table.find_all("tr")
```

**4. Pull data row by row into a list of dictionaries.** Working toward a `pandas` DataFrame from the start keeps the output usable immediately, instead of leaving you with loose text you have to clean up afterward.
```python
data = []
for row in rows[1:]:  # skip the header row
    cells = row.find_all("td")
    data.append({
        "rank": cells[0].text.strip(),
        "name": cells[1].text.strip(),
        "score": cells[2].text.strip(),
    })

import pandas as pd
df = pd.DataFrame(data)
```

**5. Watch for pages that load data with JavaScript instead of plain HTML.** If `requests.get()` returns a mostly-empty shell and the real numbers only appear once you view the page in a browser, the content is likely being loaded after the fact by JavaScript. That needs a tool that actually runs the page, like Selenium or Playwright, which is heavier but handles the same problem — it launches a real (or headless) browser, waits for the page to finish loading, and then hands you the fully rendered HTML.

**6. Be a polite, identifiable visitor.** Set a real `User-Agent` header, add a short delay between requests if you're pulling more than one page, and don't hammer a site with rapid-fire requests — the same courtesy that keeps you from getting blocked also keeps you from accidentally causing problems for a site that wasn't built to handle scraper-level traffic.

**7. Treat scraped data as messier than an API response.** Expect inconsistent whitespace, missing cells, and the occasional row that doesn't match the pattern you coded for — wrap the extraction in error handling, and always spot-check the resulting DataFrame against the live page before trusting it in an analysis.

Scraping is a last resort, not a first instinct — but knowing the basic `requests` + `BeautifulSoup` pattern means "there's no export button" stops being a dead end and becomes a small, solvable script.
