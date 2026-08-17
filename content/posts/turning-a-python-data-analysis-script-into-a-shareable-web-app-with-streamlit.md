---
title: "Turning a Python Data Analysis Script into a Shareable Web App with Streamlit"
date: "2026-08-17"
tags: ["web-development", "python", "data-analysis"]
excerpt: "How to wrap a pandas analysis script in a Streamlit app so a stakeholder can explore the data themselves, without a full web dev background."
---

A finished analysis usually ends up as a script, a notebook, or a static chart in an email. All three have the same problem: the moment a stakeholder wants to filter by a different region or date range, they have to come back to you. Streamlit turns a normal Python script into an interactive web app with a handful of extra lines — no HTML, CSS, or JavaScript required — which makes it a genuinely useful entry point into web development for someone who already thinks in pandas.

**1. Start from a script you already trust.** Don't design the app first. Get the analysis working end-to-end as a plain `.py` file that reads data, transforms it, and prints or plots a result. Streamlit's job is to wrap an already-correct analysis in a UI, not to be where you debug the pandas logic.

**2. Swap print statements and static plots for Streamlit calls.** `st.write()` displays almost anything — text, a DataFrame, a chart object. `st.dataframe()` shows an interactive, sortable table instead of a flat printout. This first pass is usually a near-literal find-and-replace of your existing output calls.

**3. Add widgets for the inputs people actually want to change.** A dropdown (`st.selectbox`), a date range (`st.date_input`), or a slider (`st.slider`) replaces a hardcoded variable at the top of your script. Each widget returns its current value, so the rest of your analysis code reads from that variable instead of a fixed constant.

**4. Cache anything slow with `@st.cache_data`.** Without it, Streamlit re-runs your entire script top to bottom on every single interaction — including re-reading a CSV or re-querying a database every time someone moves a slider. Decorate your data-loading function and it only re-executes when its inputs actually change.

**5. Lay the page out with columns and a sidebar, not a single long scroll.** `st.sidebar` is the natural home for filters, keeping them visible while the user scrolls the results. `st.columns(n)` puts a few key metrics or charts side by side instead of stacked, which reads much closer to an actual dashboard.

**6. Run it locally before worrying about deployment.** `streamlit run app.py` opens the app in your browser immediately — that local loop is where you'll do almost all of your iteration, so get comfortable with it before touching hosting at all.

**7. Deploy with Streamlit Community Cloud for a free, shareable link.** Push the script and a `requirements.txt` to a GitHub repo, connect it at streamlit.io, and you get a public URL a stakeholder can open on their own — no local Python install, no "can you re-run this and send me a new screenshot" round trip.

The point isn't to become a web developer. It's that the gap between "I have an analysis" and "someone else can explore it themselves" used to require learning a frontend framework — now it's a few Streamlit function calls layered on code you already wrote.
