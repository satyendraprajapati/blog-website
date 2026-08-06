---
title: "Setting Up a Custom Domain on Vercel for Your Data Portfolio Blog"
date: "2026-08-06"
tags: ["web-development", "deployment", "dns"]
excerpt: "How to move a Vercel-hosted portfolio site off its free *.vercel.app subdomain and onto a domain you own, including the DNS records that actually make it work."
---

A `*.vercel.app` URL works fine and costs nothing, but a domain like `yourname.com` reads as a real site instead of a project someone deployed once. The move from one to the other is mostly DNS configuration, and it's easy to get half-done — pointed at Vercel but missing HTTPS, or working on the root domain but not `www`.

**1. Buy the domain somewhere, it doesn't need to be Vercel.** Vercel will sell you a domain directly from the dashboard, but any registrar works the same way — Namecheap, Google Domains, Cloudflare — since all you actually need from it is access to edit DNS records. Don't pay a premium for "Vercel domains" convenience unless you specifically want billing in one place.

**2. Add the domain in your Vercel project settings first.** Under your project's *Settings → Domains*, add the domain you bought. Vercel will show you the exact DNS records it needs — this is the step that tells you what to configure, rather than guessing generic values.

**3. Point the root domain with an A record, not a CNAME.** DNS doesn't allow a CNAME on a root/apex domain (`yourname.com` with nothing in front of it), so Vercel gives you an A record instead, typically pointing to `76.76.21.21`. Add that in your registrar's DNS settings under the `@` host:
```
Type: A
Host: @
Value: 76.76.21.21
```

**4. Point `www` with a CNAME to Vercel, not to the root domain.** For the `www` subdomain, add a CNAME record pointing at `cname.vercel-dns.com` rather than at your root domain — Vercel's dashboard will confirm the exact target to use, since it can change:
```
Type: CNAME
Host: www
Value: cname.vercel-dns.com
```

**5. Decide which one is canonical and redirect the other.** Having both `yourname.com` and `www.yourname.com` resolve to the same site but treated as two separate URLs splits your SEO signal and can duplicate content in search results. In Vercel's domain settings, set one as the primary domain — Vercel automatically redirects the other to it, so pick whichever you'll actually share (most personal sites use the bare root domain).

**6. Wait for propagation before assuming something's broken.** DNS changes can take anywhere from a few minutes to 48 hours to propagate globally, depending on your registrar and the TTL on the old records. Vercel's dashboard shows a pending/valid status per record — check that instead of repeatedly refreshing the site and concluding it's misconfigured.

**7. Confirm HTTPS is actually issued, not just DNS resolution.** Once DNS resolves correctly, Vercel automatically provisions a free SSL certificate for the domain — but this happens *after* DNS propagates, not simultaneously, so a domain that resolves but still shows a certificate warning usually just needs a few more minutes rather than a config change.

**8. Update every hardcoded reference to the old subdomain.** Your `sitemap.xml`, `rss.xml`, Open Graph tags, and any canonical URLs generated from a base URL constant will still point at the old `*.vercel.app` address until you update that constant and rebuild — check the feed generation script (`npm run generate-feeds`) and any SEO meta tag config for a hardcoded site URL.

Once DNS, redirects, and HTTPS are all confirmed, the `*.vercel.app` URL still works as a fallback — Vercel doesn't disable it, it's just no longer the address you hand out.
